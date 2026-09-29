import type { BoosterPackConfig, Parcel, RarityTier } from '../types/cadastra';
import { getH3Index } from './h3Service';
import { generateParcelFromH3, NOTABLE_LANDMARKS } from './parcelGenerator';
import { getRandomWorldLocation } from './worldMaskService';

export const BOOSTER_PACKS: BoosterPackConfig[] = [
  {
    id: 'pack_world',
    name: 'Booster Foncier Mondial',
    tier: 'standard',
    energyCost: 1,
    chunksCount: 10,
    description: '10 parcelles aléatoires à travers le globe terrestre. Terres émergées et zones côtières prioritaires.',
    mythicChance: 0.03,
    badge: 'Mondial',
  },
];

/**
 * Simulates opening a booster pack and rolling chunks across the world.
 * Avoids deep ocean far from coasts unless rolling a rare anomaly.
 */
export function openBoosterPackLocally(
  packId: string,
  user: { id: string; name: string }
): Parcel[] {
  const pack = BOOSTER_PACKS.find((p) => p.id === packId) || BOOSTER_PACKS[0];
  const results: Parcel[] = [];

  for (let i = 0; i < pack.chunksCount; i++) {
    let lat: number;
    let lng: number;
    let forcedRarity: RarityTier;
    const roll = Math.random();

    // Rarity determination
    if (roll < pack.mythicChance) forcedRarity = 'mythic';
    else if (roll < 0.12) forcedRarity = 'epic';
    else if (roll < 0.35) forcedRarity = 'rare';
    else if (roll < 0.70) forcedRarity = 'uncommon';
    else forcedRarity = 'common';

    // 1% chance for a mythic/epic drop to land at a notable landmark
    if (forcedRarity === 'mythic' && Math.random() < 0.35) {
      const landmark = NOTABLE_LANDMARKS[Math.floor(Math.random() * NOTABLE_LANDMARKS.length)];
      lat = landmark.lat;
      lng = landmark.lng;
      const h3Index = getH3Index(lat, lng, 8);
      results.push(generateParcelFromH3(h3Index, forcedRarity, user));
      continue;
    }

    // Truly global random roll with heavy penalty on deep ocean far from coasts
    const location = getRandomWorldLocation();
    lat = location.lat;
    lng = location.lng;

    const h3Index = getH3Index(lat, lng, 8);
    const parcel = generateParcelFromH3(h3Index, forcedRarity, user, location.biome);
    results.push(parcel);
  }

  return results;
}
