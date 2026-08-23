'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Archive,
    Settings,
    LogOut,
    User as UserIcon,
    Brain,
    FileText,
    Users,
    FolderGit2,
    Target,
    Tv
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'CCTL & IA', icon: Archive, href: '/dashboard/cctl' },
    { label: 'Diagnostic & Radar', icon: Target, href: '/dashboard/diagnostic' },
    { label: 'Live Battle Amphi', icon: Tv, href: '/live/host' },
    { label: 'Prosits', icon: FileText, href: '/dashboard/prosits' },
    { label: 'Livrables', icon: FolderGit2, href: '/dashboard/livrables' },
    { label: 'Flashcards', icon: Brain, href: '/dashboard/flashcards' },
    { label: 'Chat Promo', icon: Users, href: '/dashboard/community' },
    { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profileName, setProfileName] = useState('Élève-Ingénieur');
    const [specialty, setSpecialty] = useState('Informatique');
    const [promo, setPromo] = useState('A3');
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        setMounted(true);

        const loadProfile = async () => {
            let nameResolved = '';
            let specialtyResolved = '';
            let promoResolved = '';
            let premiumResolved = false;

            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const meta = user.user_metadata;
                premiumResolved = Boolean(
                    meta?.is_premium === true ||
                    meta?.subscription_tier === 'Premium' ||
                    meta?.subscription_tier === 'Ultime' ||
                    meta?.role === 'admin'
                );

                if (meta?.name) {
                    nameResolved = meta.name;
                } else if (meta?.firstname && meta?.lastname) {
                    nameResolved = `${meta.firstname} ${meta.lastname}`.trim();
                } else if (meta?.full_name) {
                    nameResolved = meta.full_name;
                } else if (user.email) {
                    const parts = user.email.split('@')[0].split('.');
                    if (parts.length >= 2) {
                        const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                        const last = parts[1].toUpperCase();
                        nameResolved = `${first} ${last}`;
                    } else {
                        nameResolved = user.email.split('@')[0];
                    }
                }
                if (meta?.specialty) specialtyResolved = meta.specialty;
                if (meta?.promo) promoResolved = meta.promo;
            }

            const savedProfile = localStorage.getItem('kompas_user_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.name && parsed.name !== 'Alexandre Martin') nameResolved = parsed.name;
                    if (parsed.specialty) specialtyResolved = parsed.specialty;
                    if (parsed.promo) promoResolved = parsed.promo;
                    if (parsed.isPremium || parsed.subscriptionTier === 'Premium' || parsed.subscriptionTier === 'Ultime') {
                        premiumResolved = true;
                    }
                } catch {}
            }

            if (nameResolved) setProfileName(nameResolved);
            if (specialtyResolved) setSpecialty(specialtyResolved);
            if (promoResolved) setPromo(promoResolved);
            setIsPremium(premiumResolved);
        };

        loadProfile();

        const handleProfileEvent = () => {
            loadProfile();
        };

        window.addEventListener('kompas_profile_updated', handleProfileEvent);
        window.addEventListener('storage', handleProfileEvent);

        return () => {
            window.removeEventListener('kompas_profile_updated', handleProfileEvent);
            window.removeEventListener('storage', handleProfileEvent);
        };
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-card border-r border-border flex flex-col z-40 hidden md:flex">
            {/* Logo */}
            <div className="p-5 border-b border-border/80 bg-surface/50">
                <Link href="/" className="relative h-8 w-44 block group">
                    <Image
                        src={mounted && resolvedTheme === 'light' ? "/img/logo-black.svg" : "/img/logo.svg"}
                        alt="Kompas | CESI"
                        width={176}
                        height={32}
                        className="h-full w-auto object-contain transition-transform group-hover:scale-102"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-xs font-medium relative",
                                isActive
                                    ? "bg-accent-yellow text-black font-bold shadow-xs shadow-accent-yellow/20"
                                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                            )}
                        >
                            <item.icon size={16} className={cn(isActive ? "text-black font-bold" : "text-text-muted group-hover:text-text-primary")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Profile & Utilities Section */}
            <div className="p-3 border-t border-border/80 bg-surface/40 space-y-2">
                {/* User Profile Card Link */}
                <Link
                    href="/dashboard/profile"
                    className={cn(
                        "p-2.5 rounded-xl border transition-all flex flex-row items-center gap-3 group w-full",
                        pathname === '/dashboard/profile'
                            ? "bg-accent-yellow/15 border-accent-yellow/50"
                            : "bg-surface-card border-border hover:border-accent-yellow/40 hover:bg-surface"
                    )}
                >
                    <div className="w-8 h-8 rounded-lg bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 flex items-center justify-center font-bold text-xs shrink-0">
                        {profileName ? profileName.charAt(0).toUpperCase() : <UserIcon size={15} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate group-hover:text-accent-yellow transition-colors leading-tight">
                            {profileName}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            {isPremium ? (
                                <span className="text-[10px] font-mono font-bold text-accent-yellow flex items-center gap-0.5">
                                    ⭐ Kompas Premium
                                </span>
                            ) : (
                                <span className="text-[10px] font-mono text-text-muted">
                                    Compte Découverte
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Upgrade mini button for free tier users */}
                {!isPremium && (
                    <Link href="/dashboard/pricing" className="block w-full">
                        <button
                            type="button"
                            className="w-full py-2 px-3 rounded-xl bg-accent-yellow/15 hover:bg-accent-yellow text-accent-yellow hover:text-black border border-accent-yellow/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <span>Kompas Premium (3,33€/m)</span>
                        </button>
                    </Link>
                )}

                <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Se déconnecter"
                    >
                        <LogOut size={14} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

