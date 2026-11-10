import React from 'react';
import { Mic, MicOff, FileText, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface HeaderProps {
  isListening: boolean;
  audioLevel: number;
  lastTranscript: string;
  currentWordIndex: number;
  totalWords: number;
  isFullscreen: boolean;
  onToggleMic: () => void;
  onOpenScriptModal: () => void;
  onToggleFullscreen: () => void;
  selectedLang: 'fr' | 'en';
  onLangChange: (lang: 'fr' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isListening,
  audioLevel,
  lastTranscript,
  currentWordIndex,
  totalWords,
  isFullscreen,
  onToggleMic,
  onOpenScriptModal,
  onToggleFullscreen,
  selectedLang,
  onLangChange,
}) => {
  const progressPercent = totalWords > 0 
    ? Math.min(100, Math.round(((currentWordIndex + 1) / totalWords) * 100)) 
    : 0;

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 text-white select-none">
      {/* Brand & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-base">OpenVoiceScroll</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v1.0 Free
              </span>
            </div>
            <div className="text-xs text-zinc-400">Suivi vocal phonétique</div>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-2">
          <button
            onClick={() => onLangChange('fr')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              selectedLang === 'fr'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🇫🇷 FR
          </button>
          <button
            onClick={() => onLangChange('en')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              selectedLang === 'en'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      {/* Middle: Live Mic & Audio Level Feedback */}
      <div className="flex items-center gap-3 max-w-md w-full justify-center">
        <button
          onClick={onToggleMic}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-xs tracking-wide transition-all shadow-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          <span>{isListening ? 'Écoute active' : 'Micro inactif (Espace)'}</span>
        </button>

        {/* Audio VU-meter */}
        {isListening && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg">
            <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden flex items-center">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-75"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono w-6 text-right">{audioLevel}%</span>
          </div>
        )}

        {/* Live Recognized Token */}
        {lastTranscript && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full truncate max-w-xs">
            <span className="text-[10px] uppercase text-zinc-500">Heard:</span>
            <span className="italic truncate font-mono">"{lastTranscript}"</span>
          </div>
        )}
      </div>

      {/* Right: Progress & Actions */}
      <div className="flex items-center gap-3">
        {/* Progress */}
        <div className="hidden md:flex flex-col items-end text-xs">
          <span className="text-zinc-300 font-mono font-medium">
            {currentWordIndex + 1} / {totalWords} mots
          </span>
          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-amber-400 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Script Selector / Editor */}
        <button
          onClick={onOpenScriptModal}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200 transition-all"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Texte</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition-all"
          title="Plein écran (F11)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
