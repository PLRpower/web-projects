'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    BookOpen,
    Zap,
    Brain,
    Download,
    Loader2,
    Shuffle,
    Clock,
    Trash2,
    Edit3
} from 'lucide-react';
import { CCTLExam, CCTLQuestion, formatAcademicYear } from '@/types/cctl';
import { CCTLQuestionCard } from '@/components/cctl/CCTLQuestionCard';
import { CCTLFlashcards } from '@/components/cctl/CCTLFlashcards';
import { CCTLExamPressurePlayer } from '@/components/cctl/CCTLExamPressurePlayer';
import { Button } from '@/components/ui/button';
import { PublishedCCTLEntry } from '@/lib/cctl-store';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail } from '@/lib/admin';

export default function DashboardCCTLDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const [cctlEntry, setCctlEntry] = useState<PublishedCCTLEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'practice' | 'flashcards' | 'review' | 'pressure'>('review');
    const [isShuffled, setIsShuffled] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState<CCTLQuestion[]>([]);

    useEffect(() => {
        fetchCCTL();
        checkAdmin();
    }, [id]);

    const checkAdmin = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && (isAdminUser(user) || isAdminEmail(user.email))) {
                setIsAdmin(true);
                return;
            }
        } catch {}

        try {
            const saved = localStorage.getItem('kompas_user_profile');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.email && isAdminEmail(parsed.email)) setIsAdmin(true);
                if (parsed.role === 'admin' || parsed.isAdmin) setIsAdmin(true);
            }
        } catch {}
    };

    const handleDeleteCCTL = async () => {
        if (!window.confirm('Voulez-vous vraiment supprimer définitivement ce sujet CCTL ?')) return;

        try {
            const res = await fetch(`/api/cctl/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/dashboard/cctl');
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (e) {
            console.error('Failed to delete CCTL:', e);
        }
    };

    const fetchCCTL = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cctl/${id}`);
            const data = await res.json();
            if (!res.ok || !data.success || !data.cctl) {
                throw new Error(data.error || 'CCTL introuvable.');
            }
            setCctlEntry(data.cctl);
        } catch (e: any) {
            console.error('Failed to load CCTL:', e);
            setError(e?.message || 'Erreur lors du chargement du sujet.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 text-accent-yellow animate-spin" />
                <p className="text-sm text-text-secondary">Chargement du CCTL...</p>
            </div>
        );
    }

    if (error || !cctlEntry) {
        return (
            <div className="glass p-12 text-center rounded-3xl border border-border space-y-4 max-w-md mx-auto my-12">
                <h2 className="text-xl font-bold font-syne text-text-primary">Sujet non disponible</h2>
                <p className="text-xs text-text-secondary">{error || 'Ce CCTL n\'existe pas ou a été retiré.'}</p>
                <Link href="/dashboard/cctl">
                    <Button variant="premium" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux CCTL
                    </Button>
                </Link>
            </div>
        );
    }

    const exam: CCTLExam = cctlEntry.exam;

    const handleToggleShuffle = () => {
        if (!isShuffled) {
            const array = [...exam.questions];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            setShuffledQuestions(array);
            setIsShuffled(true);
        } else {
            setIsShuffled(false);
            setShuffledQuestions([]);
        }
    };

    const displayedQuestions = isShuffled && shuffledQuestions.length > 0 ? shuffledQuestions : exam.questions;

    return (
        <div className="space-y-8 pb-12">
            {/* Back to CCTL */}
            <Link
                href="/dashboard/cctl"
                className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour aux CCTL</span>
            </Link>

            {/* Exam Header Overview Card */}
            <div className="glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs tracking-wider uppercase">
                                {cctlEntry.promo}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-highlight text-text-secondary font-semibold text-xs border border-border">
                                {formatAcademicYear(cctlEntry.year)}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-highlight text-text-secondary font-medium text-xs border border-border">
                                {cctlEntry.domain}
                            </span>
                            <span className="text-xs text-text-secondary">
                                Partagé par : <strong className="text-text-primary">{cctlEntry.authorName}</strong>
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            {cctlEntry.subject || cctlEntry.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary font-normal">
                            Banque officielle de <strong>{exam.totalQuestions} questions</strong> avec corrigés et explications.
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

                    {/* Download PDF Action & Admin Actions */}
                    <div className="flex items-center gap-2.5">
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={handleDeleteCCTL}
                                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-bold text-xs transition-all cursor-pointer"
                                title="Supprimer ce CCTL (Admin)"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Supprimer (Admin)</span>
                            </button>
                        )}
                        <a
                            href={`/api/cctl/${cctlEntry.id}/pdf`}
                            download
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-yellow text-black hover:bg-yellow-400 font-bold text-xs shadow-lg shadow-accent-yellow/20 transition-all cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger le PDF Theia
                        </a>
                    </div>
                </div>
            </div>

            {/* Mode Navigation Tabs & Shuffle Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-highlight/40 border border-border/50">
                    <button
                        type="button"
                        onClick={() => setActiveTab('review')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'review'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Corrigé Intégral
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('practice')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'practice'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        Mode Entraînement
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('pressure')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'pressure'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        Mode Examen
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('flashcards')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'flashcards'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Brain className="w-4 h-4" />
                        Flashcards
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Shuffle Questions Button */}
                    {activeTab !== 'pressure' && (
                        <button
                            type="button"
                            onClick={handleToggleShuffle}
                            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                isShuffled
                                    ? 'bg-accent-yellow text-black border-accent-yellow shadow-md shadow-accent-yellow/20'
                                    : 'bg-surface-highlight/40 hover:bg-surface-highlight text-text-secondary hover:text-text-primary border-border/60'
                            }`}
                            title="Mélanger l'ordre des questions et masquer les numéros"
                        >
                            <Shuffle className="w-3.5 h-3.5" />
                            <span>{isShuffled ? 'Ordre Aléatoire (Actif)' : 'Mélanger les questions'}</span>
                        </button>
                    )}

                    {activeTab !== 'flashcards' && activeTab !== 'pressure' && (
                        <span className="text-xs text-text-secondary hidden md:inline">
                            <strong>{exam.totalQuestions}</strong> questions
                        </span>
                    )}
                </div>
            </div>

            {/* TAB: PRESSURE EXAM MODE */}
            {activeTab === 'pressure' ? (
                <div className="pt-2">
                    <CCTLExamPressurePlayer exam={exam} onExit={() => setActiveTab('review')} />
                </div>
            ) : activeTab === 'flashcards' ? (
                /* TAB: FLASHCARDS */
                <div className="pt-4">
                    <CCTLFlashcards questions={displayedQuestions} />
                </div>
            ) : (
                /* TAB: PRACTICE / REVIEW QUESTIONS FEED */
                <div className="space-y-6">
                    {/* Questions Cards List */}
                    <div className="space-y-6">
                        {displayedQuestions.map((question, idx) => (
                            <CCTLQuestionCard
                                key={isShuffled ? `shuffled-${question.id}-${idx}` : question.id}
                                question={question}
                                mode={activeTab === 'practice' ? 'practice' : 'review'}
                                hideQuestionNumber={isShuffled}
                                displayIndex={idx}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
