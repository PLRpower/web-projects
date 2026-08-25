'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Wand2, FolderOpen, MapPin } from 'lucide-react';
import Link from 'next/link';

interface StatCounts {
    cctlCount: number;
    prositCount: number;
    livrableCount: number;
    campusCount: number;
}

export default function Stats() {
    const [counts, setCounts] = useState<StatCounts>({
        cctlCount: 0,
        prositCount: 0,
        livrableCount: 0,
        campusCount: 25
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                if (data.success && data.stats) {
                    setCounts(data.stats);
                }
            } catch (err) {
                console.error('Failed to load dynamic stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        { 
            value: counts.cctlCount.toLocaleString('fr-FR'), 
            label: "CCTL Archivés", 
            detail: "Sujets réels du cycle Prépa à l'A5",
            icon: <Layers className="w-5 h-5 text-accent-yellow" />,
            href: "/cctl"
        },
        { 
            value: counts.prositCount.toLocaleString('fr-FR'), 
            label: "Prosits PBL", 
            detail: "Rédigés selon la méthode en 7 étapes",
            icon: <Wand2 className="w-5 h-5 text-accent-yellow" />,
            href: "/prosits"
        },
        { 
            value: counts.livrableCount.toLocaleString('fr-FR'), 
            label: "Livrables de Projet", 
            detail: "Dossiers techniques, rapports & diaporamas",
            icon: <FolderOpen className="w-5 h-5 text-accent-yellow" />,
            href: "/livrables"
        },
        { 
            value: counts.campusCount.toString(), 
            label: "Campus CESI Référencés", 
            detail: "Ressources partagées France entière",
            icon: <MapPin className="w-5 h-5 text-accent-yellow" />
        },
    ];

    return (
        <section className="py-16 sm:py-20 relative overflow-hidden bg-surface/30 border-y border-border/60">
            {/* Top & Bottom Precision Ruler Graduations */}
            <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(90deg,var(--border)_0,var(--border)_1px,transparent_1px,transparent_12px)] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-2 bg-[repeating-linear-gradient(90deg,var(--border)_0,var(--border)_1px,transparent_1px,transparent_12px)] opacity-60 pointer-events-none" />

            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-millimeter opacity-25 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const isClickable = Boolean(stat.href);

                        const content = (
                            <div className="space-y-3 relative z-10">
                                {/* Icon Header */}
                                <div className={`p-2 rounded-2xl bg-surface border border-border/80 w-max shadow-xs transition-all ${
                                    isClickable ? 'group-hover:border-accent-yellow/60 group-hover:bg-surface-card' : ''
                                }`}>
                                    {stat.icon}
                                </div>

                                {/* Metric Number */}
                                <div>
                                    <div className={`text-4xl sm:text-5xl font-serif tracking-tight font-normal text-text-primary transition-colors duration-300 ${
                                        isClickable ? 'group-hover:text-accent-yellow' : ''
                                    }`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-semibold text-text-primary mt-1">
                                        {stat.label}
                                    </div>
                                </div>

                                <p className="text-xs text-text-secondary leading-relaxed font-normal">
                                    {stat.detail}
                                </p>
                            </div>
                        );

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                viewport={{ once: true }}
                                className={`relative px-2 sm:px-4 py-2 flex flex-col justify-between ${isClickable ? 'group' : ''}`}
                            >
                                {stat.href ? (
                                    <Link 
                                        href={stat.href} 
                                        className="block cursor-pointer transition-transform hover:-translate-y-0.5"
                                    >
                                        {content}
                                    </Link>
                                ) : (
                                    content
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
