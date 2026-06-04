import React, { useState, useEffect } from 'react';
import { RunHistory } from '../types';
import { Award, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Language, UI_TRANSLATIONS } from '../translations';

interface LeaderboardProps {
  onClose?: () => void;
  lang: Language;
}

export default function Leaderboard({ onClose, lang }: LeaderboardProps) {
  const [history, setHistory] = useState<RunHistory[]>([]);
  const t = UI_TRANSLATIONS[lang];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('football_runner_scores');
      if (stored) {
        const parsed: RunHistory[] = JSON.parse(stored);
        // Sort highest score first, then highest level, then date
        parsed.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.level - a.level;
        });
        setHistory(parsed.slice(0, 10)); // Top 10
      }
    } catch (e) {
      console.error("Could not read scores from localStorage", e);
    }
  }, []);

  const clearHistory = () => {
    const confirmMessage = lang === 'tr'
      ? "Yüksek skorlarınızı temizlemek istediğinize emin misiniz? Bu işlem geri alınamaz."
      : lang === 'ar'
        ? "هل أنت متأكد أنك تريد مسح النتائج القياسية الخاصة بك؟ لا يمكن التراجع عن هذا الإجراء."
        : "Are you sure you want to clear your high scores? This cannot be undone.";

    if (confirm(confirmMessage)) {
      try {
        localStorage.removeItem('football_runner_scores');
        setHistory([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getHallOfFameLabel = () => {
    if (lang === 'tr') return "Şeref Kürsüsü";
    if (lang === 'ar') return "قاعة المشاهير";
    return "Hall of Fame";
  };

  const getClearLabel = () => {
    if (lang === 'tr') return "Temizle";
    if (lang === 'ar') return "مسح";
    return "Clear";
  };

  const getNoScoresLabel = () => {
    if (lang === 'tr') return "Henüz kaydedilmiş skor yok!";
    if (lang === 'ar') return "لم يتم تسجيل أي نتائج بعد!";
    return "No scores recorded yet!";
  };

  const getStartPlayingLabel = () => {
    if (lang === 'tr') return "Skorlarınızı kaydetmek için oynamaya başlayın.";
    if (lang === 'ar') return "ابدأ اللعب لتسجيل نتائجك.";
    return "Start playing to submit your records.";
  };

  const getAccuracyLabel = () => {
    if (lang === 'tr') return "Doğruluk";
    if (lang === 'ar') return "الدقة";
    return "Accuracy";
  };

  const getBackLabel = () => {
    if (lang === 'tr') return "Geri";
    if (lang === 'ar') return "الرجوع";
    return "Back";
  };

  return (
    <div id="leaderboard-panel" className="bg-white/95 border-4 border-yellow-400 p-6 flex flex-col h-full max-h-[500px] w-full text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl">
      <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-slate-100">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500 animate-pulse fill-yellow-100" />
          <h2 className="text-xl font-black tracking-wider uppercase font-sans text-blue-600">
            {getHallOfFameLabel()}
          </h2>
        </div>
        {history.length > 0 && (
          <button
            id="clear-leaderboard-btn"
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-red-200 rounded-lg hover:bg-red-50 active:bg-red-100 text-red-500 transition font-extrabold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {getClearLabel()}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-500">{getNoScoresLabel()}</p>
            <p className="text-xs text-slate-400 mt-1">{getStartPlayingLabel()}</p>
          </div>
        ) : (
          history.map((run, index) => {
            const accuracyVal = run.totalQuestions > 0 
              ? Math.round((run.correctAnswers / run.totalQuestions) * 100)
              : 0;
            const rankColors = [
              "bg-gradient-to-r from-yellow-300/25 to-yellow-100/10 border-yellow-400 text-yellow-850",
              "bg-gradient-to-r from-slate-200/40 to-slate-100/10 border-slate-300 text-slate-700",
              "bg-gradient-to-r from-orange-200/40 to-orange-100/10 border-orange-300 text-orange-800",
            ];
            const isTopRank = index < 3;
            
            return (
              <div
                id={`run-history-row-${index}`}
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl border transition duration-300 ${
                  isTopRank 
                    ? rankColors[index] 
                    : "bg-slate-50 border-slate-150 hover:border-slate-300"
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center font-black text-sm rounded-full ${
                  isTopRank ? "bg-white/90 border border-current shadow-sm" : "bg-slate-200 text-slate-700"
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base tracking-wide font-mono text-blue-600">
                      {run.score} Pts
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200/30">
                      Lvl {run.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-sans mt-1">
                    <span className="flex items-center gap-1 font-medium">
                      {getAccuracyLabel()}: <strong className="text-blue-600 font-extrabold">{accuracyVal}%</strong> ({run.correctAnswers}/{run.totalQuestions})
                    </span>
                    <span className="flex items-center gap-0.5 opacity-80 font-semibold">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(run.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {onClose && (
        <button
          id="close-leaderboard-btn"
          onClick={onClose}
          className="mt-4 py-2.5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl font-black text-sm tracking-wide text-blue-600 transition cursor-pointer"
        >
          {getBackLabel()}
        </button>
      )}
    </div>
  );
}
