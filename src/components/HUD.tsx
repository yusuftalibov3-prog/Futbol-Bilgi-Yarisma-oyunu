import React from 'react';
import { Target, Zap, Flame, Activity, HelpCircle } from 'lucide-react';
import { Language, UI_TRANSLATIONS } from '../translations';

interface HUDProps {
  score: number;
  streak: number;
  lives: number;
  level: number;
  currentSpeed: number;
  baseSpeed: number;
  wrongPenaltyActive: boolean;
  progress: number; // 0 to 1
  currentQuestionText: string;
  isAwaitingChoice: boolean;
  lang: Language;
}

export default function HUD({
  score,
  streak,
  lives,
  level,
  currentSpeed,
  baseSpeed,
  wrongPenaltyActive,
  progress,
  currentQuestionText,
  isAwaitingChoice,
  lang,
}: HUDProps) {
  const maxLives = 3;
  const t = UI_TRANSLATIONS[lang];

  return (
    <div id="game-hud-overlay" className="absolute inset-0 pointer-events-none z-10 select-none">
      
      {/* 1. Top "PAUSED - AWAITING ANSWER" Banner */}
      {isAwaitingChoice && (
        <div id="paused-awaiting-banner" className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-600/90 border-2 border-white px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse z-40 text-white font-black tracking-widest text-[11px] uppercase flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          {t.pausedAwaiting}
        </div>
      )}

      {/* 2. Middle Question Card + Goal Progress Bar inside the Response Zone presentation */}
      <div id="central-question-mount" className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 pointer-events-auto flex flex-col items-center gap-3">
        <div className="w-full p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.5)] text-center">
          <div className="text-[10px] font-mono tracking-widest font-black text-cyan-300 uppercase mb-2 flex items-center justify-center gap-1.5">
            {t.incomingTrivia}
          </div>
          
          <p className="text-sm md:text-base font-black text-white leading-relaxed font-sans px-2 mb-3">
            {currentQuestionText || "Preparing next challenge..."}
          </p>

          {/* Goal Progress bar centered below question */}
          <div id="level-progress-meter" className="w-full flex items-center gap-2 px-1.5 py-1 bg-black/40 rounded-xl border border-white/10">
            <span className="text-[8px] font-sans tracking-wide font-black text-slate-300 uppercase whitespace-nowrap">
              {t.goalProgress}
            </span>
            <div className="flex-1 h-3.5 bg-white/20 rounded-full border border-white/30 p-[2px] overflow-hidden relative">
              <div
                id="progress-bar-fill"
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-yellow-300 font-mono whitespace-nowrap">
              {Math.min(100, Math.round(progress * 100))}%
            </span>
          </div>
        </div>

        {/* 3. Condensed unified UI cluster relocated to the green area (just below the goal progress) */}
        <div id="condensed-bottom-hud" className="flex items-center gap-3.5 px-4 py-2 bg-slate-950/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(34,211,238,0.25)] text-white text-[11px] whitespace-nowrap z-30 pointer-events-auto">
          
          {/* League Level Badge */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.lvl}</span>
            <span className="font-extrabold text-blue-400 text-xs">{level}</span>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2.5">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">{t.score}</span>
            <span className="font-mono font-black text-yellow-300 text-xs">
              {score.toString().padStart(3, '0')}
            </span>
          </div>

          {/* Streak Combo Indicator */}
          {streak > 0 ? (
            <div className="flex items-center gap-1 border-r border-white/10 pr-2.5 text-orange-400 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-400" />
              <span className="font-mono font-black text-xs">x{streak}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 border-r border-white/10 pr-2.5 text-slate-500">
              <Zap className="w-3 h-3 text-slate-500" />
              <span className="font-mono font-medium text-[10px]">x0</span>
            </div>
          )}

          {/* Lives/Strikes Hearts */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mr-0.5">{t.lives}</span>
            <div className="flex space-x-0.5">
              {Array.from({ length: maxLives }).map((_, i) => (
                <span id={`heart-micro-${i}`} key={i} className="text-xs filter drop-shadow">
                  {i < lives ? "❤️" : "🖤"}
                </span>
              ))}
            </div>
          </div>

          {/* Small Speed Indicator */}
          <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-white/10 text-slate-400">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="font-mono text-[10px] text-cyan-300">
              {Math.round(currentSpeed)} km/h
            </span>
          </div>
        </div>
      </div>

      {/* 4. Penalty Slowdown Banner / Wrong Portal Warning Overlay */}
      {wrongPenaltyActive && (
        <div id="slow-warning-strip" className="fixed top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 border border-white/40 px-5 py-2.5 rounded-xl shadow-2xl animate-bounce select-none pointer-events-none z-50 max-w-sm text-center">
          <div className="flex flex-col items-center gap-1">
            <p className="font-black text-xs text-white uppercase tracking-wider">
              {t.wrongSelection}
            </p>
            <p className="text-[10px] text-red-105 font-medium">
              {t.velocityRestricted}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
