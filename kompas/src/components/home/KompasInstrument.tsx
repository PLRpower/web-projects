'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileCheck, 
    FolderOpen, 
    Wand2, 
    BrainCircuit, 
    ArrowRight, 
    Compass, 
    Crosshair,
    Clock
} from 'lucide-react';
import Link from 'next/link';

export type AzimuthMode = 'cctl' | 'livrables' | 'prosits' | 'flashcards';

interface SectorInfo {
    id: AzimuthMode;
    cardinal: string;
    degree: number;
    title: string;
    shortTitle: string;
    subtitle: string;
    icon: React.ReactNode;
    tag: string;
    metric: string;
    metricLabel: string;
    accentColor: string;
    textColor: string;
    borderColor: string;
    bgBadge: string;
    link: string;
    previewSummary: string;
    bulletPoints: string[];
}

const SECTORS: Record<AzimuthMode, SectorInfo> = {
    cctl: {
        id: 'cctl',
        cardinal: 'N',
        degree: 0,
        title: 'Annales & Simulateur CCTL',
        shortTitle: 'Banque CCTL',
        subtitle: 'Questions d\'examens officielles annotées par les majors',
        icon: <FileCheck className="w-5 h-5 text-accent-yellow" />,
        tag: 'Cap 000° • Nord',
        metric: '2,540+',
        metricLabel: 'Questions corrigées',
        accentColor: '#E5A00D',
        textColor: 'text-amber-500 dark:text-amber-400',
        borderColor: 'border-amber-500/40',
        bgBadge: 'bg-amber-500/10',
        link: '/cctl',
        previewSummary: 'Simulateur chronométré /20 avec barème officiel CESI, explications détaillées et questions pièges décryptées.',
        bulletPoints: [
            'Architecture logicielle & React 19',
            'Bases de données SQL & NoSQL',
            'Réseaux & Cybersécurité',
            'Algorithmes & POO Java/C#'
        ]
    },
    livrables: {
        id: 'livrables',
        cardinal: 'E',
        degree: 90,
        title: 'Coffre-fort des Livrables',
        shortTitle: 'Livrables & DAT',
        subtitle: 'Dossiers d\'architecture et soutenances validés par jury',
        icon: <FolderOpen className="w-5 h-5 text-sky-500" />,
        tag: 'Cap 090° • Est',
        metric: '180+',
        metricLabel: 'DAT & Soutenances',
        accentColor: '#0ea5e9',
        textColor: 'text-sky-500 dark:text-sky-400',
        borderColor: 'border-sky-500/40',
        bgBadge: 'bg-sky-500/10',
        link: '/livrables',
        previewSummary: 'Templates complets de DAT (Dossier d\'Architecture Technique), PFR, cahiers des charges et diaporamas 19/20.',
        bulletPoints: [
            'Diagrammes C4 & Architecture Cloud',
            'Cahiers de tests & Recette validés',
            'Diaporamas de soutenance A3-A5',
            'Grilles d\'évaluation de tuteurs CESI'
        ]
    },
    prosits: {
        id: 'prosits',
        cardinal: 'S',
        degree: 180,
        title: 'Prosit Studio PBL',
        shortTitle: 'Générateur Prosit',
        subtitle: 'Méthode en 7 étapes & fiches de synthèse prêtes à l\'emploi',
        icon: <Wand2 className="w-5 h-5 text-orange-500" />,
        tag: 'Cap 180° • Sud',
        metric: '7 Étapes',
        metricLabel: 'Méthodologie PBL',
        accentColor: '#f97316',
        textColor: 'text-orange-500 dark:text-orange-400',
        borderColor: 'border-orange-500/40',
        bgBadge: 'bg-orange-500/10',
        link: '/prosits',
        previewSummary: 'Ne perdez plus 2h par séance : structurez problématique, hypothèses et plan d\'action instantanément.',
        bulletPoints: [
            'Extraction automatique des mots-clés',
            'Génération de plan d\'action structuré',
            'Export Markdown propre pour le groupe',
            'Archives des prosits de toutes les promos'
        ]
    },
    flashcards: {
        id: 'flashcards',
        cardinal: 'W',
        degree: 270,
        title: 'Flashcards & Répétition Espacée',
        shortTitle: 'Mémorisation Active',
        subtitle: 'Ancrage mémoriel pour retenir les notions d\'ingénierie sans effort',
        icon: <BrainCircuit className="w-5 h-5 text-emerald-500" />,
        tag: 'Cap 270° • Ouest',
        metric: '98%',
        metricLabel: 'Rétention à 30 jours',
        accentColor: '#10b981',
        textColor: 'text-emerald-500 dark:text-emerald-400',
        borderColor: 'border-emerald-500/40',
        bgBadge: 'bg-emerald-500/10',
        link: '/dashboard/flashcards',
        previewSummary: 'Système SM-2 d\'intervalles réguliers pour maîtriser les formules, définitions et design patterns.',
        bulletPoints: [
            'Principes SOLID & Design Patterns',
            'Complexité algorithmique & Big O',
            'Commandes Docker & Kubernetes',
            'Mathématiques pour l\'ingénieur'
        ]
    }
};

