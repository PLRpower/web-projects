import { WORLD_MASK_RLE, WORLD_MASK_WIDTH, WORLD_MASK_HEIGHT } from './worldMaskData';

export type WorldBiome = 'land' | 'coastal' | 'ocean';

let cachedMask: Uint8Array | null = null;

function getMask(): Uint8Array {
  if (!cachedMask) {
    const binary = atob(WORLD_MASK_RLE);
    const decoded = new Uint8Array(WORLD_MASK_WIDTH * WORLD_MASK_HEIGHT);
    let ptr = 0;
    for (let i = 0; i < binary.length; i += 2) {
      const val = binary.charCodeAt(i);
      const count = binary.charCodeAt(i + 1);
      for (let c = 0; c < count; c++) {
        decoded[ptr++] = val;
      }
    }
    cachedMask = decoded;
  }
  return cachedMask;
}

/**
 * Classifies any coordinate on Earth:
 * - 'land': on land masses and large islands
 * - 'coastal': in coastal waters or near shores (~200 km)
 * - 'ocean': open ocean far from any coast ("eau au milieu de nulle part")
 */
export function classifyWorldCoord(lat: number, lng: number): WorldBiome {
  const mask = getMask();
  const x = Math.floor(((lng + 180) % 360 + 360) % 360);
  const y = Math.min(179, Math.max(0, Math.floor(lat + 90)));
  const val = mask[y * WORLD_MASK_WIDTH + x];
  if (val === 2) return 'land';
  if (val === 1) return 'coastal';
  return 'ocean';
}

/**
 * Generates a random coordinate distributed across the globe.
 * Heavily penalizes deep ocean far from coasts (rejected ~97% of the time),
 * while retaining all land and coastal waters.
 */
export function getRandomWorldLocation(): { lat: number; lng: number; biome: WorldBiome } {
  // Rejection sampling up to 40 attempts to avoid deep ocean far from coasts
  for (let attempt = 0; attempt < 40; attempt++) {
    const lng = Math.random() * 360 - 180;
    // Area-preserving uniform latitude on a sphere
    const lat = Math.asin(Math.random() * 2 - 1) * (180 / Math.PI);
    const biome = classifyWorldCoord(lat, lng);

    // Land and coastal water are accepted directly
    if (biome === 'land' || biome === 'coastal') {
      return { lat, lng, biome };
    }

    // Deep ocean far from coasts: small chance (~3%) to appear as rare abyssal water
    if (Math.random() < 0.03) {
      return { lat, lng, biome: 'ocean' };
    }
  }

  // Fallback
  const lng = Math.random() * 360 - 180;
  const lat = Math.asin(Math.random() * 2 - 1) * (180 / Math.PI);
  return { lat, lng, biome: classifyWorldCoord(lat, lng) };
}

/**
 * Provides geographic region and locality description for generated parcels.
 */
export function getRegionInfo(
  lat: number,
  lng: number,
  biome: WorldBiome
): { locality: string; country: string } {
  if (biome === 'ocean') {
    if (lat < -60) return { locality: 'Fosse Polaire', country: 'Océan Austral' };
    if (lat > 66) return { locality: 'Banquise Arctique', country: 'Océan Arctique' };
    if (lng > -70 && lng < 20) {
      return {
        locality: lat >= 0 ? 'Dorsale Médio-Atlantique' : 'Bassin Sud-Atlantique',
        country: 'Océan Atlantique',
      };
    }
    if (lng >= 20 && lng < 100 && lat < 30) {
      return { locality: 'Bassin Pélagique', country: 'Océan Indien' };
    }
    return {
      locality: lat >= 0 ? 'Abysse Nord-Pacifique' : 'Zone Point Nemo',
      country: 'Océan Pacifique',
    };
  }

  if (biome === 'coastal') {
    if (lat < -60) return { locality: 'Glacier Côtier', country: 'Antarctique' };
    if (lat > 66) return { locality: 'Littoral Arctique', country: 'Grand Nord' };
    if (lat >= 35 && lat <= 70 && lng >= -10 && lng <= 40) {
      return { locality: 'Zone Côtière Européenne', country: 'Europe Littorale' };
    }
    if (lat >= -35 && lat <= 37 && lng >= -20 && lng <= 52) {
      return { locality: 'Façade Maritime Africaine', country: 'Afrique Côtière' };
    }
    if (lat >= 15 && lat <= 72 && lng >= -170 && lng <= -50) {
      return { locality: 'Littoral Nord-Américain', country: 'Amérique du Nord' };
    }
    if (lat >= -56 && lat <= 15 && lng >= -85 && lng <= -34) {
      return { locality: 'Côte Sud-Américaine', country: 'Amérique du Sud' };
    }
    if (lat >= -50 && lat <= 0 && lng >= 110 && lng <= 180) {
      return { locality: 'Zone Insulaire & Récifs', country: 'Océanie' };
    }
    if (lat >= 0 && lat <= 75 && lng >= 40 && lng <= 180) {
      return { locality: 'Façade Côtière Asiatique', country: 'Asie Côtière' };
    }
    return { locality: 'Bordure Océanique', country: 'Secteur Côtier' };
  }

  // Land
  if (lat < -60) return { locality: 'Plateau Inlandsis', country: 'Antarctique' };
  if (lat >= 36 && lat <= 71 && lng >= -10 && lng <= 45) {
    return { locality: `Secteur ${Math.abs(Math.round(lat))}°N`, country: 'Europe' };
  }
  if (lat >= -35 && lat <= 36 && lng >= -18 && lng <= 52) {
    return { locality: `Zone Continentale ${Math.abs(Math.round(lat))}°`, country: 'Afrique' };
  }
  if (lat >= 15 && lat <= 72 && lng >= -170 && lng <= -50) {
    return { locality: `Territoire Intérieur ${Math.abs(Math.round(lat))}°N`, country: 'Amérique du Nord' };
  }
  if (lat >= -56 && lat <= 14 && lng >= -82 && lng <= -34) {
    return { locality: `Région Australe ${Math.abs(Math.round(lat))}°S`, country: 'Amérique du Sud' };
  }
  if (lat >= -45 && lat <= -10 && lng >= 112 && lng <= 155) {
    return { locality: `Outback / Région ${Math.abs(Math.round(lat))}°S`, country: 'Australie' };
  }
  if (lat >= 5 && lat <= 75 && lng >= 45 && lng <= 180) {
    return { locality: `Zone Continentale ${Math.abs(Math.round(lat))}°N`, country: 'Asie' };
  }
  return { locality: 'Secteur Foncier', country: 'Secteur Mondial' };
}
