import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { Parcel, RarityTier } from '../../types/cadastra';
import { getH3Boundary } from '../../services/h3Service';
import { Layers, Globe2, MapPin, Building2, Navigation, Mountain } from 'lucide-react';

// Configure MapLibre Web Worker for Vite bundler
maplibregl.setWorkerUrl(workerUrl);

interface CadastraMapProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel | null) => void;
  targetFlyTo?: [number, number] | null; // [lng, lat]
  focusedParcel?: Parcel | null;
  rightPanelOpen?: boolean;
}

function getRarityBadgeStyle(rarity: RarityTier) {
  switch (rarity) {
    case 'mythic':
      return 'border-amber-400 text-amber-300 bg-amber-950/80';
    case 'epic':
      return 'border-purple-400 text-purple-300 bg-purple-950/80';
    case 'rare':
      return 'border-cyan-400 text-cyan-300 bg-cyan-950/80';
    case 'uncommon':
      return 'border-emerald-400 text-emerald-300 bg-emerald-950/80';
    default:
      return 'border-slate-600 text-slate-300 bg-slate-800/80';
  }
}

// Dark matter public vector style (no API key required)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const CadastraMap: React.FC<CadastraMapProps> = ({
  parcels,
  selectedParcel,
  onSelectParcel,
  targetFlyTo,
  focusedParcel,
  rightPanelOpen = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [2.3522, 48.8566], // Paris default
      zoom: 11,
      pitch: 45,
      bearing: -15,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    map.on('load', () => {
      map.resize();
      setMapLoaded(true);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    mapRef.current = map;

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync Parcels GeoJSON source
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Convert parcels to GeoJSON Features
    const features: Feature<Polygon>[] = parcels.map((p) => {
      const boundary = p.boundary.length > 0 ? p.boundary : getH3Boundary(p.h3Index);
      // Close polygon ring if needed
      const ring = [...boundary];
      if (
        ring.length > 0 &&
        (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])
      ) {
        ring.push(ring[0]);
      }

      return {
        type: 'Feature',
        id: p.h3Index,
        properties: {
          id: p.h3Index,
          name: p.name,
          rarity: p.rarity,
          isOwned: Boolean(p.ownerId),
          ownerName: p.ownerName || 'Libre',
          isForSale: p.isForSale,
          marketPrice: p.marketPrice,
          scrapValue: p.scrapValue,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
      };
    });

    const geojsonData: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features,
    };

    if (map.getSource('cadastra-parcels')) {
      const source = map.getSource('cadastra-parcels') as maplibregl.GeoJSONSource;
      source.setData(geojsonData);
    } else {
      map.addSource('cadastra-parcels', {
        type: 'geojson',
        data: geojsonData,
      });

      // Fill Layer
      map.addLayer({
        id: 'parcels-fill',
        type: 'fill',
        source: 'cadastra-parcels',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'isForSale'], true],
            '#10b981', // green for sale
            ['==', ['get', 'rarity'], 'mythic'],
            '#f59e0b', // gold mythic
            ['==', ['get', 'rarity'], 'epic'],
            '#a855f7', // purple epic
            ['==', ['get', 'rarity'], 'rare'],
            '#06b6d4', // cyan rare
            '#3b82f6', // blue common/uncommon
          ],
          'fill-opacity': 0.55,
        },
      });

      // Outline Layer
      map.addLayer({
        id: 'parcels-outline',
        type: 'line',
        source: 'cadastra-parcels',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'rarity'], 'mythic'],
            '#fef08a',
            ['==', ['get', 'rarity'], 'epic'],
            '#e9d5ff',
            '#67e8f9',
          ],
          'line-width': 2,
          'line-opacity': 0.9,
        },
      });

      // Hover / Click handler
      map.on('click', 'parcels-fill', (e: maplibregl.MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const hexId = feature.properties?.id;
        const found = parcels.find((p) => p.h3Index === hexId);
        if (found) {
          onSelectParcel(found);
        }
      });

      map.on('mouseenter', 'parcels-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'parcels-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }, [parcels, mapLoaded, onSelectParcel]);

  // Highlight selected parcel if any
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedParcel) return;

    map.setFilter('parcels-outline', null);
  }, [selectedParcel, mapLoaded]);

  // Handle Fly-To / Slam animation with right panel compensation
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !targetFlyTo) return;

    const rightPadding = rightPanelOpen && window.innerWidth >= 768 ? 480 : 0;

    map.flyTo({
      center: targetFlyTo,
      zoom: 14.5,
      pitch: 55,
      bearing: (Math.random() - 0.5) * 60,
      duration: 2500,
      padding: { top: 40, bottom: 40, left: 40, right: rightPadding + 40 },
      essential: true,
    });
  }, [targetFlyTo, mapLoaded, rightPanelOpen]);

  const activeParcelInfo = focusedParcel || selectedParcel;

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-[#08090e]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating HUD info on map */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0d101d]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs text-slate-300 shadow-xl pointer-events-none">
        <Layers size={14} className="text-cyan-400" />
        <span className="font-mono">Cadastre Global H3 (r8)</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
      </div>

      {/* Floating Geographic & Parcel Detail HUD on Map */}
      {activeParcelInfo && (
        <div className="absolute bottom-6 left-6 z-20 max-w-sm w-[calc(100%-3rem)] sm:w-80 bg-[#0c0e18]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-3 duration-250">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${getRarityBadgeStyle(
                activeParcelInfo.rarity
              )}`}
            >
              ★ {activeParcelInfo.rarity.toUpperCase()} ★
            </span>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              #{activeParcelInfo.h3Index.substring(activeParcelInfo.h3Index.length - 6).toUpperCase()}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 mt-0.5 shrink-0">
              <Globe2 size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold leading-tight truncate">
                {activeParcelInfo.country}
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5 truncate">
                <MapPin size={11} className="text-slate-400 shrink-0" />
                {activeParcelInfo.locality}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-white/10 text-center">
            <div className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5" title="Altitude au-dessus du niveau de la mer">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Mountain size={10} className="text-slate-500" /> Alt.
              </span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {activeParcelInfo.stats.elevationMeters >= 0
                  ? `+${activeParcelInfo.stats.elevationMeters}m`
                  : `${activeParcelInfo.stats.elevationMeters}m`}
              </span>
            </div>
            <div className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5" title="Bâti : densité des constructions sur la parcelle">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Building2 size={10} className="text-slate-500" /> Bâti
              </span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {activeParcelInfo.stats.buildingDensity}%
              </span>
            </div>
            <div className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5" title="POIs : Points d'intérêt (commerces, parcs, services, monuments)">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Navigation size={10} className="text-slate-500" /> POIs
              </span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {activeParcelInfo.stats.poiCount}
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Lat: {activeParcelInfo.center[1].toFixed(4)}°</span>
            <span>Lng: {activeParcelInfo.center[0].toFixed(4)}°</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/20 text-cyan-300 uppercase text-[9px] font-semibold">
              {activeParcelInfo.stats.osmTypeTag}
            </span>
          </div>
        </div>
      )}

      {/* Quick navigation shortcuts (hidden when right panel open to avoid overlap) */}
      {!rightPanelOpen && (
        <div className="absolute top-4 right-4 z-10 flex gap-1.5 bg-[#0d101d]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-xs">
          {[
            { name: 'Paris', coords: [2.3522, 48.8566] },
            { name: 'Tokyo', coords: [139.6503, 35.6762] },
            { name: 'New York', coords: [-74.006, 40.7128] },
            { name: 'Bermudes', coords: [-71.0, 25.0] },
          ].map((city) => (
            <button
              key={city.name}
              onClick={() => {
                mapRef.current?.flyTo({
                  center: city.coords as [number, number],
                  zoom: 12.5,
                  pitch: 45,
                  duration: 2000,
                });
              }}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-mono text-[11px]"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
