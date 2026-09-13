'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Archive,
    Settings,
    LogOut,
    Brain,
    FileText,
    Users,
    FileDown,
    FolderGit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { isAdminUser, isAdminEmail } from '@/lib/admin';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Archives CCTL', icon: Archive, href: '/dashboard/cctl' },
    { label: 'Archives Prosits', icon: FileText, href: '/dashboard/prosits' },
    { label: 'Archives Livrables', icon: FolderGit2, href: '/dashboard/livrables' },
    { label: 'Chat Promo', icon: Users, href: '/dashboard/community' },
    { label: 'Fiches & Synthèses', icon: FileDown, href: '/dashboard/resources' },
    { label: 'Flashcards', icon: Brain, href: '/dashboard/flashcards' },
    { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { resolvedTheme } = useTheme();
    const [user, setUser] = useState<User | null>(null);
    const [profileName, setProfileName] = useState('Élève-Ingénieur');
    const [specialty, setSpecialty] = useState('Informatique');
    const [promo, setPromo] = useState('A3');
    const [isPremium, setIsPremium] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            let nameResolved = '';
            let specialtyResolved = '';
            let promoResolved = '';
            let premiumResolved = false;
            let adminResolved = false;

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser(user);
                    if (isAdminUser(user) || isAdminEmail(user.email)) {
                        adminResolved = true;
                        premiumResolved = true;
                    }
                    const meta = user.user_metadata;
                    if (meta?.name) {
                        nameResolved = meta.name;
                    } else if (meta?.firstname && meta?.lastname) {
                        nameResolved = `${meta.firstname} ${meta.lastname}`.trim();
                    } else if (meta?.full_name) {
                        nameResolved = meta.full_name;
                    } else if (user.email) {
                        const parts = user.email.split('@')[0].split('.');
                        if (parts.length >= 2) {
                            nameResolved = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1].toUpperCase()}`;
                        } else {
                            nameResolved = user.email.split('@')[0];
                        }
                    }

                    if (meta?.specialty) specialtyResolved = meta.specialty;
                    if (meta?.promo) promoResolved = meta.promo;
                    if (meta?.is_premium || meta?.plan === 'premium') premiumResolved = true;
                }
            } catch (err) {
                console.error('Sidebar error fetching user:', err);
            }

            const savedProfile = localStorage.getItem('kompas_user_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.name) nameResolved = parsed.name;
                    if (parsed.specialty) specialtyResolved = parsed.specialty;
                    if (parsed.promo) promoResolved = parsed.promo;
                    if (parsed.isPremium !== undefined) premiumResolved = parsed.isPremium;
                    if (parsed.email && isAdminEmail(parsed.email)) {
                        adminResolved = true;
                        premiumResolved = true;
                    }
                    if (parsed.role === 'admin' || parsed.isAdmin) {
                        adminResolved = true;
                        premiumResolved = true;
                    }
                } catch {}
            }

            if (nameResolved) setProfileName(nameResolved);
            if (specialtyResolved) setSpecialty(specialtyResolved);
            if (promoResolved) setPromo(promoResolved);
            setIsPremium(premiumResolved);
            setIsAdmin(adminResolved);
        };

        loadProfile();

        const handleProfileUpdate = () => {
            loadProfile();
        };

        window.addEventListener('kompas_profile_updated', handleProfileUpdate);
        window.addEventListener('storage', handleProfileUpdate);

        return () => {
            window.removeEventListener('kompas_profile_updated', handleProfileUpdate);
            window.removeEventListener('storage', handleProfileUpdate);
        };
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col justify-between z-40 hidden md:flex transition-all">
            <div className="p-5 flex-1 flex flex-col min-h-0 overflow-y-auto">
                {/* Brand */}
                <Link href="/" className="px-2 mb-6 shrink-0 group block">
                    <div className="flex items-center gap-3 transition-transform duration-200 ease-out group-hover:scale-105 origin-center">
                        <Logo size={32} priority={true} className="group-hover:scale-100" />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="font-serif font-bold text-lg tracking-tight text-text-primary">Kompas</span>
                                <span className="text-[10px] font-mono font-bold bg-accent-yellow/20 text-accent-yellow px-1.5 py-0.5 rounded border border-accent-yellow/30">
                                    CESI
                                </span>
                            </div>
                            <span className="text-[9px] font-mono text-text-secondary tracking-widest uppercase">
                                Plateforme Étudiante
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Nav items */}
                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all group',
                                    isActive
                                        ? 'bg-accent-yellow text-black shadow-xs font-bold'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                                )}
                            >
                                <Icon className={cn(
                                    'w-4 h-4 transition-colors',
                                    isActive ? 'text-black' : 'text-text-muted group-hover:text-text-primary'
                                )} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Profile / Utility Card */}
            <div className="p-4 border-t border-border space-y-3 shrink-0 bg-surface/50">
                {/* User Profile Mini Bar */}
                <Link
                    href="/dashboard/profile"
                    className="p-3 bg-surface rounded-2xl border border-border/80 flex items-center justify-between group hover:border-accent-yellow transition-all"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-accent-yellow text-black font-bold text-xs flex items-center justify-center shrink-0">
                            {profileName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-text-primary truncate group-hover:text-accent-yellow transition-colors">
                                {profileName}
                            </p>
                            <p className="text-[10px] font-mono text-text-secondary truncate">
                                {promo} • {specialty}
                            </p>
                        </div>
                    </div>
                    {isAdmin ? (
                        <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-500 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                            <span>👑</span>
                            <span>ADMIN</span>
                        </span>
                    ) : isPremium ? (
                        <span className="text-[9px] font-mono font-bold bg-accent-yellow/20 text-accent-yellow px-1.5 py-0.5 rounded border border-accent-yellow/30">
                            PRO
                        </span>
                    ) : (
                        <span className="text-[9px] font-mono font-bold bg-surface-highlight text-text-muted px-1.5 py-0.5 rounded border border-border">
                            FREE
                        </span>
                    )}
                </Link>

                <div className="flex items-center justify-between px-2 pt-1">
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-surface cursor-pointer"
                        title="Se déconnecter"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">Déconnexion</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
