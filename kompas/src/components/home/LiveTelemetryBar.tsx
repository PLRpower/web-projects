'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Radio, MapPin, Award } from 'lucide-react';

interface TelemetryEvent {
    id: string;
    campus: string;
    promo: string;
    action: string;
    detail: string;
    time: string;
    highlight: string;
}

const EVENTS: TelemetryEvent[] = [
    {
        id: '1',
        campus: 'Lyon',
        promo: 'A3 FISA Info',
        action: 'Simulation CCTL terminée',
        detail: 'Architecture Web & React 19',
        time: 'Il y a 2 min',
        highlight: '19.0/20'
    },
    {
        id: '2',
        campus: 'Paris Nanterre',
        promo: 'A4 FISE',
        action: 'Livrable de Projet déposé',
        detail: 'Système IoT & Cloud AWS',
        time: 'Il y a 6 min',
        highlight: 'Validé Jury'
    },
    {
        id: '3',
        campus: 'Toulouse',
        promo: 'A2 Prépa',
        action: 'Prosit synthétisé',
        detail: 'Algèbre linéaire & Matrices',
        time: 'Il y a 11 min',
        highlight: 'Export MD'
    },
    {
        id: '4',
        campus: 'Bordeaux',
        promo: 'A5 Mastère',
        action: 'Deck Flashcards révisé',
        detail: 'Cybersécurité & Normes ISO 27001',
        time: 'Il y a 14 min',
        highlight: '100% Maîtrisé'
    },
    {
        id: '5',
        campus: 'Lille',
        promo: 'A3 FISA BTP',
        action: 'CCTL annoté',
        detail: 'Résistance des Matériaux (RDM)',
        time: 'Il y a 18 min',
        highlight: 'Corrigé Type'
    },
    {
        id: '6',
        campus: 'Nantes',
        promo: 'A1 Prépa',
        action: 'Nouveau membre certifié',
        detail: 'Promo Ingénieur 2029',
        time: 'Il y a 23 min',
        highlight: '@viacesi.fr'
    }
];

export default function LiveTelemetryBar() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % EVENTS.length);
        }, 3800);
        return () => clearInterval(interval);
    }, []);

    const ev = EVENTS[currentIndex];

    return (
        <div className="w-full bg-surface/60 border-y border-border/70 backdrop-blur-md py-2.5 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                
                {/* Left Live Indicator */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>RADAR // 25 CAMPUS CONNECTÉS</span>
                    </div>
                    <span className="text-text-muted hidden md:inline font-mono text-[11px]">|</span>
                    <span className="text-text-secondary hidden md:inline text-[11px]">Flux d&apos;entraide en temps réel</span>
                </div>

                {/* Center Dynamic Telemetry Event Banner */}
                <div className="flex-1 w-full sm:w-auto flex items-center justify-center overflow-hidden h-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={ev.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2 text-xs font-mono truncate"
                        >
                            <span className="flex items-center gap-1 text-accent-yellow font-semibold">
                                <MapPin size={12} />
                                {ev.campus}
                            </span>
                            <span className="text-text-muted">({ev.promo}) :</span>
                            <span className="text-text-primary font-medium truncate">{ev.action}</span>
                            <span className="text-text-muted hidden lg:inline truncate">« {ev.detail} »</span>
                            <span className="px-1.5 py-0.2 rounded bg-surface-card border border-border text-[10px] font-bold text-accent-yellow">
                                {ev.highlight}
                            </span>
                            <span className="text-text-muted text-[10px] hidden sm:inline">• {ev.time}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Statistics Badge */}
                <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-text-muted shrink-0">
                    <span className="flex items-center gap-1">
                        <ShieldCheck size={13} className="text-accent-yellow" />
                        <span>Ressources vérifiées</span>
                    </span>
                    <span>•</span>
                    <span className="text-text-secondary font-semibold">4 820+ fiches actives</span>
                </div>
            </div>
        </div>
    );
}
