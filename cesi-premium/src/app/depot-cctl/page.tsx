'use client';

import React, { useState, useRef, DragEvent } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    UploadCloud,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles,
    Shield,
    Globe,
    ArrowRight,
    Layers,
    BookOpen,
    Download,
    Eye,
    Check,
    RotateCcw,
    Trash2,
    Plus,
    FileCheck
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CCTLExam } from '@/types/cctl';

const ACADEMIC_YEARS = [
    '2026-2027',
    '2025-2026',
    '2024-2025',
    '2023-2024',
    '2022-2023',
    '2021-2022',
    '2020-2021',
    '2019-2020'
];

function getDefaultAcademicYear(): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth() + 1;
    if (month >= 8) {
        return `${currentYear}-${currentYear + 1}`;
    } else {
        return `${currentYear - 1}-${currentYear}`;
    }
}

interface BatchCCTLItem {
    id: string; // client temporary id
    file: File;
    status: 'parsing' | 'ready' | 'error';
    parsingStep?: string;
    error?: string;
    pdfBase64?: string;
    exam?: CCTLExam;
    
    // Editable metadata
    subject: string;
    promo: string;
    domain: string;
    year: string;

    // Published result
    publishedId?: string;
    publishedTitle?: string;
}

export default function PublicCCTLDepositPage() {
    const [items, setItems] = useState<BatchCCTLItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishProgress, setPublishProgress] = useState<{ current: number; total: number } | null>(null);
    const [isAllPublished, setIsAllPublished] = useState(false);

    // Global contributor settings
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [authorName, setAuthorName] = useState('');

    // Preview question drawer
    const [previewItem, setPreviewItem] = useState<BatchCCTLItem | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf'
        );

        if (droppedFiles.length > 0) {
            await addAndParseFiles(droppedFiles);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (selectedFiles.length > 0) {
            await addAndParseFiles(selectedFiles);
        }
        // Reset input value so same files can be re-selected if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addAndParseFiles = async (filesToAdd: File[]) => {
        const newBatchItems: BatchCCTLItem[] = filesToAdd.map((file) => {
            const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

            return {
                id: tempId,
                file,
                status: 'parsing',
                parsingStep: 'Lecture du PDF...',
                subject: cleanName,
                promo: '',
                domain: 'Informatique',
                year: getDefaultAcademicYear()
            };
        });

        // Append to state
        setItems(prev => [...prev, ...newBatchItems]);

        // Process each file in parallel
        newBatchItems.forEach(async (batchItem) => {
            try {
                const formData = new FormData();
                formData.append('file', batchItem.file);

                const res = await fetch('/api/cctl/import', {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || "Échec de l'analyse du CCTL.");
                }

                const parsedExam: CCTLExam = data.exam;

                setItems(prev => prev.map(item => {
                    if (item.id === batchItem.id) {
                        return {
                            ...item,
                            status: 'ready',
                            exam: parsedExam,
                            pdfBase64: data.pdfBase64,
                            subject: parsedExam.subject || parsedExam.title || item.subject,
                            promo: parsedExam.promo || '',
                            domain: parsedExam.domain || 'Informatique',
                            year: (parsedExam as any).year || item.year || getDefaultAcademicYear()
                        };
                    }
                    return item;
                }));
            } catch (err: any) {
                setItems(prev => prev.map(item => {
                    if (item.id === batchItem.id) {
                        return {
                            ...item,
                            status: 'error',
                            error: err?.message || 'Erreur lors de la lecture de ce PDF.'
                        };
                    }
                    return item;
                }));
            }
        });
    };

    const updateItemField = (id: string, field: 'subject' | 'promo' | 'domain' | 'year', value: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
    };

    const handlePublishAll = async (e: React.FormEvent) => {
        e.preventDefault();
        const readyItems = items.filter(item => item.status === 'ready' && item.exam);
        if (readyItems.length === 0) return;

        setIsPublishing(true);
        setPublishProgress({ current: 0, total: readyItems.length });

        const updatedItems = [...items];

        for (let i = 0; i < readyItems.length; i++) {
            const currentItem = readyItems[i];
            setPublishProgress({ current: i + 1, total: readyItems.length });

            try {
                const title = `${currentItem.subject} (${currentItem.promo} - ${currentItem.year})`;

                const res = await fetch('/api/cctl/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        exam: currentItem.exam,
                        meta: {
                            title,
                            subject: currentItem.subject,
                            promo: currentItem.promo,
                            year: currentItem.year,
                            domain: currentItem.domain,
                            authorName: isAnonymous ? 'Anonyme' : (authorName.trim() || 'Étudiant CESI'),
                            isAnonymous,
                            pdfBase64: currentItem.pdfBase64 || undefined
                        }
                    })
                });

                const data = await res.json();
                if (res.ok && data.success) {
                    const idx = updatedItems.findIndex(it => it.id === currentItem.id);
                    if (idx !== -1) {
                        updatedItems[idx] = {
                            ...updatedItems[idx],
                            publishedId: data.published.id,
                            publishedTitle: data.published.title
                        };
                    }
                }
            } catch (err) {
                console.error('Error publishing item', currentItem.id, err);
            }
        }

        setItems(updatedItems);
        setIsPublishing(false);
        setIsAllPublished(true);
    };

    const handleResetAll = () => {
        setItems([]);
        setIsPublishing(false);
        setPublishProgress(null);
        setIsAllPublished(false);
        setPreviewItem(null);
    };

    const readyCount = items.filter(i => i.status === 'ready').length;
    const totalQuestionsSum = items.reduce((acc, i) => acc + (i.exam?.questions.length || 0), 0);

    return (
        <div className="min-h-screen bg-background text-text-primary relative overflow-hidden flex flex-col justify-between selection:bg-amber-300 selection:text-black">
            {/* Millimeter Grid Pattern */}
            <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

            {/* Navigation Header (Transparent, no background or border) */}
            <header className="relative z-30 px-4 sm:px-6 py-5">
                <div className="max-w-6xl mx-auto flex items-center justify-end">
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content Container */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-5xl relative z-10 space-y-8">

                {/* Page Title */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                        Déposer un CCTL
                    </h1>

                    <p className="text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Déposez un ou plusieurs sujets de CCTL en PDF. Les fichiers sont analysés, sauvegardés en base de données et stockés pour les révisions.
                    </p>
                </div>

                {/* SUCCESS SCREEN */}
                {isAllPublished ? (
                    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 sm:p-10 rounded-3xl bg-surface-card border border-border shadow-2xl text-center space-y-5">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center shadow-lg">
                                <Check className="w-8 h-8" />
                            </div>

                            <div className="space-y-1.5">
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
                                    {readyCount} CCTL{readyCount > 1 ? 's' : ''} publié{readyCount > 1 ? 's' : ''} avec succès !
                                </h2>
                                <p className="text-xs sm:text-sm text-text-secondary">
                                    Les {totalQuestionsSum} questions et les fichiers PDF sont archivés et immédiatement accessibles.
                                </p>
                            </div>

                            {/* List of Published CCTL Cards */}
                            <div className="space-y-3 pt-2 text-left">
                                {items.filter(it => it.publishedId).map((it) => (
                                    <div
                                        key={it.id}
                                        className="p-4 sm:p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2 py-0.5 rounded-md bg-surface-card border border-border text-[10px] font-mono font-bold text-accent-yellow">
                                                    {it.promo}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-surface-card border border-border text-[10px] font-mono text-text-muted">
                                                    {it.domain} • {it.year}
                                                </span>
                                                <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                                                    {it.exam?.questions.length} questions
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-text-primary truncate">
                                                {it.publishedTitle || it.subject}
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link href={`/cctl/${it.publishedId}`}>
                                                <Button variant="premium" size="sm" className="text-xs font-bold shadow-xs">
                                                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                                                    S&apos;entraîner
                                                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                </Button>
                                            </Link>
                                            <a
                                                href={`/api/cctl/${it.publishedId}/pdf`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Button variant="outline" size="sm" className="text-xs border-border/80">
                                                    <Download className="w-3.5 h-3.5 mr-1 text-accent-yellow" />
                                                    PDF
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-border/60">
                                <button
                                    type="button"
                                    onClick={handleResetAll}
                                    className="text-xs font-mono font-semibold text-accent-yellow hover:underline cursor-pointer"
                                >
                                    + Déposer d&apos;autres CCTLs
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* DEPOSIT / BATCH EDIT WORKFLOW */
                    <div className="space-y-6">
                        {/* Dropzone Container */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                                isDragging
                                    ? 'border-accent-yellow bg-accent-yellow/10 scale-[1.01] shadow-xl shadow-accent-yellow/10'
                                    : 'border-border hover:border-accent-yellow/80 bg-surface-card hover:bg-surface shadow-lg'
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                multiple
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 rounded-2xl bg-surface border border-border text-accent-yellow shadow-2xs">
                                    <UploadCloud className="w-10 h-10" />
                                </div>

                                <div className="space-y-1.5 max-w-lg">
                                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-text-primary">
                                        Glissez vos fichiers PDF ici
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                        Sélectionnez plusieurs examens à la fois. Les questions, choix de réponses et barèmes sont détectés automatiquement pour chaque document.
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="button"
                                        className="px-6 py-3 rounded-xl bg-accent-yellow text-black font-bold text-sm hover:brightness-105 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Sélectionner des fichiers PDF</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* LIST OF BATCH ITEMS */}
                        {items.length > 0 && (
                            <form onSubmit={handlePublishAll} className="space-y-6">
                                {/* Batch Header Summary */}
                                <div className="p-5 sm:p-6 rounded-3xl bg-surface-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-serif font-bold text-text-primary flex items-center gap-2">
                                            <span>Fichiers prêts à être enregistrés</span>
                                            <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow/10 border border-accent-yellow/30 text-accent-yellow text-xs font-mono font-bold">
                                                {readyCount}/{items.length}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-text-secondary">
                                            {totalQuestionsSum} questions extraites au total. Vous pouvez ajuster les matières et promotions ci-dessous.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 self-start sm:self-auto">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-mono font-semibold text-text-primary hover:bg-surface-highlight flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Plus size={14} className="text-accent-yellow" />
                                            <span>Ajouter d&apos;autres PDF</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleResetAll}
                                            className="px-3.5 py-2 rounded-xl text-xs font-mono text-text-muted hover:text-red-500 flex items-center gap-1 cursor-pointer"
                                        >
                                            <RotateCcw size={13} />
                                            <span>Vider</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Items Cards */}
                                <div className="space-y-4">
                                    {items.map((item, index) => {
                                        const isReady = item.status === 'ready';
                                        const isParsing = item.status === 'parsing';
                                        const isErr = item.status === 'error';

                                        return (
                                            <div
                                                key={item.id}
                                                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                                                    isReady
                                                        ? 'bg-surface-card border-border shadow-md'
                                                        : isParsing
                                                        ? 'bg-surface/50 border-border/80 opacity-90'
                                                        : 'bg-red-500/5 border-red-500/30'
                                                }`}
                                            >
                                                {/* Card Header */}
                                                <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/60">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center font-mono font-bold text-xs text-text-primary shrink-0">
                                                            #{index + 1}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="text-sm font-bold text-text-primary truncate">
                                                                    {item.file.name}
                                                                </h4>
                                                                <span className="text-[11px] font-mono text-text-muted">
                                                                    ({((item.file.size || 0) / 1024).toFixed(0)} Ko)
                                                                </span>
                                                            </div>

                                                            {/* Status Label */}
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {isReady && (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-semibold">
                                                                        <CheckCircle2 size={12} />
                                                                        <span>{item.exam?.questions.length} questions extraites</span>
                                                                    </span>
                                                                )}
                                                                {isParsing && (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-accent-yellow font-medium animate-pulse">
                                                                        <Loader2 size={12} className="animate-spin" />
                                                                        <span>Extraction en cours...</span>
                                                                    </span>
                                                                )}
                                                                {isErr && (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-500">
                                                                        <AlertCircle size={12} />
                                                                        <span>{item.error}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {isReady && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setPreviewItem(item)}
                                                                className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-[11px] font-mono font-medium text-text-secondary hover:text-text-primary hover:border-accent-yellow/40 flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <Eye size={12} className="text-accent-yellow" />
                                                                <span className="hidden sm:inline">Aperçu questions</span>
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors cursor-pointer"
                                                            title="Supprimer ce fichier du lot"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Card Editable Form Inputs */}
                                                {isReady && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                                                        <div className="space-y-1 sm:col-span-2 md:col-span-1">
                                                            <Label className="text-[10px] font-mono uppercase text-text-muted">
                                                                Intitulé
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={item.subject}
                                                                onChange={(e) => updateItemField(item.id, 'subject', e.target.value)}
                                                                required
                                                                className="h-9 text-xs"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-[10px] font-mono uppercase text-text-muted">
                                                                    Promotion
                                                                </Label>
                                                                {!item.promo && (
                                                                    <span className="text-[9px] font-mono text-amber-500 font-bold">
                                                                        À renseigner *
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <select
                                                                value={item.promo}
                                                                onChange={(e) => updateItemField(item.id, 'promo', e.target.value)}
                                                                required
                                                                className={`w-full h-9 bg-surface border rounded-lg px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-yellow cursor-pointer ${
                                                                    !item.promo ? 'border-amber-500/60 ring-1 ring-amber-500/30 text-amber-500 dark:text-amber-400 font-medium' : 'border-border'
                                                                }`}
                                                            >
                                                                <option value="" disabled>Choisir la promo...</option>
                                                                <option value="A1">A1 (Prépa 1)</option>
                                                                <option value="A2">A2 (Prépa 2)</option>
                                                                <option value="A3">A3 (Bac+3)</option>
                                                                <option value="A4">A4 (Bac+4)</option>
                                                                <option value="A5">A5 (Bac+5)</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-mono uppercase text-text-muted">
                                                                Domaine
                                                            </Label>
                                                            <select
                                                                value={item.domain}
                                                                onChange={(e) => updateItemField(item.id, 'domain', e.target.value)}
                                                                className="w-full h-9 bg-surface border border-border rounded-lg px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-yellow cursor-pointer"
                                                            >
                                                                <option value="Informatique">💻 Informatique</option>
                                                                <option value="BTP">🏗️ BTP</option>
                                                                <option value="Systèmes Embarqués">🤖 Systèmes Embarqués</option>
                                                                <option value="Généraliste">⚙️ Généraliste</option>
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-mono uppercase text-text-muted">
                                                                Année universitaire
                                                            </Label>
                                                            <select
                                                                value={item.year}
                                                                onChange={(e) => updateItemField(item.id, 'year', e.target.value)}
                                                                className="w-full h-9 bg-surface border border-border rounded-lg px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-yellow cursor-pointer font-mono"
                                                            >
                                                                {ACADEMIC_YEARS.map(y => (
                                                                    <option key={y} value={y}>{y}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Final Submit Action Bar */}
                                <div className="p-6 rounded-3xl bg-surface-card border border-border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResetAll}
                                        disabled={isPublishing}
                                        className="w-full sm:w-auto text-xs"
                                    >
                                        Annuler tout
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="premium"
                                        disabled={isPublishing || readyCount === 0 || items.some(i => i.status === 'ready' && !i.promo)}
                                        className="w-full sm:w-auto px-8 h-12 text-sm font-bold shadow-lg shadow-accent-yellow/20"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Publication ({publishProgress?.current}/{publishProgress?.total})...
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4 mr-2" />
                                                Publier les {readyCount} CCTL{readyCount > 1 ? 's' : ''} ({totalQuestionsSum} questions)
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Trust & Features Info */}
                        {items.length === 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="p-5 rounded-2xl bg-surface-card border border-border space-y-2">
                                    <div className="p-2 rounded-xl bg-surface border border-border w-max text-accent-yellow">
                                        <Shield size={16} />
                                    </div>
                                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
                                        100% Anonyme &amp; Sécurisé
                                    </h4>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Aucun compte requis. Vous pouvez déposer en toute confidentialité.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-surface-card border border-border space-y-2">
                                    <div className="p-2 rounded-xl bg-surface border border-border w-max text-accent-yellow">
                                        <Layers size={16} />
                                    </div>
                                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
                                        Dépôt Multiple Groupé
                                    </h4>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Déposez 1, 5 ou 10 CCTLs en même temps. Chacun est analysé et archivé.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-surface-card border border-border space-y-2">
                                    <div className="p-2 rounded-xl bg-surface border border-border w-max text-accent-yellow">
                                        <Sparkles size={16} />
                                    </div>
                                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-text-primary">
                                        Génération Interactive
                                    </h4>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        Chaque PDF devient instantanément un QCM interactif et des flashcards.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* PREVIEW MODAL FOR QUESTIONS */}
            {previewItem && previewItem.exam && (
                <div
                    onClick={() => setPreviewItem(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-surface-card rounded-3xl border border-border p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col cursor-default"
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div>
                                <h3 className="font-bold text-sm text-text-primary truncate">
                                    {previewItem.subject}
                                </h3>
                                <p className="text-xs font-mono text-accent-yellow">
                                    {previewItem.exam.questions.length} questions extraites de {previewItem.file.name}
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="p-2 rounded-full hover:bg-surface text-text-muted hover:text-text-primary cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {previewItem.exam.questions.map((q, qIdx) => (
                                <div key={qIdx} className="p-4 rounded-2xl bg-surface border border-border text-xs space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-accent-yellow">
                                                Question {q.number || qIdx + 1}
                                            </span>
                                            {q.sectionTitle && (
                                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                                                    {q.sectionTitle} {q.sectionQuestionNumber ? `• Q${q.sectionQuestionNumber}` : ''}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-mono text-text-muted px-2 py-0.5 rounded bg-surface-card border border-border">
                                            {q.typeLabel || q.type}
                                        </span>
                                    </div>
                                    {/* Prompt / Enoncé (100% Texte sélectionnable et copiable) */}
                                    <div className="space-y-2">
                                        <p className="font-medium text-text-primary leading-relaxed whitespace-pre-line select-text">
                                            {q.prompt}
                                        </p>

                                        {/* Formule mathématique isolée si présente */}
                                        {(q.formulaImageUrl || (q.promptImageUrl && q.hasPromptFormula)) && (
                                            <div className="inline-flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-border/80 shadow-xs max-w-full overflow-x-auto">
                                                <span className="text-[10px] font-mono font-bold text-text-muted shrink-0">Formule :</span>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={q.formulaImageUrl || q.promptImageUrl}
                                                    alt="Formule de l'énoncé"
                                                    className="max-h-12 w-auto object-contain dark:invert rounded"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Code Snippet si présent */}
                                    {q.codeSnippet && (
                                        <div className="p-3 rounded-xl bg-surface-highlight border border-border font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed text-text-primary">
                                            {q.codeSnippet}
                                        </div>
                                    )}

                                    {/* Question avec paires d'associations / multi-parties (Matching ou Valeurs numériques multiples) */}
                                    {q.matchingPairs && q.matchingPairs.length > 0 ? (
                                        <div className="space-y-1.5 pt-1">
                                            {q.matchingPairs.map((pair) => (
                                                <div
                                                    key={pair.id}
                                                    className="p-2.5 rounded-xl border border-border/80 bg-surface-card text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                                >
                                                    <div className="flex items-center gap-2 font-mono flex-1 min-w-0">
                                                        <span className="w-5 h-5 rounded bg-surface-highlight border border-border flex items-center justify-center text-[10px] font-bold text-text-muted shrink-0">
                                                            {pair.id}
                                                        </span>
                                                        <span className="font-semibold text-text-primary break-words">
                                                            {pair.leftItem}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0 sm:justify-end">
                                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px]">
                                                            <Check size={11} />
                                                            <span>{pair.rightExpected}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : q.type === 'short_answer' || q.type === 'fill_blank' || q.type === 'numerical' ? (
                                        /* Question à réponse courte / saisie libre / valeur numérique unique */
                                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs">
                                            <span className="text-[10px] font-mono text-text-muted uppercase">Valeur / Réponse attendue :</span>
                                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                {q.choices?.[0]?.text || q.fillBlanks?.[0]?.expectedText}
                                            </span>
                                        </div>
                                    ) : (
                                        /* QCM classique (Choix unique / multiple) */
                                        q.choices && q.choices.length > 0 && (
                                            <div className="space-y-1.5 pt-1">
                                                {q.choices.map((c, cIdx) => (
                                                    <div
                                                        key={cIdx}
                                                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
                                                            c.isExpected
                                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium'
                                                                : 'bg-surface-card border-border/80 text-text-secondary'
                                                        }`}
                                                    >
                                                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 ${
                                                            c.isExpected
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-surface-highlight text-text-muted border border-border'
                                                        }`}>
                                                            {c.id}
                                                        </span>
                                                        <span className="flex-1 break-words leading-relaxed">
                                                            {c.imageUrl && !c.text ? (
                                                                <div className="py-0.5 flex items-center">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img
                                                                        src={c.imageUrl}
                                                                        alt={`Formule proposition ${c.id}`}
                                                                        className="max-h-10 w-auto object-contain dark:invert rounded"
                                                                    />
                                                                </div>
                                                            ) : c.text ? (
                                                                c.text
                                                            ) : (
                                                                <span className="italic text-text-muted text-[11px]">
                                                                    Proposition {c.id}
                                                                </span>
                                                            )}
                                                        </span>
                                                        {c.isExpected && (
                                                            <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                                                                <Check size={10} /> Attendue
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
