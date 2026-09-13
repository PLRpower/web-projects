'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    BookOpen,
    Zap,
    Brain,
    Download,
    EyeOff,
    Sparkles,
    Lock,
    Clock,
    CheckCircle2,
    Check,
    HelpCircle,
    FileText,
    ArrowRight,
    X,
    Shield,
    Award,
    Shuffle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/cctl/CodeBlock';
import { ALL_SEED_CCTLS } from '@/lib/cctl-seed-data';
import { PublishedCCTLEntry } from '@/lib/cctl-store';
import { formatAcademicYear, CCTLChoice, CCTLMatchingPair, CCTLQuestion } from '@/types/cctl';

function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function shuffleChoices(choices: CCTLChoice[]): CCTLChoice[] {
    if (!choices || choices.length <= 1) return choices;
    const originalIds = choices.map(c => c.id);
    const shuffled = shuffleArray(choices);
    return shuffled.map((c, idx) => ({
        ...c,
        id: originalIds[idx] || String.fromCharCode(65 + idx)
    }));
}

function shuffleMatchingPairs(pairs: CCTLMatchingPair[]): CCTLMatchingPair[] {
    if (!pairs || pairs.length <= 1) return pairs;
    const originalIds = pairs.map(p => p.id);
    const shuffled = shuffleArray(pairs);
    return shuffled.map((p, idx) => ({
        ...p,
        id: originalIds[idx] || String(idx + 1)
    }));
}

function shuffleQuestionAnswers(q: CCTLQuestion): CCTLQuestion {
    let updated = { ...q };
    if (updated.choices && updated.choices.length > 1) {
        updated.choices = shuffleChoices(updated.choices);
    }
    if (updated.matchingPairs && updated.matchingPairs.length > 1) {
        updated.matchingPairs = shuffleMatchingPairs(updated.matchingPairs);
    }
    return updated;
}

