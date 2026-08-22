'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    BookOpen,
    Zap,
    Brain,
    Download,
    Copy,
    Check,
    Search,
    Loader2,
    Calendar,
    Sparkles,
    SlidersHorizontal,
    Share2
} from 'lucide-react';
import { CCTLExam, CCTLQuestion } from '@/types/cctl';
import { CCTLQuestionCard } from '@/components/cctl/CCTLQuestionCard';
import { CCTLFlashcards } from '@/components/cctl/CCTLFlashcards';
import { Button } from '@/components/ui/button';
import { PublishedCCTLEntry } from '@/lib/cctl-store';

export default function ArchivedCCTLDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [cctlEntry, setCctlEntry] = useState<PublishedCCTLEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'practice' | 'flashcards' | 'review'>('practice');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect(() => {
        fetchCCTL();
    }, [id]);

    const fetchCCTL = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/cctl/${id}`);
            const data = await res.json();
            if (!res.ok || !data.success || !data.cctl) {
                throw new Error(data.error || 'CCTL introuvable dans les archives.');
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
                <p className="text-sm text-text-secondary">Chargement de l'archive CCTL...</p>
            </div>
        );
    }

    if (error || !cctlEntry) {
        return (
            <div className="glass p-12 text-center rounded-3xl border border-border space-y-4 max-w-md mx-auto my-12">
                <h2 className="text-xl font-bold font-syne text-text-primary">Sujet non disponible</h2>
                <p className="text-xs text-text-secondary">{error || 'Ce CCTL n\'existe pas ou a été retiré.'}</p>
                <Link href="/dashboard/archives">
                    <Button variant="premium" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux Archives
                    </Button>
                </Link>
            </div>
        );
    }

    const exam: CCTLExam = cctlEntry.exam;

    const filteredQuestions = exam.questions.filter(q => {
        const matchesSearch =
            q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.choices.some(c => c.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q.codeSnippet && q.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = typeFilter === 'all' || q.type === typeFilter;

        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Back to Archives */}
            <Link
                href="/dashboard/archives"
                className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour aux Archives CCTL</span>
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
                                {cctlEntry.year}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-highlight text-text-secondary font-medium text-xs border border-border">
                                {cctlEntry.domain}
                            </span>
                            <span className="text-xs text-text-secondary">
                                Partagé par : <strong className="text-text-primary">{cctlEntry.authorName}</strong>
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-syne text-text-primary">
                            {cctlEntry.subject || cctlEntry.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary">
                            Banque officielle de <strong>{exam.totalQuestions} questions</strong> avec corrigés et explications.
                        </p>
                    </div>

                    {/* Download PDF Action */}
                    <div className="flex items-center gap-2.5">
                        <a
                            href={`/api/cctl/${cctlEntry.id}/pdf`}
                            download
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-yellow text-black hover:bg-yellow-400 font-bold text-xs shadow-lg shadow-accent-yellow/20 transition-all cursor-pointer"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger le PDF original
                        </a>
                    </div>
                </div>
            </div>

            {/* Mode Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-highlight/40 border border-border/50">
                    <button
                        type="button"
                        onClick={() => setActiveTab('practice')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'practice'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        Mode Entraînement ({exam.questions.length})
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('flashcards')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'flashcards'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Brain className="w-4 h-4" />
                        Flashcards
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('review')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            activeTab === 'review'
                                ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Corrigé Intégral
                    </button>
                </div>

                {activeTab !== 'flashcards' && (
                    <span className="text-xs text-text-secondary">
                        Affichage de <strong>{filteredQuestions.length}</strong> sur {exam.totalQuestions} question{exam.totalQuestions > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* TAB: FLASHCARDS */}
            {activeTab === 'flashcards' ? (
                <div className="pt-4">
                    <CCTLFlashcards questions={filteredQuestions.length > 0 ? filteredQuestions : exam.questions} />
                </div>
            ) : (
                /* TAB: PRACTICE / REVIEW QUESTIONS FEED */
                <div className="space-y-6">
                    {/* Search & Filter Bar */}
                    <div className="glass p-4 rounded-xl flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Filtrer les questions par mot-clé, code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface-highlight/40 border border-border/50 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-secondary/50"
                            />
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-surface-highlight/50 border border-border/50 rounded-lg px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer w-full sm:w-auto"
                        >
                            <option value="all">Tous les types</option>
                            <option value="single_choice">QCM Réponse Unique</option>
                            <option value="multiple_choice">QCM Choix Multiples</option>
                            <option value="matching">Associations</option>
                            <option value="fill_blank">Texte à trous</option>
                        </select>
                    </div>

                    {/* Questions Cards List */}
                    <div className="space-y-6">
                        {filteredQuestions.map((question) => (
                            <CCTLQuestionCard
                                key={question.id}
                                question={question}
                                mode={activeTab === 'practice' ? 'practice' : 'review'}
                            />
                        ))}

                        {filteredQuestions.length === 0 && (
                            <div className="glass p-12 text-center rounded-2xl border border-border/60 text-text-secondary space-y-2">
                                <SlidersHorizontal className="w-8 h-8 mx-auto text-text-secondary/60" />
                                <p className="font-semibold text-text-primary">Aucune question ne correspond à vos filtres.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
