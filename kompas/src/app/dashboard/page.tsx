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
    Sparkles,
    CheckCircle2,
    Target,
    ShieldAlert,
    Zap,
    X,
    Tv,
    Flame,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getSkillsDiagnostic,
    calculatePredictiveGrade,
    getExamSessionsHistory,
    SkillScore,
    PredictiveGradeResult,
    ExamSessionRecord
} from '@/lib/skills-diagnostic';
import { SkillsRadarChart } from '@/components/dashboard/SkillsRadarChart';
import { PersonalizedDailyWorkout } from '@/components/dashboard/PersonalizedDailyWorkout';
import { PromoLeaderboardCard } from '@/components/dashboard/PromoLeaderboardCard';

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
    const [skills, setSkills] = useState<SkillScore[]>([]);
    const [history, setHistory] = useState<ExamSessionRecord[]>([]);
    const [prediction, setPrediction] = useState<PredictiveGradeResult | null>(null);

    useEffect(() => {
        const load = () => {
            const data = getSkillsDiagnostic();
            setSkills(data);
            setPrediction(calculatePredictiveGrade(data));
            setHistory(getExamSessionsHistory());
        };

        load();
        window.addEventListener('kompas_skills_updated', load);
        return () => window.removeEventListener('kompas_skills_updated', load);
    }, []);

    const weakModuleNames = prediction ? prediction.criticalWeaknesses.map(w => w.name).join(', ') : '';
    const totalQuestionsAttempted = skills.reduce((acc, s) => acc + s.questionsAttempted, 0);
    const avgMastery = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.mastery, 0) / skills.length) : 0;
    const avgCohort = skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.cohortAverage, 0) / skills.length) : 0;
    const bestSkill = skills.length > 0 ? [...skills].sort((a, b) => b.mastery - a.mastery)[0] : null;
    const worstSkill = skills.length > 0 ? [...skills].sort((a, b) => a.mastery - b.mastery)[0] : null;

    return (
        <div className="space-y-6 pb-16">
            <Suspense fallback={null}>
                <PaymentSuccessBanner />
            </Suspense>

            {/* Bento Header & Quick Glance Card */}
            <div className="card-editorial p-5 sm:p-7 rounded-3xl bg-surface/70 border-border relative overflow-hidden flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5 shadow-lg">
                <div className="absolute inset-0 bg-millimeter opacity-35 pointer-events-none" />

                <div className="space-y-1.5 relative z-10 max-w-xl">
                    <h1 className="text-2xl sm:text-4xl font-normal font-serif text-text-primary tracking-tight">
                        Tableau de bord &amp; <span className="italic font-normal">Diagnostic</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary font-normal">
                        Suivez votre radar de compétences, préparez vos CCTLs et échangez avec votre promo CESI.
                    </p>
                </div>

                {/* Header Bento Quick Metric Badges */}
                <div className="relative z-10 w-full xl:w-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                    <div className="p-3 rounded-2xl bg-surface-card border border-border/80 text-left space-y-0.5">
                        <span className="text-[10px] font-mono text-text-muted uppercase block">Maîtrise Globale</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-serif font-bold text-text-primary">
                                {avgMastery}%
                            </span>
                            <span className="text-[10px] font-mono text-text-muted">
                                (Promo {avgCohort}%)
                            </span>
                        </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-card border border-border/80 text-left space-y-0.5">
                        <span className="text-[10px] font-mono text-text-muted uppercase block">Validation 1er Tour</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-mono font-bold text-emerald-500">
                                {prediction?.validationProbabilityPct || 0}%
                            </span>
                        </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-card border border-border/80 text-left space-y-0.5">
                        <span className="text-[10px] font-mono text-text-muted uppercase block">Questions Réalisées</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-mono font-bold text-accent-yellow">
                                {totalQuestionsAttempted}
                            </span>
                            <span className="text-xs text-text-muted">QCM</span>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/cctl/generateur"
                        className="p-3 rounded-2xl bg-accent-yellow text-black font-bold text-xs flex flex-col justify-center items-center text-center hover:opacity-90 transition-opacity shadow-md shadow-accent-yellow/20 group"
                    >
                        <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">Action Rapide</span>
                        <div className="flex items-center gap-1 font-serif text-xs font-bold mt-0.5">
                            <span>Nouveau CCTL</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* BENTO ROW 1: Global Diagnostic & Critical Risk Alert */}
            {prediction && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                    {/* Bento Card 1: Global Diagnostic & Competencies Overview (Col 5) */}
                    <div className="lg:col-span-5 card-editorial p-5 sm:p-7 rounded-3xl bg-surface-card border-border flex flex-col justify-between space-y-5 shadow-lg relative overflow-hidden h-full">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-text-muted font-mono font-bold text-xs uppercase tracking-wider">
                                    <Target className="w-4 h-4 text-accent-yellow" />
                                    <span>Niveau de Maîtrise Global</span>
                                </div>
                                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40">
                                    {skills.length} Domaines d&apos;Ingénierie
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2.5">
                                    <span className="text-5xl sm:text-6xl font-serif font-bold text-text-primary tracking-tight">
                                        {avgMastery}%
                                    </span>
                                    <span className="text-sm font-mono text-text-muted">
                                        (Moy. Promo : {avgCohort}%)
                                    </span>
                                </div>
                                <p className="text-xs text-text-secondary">
                                    Synthèse calculée sur vos {totalQuestionsAttempted} questions d&apos;entraînement.
                                </p>
                            </div>

                            {/* Validation Probabilities Gauge */}
                            <div className="space-y-2.5 pt-3 border-t border-border/60 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-text-secondary">Indice de préparation aux épreuves :</span>
                                    <strong className="font-mono text-text-primary text-sm font-bold">
                                        {prediction.validationProbabilityPct}%
                                    </strong>
                                </div>
                                <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${
                                            prediction.validationProbabilityPct >= 80
                                                ? 'bg-emerald-500'
                                                : prediction.validationProbabilityPct >= 50
                                                ? 'bg-accent-yellow'
                                                : 'bg-red-500'
                                        }`}
                                        style={{ width: `${prediction.validationProbabilityPct}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                                    <span>Indice de fiabilité du modèle :</span>
                                    <span className="font-mono font-semibold">{prediction.confidencePct}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-surface border border-border/70 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 text-accent-yellow font-bold text-[11px] uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Objectif de Réussite &amp; ECTS</span>
                            </div>
                            <p className="text-text-secondary leading-relaxed">
                                Visez une maîtrise &ge; 65% sur l&apos;ensemble de vos matières pour sécuriser vos semestres et crédits ECTS.
                            </p>
                        </div>
                    </div>

                    {/* Bento Card 2: Critical Vulnerabilities & Targeted Action (Col 7) */}
                    <div className="lg:col-span-7 card-editorial p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-red-500/10 via-surface-card to-surface-card border-2 border-red-500/30 flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden h-full">
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <span>Points de Fragilité Identifiés (Alerte Risque)</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-500 px-2.5 py-0.5 rounded-full border border-red-500/30">
                                    Impact estimé : -{prediction.estimatedLostPoints}% de maîtrise
                                </span>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-lg sm:text-xl font-serif font-normal text-text-primary">
                                    {prediction.criticalWeaknesses.length > 0
                                        ? `${prediction.criticalWeaknesses.length} module(s) critique(s) sous la moyenne de promo`
                                        : 'Aucune fragilité majeure détectée'}
                                </h3>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    {prediction.criticalWeaknesses.length > 0
                                        ? `Sous-performance ciblée sur : ${weakModuleNames}. C'est sur ces blocs que se joue votre validation.`
                                        : 'Vous êtes au-dessus de la moyenne de promotion sur l\'ensemble des 6 blocs d\'ingénierie.'}
                                </p>
                            </div>

                            {/* Critical modules list */}
                            <div className="space-y-2 pt-1">
                                {prediction.criticalWeaknesses.map(weakness => (
                                    <div
                                        key={weakness.id}
                                        className="p-3 rounded-2xl bg-surface border border-red-500/30 flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                            <span className="font-semibold text-text-primary truncate">
                                                {weakness.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 font-mono">
                                            <span className="text-red-500 font-bold">
                                                {weakness.mastery}% de réussite
                                            </span>
                                            <span className="text-text-muted text-[11px] hidden sm:inline">
                                                (Promo : {weakness.cohortAverage}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick CTA */}
                        <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs text-text-secondary">
                                ⚡ Générez une épreuve 100% ciblée sur vos lacunes pour rattraper ces points.
                            </div>

                            <Link
                                href={`/dashboard/cctl/generateur?subject=${encodeURIComponent(
                                    `Rattrapage ciblé : ${weakModuleNames || 'Architecture Logicielle'}`
                                )}`}
                                className="w-full sm:w-auto shrink-0"
                            >
                                <Button
                                    variant="premium"
                                    className="w-full sm:w-auto font-bold text-xs px-5 shadow-lg shadow-accent-yellow/20"
                                >
                                    <Zap className="w-4 h-4 mr-1.5" />
                                    Générer un CCTL de Rattrapage
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* BENTO ROW 2: Radar Chart & Detailed Skills Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Bento Card 3: Radar Chart Component (Col 5) */}
                <div className="lg:col-span-5 card-editorial p-5 sm:p-7 rounded-3xl bg-surface-card border-border shadow-xl space-y-4 flex flex-col justify-between items-center h-full">
                    <div className="w-full flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="space-y-0.5">
                            <h3 className="font-serif text-lg font-normal text-text-primary">
                                Radar de Compétences CESI
                            </h3>
                            <p className="text-xs text-text-secondary">
                                Comparaison temps réel avec la promotion.
                            </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-accent-yellow px-2.5 py-0.5 rounded-full bg-accent-yellow/15 border border-accent-yellow/30">
                            6 Axes
                        </span>
                    </div>

                    <div className="py-1 w-full flex justify-center items-center flex-1">
                        <SkillsRadarChart skills={skills} size={280} showCohortComparison={true} />
                    </div>

                    {/* Summary Highlights under radar */}
                    <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                        <div className="p-2.5 rounded-xl bg-surface border border-border/70 space-y-0.5">
                            <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold block">Point Fort</span>
                            <p className="font-semibold text-text-primary truncate text-[11px]">
                                {bestSkill ? `${bestSkill.shortCode} (${bestSkill.mastery}%)` : '--'}
                            </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-surface border border-border/70 space-y-0.5">
                            <span className="text-[10px] font-mono text-red-500 uppercase font-bold block">Priorité Révision</span>
                            <p className="font-semibold text-text-primary truncate text-[11px]">
                                {worstSkill ? `${worstSkill.shortCode} (${worstSkill.mastery}%)` : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bento Card 4: Detailed Competency List in a Crisp 2-Column Subgrid (Col 7) */}
                <div className="lg:col-span-7 card-editorial p-5 sm:p-7 rounded-3xl bg-surface-card border-border shadow-xl space-y-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="space-y-0.5">
                            <h3 className="font-serif text-lg font-normal text-text-primary">
                                Détail par Bloc de Compétences
                            </h3>
                            <p className="text-xs text-text-secondary">
                                Progression par domaine et écarts avec la moyenne de promotion.
                            </p>
                        </div>
                        <span className="text-xs font-mono text-text-muted px-2.5 py-0.5 rounded-full bg-surface border border-border">
                            {skills.length} modules
                        </span>
                    </div>

                    {/* 2-Column Module Grid perfectly matching Radar height */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                        {skills.map(skill => {
                            const isCritical = skill.mastery < 50;
                            const isHigh = skill.mastery >= 80;

                            return (
                                <div
                                    key={skill.id}
                                    className="p-3.5 rounded-2xl bg-surface border border-border/70 space-y-2 hover:border-accent-yellow/50 transition-colors flex flex-col justify-between"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <span className="font-semibold text-text-primary text-xs block truncate" title={skill.name}>
                                                {skill.name}
                                            </span>
                                            <span className="text-[10px] text-text-muted font-mono">
                                                {skill.questionsAttempted} QCM tentés
                                            </span>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span
                                                className={`font-mono font-bold text-xs ${
                                                    isCritical
                                                        ? 'text-red-500'
                                                        : isHigh
                                                        ? 'text-emerald-500'
                                                        : 'text-accent-yellow'
                                                }`}
                                            >
                                                {skill.mastery}%
                                            </span>
                                            <span className="text-[9px] text-text-muted block font-mono">
                                                Moy. {skill.cohortAverage}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative w-full bg-surface-card rounded-full h-1.5 overflow-hidden border border-border/60">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isCritical
                                                    ? 'bg-red-500'
                                                    : isHigh
                                                    ? 'bg-emerald-500'
                                                    : 'bg-accent-yellow'
                                            }`}
                                            style={{ width: `${skill.mastery}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer summary info */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-text-muted">
                        <span>Moyenne générale : <strong className="text-text-primary font-bold">{avgMastery}%</strong></span>
                        <span>Moyenne promotion CESI : <strong className="text-text-primary font-bold">{avgCohort}%</strong></span>
                    </div>
                </div>
            </div>

            {/* BENTO ROW 3: Personalized Daily Workout & Promo Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                    <PersonalizedDailyWorkout />
                </div>
                <div className="lg:col-span-5 flex flex-col">
                    <PromoLeaderboardCard />
                </div>
            </div>

            {/* BENTO ROW 4: Quick Actions & Ecosystem Navigation Bento Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Bento Tile 1: CCTL Archives & AI Generator */}
                <Link
                    href="/dashboard/cctl/generateur"
                    className="card-editorial p-5 rounded-3xl hover:border-accent-yellow transition-all group relative overflow-hidden flex flex-col justify-between shadow-md"
                >
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-accent-yellow text-black rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-accent-yellow uppercase tracking-wider block">
                                IA &amp; Révisions CESI
                            </span>
                            <h3 className="text-base font-serif font-normal text-text-primary group-hover:text-accent-yellow transition-colors mt-0.5">
                                Générateur &amp; Coach CCTL
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Générez des faux CCTLs blancs inédits, avec tuteur IA pas-à-pas et drills d&apos;entraînement.
                        </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border/60 flex items-center text-xs font-bold text-accent-yellow group-hover:translate-x-1 transition-transform">
                        <span>Créer un CCTL Blanc</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>

                {/* Bento Tile 2: Assistant Prosit */}
                <Link
                    href="/dashboard/prosits"
                    className="card-editorial p-5 rounded-3xl hover:border-amber-500 transition-all group relative overflow-hidden flex flex-col justify-between shadow-md"
                >
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-amber-500 text-black rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">
                                Méthode 7 Étapes
                            </span>
                            <h3 className="text-base font-serif font-normal text-text-primary group-hover:text-amber-500 transition-colors mt-0.5">
                                Assistant &amp; Fiches Prosits
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Structurez vos séances (mots-clés, problématique, plan d&apos;action) et exportez en Markdown.
                        </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border/60 flex items-center text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                        <span>Générer un Prosit</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>

                {/* Bento Tile 3: Promo Connect */}
                <Link
                    href="/dashboard/community"
                    className="card-editorial p-5 rounded-3xl hover:border-blue-400 transition-all group relative overflow-hidden flex flex-col justify-between shadow-md"
                >
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wider block">
                                Communauté CESI
                            </span>
                            <h3 className="text-base font-serif font-normal text-text-primary group-hover:text-blue-400 transition-colors mt-0.5">
                                Chat Promo &amp; Entraide
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Échangez retours d&apos;expériences, fiches mémos et entraide avec les élèves tous campus.
                        </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border/60 flex items-center text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                        <span>Rejoindre la promo</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>

                {/* Bento Tile 4: Live Battle Amphi */}
                <Link
                    href="/live/host"
                    className="card-editorial p-5 rounded-3xl hover:border-accent-yellow transition-all group relative overflow-hidden flex flex-col justify-between shadow-md bg-gradient-to-br from-accent-yellow/10 via-surface-card to-surface-card border-accent-yellow/30"
                >
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-accent-yellow text-black rounded-2xl flex items-center justify-center font-bold shadow-xs">
                            <Tv className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono font-bold text-accent-yellow uppercase tracking-wider block">
                                Mode Amphi / Salle
                            </span>
                            <h3 className="text-base font-serif font-normal text-text-primary group-hover:text-accent-yellow transition-colors mt-0.5">
                                Live Battle Rétroprojecteur
                            </h3>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed font-normal">
                            Projetez un QCM en direct sur grand écran avec code PIN et buzzer smartphone en temps réel.
                        </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border/60 flex items-center text-xs font-bold text-accent-yellow group-hover:translate-x-1 transition-transform">
                        <span>Lancer une session Live</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
