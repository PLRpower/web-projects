export type RarityTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'mythic';

export interface ParcelStats {
  poiCount: number;
  buildingDensity: number; // 0 to 100
  roadDensity: number; // 0 to 100
  elevationMeters: number;
  landmark?: string;
  osmTypeTag: 'monument' | 'urban' | 'residential' | 'coastal' | 'wilderness' | 'anomaly';
}

export interface AuctionData {
  startingBid: number;
  currentBid: number;
  highestBidderId: string | null;
  highestBidderName: string | null;
  endsAt: number; // timestamp in ms
  buyoutPrice?: number;
}

export interface Parcel {
  id: string; // e.g. H3 index
  h3Index: string;
  name: string;
  locality: string;
  country: string;
  center: [number, number]; // [lng, lat]
  boundary: [number, number][]; // Polygon coords [[lng, lat], ...]
  rarity: RarityTier;
  ownerId: string | null;
  ownerName: string | null;
  claimedAt: string | null;
  isForSale: boolean;
  marketPrice: number; // Direct buyout price (if set)
  scrapValue: number; // Guaranteed credit refund when discarded to the Bank
  stats: ParcelStats;
  auction?: AuctionData | null;
}

export interface BoosterPackConfig {
  id: string;
  name: string;
  tier: 'standard' | 'capital' | 'anomaly';
  energyCost: number; // Energy charges consumed
  chunksCount: number;
  description: string;
  mythicChance: number;
  badge: string;
}

export interface UserProfile {
  id: string;
  username: string;
  credits: number;
  claimedCount: number;
  energy: number; // current charges (0-10)
  maxEnergy: number; // 10
  lastEnergyRechargeAt: number; // timestamp in ms
  maxInventorySlots: number; // 300
}
