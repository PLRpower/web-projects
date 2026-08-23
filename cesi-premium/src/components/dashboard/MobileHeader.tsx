'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    Menu,
    X,
    LayoutDashboard,
    Brain,
    FileText,
    Archive,
    Users,
    User,
    Settings,
    LogOut,
    FolderGit2,
    Target,
    Tv
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'CCTL & IA', icon: Archive, href: '/dashboard/cctl' },
    { label: 'Diagnostic & Radar', icon: Target, href: '/dashboard/diagnostic' },
    { label: 'Live Battle Amphi', icon: Tv, href: '/live/host' },
    { label: 'Prosits', icon: FileText, href: '/dashboard/prosits' },
    { label: 'Livrables', icon: FolderGit2, href: '/dashboard/livrables' },
    { label: 'Flashcards', icon: Brain, href: '/dashboard/flashcards' },
    { label: 'Chat Promo', icon: Users, href: '/dashboard/community' },
    { label: 'Profil Étudiant', icon: User, href: '/dashboard/profile' },
    { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

export default function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsOpen(false);
        router.push('/login');
    };

    return (
        <header className="md:hidden sticky top-0 z-50 glass border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
                <Link href="/" className="relative h-7 w-36 block">
                    <Image
                        src={mounted && resolvedTheme === 'light' ? "/img/logo-black.svg" : "/img/logo.svg"}
                        alt="Kompas | CESI"
                        width={144}
                        height={28}
                        className="h-full w-auto object-contain"
                    />
                </Link>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-xl bg-surface-card border border-border text-text-primary focus:outline-none cursor-pointer"
                        aria-label="Ouvrir le menu"
                    >
                        {isOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="pt-3 pb-2 space-y-1 animate-in fade-in slide-in-from-top-2 border-t border-border/80 mt-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                                    isActive
                                        ? "bg-accent-yellow text-black font-bold shadow-xs"
                                        : "text-text-secondary hover:text-text-primary hover:bg-surface"
                                )}
                            >
                                <item.icon size={16} className={isActive ? "text-black" : "text-text-muted"} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors pt-2 border-t border-border/40 mt-1 cursor-pointer"
                    >
                        <LogOut size={16} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            )}
        </header>
    );
}
