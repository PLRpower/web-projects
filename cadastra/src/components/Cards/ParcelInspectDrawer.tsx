import React from 'react';
import type { Parcel } from '../../types/cadastra';
import { ParcelCard } from './ParcelCard';
import { X, ShoppingCart, Tag, Trash2 } from 'lucide-react';

interface ParcelInspectDrawerProps {
  parcel: Parcel | null;
  onClose: () => void;
  currentUserId: string;
  userCredits: number;
  onBuyParcel: (h3Index: string) => void;
  onToggleSale: (h3Index: string) => void;
  onRecycleParcel: (h3Index: string) => void;
}

export const ParcelInspectDrawer: React.FC<ParcelInspectDrawerProps> = ({
  parcel,
  onClose,
  currentUserId,
  userCredits,
  onBuyParcel,
  onToggleSale,
  onRecycleParcel,
}) => {
  if (!parcel) return null;

  const isOwner = parcel.ownerId === currentUserId;
  const price = parcel.auction?.buyoutPrice || parcel.marketPrice;
  const canAfford = userCredits >= price;

  return (
    <div className="absolute right-4 bottom-4 z-30 flex flex-col items-end animate-in slide-in-from-right duration-200">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-7 h-7 rounded-full bg-slate-900 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center shadow-lg"
        >
          <X size={14} />
        </button>

        <ParcelCard parcel={parcel} />

        {/* Action buttons beneath card */}
        <div className="mt-2 w-full flex flex-col gap-1.5">
          {isOwner ? (
            <div className="flex gap-2">
              <button
                onClick={() => onToggleSale(parcel.h3Index)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Tag size={13} />
                <span>{parcel.isForSale ? 'Retirer' : 'Mettre en vente'}</span>
              </button>

              <button
                onClick={() => {
                  onRecycleParcel(parcel.h3Index);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-xs font-semibold text-rose-300 border border-rose-500/30 flex items-center justify-center gap-1.5 transition-colors"
                title="Défausser et récupérer des crédits garantis"
              >
                <Trash2 size={13} />
                <span>Défausser (+{parcel.scrapValue} CR)</span>
              </button>
            </div>
          ) : (
            (parcel.isForSale || parcel.auction) && (
              <button
                onClick={() => onBuyParcel(parcel.h3Index)}
                disabled={!canAfford}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                  canAfford
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={14} />
                <span>
                  Acheter ({price > 0 ? `${price} CR` : 'Non disponible'})
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
