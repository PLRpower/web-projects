'use client';

import { useState, useEffect, use } from 'react';
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
    Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/cctl/CodeBlock';
import { ALL_SEED_CCTLS } from '@/lib/cctl-seed-data';
import { PublishedCCTLEntry } from '@/lib/cctl-store';
import { formatAcademicYear } from '@/types/cctl';

export default function PublicCCTLViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [cctlEntry, setCctlEntry] = useState<PublishedCCTLEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    if (!cctlEntry) {
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

    const exam = cctlEntry.exam;

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
                        </div>
                    </div>

                    {/* Engaging Action Buttons Bar */}
                    <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 relative z-10">
                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Button 1: Hide Answers (Interactive CTA) */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                                className="border-border hover:border-accent-yellow text-xs font-semibold cursor-pointer"
                            >
                                <EyeOff className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                Cacher les réponses
                            </Button>

                            {/* Button 2: Exam Simulator Mode */}
                            <Button
                                variant="premium"
                                size="sm"
                                onClick={() => redirectToRegister(`/register?redirect=/dashboard/cctl/${id}`)}
                                className="text-xs font-bold shadow-md shadow-accent-yellow/20 cursor-pointer"
                            >
                                <Zap className="w-3.5 h-3.5 mr-1.5" />
                                Mode Entraînement /20
                            </Button>

                            {/* Button 3: Flashcards */}
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
                    {exam.questions.map((question, idx) => {
                        const isMultiple = question.type === 'multiple_choice';

                        return (
                            <div
                                key={question.id || idx}
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
                                <div className="space-y-2.5 pt-1">
                                    {question.choices.map((choice) => {
                                        const isExpected = choice.isExpected;

                                        return (
                                            <div
                                                key={choice.id}
                                                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                                                    isExpected
                                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-neutral-900 dark:text-neutral-100 dark:bg-emerald-500/15 shadow-sm'
                                                        : 'bg-surface-highlight/20 border-border/40 text-text-secondary opacity-75'
                                                }`}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                                        isExpected
                                                            ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold'
                                                            : 'bg-surface-highlight text-text-secondary border border-border/60'
                                                     }`}
                                                >
                                                    {isExpected ? (isMultiple ? '✓' : '●') : choice.id}
                                                </div>

                                                <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed text-neutral-900 dark:text-neutral-100">
                                                    {choice.text}
                                                </div>

                                                {isExpected && (
                                                    <span className="shrink-0 flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                                                        <Check className="w-3 h-3" /> Bonne réponse
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

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
