'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowRight, 
    CheckCircle2,
    FileCode,
    BookOpen,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

const PHASES = [
    {
        phaseNum: "01",
        title: "Prosits",
        subtitle: "Démarrez vos séances PBL avec la démarche méthodologique officielle du CESI.",
        icon: <FileCode className="w-5 h-5 text-accent-yellow" />,
        checklist: [
            "Génération de la problématique et du plan d'action en 7 étapes",
            "Export de la synthèse directement au format Markdown pour le groupe"
        ],
        keyMetric: "7 Étapes"
    },
    {
        phaseNum: "02",
        title: "Simulations CCTL",
        subtitle: "Entraînez-vous sur les sujets réels des promotions précédentes avec barème officiel.",
        icon: <BookOpen className="w-5 h-5 text-accent-yellow" />,
        checklist: [
            "Accès aux annales réelles annotées par les majors",
            "Analyse des questions pièges et explications techniques détaillées"
        ],
        keyMetric: "2 540+ Sujets"
    },
    {
        phaseNum: "03",
        title: "Livrables de Projet",
        subtitle: "Préparez votre diaporama et vos livrables de projet selon les critères des jurys.",
        icon: <GraduationCap className="w-5 h-5 text-accent-yellow" />,
        checklist: [
            "Téléchargement des templates de livrables conformes",
            "Vérification des grilles d'évaluation des jurys d'ingénieurs"
        ],
        keyMetric: "180+ Dossiers"
    }
];

export default function HowItWorks() {
    return (
        <section className="py-20 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                
                {/* Section Header */}
                <div className="text-center mb-12 space-y-3 max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                        De la première séance Prosit <br />
                        <span className="italic font-normal">à la soutenance finale.</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Une progression continue pour structurer vos révisions et préparer chaque étape du semestre.
                    </p>
                </div>

                {/* 3-PHASE STEP CARDS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                    {PHASES.map((phase, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            viewport={{ once: true }}
                            className="rounded-3xl p-6 sm:p-7 bg-surface-card border border-border shadow-md flex flex-col justify-between space-y-5"
                        >
                            <div className="space-y-3">
                                {/* Header line with step number */}
                                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                    <span className="text-3xl font-serif font-normal tracking-tight text-text-primary">
                                        {phase.phaseNum}.
                                    </span>
                                    <span className="text-xs font-serif font-bold text-accent-yellow">
                                        {phase.keyMetric}
                                    </span>
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="font-serif text-lg font-normal text-text-primary">
                                        {phase.title}
                                    </h3>
                                    <p className="text-xs text-text-secondary leading-relaxed pt-1">
                                        {phase.subtitle}
                                    </p>
                                </div>

                                {/* Checklist Items */}
                                <div className="space-y-1.5 pt-1">
                                    {phase.checklist.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs text-text-primary">
                                            <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-accent-yellow" />
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link href="/register">
                                    <span className="text-xs font-bold text-accent-yellow hover:underline inline-flex items-center gap-1">
                                        <span>Accéder aux ressources</span>
                                        <ArrowRight size={12} />
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
