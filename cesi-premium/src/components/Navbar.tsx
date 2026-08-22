'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
    LogOut,
    LayoutDashboard,
    User as UserIcon,
    Settings,
    Archive,
    ArrowRight
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navbar() {
    const supabase = useMemo(() => createClient(), []);
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
            className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3.5 bg-background/95 backdrop-blur-md border-b border-border shadow-xs"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="relative h-9 w-44 block group">
                        <img
                            src={mounted && resolvedTheme === 'light' ? "/img/logo-black.svg" : "/img/logo.svg"}
                            alt="Kompas | CESI"
                            className="h-full w-auto object-contain transition-transform group-hover:scale-102"
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        <Link href="/" className="hover:text-text-primary hover:text-accent-yellow transition-colors">
                            Page d&apos;accueil
                        </Link>
                        <Link href="/cctl" className="hover:text-text-primary hover:text-accent-yellow transition-colors">
                            CCTL
                        </Link>
                        <Link href="/prosits" className="hover:text-text-primary hover:text-accent-yellow transition-colors">
                            Prosits
                        </Link>
                        <Link href="/livrables" className="hover:text-text-primary hover:text-accent-yellow transition-colors">
                            Livrables
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none cursor-pointer"
                                aria-label="Menu utilisateur"
                            >
                                <div className="w-9 h-9 rounded-xl bg-surface-card flex items-center justify-center font-bold text-accent-yellow border border-border shadow-xs hover:border-accent-yellow transition-colors">
                                    {user.email?.charAt(0).toUpperCase() || <UserIcon size={16} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-card border border-border shadow-xl overflow-hidden z-50 p-1.5 space-y-1"
                                    >
                                        <div className="p-3.5 border-b border-border/60">
                                            <p className="text-xs font-bold text-text-primary truncate">{user.email}</p>
                                            <p className="text-[11px] font-mono text-accent-yellow font-semibold mt-0.5">ÉLÈVE-INGÉNIEUR CESI</p>
                                        </div>
                                        <div className="p-1 space-y-0.5">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors"
                                            >
                                                <LayoutDashboard size={15} />
                                                Tableau de bord
                                            </Link>
                                            <Link
                                                href="/dashboard/archives"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors"
                                            >
                                                <Archive size={15} className="text-accent-yellow" />
                                                CCTL &amp; Annales
                                            </Link>
                                            <Link
                                                href="/dashboard/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors"
                                            >
                                                <UserIcon size={15} />
                                                Mon Profil Étudiant
                                            </Link>
                                            <Link
                                                href="/dashboard/settings"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-xl transition-colors"
                                            >
                                                <Settings size={15} />
                                                Paramètres
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-xl transition-colors pt-2 border-t border-border/40 mt-1 cursor-pointer"
                                            >
                                                <LogOut size={15} />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-text-secondary hover:text-text-primary px-4 py-2.5 rounded-xl hover:bg-surface/50 transition-colors hidden sm:block"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="bg-accent-yellow text-black px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-105 transition-all shadow-xs inline-flex items-center gap-1.5 group"
                            >
                                <span>S&apos;inscrire</span>
                                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
