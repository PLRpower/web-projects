'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    campus: string;
    content: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Thomas D.",
        role: "A3 FISA Informatique",
        campus: "Lyon",
        content: "Kompas m'a permis d'aborder le CCTL d'Architecture Web en toute confiance. S'entraîner sur les annales réelles avec les explications détaillées permet d'éviter tous les pièges récurrents."
    },
    {
        id: 2,
        name: "Sarah L.",
        role: "A4 FISA Systèmes & Cloud",
        campus: "Paris Nanterre",
        content: "Le générateur de Prosit en 7 étapes fait gagner un temps précieux à toute l'équipe. On exporte la synthèse directement en Markdown pour nos dossiers de projet."
    },
    {
        id: 3,
        name: "Lucas M.",
        role: "A2 Prépa Intégrée",
        campus: "Bordeaux",
        content: "Plus besoin de chercher des heures sur des canaux Discord ou des drives perdus. Toutes les annales de maths et d'algorithmique sont centralisées, propres et corrigées."
    },
    {
        id: 4,
        name: "Camille R.",
        role: "A4 FISE Généraliste",
        campus: "Toulouse",
        content: "Les annales de physique/RDM et les flashcards de révision sont particulièrement utiles lors des semaines de partiels bloqués. Une ergonomie moderne et efficace."
    },
    {
        id: 5,
        name: "Alexandre B.",
        role: "A3 FISA BTP",
        campus: "Lille",
        content: "Les corrigés annotés par les anciens élèves sont d'une précision exemplaire. On comprend immédiatement les attentes et le barème des concepteurs d'épreuves."
    },
    {
        id: 6,
        name: "Inès K.",
        role: "A5 Mastère Cybersécurité",
        campus: "Nantes",
        content: "Idéal pour réviser les normes ISO et l'architecture réseau. Les modèles de livrables ont parfaitement cadré notre soutenance finale de projet."
    }
];

// Double the array for seamless infinite looping
const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export default function Testimonials() {
    return (
        <section className="py-20 sm:py-28 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl mb-12 sm:mb-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/70">
                    <div className="space-y-3 max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                            Ils ont validé <span className="italic font-normal">leurs semestres</span> avec Kompas.
                        </h2>
                    </div>

                    <p className="text-sm sm:text-base text-text-secondary max-w-md leading-relaxed">
                        Retours d&apos;expérience d&apos;élèves-ingénieurs sur les 25 campus du CESI.
                    </p>
                </div>
            </div>

            {/* INFINITE SMOOTH HORIZONTAL MARQUEE */}
            <div className="relative w-full overflow-hidden py-4">
                {/* Left & Right Fade Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                <div className="animate-marquee gap-6 sm:gap-8">
                    {MARQUEE_ITEMS.map((t, idx) => (
                        <div
                            key={idx}
                            className="w-[380px] sm:w-[440px] md:w-[460px] shrink-0 p-7 sm:p-8 rounded-2xl bg-surface-card border border-border shadow-md flex flex-col justify-between space-y-6 group hover:border-accent-yellow/50 transition-all duration-300"
                        >
                            {/* Quote */}
                            <p className="font-serif text-base sm:text-lg md:text-xl italic text-text-primary leading-relaxed tracking-tight">
                                &ldquo;{t.content}&rdquo;
                            </p>

                            {/* Student Info Footer */}
                            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-xs sm:text-sm font-mono text-text-primary shrink-0 shadow-2xs">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <div className="font-semibold text-text-primary text-sm truncate">
                                            {t.name}
                                        </div>
                                        <div className="text-xs font-mono text-text-muted truncate">{t.role}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted shrink-0">
                                    <MapPin size={13} className="text-accent-yellow" />
                                    <span>Campus {t.campus}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
