import { useState, useEffect } from 'react';
import type { Parcel, UserProfile, BoosterPackConfig, AuctionData } from '../types/cadastra';
import { BOOSTER_PACKS, openBoosterPackLocally } from '../services/boosterService';
import { NOTABLE_LANDMARKS } from '../services/parcelGenerator';
import { getH3Index } from '../services/h3Service';
import { generateParcelFromH3 } from '../services/parcelGenerator';

const STORAGE_KEY = 'cadastra_gamestate_v3';
export const TOTAL_WORLD_CHUNKS = 691_000_000;

export const MAX_ENERGY = 10;
export const ENERGY_RECHARGE_MS = 30 * 60 * 1000; // 30 minutes
export const MAX_INVENTORY_PARCELS = 300;

// Seed initial global landmark claims by rival players to populate map & auctions
function getInitialGlobalParcels(): Parcel[] {
  const rivals = ['Krypton', 'VoxelBaron', 'AtlasCorp', 'NovaTerra', 'CartoKing'];
  const now = Date.now();

  return NOTABLE_LANDMARKS.slice(0, 5).map((landmark, idx) => {
    const h3 = getH3Index(landmark.lat, landmark.lng);
    const rivalName = rivals[idx % rivals.length];
    const parcel = generateParcelFromH3(h3, landmark.rarity, {
      id: `rival_${idx}`,
      name: rivalName,
    });

    // Seed 2 active auctions for the market
    if (idx === 1) {
      parcel.isForSale = true;
      parcel.marketPrice = 1200;
      parcel.auction = {
        startingBid: 400,
        currentBid: 650,
        highestBidderId: 'rival_3',
        highestBidderName: 'AtlasCorp',
        endsAt: now + 3 * 3600 * 1000,
        buyoutPrice: 1200,
      };
    } else if (idx === 3) {
      parcel.isForSale = true;
      parcel.marketPrice = 850;
      parcel.auction = {
        startingBid: 250,
        currentBid: 320,
        highestBidderId: 'rival_0',
        highestBidderName: 'Krypton',
        endsAt: now + 5 * 3600 * 1000,
        buyoutPrice: 850,
      };
    }

    return parcel;
  });
}

