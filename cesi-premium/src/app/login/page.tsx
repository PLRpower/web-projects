'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { login } from '@/app/auth/actions';

export default function LoginPage() {
    const [state, dispatch] = useActionState(login, null);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 p-2 rounded-full glass hover:bg-surface-highlight/50 text-text-primary transition-all hover:scale-110"
            >
                <ArrowLeft size={24} />
            </Link>

            {/* Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-yellow/20 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[128px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-orange/20 rounded-full mix-blend-multiply dark:mix-blend-screen blur-[128px] -z-10" />

            <div className="w-full max-w-md glass p-8 rounded-2xl border border-border shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 gradient-text">Bon retour</h1>
                    <p className="text-text-secondary">Connectez-vous à votre espace CESI Premium</p>
                </div>

                <form action={dispatch} className="space-y-6">
                    {state?.error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                            {state.error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email CESI</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="votre.nom@viacesi.fr"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Link href="#" className="text-xs text-accent-yellow hover:text-accent-orange transition-colors">
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

                    <Button className="w-full" variant="premium">
                        Se connecter
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-text-secondary">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-text-primary font-medium hover:text-accent-yellow transition-colors">
                        Créer un compte
                    </Link>
                </div>
            </div>
        </div>
    );
}
