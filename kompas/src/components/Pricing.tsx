'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Check, ArrowRight, ShieldCheck, Loader2, Sparkles } from 'lucide-react';

export default function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: isAnnual ? 'annual' : 'monthly' }),
            });
            const data = await res.json();
            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Erreur lors de l\'initialisation du paiement Stripe');
            }
        } catch (e) {
            console.error('Stripe checkout error:', e);
            alert('Impossible de contacter le service de paiement');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="pricing" className="py-4 sm:py-6 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent-yellow/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-2 sm:px-4 relative z-10 max-w-5xl">
                {/* Section Header */}
                <div className="text-center mb-10 space-y-3 max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                        Une seule formule. <br className="hidden sm:block" />
                        <span className="italic font-normal text-accent-yellow">Toutes les fonctionnalités.</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Pas de surprise ni de fonctionnalités bloquées. Débloquez la suite complète pour réussir votre année CESI.
                    </p>

                    {/* Rigid Grid Toggle (Zero Layout Shift) */}
                    <div className="pt-4 flex justify-center">
                        <div className="bg-surface/90 backdrop-blur-md border border-border p-1.5 rounded-2xl grid grid-cols-2 w-[410px] max-w-full gap-1.5 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setIsAnnual(false)}
                                className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center border ${
                                    !isAnnual
                                        ? 'bg-surface-card text-text-primary shadow-sm border-border/80'
                                        : 'bg-transparent text-text-secondary hover:text-text-primary border-transparent'
                                }`}
                            >
                                Paiement Mensuel
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAnnual(true)}
                                className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                                    isAnnual
                                        ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/20 border-accent-yellow font-bold'
                                        : 'bg-transparent text-text-secondary hover:text-text-primary border-transparent'
                                }`}
                            >
                                <span>Paiement Annuel</span>
                                <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md font-bold border transition-colors ${
                                    isAnnual
                                        ? 'bg-black/15 text-black border-black/10'
                                        : 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40'
                                }`}>
                                    -33%
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards Grid - Asymmetric & Spacious */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
                    {/* Free Card (Col-span 5) */}
                    <div className="lg:col-span-5 rounded-3xl p-8 flex flex-col justify-between card-editorial bg-surface-card/90 border border-border/70 relative backdrop-blur-sm">
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-serif text-2xl font-normal text-text-primary">
                                        Découverte
                                    </h3>
                                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface text-text-muted border border-border">
                                        GRATUIT
                                    </span>
                                </div>
                                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                                    Pour explorer la bibliothèque et tester vos connaissances de base.
                                </p>
                            </div>

                            <div className="space-y-0.5 pb-5 border-b border-border/60">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-serif font-normal text-text-primary">
                                        0€
                                    </span>
                                </div>
                                <div className="text-xs font-mono text-text-muted">
                                    Accès permanent sans carte bancaire
                                </div>
                            </div>

                            <ul className="space-y-3">
                                {[
                                    "Accès aux annales de CCTL récentes",
                                    "5 sessions d'entraînement mensuelles",
                                    "Consultation des fiches Prosits",
                                    "Statistiques de base"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary">
                                        <div className="w-4 h-4 rounded bg-surface text-text-muted flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                            <Check size={11} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Imposing & Spacious Premium Pass Card (Col-span 7) */}
                    <div className="lg:col-span-7 rounded-3xl p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-surface-card via-surface-card to-surface-card border-2 border-accent-yellow shadow-2xl shadow-accent-yellow/15 relative overflow-hidden transition-all duration-300 md:-translate-y-1">
                        {/* Background Millimeter pattern */}
                        <div className="absolute inset-0 bg-millimeter opacity-25 pointer-events-none" />

                        {/* Top Badge */}
                        <div className="absolute top-0 right-0 bg-accent-yellow text-black font-mono font-bold text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-xs flex items-center gap-1.5">
                            <Sparkles size={13} fill="currentColor" />
                            CHOIX RECOMMANDÉ
                        </div>

                        <div className="space-y-7 relative z-10">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-9 h-9 flex items-center justify-center p-1.5 rounded-xl bg-surface border border-accent-yellow/40 shadow-xs">
                                        <Logo size={28} />
                                    </div>
                                    <h3 className="font-serif text-3xl sm:text-4xl font-normal text-text-primary">
                                        Kompas <span className="italic font-normal text-accent-yellow">Premium</span>
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-text-secondary mt-2 max-w-lg leading-relaxed">
                                    CCTLs illimités, simulateur chronométré, tuteur IA 24/7, assistant Prosits &amp; génération de livrables pour sécuriser votre année.
                                </p>
                            </div>

                            {/* Price display with billing details and clear visibility */}
                            <div className="p-5 sm:p-6 rounded-2xl bg-surface/90 border border-border/80 space-y-2 shadow-inner min-h-[110px] flex flex-col justify-center">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl sm:text-6xl font-serif font-bold text-text-primary tracking-tight tabular-nums">
                                        {isAnnual ? '3,33€' : '4,99€'}
                                    </span>
                                    <span className="text-sm font-mono text-text-muted font-medium">
                                        / mois
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-accent-yellow font-semibold leading-relaxed">
                                    {isAnnual
                                        ? '✨ Soit 39,99 € par an • 4 mois offerts (Économisez 19,89 €)'
                                        : 'Facturé 4,99 € par mois • Sans engagement'}
                                </p>
                            </div>

                            {/* Features list */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-bold">
                                    Tout ce qui est débloqué sans limite :
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        "Générateur IA de CCTL Blancs (Entraînement infini)",
                                        "Coach IA Pas-à-Pas 24/7 sur chaque erreur",
                                        "Archives CCTL illimitées (Promos A1 à A5, FISA/FISE)",
                                        "Simulateur chronométré avec notation CESI (A à D)",
                                        "Générateur IA de Prosits (Méthode 7 étapes)",
                                        "Générateur de Livrables & Export PDF Pro"
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
                                            <div className="w-5 h-5 rounded-md bg-accent-yellow/20 text-accent-yellow flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                                <Check size={13} />
                                            </div>
                                            <span className="leading-snug font-medium text-text-primary/95">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="pt-8 mt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                                <ShieldCheck size={16} className="text-accent-yellow shrink-0" />
                                <span>Sans engagement • Résiliable en 1 clic</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-xs sm:text-sm bg-accent-yellow text-black hover:brightness-105 transition-all cursor-pointer shadow-xl shadow-accent-yellow/20 flex items-center justify-center gap-2.5 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Redirection Stripe...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Débloquer</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Free Crowdsourcing Alternative */}
                        <div className="pt-4 mt-2 border-t border-border/40 text-center relative z-10">
                            <p className="text-xs text-text-secondary">
                                🎁 <strong>Option 100% Gratuite :</strong> Contribuez avec <strong>5 Livrables</strong> ou <strong>10 Prosits</strong> pour débloquer 1 Mois Premium offert (limite : 1 mois par compte).{' '}
                                <Link href="/dashboard/livrables" className="text-accent-yellow font-bold hover:underline">
                                    Déposer un Livrable →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
