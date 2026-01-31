'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, User as UserIcon, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (_event === 'SIGNED_OUT') {
                router.refresh();
                setIsDropdownOpen(false);
            }
        });

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsDropdownOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="relative h-10 w-48">
                    <img
                        src={mounted && resolvedTheme === 'light' ? "/img/logo-black.svg" : "/img/logo.svg"}
                        alt="CESI Premium"
                        className="h-full w-auto object-contain"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
                    <Link href="/#features" className="hover:text-text-primary transition-colors">Fonctionnalités</Link>
                    <Link href="/#archives" className="hover:text-text-primary transition-colors">Archives</Link>
                    <Link href="/pricing" className="hover:text-text-primary transition-colors">Abonnement</Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <div className="w-10 h-10 rounded-full bg-surface-highlight flex items-center justify-center font-bold text-accent-yellow border border-border hover:border-accent-yellow/50 transition-colors">
                                    {user.email?.charAt(0).toUpperCase() || <UserIcon size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 rounded-xl bg-white/95 dark:bg-neutral-900/95 border border-border/50 shadow-xl backdrop-blur-2xl overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/5">
                                            <p className="text-sm font-bold text-text-primary truncate">{user.email}</p>
                                            <p className="text-xs text-text-secondary">Membre</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-highlight rounded-lg transition-colors"
                                            >
                                                <LayoutDashboard size={16} />
                                                Mon Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-text-primary transition-colors hidden sm:block">
                                Connexion
                            </Link>
                            <Link href="/register" className="bg-accent-yellow text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors">
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
