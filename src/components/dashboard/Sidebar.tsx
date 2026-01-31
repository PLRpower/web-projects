'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Archive, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Archives CCTL', icon: Archive, href: '/dashboard/archives' },
    { label: 'Profil', icon: User, href: '/dashboard/profile' },
    { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-40 hidden md:flex">
            {/* Logo */}
            <div className="p-6 border-b border-border/50">
                <Link href="/" className="relative h-10 w-48 block">
                    <img
                        src={mounted && resolvedTheme === 'light' ? "/img/logo-black.svg" : "/img/logo.svg"}
                        alt="CESI Premium"
                        className="h-full w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20 font-bold"
                                    : "text-text-secondary hover:text-text-primary hover:bg-surface-highlight"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-accent-yellow" : "group-hover:text-accent-yellow transition-colors")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-border/50">
                <div className="flex items-center justify-between px-4 py-2 mb-2 rounded-xl bg-surface-highlight/20 border border-border/30">
                    <span className="text-sm font-medium text-text-secondary">Apparence</span>
                    <ThemeToggle />
                </div>

                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
