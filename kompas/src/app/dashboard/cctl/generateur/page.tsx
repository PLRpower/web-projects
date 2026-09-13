'use client';

import { useState, useRef, DragEvent } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    FileText,
    UploadCloud,
    Brain,
    Zap,
    BookOpen,
    ArrowLeft,
    Check,
    AlertCircle,
    Loader2,
    SlidersHorizontal,
    RotateCcw,
    Clock,
    FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CCTLExam } from '@/types/cctl';
import { CCTLQuestionCard } from '@/components/cctl/CCTLQuestionCard';
import { CCTLFlashcards } from '@/components/cctl/CCTLFlashcards';
import { CCTLExamPressurePlayer } from '@/components/cctl/CCTLExamPressurePlayer';

const PRESET_TOPICS = [
    {
        title: "Sécurité & Dev Web Next.js",
        promo: "A3",
        specialty: "Informatique",
        domain: "Web & Sécurité",
        desc: "JWT, XSS, CSRF, CSP, SSR vs ISR, React Hooks & Middleware"
    },
    {
        title: "Bases de Données & Modélisation Relationnelle",
        promo: "A3",
        specialty: "Informatique",
        domain: "Bases de Données",
        desc: "ACID, Formes normales 3NF/BCNF, Index B-Tree, SQL complexe"
    },
    {
        title: "DevOps, Docker & Conteneurisation",
        promo: "A4",
        specialty: "Informatique",
        domain: "Systèmes & Cloud",
        desc: "Multi-stage Dockerfile, Kubernetes Services, Pods, CI/CD"
    },
    {
        title: "Principes SOLID & Design Patterns GoF",
        promo: "A3",
        specialty: "Informatique",
        domain: "Ingénierie Logicielle",
        desc: "LSP, SRP, DIP, Observer, Strategy, Adapter, Decorator"
    },
    {
        title: "Algorithmique Avancée & Graphes",
        promo: "A2",
        specialty: "Informatique",
        domain: "Maths & Algorithmique",
        desc: "Dijkstra, Bellman-Ford, A*, Complexité temporelle O(n), Arbres"
    },
    {
        title: "Cybersécurité & Audit OWASP Top 10",
        promo: "A4",
        specialty: "Informatique",
        domain: "Cybersécurité",
        desc: "Injections SQL, Cryptographie symétrique/asymétrique, TLS"
    }
];

