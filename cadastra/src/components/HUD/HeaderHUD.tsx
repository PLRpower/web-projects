import React from 'react';
import type { UserProfile } from '../../types/cadastra';
import { TOTAL_WORLD_CHUNKS } from '../../store/gameStore';
import { Package, ShoppingBag, Layers, Coins, Hexagon, Globe2, Zap, Clock } from 'lucide-react';

interface HeaderHUDProps {
  user: UserProfile;
  globalCounter: number;
  secondsToNextEnergy: number;
  maxInventoryParcels: number;
  onOpenBoosters: () => void;
  onOpenMarket: () => void;
  onOpenInventory: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  user,
  globalCounter,
  secondsToNextEnergy,
  maxInventoryParcels,
  onOpenBoosters,
  onOpenMarket,
  onOpenInventory,
}) => {
  const percentageClaimed = ((globalCounter / TOTAL_WORLD_CHUNKS) * 100).toFixed(6);

  // Format countdown mm:ss
  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds <= 0) return 'Pleine';
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-2.5 bg-[#08090f]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between">
      {/* Brand & Concept */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Hexagon size={18} className="text-white fill-white/20" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-wider text-white">CADASTRA</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              STOCK FINI
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
            Cadastre Mondial H3 (r8)
          </p>
        </div>
      </div>

      {/* Global Finitude Counter (Centerpiece) */}
      <div className="hidden lg:flex flex-col items-center bg-white/[0.03] px-4 py-1.5 rounded-xl border border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          <Globe2 size={13} className="text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
          <span className="text-white font-bold">{globalCounter.toLocaleString()}</span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">{TOTAL_WORLD_CHUNKS.toLocaleString()}</span>
          <span className="text-slate-400">tuiles</span>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all"
            style={{ width: `${Math.max(0.5, Number(percentageClaimed) * 1000)}%` }}
          />
        </div>
      </div>

      {/* Player Stats & Actions */}
      <div className="flex items-center gap-2">
        {/* Daily Energy Gauge (10 max, +1 / 30min) */}
        <div className="flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1.5 rounded-xl">
          <Zap size={14} className="text-cyan-400 fill-cyan-400/40" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-xs text-cyan-300">
                {user.energy}
              </span>
              <span className="font-mono text-[10px] text-slate-500">/ {user.maxEnergy}</span>
            </div>
            {user.energy < user.maxEnergy && (
              <span className="text-[9px] font-mono text-cyan-400/70 flex items-center gap-0.5 -mt-0.5">
                <Clock size={8} />
                +{formatTimer(secondsToNextEnergy)}
              </span>
            )}
          </div>
        </div>

        {/* Credits Pill */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1.5 rounded-xl border border-white/10">
          <Coins size={14} className="text-amber-400" />
          <span className="font-mono font-bold text-xs text-white">
            {user.credits.toLocaleString()}
          </span>
        </div>

        {/* Inventory (X / 300 parcelles) */}
        <button
          onClick={onOpenInventory}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
          title="Patrimoine foncier"
        >
          <Layers size={13} className="text-cyan-400" />
          <span className="hidden md:inline text-xs">Patrimoine</span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
              user.claimedCount >= maxInventoryParcels
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40 font-bold'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            {user.claimedCount}/{maxInventoryParcels}
          </span>
        </button>

        {/* Marketplace */}
        <button
          onClick={onOpenMarket}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
        >
          <ShoppingBag size={13} className="text-emerald-400" />
          <span className="hidden sm:inline text-xs">Marché</span>
        </button>

        {/* Pack Opener Button */}
        <button
          onClick={onOpenBoosters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Package size={14} />
          <span>Booster</span>
        </button>
      </div>
    </header>
  );
};
