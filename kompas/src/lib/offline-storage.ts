'use client';

import { useState, useEffect } from 'react';
import { FlashcardDeck } from '@/types/flashcard';

const OFFLINE_DECKS_KEY = 'kompas_offline_flashcard_decks';
const OFFLINE_CCTLS_KEY = 'kompas_offline_cctls';

/**
 * Saves a flashcard deck for offline practice (e.g. in bus / train / metro).
 */
export function saveDeckOffline(deck: FlashcardDeck): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const savedDecks = getOfflineDecks();
        const existingIndex = savedDecks.findIndex(d => d.id === deck.id);

        if (existingIndex >= 0) {
            savedDecks[existingIndex] = deck;
        } else {
            savedDecks.push(deck);
        }

        localStorage.setItem(OFFLINE_DECKS_KEY, JSON.stringify(savedDecks));
        window.dispatchEvent(new Event('kompas_offline_updated'));
        return true;
    } catch (e) {
        console.error('Failed to save deck offline:', e);
        return false;
    }
}

/**
 * Removes a flashcard deck from offline cache.
 */
export function removeDeckOffline(deckId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const savedDecks = getOfflineDecks();
        const filtered = savedDecks.filter(d => d.id !== deckId);
        localStorage.setItem(OFFLINE_DECKS_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new Event('kompas_offline_updated'));
        return true;
    } catch (e) {
        console.error('Failed to remove deck offline:', e);
        return false;
    }
}

/**
 * Retrieves all offline saved flashcard decks.
 */
export function getOfflineDecks(): FlashcardDeck[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(OFFLINE_DECKS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn('Failed to parse offline decks:', e);
    }
    return [];
}

/**
 * Checks if a specific deck is downloaded offline.
 */
export function isDeckSavedOffline(deckId: string): boolean {
    const decks = getOfflineDecks();
    return decks.some(d => d.id === deckId);
}

/**
 * React hook to monitor network status (Online / Offline).
 */
export function useNetworkStatus(): { isOnline: boolean } {
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline };
}
