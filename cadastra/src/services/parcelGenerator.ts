import type { Parcel, RarityTier, ParcelStats } from '../types/cadastra';
import { getH3Boundary, getH3Center, getH3Index } from './h3Service';
import { classifyWorldCoord, getRegionInfo, type WorldBiome } from './worldMaskService';

export const SCRAP_VALUES_BY_RARITY: Record<RarityTier, number> = {
  common: 20,
  uncommon: 35,
  rare: 75,
  epic: 150,
  mythic: 350,
};

// Famous real-world seed landmarks
export const NOTABLE_LANDMARKS = [
  {
    name: 'Tour Eiffel & Champ de Mars',
    locality: 'Paris, 7e Arrondissement',
    country: 'France',
    lat: 48.8584,
    lng: 2.2945,
    rarity: 'mythic' as RarityTier,
    stats: {
      poiCount: 142,
      buildingDensity: 78,
      roadDensity: 85,
      elevationMeters: 35,
      landmark: 'Tour Eiffel (Monument Historique)',
      osmTypeTag: 'monument' as const,
    },
  },
  {
    name: 'Times Square & Broadway',
    locality: 'New York, Manhattan',
    country: 'États-Unis',
    lat: 40.758,
    lng: -73.9855,
    rarity: 'mythic' as RarityTier,
    stats: {
      poiCount: 310,
      buildingDensity: 98,
      roadDensity: 92,
      elevationMeters: 16,
      landmark: 'Times Square Commercial Hub',
      osmTypeTag: 'urban' as const,
    },
  },
  {
    name: 'Shibuya Crossing & Hachiko',
    locality: 'Tokyo, Shibuya',
    country: 'Japon',
    lat: 35.6595,
    lng: 139.7004,
    rarity: 'mythic' as RarityTier,
    stats: {
      poiCount: 420,
      buildingDensity: 96,
      roadDensity: 94,
      elevationMeters: 14,
      landmark: 'Shibuya Scramble Crossing',
      osmTypeTag: 'urban' as const,
    },
  },
  {
    name: 'Colisée & Forum Romain',
    locality: 'Rome, Latium',
    country: 'Italie',
    lat: 41.8902,
    lng: 12.4922,
    rarity: 'epic' as RarityTier,
    stats: {
      poiCount: 95,
      buildingDensity: 65,
      roadDensity: 70,
      elevationMeters: 22,
      landmark: 'Amphithéâtre Flavien (Colisée)',
      osmTypeTag: 'monument' as const,
    },
  },
  {
    name: 'Pyramides de Gizeh',
    locality: 'Al Haram, Gizeh',
    country: 'Égypte',
    lat: 29.9792,
    lng: 31.1342,
    rarity: 'epic' as RarityTier,
    stats: {
      poiCount: 38,
      buildingDensity: 12,
      roadDensity: 24,
      elevationMeters: 60,
      landmark: 'Grande Pyramide de Khéops',
      osmTypeTag: 'monument' as const,
    },
  },
  {
    name: 'Abysse du Triangle des Bermudes',
    locality: 'Mer des Sargasses',
    country: 'Eaux Internationales',
    lat: 25.0,
    lng: -71.0,
    rarity: 'mythic' as RarityTier,
    stats: {
      poiCount: 0,
      buildingDensity: 0,
      roadDensity: 0,
      elevationMeters: -5200,
      landmark: 'Anomalie Magnétique Navale #09',
      osmTypeTag: 'anomaly' as const,
    },
  },
  {
    name: 'Sommet du Mont Everest',
    locality: 'Himalaya, Solukhumbu',
    country: 'Népal / Chine',
    lat: 27.9881,
    lng: 86.925,
    rarity: 'rare' as RarityTier,
    stats: {
      poiCount: 4,
      buildingDensity: 1,
      roadDensity: 0,
      elevationMeters: 8848,
      landmark: 'Toit du Monde (Zone de la Mort)',
      osmTypeTag: 'wilderness' as const,
    },
  },
];

// Seeded pseudorandom generator based on H3 string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Creates or computes procedural parcel stats from an H3 index.
 */
export function generateParcelFromH3(
  h3Index: string,
  preferredRarity?: RarityTier,
  owner?: { id: string; name: string } | null,
  knownBiome?: WorldBiome
): Parcel {
  const [lng, lat] = getH3Center(h3Index);
  const boundary = getH3Boundary(h3Index);
  const hash = hashString(h3Index);

  // Check if close to a notable landmark
  for (const landmark of NOTABLE_LANDMARKS) {
    const landmarkHex = getH3Index(landmark.lat, landmark.lng);
    if (landmarkHex === h3Index) {
      return {
        id: h3Index,
        h3Index,
        name: landmark.name,
        locality: landmark.locality,
        country: landmark.country,
        center: [lng, lat],
        boundary,
        rarity: landmark.rarity,
        ownerId: owner ? owner.id : null,
        ownerName: owner ? owner.name : null,
        claimedAt: owner ? new Date().toISOString() : null,
        isForSale: false,
        marketPrice: 0,
        scrapValue: SCRAP_VALUES_BY_RARITY[landmark.rarity],
        stats: landmark.stats,
      };
    }
  }

  // Procedural rarity weights if not forced
  let rarity: RarityTier = preferredRarity || 'common';
  if (!preferredRarity) {
    const roll = hash % 1000;
    if (roll > 985) rarity = 'mythic';
    else if (roll > 930) rarity = 'epic';
    else if (roll > 800) rarity = 'rare';
    else if (roll > 550) rarity = 'uncommon';
    else rarity = 'common';
  }

  const biome = knownBiome || classifyWorldCoord(lat, lng);
  const region = getRegionInfo(lat, lng, biome);

  let poiCount = Math.floor((hash % 45) * (rarity === 'mythic' ? 5 : rarity === 'epic' ? 3 : 1));
  let buildingDensity = (hash * 7) % 100;
  let roadDensity = (hash * 13) % 100;
  let elevationMeters = ((hash * 3) % 450) + 12;
  let osmTypeTag: ParcelStats['osmTypeTag'] = 'residential';

  if (biome === 'ocean') {
    osmTypeTag = 'anomaly';
    buildingDensity = 0;
    roadDensity = 0;
    poiCount = 0;
    elevationMeters = -((hash % 4500) + 1200);
  } else if (biome === 'coastal') {
    osmTypeTag = 'coastal';
    buildingDensity = Math.min(buildingDensity, 55);
    roadDensity = Math.min(roadDensity, 55);
    elevationMeters = (hash % 35) + 1;
  } else {
    if (buildingDensity > 75) osmTypeTag = 'urban';
    else if (buildingDensity < 12) osmTypeTag = 'wilderness';
  }

  return {
    id: h3Index,
    h3Index,
    name: `Cadastre #${h3Index.substring(h3Index.length - 6).toUpperCase()}`,
    locality: region.locality,
    country: region.country,
    center: [lng, lat],
    boundary,
    rarity,
    ownerId: owner ? owner.id : null,
    ownerName: owner ? owner.name : null,
    claimedAt: owner ? new Date().toISOString() : null,
    isForSale: false,
    marketPrice: 0,
    scrapValue: SCRAP_VALUES_BY_RARITY[rarity],
    stats: {
      poiCount,
      buildingDensity,
      roadDensity,
      elevationMeters,
      osmTypeTag,
    },
  };
}
