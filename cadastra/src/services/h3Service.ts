import {
  latLngToCell,
  cellToLatLng,
  cellToBoundary,
  gridDisk,
  areNeighborCells,
} from 'h3-js';

// Default resolution for Cadastra chunks (approx 460m edge length)
export const DEFAULT_H3_RESOLUTION = 8;

/**
 * Converts latitude and longitude to an H3 cell index string.
 */
export function getH3Index(lat: number, lng: number, resolution = DEFAULT_H3_RESOLUTION): string {
  return latLngToCell(lat, lng, resolution);
}

/**
 * Returns the center [lng, lat] (GeoJSON standard) of an H3 cell.
 */
export function getH3Center(h3Index: string): [number, number] {
  const [lat, lng] = cellToLatLng(h3Index);
  return [lng, lat];
}

/**
 * Returns boundary coordinates formatted as GeoJSON [[lng, lat], ...] for MapLibre / Deck.gl.
 */
export function getH3Boundary(h3Index: string): [number, number][] {
  const boundary = cellToBoundary(h3Index);
  // boundary is [[lat, lng], ...], convert to [[lng, lat], ...]
  return boundary.map(([lat, lng]) => [lng, lat]);
}

/**
 * Gets neighboring cells within radius k.
 */
export function getNeighborHexes(h3Index: string, ringSize = 1): string[] {
  return gridDisk(h3Index, ringSize);
}

/**
 * Checks if two cells are contiguous.
 */
export function areHexesAdjacent(hexA: string, hexB: string): boolean {
  try {
    return areNeighborCells(hexA, hexB);
  } catch {
    return false;
  }
}

/**
 * Calculate contiguity clusters among owned hexes.
 * Returns connected cluster sizes and total multiplier bonus.
 */
export function calculateContiguityScore(ownedHexes: string[]): {
  clusters: string[][];
  maxClusterSize: number;
  bonusMultiplier: number;
} {
  if (ownedHexes.length === 0) {
    return { clusters: [], maxClusterSize: 0, bonusMultiplier: 1.0 };
  }

  const hexSet = new Set(ownedHexes);
  const visited = new Set<string>();
  const clusters: string[][] = [];

  for (const hex of ownedHexes) {
    if (visited.has(hex)) continue;

    const cluster: string[] = [];
    const queue = [hex];
    visited.add(hex);

    while (queue.length > 0) {
      const current = queue.shift()!;
      cluster.push(current);

      const neighbors = getNeighborHexes(current, 1);
      for (const n of neighbors) {
        if (hexSet.has(n) && !visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }

    clusters.push(cluster);
  }

  const maxClusterSize = Math.max(...clusters.map((c) => c.length), 0);
  // Contiguity bonus: 1.0 + 10% per connected parcel above 1
  const bonusMultiplier = Math.max(1.0, 1.0 + (maxClusterSize - 1) * 0.15);

  return { clusters, maxClusterSize, bonusMultiplier };
}
