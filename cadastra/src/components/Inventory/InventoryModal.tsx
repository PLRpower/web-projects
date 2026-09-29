import React from 'react';
import type { Parcel } from '../../types/cadastra';
import { X, Layers, Compass, Tag, Trash2, Landmark } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedParcels: Parcel[];
  maxInventorySlots: number;
  onToggleSale: (h3Index: string) => void;
  onRecycleParcel: (h3Index: string) => void;
  onLocateParcel: (parcel: Parcel) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  ownedParcels,
  maxInventorySlots,
  onToggleSale,
  onRecycleParcel,
  onLocateParcel,
}) => {
  if (!isOpen) return null;

  const usagePercent = Math.min(100, (ownedParcels.length / maxInventorySlots) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0c0e18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              <h2 className="text-xl font-black tracking-tight">Votre Patrimoine Foncier</h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-slate-400">
                {ownedParcels.length} / {maxInventorySlots} parcelles
              </p>
              <div className="w-28 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent >= 90 ? 'bg-rose-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Bank & Recycling Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30 border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Landmark size={20} className="text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Banque du Cadastre & Défausse</h4>
              <p className="text-xs text-slate-400">
                Défaussez vos parcelles encombrantes pour encaisser des crédits garantis et libérer
                des places dans votre inventaire.
              </p>
            </div>
          </div>
        </div>

        {/* Parcels List */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownedParcels.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs">
              Vous ne possédez encore aucune parcelle. Déchirez un booster pour commencer !
            </div>
          ) : (
            ownedParcels.map((parcel) => (
              <div
                key={parcel.h3Index}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 uppercase">
                      {parcel.rarity}
                    </span>
                    <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                      Défausse : +{parcel.scrapValue} CR
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white truncate">{parcel.name}</h4>
                  <p className="text-xs text-slate-400 truncate">
                    {parcel.locality}, {parcel.country}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleSale(parcel.h3Index)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        parcel.isForSale
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <Tag size={12} />
                      <span>{parcel.isForSale ? 'En vente' : 'Vendre'}</span>
                    </button>

                    <button
                      onClick={() => onRecycleParcel(parcel.h3Index)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors"
                      title="Défausser et récupérer le prix plancher en crédits"
                    >
                      <Trash2 size={12} />
                      <span>Défausser</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onLocateParcel(parcel);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <Compass size={13} />
                    <span>Voir</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
