'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    Gift,
    Award,
    CheckCircle2,
    Zap,
    X,
    ArrowRight,
    Star,
    Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardCelebrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward: {
        earnedMonths: number;
        earnedCredits: number;
        totalCredits: number;
        newBadge: string;
        isFirstContribution: boolean;
    } | null;
    examTitle?: string;
}

export function RewardCelebrationModal({
    isOpen,
    onClose,
    reward,
    examTitle
}: RewardCelebrationModalProps) {
    if (!isOpen || !reward) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="card-editorial p-6 sm:p-9 rounded-3xl bg-surface-card border-2 border-accent-yellow/50 max-w-lg w-full text-center space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Icon Celebration Header */}
                <div className="relative mx-auto w-20 h-20">
                    <div className="w-20 h-20 rounded-3xl bg-accent-yellow text-black flex items-center justify-center font-bold shadow-xl shadow-accent-yellow/20 transform rotate-3 animate-bounce">
                        <Gift className="w-10 h-10" />
                    </div>
                    <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-black border border-accent-yellow text-accent-yellow">
                        <Sparkles className="w-4 h-4" />
                    </div>
                </div>

                {/* Title & Message */}
                <div className="space-y-2 relative z-10">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-yellow bg-accent-yellow/15 px-3 py-1 rounded-full border border-accent-yellow/30">
                        🎁 Récompense de Crowdsourcing
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
                        Félicitations pour votre partage !
                    </h2>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                        Votre dépôt <strong className="text-text-primary">« {examTitle || 'CCTL'} »</strong> enrichit la base collaborative du CESI. Vos bonus ont été crédités immédiatement sur votre compte !
                    </p>
                </div>

                {/* Unlocked Perks Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 relative z-10 text-left">
                    {/* Perk 1: Premium Month */}
                    <div className="p-4 rounded-2xl bg-surface border border-accent-yellow/40 space-y-1 shadow-sm">
                        <div className="flex items-center gap-1.5 text-accent-yellow font-bold text-xs uppercase tracking-wider">
                            <Crown className="w-3.5 h-3.5" />
                            <span>Accès Premium Débloqué</span>
                        </div>
                        <p className="text-lg font-serif font-bold text-text-primary">
                            +{reward.earnedMonths} Mois Offert
                        </p>
                        <p className="text-[11px] text-text-secondary">
                            Accès sans limite à tous les CCTLs, corrigés &amp; annales.
                        </p>
                    </div>

                    {/* Perk 2: AI Credits */}
                    <div className="p-4 rounded-2xl bg-surface border border-accent-yellow/40 space-y-1 shadow-sm">
                        <div className="flex items-center gap-1.5 text-accent-yellow font-bold text-xs uppercase tracking-wider">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Crédits Génération IA</span>
                        </div>
                        <p className="text-lg font-serif font-bold text-text-primary">
                            +{reward.earnedCredits} Crédits IA
                        </p>
                        <p className="text-[11px] text-text-secondary">
                            Solde total : {reward.totalCredits} crédits (Générateur &amp; Coach).
                        </p>
                    </div>
                </div>

                {/* Contributor Badge Section */}
                <div className="p-3.5 rounded-2xl bg-surface-highlight/40 border border-border/70 flex items-center justify-between gap-3 text-xs relative z-10">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent-yellow" />
                        <span className="text-text-secondary">Nouveau rang contributeur :</span>
                    </div>
                    <span className="font-bold text-accent-yellow font-mono">
                        {reward.newBadge}
                    </span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
                    <Button
                        variant="premium"
                        onClick={onClose}
                        className="w-full sm:w-auto font-bold text-xs px-8 shadow-lg shadow-accent-yellow/20"
                    >
                        Profiter de mes avantages Premium
                        <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
