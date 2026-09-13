'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    ArrowRight, 
    Search,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    const yBg = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
    const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    const yContent = useTransform(scrollYProgress, [0, 1], [0, -35]);
    const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    const handleScrollDown = () => {
        if (typeof window !== 'undefined') {
            const nextSection = document.getElementById('stats-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' });
            }
        }
    };

    return (
        <section
            ref={containerRef}
            className="relative min-h-[82vh] flex flex-col justify-center overflow-hidden pt-36 pb-16 sm:pt-40 sm:pb-20 bg-background"
        >
            {/* Architectural concentric circle lines with scroll parallax */}
            <motion.div 
                style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
                className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
            >
                <svg
                    className="w-[820px] h-[820px] max-w-none text-zinc-400/25 dark:text-zinc-500/20"
                    viewBox="0 0 1000 1000"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="500" cy="500" r="380" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 8" />
                    <circle cx="500" cy="500" r="200" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />

                    <g className="animate-spin origin-[500px_500px]" style={{ animationDuration: '120s', willChange: 'transform' }}>
                        <circle cx="500" cy="500" r="290" stroke="#E5A00D" strokeWidth="1" strokeDasharray="50 40 80 50" strokeOpacity="0.22" />
                    </g>
                </svg>
            </motion.div>

            {/* Ambient Radial Glow with scroll parallax */}
            <motion.div 
                style={{ y: yBg, opacity: opacityBg }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(229,160,13,0.12)_0%,transparent_70%)]" 
            />

            <motion.div 
                style={{ y: yContent }}
                className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl text-center space-y-6 sm:space-y-7"
            >
                
                {/* Announcement Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center justify-center"
                >
                    <Link
                        href="/blog/simulateur-examen-cctl"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-border text-xs text-text-secondary hover:border-accent-yellow/60 hover:text-text-primary transition-all shadow-xs group"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold text-text-primary">Nouveauté Juillet 2026 :</span>
                        <span>Simulateur examen CCTL</span>
                        <ArrowRight size={12} className="text-accent-yellow group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight text-text-primary leading-[1.08] max-w-5xl mx-auto"
                >
                    Tous les <span className="italic">CCTL,</span> <span className="italic">Prosits</span> <br className="hidden sm:inline" />
                    et{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10">livrables du CESI.</span>
                        <span className="absolute bottom-2 sm:bottom-3 left-0 right-0 h-3.5 sm:h-4 bg-accent-yellow/25 -z-0 rounded-sm" />
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-normal"
                >
                    Découvrez la plus grosse base de données de CCTL, Prosits et Livrables du CESI. Simplifiez vos révisions avec des outils créés sur-mesure.
                </motion.p>

                {/* Main Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl mx-auto space-y-3"
                >
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 w-5 h-5 text-text-muted pointer-events-none z-10" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un CCTL, un Prosit, un livrable..."
                            className="w-full pl-12 pr-28 py-4 rounded-2xl bg-surface-card border border-border focus:border-accent-yellow focus:outline-none text-sm text-text-primary shadow-lg transition-all placeholder:text-text-muted"
                        />
                        <Link 
                            href={searchQuery ? `/cctl?q=${encodeURIComponent(searchQuery)}` : '/cctl'}
                            className="absolute right-2.5 z-20"
                        >
                            <button className="px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                                <span>Explorer</span>
                                <ArrowRight size={13} />
                            </button>
                        </Link>
                    </div>

                    {/* Open Source / GitHub mention */}
                    <div className="flex items-center justify-center gap-2 text-xs text-text-muted pt-2 sm:pt-2.5">
                        <span>Plateforme 100% libre &amp;</span>
                        <a
                            href="https://github.com/anatol/kompas-cesi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-text-secondary hover:text-text-primary hover:underline transition-colors"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            <span>Open Source sur GitHub</span>
                            <span className="text-[10px] font-mono text-accent-yellow">↗</span>
                        </a>
                    </div>
                </motion.div>

            </motion.div>

            {/* Subtle Scroll Cue */}
            <motion.div
                style={{ opacity: indicatorOpacity }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="pt-10 flex justify-center z-10"
            >
                <button
                    onClick={handleScrollDown}
                    className="group inline-flex flex-col items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    aria-label="Faire défiler"
                >
                    <span className="text-[11px] font-mono tracking-wider uppercase">Découvrir</span>
                    <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown size={16} className="text-accent-yellow group-hover:translate-y-0.5 transition-transform" />
                    </motion.div>
                </button>
            </motion.div>
        </section>
    );
}

