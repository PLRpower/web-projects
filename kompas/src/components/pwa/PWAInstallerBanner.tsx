'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    WifiOff,
    Download,
    Smartphone,
    X
} from 'lucide-react';
import { useNetworkStatus } from '@/lib/offline-storage';
import { Button } from '@/components/ui/button';

export function PWAInstallerBanner() {
    const { isOnline } = useNetworkStatus();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Register Service Worker
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((reg) => {
                    console.log('Kompas PWA Service Worker registered:', reg.scope);
                })
                .catch((err) => {
                    console.warn('Kompas Service Worker registration skipped:', err);
                });
        }

        // Listen for beforeinstallprompt (Android / Chrome)
        const handleBeforeInstall = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            const dismissed = localStorage.getItem('kompas_pwa_dismissed');
            if (!dismissed) {
                setShowInstallPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallPrompt(false);
            }
            setDeferredPrompt(null);
        } else {
            // Fallback for iOS or already installed
            alert(
                "Sur iPhone/iPad : touchez le bouton Partager ⎋ dans Safari puis sélectionnez « Sur l'écran d'accueil » pour installer Kompas !"
            );
        }
    };

    const handleDismissInstall = () => {
        setShowInstallPrompt(false);
        setIsDismissed(true);
        try {
            localStorage.setItem('kompas_pwa_dismissed', 'true');
        } catch {}
    };

    return (
        <>
            {/* 1. Offline Mode Alert Banner (Appears when connection is lost) */}
            {!isOnline && (
                <div className="fixed top-16 left-0 right-0 z-50 px-4 py-2.5 bg-amber-500 text-black font-semibold text-xs shadow-lg animate-in slide-in-from-top duration-300">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                        <div className="flex items-center gap-2">
                            <WifiOff className="w-4 h-4 shrink-0" />
                            <span>
                                <strong>Mode Hors-Ligne Actif</strong> — Connexion Internet perdue. Vos fiches téléchargées restent consultables sans réseau.
                            </span>
                        </div>
                        <Link href="/dashboard/flashcards">
                            <button
                                type="button"
                                className="px-3 py-1 rounded-lg bg-black text-white text-[11px] font-bold hover:bg-black/80 transition-colors shrink-0"
                            >
                                Ouvrir mes Flashcards Hors-Ligne →
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* 2. PWA Mobile Install Banner */}
            {showInstallPrompt && !isDismissed && isOnline && (
                <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-3xl bg-surface-card border-2 border-accent-yellow/50 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
                    <button
                        type="button"
                        onClick={handleDismissInstall}
                        className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                        aria-label="Fermer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-2xl bg-accent-yellow text-black font-bold shrink-0 mt-0.5 shadow-md shadow-accent-yellow/20">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 pr-4">
                            <h4 className="font-serif text-sm font-bold text-text-primary">
                                Réviser dans les transports
                            </h4>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Installez Kompas sur votre smartphone pour réviser vos fiches et CCTL même sans réseau (train, métro).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border/60">
                        <Button
                            size="sm"
                            variant="premium"
                            onClick={handleInstallClick}
                            className="flex-1 font-bold text-xs shadow-md shadow-accent-yellow/20"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Installer l&apos;application
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDismissInstall}
                            className="text-xs text-text-secondary"
                        >
                            Plus tard
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
