'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent-orange/5" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass rounded-3xl p-12 md:p-20 text-center border border-white/10 relative overflow-hidden"
                >
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-yellow/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-orange/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent-yellow mb-8">
                            <Sparkles size={16} />
                            Rejoignez l'élite
                        </span>

                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            Créez votre compte et <br />
                            <span className="gradient-accent">boostez votre productivité.</span>
                        </h2>

                        <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto">
                            Rejoignez des centaines d'étudiants qui utilisent déjà CESI Premium pour valider leur année sans stress.
                        </p>

                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-text-primary text-background font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-accent-orange/10"
                        >
                            Créer un compte
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
