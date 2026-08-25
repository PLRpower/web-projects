'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';

export default function CTA() {
    return (
        <section className="py-20 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="rounded-3xl p-8 sm:p-14 text-center border-2 border-border bg-surface-card bg-millimeter relative overflow-hidden shadow-2xl"
                >
                    {/* Glowing Ambient Radial Halo */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(229,160,13,0.14)_0%,transparent_70%)] pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        {/* Compass Emblem */}
                        <div className="flex justify-center mb-2">
                            <div className="relative w-16 h-16 flex items-center justify-center p-3 rounded-2xl bg-surface/80 border border-border shadow-md">
                                <Logo size={44} />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-text-primary tracking-tight leading-[1.08]">
                            Prêt à aborder vos prochains CCTL <br />
                            <span className="italic font-normal">avec sérénité ?</span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
                            Rejoignez dès aujourd&apos;hui les étudiants de votre campus qui révisent sur Kompas. Connectez-vous pour débloquer toutes les fonctionnalités de révision.
                        </p>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/register" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent-yellow text-black font-bold text-sm hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2.5 cursor-pointer group">
                                    <span>Créer mon compte étudiant</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <Link href="/cctl" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 py-4 rounded-xl bg-surface border border-border text-text-primary font-semibold text-sm hover:bg-surface-highlight transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                                    <BookOpen size={16} className="text-accent-yellow" />
                                    <span>Consulter les annales libres</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
