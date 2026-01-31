'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent-yellow rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-20 dark:opacity-60 animate-pulse" />
            <div className="absolute bottom-0 -left-10 w-96 h-96 bg-accent-orange rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-20 dark:opacity-60 animate-pulse delay-1000" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-accent-yellow mb-6">
                        <Sparkles size={16} />
                        La plus grosse banque de fichiers CESI
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        La plateforme qui vous <br />
                        <span className="gradient-accent">simplifie la vie</span> au CESI.
                    </h1>

                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                        Découvrez une panoplie de fonctionnalités pour vos études. CCTL corrigés, QCM automatiques, Partage de fichiers, Accès aux Prosits et Livrables complétés.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="group relative px-8 py-3 rounded-full bg-text-primary text-background font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
                            Créer mon compte
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-3 rounded-full glass font-bold text-lg text-text-primary hover:bg-surface-highlight/20 transition-colors">
                            Comment ça marche ?
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