export default function GenerateurCCTLPage() {
    const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'presets'>('upload');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [textNotes, setTextNotes] = useState('');
    const [subject, setSubject] = useState('');
    const [promo, setPromo] = useState('A3');
    const [specialty, setSpecialty] = useState('Informatique');
    const [difficulty, setDifficulty] = useState('Examen Officiel Blanc');
    const [questionCount, setQuestionCount] = useState(10);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([
        'single_choice',
        'multiple_choice',
        'matching',
        'code_analysis'
    ]);

    // Generation Progress State
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Generated Exam State
    const [generatedExam, setGeneratedExam] = useState<CCTLExam | null>(null);
    const [examMode, setExamMode] = useState<'practice' | 'review' | 'flashcards' | 'pressure'>('practice');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const generationSteps = [
        "1. Extraction et analyse des concepts clés de votre document...",
        "2. Structuration de l'examen et définition des sous-parties DL...",
        "3. Rédaction des QCM, associations, textes à trous et snippets de code...",
        "4. Validation pédagogique selon le barème officiel CESI..."
    ];

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        }
    };

    const handleFileSelect = (file: File) => {
        setUploadedFile(file);
        setError(null);
        if (!subject) {
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
            setSubject(cleanName);
        }
    };

    const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
        setSubject(preset.title);
        setPromo(preset.promo);
        setSpecialty(preset.specialty);
        setTextNotes(`Concepts clés : ${preset.desc}`);
        setActiveTab('presets');
    };

    const handleGenerate = async () => {
        if (activeTab === 'upload' && !uploadedFile && !subject && !textNotes) {
            setError('Veuillez déposer un fichier ou renseigner un sujet de cours.');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGenerationStep(0);

        // Step simulation intervals
        const interval = setInterval(() => {
            setGenerationStep(prev => (prev < 3 ? prev + 1 : prev));
        }, 1200);

        try {
            let res: Response;

            if (uploadedFile) {
                const formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('subject', subject);
                formData.append('promo', promo);
                formData.append('specialty', specialty);
                formData.append('difficulty', difficulty);
                formData.append('questionCount', questionCount.toString());
                if (textNotes) formData.append('notes', textNotes);

                res = await fetch('/api/cctl/generate', {
                    method: 'POST',
                    body: formData
                });
            } else {
                res = await fetch('/api/cctl/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: subject || 'Architecture Logicielle',
                        notes: textNotes,
                        promo,
                        specialty,
                        difficulty,
                        questionCount,
                        questionTypes: selectedQuestionTypes
                    })
                });
            }

            const data = await res.json();
            clearInterval(interval);

            if (!res.ok || !data.success || !data.exam) {
                throw new Error(data.error || 'Échec de la génération du CCTL blanc.');
            }

            setGenerationStep(3);
            setTimeout(() => {
                setGeneratedExam(data.exam);
                setIsGenerating(false);
            }, 600);
        } catch (e: any) {
            clearInterval(interval);
            console.error('Generation error:', e);
            setError(e?.message || 'Une erreur est survenue lors de la génération.');
            setIsGenerating(false);
        }
    };

    const handleResetExam = () => {
        setGeneratedExam(null);
        setUploadedFile(null);
        setTextNotes('');
        setSubject('');
        setError(null);
    };

    return (
        <div className="space-y-8 pb-16 max-w-6xl mx-auto">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/cctl"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux CCTL</span>
                </Link>

                {generatedExam && (
                    <button
                        type="button"
                        onClick={handleResetExam}
                        className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface-highlight transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Créer un autre CCTL blanc</span>
                    </button>
                )}
            </div>

            {/* Main Header Banner */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                <div className="space-y-2 relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                            Intelligence Artificielle CESI
                        </span>
                        <span className="px-3 py-1 rounded-full bg-surface text-text-secondary font-mono text-xs border border-border">
                            Entraînement Infini
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                        Générateur IA de <span className="italic font-normal">CCTL Blancs</span> sur-mesure
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary font-normal leading-relaxed">
                        Déposez votre cours ou vos notes (PDF, Word, photos de tableau). L&apos;IA extrait automatiquement les concepts et génère une épreuve inédite conforme aux standards officiels du CESI (QCM, texte à trous, associations, code).
                    </p>
                </div>
            </div>

            {/* ================= STEP 1: CONFIGURATION & GENERATOR FORM ================= */}
            {!generatedExam ? (
                <div className="space-y-8">
                    {/* Input Tabs Bar */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
                        <button
                            type="button"
                            onClick={() => setActiveTab('upload')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === 'upload'
                                    ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/15'
                                    : 'text-text-secondary hover:text-text-primary bg-surface/50 border border-border/60'
                            }`}
                        >
                            <UploadCloud className="w-4 h-4" />
                            <span>1. Déposer un cours / notes (PDF, Word, Photos)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('text')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === 'text'
                                    ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/15'
                                    : 'text-text-secondary hover:text-text-primary bg-surface/50 border border-border/60'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>2. Saisie libre de plan &amp; notes</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('presets')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === 'presets'
                                    ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/15'
                                    : 'text-text-secondary hover:text-text-primary bg-surface/50 border border-border/60'
                            }`}
                        >
                            <Sparkles className="w-4 h-4 text-accent-yellow" />
                            <span>3. Modèles clés en main CESI</span>
                        </button>
                    </div>

                    {/* Tab 1: File Dropzone */}
                    {activeTab === 'upload' && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => !isGenerating && fileInputRef.current?.click()}
                            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                                isDragging
                                    ? 'border-accent-yellow bg-accent-yellow/10 scale-[1.01] shadow-xl shadow-accent-yellow/10'
                                    : 'border-border hover:border-accent-yellow bg-surface-card hover:bg-surface shadow-md'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                            />

                            <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                                <div className="p-4 rounded-2xl bg-surface border border-border text-accent-yellow shadow-inner">
                                    <UploadCloud className="w-10 h-10" />
                                </div>

                                {uploadedFile ? (
                                    <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 w-full">
                                        <p className="font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5">
                                            <FileCheck className="w-4 h-4" />
                                            <span>{uploadedFile.name}</span>
                                        </p>
                                        <p className="text-[11px] text-text-secondary font-mono">
                                            {(uploadedFile.size / 1024).toFixed(1)} Ko • Prêt pour l&apos;extraction
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-text-primary">
                                            Glissez votre document de cours ici
                                        </h3>
                                        <p className="text-xs text-text-secondary">
                                            Formats acceptés : PDF de cours, polycopiés, fiches Word (.docx), notes Markdown ou photos de tableau (.jpg, .png).
                                        </p>
                                    </div>
                                )}

                                <Button size="sm" variant="premium" className="text-xs font-bold px-6">
                                    {uploadedFile ? 'Changer de fichier' : 'Parcourir mes fichiers'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Text / Syllabus paste */}
                    {activeTab === 'text' && (
                        <div className="card-editorial p-6 rounded-3xl bg-surface-card border-border space-y-3 shadow-md">
                            <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary block">
                                Collez vos notes, chapitres ou plan de cours :
                            </label>
                            <textarea
                                value={textNotes}
                                onChange={(e) => setTextNotes(e.target.value)}
                                rows={6}
                                placeholder="Ex: Chapitre 1 : Authentification JWT, Tokens d'accès et de rafraîchissement. Chapitre 2 : Sécurité des en-têtes HTTP (CSP, X-Frame-Options, CORS). Chapitre 3 : Optimisation des composants React et hooks..."
                                className="w-full bg-surface border border-border rounded-2xl p-4 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted leading-relaxed"
                            />
                        </div>
                    )}

                    {/* Tab 3: Presets */}
                    {activeTab === 'presets' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {PRESET_TOPICS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset)}
                                    className={`p-5 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                                        subject === preset.title
                                            ? 'bg-accent-yellow/15 border-accent-yellow shadow-md shadow-accent-yellow/10'
                                            : 'bg-surface-card border-border hover:border-accent-yellow/50 hover:bg-surface'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-0.5 rounded bg-accent-yellow text-black font-mono font-bold text-[10px]">
                                            {preset.promo} • {preset.specialty}
                                        </span>
                                        <span className="text-[10px] font-mono text-text-muted">CESI</span>
                                    </div>
                                    <h4 className="font-serif font-normal text-base text-text-primary leading-snug">
                                        {preset.title}
                                    </h4>
                                    <p className="text-xs text-text-secondary line-clamp-2">
                                        {preset.desc}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Customization Options Bar */}
                    <div className="card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border-border space-y-6 shadow-md">
                        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                            <SlidersHorizontal className="w-4 h-4 text-accent-yellow" />
                            <h3 className="text-base font-serif font-normal text-text-primary">
                                Paramètres de l&apos;épreuve sur-mesure
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Subject Title */}
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider">
                                    Intitulé de l&apos;examen
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Ex: Sécurité et architecture web Next.js"
                                    className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                />
                            </div>

                            {/* Promo */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider">
                                    Promotion
                                </label>
                                <select
                                    value={promo}
                                    onChange={(e) => setPromo(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer"
                                >
                                    <option value="A1">Promo A1 (Prépa 1)</option>
                                    <option value="A2">Promo A2 (Prépa 2)</option>
                                    <option value="A3">Promo A3 (Bac+3)</option>
                                    <option value="A4">Promo A4 (Bac+4)</option>
                                    <option value="A5">Promo A5 (Bac+5)</option>
                                    <option value="FISA">FISA (Apprentissage)</option>
                                    <option value="FISE">FISE (Généraliste)</option>
                                </select>
                            </div>

                            {/* Number of Questions */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider">
                                    Nombre de questions
                                </label>
                                <select
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer"
                                >
                                    <option value={5}>5 questions (Flash express - 15 min)</option>
                                    <option value={10}>10 questions (Standard - 30 min)</option>
                                    <option value={15}>15 questions (Approfondi - 45 min)</option>
                                    <option value={20}>20 questions (Examen complet - 1h)</option>
                                </select>
                            </div>
                        </div>

                        {/* Question Types Checkboxes */}
                        <div className="space-y-2 pt-2 border-t border-border/40">
                            <label className="text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider block">
                                Formats de questions à inclure :
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {[
                                    { id: 'single_choice', label: 'QCM Réponse Unique' },
                                    { id: 'multiple_choice', label: 'QCM Choix Multiples' },
                                    { id: 'matching', label: 'Associations d\'éléments' },
                                    { id: 'code_analysis', label: 'Analyse de Code' }
                                ].map((type) => {
                                    const isChecked = selectedQuestionTypes.includes(type.id);
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedQuestionTypes(prev =>
                                                    isChecked
                                                        ? (prev.length > 1 ? prev.filter(t => t !== type.id) : prev)
                                                        : [...prev, type.id]
                                                );
                                            }}
                                            className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                                                isChecked
                                                    ? 'bg-accent-yellow/15 border-accent-yellow text-text-primary font-bold shadow-xs'
                                                    : 'bg-surface border-border text-text-muted hover:text-text-primary'
                                            }`}
                                        >
                                            <span>{type.label}</span>
                                            {isChecked && <Check className="w-3.5 h-3.5 text-accent-yellow" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-2.5 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Erreur de génération</p>
                                    <p className="mt-0.5">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Action Button */}
                        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-text-secondary">
                                ✨ L&apos;examen sera automatiquement corrigé avec accès au <strong>Coach IA Pas-à-Pas</strong> sur chaque question.
                            </div>

                            <Button
                                size="lg"
                                variant="premium"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full sm:w-auto font-bold text-xs sm:text-sm px-8 shadow-xl shadow-accent-yellow/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Génération du CCTL en cours...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        Générer mon CCTL Blanc Inédit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Interactive Animated Loading Modal */}
                    {isGenerating && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                            <div className="glass p-8 sm:p-10 rounded-3xl border border-accent-yellow/40 max-w-md w-full text-center space-y-6 shadow-2xl">
                                <div className="relative mx-auto w-20 h-20">
                                    <div className="w-20 h-20 rounded-full border-4 border-accent-yellow/20 border-t-accent-yellow animate-spin flex items-center justify-center">
                                        <Brain className="w-8 h-8 text-accent-yellow animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-serif font-bold text-text-primary">
                                        Création de votre examen CCTL
                                    </h3>
                                    <p className="text-xs font-mono text-accent-yellow font-bold animate-pulse">
                                        {generationSteps[generationStep]}
                                    </p>
                                </div>

                                <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-border">
                                    <div
                                        className="bg-accent-yellow h-full transition-all duration-500 ease-out rounded-full"
                                        style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                                    />
                                </div>

                                <p className="text-[11px] text-text-secondary">
                                    Extraction des concepts et formulation des questions conformes au référentiel CESI...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* ================= STEP 2: GENERATED EXAM PLAYER & ACTIONS ================= */
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* Exam Success Banner */}
                    <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-xl space-y-6 relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                                        {generatedExam.promo} • {generatedExam.specialty}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-surface text-text-secondary font-mono text-xs border border-border">
                                        {generatedExam.year}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                                        ✓ Généré par IA &amp; Enregistré
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary">
                                    {generatedExam.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-text-secondary">
                                    Épreuve inédite de <strong>{generatedExam.totalQuestions} questions</strong> avec barème officiel, extraits de code et Coach IA Pas-à-Pas.
                                </p>
                            </div>

                            {/* Direct Actions */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Link href={`/dashboard/cctl/${generatedExam.id}`}>
                                    <Button variant="premium" size="sm" className="font-bold text-xs shadow-md shadow-accent-yellow/20">
                                        <Zap className="w-3.5 h-3.5 mr-1.5" />
                                        Ouvrir en plein écran
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetExam}
                                    className="border-border text-xs"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                    Nouveau sujet
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mode Navigation Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
                        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-highlight/40 border border-border/50">
                            <button
                                type="button"
                                onClick={() => setExamMode('practice')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    examMode === 'practice'
                                        ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <Zap className="w-4 h-4" />
                                Mode Entraînement /20
                            </button>

                            <button
                                type="button"
                                onClick={() => setExamMode('pressure')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    examMode === 'pressure'
                                        ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <Clock className="w-4 h-4" />
                                Mode Examen
                            </button>

                            <button
                                type="button"
                                onClick={() => setExamMode('review')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    examMode === 'review'
                                        ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Corrigé Intégral
                            </button>

                            <button
                                type="button"
                                onClick={() => setExamMode('flashcards')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    examMode === 'flashcards'
                                        ? 'bg-accent-yellow text-black shadow-md shadow-accent-yellow/10'
                                        : 'text-text-secondary hover:text-text-primary'
                                }`}
                            >
                                <Brain className="w-4 h-4" />
                                Flashcards
                            </button>
                        </div>

                        <span className="text-xs text-text-secondary font-mono">
                            <strong>{generatedExam.totalQuestions}</strong> questions générées
                        </span>
                    </div>

                    {/* Tab Content */}
                    {examMode === 'pressure' ? (
                        <div className="pt-2">
                            <CCTLExamPressurePlayer exam={generatedExam} onExit={() => setExamMode('review')} />
                        </div>
                    ) : examMode === 'flashcards' ? (
                        <CCTLFlashcards questions={generatedExam.questions} />
                    ) : (
                        <div className="space-y-6">
                            {generatedExam.questions.map((question, idx) => (
                                <CCTLQuestionCard
                                    key={question.id || idx}
                                    question={question}
                                    mode={examMode}
                                    displayIndex={idx}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
