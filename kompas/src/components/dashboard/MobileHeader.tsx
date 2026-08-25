'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
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
    FileDown,
    User,
    Settings,
    LogOut,
    FolderGit2,
    Tv
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Archives CCTL', icon: Archive, href: '/dashboard/cctl' },
    { label: 'Archives Prosits', icon: FileText, href: '/dashboard/prosits' },
    { label: 'Archives Livrables', icon: FolderGit2, href: '/dashboard/livrables' },
    { label: 'Chat Promo', icon: Users, href: '/dashboard/community' },
    { label: 'Fiches & Synthèses', icon: FileDown, href: '/dashboard/resources' },
    { label: 'Flashcards', icon: Brain, href: '/dashboard/flashcards' },
    { label: 'Profil Étudiant', icon: User, href: '/dashboard/profile' },
    { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

export default function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsOpen(false);
        router.push('/login');
    };

    return (
        <header className="md:hidden border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
            <Link href="/" className="group block">
                <Logo size={28} showText={true} priority={true} />
            </Link>

            <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl border border-border bg-surface text-text-primary hover:bg-surface-highlight transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-x-0 top-[57px] bottom-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-2 z-50">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all',
                                        isActive
                                            ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                                    )}
                                >
                                    <Icon className={cn('w-4 h-4', isActive ? 'text-black' : 'text-text-muted')} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-4 border-t border-border mt-6">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-surface border border-border text-xs font-semibold text-red-500 hover:bg-surface-highlight transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
