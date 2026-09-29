import React from 'react';
import type { Parcel, RarityTier } from '../../types/cadastra';
import {
  Building2,
  Compass,
  MapPin,
  Sparkles,
  Mountain,
  Navigation,
} from 'lucide-react';

interface ParcelCardProps {
  parcel: Parcel;
  isFlipped?: boolean;
  onLocate?: (parcel: Parcel) => void;
  className?: string;
}

const RARITY_THEMES: Record<
  RarityTier,
  {
    border: string;
    glow: string;
    tagBg: string;
    tagText: string;
    label: string;
  }
> = {
  common: {
    border: 'border-slate-700/80',
    glow: 'shadow-slate-800/30',
    tagBg: 'bg-slate-800/80',
    tagText: 'text-slate-300',
    label: 'COMMUN',
  },
  uncommon: {
    border: 'border-emerald-500/80',
    glow: 'shadow-emerald-500/20 shadow-lg',
    tagBg: 'bg-emerald-950/80',
    tagText: 'text-emerald-400',
    label: 'PEU COMMUN',
  },
  rare: {
    border: 'border-cyan-500/80',
    glow: 'shadow-cyan-500/25 shadow-xl',
    tagBg: 'bg-cyan-950/80',
    tagText: 'text-cyan-300',
    label: 'RARE',
  },
  epic: {
    border: 'border-purple-500/80',
    glow: 'shadow-purple-500/30 shadow-2xl',
    tagBg: 'bg-purple-950/80',
    tagText: 'text-purple-300',
    label: 'ÉPIQUE',
  },
  mythic: {
    border: 'border-amber-400',
    glow: 'shadow-amber-500/40 shadow-2xl ring-2 ring-amber-400/50',
    tagBg: 'bg-amber-950/90',
    tagText: 'text-amber-300 font-bold tracking-wider',
    label: '★ MYTHIQUE ★',
  },
};

