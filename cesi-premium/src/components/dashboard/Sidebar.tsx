'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Archive,
    Settings,
    LogOut,
    User as UserIcon,
    Brain,
    Wand2,
    Users,
    FolderGit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'CCTL', icon: Archive, href: '/dashboard/archives' },
    { label: 'Livrables', icon: FolderGit2, href: '/dashboard/livrables' },
    { label: 'Flashcards', icon: Brain, href: '/dashboard/flashcards' },
    { label: 'Prosits', icon: Wand2, href: '/dashboard/prosits' },
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

    useEffect(() => {
        setMounted(true);

        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user?.email) {
                const parts = user.email.split('@')[0].split('.');
                if (parts.length >= 2) {
                    const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                    const last = parts[1].toUpperCase();
                    setProfileName(`${first} ${last}`);
                } else {
                    setProfileName(user.email.split('@')[0]);
                }
            }
        };

        fetchUser();

        const savedProfile = localStorage.getItem('cesi_agora_user_profile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                if (parsed.name) setProfileName(parsed.name);
                if (parsed.specialty) setSpecialty(parsed.specialty);
                if (parsed.promo) setPromo(parsed.promo);
            } catch {}
        }
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
                    <img
                        src={mounted && resolvedTheme === 'light' ? "/img/logo-black.svg" : "/img/logo.svg"}
                        alt="Kompas | CESI"
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
                        "p-2.5 rounded-2xl border transition-all flex items-center gap-3 group block",
                        pathname === '/dashboard/profile'
                            ? "bg-accent-yellow/15 border-accent-yellow/50"
                            : "bg-surface-card border-border hover:border-accent-yellow/40 hover:bg-surface"
                    )}
                >
                    <div className="w-10 h-10 rounded-xl bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 flex items-center justify-center font-bold text-sm shrink-0">
                        {profileName ? profileName.charAt(0).toUpperCase() : <UserIcon size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate group-hover:text-accent-yellow transition-colors">
                            {profileName}
                        </p>
                        <p className="text-[11px] text-text-muted font-mono truncate">
                            {promo} • {specialty}
                        </p>
                    </div>
                </Link>

                <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
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