export function useGameStore() {
  const [user, setUser] = useState<UserProfile>(() => {
    const now = Date.now();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const u = parsed.user;
        const lastRecharge = u.lastEnergyRechargeAt || now;
        const currentEnergy = u.energy !== undefined ? u.energy : MAX_ENERGY;
        const elapsed = now - lastRecharge;
        const recovered = Math.floor(elapsed / ENERGY_RECHARGE_MS);
        const newEnergy = Math.min(MAX_ENERGY, currentEnergy + recovered);
        const newLastRecharge =
          newEnergy === MAX_ENERGY ? now : lastRecharge + recovered * ENERGY_RECHARGE_MS;

        return {
          id: u.id || 'usr_local_player',
          username: u.username || 'Pionnier_#1',
          credits: u.credits !== undefined ? u.credits : 300,
          claimedCount: u.claimedCount || 0,
          energy: newEnergy,
          maxEnergy: MAX_ENERGY,
          lastEnergyRechargeAt: newLastRecharge,
          maxInventorySlots: MAX_INVENTORY_PARCELS,
        };
      } catch {
        // ignore
      }
    }
    return {
      id: 'usr_local_player',
      username: 'Pionnier_#1',
      credits: 300,
      claimedCount: 0,
      energy: MAX_ENERGY,
      maxEnergy: MAX_ENERGY,
      lastEnergyRechargeAt: now,
      maxInventorySlots: MAX_INVENTORY_PARCELS,
    };
  });

  const [ownedParcels, setOwnedParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.ownedParcels || [];
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [allKnownParcels, setAllKnownParcels] = useState<Record<string, Parcel>>(() => {
    const initial = getInitialGlobalParcels();
    const map: Record<string, Parcel> = {};
    for (const p of initial) {
      map[p.h3Index] = p;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.ownedParcels) {
          for (const op of parsed.ownedParcels) {
            map[op.h3Index] = op;
          }
        }
      } catch {
        // ignore
      }
    }
    return map;
  });

  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [globalClaimedCounter, setGlobalClaimedCounter] = useState<number>(14250);
  const [secondsToNextEnergy, setSecondsToNextEnergy] = useState<number>(0);

  // Sync claimedCount
  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      claimedCount: ownedParcels.length,
    }));
  }, [ownedParcels]);

  // Periodic energy regeneration timer (ticks every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setUser((prev) => {
        if (prev.energy >= MAX_ENERGY) {
          setSecondsToNextEnergy(0);
          return prev;
        }

        const elapsed = now - prev.lastEnergyRechargeAt;
        if (elapsed >= ENERGY_RECHARGE_MS) {
          const recovered = Math.floor(elapsed / ENERGY_RECHARGE_MS);
          const nextEnergy = Math.min(MAX_ENERGY, prev.energy + recovered);
          const nextRechargeAt =
            nextEnergy === MAX_ENERGY ? now : prev.lastEnergyRechargeAt + recovered * ENERGY_RECHARGE_MS;

          return {
            ...prev,
            energy: nextEnergy,
            lastEnergyRechargeAt: nextRechargeAt,
          };
        } else {
          setSecondsToNextEnergy(Math.max(0, Math.ceil((ENERGY_RECHARGE_MS - elapsed) / 1000)));
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        ownedParcels,
      })
    );
  }, [user, ownedParcels]);

  // Open Booster Pack (Consumes ONLY Energy, 0 credits!)
  const openPack = (packConfig: BoosterPackConfig): Parcel[] => {
    if (ownedParcels.length + packConfig.chunksCount > MAX_INVENTORY_PARCELS) {
      throw new Error(
        `Capacité maximale atteinte (${ownedParcels.length}/${MAX_INVENTORY_PARCELS} parcelles). Vendez ou défaussez des parcelles pour faire de la place.`
      );
    }

    if (user.energy < packConfig.energyCost) {
      throw new Error(
        `Énergie insuffisante (${user.energy}/${MAX_ENERGY} charges). Requis : ${packConfig.energyCost} charges. (+1 charge toutes les 30 min)`
      );
    }

    const now = Date.now();

    // Deduct only energy
    setUser((prev) => ({
      ...prev,
      energy: Math.max(0, prev.energy - packConfig.energyCost),
      lastEnergyRechargeAt: prev.energy === MAX_ENERGY ? now : prev.lastEnergyRechargeAt,
    }));

    // Generate pulled parcels
    const pulled = openBoosterPackLocally(packConfig.id, {
      id: user.id,
      name: user.username,
    });

    setOwnedParcels((prev) => [...prev, ...pulled]);
    setAllKnownParcels((prev) => {
      const next = { ...prev };
      for (const p of pulled) {
        next[p.h3Index] = p;
      }
      return next;
    });

    setGlobalClaimedCounter((prev) => prev + pulled.length);
    return pulled;
  };

  // Recycle / Discard a parcel to the Bank for guaranteed credits
  const recycleParcel = (h3Index: string): number => {
    const parcel = ownedParcels.find((p) => p.h3Index === h3Index);
    if (!parcel) {
      throw new Error('Parcelle introuvable');
    }

    const refund = parcel.scrapValue;

    // Credit user with scrap cash
    setUser((prev) => ({
      ...prev,
      credits: prev.credits + refund,
    }));

    // Remove from owned
    setOwnedParcels((prev) => prev.filter((p) => p.h3Index !== h3Index));

    // Reset parcel to neutral unowned in global registry
    const unownedParcel: Parcel = {
      ...parcel,
      ownerId: null,
      ownerName: null,
      claimedAt: null,
      isForSale: false,
      marketPrice: 0,
      auction: null,
    };

    setAllKnownParcels((prev) => ({
      ...prev,
      [h3Index]: unownedParcel,
    }));

    return refund;
  };

  // Direct Fixed Price Sale
  const toggleSale = (h3Index: string, price = 200) => {
    setOwnedParcels((prev) =>
      prev.map((p) => {
        if (p.h3Index === h3Index) {
          const nextForSale = !p.isForSale;
          return {
            ...p,
            isForSale: nextForSale,
            marketPrice: price,
            auction: null,
          };
        }
        return p;
      })
    );
    setAllKnownParcels((prev) => {
      const target = prev[h3Index];
      if (!target) return prev;
      return {
        ...prev,
        [h3Index]: {
          ...target,
          isForSale: !target.isForSale,
          marketPrice: price,
          auction: null,
        },
      };
    });
  };

  // Start an Auction on an owned parcel
  const startAuction = (
    h3Index: string,
    startingBid: number,
    durationHours = 24,
    buyoutPrice?: number
  ) => {
    const auction: AuctionData = {
      startingBid,
      currentBid: startingBid,
      highestBidderId: null,
      highestBidderName: null,
      endsAt: Date.now() + durationHours * 3600 * 1000,
      buyoutPrice,
    };

    const updateFn = (p: Parcel): Parcel => {
      if (p.h3Index === h3Index) {
        return {
          ...p,
          isForSale: true,
          marketPrice: buyoutPrice || startingBid * 2,
          auction,
        };
      }
      return p;
    };

    setOwnedParcels((prev) => prev.map(updateFn));
    setAllKnownParcels((prev) => {
      const target = prev[h3Index];
      if (!target) return prev;
      return { ...prev, [h3Index]: updateFn(target) };
    });
  };

  // Place a Bid on an auction
  const placeBid = (h3Index: string, bidAmount: number) => {
    const target = allKnownParcels[h3Index];
    if (!target || !target.auction) throw new Error('Cette parcelle n’est pas aux enchères');
    if (target.ownerId === user.id) throw new Error('Vous ne pouvez pas enchérir sur votre propre parcelle');
    if (user.credits < bidAmount) throw new Error('Fonds insuffisants');
    if (bidAmount <= target.auction.currentBid) {
      throw new Error(`L’enchère doit être supérieure à ${target.auction.currentBid} CR`);
    }

    const now = Date.now();
    if (now > target.auction.endsAt) throw new Error('Cette enchère est terminée');

    // Anti-sniping: extend timer by 60s if < 60s remain
    const timeLeft = target.auction.endsAt - now;
    const endsAt = timeLeft < 60000 ? now + 60000 : target.auction.endsAt;

    // Deduct credits
    setUser((prev) => ({
      ...prev,
      credits: prev.credits - bidAmount,
    }));

    const updatedAuction: AuctionData = {
      ...target.auction,
      currentBid: bidAmount,
      highestBidderId: user.id,
      highestBidderName: user.username,
      endsAt,
    };

    setAllKnownParcels((prev) => ({
      ...prev,
      [h3Index]: {
        ...target,
        auction: updatedAuction,
      },
    }));
  };

  // Buyout directly (Fixed price or Buyout on auction)
  const buyParcelFromMarket = (h3Index: string) => {
    if (ownedParcels.length + 1 > MAX_INVENTORY_PARCELS) {
      throw new Error(
        `Patrimoine saturé (${MAX_INVENTORY_PARCELS}/${MAX_INVENTORY_PARCELS}). Défaussez ou vendez une parcelle d'abord.`
      );
    }

    const target = allKnownParcels[h3Index];
    if (!target) return;
    const price = target.auction?.buyoutPrice || target.marketPrice;
    if (price <= 0) return;
    if (user.credits < price) throw new Error('Fonds insuffisants');

    setUser((prev) => ({
      ...prev,
      credits: prev.credits - price,
    }));

    const boughtParcel: Parcel = {
      ...target,
      ownerId: user.id,
      ownerName: user.username,
      claimedAt: new Date().toISOString(),
      isForSale: false,
      auction: null,
    };

    setOwnedParcels((prev) => [...prev, boughtParcel]);
    setAllKnownParcels((prev) => ({
      ...prev,
      [h3Index]: boughtParcel,
    }));
  };

  const selectedParcel = selectedParcelId ? allKnownParcels[selectedParcelId] : null;

  return {
    user,
    ownedParcels,
    allKnownParcels,
    selectedParcel,
    selectedParcelId,
    setSelectedParcelId,
    globalClaimedCounter,
    secondsToNextEnergy,
    openPack,
    recycleParcel,
    toggleSale,
    startAuction,
    placeBid,
    buyParcelFromMarket,
    boosterPacks: BOOSTER_PACKS,
    maxInventoryParcels: MAX_INVENTORY_PARCELS,
    maxEnergy: MAX_ENERGY,
  };
}