export const ParcelCard: React.FC<ParcelCardProps> = ({
  parcel,
  onLocate,
  className = '',
}) => {
  const theme = RARITY_THEMES[parcel.rarity];

  // Generate SVG polygon points from hexagon boundary normalized to 200x180 viewBox
  const coords = parcel.boundary;
  let svgPoints = '';
  if (coords.length > 0) {
    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const rangeLng = maxLng - minLng || 0.001;
    const rangeLat = maxLat - minLat || 0.001;

    svgPoints = coords
      .map(([lng, lat]) => {
        const x = 20 + ((lng - minLng) / rangeLng) * 160;
        const y = 160 - ((lat - minLat) / rangeLat) * 140;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  const polygonClass =
    parcel.rarity === 'mythic'
      ? 'fill-amber-500/20 stroke-amber-400 stroke-2'
      : parcel.rarity === 'epic'
      ? 'fill-purple-500/20 stroke-purple-400 stroke-2'
      : 'fill-cyan-500/20 stroke-cyan-400 stroke-2';

  return (
    <div
      className={`relative w-72 sm:w-80 rounded-2xl bg-gradient-to-b from-[#121420] via-[#0b0c14] to-[#07080d] p-4 text-white border ${theme.border} ${theme.glow} transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between select-none ${className}`}
    >
      {/* Holographic overlay shimmer for Mythic */}
      {parcel.rarity === 'mythic' && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-indigo-500/10 mix-blend-screen animate-pulse" />
      )}

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border border-white/10 ${theme.tagBg} ${theme.tagText}`}
          >
            {theme.label}
          </span>
          {parcel.auction ? (
            <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
              <span>Enchère : {parcel.auction.currentBid} CR</span>
            </div>
          ) : parcel.isForSale ? (
            <div className="flex items-center gap-1 text-[11px] text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
              <span>Prix : {parcel.marketPrice} CR</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
              <span>Défausse : +{parcel.scrapValue} CR</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-base leading-tight tracking-tight line-clamp-1">
          {parcel.name}
        </h3>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
          <MapPin size={12} className="text-slate-500 shrink-0" />
          <span className="truncate">
            {parcel.locality}, {parcel.country}
          </span>
        </p>
      </div>

      {/* Vector OSM Illustration Frame */}
      <div className="relative my-3 w-full h-40 rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2438_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

        {/* OSM Hexagon Vector */}
        <svg viewBox="0 0 200 180" className="w-full h-full p-2 filter drop-shadow">
          {/* Hexagon shape */}
          <polygon
            points={svgPoints}
            className={polygonClass}
          />

          {/* Procedural Roads inside chunk */}
          <line x1="45" y1="90" x2="155" y2="90" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="100" y1="35" x2="100" y2="145" stroke="#334155" strokeWidth="2.5" />
          <line x1="60" y1="45" x2="140" y2="135" stroke="#1e293b" strokeWidth="1.5" />

          {/* Procedural Buildings */}
          {parcel.stats.buildingDensity > 20 && (
            <rect x="75" y="70" width="18" height="15" fill="#0284c7" opacity="0.6" rx="2" />
          )}
          {parcel.stats.buildingDensity > 50 && (
            <rect x="110" y="65" width="22" height="20" fill="#0ea5e9" opacity="0.7" rx="2" />
          )}
          {parcel.stats.buildingDensity > 80 && (
            <rect x="90" y="100" width="24" height="24" fill="#38bdf8" opacity="0.8" rx="2" />
          )}

          {/* Central Point */}
          <circle cx="100" cy="90" r="3" fill="#ffffff" />
        </svg>

        {/* H3 Index Badge */}
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 bg-black/80 px-2 py-0.5 rounded border border-white/10">
          H3: {parcel.h3Index.substring(0, 10)}...
        </div>

        {parcel.stats.landmark && (
          <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            <Sparkles size={10} />
            <span className="truncate max-w-[170px]">{parcel.stats.landmark}</span>
          </div>
        )}
      </div>

      {/* OSM Metrics Grid */}
      <div className="grid grid-cols-3 gap-1.5 py-2 text-center bg-white/[0.03] rounded-xl border border-white/5">
        <div className="flex flex-col items-center" title="Bâti : Densité des bâtiments et constructions sur la parcelle (0-100%)">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Building2 size={11} className="text-slate-500" /> Bâti
          </span>
          <span className="text-xs font-mono font-semibold text-slate-200">
            {parcel.stats.buildingDensity}%
          </span>
        </div>
        <div className="flex flex-col items-center border-x border-white/5" title="POIs (Points d'Intérêt OpenStreetMap) : commerces, gares, services, parcs, monuments">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Navigation size={11} className="text-slate-500" /> POIs
          </span>
          <span className="text-xs font-mono font-semibold text-slate-200">
            {parcel.stats.poiCount}
          </span>
        </div>
        <div className="flex flex-col items-center" title="Altitude au-dessus du niveau de la mer (négative si abysse/océan)">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Mountain size={11} className="text-slate-500" /> Alt.
          </span>
          <span className="text-xs font-mono font-semibold text-slate-200">
            {parcel.stats.elevationMeters >= 0 ? `+${parcel.stats.elevationMeters}m` : `${parcel.stats.elevationMeters}m`}
          </span>
        </div>
      </div>

      {/* Card Footer / Action */}
      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-mono">
            {parcel.auction ? 'Enchère en cours' : parcel.isForSale ? 'Prix de vente' : 'Rachat Banque'}
          </span>
          <span className="text-xs font-mono font-bold text-amber-400">
            {parcel.auction
              ? `${parcel.auction.currentBid} CR`
              : parcel.isForSale
              ? `${parcel.marketPrice} CR`
              : `+${parcel.scrapValue} CR`}
          </span>
        </div>

        {onLocate && (
          <button
            onClick={() => onLocate(parcel)}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <Compass size={13} />
            <span>Localiser</span>
          </button>
        )}
      </div>
    </div>
  );
};
