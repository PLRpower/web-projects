'use client';

import { motion } from 'framer-motion';
import { Sparkles, Bot, FileCheck, BrainCircuit, Users, FolderOpen, FileText, Wand2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        num: "01",
        icon: <Sparkles className="w-6 h-6 text-accent-yellow" />,
        title: "Générateur IA de CCTL Blancs",
        description: "Déposez votre cours ou vos notes (PDF, Word, photos). Un faux CCTL inédit sera généré au format exact du CESI pour vous entraîner à l'infini.",
        tag: "IA Générative CESI",
        link: "/dashboard/cctl/generateur"
    },
    {
        num: "02",
        icon: <Bot className="w-6 h-6 text-accent-orange" />,
        title: "Coach IA Pas-à-Pas & Tuteur",
        description: "Sur chaque question ratée, le tuteur IA détaille le raisonnement méthodique, déjoue les pièges et donne l'astuce de mémorisation clé.",
        tag: "Tuteur Virtuel 24/7",
        link: "/dashboard/cctl"
    },
    {
        num: "03",
        icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
        title: "CCTL & Annales Corrigées",
        description: "Accédez à la plus vaste banque de sujets d'examens réels annotés par les étudiants et les majors de promo de tous les campus CESI.",
        tag: "Examens réels",
        link: "/cctl"
    },
    {
        num: "04",
        icon: <FolderOpen className="w-6 h-6 text-blue-400" />,
        title: "Livrables de Projet Validés",
        description: "Consultez et téléchargez les DAT, cahiers des charges, rapports d'audit et diaporamas de soutenance certifiés.",
        tag: "Rendus de blocs",
        link: "/livrables"
    },
    {
        num: "05",
        icon: <Wand2 className="w-6 h-6 text-accent-yellow" />,
        title: "Assistant Prosit en 7 Étapes",
        description: "Structurez vos séances (mots-clés, problématique, plan d'action) et exportez vos fiches directement en Markdown.",
        tag: "Méthode PBA",
        link: "/prosits"
    },
    {
        num: "06",
        icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
        title: "Flashcards & Mode Hors-Ligne (PWA)",
        description: "Révisez vos fiches et CCTL dans les transports (bus, train, métro) sur smartphone même sans connexion Internet.",
        tag: "Transports & Offline",
        link: "/dashboard/flashcards"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 pb-6 border-b border-border">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-xs font-mono font-semibold uppercase tracking-wider text-text-secondary border border-border">
                            <span className="w-2 h-2 rounded-full bg-accent-yellow" />
                            MODULES // BOÎTE À OUTILS
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-text-primary tracking-tight leading-tight">
                            Tout ce dont vous avez besoin <br />
                            <span className="italic font-normal">pour exceller</span> au CESI.
                        </h2>
                    </div>

                    <p className="text-sm text-text-secondary max-w-md leading-relaxed">
                        Conçu spécifiquement pour la pédagogie par projets du CESI : des CCTLs théoriques aux soutenances de livrables.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="card-editorial rounded-3xl p-7 flex flex-col justify-between relative group"
                        >
                            <div className="space-y-5">
                                {/* Top info row */}
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-text-muted">
                                        [{feature.num}]
                                    </span>
                                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-surface text-text-secondary border border-border/80">
                                        {feature.tag}
                                    </span>
                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center group-hover:border-accent-yellow transition-colors">
                                    {feature.icon}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-serif font-normal text-text-primary group-hover:text-accent-yellow transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-border/60">
                                <Link
                                    href={feature.link}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-accent-yellow transition-colors group/link"
                                >
                                    <span>Explorer le module</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform text-accent-yellow" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

