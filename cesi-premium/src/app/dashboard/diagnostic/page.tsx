'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Target,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Zap,
    BookOpen,
    ArrowRight,
    Brain,
    ShieldAlert,
    Flame,
    RotateCcw,
    Award
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

export default function DiagnosticSkillsPage() {
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

    if (!prediction) return null;

    const weakModuleNames = prediction.criticalWeaknesses.map(w => w.name).join(', ');

    return (
        <div className="space-y-8 pb-16 max-w-6xl mx-auto">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                            📊 Diagnostic &amp; Prédiction CESI
                        </span>
                        <span className="px-3 py-1 rounded-full bg-surface text-text-secondary font-mono text-xs border border-border">
                            Référentiel 6 Blocs
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-normal font-serif text-text-primary">
                        Radar de Compétences &amp; <span className="italic font-normal">Prédiction de Note</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        Analyse prédictive de vos entraînements pour anticiper votre note finale au CCTL et cibler les révisions où le gain de points est maximal.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <Link href="/dashboard/cctl/generateur">
                        <Button variant="premium" className="font-bold text-xs shadow-lg shadow-accent-yellow/20 px-5">
                            <Sparkles className="w-4 h-4 mr-2" />
                            CCTL Blanc sur-mesure
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Grid: Predictive Note & Risk FOMO Hero Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Card 1: Predictive Score & Grade (Col 5) */}
                <div className="lg:col-span-5 card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border-border flex flex-col justify-between space-y-6 shadow-lg relative overflow-hidden">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">
                                Note Prédictive Estimée
                            </span>
                            <span
                                className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                                    prediction.letterGrade === 'Grade A'
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                        : prediction.letterGrade === 'Grade B'
                                        ? 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40'
                                        : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
                                }`}
                            >
                                {prediction.letterGrade}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl sm:text-6xl font-serif font-bold text-text-primary tracking-tight">
                                    {prediction.predictedScoreOn20}
                                </span>
                                <span className="text-xl font-serif text-text-muted">/ 20</span>
                            </div>
                            <p className="text-xs text-text-secondary">
                                Estimation basée sur vos {skills.reduce((acc, s) => acc + s.questionsAttempted, 0)} questions d&apos;entraînement.
                            </p>
                        </div>

                        {/* Validation Probabilities */}
                        <div className="space-y-3 pt-3 border-t border-border/60 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-text-secondary">Probabilité de validation au 1er passage :</span>
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
                                <span>Indice de confiance du modèle :</span>
                                <span className="font-mono font-semibold">{prediction.confidencePct}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface border border-border/70 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-accent-yellow font-bold text-[11px] uppercase tracking-wider">
                            <Target className="w-3.5 h-3.5" />
                            <span>Objectif Réussite</span>
                        </div>
                        <p className="text-text-secondary leading-relaxed">
                            Chaque bloc validé avec une note ≥ 12/20 vous garantit l&apos;obtention de vos crédits ECTS sans passer par les rattrapages d&apos;été.
                        </p>
                    </div>
                </div>

                {/* Card 2: Critical Vulnerabilities & Targeted Action (FOMO) (Col 7) */}
                <div className="lg:col-span-7 card-editorial p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-red-500/10 via-surface-card to-surface-card border-2 border-red-500/30 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                <span>Points de Fragilité Identifiés (Alerte Risque)</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-500 px-2.5 py-0.5 rounded-full border border-red-500/30">
                                Perte estimée : -{prediction.estimatedLostPoints} pts
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl sm:text-2xl font-serif font-normal text-text-primary">
                                {prediction.criticalWeaknesses.length > 0
                                    ? `${prediction.criticalWeaknesses.length} module(s) critique(s) sous la moyenne`
                                    : 'Aucune fragilité majeure détectée'}
                            </h3>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                {prediction.criticalWeaknesses.length > 0
                                    ? `Les statistiques montrent une sous-performance sur : ${weakModuleNames}. C'est sur ces questions que se joue le passage en année supérieure.`
                                    : 'Vous êtes au-dessus de la moyenne de promotion sur l\'ensemble des 6 blocs d\'ingénierie.'}
                            </p>
                        </div>

                        {/* Critical modules list */}
                        <div className="space-y-2.5 pt-1">
                            {prediction.criticalWeaknesses.map(weakness => (
                                <div
                                    key={weakness.id}
                                    className="p-3.5 rounded-2xl bg-surface border border-red-500/30 flex items-center justify-between gap-3 text-xs"
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
                    <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs text-text-secondary">
                            ⚡ Générez une épreuve 100% ciblée sur vos lacunes pour rattraper ces points.
                        </div>

                        <Link
                            href={`/dashboard/cctl/generateur?subject=${encodeURIComponent(
                                `Rattrapage ciblé : ${weakModuleNames || 'Architecture Logicielle'}`
                            )}`}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="premium"
                                className="w-full sm:w-auto font-bold text-xs px-6 shadow-lg shadow-accent-yellow/20"
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Générer un CCTL de Rattrapage
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Radar Chart & Detailed Skills Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Radar Chart Component (Col 6) */}
                <div className="lg:col-span-6 card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-xl space-y-6 flex flex-col items-center justify-center">
                    <div className="w-full flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="space-y-0.5">
                            <h3 className="font-serif text-lg font-normal text-text-primary">
                                Graphique Radar de Maîtrise
                            </h3>
                            <p className="text-xs text-text-secondary">
                                Comparaison en temps réel avec la moyenne de promotion CESI.
                            </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-accent-yellow">
                            6 Axes
                        </span>
                    </div>

                    <div className="py-2 w-full flex justify-center">
                        <SkillsRadarChart skills={skills} size={330} showCohortComparison={true} />
                    </div>
                </div>

                {/* Detailed Competency List (Col 6) */}
                <div className="lg:col-span-6 card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-xl space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <h3 className="font-serif text-lg font-normal text-text-primary">
                            Détail par Bloc de Compétences
                        </h3>
                        <span className="text-xs font-mono text-text-muted">
                            {skills.length} modules évalués
                        </span>
                    </div>

                    <div className="space-y-4">
                        {skills.map(skill => {
                            const isCritical = skill.mastery < 50;
                            const isHigh = skill.mastery >= 80;

                            return (
                                <div
                                    key={skill.id}
                                    className="p-4 rounded-2xl bg-surface border border-border/70 space-y-2.5 hover:border-accent-yellow/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-highlight text-text-primary border border-border">
                                                    {skill.shortCode}
                                                </span>
                                                <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
                                                    {skill.name}
                                                </h4>
                                            </div>
                                        </div>

                                        <span
                                            className={`text-xs font-mono font-bold ${
                                                isCritical
                                                    ? 'text-red-500'
                                                    : isHigh
                                                    ? 'text-emerald-500'
                                                    : 'text-accent-yellow'
                                            }`}
                                        >
                                            {skill.mastery}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-surface-highlight rounded-full h-2 overflow-hidden border border-border/50">
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

                                    <div className="flex items-center justify-between text-[11px] text-text-muted font-mono pt-0.5">
                                        <span>
                                            {skill.questionsCorrect} / {skill.questionsAttempted} questions réussies
                                        </span>
                                        <span>Moyenne promo : {skill.cohortAverage}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Personalized Daily Workout & Campus Promo Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PersonalizedDailyWorkout />
                <PromoLeaderboardCard />
            </div>

            {/* Historical Exam & Pressure Mode Sessions */}
            {history.length > 0 && (
                <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-xl space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent-yellow" />
                            <h3 className="font-serif text-lg font-normal text-text-primary">
                                Historique des Épreuves &amp; Examens sous Pression
                            </h3>
                        </div>
                        <span className="text-xs font-mono text-text-muted">
                            {history.length} épreuve(s) enregistrée(s)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map(session => (
                            <div
                                key={session.id}
                                className="p-4 rounded-2xl bg-surface border border-border space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-0.5 rounded bg-accent-yellow text-black font-mono font-bold text-[10px]">
                                        {session.mode === 'pressure' ? '⏱️ Sous Pression' : '⚡ Entraînement'}
                                    </span>
                                    <span className="text-[11px] font-mono text-text-muted">
                                        {new Date(session.completedAt).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                                        {session.examTitle}
                                    </h4>
                                    <p className="text-[11px] text-text-secondary">
                                        {session.correctCount} / {session.totalQuestions} questions validées
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono">
                                    <span className="text-text-muted">Note finale :</span>
                                    <strong className="text-accent-yellow font-bold text-sm">
                                        {session.scoreOn20} / 20
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
