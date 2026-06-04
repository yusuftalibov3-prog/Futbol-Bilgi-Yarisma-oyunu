import React from 'react';
import { X, Volume2, VolumeX, Globe } from 'lucide-react';
import { Language, UI_TRANSLATIONS } from '../translations';
import { audio } from '../audio';

interface SettingsModalProps {
  onClose: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isMuted: boolean;
  onMuteChange: (muted: boolean) => void;
}

export default function SettingsModal({
  onClose,
  lang,
  onLanguageChange,
  isMuted,
  onMuteChange,
}: SettingsModalProps) {
  const t = UI_TRANSLATIONS[lang];

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    onMuteChange(nextMuted);
    audio.setMuted(nextMuted);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        id="settings-modal-box"
        className="bg-white/95 border-4 border-yellow-400 rounded-3xl p-6 max-w-sm w-full relative text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col animate-fade-in-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h2 className="text-xl font-black uppercase text-blue-600 flex items-center gap-2">
            ⚽ {t.settings}
          </h2>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Muted Settings */}
        <div className="mb-5 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
          <label className="block text-xs font-sans tracking-wider font-extrabold text-slate-500 uppercase mb-2">
            {t.sound}
          </label>
          <button
            id="toggle-sound-settings-btn"
            onClick={handleMuteToggle}
            className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-between transition ${
              isMuted
                ? 'bg-red-50 text-red-650 border border-red-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
              <span className="font-extrabold">{t.sound}</span>
            </div>
            <span className="font-mono text-sm leading-none bg-white py-1 px-3.5 rounded-full shadow-sm text-slate-800 border">
              {isMuted ? t.soundOff : t.soundOn}
            </span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="mb-6 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
          <label className="block text-xs font-sans tracking-wider font-extrabold text-slate-500 uppercase mb-3 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-500" /> {t.language}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {languages.map((item) => (
              <button
                id={`lang-select-${item.code}`}
                key={item.code}
                onClick={() => onLanguageChange(item.code)}
                className={`py-3 px-4 rounded-xl font-bold flex items-center gap-3 border transition-all text-sm ${
                  lang === item.code
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.01]'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-lg leading-none">{item.flag}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {lang === item.code && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          id="save-close-settings-btn"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-705 font-black text-white text-sm tracking-wide uppercase transition hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-blue-500/10 cursor-pointer"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
