'use client';

import { useState } from 'react';
import { Sparkles, Zap, Check, X, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PremiumGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    feature?: string;
}

export function PremiumGateModal({
    isOpen,
    onClose,
    title = "Fonctionnalité réservée aux membres Premium",
    description = "Passez à Kompas Premium pour débloquer l'accès complet et illimité à toute la plateforme.",
    feature
}: PremiumGateModalProps) {
    const [isAnnual, setIsAnnual] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

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
                alert(data.error || 'Erreur lors du démarrage du paiement');
            }
        } catch (e) {
            console.error('Checkout redirect error:', e);
            alert('Impossible de contacter le serveur de paiement');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-surface-card border-2 border-accent-yellow rounded-3xl p-6 sm:p-8 shadow-2xl shadow-accent-yellow/10 overflow-hidden">
                {/* Millimeter background */}
                <div className="absolute inset-0 bg-millimeter opacity-20 pointer-events-none" />

                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer z-10"
                >
                    <X size={18} />
                </button>

                <div className="space-y-6 relative z-10">
                    {/* Header Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 text-xs font-mono font-bold uppercase tracking-wider">
                        <Zap size={13} fill="currentColor" />
                        <span>ACCÈS PREMIUM REQUIS</span>
                    </div>

                    <div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary">
                            {title}
                        </h3>
                        {feature && (
                            <p className="text-xs font-mono text-accent-yellow mt-1 font-semibold">
                                Option : {feature}
                            </p>
                        )}
                        <p className="text-xs sm:text-sm text-text-secondary mt-2">
                            {description}
                        </p>
                    </div>

                    {/* Toggle plan in modal */}
                    <div className="bg-surface border border-border p-1 rounded-xl flex items-center justify-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setIsAnnual(false)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                !isAnnual
                                    ? 'bg-surface-card text-text-primary shadow-xs border border-border/80'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            4,99 € / mois
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAnnual(true)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                isAnnual
                                    ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            <span>39,99 € / an</span>
                            <span className="bg-black/15 text-black text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                                -33%
                            </span>
                        </button>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2.5 bg-surface/50 border border-border/60 p-4 rounded-2xl">
                        {[
                            "Accès illimité à tous les CCTLs (A1 à A5)",
                            "Tuteur IA 24/7 avec explications détaillées",
                            "Simulateur chronométré noté sur 20",
                            "Générateur de Prosits & livrables PDF"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-xs text-text-secondary">
                                <Check size={13} className="text-accent-yellow shrink-0 font-bold" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-accent-yellow text-black hover:brightness-105 transition-all cursor-pointer shadow-lg shadow-accent-yellow/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Redirection vers Stripe...</span>
                                </>
                            ) : (
                                <>
                                    <span>Débloquer Kompas Premium ({isAnnual ? '3,33 € / mois' : '4,99 € / mois'})</span>
                                    <ArrowRight size={15} />
                                </>

                            )}
                        </button>

                        <div className="flex justify-between items-center text-[11px] text-text-muted px-1">
                            <Link href="/dashboard/pricing" onClick={onClose} className="hover:text-text-primary underline">
                                Voir tous les détails des tarifs
                            </Link>
                            <span>Paiement sécurisé par Stripe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
