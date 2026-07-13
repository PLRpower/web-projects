'use client';

import { CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: "Découverte",
        price: "0€",
        description: "Pour découvrir la plateforme.",
        features: [
            "Accès aux archives (3 dernières années)",
            "Mode entraînement basique (20 questions/jour)",
            "3 résumés IA / mois",
            "Statistiques basiques"
        ],
        cta: "Commencer gratuitement",
        highlight: false
    },
    {
        name: "Premium",
        price: "4.99€",
        description: "L'essentiel pour réussir.",
        features: [
            "Archives illimitées (Toutes les années)",
            "Mode entraînement illimité",
            "Résumés IA illimités",
            "Suppression des publicités",
            "Support prioritaire"
        ],
        cta: "Passer Premium",
        highlight: false
    },
    {
        name: "Ultime",
        price: "6.99€",
        description: "La boîte à outils ultime de l'ingénieur.",
        features: [
            "Tout du pack Premium",
            "Coach IA Personnel (Tuteur 24/7)",
            "Correction détaillée et expliquée par IA",
            "Statistiques de performance avancées",
            "Badge 'Ultime' sur le profil",
            "Accès en avant-première aux nouvelles features"
        ],
        cta: "Devenir Ultime",
        highlight: true
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative">
            {/* Ambient Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-accent-orange/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Investissez dans <span className="text-accent-orange">votre avenir</span></h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Des tarifs adaptés au budget étudiant. Rentabilisez votre année dès le premier mois.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`transform transition-all duration-300 relative rounded-3xl ${tier.highlight
                                ? 'scale-105 z-10'
                                : 'glass hover:bg-surface-highlight/10 dark:hover:bg-white/5'
                                }`}
                        >
                            {tier.highlight && (
                                <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-3xl blur opacity-20" />
                            )}

                            <div className={`relative p-8 rounded-3xl h-full flex flex-col ${tier.highlight
                                ? 'bg-surface border border-accent-yellow/50 shadow-2xl shadow-accent-orange/10'
                                : ''
                                }`}>
                                {tier.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-yellow to-accent-orange text-black font-bold px-4 py-1 rounded-full text-sm flex items-center gap-2">
                                        <Zap size={16} fill="currentColor" />
                                        MEILLEURE OFFRE
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-xl font-bold mb-2 ${tier.highlight ? 'text-accent-yellow' : 'text-text-primary'}`}>
                                        {tier.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold font-syne">{tier.price}</span>
                                        <span className="text-text-secondary">/ mois</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-2">{tier.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2
                                                className={`shrink-0 mt-0.5 ${tier.highlight ? 'text-accent-orange' : 'text-text-secondary'}`}
                                                size={18}
                                            />
                                            <span className={`text-sm ${tier.highlight ? 'text-text-primary' : 'text-text-secondary'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/register"
                                    className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${tier.highlight
                                        ? 'bg-gradient-to-r from-accent-yellow to-accent-orange text-black hover:brightness-110 shadow-lg shadow-accent-yellow/20'
                                        : 'bg-surface-highlight/50 text-text-primary hover:bg-surface-highlight'
                                        }`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
