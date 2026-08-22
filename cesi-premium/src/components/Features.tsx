'use client';

import { motion } from 'framer-motion';
import { FileCheck, BrainCircuit, Users, FolderOpen, FileText, Wand2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        num: "01",
        icon: <FileCheck className="w-6 h-6 text-accent-yellow" />,
        title: "CCTL & Annales Corrigées",
        description: "Accédez à la plus vaste banque de sujets d'examens annotés par les étudiants et les majors de promo du CESI.",
        tag: "Examens réels",
        link: "/cctl"
    },
    {
        num: "02",
        icon: <FolderOpen className="w-6 h-6 text-accent-yellow" />,
        title: "Livrables de Projet",
        description: "Consultez et téléchargez les DAT, cahiers des charges, rapports d'audit et diaporamas de soutenance validés.",
        tag: "Rendus de blocs",
        link: "/livrables"
    },
    {
        num: "03",
        icon: <Wand2 className="w-6 h-6 text-accent-orange" />,
        title: "Assistant Prosit en 7 Étapes",
        description: "Structurez vos séances (mots-clés, problématique, plan d'action) et exportez vos fiches directement en Markdown.",
        tag: "Méthode",
        link: "/prosits"
    },
    {
        num: "04",
        icon: <BrainCircuit className="w-6 h-6 text-blue-400" />,
        title: "Flashcards & Répétition Espacée",
        description: "Créez vos paquets de révision ou révisez les concepts clés (Maths, Physique, SOLID, SQL, Réseaux) de votre filière.",
        tag: "Mémorisation",
        link: "/dashboard/flashcards"
    },
    {
        num: "05",
        icon: <Users className="w-6 h-6 text-emerald-400" />,
        title: "Chat Promo & 25 Campus",
        description: "Discutez en direct avec votre promo, échangez vos retours d'expériences et téléchargez les templates indispensables.",
        tag: "Réseau CESI",
        link: "/dashboard/community"
    },
    {
        num: "06",
        icon: <FileText className="w-6 h-6 text-amber-500" />,
        title: "Dépôt & Partage Anonyme",
        description: "Déposez votre export de CCTL en 1 clic : l'extracteur automatique le numérise pour vos camarades en préservant l'anonymat.",
        tag: "Open Source Étudiant",
        link: "/dashboard/import"
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

