'use client';

import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: "Découverte",
        price: "0€",
        period: "Gratuit à vie",
        description: "Pour explorer la bibliothèque et tester vos connaissances.",
        features: [
            "Accès aux archives CCTL (3 dernières années)",
            "Mode entraînement guidé (20 questions / jour)",
            "Consultation libre des corrigés",
            "Profil étudiant & statistiques de base"
        ],
        cta: "Commencer gratuitement",
        highlight: false,
        badge: "ESSENTIEL"
    },
    {
        name: "Premium",
        price: "4.99€",
        period: "par mois • sans engagement",
        description: "La formule complète pour valider tous ses blocs sans stress.",
        features: [
            "Archives CCTL illimitées (Toutes années & promos)",
            "Simulateur d'examen chronométré noté sur 20",
            "Générateur de Prosits (7 étapes)",
            "Flashcards illimitées & répétition espacée",
            "Téléchargement direct des PDFs originaux"
        ],
        cta: "Passer Premium",
        highlight: true,
        badge: "POPULAIRE PROMO"
    },
    {
        name: "Ultime",
        price: "6.99€",
        period: "par mois • sans engagement",
        description: "Le copilote d'ingénierie boosté par l'IA pour viser les majors.",
        features: [
            "Tout le contenu du pack Premium",
            "Tuteur IA 24/7 avec explications pas à pas",
            "Correction de code détaillée (TypeScript, SQL, C)",
            "Génération automatique de livrables Markdown",
            "Badge exclusif « Membre Ultime » sur le profil"
        ],
        cta: "Devenir Ultime",
        highlight: false,
        badge: "ACCÉLÉRATEUR IA"
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                <div className="text-center mb-16 space-y-3 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-xs font-mono font-semibold uppercase tracking-wider text-text-secondary border border-border">
                        <span className="w-2 h-2 rounded-full bg-accent-yellow" />
                        FORMULES // INVESTISSEMENT ÉTUDIANT
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-text-primary tracking-tight">
                        Des tarifs adaptés au <span className="italic font-normal">budget étudiant</span>.
                    </h2>
                    <p className="text-sm sm:text-base text-text-secondary">
                        Rentabilisez votre semestre dès le premier CCTL validé.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                                tier.highlight
                                    ? 'bg-surface-card border-2 border-accent-yellow shadow-xl shadow-accent-yellow/10 md:-translate-y-2'
                                    : 'card-editorial bg-surface-card'
                            }`}
                        >
                            {/* Popular Ribbon */}
                            {tier.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent-yellow text-black font-mono font-bold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                                    <Zap size={12} fill="currentColor" />
                                    {tier.badge}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-2xl font-normal text-text-primary">
                                            {tier.name}
                                        </h3>
                                        {!tier.highlight && (
                                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface text-text-muted border border-border">
                                                {tier.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-secondary mt-1">
                                        {tier.description}
                                    </p>
                                </div>

                                <div className="space-y-0.5 pb-4 border-b border-border/60">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl sm:text-5xl font-serif font-normal text-text-primary">
                                            {tier.price}
                                        </span>
                                    </div>
                                    <div className="text-xs font-mono text-text-muted">
                                        {tier.period}
                                    </div>
                                </div>

                                <ul className="space-y-3.5">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary">
                                            <div className="w-5 h-5 rounded-md bg-accent-yellow/15 text-accent-yellow flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                                <Check size={13} />
                                            </div>
                                            <span className="leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-8 mt-8">
                                <Link href="/register" className="block w-full">
                                    <button
                                        className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                            tier.highlight
                                                ? 'bg-accent-yellow text-black hover:brightness-105 shadow-md shadow-accent-yellow/20'
                                                : 'bg-surface text-text-primary hover:bg-surface-highlight border border-border'
                                        }`}
                                    >
                                        <span>{tier.cta}</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

