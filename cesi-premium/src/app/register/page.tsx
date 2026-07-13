'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/auth/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
    const [state, dispatch] = useActionState(signup, null);

    const handleGoogleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
    };

    return (
        <div className="min-h-screen flex relative">
            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 p-2 rounded-full glass hover:bg-surface-highlight/50 text-text-primary transition-all hover:scale-110"
            >
                <ArrowLeft size={24} className="text-text-primary" />
            </Link>

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent-yellow/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

                <div className="w-full max-w-md z-10">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 text-text-primary font-syne">Rejoignez l'élite</h1>
                        <p className="text-text-secondary">Préparez vos CCTL avec les meilleurs outils.</p>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        className="w-full mb-6 bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black border border-gray-200"
                        variant="outline"
                        type="button"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continuer avec Google
                    </Button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-text-secondary">
                                Ou avec un email
                            </span>
                        </div>
                    </div>

                    <form action={dispatch} className="space-y-4">
                        {state?.error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                                {state.error}
                            </div>
                        )}


                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstname">Prénom</Label>
                                <Input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Jean"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastname">Nom</Label>
                                <Input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Dupont"
                                    required
                                />
                            </div>
                        </div>

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
                            <Label htmlFor="password">Mot de passe</Label>
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
                                Créer mon compte
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-secondary">
                        Déjà un compte ?{' '}
                        <Link href="/login" className="text-text-primary font-medium hover:text-accent-yellow transition-colors">
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex w-1/2 bg-surface items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-yellow/20 via-background to-background" />

                <div className="relative z-10 text-center">
                    <div className="mb-8 relative w-[500px] h-[500px]">
                        <Image
                            src="/img/register-illustration.svg"
                            alt="Graduate Student"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-text-primary">Votre réussite commence ici</h2>
                    <p className="text-text-secondary font-medium max-w-md mx-auto">
                        Rejoignez des milliers d'étudiants CESI et accédez aux meilleures ressources pour exceller.
                    </p>
                </div>
            </div>
        </div>
    );
}
