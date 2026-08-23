'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    TrendingUp,
    Clock,
    CheckCircle,
    BookOpen,
    FileUp,
    ArrowRight,
    FileText,
    Users,
    Award,
    FolderGit2,
    Brain,
    Archive,
    Sparkles,
    CheckCircle2,
    Target,
    ShieldAlert,
    Zap,
    X,
    Tv
} from 'lucide-react';
import { PersonalizedDailyWorkout } from '@/components/dashboard/PersonalizedDailyWorkout';
import { PromoLeaderboardCard } from '@/components/dashboard/PromoLeaderboardCard';

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
                <p className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-widest">{subtitle}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-serif font-normal text-text-primary tracking-tight">{value}</h3>
                </div>
                <p className="text-xs font-semibold text-text-secondary mt-1">{title}</p>
            </div>
        </div>
    );
}

function PaymentSuccessBanner() {
    const searchParams = useSearchParams();
    const [showBanner, setShowBanner] = useState(false);
    const [verifiedPlan, setVerifiedPlan] = useState<string>('');

    useEffect(() => {
        const payment = searchParams.get('payment');
        const sessionId = searchParams.get('session_id');

        if (payment === 'success') {
            setShowBanner(true);

            // Update local profile state
            const localProfile = localStorage.getItem('kompas_user_profile');
            let updated = {};
            if (localProfile) {
                try {
                    updated = JSON.parse(localProfile);
                } catch {}
            }
            localStorage.setItem('kompas_user_profile', JSON.stringify({
                ...updated,
                isPremium: true,
                subscriptionTier: 'Premium',
                subscriptionPlan: sessionId ? 'annual' : 'monthly',
            }));

            window.dispatchEvent(new Event('kompas_profile_updated'));

            // Verify with backend
            if (sessionId) {
                fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.plan) {
                            setVerifiedPlan(data.plan === 'annual' ? 'Pass Année Académique' : 'Pass Mensuel');
                        }
                    })
                    .catch(e => console.error('Verification error:', e));
            }
        }
    }, [searchParams]);

    if (!showBanner) return null;

    return (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-accent-yellow/20 via-surface to-accent-orange/20 border-2 border-accent-yellow/50 text-text-primary flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-accent-yellow/10">
            <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold font-syne text-text-primary flex items-center gap-2">
                        <span>Paiement Stripe Validé — Bienvenue dans Kompas Premium !</span>
                        <span className="text-[10px] font-mono font-bold bg-accent-yellow text-black px-2 py-0.5 rounded-full">
                            {verifiedPlan || 'ACTIVÉ'}
                        </span>
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                        Toutes les fonctionnalités sont désormais débloquées sans aucune restriction (CCTLs, IA 24/7, Prosits, Livrables).
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="p-1.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
            >
                <X size={16} />
            </button>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 pb-12">
            <Suspense fallback={null}>
                <PaymentSuccessBanner />
            </Suspense>

            {/* Welcome Banner */}

            <div className="card-editorial p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-35 pointer-events-none" />

                <div className="space-y-2 relative z-10 max-w-xl">
                    <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                        Espace <span className="italic font-normal">Étudiant</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary font-normal">
                        Pilotez votre parcours, vos rendus de livrables et révisions de blocs au CESI.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <Link href="/dashboard/cctl/generateur">
                        <button className="px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-sm shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer">
                            <Sparkles className="w-4 h-4" />
                            <span>Générateur IA CCTL</span>
                        </button>
                    </Link>
                    <Link href="/dashboard/cctl">
                        <button className="px-5 py-2.5 rounded-xl bg-surface-card border border-border text-text-primary font-semibold text-xs hover:bg-surface transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                            <Archive className="w-4 h-4 text-accent-yellow" />
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
                {/* Card 1: CCTL Archives & AI Generator */}
                <Link
                    href="/dashboard/cctl/generateur"
                    className="card-editorial p-6 rounded-3xl hover:border-accent-yellow transition-all group relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="space-y-3">
                        <div className="w-11 h-11 bg-accent-yellow text-black rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-accent-yellow uppercase tracking-wider block">IA &amp; Révisions CESI</span>
                            <h3 className="text-lg font-serif font-normal text-text-primary group-hover:text-accent-yellow transition-colors">
                                Générateur IA &amp; Coach CCTL
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Générez des faux CCTLs blancs inédits depuis vos cours, avec tuteur IA pas-à-pas et drills d&apos;entraînement sur vos erreurs.
                        </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-border/60 flex items-center text-xs font-bold text-accent-yellow group-hover:translate-x-1 transition-transform">
                        <span>Créer un CCTL Blanc</span>
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
                            <FileText className="w-5 h-5" />
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

                {/* Card 4: Live Battle Rétroprojecteur */}
                <Link
                    href="/live/host"
                    className="card-editorial p-6 rounded-3xl hover:border-accent-yellow transition-all group relative overflow-hidden flex flex-col justify-between sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-accent-yellow/10 via-surface-card to-surface-card border-2 border-accent-yellow/30 shadow-xl"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold shadow-md shadow-accent-yellow/20 shrink-0">
                                <Tv className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-serif font-bold text-text-primary group-hover:text-accent-yellow transition-colors">
                                        Mode Live Battle Promo (Rétroprojecteur)
                                    </h3>
                                    <span className="text-[10px] font-mono font-bold uppercase bg-accent-yellow text-black px-2 py-0.5 rounded-full">
                                        Style Kahoot
                                    </span>
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Projetez un CCTL inédit en salle de cours, affichez le QR Code / PIN et faites jouer toute votre promotion depuis leur smartphone en direct.
                                </p>
                            </div>
                        </div>

                        <div className="px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md shadow-accent-yellow/20">
                            <span>Lancer sur le Rétroprojecteur</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Personalized Daily Workout & Campus Promo Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PersonalizedDailyWorkout />
                <PromoLeaderboardCard />
            </div>

            {/* Diagnostic & Skills Radar Spotlight Banner */}
            <div className="card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border-2 border-accent-yellow/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold shadow-md shadow-accent-yellow/20 shrink-0">
                        <Target className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-serif font-normal text-text-primary">
                                Diagnostic de Maîtrise &amp; Prédiction CCTL
                            </h2>
                            <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                Note estimée : 14.2 / 20
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                            Visualisez votre radar de compétences sur les 6 blocs CESI, anticipez votre note au prochain CCTL et comblez vos lacunes avant l&apos;examen.
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/diagnostic" className="shrink-0 w-full sm:w-auto relative z-10">
                    <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2 cursor-pointer">
                        <TrendingUp className="w-4 h-4" />
                        <span>Consulter mon Radar</span>
                    </button>
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
                        <Link href="/dashboard/cctl" className="text-xs font-bold text-accent-yellow hover:underline flex items-center gap-1">
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
                            <Link href="/dashboard/cctl">
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
                            <Link href="/dashboard/cctl">
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
