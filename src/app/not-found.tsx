'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface relative overflow-hidden px-4">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-yellow/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 flex flex-col items-center text-center max-w-2xl"
            >
                <div className="w-full max-w-[400px] mb-8 relative">
                    <img
                        src={mounted && resolvedTheme === 'light' ? "/img/404-black.svg" : "/img/404-white.svg"}
                        alt="404 Illustration"
                        className="w-full h-auto object-contain drop-shadow-xl"
                    />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-syne text-text-primary mb-4">
                    Oups ! Page introuvable
                </h1>

                <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
                    Il semblerait que vous soyez perdu dans l'espace. La page que vous cherchez n'existe pas ou a été déplacée.
                </p>

                <Link href="/">
                    <Button size="lg" className="rounded-full px-8 h-12 text-base font-medium bg-accent-yellow text-black hover:bg-yellow-400 border-none">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à l'accueil
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
