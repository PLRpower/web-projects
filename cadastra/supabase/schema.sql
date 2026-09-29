-- noinspection SqlNoDataSourceInspectionForFile
-- ==============================================================================
-- CADASTRA - SCHEMA POSTGRESQL / SUPABASE
-- Finitude, cadastre mondial H3, propriété foncière virtuelle & marketplace
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS optionnel si activé sur le projet Supabase :
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. TABLE DES UTILISATEURS (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    credits BIGINT DEFAULT 1000 NOT NULL CHECK (credits >= 0),
    claimed_count INTEGER DEFAULT 0 NOT NULL,
    passive_yield INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLE DES PARCELLES DU CADASTRE (CHUNKS H3)
CREATE TABLE IF NOT EXISTS public.parcels (
    h3_index TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    locality TEXT NOT NULL,
    country TEXT NOT NULL,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'mythic')),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    is_for_sale BOOLEAN DEFAULT FALSE NOT NULL,
    market_price BIGINT DEFAULT 0 NOT NULL,
    yield_per_minute INTEGER DEFAULT 2 NOT NULL,
    stats JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour recherche rapide par propriétaire et par mise en vente
CREATE INDEX IF NOT EXISTS idx_parcels_owner ON public.parcels(owner_id);
CREATE INDEX IF NOT EXISTS idx_parcels_for_sale ON public.parcels(is_for_sale) WHERE is_for_sale = TRUE;
CREATE INDEX IF NOT EXISTS idx_parcels_coords ON public.parcels(center_lat, center_lng);

-- 4. TABLE DU MARCHÉ SECONDAIRE (MARKETPLACE)
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    h3_index TEXT NOT NULL REFERENCES public.parcels(h3_index) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    price BIGINT NOT NULL CHECK (price > 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    sold_at TIMESTAMPTZ,
    buyer_id UUID REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_listings_active ON public.marketplace_listings(status) WHERE status = 'active';

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Lecture publique de tous les chunks réclamés (visible sur le cadastre mondial)
CREATE POLICY "Public read for parcels" ON public.parcels
    FOR SELECT USING (true);

-- Seul le propriétaire peut modifier sa parcelle (mise en vente, prix)
CREATE POLICY "Owners can update their parcels" ON public.parcels
    FOR UPDATE USING (auth.uid() = owner_id);

-- Profils lisibles par tous
CREATE POLICY "Public read profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Annonces marketplace
CREATE POLICY "Public read active listings" ON public.marketplace_listings
    FOR SELECT USING (status = 'active');

CREATE POLICY "Sellers can manage listings" ON public.marketplace_listings
    FOR ALL USING (auth.uid() = seller_id);

-- ==============================================================================
-- 6. FONCTIONS RPC TRANSACTIONNELLES (ANTI-TRICHE & INTÉGRITÉ FINANCIÈRE)
-- ==============================================================================

-- Achat atomique d'une parcelle sur le marché secondaire
CREATE OR REPLACE FUNCTION public.buy_marketplace_parcel(
    p_listing_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_buyer_id UUID := auth.uid();
    v_listing RECORD;
    v_buyer_credits BIGINT;
BEGIN
    IF v_buyer_id IS NULL THEN
        RAISE EXCEPTION 'Non authentifié';
    END IF;

    -- Verrouillage de l'annonce pour éviter les conflits simultanés (Race condition)
    SELECT * INTO v_listing
    FROM public.marketplace_listings
    WHERE id = p_listing_id AND status = 'active'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Annonce non disponible ou déjà vendue';
    END IF;

    IF v_listing.seller_id = v_buyer_id THEN
        RAISE EXCEPTION 'Vous ne pouvez pas acheter votre propre parcelle';
    END IF;

    -- Vérification solde acheteur
    SELECT credits INTO v_buyer_credits
    FROM public.profiles
    WHERE id = v_buyer_id
    FOR UPDATE;

    IF v_buyer_credits < v_listing.price THEN
        RAISE EXCEPTION 'Crédits insuffisants (requis: %, disponible: %)', v_listing.price, v_buyer_credits;
    END IF;

    -- 1. Débiter l'acheteur
    UPDATE public.profiles
    SET credits = credits - v_listing.price,
        claimed_count = claimed_count + 1
    WHERE id = v_buyer_id;

    -- 2. Créditer le vendeur
    UPDATE public.profiles
    SET credits = credits + v_listing.price,
        claimed_count = GREATEST(0, claimed_count - 1)
    WHERE id = v_listing.seller_id;

    -- 3. Transférer la propriété de la parcelle
    UPDATE public.parcels
    SET owner_id = v_buyer_id,
        is_for_sale = FALSE,
        market_price = v_listing.price
    WHERE h3_index = v_listing.h3_index;

    -- 4. Clôturer l'annonce
    UPDATE public.marketplace_listings
    SET status = 'sold',
        buyer_id = v_buyer_id,
        sold_at = NOW()
    WHERE id = p_listing_id;

    RETURN jsonb_build_object(
        'success', true,
        'h3_index', v_listing.h3_index,
        'price', v_listing.price
    );
END;
$$;
