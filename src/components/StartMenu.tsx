import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Trophy, Play, Settings } from 'lucide-react';
import { audio } from '../audio';
import Leaderboard from './Leaderboard';
import { Language, UI_TRANSLATIONS } from '../translations';

interface StartMenuProps {
  onStartGame: (glowColor: string) => void;
  lang: Language;
  onOpenSettings: () => void;
}

export default function StartMenu({ onStartGame, lang, onOpenSettings }: StartMenuProps) {
  const [glowColor, setGlowColor] = useState('#22d3ee'); // Default Neon Cyan
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [highestScore, setHighestScore] = useState<number>(0);

  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    // Read the highest score to display on start menu
    try {
      const stored = localStorage.getItem('football_runner_scores');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const topScore = Math.max(...parsed.map((item: any) => item.score || 0));
          setHighestScore(topScore);
        }
      }
    } catch {}
  }, []);

  const handleStart = () => {
    // Ensure Web Audio API initialized from user click interaction
    audio.init();
    onStartGame(glowColor);
  };

  const colors = [
    { value: '#22d3ee', label: 'Cyan Glow', bg: 'bg-cyan-500', shadow: 'shadow-cyan-400/50' },
    { value: '#10b981', label: 'Striker Green', bg: 'bg-emerald-500', shadow: 'shadow-emerald-400/50' },
    { value: '#ef4444', label: 'Laser Red', bg: 'bg-rose-500', shadow: 'shadow-rose-400/50' },
    { value: '#a855f7', label: 'Cosmic Purple', bg: 'bg-purple-500', shadow: 'shadow-purple-400/50' },
  ];

  // Specific translated values for manual and details
  const getPersonalBestLabel = () => {
    if (lang === 'tr') return `KİŞİSEL EN İYİ: ${highestScore} SKOR`;
    if (lang === 'ar') return `أفضل نتيجة شخصية: ${highestScore} نقطة`;
    return `PERSONAL BEST: ${highestScore} PTS`;
  };

  const getSubBrandingLabel = () => {
    if (lang === 'tr') return "3B Futbol Bilgi Yarışı";
    if (lang === 'ar') return "رائد كرة القدم ثلاثي الأبعاد";
    return "3D Football Trivia Runner";
  };

  const getBrandingTitleLeft = () => {
    if (lang === 'tr') return "BİLGİ";
    if (lang === 'ar') return "رائد";
    return "TRIVIA";
  };

  const getBrandingTitleRight = () => {
    if (lang === 'tr') return "KOŞUCUSU";
    if (lang === 'ar') return "الأسئلة";
    return "RUNNER";
  };

  const getChooseColorLabel = () => {
    if (lang === 'tr') return "Sahada yarışmak için bir ışıklı iz stili seçin";
    if (lang === 'ar') return "اختر لون وهج المسار للركض في الملعب";
    return "Choose a trailing fire style to race on the pitch";
  };

  const getHowToPlayLabel = () => {
    if (lang === 'tr') return "Nasıl Oynanır";
    if (lang === 'ar') return "كيفية اللعب";
    return "How To Play";
  };

  const getLeaderboardLabel = () => {
    if (lang === 'tr') return "Şeref Kürsüsü";
    if (lang === 'ar') return "لوحة الشرف";
    return "Hall of Fame";
  };

  if (showLeaderboard) {
    return (
      <div id="leaderboard-wrap" className="flex items-center justify-center min-h-[460px] p-2">
        <Leaderboard onClose={() => setShowLeaderboard(false)} lang={lang} />
      </div>
    );
  }

  return (
    <div id="start-menu-card" className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-yellow-400 p-8 flex flex-col items-center max-w-md w-full relative z-20 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center transition-all duration-300">
      {/* Absolute top controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          id="audio-toggle-btn"
          onClick={onOpenSettings}
          className="p-2 border border-slate-200 hover:border-blue-500 rounded-xl bg-slate-100 hover:bg-blue-55 transition text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-sm"
          title={t.settings}
        >
          <Settings className="w-5 h-5 text-blue-600 animate-spin-slow hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main neon branding header */}
      <div id="header-neon-hub" className="mb-6 mt-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-blue-500 rounded-full bg-blue-50 text-blue-600 text-xs font-sans font-black tracking-wider uppercase mb-4 shadow">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          {getSubBrandingLabel()}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-red-650 uppercase font-sans select-none drop-shadow-sm leading-tight flex justify-center gap-2">
          <span>{getBrandingTitleLeft()}</span><span>{getBrandingTitleRight()}</span>
        </h1>
        {highestScore > 0 && (
          <div className="text-orange-500 font-sans text-xs font-black mt-3 tracking-wide flex items-center justify-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
            <Trophy className="w-3.5 h-3.5 fill-current text-orange-400" />
            {getPersonalBestLabel()}
          </div>
        )}
      </div>

      {/* Selector: Custom Neon Trail Glow */}
      <div id="cosmetic-picker" className="w-full mb-6 py-4.5 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-inner">
        <label className="block text-xs font-sans tracking-wider font-extrabold text-slate-500 uppercase mb-3 text-center/rtl">
          {t.selectColor}
        </label>
        <div className="flex justify-center gap-4">
          {colors.map((color) => (
            <button
              id={`color-glow-option-${color.value}`}
              key={color.value}
              onClick={() => setGlowColor(color.value)}
              className={`w-10 h-10 rounded-full transition-all duration-300 relative flex items-center justify-center ${color.bg} ${
                glowColor === color.value 
                  ? `scale-115 ring-4 ring-blue-500 ${color.shadow}` 
                  : 'scale-90 opacity-60 hover:opacity-100 hover:scale-100'
               }`}
            >
              {glowColor === color.value && (
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow" />
              )}
            </button>
          ))}
        </div>
        <div className="text-[11px] font-sans text-slate-500 mt-2.5 font-medium">
          {getChooseColorLabel()}
        </div>
      </div>

      {/* Action Buttons & Navigation */}
      <div id="menu-interactions" className="w-full flex flex-col gap-3.5 bg-transparent p-0 border-0 shadow-none">
        <button
          id="play-game-btn"
          onClick={handleStart}
          className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-black tracking-widest text-base md:text-lg uppercase text-white hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_10px_25px_rgba(239,68,68,0.3)] cursor-pointer flex items-center justify-center gap-2 group overflow-hidden"
        >
          {/* Subtle shine effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
          <Play className="w-5 h-5 fill-current text-white" />
          {t.startRunner}
        </button>

        <div className="grid grid-cols-2 gap-3 mt-1 bg-transparent p-0">
          <button
            id="open-tutorial-btn"
            onClick={() => setShowTutorial(!showTutorial)}
            className="flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl font-extrabold text-xs tracking-wider uppercase text-blue-600 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-blue-500" />
            {getHowToPlayLabel()}
          </button>

          <button
            id="open-leaderboard-btn"
            onClick={() => setShowLeaderboard(true)}
            className="flex items-center justify-center gap-2 py-3 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 rounded-xl font-extrabold text-xs tracking-wider uppercase text-indigo-600 transition cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-orange-500" />
            {getLeaderboardLabel()}
          </button>
        </div>
      </div>

      {/* Tutorial Box togglable */}
      {showTutorial && (
        <div id="tutorial-card" className="mt-5 w-full p-4 bg-slate-50 border-2 border-slate-200 text-left rounded-2xl text-slate-700 font-sans text-xs leading-relaxed space-y-2.5 animate-fade-in-down shadow-md">
          <h4 className="font-sans font-black text-blue-600 uppercase text-center tracking-wider mb-2 border-b-2 border-slate-150 pb-2.5 flex items-center justify-center gap-1.5 text-xs">
            ⚽ {lang === 'tr' ? 'TRIVIA RUNNER KILAVUZU' : lang === 'ar' ? 'دليل رائد الأسئلة' : 'TRIVIA RUNNER MANUAL'} ⚽
          </h4>
          <p>
            {lang === 'tr' 
              ? '🏃‍♂️ Oyuncunuz koşu kulvarında otomatik olarak sürekli ileri doğru koşar.' 
              : lang === 'ar' 
                ? '🏃‍♂️ يركض لاعبك تلقائيًا للأمام في مسار ثلاثي الأبعاد باستمرار.'
                : '🏃‍♂️ Your player runner sprints forward automatically down the 3D track track continuously.'}
          </p>
          <p>
            {lang === 'tr' 
              ? '👈 👉 Yönlendirme Kontrolü: Engellerden kaçmak veya cevapları hedeflemek için Sola veya Sağa gidin.' 
              : lang === 'ar' 
                ? '👈 👉 التحكم بالتوجيه: تحرك يسارًا أو يمينًا لتجنب العقبات أو اختيار الإجابات.'
                : '👈 👉 Steering Control: Move Left or Right to dodge barriers or line up answers.'}
          </p>
          <div className="bg-slate-200/55 p-2.5 rounded-lg border border-slate-300 font-sans font-medium text-[11px] text-slate-800 space-y-1">
            {lang === 'tr' ? (
              <>
                <div>• MOBİL: Sola veya sağa doğru sürükleyin.</div>
                <div>• MASAÜSTÜ: Fareyle tutup sürükleyin VEYA A/D ya da SOL/SAĞ ok tuşlarını kullanın.</div>
              </>
            ) : lang === 'ar' ? (
              <>
                <div>• الجوال: اسحب لليسار أو اليمين لتوجيه بطل اللعب.</div>
                <div>• الكمبيوتر: اسحب باستخدام الفأرة أو مفاتيح الحركة A/D أو الأسهم اليمين/اليسار.</div>
              </>
            ) : (
              <>
                <div>• MOBILE: Swipe or drag any region left/right.</div>
                <div>• DESKTOP: Hold & drag mouse OR use A/D or LEFT/RIGHT arrow keys.</div>
              </>
            )}
          </div>
          <p>
            {lang === 'tr'
              ? '❌ Geçitler: Yanıp sönen iki neon kapı futbol cevaplarını saklar. Skor kazanmak ve seviye hızını artırmak için doğru kapıdan geçin! Yanlış kapı bir hakkınızı eksiltir.'
              : lang === 'ar'
                ? '❌ البوابات: تظهر بوابتان نيونيّتان تحتويان على إجابات كروية. اعبر من البوابة المطابقة للسؤال المعروض لكسب النقاط والاندفاع للأمام! المرور عبر البوابة الخاطئة يقلل قلوبك.'
                : '❌ The Gates: Two neon gates appear containing football answers. Pass through the correct portal corresponding to the question floating overhead to score and accelerate! Passing the incorrect portal loses you a level heart.'}
          </p>
        </div>
      )}
    </div>
  );
}
