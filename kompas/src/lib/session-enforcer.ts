'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'kompas_active_session_id';
const SESSION_BROADCAST_CHANNEL = 'kompas_session_channel';

/**
 * Initializes and enforces a single active session for the user account.
 */
export function initSingleSessionEnforcer(userEmail?: string): string {
    if (typeof window === 'undefined') return '';

    const newSessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(SESSION_KEY, newSessionId);

    // Broadcast new active session
    if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel(SESSION_BROADCAST_CHANNEL);
        channel.postMessage({
            type: 'new_session_started',
            sessionId: newSessionId,
            userEmail: userEmail || 'etudiant@viacesi.fr',
            timestamp: Date.now()
        });
    }

    return newSessionId;
}

/**
 * React hook to listen for concurrent session conflicts and trigger forced logout modal.
 */
export function useSingleSessionEnforcer() {
    const [isSessionRevoked, setIsSessionRevoked] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string>('');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let sessionId = localStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = initSingleSessionEnforcer();
        }
        setCurrentSessionId(sessionId);

        // Listen via BroadcastChannel
        let channel: BroadcastChannel | null = null;
        if ('BroadcastChannel' in window) {
            channel = new BroadcastChannel(SESSION_BROADCAST_CHANNEL);
            channel.onmessage = (event) => {
                if (event.data?.type === 'new_session_started' && event.data?.sessionId !== sessionId) {
                    setIsSessionRevoked(true);
                }
            };
        }

        // Listen via Storage Event (cross-browser / cross-window)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === SESSION_KEY && e.newValue && e.newValue !== sessionId) {
                setIsSessionRevoked(true);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            if (channel) channel.close();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const reconnectHere = () => {
        const newId = initSingleSessionEnforcer();
        setCurrentSessionId(newId);
        setIsSessionRevoked(false);
    };

    return { isSessionRevoked, reconnectHere };
}
