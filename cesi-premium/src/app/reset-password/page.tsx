'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, CheckCircle2, AlertCircle, ShieldCheck, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPassword } from '@/app/auth/actions';

export default function ResetPasswordPage() {
    const [state, formAction, isPending] = useActionState(resetPassword, null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isLongEnough = password.length >= 6;
    const passwordsMatch = password.length > 0 && password === confirmPassword;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Back to Login */}
            <Link
                href="/login"
                className="absolute top-6 left-6 z-50 p-2.5 rounded-full glass hover:bg-surface-highlight/50 text-text-primary transition-all hover:scale-110 flex items-center gap-2 text-xs font-medium"
            >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Retour à la connexion</span>
            </Link>

            {/* Architectural Grid Background */}
            <div className="absolute inset-0 bg-millimeter opacity-35 pointer-events-none" />

            <div className="w-full max-w-md card-editorial p-8 sm:p-10 rounded-3xl bg-surface-card border-border shadow-2xl relative z-10">
                {/* Header Icon */}
                <div className="flex justify-center mb-6">
                    <div className="p-3.5 rounded-2xl bg-surface border border-border text-accent-yellow shadow-xs">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                </div>

                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface border border-border text-[11px] font-mono text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
                        <span>SÉCURITÉ // NOUVEAU MOT DE PASSE</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif text-text-primary tracking-tight">
                        Nouveau mot de passe
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        Choisissez un nouveau mot de passe sécurisé pour votre compte Kompas | CESI.
                    </p>
                </div>

                {/* Error Alert */}
                {state?.error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-xs uppercase tracking-wider">Erreur</p>
                            <p className="text-xs text-red-300 mt-0.5 leading-relaxed">{state.error}</p>
                        </div>
                    </div>
                )}

                <form action={formAction} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Nouveau mot de passe
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-12 bg-surface/50 border-border focus:border-accent-yellow focus:ring-accent-yellow/30 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Confirmer le mot de passe
                        </Label>
                        <div className="relative">
                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                            <Input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10 h-12 bg-surface/50 border-border focus:border-accent-yellow focus:ring-accent-yellow/30 text-sm"
                            />
                        </div>
                    </div>

                    {/* Requirements checklist */}
                    <div className="p-3 rounded-xl bg-surface/40 border border-border/50 text-xs space-y-1.5">
                        <div className={`flex items-center gap-2 ${isLongEnough ? 'text-emerald-400' : 'text-text-secondary'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isLongEnough ? 'bg-emerald-400' : 'bg-text-secondary/50'}`} />
                            <span>Au moins 6 caractères</span>
                        </div>
                        <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-emerald-400' : 'text-text-secondary'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch ? 'bg-emerald-400' : 'bg-text-secondary/50'}`} />
                            <span>Les mots de passe correspondent</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-12 font-bold font-syne text-sm shadow-lg shadow-accent-yellow/20"
                            variant="premium"
                            disabled={isPending || !isLongEnough || !passwordsMatch}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    <span>Mise à jour...</span>
                                </div>
                            ) : (
                                <span>Enregistrer le mot de passe</span>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
