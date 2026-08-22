'use client';

import { useActionState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { login } from '@/app/auth/actions';
import { ThemeToggle } from '@/components/ThemeToggle';

function LoginForm() {
    const [state, dispatch] = useActionState(login, null);
    const searchParams = useSearchParams();
    const isResetSuccess = searchParams.get('reset') === 'success';

    return (
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface-card border border-border shadow-2xl relative z-10">
            <div className="mb-8 space-y-2 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-normal text-text-primary font-serif">Connexion</h1>
                <p className="text-text-secondary text-xs sm:text-sm">Connectez-vous à votre compte Kompas.</p>
            </div>

            {/* Reset password success banner */}
            {isResetSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-xs uppercase tracking-wider">Succès</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 leading-relaxed">
                            Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
                        </p>
                    </div>
                </div>
            )}

            <form action={dispatch} className="space-y-4">
                {state?.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
                        {state.error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email CESI</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jean.dupont@viacesi.fr"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-text-secondary hover:text-accent-yellow transition-colors"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="pt-4">
                    <Button className="w-full" variant="premium">
                        Se connecter
                    </Button>
                </div>
            </form>

            <div className="mt-8 text-center text-sm text-text-secondary">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-text-primary font-medium hover:text-accent-yellow transition-colors">
                    Créer un compte
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-background">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 bg-millimeter opacity-35 pointer-events-none" />

            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 p-2.5 rounded-full card-editorial bg-surface-card hover:bg-surface text-text-primary transition-all flex items-center gap-2 text-xs font-medium cursor-pointer"
            >
                <ArrowLeft size={16} className="text-text-primary" />
                <span className="hidden sm:inline">Accueil</span>
            </Link>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <Suspense fallback={
                <div className="w-full max-w-md p-10 rounded-3xl bg-surface-card border border-border text-center text-text-secondary">
                    Chargement...
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
