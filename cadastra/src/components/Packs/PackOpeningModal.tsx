import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import type { BoosterPackConfig, Parcel } from '../../types/cadastra';
import { ParcelCard } from '../Cards/ParcelCard';
import {
  Sparkles,
  Package,
  X,
  Zap,
  ChevronLeft,
  ChevronRight,
  Eye,
  Compass,
} from 'lucide-react';

interface PackOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  packs: BoosterPackConfig[];
  userEnergy: number;
  maxEnergy: number;
  inventoryCount: number;
  maxInventorySlots: number;
  onOpenPack: (pack: BoosterPackConfig) => Parcel[];
  onLocateParcel: (parcel: Parcel) => void;
  onActiveParcelChange?: (parcel: Parcel | null) => void;
}

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({
  isOpen,
  onClose,
  packs,
  userEnergy,
  maxEnergy,
  inventoryCount,
  maxInventorySlots,
  onOpenPack,
  onLocateParcel,
  onActiveParcelChange,
}) => {
  const [pulledParcels, setPulledParcels] = useState<Parcel[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const handleClose = () => {
    setPulledParcels([]);
    setActiveIdx(0);
    setRevealedIndices([]);
    onActiveParcelChange?.(null);
    onClose();
  };

  if (!isOpen) return null;

  const pack = packs[0];
  const hasEnoughEnergy = userEnergy >= pack.energyCost;
  const hasEnoughSlots = inventoryCount + pack.chunksCount <= maxInventorySlots;
  const canOpen = hasEnoughEnergy && hasEnoughSlots;

  const handleStartOpen = () => {
    try {
      const results = onOpenPack(pack);
      setPulledParcels(results);
      setActiveIdx(0);
      setRevealedIndices([0]); // Reveal first parcel immediately

      // Immediately fly map to parcel #1
      if (results.length > 0) {
        onLocateParcel(results[0]);
        onActiveParcelChange?.(results[0]);
      }

      // Check for Mythic or Epic to trigger celebratory confetti
      const hasMythic = results.some((p) => p.rarity === 'mythic');
      const hasEpic = results.some((p) => p.rarity === 'epic');

      setTimeout(() => {
        if (hasMythic) {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { x: 0.75, y: 0.5 },
            colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff'],
          });
        } else if (hasEpic) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { x: 0.75, y: 0.5 },
            colors: ['#a855f7', '#c084fc', '#e9d5ff'],
          });
        }
      }, 500);
    } catch (err: unknown) {
      alert((err as Error).message || 'Erreur lors du tirage');
    }
  };

  const handleSelectParcel = (idx: number) => {
    setActiveIdx(idx);
    if (!revealedIndices.includes(idx)) {
      setRevealedIndices((prev) => [...prev, idx]);
    }
    const target = pulledParcels[idx];
    if (target) {
      onLocateParcel(target);
      onActiveParcelChange?.(target);
    }
  };

  const handleRevealAll = () => {
    setRevealedIndices(pulledParcels.map((_, i) => i));
  };

  const activeParcel = pulledParcels[activeIdx];
  const isActiveRevealed = revealedIndices.includes(activeIdx);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={handleClose}
        className="sm:hidden fixed inset-0 top-14 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in"
      />

      {/* Right-Hand Booster Panel */}
      <div className="fixed top-14 right-0 bottom-0 w-full sm:w-[460px] md:w-[480px] z-40 bg-[#0a0c16]/95 backdrop-blur-2xl border-l border-white/10 flex flex-col shadow-2xl text-white animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="font-bold text-sm tracking-wide uppercase text-slate-200">
              {pulledParcels.length === 0 ? 'Boutique du Cadastre' : 'Booster Foncier Mondial'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Panel Body */}
        {pulledParcels.length === 0 ? (
          /* State 1: Booster Pack Ready to Open */
          <div className="flex-1 flex flex-col justify-between p-6 overflow-y-auto">
            <div className="text-center my-auto">
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {pack.badge} • 1 Charge
              </span>

              <div className="w-24 h-24 mx-auto my-6 rounded-3xl bg-gradient-to-br from-cyan-500/25 to-indigo-500/15 border border-cyan-500/40 flex items-center justify-center shadow-xl shadow-cyan-950/40 group hover:scale-105 transition-transform">
                <Package size={44} className="text-cyan-400 animate-pulse" />
              </div>

              <h3 className="font-black text-2xl tracking-tight">{pack.name}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
                Tirez 10 parcelles mondiales réelles certifiées H3. La carte interactive zoomera
                instantanément sur chaque parcelle découverte.
              </p>

              <div className="mt-5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 text-left space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Parcelles par booster</span>
                  <span className="font-mono font-bold text-cyan-400">10 parcelles</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Coût d'ouverture</span>
                  <span className="font-mono font-bold text-cyan-400">1 charge d'énergie</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Énergie disponible</span>
                  <span className="font-mono">{userEnergy}/{maxEnergy} charges</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Capacité inventaire</span>
                  <span className="font-mono">{inventoryCount}/{maxInventorySlots}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={handleStartOpen}
                disabled={!canOpen}
                className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xl ${
                  canOpen
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25 cursor-pointer hover:scale-[1.01]'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Zap size={16} className="fill-current" />
                <span>
                  {!hasEnoughSlots
                    ? 'Inventaire plein (300/300)'
                    : !hasEnoughEnergy
                    ? 'Énergie vide (1 charge requise)'
                    : 'Déchirer le Booster (1 Charge)'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* State 2: 10 Parcels Discovery with Interactive Map Sync */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Top Carousel Selector for 10 Parcels */}
            <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">
                  Parcelle {activeIdx + 1} sur {pulledParcels.length}
                </span>

                {revealedIndices.length < pulledParcels.length && (
                  <button
                    onClick={handleRevealAll}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Eye size={12} />
                    <span>Tout révéler</span>
                  </button>
                )}
              </div>

              {/* 10 Parcels Pills */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
                {pulledParcels.map((p, idx) => {
                  const isRev = revealedIndices.includes(idx);
                  const isCur = activeIdx === idx;
                  const statusClass = isCur
                    ? 'bg-cyan-500 text-black font-bold ring-2 ring-cyan-400/50 shadow-md shadow-cyan-500/30'
                    : isRev
                    ? 'bg-white/10 text-slate-200 hover:bg-white/20'
                    : 'bg-white/[0.03] text-slate-500 border border-dashed border-white/20 hover:border-cyan-500/50';
                  return (
                    <button
                      key={p.h3Index}
                      onClick={() => handleSelectParcel(idx)}
                      className={`flex-1 min-w-[34px] py-1.5 rounded-lg text-xs font-mono flex items-center justify-center transition-all ${statusClass}`}
                      title={`Parcelle #${idx + 1} (${p.locality}, ${p.country})`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Card Viewer */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeParcel?.h3Index || activeIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex justify-center"
                >
                  {!isActiveRevealed ? (
                    /* Face Down Suspense Card */
                    <div
                      onClick={() => handleSelectParcel(activeIdx)}
                      className="w-72 sm:w-80 h-[380px] rounded-2xl bg-gradient-to-br from-[#1b2038] via-[#111425] to-[#0a0c16] border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:scale-105 transition-all shadow-xl group"
                    >
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles size={24} className="text-cyan-400 animate-spin" />
                      </div>
                      <span className="mt-4 text-xs font-mono font-semibold tracking-wider text-cyan-300">
                        CLIQUER POUR RÉVÉLER
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono mt-1">
                        Parcelle #{activeIdx + 1}
                      </span>
                    </div>
                  ) : (
                    /* Revealed Parcel Card */
                    activeParcel && (
                      <div className="flex flex-col items-center">
                        <ParcelCard
                          parcel={activeParcel}
                          onLocate={() => {
                            onLocateParcel(activeParcel);
                            onActiveParcelChange?.(activeParcel);
                          }}
                        />

                        {/* Recentering button under card */}
                        <button
                          onClick={() => {
                            onLocateParcel(activeParcel);
                            onActiveParcelChange?.(activeParcel);
                          }}
                          className="mt-3 flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Compass size={13} />
                          <span>Re-centrer la caméra sur ce point</span>
                        </button>
                      </div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Stepper & Actions */}
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    handleSelectParcel((activeIdx - 1 + pulledParcels.length) % pulledParcels.length)
                  }
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  title="Parcelle précédente"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleSelectParcel((activeIdx + 1) % pulledParcels.length)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                  title="Parcelle suivante"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartOpen}
                  disabled={!canOpen}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    canOpen
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold'
                      : 'bg-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                  title="Consomme 1 charge pour tirer 10 nouvelles parcelles"
                >
                  <Zap size={13} />
                  <span>Nouveau booster</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition-colors"
                >
                  Terminer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
