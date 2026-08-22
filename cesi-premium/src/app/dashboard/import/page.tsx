'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FileUp,
    Sparkles,
    BookOpen,
    CheckCircle2,
    Search,
    RotateCcw,
    SlidersHorizontal,
    Share2,
    Globe,
    Check,
    Loader2,
    ArrowRight,
    HelpCircle,
    Eye,
    Shield,
    Calendar,
    GraduationCap
} from 'lucide-react';
import { CCTLExam, CCTLQuestion } from '@/types/cctl';
import { CCTLDropzone } from '@/components/cctl/CCTLDropzone';
import { CCTLQuestionCard } from '@/components/cctl/CCTLQuestionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ImportCCTLPage() {
    const [exam, setExam] = useState<CCTLExam | null>(null);
    const [pdfBase64, setPdfBase64] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    // Publication Form States
    const [pubSubject, setPubSubject] = useState('');
    const [pubPromo, setPubPromo] = useState('A3');
    const [pubYear, setPubYear] = useState(new Date().getFullYear().toString());
    const [pubSpecialty, setPubSpecialty] = useState('Informatique');
    const [pubAnonymous, setPubAnonymous] = useState(false);

    const [isPublishing, setIsPublishing] = useState(false);
    const [publishedResult, setPublishedResult] = useState<any>(null);
    const [publishError, setPublishError] = useState<string | null>(null);

    // Question filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const handleExamParsed = (parsedExam: CCTLExam, base64?: string) => {
        setExam(parsedExam);
        setPdfBase64(base64);
        setPubSubject(parsedExam.subject || parsedExam.title);
        setPubPromo(parsedExam.promo || 'A3');
        setPubSpecialty(parsedExam.specialty || 'Informatique');
        setPublishedResult(null);
        setPublishError(null);
    };

    const handleReset = () => {
        setExam(null);
        setPdfBase64(undefined);
        setPublishedResult(null);
        setPublishError(null);
        setSearchQuery('');
        setTypeFilter('all');
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!exam) return;

        setPublishError(null);
        setIsPublishing(true);

        try {
            const res = await fetch('/api/cctl/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    exam,
                    meta: {
                        title: `${pubSubject} (${pubPromo} - ${pubYear})`,
                        subject: pubSubject,
                        promo: pubPromo,
                        year: pubYear,
                        domain: pubSpecialty,
                        specialty: pubSpecialty,
                        isAnonymous: pubAnonymous,
                        pdfBase64
                    }
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erreur lors de la publication.');
            }

            setPublishedResult(data.published);
        } catch (err: any) {
            console.error('Publish error:', err);
            setPublishError(err?.message || 'Une erreur est survenue lors de la publication.');
        } finally {
            setIsPublishing(false);
        }
    };

    // Filter questions for verification preview
    const filteredQuestions = exam?.questions.filter(q => {
        const matchesSearch =
            q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.choices.some(c => c.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q.codeSnippet && q.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = typeFilter === 'all' || q.type === typeFilter;

        return matchesSearch && matchesType;
    }) || [];

    return (
        <div className="space-y-8 pb-16 max-w-6xl mx-auto">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-card border border-border text-[11px] font-mono text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
                        <span>NUMÉRISATION // PARSER AUTOMATIQUE</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif flex items-center gap-3 text-text-primary">
                        <Share2 className="w-8 h-8 text-accent-yellow" />
                        Publier un <span className="italic font-normal">CCTL</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Vous venez de passer un examen ? Déposez votre export PDF pour enrichir les archives et aider les promotions futures.
                    </p>
                </div>

                {exam && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 rounded-xl bg-surface-card border border-border text-xs font-semibold text-text-primary hover:bg-surface transition-all shadow-xs flex items-center gap-1.5 relative z-10 cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Déposer un autre CCTL</span>
                    </button>
                )}
            </div>

            {!exam ? (
                /* ================= STEP 1: UPLOAD ================= */
                <div className="space-y-8">
                    <CCTLDropzone
                        onExamParsed={handleExamParsed}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />

                    {/* How it works banner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="glass p-6 rounded-2xl border border-border/60 space-y-2.5">
                            <div className="p-3 bg-accent-yellow/10 text-accent-yellow rounded-xl w-fit">
                                <FileUp className="w-5 h-5" />
                            </div>
                            <h3 className="font-normal font-serif text-base text-text-primary">
                                1. Déposez votre export PDF
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Téléchargez votre copie depuis l&apos;ENT ou votre plateforme de test au format PDF officiel.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-border/60 space-y-2.5">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="font-normal font-serif text-base text-text-primary">
                                2. Extraction instantanée
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Le moteur sépare automatiquement les énoncés, codes source, questions et corrigés attendus.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-border/60 space-y-2.5">
                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-normal font-serif text-base text-text-primary">
                                3. Partagez à la promo
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Le sujet rejoint les Archives CCTL, téléchargeable en PDF ou révisable en flashcards et quiz.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* ================= STEP 2: PUBLISH FORM & EXTRACTION PREVIEW ================= */
                <div className="space-y-8">
                    {/* Publication Form Card */}
                    <div className="glass rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                        {!publishedResult ? (
                            <form onSubmit={handlePublish} className="space-y-6 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                                    <div>
                                        <span className="text-xs font-bold text-accent-yellow uppercase tracking-wider">
                                            Étape de publication
                                        </span>
                                        <h2 className="text-2xl font-bold font-syne text-text-primary mt-0.5">
                                            Détails du CCTL à publier
                                        </h2>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20">
                                            {exam.totalQuestions} questions extraites
                                        </span>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-highlight text-text-secondary border border-border">
                                            PDF joint prêt
                                        </span>
                                    </div>
                                </div>

                                {publishError && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                        {publishError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="pub-subject" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                            Intitulé du module / Sujet
                                        </Label>
                                        <Input
                                            id="pub-subject"
                                            type="text"
                                            value={pubSubject}
                                            onChange={(e) => setPubSubject(e.target.value)}
                                            required
                                            placeholder="Ex: Sécurité et techniques de développement web - I"
                                            className="bg-surface/50 border-border text-sm h-11"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pub-promo" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                            Promotion concernée
                                        </Label>
                                        <select
                                            id="pub-promo"
                                            value={pubPromo}
                                            onChange={(e) => setPubPromo(e.target.value)}
                                            className="w-full bg-surface-highlight/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer h-11"
                                        >
                                            <option value="A1">A1 (1ère année)</option>
                                            <option value="A2">A2 (2ème année)</option>
                                            <option value="A3">A3 (3ème année)</option>
                                            <option value="A4">A4 (4ème année)</option>
                                            <option value="A5">A5 (5ème année)</option>
                                            <option value="FISE">FISE (Ingénieur Généraliste)</option>
                                            <option value="FISA">FISA (Ingénieur Apprentissage)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pub-year" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                            Année de passage
                                        </Label>
                                        <Input
                                            id="pub-year"
                                            type="text"
                                            value={pubYear}
                                            onChange={(e) => setPubYear(e.target.value)}
                                            required
                                            placeholder="2025"
                                            className="bg-surface/50 border-border text-sm h-11"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="pub-specialty" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                            Spécialité d&apos;ingénierie
                                        </Label>
                                        <select
                                            id="pub-specialty"
                                            value={pubSpecialty}
                                            onChange={(e) => setPubSpecialty(e.target.value)}
                                            className="w-full bg-surface-highlight/50 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer h-11"
                                        >
                                            <option value="Informatique">Informatique (FISA / FISE)</option>
                                            <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                                            <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                            <option value="Généraliste">Généraliste &amp; Industrie</option>
                                        </select>
                                    </div>

                                    {/* Anonymity Option */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-highlight/30 border border-border/60 cursor-pointer hover:bg-surface-highlight/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={pubAnonymous}
                                                onChange={(e) => setPubAnonymous(e.target.checked)}
                                                className="w-4 h-4 rounded border-border text-accent-yellow focus:ring-accent-yellow cursor-pointer"
                                            />
                                            <div className="text-xs">
                                                <span className="font-semibold text-text-primary block">
                                                    Publier sous le statut « Anonyme »
                                                </span>
                                                <span className="text-text-secondary">
                                                    Votre nom ({exam.studentName || 'Étudiant'}) sera masqué dans les archives publiques.
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-text-secondary">
                                        Le fichier PDF original ainsi que les {exam.totalQuestions} questions interactives seront accessibles à la communauté.
                                    </p>

                                    <Button
                                        type="submit"
                                        variant="premium"
                                        size="lg"
                                        className="w-full sm:w-auto font-bold font-syne text-sm shadow-xl shadow-accent-yellow/20 px-8"
                                        disabled={isPublishing}
                                    >
                                        {isPublishing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Enregistrement & Publication...
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4 mr-2" />
                                                Confirmer et publier dans les Archives
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            /* PUBLISHED SUCCESS SCREEN */
                            <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-300 relative z-10">
                                <div className="flex justify-center">
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-emerald-400 shadow-xl shadow-emerald-500/10">
                                        <CheckCircle2 className="w-14 h-14" />
                                    </div>
                                </div>

                                <div className="space-y-2 max-w-lg mx-auto">
                                    <h2 className="text-3xl font-bold font-syne text-text-primary">
                                        CCTL publié avec succès !
                                    </h2>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        Merci pour votre contribution ! Le sujet <strong className="text-text-primary">« {publishedResult.title} »</strong> est maintenant disponible dans les Archives pour tous les étudiants.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                    <Link href={`/dashboard/archives/${publishedResult.id}`}>
                                        <Button variant="premium" className="font-bold text-xs shadow-lg shadow-accent-yellow/20 px-6">
                                            Voir la fiche du sujet
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/archives">
                                        <Button variant="outline" className="border-border/60 text-xs px-6">
                                            Consulter les Archives CCTL
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Extraction Verification Section */}
                    <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-border/60">
                            <div>
                                <h3 className="text-xl font-bold font-syne text-text-primary flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-accent-yellow" />
                                    Vérification de l'extraction ({exam.questions.length} questions détectées)
                                </h3>
                                <p className="text-xs text-text-secondary">
                                    Vérifiez que les énoncés, codes et réponses attendues (☑) ont été correctement reconnus.
                                </p>
                            </div>

                            <span className="text-xs text-text-secondary font-mono bg-surface-highlight/50 px-3 py-1.5 rounded-lg border border-border/40">
                                {filteredQuestions.length} affichée{filteredQuestions.length > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="glass p-3.5 rounded-2xl flex flex-col sm:flex-row gap-3 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans les questions extraites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface-highlight/40 border border-border/50 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-secondary/50"
                                />
                            </div>

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="bg-surface-highlight/50 border border-border/50 rounded-xl px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer w-full sm:w-auto"
                            >
                                <option value="all">Tous les types</option>
                                <option value="single_choice">QCM Réponse Unique</option>
                                <option value="multiple_choice">QCM Choix Multiples</option>
                                <option value="matching">Associations</option>
                                <option value="fill_blank">Texte à trous</option>
                            </select>
                        </div>

                        {/* Question Cards Feed in Review Mode */}
                        <div className="space-y-5">
                            {filteredQuestions.map((question) => (
                                <CCTLQuestionCard
                                    key={question.id}
                                    question={question}
                                    mode="review"
                                />
                            ))}

                            {filteredQuestions.length === 0 && (
                                <div className="glass p-10 text-center rounded-2xl border border-border/60 text-text-secondary text-xs">
                                    Aucune question ne correspond au filtre de recherche.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
