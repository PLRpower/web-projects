'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function NotFound() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden px-4">
            {/* Theme Toggle in top-right */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Architectural Drafting Grid */}
            <div className="absolute inset-0 bg-millimeter opacity-35 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 flex flex-col items-center text-center max-w-2xl card-editorial p-8 sm:p-12 rounded-3xl bg-surface-card border-border shadow-2xl space-y-6"
            >
                <div className="w-full max-w-[320px] relative">
                    <Image
                        src={mounted && resolvedTheme === 'light' ? "/img/404-black.svg" : "/img/404-white.svg"}
                        alt="404 Illustration"
                        width={320}
                        height={240}
                        priority
                        className="w-full h-auto object-contain drop-shadow-md"
                    />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary">
                        Page introuvable
                    </h1>

                    <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                        Le compas a perdu l&apos;orientation. La ressource que vous recherchez n&apos;existe pas ou a été déplacée.
                    </p>
                </div>

                <Link href="/">
                    <button
                        type="button"
                        className="px-6 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retour à l&apos;accueil</span>
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}
