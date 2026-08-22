'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/auth/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function RegisterPage() {
    const [state, dispatch] = useActionState(signup, null);

    return (
        <div className="min-h-screen flex relative bg-background">
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

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background relative overflow-hidden">
                {/* Architectural Grid Pattern */}
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

                <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface-card border border-border shadow-2xl relative z-10">
                    <div className="mb-8 space-y-2 text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-normal text-text-primary font-serif">Inscription</h1>
                        <p className="text-text-secondary text-xs sm:text-sm">Préparez vos CCTL avec les meilleurs outils d&apos;ingénierie.</p>
                    </div>

                    <form action={dispatch} className="space-y-4">
                        {state?.error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
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
