'use client';

import { motion } from 'framer-motion';
import { UserPlus, LayoutDashboard, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
    {
        icon: <UserPlus className="w-8 h-8 text-accent-yellow" />,
        title: "Créez votre compte",
        description: "Deux trois clics, quelques informations nécessaires, et c'est plié !"
    },
    {
        icon: <LayoutDashboard className="w-8 h-8 text-accent-orange" />,
        title: "Accédez aux outils",
        description: "Découvrez les différentes fonctionnalités à votre disposition depuis votre dashboard."
    },
    {
        icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
        title: "Améliorez votre productivité",
        description: "Commencez à réviser d'une toute nouvelle manière, afin de booster votre productivité au CESI."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-yellow/5 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Comment vous <span className="gradient-accent">lancez ?</span></h2>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Vous souhaitez utiliser CESI Premium pour booster votre productivité au quotidien ? Voici un guide de démarrage rapide.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-accent-yellow/20 via-accent-orange/20 to-accent-yellow/20 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 bg-background/50">
                                {step.icon}
                            </div>

                            <div className="absolute top-8 right-0 left-0 flex justify-center -z-20 md:hidden">
                                <div className="h-24 w-0.5 bg-gradient-to-b from-border to-transparent" />
                            </div>

                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-text-secondary leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-text-primary text-background font-bold text-lg hover:scale-105 transition-transform">
                        Créer votre compte
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
