import React, { useState } from 'react';
import { X, Check, BookOpen } from 'lucide-react';
import { SAMPLE_SCRIPTS } from '../data/sampleScripts';
import type { ScriptPreset } from '../data/sampleScripts';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScriptText: string;
  onApplyScript: (text: string, lang?: 'fr' | 'en') => void;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({
  isOpen,
  onClose,
  currentScriptText,
  onApplyScript,
}) => {
  const [text, setText] = useState(currentScriptText);

  if (!isOpen) return null;

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / 130));

  const handleSelectPreset = (preset: ScriptPreset) => {
    setText(preset.text);
    onApplyScript(preset.text, preset.lang);
    onClose();
  };

  const handleApply = () => {
    onApplyScript(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-amber-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Éditeur de texte & Scripts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets selector */}
        <div className="py-3 flex items-center gap-2 border-b border-zinc-900 overflow-x-auto">
          <span className="text-xs text-zinc-500 font-medium">Modèles :</span>
          {SAMPLE_SCRIPTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all whitespace-nowrap"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex-1 py-4 flex flex-col min-h-[250px]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Collez ou rédigez votre discours ici..."
            className="w-full flex-1 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm leading-relaxed resize-none font-sans"
          />
        </div>

        {/* Footer info & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-zinc-200 font-mono">{wordCount}</strong> mots
            </span>
            <span>•</span>
            <span>
              ~<strong className="text-zinc-200 font-mono">{estimatedMinutes}</strong> min de parole
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Appliquer au prompteur</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
