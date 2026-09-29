import React, { useState } from 'react';
import type { Parcel } from '../../types/cadastra';
import { X, Search, ShoppingCart, Compass, Gavel, Flame, Clock } from 'lucide-react';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels: Parcel[];
  currentUserId: string;
  userCredits: number;
  onBuyParcel: (h3Index: string) => void;
  onPlaceBid: (h3Index: string, bidAmount: number) => void;
  onLocateParcel: (parcel: Parcel) => void;
}

export const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  isOpen,
  onClose,
  parcels,
  currentUserId,
  userCredits,
  onBuyParcel,
  onPlaceBid,
  onLocateParcel,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'auctions' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Format countdown
  const formatTimeRemaining = (endsAt: number) => {
    const remaining = Math.max(0, endsAt - Date.now());
    const hours = Math.floor(remaining / (3600 * 1000));
    const mins = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
    return `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;
  };

  // Filter listings
  const availableListings = parcels.filter((p) => {
    const isListed = p.isForSale || p.auction;
    if (!isListed) return false;

    if (filterType === 'auctions' && !p.auction) return false;
    if (filterType === 'direct' && p.auction) return false;

    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0c0e18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Gavel size={20} className="text-amber-400" />
              <h2 className="text-xl font-black tracking-tight">Hôtel des Ventes & Enchères</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enchérissez en direct ou achetez immédiatement des parcelles auprès des autres
              joueurs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une ville, monument, pays..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                filterType === 'all'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilterType('auctions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-1 transition-colors ${
                filterType === 'auctions'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Flame size={12} />
              <span>Enchères</span>
            </button>
            <button
              onClick={() => setFilterType('direct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors ${
                filterType === 'direct'
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Ventes Directes
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableListings.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs">
              Aucune vente ni enchère active pour le moment.
            </div>
          ) : (
            availableListings.map((parcel) => {
              const isOwner = parcel.ownerId === currentUserId;
              const hasAuction = Boolean(parcel.auction);
              const currentBid = parcel.auction?.currentBid || 0;
              const nextMinBid = currentBid + 50;
              const buyout = parcel.auction?.buyoutPrice || parcel.marketPrice;
              const canAffordBid = userCredits >= nextMinBid;
              const canAffordBuyout = userCredits >= buyout;

              return (
                <div
                  key={parcel.h3Index}
                  className={`p-4 rounded-2xl border transition-all ${
                    hasAuction
                      ? 'bg-gradient-to-br from-amber-950/20 via-black/40 to-black/60 border-amber-500/30'
                      : 'bg-white/[0.02] border-white/10'
                  } flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 uppercase">
                          {parcel.rarity}
                        </span>
                        {hasAuction && (
                          <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                            <Flame size={11} className="fill-amber-400" />
                            ENCHÈRE
                          </span>
                        )}
                      </div>

                      {hasAuction && parcel.auction && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Clock size={11} />
                          <span>{formatTimeRemaining(parcel.auction.endsAt)}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-sm truncate text-white">{parcel.name}</h4>
                    <p className="text-xs text-slate-400 truncate">
                      {parcel.locality}, {parcel.country}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Vendeur : {parcel.ownerName || 'Système'}
                    </p>
                  </div>

                  {/* Pricing and Action controls */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {hasAuction ? 'Enchère actuelle' : 'Prix ferme'}
                      </span>
                      <span className="text-base font-bold font-mono text-amber-400 leading-tight">
                        {hasAuction ? `${currentBid} CR` : `${buyout} CR`}
                      </span>
                      {hasAuction && parcel.auction?.highestBidderName && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Mené par @{parcel.auction.highestBidderName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onLocateParcel(parcel)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                        title="Localiser"
                      >
                        <Compass size={14} />
                      </button>

                      {isOwner ? (
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1.5 rounded-xl border border-cyan-500/20">
                          Votre offre
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          {hasAuction && (
                            <button
                              onClick={() => onPlaceBid(parcel.h3Index, nextMinBid)}
                              disabled={!canAffordBid}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                canAffordBid
                                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20'
                                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
                              }`}
                              title={`Poser ${nextMinBid} CR`}
                            >
                              Miser ({nextMinBid} CR)
                            </button>
                          )}

                          {buyout > 0 && (
                            <button
                              onClick={() => onBuyParcel(parcel.h3Index)}
                              disabled={!canAffordBuyout}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                canAffordBuyout
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart size={12} />
                              <span>Acheter ({buyout} CR)</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
