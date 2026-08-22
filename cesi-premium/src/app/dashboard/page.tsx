'use client';

import Link from 'next/link';
import {
    TrendingUp,
    Clock,
    CheckCircle,
    BookOpen,
    FileUp,
    ArrowRight,
    Wand2,
    Users,
    Award,
    FolderGit2,
    Brain,
    Archive
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="card-editorial p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface rounded-2xl border border-border group-hover:border-accent-yellow transition-colors">
                    <Icon className="w-5 h-5 text-accent-yellow" />
                </div>
                {trend && (
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
                <div className="text-3xl font-normal font-serif text-text-primary mb-1">{value}</div>
                <p className="text-xs text-text-muted font-mono">{subtitle}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif text-text-primary">
                        Tableau de bord <span className="italic font-normal">étudiant</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Pilotez votre parcours, vos rendus de livrables et révisions de blocs au CESI.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <Link href="/dashboard/archives">
                        <button className="px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-sm shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer">
                            <Archive className="w-4 h-4" />
                            <span>Annales CCTL</span>
                        </button>
                    </Link>
                    <Link href="/dashboard/livrables">
                        <button className="px-5 py-2.5 rounded-xl bg-surface-card border border-border text-text-primary font-semibold text-xs hover:bg-surface transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                            <FolderGit2 className="w-4 h-4 text-accent-yellow" />
                            <span>Livrables</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Quick Action Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: CCTL Archives */}
                <Link
                    href="/dashboard/archives"
                    className="card-editorial p-6 rounded-3xl hover:border-accent-yellow transition-all group relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="space-y-3">
                        <div className="w-11 h-11 bg-accent-yellow text-black rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Archive className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-accent-yellow uppercase tracking-wider block">Évaluation CESI</span>
                            <h3 className="text-lg font-serif font-normal text-text-primary group-hover:text-accent-yellow transition-colors">
                                Annales &amp; Sujets CCTL
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Consultez les sujets d&apos;examens complets et les grilles de correction partagées par les promotions précédentes.
                        </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-xs font-bold text-accent-yellow group-hover:translate-x-1 transition-transform">
                        <span>Explorer les CCTL</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>

                {/* Card 2: Assistant Prosit */}
                <Link
                    href="/dashboard/prosits"
                    className="card-editorial p-6 rounded-3xl hover:border-accent-orange transition-all group relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="space-y-3">
                        <div className="w-11 h-11 bg-accent-orange text-black rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-serif font-normal text-text-primary group-hover:text-accent-orange transition-colors">
                                Assistant &amp; Fiches Prosits
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Structurez vos séances en 7 étapes (mots-clés, problématique, plan d&apos;action) et exportez vos fiches en Markdown.
                        </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-xs font-bold text-accent-orange group-hover:translate-x-1 transition-transform">
                        <span>Générer un Prosit</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>

                {/* Card 3: Promo Connect */}
                <Link
                    href="/dashboard/community"
                    className="card-editorial p-6 rounded-3xl hover:border-blue-400 transition-all group relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="space-y-3">
                        <div className="w-11 h-11 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wider block">Communauté CESI</span>
                            <h3 className="text-lg font-serif font-normal text-text-primary group-hover:text-blue-400 transition-colors">
                                Chat Promo &amp; Entraide
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Échangez vos retours d&apos;expériences, astuces de soutenance et fiches mémos avec les élèves de tous campus.
                        </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                        <span>Rejoindre la promo</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Blocs Validés"
                    value="14"
                    subtitle="SUR L'ENSEMBLE DU CYCLE"
                    icon={CheckCircle}
                    trend="Grade A"
                />
                <StatCard
                    title="Temps d'Étude"
                    value="26h"
                    subtitle="CE MOIS-CI"
                    icon={Clock}
                />
                <StatCard
                    title="Niveau Global"
                    value="Grade A"
                    subtitle="ÉVALUATION CONTINUE"
                    icon={Award}
                />
                <StatCard
                    title="Compétences"
                    value="92%"
                    subtitle="RÉFÉRENTIEL OFFICIEL"
                    icon={BookOpen}
                />
            </div>

            {/* Recent Activity / Next Up */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main section: Recommended CCTLs & Quick Launch */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h2 className="text-xl font-serif font-normal text-text-primary">Annales recommandées pour votre promo</h2>
                        <Link href="/dashboard/archives" className="text-xs font-bold text-accent-yellow hover:underline flex items-center gap-1">
                            <span>Toutes les annales</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <div className="card-editorial p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-accent-yellow text-black font-mono font-bold text-[10px]">A3</span>
                                    <span className="text-xs text-text-secondary font-mono">Informatique • 20 Questions</span>
                                </div>
                                <h3 className="font-serif font-normal text-base text-text-primary">Architecture Web &amp; Scalabilité Next.js</h3>
                                <p className="text-xs text-text-secondary">Authentification JWT, optimisation des requêtes et patterns modulaires.</p>
                            </div>
                            <Link href="/dashboard/archives">
                                <button className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Consulter</span>
                                </button>
                            </Link>
                        </div>

                        <div className="card-editorial p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-mono font-bold text-[10px]">A3</span>
                                    <span className="text-xs text-text-secondary font-mono">Informatique • 18 Questions</span>
                                </div>
                                <h3 className="font-serif font-normal text-base text-text-primary">Bases de Données &amp; Modélisation Relationnelle</h3>
                                <p className="text-xs text-text-secondary">Normalisation 3NF/BCNF, transactions ACID et indexation B-Tree.</p>
                            </div>
                            <Link href="/dashboard/archives">
                                <button className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Consulter</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Specialty Skills */}
                <div className="space-y-6">
                    <h2 className="text-xl font-serif font-normal text-text-primary pb-2 border-b border-border">Compétences d&apos;Ingénierie</h2>
                    <div className="card-editorial p-6 rounded-2xl space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-text-primary">Informatique &amp; Logiciel</span>
                                <span className="font-mono font-bold text-accent-yellow">Grade A (92%)</span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                                <div className="h-full bg-accent-yellow w-[92%] rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-text-primary">Systèmes &amp; Réseaux</span>
                                <span className="font-mono font-bold text-blue-500">Grade B (84%)</span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                                <div className="h-full bg-blue-500 w-[84%] rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-text-primary">Gestion de Projet &amp; Agile</span>
                                <span className="font-mono font-bold text-emerald-500">Grade A (90%)</span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                                <div className="h-full bg-emerald-500 w-[90%] rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-text-primary">Démarche RSE &amp; Éthique</span>
                                <span className="font-mono font-bold text-accent-orange">Grade A (95%)</span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                                <div className="h-full bg-accent-orange w-[95%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
