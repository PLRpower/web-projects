'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function CTA() {
    return (
        <section className="py-20 sm:py-28 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 36, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-3xl p-8 sm:p-14 text-center border-2 border-border bg-surface-card bg-millimeter relative overflow-hidden shadow-2xl hover:border-accent-yellow/50 transition-colors"
                >
                    {/* Glowing Ambient Radial Halo */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(229,160,13,0.18)_0%,transparent_70%)] pointer-events-none animate-compass-pulse" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        {/* Compass Emblem with subtle hover float */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="flex justify-center mb-2"
                        >
                            <div className="relative w-16 h-16 flex items-center justify-center p-3 rounded-2xl bg-surface/90 border border-border shadow-md hover:scale-110 transition-transform duration-300">
                                <Logo size={44} />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-text-primary tracking-tight leading-[1.08]"
                        >
                            Prêt à aborder vos prochains CCTL <br />
                            <span className="italic font-normal">avec sérénité ?</span>
                        </motion.h2>

                        {/* Subtitle */}
                        <motion.p 
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal"
                        >
                            Rejoignez dès aujourd&apos;hui les étudiants de votre campus qui révisent sur Kompas. Connectez-vous pour débloquer toutes les fonctionnalités de révision.
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div 
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3"
                        >
                            <Link href="/register" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent-yellow text-black font-bold text-sm hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]">
                                    <span>Créer mon compte</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

