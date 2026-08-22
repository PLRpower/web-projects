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

export default function PublicCCTLViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [cctlEntry, setCctlEntry] = useState<PublishedCCTLEntry>(() => {
        return ALL_SEED_CCTLS.find(c => c.id === id) || ALL_SEED_CCTLS[0];
    });

    useEffect(() => {
        const fetchCctl = async () => {
            try {
                const res = await fetch(`/api/cctl/${id}`);
                const data = await res.json();
                if (data.success && data.cctl) {
                    setCctlEntry(data.cctl);
                }
            } catch (e) {
                console.error('Failed to load cctl dynamically:', e);
            }
        };
        fetchCctl();
    }, [id]);

    const exam = cctlEntry.exam;

    // Modal state for locked features
    const [lockedModal, setLockedModal] = useState<{
        open: boolean;
        title: string;
        description: string;
        actionLabel: string;
        targetUrl: string;
    }>({
        open: false,
        title: '',
        description: '',
        actionLabel: 'Se connecter',
        targetUrl: '/login'
    });

    const triggerLockedFeature = (featureName: string, description: string, targetUrl: string = `/login?redirect=/dashboard/archives/${id}`) => {
        setLockedModal({
            open: true,
            title: featureName,
            description,
            actionLabel: 'Se connecter / Créer un compte',
            targetUrl
        });
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
                                    {cctlEntry.year}
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
                                onClick={() => triggerLockedFeature(
                                    'Masquer les réponses & S\'entraîner',
                                    'Pour masquer les réponses et tester vos connaissances en mode interactif sans tricher, connectez-vous à votre compte étudiant Kompas | CESI.',
                                    `/login?redirect=/dashboard/archives/${id}`
                                )}
                                className="border-border hover:border-accent-yellow text-xs font-semibold"
                            >
                                <EyeOff className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                Cacher les réponses
                            </Button>

                            {/* Button 2: Exam Simulator Mode */}
                            <Button
                                variant="premium"
                                size="sm"
                                onClick={() => triggerLockedFeature(
                                    'Simulateur d\'Examen Chronométré',
                                    'Le mode examen reproduit les conditions réelles du CCTL avec un compte à rebours de 45 minutes, le calcul de la note sur 20 et le décompte des discordances.',
                                    `/login?redirect=/dashboard/training`
                                )}
                                className="text-xs font-bold shadow-md shadow-accent-yellow/20"
                            >
                                <Zap className="w-3.5 h-3.5 mr-1.5" />
                                Mode Entraînement /20
                            </Button>

                            {/* Button 3: Flashcards */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => triggerLockedFeature(
                                    'Flashcards de Mémorisation',
                                    'Révisez ce sujet de CCTL avec des cartes interactives 3D recto/verso et suivez votre niveau de maîtrise question par question.',
                                    `/login?redirect=/dashboard/training`
                                )}
                                className="border-border text-xs font-semibold"
                            >
                                <Brain className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                Flashcards
                            </Button>
                        </div>

                        {/* Download PDF Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => triggerLockedFeature(
                                'Télécharger le Sujet en PDF',
                                'Connectez-vous pour télécharger les sujets complets d\'examens CCTL au format PDF original avec mise en page CESI.',
                                `/login?redirect=/dashboard/archives/${id}`
                            )}
                            className="border-border text-xs text-text-secondary hover:text-text-primary"
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
                                        onClick={() => triggerLockedFeature(
                                            'Mode Entraînement Interactif',
                                            'Pour cocher vos propres réponses et obtenir une note personnalisée sur 20, lancez le mode entraînement.',
                                            `/login?redirect=/dashboard/training`
                                        )}
                                        className="text-xs text-text-secondary hover:text-accent-yellow font-medium transition-colors flex items-center gap-1"
                                    >
                                        <Lock className="w-3 h-3" />
                                        Tester en mode quiz
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

            {/* Modal for Locked Actions */}
            {lockedModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="glass rounded-3xl border border-accent-yellow/30 bg-surface p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            onClick={() => setLockedModal({ ...lockedModal, open: false })}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-highlight text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-3 text-center pt-2">
                            <div className="w-14 h-14 rounded-2xl bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 flex items-center justify-center mx-auto text-2xl shadow-lg">
                                <Lock className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-normal font-serif text-text-primary">
                                {lockedModal.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                {lockedModal.description}
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link href="/login" className="block w-full">
                                <Button variant="premium" className="w-full font-bold shadow-lg shadow-accent-yellow/20">
                                    Se connecter avec mon compte CESI
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>

                            <Link href="/register" className="block w-full">
                                <Button variant="outline" className="w-full border-border/70 font-semibold text-xs">
                                    Créer un compte gratuit
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
