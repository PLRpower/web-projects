import React, { useState } from 'react';
import type { CardDensity } from '../engine/aligner';
import { 
  RotateCcw, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon,
  Play,
  Pause,
  Mic,
  MicOff,
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
  containerWidth: number;
  setContainerWidth: (w: number) => void;
  theme: 'oled' | 'studio' | 'light';
  setTheme: (t: 'oled' | 'studio' | 'light') => void;
  displayMode: 'cards' | 'continuous';
  setDisplayMode: (m: 'cards' | 'continuous') => void;
  cardDensity: CardDensity;
  setCardDensity: (d: CardDensity) => void;
  sensitivity: 'strict' | 'normal' | 'tolerant';
  setSensitivity: (s: 'strict' | 'normal' | 'tolerant') => void;
  onResetCursor: () => void;
  autoScrollSpeed: number;
  setAutoScrollSpeed: (speed: number) => void;
  isAutoScrolling: boolean;
  setIsAutoScrolling: (active: boolean) => void;
  isListening: boolean;
  onToggleMic: () => void;
  audioLevel: number;
  selectedLang: 'fr' | 'en';
  onLangChange: (lang: 'fr' | 'en') => void;
  onOpenScriptModal: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  fontFamily: 'jakarta' | 'outfit' | 'system';
  setFontFamily: (f: 'jakarta' | 'outfit' | 'system') => void;
}

