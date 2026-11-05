# CADASTRA

> **The finite-stock global land registry.**  
> Partition, collect, and trade the entire Earth on an H3 hexagonal grid.

---

## Concept

1. **Finite Global Supply**: Earth is partitioned into ~691,000,000 H3 hexagons (resolution 8, ~460m radius). Supply depletes as booster packs are opened.
2. **Booster Packs & Rarity**: Pull Earth chunks (from suburban vacant lots to iconic OSM heritage monuments or extreme anomalies).
3. **OSM Vector Cards & "3D Slam"**: Holographic tactical card visualization featuring vector footprints of streets and buildings, followed by a direct fly-to dive into the 3D globe.
4. **Contiguity & Passive Yield**: Owning adjacent hexagons triggers a contiguity multiplier, increasing passive yield collected every minute.
5. **Speculative Secondary Marketplace**: Buy and sell missing parcels with other players to consolidate your territories.

---

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **Mapping & 3D**: MapLibre GL (high-performance dark vector basemap) + Uber H3 (`h3-js`) + Deck.gl
- **Animations & UI**: Framer Motion, Lucide Icons, Canvas Confetti
- **Backend & Database (Serverless)**: PostgreSQL (Supabase) + PostGIS + Transactional RPC functions (`open_booster_pack`, `buy_marketplace_parcel`) ensuring anti-cheat integrity and zero race conditions.

---

## Quick Start

```bash
# 1. Navigate to directory
cd cadastra

# 2. Start Vite development server
npm run dev
```

The application starts in a fully standalone mode (procedural generation, simulated global rivals, persistent `localStorage`).

---

## Supabase Connection (Optional)

1. Create a project on [Supabase](https://supabase.com).
2. Open the Supabase **SQL Editor** and run the [supabase/schema.sql](supabase/schema.sql) script.
3. Duplicate `.env.example` as `.env` and fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
