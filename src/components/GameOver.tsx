import React, { useEffect, useState } from 'react';
import { Trophy, RefreshCw, Home, Star, Percent, Zap } from 'lucide-react';
import { RunHistory } from '../types';
import { Language, UI_TRANSLATIONS } from '../translations';

interface GameOverProps {
  score: number;
  level: number;
  correctAnswers: number;
  totalQuestions: number;
  maxCombo: number;
  distance: number;
  isVictory: boolean;
  onRestart: () => void;
  onHome: () => void;
  lang: Language;
}

export default function GameOver({
  score,
  level,
  correctAnswers,
  totalQuestions,
  maxCombo,
  distance,
  isVictory,
  onRestart,
  onHome,
  lang,
}: GameOverProps) {
  const [isHighScore, setIsHighScore] = useState(false);
  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    // Record current match records in local score logs
    try {
      const stored = localStorage.getItem('football_runner_scores');
      let parsed: RunHistory[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(parsed)) parsed = [];

      const currentRun: RunHistory = {
        score,
        level,
        correctAnswers,
        totalQuestions,
        maxCombo,
        distance,
        date: new Date().toISOString()
      };

      // Check if this run is a new record
      const highestPrev = parsed.length > 0 
        ? Math.max(...parsed.map(r => r.score)) 
        : 0;

      if (score > highestPrev && score > 0) {
        setIsHighScore(true);
      }

      parsed.push(currentRun);
      localStorage.setItem('football_runner_scores', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  }, [score, level, correctAnswers, totalQuestions, maxCombo, distance]);

  const accuracy = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  // Specific translated string variables for the game over screens
  const getStageTitle = () => {
    if (lang === 'tr') return isVictory ? 'Aşama Tamamlandı!' : 'Maç Bitti / Canlar Tükendi';
    if (lang === 'ar') return isVictory ? 'تم اجتياز المرحلة!' : 'انتهى الوقت / نفدت الأرواح';
    return isVictory ? 'Stage Cleared!' : 'Full Time / Strike Out';
  };

  const getStageSubtitle = () => {
    if (lang === 'tr') {
      return isVictory ? '🏆 TÜM LİGLERİN ŞAMPİYONU! 🏆' : 'TÜM YARDIM KALPLERİNİZ TÜKENDİ';
    }
    if (lang === 'ar') {
      return isVictory ? '🏆 بطل جميع الدوريات! 🏆' : 'لقد نفدت جميع قلوب اللعب الخاصة بك';
    }
    return isVictory ? '🏆 CHAMPION OF ALL LEAGUES! 🏆' : 'YOU RAN OUT OF SHIELD HEARTS';
  };

  const getNewBestLabel = () => {
    if (lang === 'tr') return 'Yeni En İyi Skor!';
    if (lang === 'ar') return 'رقم قياسي جديد!';
    return 'New Personal Best!';
  };

  const getMaxLvlLabel = () => {
    if (lang === 'tr') return 'Ulaşılan en yüksek seviye:';
    if (lang === 'ar') return 'أعلى مستوى تم الوصول إليه:';
    return 'Max level attained:';
  };

  const getLvlValueLabel = () => {
    if (lang === 'tr') return `Seviye ${level}`;
    if (lang === 'ar') return `المستوى ${level}`;
    return `Level ${level}`;
  };

  const getAccuracyLabel = () => {
    if (lang === 'tr') return `${t.accuracyRate}:`;
    if (lang === 'ar') return `نسبة الدقة:`;
    return 'Accuracy Rate:';
  };

  const getComboValueLabel = () => {
    if (lang === 'tr') return `${maxCombo}x seri`;
    if (lang === 'ar') return `متتالية ${maxCombo}x`;
    return `${maxCombo}x combo`;
  };

  const getReplayLabel = () => {
    if (lang === 'tr') return 'YENİDEN KOŞU';
    if (lang === 'ar') return 'إعادة اللعب';
    return 'Replay';
  };

  const getLobbyLabel = () => {
    if (lang === 'tr') return 'Lobi';
    if (lang === 'ar') return 'القائمة الرئيسية';
    return 'Lobby';
  };

  return (
    <div id="game-over-overlay" className="bg-white/95 border-4 border-yellow-400 rounded-3xl p-8 max-w-md w-full relative z-20 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center animate-fade-in-up">
      {/* Decorative top icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 shadow-sm ${
        isVictory 
          ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-emerald-500/10'
          : 'bg-red-50 border-red-500 text-red-500 shadow-red-500/10'
      }`}>
        {isVictory ? (
          <Trophy className="w-8 h-8 animate-bounce" />
        ) : (
          <Star className="w-8 h-8" />
        )}
      </div>

      {/* Main conclusion banner */}
      <div id="game-conclusion-marquee" className="mb-6">
        <h2 className={`text-2xl md:text-3xl font-black tracking-tight uppercase ${
          isVictory ? 'text-emerald-600' : 'text-red-500'
        }`}>
          {getStageTitle()}
        </h2>
        <p className="text-slate-500 text-xs font-sans font-black tracking-wider mt-1.5 leading-none">
          {getStageSubtitle()}
        </p>

        {isHighScore && (
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-black rounded-full text-xs font-sans uppercase tracking-wide animate-pulse">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            {getNewBestLabel()}
          </div>
        )}
      </div>

      {/* High impact score display */}
      <div id="game-over-score-card" className="w-full bg-slate-55 border-2 border-slate-105 rounded-2xl py-4 flex flex-col items-center justify-center mb-6 shadow-inner">
        <div className="text-slate-400 text-[10px] font-sans font-black tracking-widest uppercase">
          {t.finalScore}
        </div>
        <div className="text-4xl font-black text-blue-600 tracking-wider font-mono mt-1">
          {score} <span className="text-lg font-black text-blue-400 font-sans">PTS</span>
        </div>
      </div>

      {/* Secondary statistical details list */}
      <div id="game-over-run-details" className="w-full space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl mb-8 text-sm font-sans">
        <div className="flex justify-between items-center px-3 py-2 border-b border-slate-200/50">
          <span className="text-slate-500 text-xs font-bold">{getMaxLvlLabel()}</span>
          <span className="font-extrabold text-blue-600">{getLvlValueLabel()}</span>
        </div>
        
        <div className="flex justify-between items-center px-3 py-2 border-b border-slate-200/50">
          <span className="text-slate-500 text-xs font-bold flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-indigo-500" /> {getAccuracyLabel()}
          </span>
          <span className="font-mono font-bold text-indigo-600">
            {accuracy}% ({correctAnswers}/{totalQuestions})
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border-b border-slate-200/50">
          <span className="text-slate-500 text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-500" /> {t.maxCombo}:
          </span>
          <span className="font-mono font-bold text-orange-600">
            {getComboValueLabel()}
          </span>
        </div>

        <div className="flex justify-between items-center px-3 py-1.5">
          <span className="text-slate-500 text-xs font-bold">{t.distanceTraveled}:</span>
          <span className="font-mono font-bold text-emerald-600">
            {Math.round(distance)}m
          </span>
        </div>
      </div>

      {/* Interaction Footer Controls */}
      <div id="game-over-navigation" className="w-full flex gap-3 bg-transparent p-0 border-0 shadow-none">
        <button
          id="play-again-btn"
          onClick={onRestart}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-450 via-orange-500 to-red-500 font-black text-white tracking-widest uppercase text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_5px_15px_rgba(239,68,68,0.2)]"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow text-white" />
          {getReplayLabel()}
        </button>

        <button
          id="main-menu-btn"
          onClick={onHome}
          className="flex-1 py-3.5 border-2 border-blue-200 rounded-2xl bg-blue-55 hover:bg-blue-100 font-black text-blue-600 text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          {getLobbyLabel()}
        </button>
      </div>
    </div>
  );
}