export const Controls: React.FC<ControlsProps> = ({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  containerWidth,
  setContainerWidth,
  theme,
  setTheme,
  displayMode,
  setDisplayMode,
  cardDensity,
  setCardDensity,
  sensitivity,
  setSensitivity,
  fontFamily,
  setFontFamily,
  onResetCursor,
  autoScrollSpeed,
  setAutoScrollSpeed,
  isAutoScrolling,
  setIsAutoScrolling,
  isListening,
  onToggleMic,
  audioLevel,
  selectedLang,
  onLangChange,
  onOpenScriptModal,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      {/* Main Clean Floating Top Dock */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 shadow-2xl text-white select-none">
        {/* Mic Toggle Button - Calm Studio Matte */}
        <button
          onClick={onToggleMic}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            isListening
              ? 'bg-zinc-800/90 text-zinc-100 border-emerald-500/30'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
          }`}
          title="Activer/Couper écoute micro (Espace)"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          {isListening ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5" />}
          <span>{isListening ? 'Écoute' : 'Micro off'}</span>
          {isListening && (
            <div className="w-7 h-1 bg-zinc-950 rounded-full overflow-hidden ml-0.5">
              <div 
                className="h-full bg-emerald-500/80 transition-all duration-75"
                style={{ width: `${audioLevel}%` }}
              />
            </div>
          )}
        </button>

        {/* Language Switch */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => onLangChange('fr')}
            className={`px-2 py-1 text-[11px] font-semibold rounded ${
              selectedLang === 'fr' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            FR
          </button>
          <button
            onClick={() => onLangChange('en')}
            className={`px-2 py-1 text-[11px] font-semibold rounded ${
              selectedLang === 'en' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        <div className="w-[1px] h-4 bg-zinc-800" />

        {/* Script / Text Editor */}
        <button
          onClick={onOpenScriptModal}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-all"
          title="Modifier le script"
        >
          <FileText className="w-4 h-4 text-amber-400" />
        </button>

        {/* Reset to Start */}
        <button
          onClick={onResetCursor}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-all"
          title="Revenir au début (Touche R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Display Mode Quick Toggle */}
        <button
          onClick={() => setDisplayMode(displayMode === 'cards' ? 'continuous' : 'cards')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
          title="Basculer entre cases par phrase et défilement continu"
        >
          <span>{displayMode === 'cards' ? '🗂️ Cases' : '📜 Continu'}</span>
        </button>

        <div className="w-[1px] h-4 bg-zinc-800" />

        {/* Settings Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 p-2 rounded-full text-xs font-medium transition-all ${
            isOpen ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800 text-zinc-300'
          }`}
          title="Réglages taille & police"
        >
          <Sliders className="w-4 h-4" />
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition-all"
          title="Plein écran (F11)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Settings Drawer - Drops down beneath top dock */}
      {isOpen && (
        <div className="mt-2.5 w-[480px] max-w-[94vw] p-5 rounded-2xl bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 shadow-2xl text-white text-xs select-none space-y-4 max-h-[82vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-semibold text-sm flex items-center gap-2 text-amber-400">
              <Sliders className="w-4 h-4" /> Réglages Téléprompteur
            </span>
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setTheme('oled')}
                className={`p-1.5 rounded-md transition-all ${
                  theme === 'oled' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
                title="OLED Noir absolu"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-all ${
                  theme === 'light' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
                title="Thème Clair"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Display Mode (Cards vs Continuous) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Mode d'affichage</span>
              <span className="font-medium text-amber-400">
                {displayMode === 'cards' ? 'Cases par phrase (Anticipé)' : 'Défilement continu'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setDisplayMode('cards')}
                className={`py-1.5 rounded-md text-center font-medium transition-all ${
                  displayMode === 'cards'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                🗂️ Cases par phrase
              </button>
              <button
                onClick={() => setDisplayMode('continuous')}
                className={`py-1.5 rounded-md text-center font-medium transition-all ${
                  displayMode === 'continuous'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                📜 Défilement continu
              </button>
            </div>
            <p className="text-[10px] text-zinc-500">
              {displayMode === 'cards'
                ? 'La case reste fixe et monte avec anticipation fluide sur les 2 derniers mots.'
                : 'Le texte glisse de manière continue mot par mot.'}
            </p>
          </div>

          {/* Card Density Setting (when in Card Mode) */}
          {displayMode === 'cards' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Taille des cases</span>
                <span className="font-medium text-amber-400">
                  {cardDensity === 'compact' ? 'Courtes (~11 mots)' : cardDensity === 'balanced' ? 'Équilibrées (~15 mots)' : 'Grandes (~20 mots)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setCardDensity('compact')}
                  className={`py-1.5 rounded-md text-center font-medium transition-all ${
                    cardDensity === 'compact'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  ⚡ Courtes
                </button>
                <button
                  onClick={() => setCardDensity('balanced')}
                  className={`py-1.5 rounded-md text-center font-medium transition-all ${
                    cardDensity === 'balanced'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  ⚖️ Équilibrées
                </button>
                <button
                  onClick={() => setCardDensity('spacious')}
                  className={`py-1.5 rounded-md text-center font-medium transition-all ${
                    cardDensity === 'spacious'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  📖 Grandes
                </button>
              </div>
              <p className="text-[10px] text-zinc-500">
                Répartition intelligente pour éliminer les phrases trop courtes et équilibrer le rythme de lecture.
              </p>
            </div>
          )}

          {/* Voice Detection Sensitivity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Sensibilité détection vocale</span>
              <span className="font-medium text-amber-400 capitalize">{sensitivity}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {(['strict', 'normal', 'tolerant'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSensitivity(mode)}
                  className={`py-1.5 rounded-md text-center font-medium transition-all ${
                    sensitivity === mode
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {mode === 'strict' ? '🎯 Strict' : mode === 'normal' ? '⚖️ Normal' : '🌊 Tolérant'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500">
              {sensitivity === 'strict'
                ? 'Anti-saut total pour micro sensible ou résonance.'
                : sensitivity === 'normal'
                ? 'Équilibre optimal fluidité et précision.'
                : 'Tolérance maximale aux mots coupés et accents prononcés.'}
            </p>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Typographie</span>
              <span className="font-medium text-amber-400">
                {fontFamily === 'jakarta' ? 'Plus Jakarta Sans' : fontFamily === 'outfit' ? 'Outfit' : 'Système'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setFontFamily('jakarta')}
                className={`py-1.5 rounded-md text-center font-medium transition-all ${
                  fontFamily === 'jakarta'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Jakarta (Élégant)
              </button>
              <button
                onClick={() => setFontFamily('outfit')}
                className={`py-1.5 rounded-md text-center font-medium transition-all ${
                  fontFamily === 'outfit'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Outfit (Moderne)
              </button>
              <button
                onClick={() => setFontFamily('system')}
                className={`py-1.5 rounded-md text-center font-medium transition-all ${
                  fontFamily === 'system'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Système
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Taille police</span>
              <span className="font-mono text-zinc-200">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={22}
              max={76}
              step={2}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Interligne</span>
              <span className="font-mono text-zinc-200">{lineHeight}x</span>
            </div>
            <input
              type="range"
              min={1.1}
              max={2.0}
              step={0.05}
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Container Width */}
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>Largeur colonne</span>
              <span className="font-mono text-zinc-200">{containerWidth}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={98}
              step={2}
              value={containerWidth}
              onChange={(e) => setContainerWidth(Number(e.target.value))}
              className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Auto-scroll Fallback (when pausing voice) */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-1">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Secours défilement fixe (WPM)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-zinc-200">
                  {autoScrollSpeed === 0 ? 'Désactivé' : `${autoScrollSpeed} wpm`}
                </span>
                <button
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className={`p-1 rounded ${
                    isAutoScrolling ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                  title={isAutoScrolling ? "Mettre en pause" : "Démarrer auto-scroll constant"}
                >
                  {isAutoScrolling ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={240}
              step={10}
              value={autoScrollSpeed}
              onChange={(e) => setAutoScrollSpeed(Number(e.target.value))}
              className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
