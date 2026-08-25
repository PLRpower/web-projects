'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import { ArrowLeft, Mail, KeyRound, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/app/auth/actions';

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(forgotPassword, null);
    const [emailValue, setEmailValue] = useState('');

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
                {!state?.success ? (
                    /* STEP 1: Formulaire de demande */
                    <>
                        {/* Header Icon (Form only) */}
                        <div className="flex justify-center mb-6">
                            <div className="p-3 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-center">
                                <Logo size={36} />
                            </div>
                        </div>

                        <div className="text-center mb-8 space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface border border-border text-[11px] font-mono text-text-secondary">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
                                <span>RÉCUPÉRATION // MOT DE PASSE</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-normal font-serif text-text-primary tracking-tight">
                                Mot de passe oublié ?
                            </h1>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                Entrez votre email CESI. Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
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
                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                    Email étudiant CESI
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="prenom.nom@viacesi.fr"
                                        required
                                        value={emailValue}
                                        onChange={(e) => setEmailValue(e.target.value)}
                                        className="pl-10 h-12 bg-surface/50 border-border focus:border-accent-yellow focus:ring-accent-yellow/30 text-sm"
                                    />
                                </div>
                                <p className="text-[11px] text-text-secondary/70">
                                    Format obligatoire : <span className="font-mono text-accent-yellow">@viacesi.fr</span>
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-12 font-bold font-syne text-sm shadow-lg shadow-accent-yellow/20"
                                    variant="premium"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            <span>Envoi en cours...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="w-4 h-4" />
                                            <span>Envoyer le lien de réinitialisation</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-text-secondary">
                            Vous vous souvenez de votre mot de passe ?{' '}
                            <Link href="/login" className="text-text-primary font-bold hover:text-accent-yellow transition-colors underline-offset-4 hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </>
                ) : (
                    /* STEP 2: Écran de confirmation (Uniquement icône verte) */
                    <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        {/* ONLY Green Checkmark Icon */}
                        <div className="flex justify-center">
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold font-syne text-text-primary">
                                Email envoyé avec succès !
                            </h2>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Un lien de réinitialisation a été expédié à l'adresse :
                            </p>
                            <p className="font-mono text-sm font-semibold text-accent-yellow bg-surface-highlight/50 px-3.5 py-1.5 rounded-lg inline-block break-all border border-border">
                                {state.email}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-surface/50 border border-border/60 text-xs text-text-secondary space-y-2 text-left">
                            <div className="flex items-center gap-2 font-semibold text-text-primary">
                                <Sparkles className="w-4 h-4 text-accent-yellow" />
                                Prochaines étapes :
                            </div>
                            <ol className="list-decimal list-inside space-y-1.5 text-text-secondary leading-relaxed pl-1">
                                <li>Consultez votre boîte de réception CESI.</li>
                                <li>Cliquez sur le lien <strong>Réinitialiser le mot de passe</strong> reçu.</li>
                                <li>Définissez votre nouveau mot de passe.</li>
                            </ol>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link href="/login" className="block w-full">
                                <Button variant="premium" className="w-full h-12 font-bold font-syne text-sm shadow-lg shadow-accent-yellow/20">
                                    Retour à la page de connexion
                                </Button>
                            </Link>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="text-xs text-text-secondary hover:text-text-primary transition-colors underline"
                            >
                                Vous n'avez rien reçu ? Réessayer avec une autre adresse
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
