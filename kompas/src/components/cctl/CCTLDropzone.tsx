'use client';

import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CCTLExam } from '@/types/cctl';

interface CCTLDropzoneProps {
    onExamParsed: (exam: CCTLExam, pdfBase64?: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    isAnonymous?: boolean;
}

export function CCTLDropzone({ onExamParsed, isLoading, setIsLoading, isAnonymous = true }: CCTLDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsingStep, setParsingStep] = useState<string>('');
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

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            await processFile(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
        }
    };

    const processFile = async (file: File) => {
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            setError('Veuillez déposer un fichier PDF valide (.pdf).');
            return;
        }

        setError(null);
        setIsLoading(true);
        setParsingStep('Lecture et extraction du document...');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('isAnonymous', isAnonymous ? 'true' : 'false');

            setParsingStep('Détection des questions, types et réponses...');

            const res = await fetch('/api/cctl/import', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Échec de l\'analyse du CCTL.');
            }

            setParsingStep('Génération des questions et aperçu...');
            setTimeout(() => {
                onExamParsed(data.exam, data.pdfBase64);
                setIsLoading(false);
            }, 300);
        } catch (err: any) {
            console.error('Import error:', err);
            setError(err?.message || 'Une erreur est survenue lors du traitement du fichier.');
            setIsLoading(false);
        }
    };

    const handleLoadExample = async () => {
        setError(null);
        setIsLoading(true);
        setParsingStep('Chargement de l\'exemple CCTL A3...');

        try {
            const res = await fetch('/api/cctl/example');
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Impossible de charger l\'exemple.');
            }

            setParsingStep('Détection des 20 questions et barèmes...');
            setTimeout(() => {
                onExamParsed(data.exam);
                setIsLoading(false);
            }, 400);
        } catch (err: any) {
            console.error('Example load error:', err);
            setError(err?.message || 'Erreur lors du chargement de l\'exemple.');
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Main Dropzone Card */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isLoading && fileInputRef.current?.click()}
                className={`relative rounded-3xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                        ? 'border-accent-yellow bg-accent-yellow/10 scale-[1.01] shadow-xl shadow-accent-yellow/10'
                        : 'border-border hover:border-accent-yellow bg-surface-card hover:bg-surface shadow-md'
                } ${isLoading ? 'pointer-events-none opacity-85' : ''}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-accent-yellow/20 border-t-accent-yellow animate-spin flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-accent-yellow animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-serif font-bold text-text-primary">Analyse automatique en cours</h3>
                            <p className="text-xs font-mono text-accent-yellow font-medium animate-pulse">{parsingStep}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 rounded-2xl bg-surface border border-border text-accent-yellow">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <div className="space-y-1.5 max-w-md">
                            <h3 className="text-2xl font-serif font-bold text-text-primary">
                                Glissez-déposez votre export PDF de CCTL
                            </h3>
                            <p className="text-xs sm:text-sm text-text-secondary">
                                Compatible avec tous les CCTLs CESI (Moodle / Wooclap / TestWe). Analyse instantanée de toutes les questions et barèmes.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <FileText className="w-4 h-4" />
                                <span>Parcourir mes fichiers</span>
                            </button>
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-xl bg-surface border border-border text-text-primary font-semibold text-xs hover:bg-surface-highlight transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLoadExample();
                                }}
                            >
                                <Sparkles className="w-4 h-4 text-accent-yellow" />
                                <span>Tester avec l&apos;exemple du projet</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-start gap-3 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Erreur d&apos;importation</p>
                        <p className="text-red-500/80 mt-0.5">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