export default function PublicCCTLViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [cctlEntry, setCctlEntry] = useState<PublishedCCTLEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnswersShuffled, setIsAnswersShuffled] = useState(false);
    const [shuffleKey, setShuffleKey] = useState(0);

    useEffect(() => {
        const fetchCctl = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/cctl/${id}`);
                const data = await res.json();
                if (data.success && data.cctl) {
                    setCctlEntry(data.cctl);
                } else {
                    const fallback = ALL_SEED_CCTLS.find(c => c.id === id);
                    if (fallback) setCctlEntry(fallback);
                }
            } catch (e) {
                console.error('Failed to load cctl dynamically:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCctl();
    }, [id]);

    const handleToggleShuffleAnswers = () => {
        if (!isAnswersShuffled) {
            setIsAnswersShuffled(true);
            setShuffleKey(k => k + 1);
        } else {
            setIsAnswersShuffled(false);
        }
    };

    const exam = cctlEntry?.exam;

    const displayedQuestions = useMemo(() => {
        if (!exam || !exam.questions) return [];
        let list = [...exam.questions];
        if (isAnswersShuffled) {
            list = list.map(q => shuffleQuestionAnswers(q));
        }
        return list;
    }, [exam, isAnswersShuffled, shuffleKey]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-between">
                <Navbar />
                <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-accent-yellow border-t-transparent animate-spin" />
                    <p className="text-sm text-text-secondary">Chargement de l&apos;examen...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!cctlEntry || !exam) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-between">
                <Navbar />
                <main className="container mx-auto px-4 py-32 text-center space-y-4">
                    <h1 className="text-2xl font-bold font-syne">Examen introuvable</h1>
                    <p className="text-sm text-text-secondary">Le CCTL demandé n&apos;existe pas ou a été archivé.</p>
                    <Link href="/cctl">
                        <Button variant="premium">Retour aux CCTLs</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const redirectToRegister = (targetUrl: string = `/register?redirect=/dashboard/cctl/${id}`) => {
        router.push(targetUrl);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 pt-28 pb-24 flex-1 space-y-8 max-w-5xl">
                {/* Back Link */}
                <Link
                    href="/cctl"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux CCTL</span>
                </Link>

                {/* Exam Overview Header */}
                <div className="card-editorial rounded-3xl bg-surface-card border-border p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                                    {cctlEntry.specialty ? `${cctlEntry.specialty} • ${cctlEntry.promo}` : cctlEntry.promo}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-surface text-text-secondary font-mono font-medium text-xs border border-border">
                                    {formatAcademicYear(cctlEntry.year)}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-surface text-text-secondary font-medium text-xs border border-border">
                                    {cctlEntry.domain}
                                </span>
                            </div>

                            <span className="text-xs font-mono font-bold text-accent-yellow bg-accent-yellow/10 px-3 py-1 rounded-full border border-accent-yellow/20">
                                {exam.totalQuestions} QUESTIONS CORRIGÉES
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-4xl font-normal font-serif text-text-primary leading-tight">
                                {cctlEntry.subject || cctlEntry.title}
                            </h1>
                            <p className="text-xs sm:text-sm text-text-secondary">
                                {exam.description || `Examen officiel CESI complet comprenant l'énoncé, les extraits de code et les réponses attendues.`}
                            </p>

                            {/* AI Badges */}
                            {cctlEntry.aiBadges && cctlEntry.aiBadges.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    {cctlEntry.aiBadges.map((badge, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-mono font-semibold bg-surface border border-border px-3 py-1 rounded-xl shadow-xs text-text-primary flex items-center gap-1.5"
                                        >
                                            <span>{badge}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Engaging Action Buttons Bar */}
                    <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 relative z-10">
                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Button 1: Shuffle Answers Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToggleShuffleAnswers}
                                className={`text-xs font-semibold cursor-pointer transition-all ${
                                    isAnswersShuffled
                                        ? 'bg-accent-yellow text-black border-accent-yellow shadow-md shadow-accent-yellow/20'
                                        : 'border-border hover:border-accent-yellow text-text-primary'
                                }`}
                                title="Mélanger l'ordre des propositions et réponses au sein de chaque question"
                            >
                                <Shuffle className="w-3.5 h-3.5 mr-1.5" />
                                {isAnswersShuffled ? 'Réponses mélangées' : 'Mélanger les réponses'}
                            </Button>

                            {/* Button 2: Hide Answers (Interactive CTA) */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                                className="border-border hover:border-accent-yellow text-xs font-semibold cursor-pointer"
                            >
                                <EyeOff className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                Cacher les réponses
                            </Button>

                            {/* Button 3: Exam Simulator Mode */}
                            <Button
                                variant="premium"
                                size="sm"
                                onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                                className="text-xs font-bold shadow-md shadow-accent-yellow/20 cursor-pointer"
                            >
                                <Zap className="w-3.5 h-3.5 mr-1.5" />
                                Mode Entraînement /20
                            </Button>

                            {/* Button 4: Flashcards */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                                className="border-border text-xs font-semibold cursor-pointer"
                            >
                                <Brain className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                Flashcards
                            </Button>
                        </div>

                        {/* Download PDF Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                            className="border-border text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Télécharger PDF
                        </Button>
                    </div>
                </div>

                {/* Free Consultation Notice */}
                <div className="p-4 rounded-2xl bg-surface-highlight/30 border border-border flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2.5 text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Mode consultation libre : toutes les questions et les réponses attendues sont affichées ci-dessous.</span>
                    </div>
                    <span className="font-semibold text-accent-yellow hidden md:inline">
                        100% Corrigé officiel
                    </span>
                </div>

                {/* Questions Feed (Simplified view with questions + visible answers) */}
                <div className="space-y-6">
                    {displayedQuestions.map((question, idx) => {
                        const isMultiple = question.type === 'multiple_choice';

                        return (
                            <div
                                key={`${isAnswersShuffled ? 'sa' : 'oa'}-${shuffleKey}-${question.id || idx}`}
                                className="glass rounded-3xl border border-border/80 p-6 sm:p-7 space-y-5 shadow-lg relative overflow-hidden"
                            >
                                {/* Question Top Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                                            Question {question.number || idx + 1} / {exam.totalQuestions}
                                        </span>
                                        {question.sectionTitle && (
                                            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                                                {question.sectionTitle} {question.sectionQuestionNumber ? `• Q${question.sectionQuestionNumber}` : ''}
                                            </span>
                                        )}
                                        <span className="text-xs font-semibold text-text-secondary">
                                            {isMultiple ? 'Choix multiples' : 'Réponse unique'}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                                        className="text-xs text-text-secondary hover:text-accent-yellow font-medium transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Sparkles className="w-3 h-3 text-accent-yellow" />
                                        Tester en mode entraînement
                                    </button>
                                </div>

                                {/* Prompt & Code */}
                                <div className="space-y-3">
                                    <h3 className="text-base sm:text-lg font-normal font-serif text-text-primary leading-relaxed whitespace-pre-line">
                                        {question.prompt}
                                    </h3>

                                    {question.codeSnippet && (
                                        <CodeBlock
                                            code={question.codeSnippet}
                                            language={question.codeLanguage || 'typescript'}
                                        />
                                    )}
                                </div>

                                {/* Choices with Visible Expected Answers */}
                                {question.matchingPairs && question.matchingPairs.length > 0 ? (
                                    <div className="space-y-2.5 pt-1">
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {question.matchingPairs.map((pair) => (
                                                <div
                                                    key={pair.id}
                                                    className="p-4 rounded-2xl border border-border/80 bg-surface/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                                >
                                                    <div className="flex items-start gap-3 font-mono flex-1 min-w-0">
                                                        <span className="w-6 h-6 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-xs font-bold text-text-muted shrink-0">
                                                            {pair.id}
                                                        </span>
                                                        <span className="font-semibold text-text-primary break-words text-sm leading-relaxed">
                                                            {pair.leftItem}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold font-mono shadow-xs shrink-0 sm:justify-end">
                                                        <Check className="w-3.5 h-3.5" />
                                                        <span>{pair.rightExpected}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (question.type === 'short_answer' || question.type === 'fill_blank' || (question.type === 'numerical' && (!question.choices || question.choices.length === 0))) ? (
                                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 dark:bg-emerald-500/15 dark:border-emerald-400 flex items-start justify-between gap-3 shadow-xs">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                                <Check className="w-3.5 h-3.5" /> Réponse attendue
                                            </span>
                                            <p className="text-base sm:text-lg font-bold font-mono text-emerald-800 dark:text-emerald-300 select-text">
                                                {question.choices?.find(c => c.isExpected)?.text || question.fillBlanks?.[0]?.expectedText || ''}
                                            </p>
                                        </div>
                                        <span className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs shrink-0 shadow-xs">
                                            <Check className="w-4 h-4" /> Réponse attendue
                                        </span>
                                    </div>
                                ) : question.choices && question.choices.length > 0 ? (
                                    <div className="space-y-2.5 pt-1">
                                        {question.choices.map((choice) => {
                                            const isExpected = choice.isExpected;

                                            return (
                                                <div
                                                    key={choice.id}
                                                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                                                        isExpected
                                                            ? 'bg-emerald-500/10 border-2 border-emerald-500 dark:bg-emerald-500/15 dark:border-emerald-400 shadow-sm ring-1 ring-emerald-500/30'
                                                            : 'bg-surface/60 border-border/70 text-text-primary hover:bg-surface'
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 shadow-xs ${
                                                            isExpected
                                                                ? 'bg-emerald-500/20 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200 border border-emerald-500/40'
                                                                : 'bg-surface-highlight text-text-secondary border border-border/60'
                                                         }`}
                                                    >
                                                        {isExpected ? (isMultiple ? '✓' : '●') : choice.id}
                                                    </div>

                                                    <div className={`flex-1 text-sm leading-relaxed ${isExpected ? 'text-emerald-800 dark:text-emerald-300 font-bold sm:text-base' : 'text-text-primary font-medium'}`}>
                                                        {choice.text}
                                                    </div>

                                                    {isExpected && (
                                                        <span className="shrink-0 flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs shadow-xs">
                                                            <Check className="w-3.5 h-3.5" /> Bonne réponse
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}

                                {/* Pedagogical Explanation */}
                                {question.explanation && (
                                    <div className="p-4 rounded-2xl bg-gradient-to-r from-surface-highlight/70 to-surface border border-accent-yellow/20 space-y-1.5 text-xs">
                                        <div className="flex items-center gap-1.5 text-accent-yellow font-bold uppercase tracking-wider text-[11px]">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Explication Pédagogique
                                        </div>
                                        <p className="text-text-secondary leading-relaxed">
                                            {question.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Floating Bottom Conversion Banner */}
                <div className="glass rounded-3xl border border-accent-yellow/40 bg-gradient-to-r from-accent-yellow/15 via-surface to-surface p-8 text-center space-y-4 shadow-2xl">
                    <div className="space-y-2 max-w-xl mx-auto">
                        <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                            Vous révisez pour ce CCTL ?
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary">
                            Passez l&apos;épreuve en conditions d&apos;examen réelles avec chronomètre, note officielle sur 20 et analyse de vos points faibles.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link href="/register">
                            <Button variant="premium" size="lg" className="font-bold text-xs sm:text-sm shadow-xl shadow-accent-yellow/20">
                                <Zap className="w-4 h-4 mr-2" />
                                S&apos;entraîner en conditions réelles
                            </Button>
                        </Link>
                        <Link href="/cctl">
                            <Button variant="outline" size="lg" className="border-border/70 text-xs sm:text-sm">
                                Voir d&apos;autres CCTLs ({cctlEntry.promo})
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