export default function KompasInstrument() {
    const [activeSector, setActiveSector] = useState<AzimuthMode>('cctl');
    const [needleAngle, setNeedleAngle] = useState(0);
    const [isHoveringDial, setIsHoveringDial] = useState(false);
    const dialRef = useRef<HTMLDivElement>(null);

    const current = SECTORS[activeSector];

    const handleSelectSector = (sector: AzimuthMode) => {
        setActiveSector(sector);
        setNeedleAngle(SECTORS[sector].degree);
    };

    // Mouse tracking effect when hovering the dial
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!dialRef.current) return;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate angle in degrees (0 deg = North)
        let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 90;
        if (angle < 0) angle += 360;
        
        setNeedleAngle(angle);
    };

    const handleMouseLeave = () => {
        setIsHoveringDial(false);
        // Snap back to active sector angle
        setNeedleAngle(SECTORS[activeSector].degree);
    };

    return (
        <div className="w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
            {/* COMPASS VISUAL INSTRUMENT (LEFT / TOP) */}
            <div className="relative flex-shrink-0 flex items-center justify-center p-2">
                {/* Background Luminous Aura */}
                <div 
                    className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-colors duration-700 pointer-events-none"
                    style={{ backgroundColor: current.accentColor }}
                />

                {/* Outer Millimeter Graduation Ring */}
                <div 
                    ref={dialRef}
                    onMouseEnter={() => setIsHoveringDial(true)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full border-2 border-border/80 bg-surface-card/90 shadow-2xl p-3 flex items-center justify-center cursor-crosshair select-none transition-all duration-300 hover:border-accent-yellow/50 backdrop-blur-md"
                >
                    {/* Concentric Technical Rings */}
                    <div className="absolute inset-4 rounded-full border border-dashed border-border/70 animate-spin" style={{ animationDuration: '90s' }} />
                    <div className="absolute inset-9 rounded-full border border-border/50" />
                    <div className="absolute inset-16 rounded-full border border-border/40 bg-surface/40" />

                    {/* Radar Sweep Effect */}
                    <div className="absolute inset-4 rounded-full overflow-hidden pointer-events-none opacity-25">
                        <div className="w-full h-full animate-radar-sweep origin-center bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(229,160,13,0.3)_360deg)]" />
                    </div>

                    {/* Degree Ticks (360 degrees ticks) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 380">
                        {Array.from({ length: 24 }).map((_, i) => {
                            const deg = i * 15;
                            const isMajor = deg % 45 === 0;
                            const rad = (deg - 90) * (Math.PI / 180);
                            const r1 = 175;
                            const r2 = isMajor ? 160 : 167;
                            const x1 = 190 + r1 * Math.cos(rad);
                            const y1 = 190 + r1 * Math.sin(rad);
                            const x2 = 190 + r2 * Math.cos(rad);
                            const y2 = 190 + r2 * Math.sin(rad);
                            return (
                                <g key={i}>
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="currentColor"
                                        strokeWidth={isMajor ? 2 : 1}
                                        className={isMajor ? 'text-accent-yellow' : 'text-text-muted/40'}
                                    />
                                    {isMajor && (
                                        <text
                                            x={190 + 148 * Math.cos(rad)}
                                            y={190 + 148 * Math.sin(rad) + 3}
                                            textAnchor="middle"
                                            className="text-[9px] font-mono fill-text-muted select-none"
                                        >
                                            {deg}°
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    {/* Crosshair Lines */}
                    <div className="absolute w-full h-[1px] bg-border/40 pointer-events-none" />
                    <div className="absolute h-full w-[1px] bg-border/40 pointer-events-none" />

                    {/* 4 CARDINAL AZIMUTH BUTTONS */}
                    {/* NORTH (CCTL) */}
                    <button
                        onClick={() => handleSelectSector('cctl')}
                        className={`absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer z-20 ${
                            activeSector === 'cctl'
                                ? 'bg-accent-yellow text-black shadow-lg shadow-accent-yellow/30 scale-110 ring-2 ring-accent-yellow/50'
                                : 'bg-surface-card/90 text-text-primary hover:bg-surface border border-border'
                        }`}
                        title="Nord : Banque & Simulateur CCTL"
                    >
                        <span className="text-[10px] opacity-75 font-semibold">000°</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span>N • CCTL</span>
                        </span>
                    </button>

                    {/* EAST (LIVRABLES) */}
                    <button
                        onClick={() => handleSelectSector('livrables')}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer z-20 ${
                            activeSector === 'livrables'
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-110 ring-2 ring-sky-500/50'
                                : 'bg-surface-card/90 text-text-primary hover:bg-surface border border-border'
                        }`}
                        title="Est : Dossiers d'Architecture & Livrables"
                    >
                        <span className="text-[10px] opacity-75 font-semibold">090°</span>
                        <span>E • LIVRABLES</span>
                    </button>

                    {/* SOUTH (PROSITS) */}
                    <button
                        onClick={() => handleSelectSector('prosits')}
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer z-20 ${
                            activeSector === 'prosits'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110 ring-2 ring-orange-500/50'
                                : 'bg-surface-card/90 text-text-primary hover:bg-surface border border-border'
                        }`}
                        title="Sud : Studio Prosit PBL en 7 Étapes"
                    >
                        <span>S • PROSITS</span>
                        <span className="text-[10px] opacity-75 font-semibold">180°</span>
                    </button>

                    {/* WEST (FLASHCARDS) */}
                    <button
                        onClick={() => handleSelectSector('flashcards')}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 cursor-pointer z-20 ${
                            activeSector === 'flashcards'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110 ring-2 ring-emerald-500/50'
                                : 'bg-surface-card/90 text-text-primary hover:bg-surface border border-border'
                        }`}
                        title="Ouest : Répétition Espacée & Flashcards"
                    >
                        <span className="text-[10px] opacity-75 font-semibold">270°</span>
                        <span>W • MEMORY</span>
                    </button>

                    {/* DYNAMIC COMPASS NEEDLE */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        animate={{ rotate: needleAngle }}
                        transition={{
                            type: 'spring',
                            stiffness: isHoveringDial ? 200 : 120,
                            damping: isHoveringDial ? 25 : 18
                        }}
                    >
                        {/* Needle Body (Double-pointed magnetic compass needle) */}
                        <div className="relative w-4 h-56 sm:h-64 flex flex-col items-center justify-between">
                            {/* North Arrow (Glowing Red / Gold Tip) */}
                            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[90px] sm:border-b-[105px] border-b-rose-600 dark:border-b-rose-500 drop-shadow-[0_0_12px_rgba(225,29,72,0.8)] filter" />

                            {/* South Arrow (Dark / Blueprint Slate Tip) */}
                            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[90px] sm:border-t-[105px] border-t-slate-400 dark:border-t-slate-600 drop-shadow-md" />
                        </div>
                    </motion.div>

                    {/* Central Pivot Hub */}
                    <div className="relative w-14 h-14 rounded-full bg-surface-card border-2 border-border shadow-xl flex items-center justify-center z-30 group">
                        <div className="w-7 h-7 rounded-full bg-accent-yellow text-black flex items-center justify-center font-mono text-[10px] font-extrabold shadow-sm animate-compass-pulse">
                            <Compass size={14} />
                        </div>
                        <div className="absolute -top-6 text-[9px] font-mono font-bold text-accent-yellow bg-surface/90 px-1.5 py-0.5 rounded border border-border/80 whitespace-nowrap">
                            {Math.round(needleAngle)}°
                        </div>
                    </div>
                </div>

                {/* Coordinate HUD Footnote */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-surface/90 border border-border/80 text-[10px] font-mono text-text-muted whitespace-nowrap shadow-xs flex items-center gap-1.5 backdrop-blur-sm">
                    <Crosshair size={11} className="text-accent-yellow" />
                    <span>SYS.NAV // LAT 48.89°N • LON 2.21°E</span>
                </div>
            </div>

            {/* DYNAMIC TELEMETRY HUD CARD (RIGHT / BOTTOM) */}
            <div className="flex-1 w-full max-w-xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="card-editorial rounded-3xl p-6 sm:p-7 bg-surface-card border border-border shadow-xl relative overflow-hidden"
                    >
                        {/* Ambient decorative grid line */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-millimeter opacity-30 pointer-events-none" />

                        {/* Header Row */}
                        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4 mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-surface border border-border/80 shadow-xs">
                                    {current.icon}
                                </div>
                                <div>
                                    <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-bold">
                                        {current.tag}
                                    </div>
                                    <h3 className="font-serif text-2xl font-normal text-text-primary">
                                        {current.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xl sm:text-2xl font-serif font-bold text-accent-yellow">
                                    {current.metric}
                                </div>
                                <div className="text-[10px] font-mono text-text-muted">
                                    {current.metricLabel}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-secondary leading-relaxed mb-5">
                            {current.previewSummary}
                        </p>

                        {/* Real CESI Module Highlights */}
                        <div className="space-y-2 mb-6">
                            <div className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold">
                                // Modules &amp; Contenus Clés
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {current.bulletPoints.map((point, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface/70 border border-border/60 text-xs font-medium text-text-primary"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow shrink-0" />
                                        <span className="truncate">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action CTA & Quick Switcher */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
                            <div className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                                <Clock size={13} className="text-accent-yellow" />
                                <span>Mise à jour en continu</span>
                            </div>

                            <Link href={current.link} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2 cursor-pointer group">
                                    <span>Explorer {current.shortTitle}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Instrument Azimuth Quick Switcher Pills */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {(Object.keys(SECTORS) as AzimuthMode[]).map((key) => {
                        const sec = SECTORS[key];
                        const isActive = activeSector === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleSelectSector(key)}
                                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer border ${
                                    isActive
                                        ? 'bg-surface-card text-accent-yellow border-accent-yellow font-bold shadow-xs'
                                        : 'bg-surface/50 text-text-muted hover:text-text-primary border-border/60'
                                }`}
                            >
                                [{sec.cardinal}] {sec.shortTitle}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
