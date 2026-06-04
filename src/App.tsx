import React, { useState, useEffect, useRef, Suspense } from 'react';
import { GameGate, GameStatus, Particle, Player } from './types';
import { getQuestionsByLevel } from './data';
import { audio } from './audio';
import StartMenu from './components/StartMenu';
import HUD from './components/HUD';
import GameOver from './components/GameOver';
import SettingsModal from './components/SettingsModal';
import { Sparkles, Award, Settings } from 'lucide-react';
import { Language, translateQuestion } from './translations';

const GameCanvas = React.lazy(() => import('./components/GameCanvas'));

export default function App() {
  const [status, setStatus] = useState<GameStatus>('MENU');
  const [activeGlowColor, setActiveGlowColor] = useState('#22d3ee');
  
  // Settings & Localization States
  const [lang, setLang] = useState<Language>('tr');
  const [audioMuted, setAudioMuted] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Scoring & Stats State
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);

  // Level Up Animation Popups
  const [showLevelUpText, setShowLevelUpText] = useState(false);

  // Obstacle/Gate Penalty States
  const [wrongPenaltyActive, setWrongPenaltyActive] = useState(false);
  const penaltyTimerRef = useRef<number>(0);
  const hasTransitionedRef = useRef<boolean>(false);

  // Player Entity State
  const [player, setPlayer] = useState<Player>({
    x: 0,
    targetX: 0,
    z: 10,
    speed: 38, // Cruising preview speed for menu screensaver
    baseSpeed: 38,
    color: '#22d3ee',
  });

  // Dynamic Array States
  const [gates, setGates] = useState<GameGate[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Track coordinates and active questions list
  const nextSpawnZRef = useRef<number>(200);

  // Active question header text to show inside HUD
  const [currentQuestionText, setCurrentQuestionText] = useState("Preparing next challenge...");

  // Spawns starburst particles with custom speeds and life decay
  const createBurstParticles = (x: number, y: number, z: number, color: string, count: number) => {
    const fresh: Particle[] = [];
    for (let i = 0; i < count; i++) {
      fresh.push({
        x: x + (Math.random() - 0.5) * 0.4,
        y: y + (Math.random() - 0.5) * 0.4,
        z: z + (Math.random() - 0.5) * 2,
        vx: (Math.random() - 0.5) * 4.8,
        vy: (Math.random() - 0.2) * 5.2,
        vz: (Math.random() - 0.5) * 4.8,
        color,
        size: Math.random() * 8 + 6,
        life: 0.9,
        maxLife: 0.9
      });
    }
    setParticles(prev => [...prev, ...fresh]);
  };

  // Seed dynamic gate at certain Z tracking values
  const generateGate = (zTarget: number, currentLevel: number): GameGate => {
    const questionOptions = getQuestionsByLevel(currentLevel);
    
    // Choose a valid question out of bank
    const randomIndex = Math.floor(Math.random() * questionOptions.length);
    const selectedQuestion = questionOptions[randomIndex];

    return {
      id: `gate_${Date.now()}_${Math.random()}`,
      z: zTarget,
      question: selectedQuestion,
      leftOption: selectedQuestion.options.left,
      rightOption: selectedQuestion.options.right,
      correctOption: selectedQuestion.correctOption,
      answered: false,
      chosenSide: null,
      isCorrect: null,
    };
  };

  // Re-seed questions and gates upon starting a fresh session
  const initializeGameRun = (selectedColor: string) => {
    setScore(0);
    setStreak(0);
    setMaxCombo(0);
    setLives(3);
    setLevel(1);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setDistanceTraveled(0);
    setWrongPenaltyActive(false);
    setShowLevelUpText(false);

    const initialSpeed = 65; // Level 1 start speed

    setPlayer({
      x: 0,
      targetX: 0,
      z: 10,
      speed: initialSpeed,
      baseSpeed: initialSpeed,
      color: selectedColor,
    });

    // Populate initial gates
    const initialGates: GameGate[] = [];
    let startZ = 130;
    for (let i = 0; i < 3; i++) {
       initialGates.push(generateGate(startZ, 1));
       startZ += 200; // Match Level 1 spacing
    }

    nextSpawnZRef.current = startZ;
    setGates(initialGates);
    setParticles([]);
    setActiveGlowColor(selectedColor);

    if (initialGates[0]) {
      setCurrentQuestionText(initialGates[0].question.question);
    }

    setStatus('PLAYING');

    // Trigger Synth Loop
    audio.startBackgroundMusic();
  };

  // Steers character's current horizontal lane position (X coordinates: -1.8 to 1.8)
  const handlePlayerMove = (newX: number) => {
    const closestGate = gates.find(g => !g.answered);
    const isAwaiting = status === 'PLAYING' && closestGate && player.z >= (closestGate.z - 45);

    if (isAwaiting) {
      // Swiping horizontal in Response Zone allows selecting answer A/left or B/right
      if (newX < -0.4) {
        handleSelectAnswer('left');
      } else if (newX > 0.4) {
        handleSelectAnswer('right');
      } else {
        setPlayer(prev => ({
          ...prev,
          x: newX,
        }));
      }
    } else {
      setPlayer(prev => ({
        ...prev,
        x: newX,
      }));
    }
  };

  const handleSelectAnswer = (side: 'left' | 'right') => {
    const closestGate = gates.find(g => !g.answered);
    if (!closestGate) return;

    const isCorrectSide = side === closestGate.correctOption;
    const portalExplosionX = side === 'left' ? -0.8 : 0.8;

    // Reposition player onto chosen lane, and resume moving
    setPlayer(prev => ({
      ...prev,
      x: side === 'left' ? -1.0 : 1.0,
      z: closestGate.z + 5, // skip past the gate
      speed: prev.baseSpeed,
    }));

    hasTransitionedRef.current = false; // Reset for next gates

    setGates(prev => {
      return prev.map(g => {
        if (g.id === closestGate.id) {
          return {
            ...g,
            answered: true,
            chosenSide: side,
            isCorrect: isCorrectSide,
          };
        }
        return g;
      });
    });

    setTotalQuestions(prev => prev + 1);

    if (isCorrectSide) {
      audio.playCorrect();
      const scoreGain = 100 * (streak + 1);
      setScore(prev => prev + scoreGain);
      setCorrectAnswers(prev => prev + 1);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxCombo(prev => Math.max(prev, nextStreak));

      createBurstParticles(portalExplosionX, 0.45, closestGate.z, '#10b981', 35);
    } else {
      audio.playWrong();
      setStreak(0);

      const nextLives = lives - 1;
      setLives(nextLives);

      createBurstParticles(portalExplosionX, 0.45, closestGate.z, '#ef4444', 35);
      
      setWrongPenaltyActive(true);
      penaltyTimerRef.current = 1.6;

      if (nextLives <= 0) {
        audio.stopBackgroundMusic();
        audio.playGameOver();
        setStatus('GAMEOVER');
      }
    }
  };

  // Evaluate collisions and update player states triggered in continuous tick updates
  const handleUpdateGameStatus = (dt: number) => {
    // 1. Decelerate wrong-penalty timer if active
    if (wrongPenaltyActive) {
      penaltyTimerRef.current -= dt;
      if (penaltyTimerRef.current <= 0) {
        setWrongPenaltyActive(false);
        // Restore running velocity
        setPlayer(prev => ({
          ...prev,
          speed: prev.baseSpeed,
        }));
      }
    }

    const closestUnansweredGate = gates.find(g => !g.answered);
    const isAwaitingChoice = status === 'PLAYING' && closestUnansweredGate && player.z >= (closestUnansweredGate.z - 45);

    // If awaiting choice, reset user to track center instantly once to stand still and prevent instant option drift
    if (isAwaitingChoice && !hasTransitionedRef.current) {
      setPlayer(prev => ({ ...prev, x: 0 }));
      hasTransitionedRef.current = true;
    }

    // 2. Continuous forward progress coordinates
    setPlayer(prev => {
      if (isAwaitingChoice) {
        return {
          ...prev,
          speed: 0,
        };
      }
      const targetSpeed = wrongPenaltyActive ? prev.baseSpeed * 0.45 : prev.baseSpeed;
      // Smoothly interpolate current speed for gradual acceleration overrides
      const currentSpeed = prev.speed + (targetSpeed - prev.speed) * 8 * dt;
      return {
        ...prev,
        z: prev.z + currentSpeed * dt,
        speed: currentSpeed,
      };
    });

    // Sync distance display metric
    setDistanceTraveled(player.z);

    // 3. Keep particles system updated (gravity and friction decays)
    setParticles(prev => 
      prev.map(p => ({
        ...p,
        x: p.x + p.vx * dt,
        y: p.y + p.vy * dt,
        z: p.z + p.vz * dt,
        vy: p.vy - 5 * dt, // Gravity pull
        life: p.life - dt,
      })).filter(p => p.life > 0)
    );

    // 4. Update incoming questions marquee bar
    const closestUnanswered = gates.find(g => !g.answered && g.z > player.z + 10);
    if (closestUnanswered) {
      setCurrentQuestionText(closestUnanswered.question.question);
    }

    // 5. Check if user reaches level limits
    const levelMaxDistance = level === 1 ? 1000 : level === 2 ? 2200 : 3500;

    if (player.z >= levelMaxDistance) {
      if (level === 3) {
        // Ultimate Victory reached!
        audio.stopBackgroundMusic();
        audio.playLevelUp();
        setStatus('VICTORY');
        return;
      } else {
        // Multiplier progression
        const nextLevel = level + 1;
        setLevel(nextLevel);

        // Slow acceleration increases
        const newBaseSpeed = nextLevel === 2 ? 80 : 96;
        setPlayer(prev => ({
          ...prev,
          baseSpeed: newBaseSpeed,
          speed: newBaseSpeed,
        }));

        // Trigger flashy League Level up splash banner
        audio.playLevelUp();
        setShowLevelUpText(true);
        setTimeout(() => setShowLevelUpText(false), 2400);

        // Flush and seed new set of themed portals for next league difficulty
        nextSpawnZRef.current = Math.floor(player.z + 180);
        const nextGatesList: GameGate[] = [];
        const spacing = nextLevel === 2 ? 165 : 135;
        let startZ = nextSpawnZRef.current;
        for (let i = 0; i < 3; i++) {
          nextGatesList.push(generateGate(startZ, nextLevel));
          startZ += spacing;
        }
        nextSpawnZRef.current = startZ;
        setGates(nextGatesList);
        return;
      }
    }

    // 6. Dynamic Endless portal append (ensure we always have 3 gates in front)
    const gatesInFrontCount = gates.filter(g => g.z > player.z).length;
    if (gatesInFrontCount < 3) {
      const spacing = level === 1 ? 200 : level === 2 ? 165 : 135;
      const nextGateZ = Math.max(nextSpawnZRef.current, player.z + 180);
      const newGate = generateGate(nextGateZ, level);
      
      setGates(prev => [...prev, newGate]);
      nextSpawnZRef.current = nextGateZ + spacing;
    }
  };

  const currentLevelProgress = () => {
    // Range dividers:
    // Level 1: 0 -> 1000m
    // Level 2: 1000 -> 2200m
    // Level 3: 2200 -> 3500m
    const z = player.z;
    if (level === 1) return z / 1000;
    if (level === 2) return (z - 1000) / 1200;
    return (z - 2200) / 1300;
  };

  const handleReturnToLobby = () => {
    audio.stopBackgroundMusic();
    setStatus('MENU');
    setGates([]);
    setParticles([]);
    setPlayer(prev => ({
      ...prev,
      z: 10,
      speed: 38,
      baseSpeed: 38,
    }));
  };

  const closestUnansweredGate = gates.find(g => !g.answered);
  const isAwaitingChoice = status === 'PLAYING' && closestUnansweredGate !== undefined && player.z >= (closestUnansweredGate.z - 45);

  // Translate the current active gate's question string
  const localizedQuestionText = closestUnansweredGate
    ? translateQuestion(
        closestUnansweredGate.question.id,
        lang,
        closestUnansweredGate.question.question,
        closestUnansweredGate.leftOption,
        closestUnansweredGate.rightOption
      ).question
    : (lang === 'tr' ? 'Sıradaki soru hazırlanıyor...' : lang === 'ar' ? 'جاري تحضير التحدي القادم...' : 'Preparing next challenge...');

  return (
    <div id="applet-viewport" className="w-screen h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 font-sans select-none">
      
      {/* 2.5 Floating Settings Controls Button */}
      <button
        id="top-settings-toggle-btn"
        onClick={() => setShowSettingsModal(true)}
        className="absolute top-4 right-4 z-40 p-2.5 bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white rounded-full transition shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto flex items-center justify-center"
        title="Settings"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>

      {/* 1. Underlying continuous 3D Web Canvas Engine */}
      <div id="three-ambient-host" className="absolute inset-0 z-0">
        <iframe
          style={{ display: 'none' }}
          title="sound-initializer"
        />
        <React.Suspense fallback={<div className="bg-slate-900 w-full h-full animate-pulse" />}>
          <GameCanvas
            player={player}
            gates={gates}
            particles={particles}
            onPlayerMove={handlePlayerMove}
            onUpdateGameStatus={handleUpdateGameStatus}
            isPaused={status !== 'PLAYING'}
            activeGlowColor={activeGlowColor}
            isAwaitingChoice={isAwaitingChoice}
            onSelectAnswer={handleSelectAnswer}
            lang={lang}
          />
        </React.Suspense>
      </div>

      {/* 2. Interactive Menu Lobbies overlay */}
      {status === 'MENU' && (
        <div id="launcher-menu-shadow" className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-4 animate-fade-in-up">
           <StartMenu 
             onStartGame={initializeGameRun} 
             lang={lang}
             onOpenSettings={() => setShowSettingsModal(true)}
           />
        </div>
      )}

      {/* 3. In-Game Metrics HUD overlay */}
      {status === 'PLAYING' && (
        <React.Suspense fallback={null}>
          <HUD
            score={score}
            streak={streak}
            lives={lives}
            level={level}
            currentSpeed={player.speed}
            baseSpeed={player.baseSpeed}
            wrongPenaltyActive={wrongPenaltyActive}
            progress={currentLevelProgress()}
            currentQuestionText={localizedQuestionText}
            isAwaitingChoice={isAwaitingChoice}
            lang={lang}
          />
        </React.Suspense>
      )}

      {/* 4. Game Over Stat Summaries overlay */}
      {(status === 'GAMEOVER' || status === 'VICTORY') && (
        <div id="gameover-modal-layout" className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-4">
          <GameOver
            score={score}
            level={level}
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
            maxCombo={maxCombo}
            distance={distanceTraveled}
            isVictory={status === 'VICTORY'}
            onRestart={() => initializeGameRun(activeGlowColor)}
            onHome={handleReturnToLobby}
            lang={lang}
          />
        </div>
      )}

      {/* 5. Settings Configuration overlay Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          lang={lang}
          onLanguageChange={(newLang) => setLang(newLang)}
          isMuted={audioMuted}
          onMuteChange={(muted) => setAudioMuted(muted)}
        />
      )}

      {/* Dynamic League level up splash center text popups */}
      {showLevelUpText && (
        <div id="league-up-splash" className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 pointer-events-none animate-pulse">
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div className="p-6 bg-white border-4 border-yellow-400 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform scale-110">
              <Award className="w-12 h-12 text-yellow-500 mx-auto animate-bounce mb-2 fill-yellow-100" />
              <h3 className="text-2xl md:text-3xl font-black italic tracking-widest text-blue-600 uppercase leading-none">
                {lang === 'tr' ? 'LİG YÜKSELDİ!' : lang === 'ar' ? 'ارتفاع درجة الدوري!' : 'LEAGUE UPGRADED!'}
              </h3>
              <p className="font-sans text-xs text-slate-500 font-extrabold uppercase mt-2.5">
                {lang === 'tr' 
                  ? 'Hız Artırıldı • Kapı Aralıkları Sıkıştırıldı!' 
                  : lang === 'ar' 
                    ? 'زيادة السرعة • تقليص مسافات البوابات!'
                    : 'Velocity Boosted • Gates Spacing Compressed!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
