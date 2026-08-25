'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Share2, CheckCircle2, Globe, Shield, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CCTLExam } from '@/types/cctl';

interface CCTLPublishModalProps {
    exam: CCTLExam;
    isOpen: boolean;
    onClose: () => void;
    onPublished?: (publishedId: string) => void;
}

export function CCTLPublishModal({ exam, isOpen, onClose, onPublished }: CCTLPublishModalProps) {
    const [title, setTitle] = useState(exam.title || exam.subject);
    const [subject, setSubject] = useState(exam.subject || exam.title);
    const [promo, setPromo] = useState(exam.promo || 'A3');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [domain, setDomain] = useState(exam.domain || 'Développement Web');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [publishedData, setPublishedData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/cctl/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    exam,
                    meta: {
                        title,
                        subject,
                        promo,
                        year,
                        domain,
                        isAnonymous
                    }
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erreur lors de la publication.');
            }

            setPublishedData(data.published);
            if (onPublished) onPublished(data.published.id);
        } catch (err: any) {
            console.error('Publish error:', err);
            setError(err?.message || 'Une erreur est survenue lors de la publication.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg glass rounded-3xl border border-border p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-highlight text-text-secondary hover:text-text-primary transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {!publishedData ? (
                    <form onSubmit={handlePublish} className="space-y-5">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-accent-yellow/10 border border-accent-yellow/30 text-accent-yellow rounded-2xl">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-syne text-text-primary">
                                    Publier dans les Archives CCTL
                                </h2>
                                <p className="text-xs text-text-secondary">
                                    Partagez ce sujet avec les futures promotions et camarades du CESI.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 pt-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="pub-subject" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                    Intitulé du CCTL / Module
                                </Label>
                                <Input
                                    id="pub-subject"
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="bg-surface/50 border-border text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="pub-promo" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Promotion
                                    </Label>
                                    <select
                                        id="pub-promo"
                                        value={promo}
                                        onChange={(e) => setPromo(e.target.value)}
                                        required
                                        className="w-full bg-surface-highlight/50 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer"
                                    >
                                        <option value="" disabled>Sélectionner la promo...</option>
                                        <option value="A1">A1 (1ère année)</option>
                                        <option value="A2">A2 (2ème année)</option>
                                        <option value="A3">A3 (3ème année)</option>
                                        <option value="A4">A4 (4ème année)</option>
                                        <option value="A5">A5 (5ème année)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="pub-year" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        Année de passage
                                    </Label>
                                    <Input
                                        id="pub-year"
                                        type="text"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        required
                                        className="bg-surface/50 border-border text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="pub-domain" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                    Majeure / Domaine
                                </Label>
                                <select
                                    id="pub-domain"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full bg-surface-highlight/50 border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer"
                                >
                                    <option value="Informatique">Informatique</option>
                                    <option value="BTP">BTP</option>
                                    <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                    <option value="Généraliste">Généraliste</option>
                                </select>
                            </div>

                            {/* Anonymity toggle */}
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-highlight/30 border border-border/50 cursor-pointer hover:bg-surface-highlight/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-accent-yellow focus:ring-accent-yellow cursor-pointer"
                                />
                                <div className="text-xs">
                                    <span className="font-semibold text-text-primary block">
                                        Publier anonymement
                                    </span>
                                    <span className="text-text-secondary">
                                        Votre nom d'étudiant ({exam.studentName && exam.studentName !== 'Utilisateur Anonyme' ? exam.studentName : 'Étudiant'}) ne sera pas affiché publiquement.
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
                            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                                Annuler
                            </Button>
                            <Button type="submit" variant="premium" size="sm" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Publication en cours...
                                    </>
                                ) : (
                                    <>
                                        <Globe className="w-4 h-4 mr-2" />
                                        Publier dans les Archives ({exam.totalQuestions} questions)
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    /* Success Screen */
                    <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-200 py-2">
                        <div className="flex justify-center">
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold font-syne text-text-primary">
                                CCTL publié dans les Archives !
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Le sujet <strong className="text-text-primary">« {publishedData.title} »</strong> ({publishedData.totalQuestions} questions) est désormais consultable par tous les étudiants.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link href={`/dashboard/cctl/${publishedData.id}`} className="w-full sm:w-auto">
                                <Button variant="premium" className="w-full text-xs font-bold">
                                    Voir la fiche & s'entraîner
                                    <ArrowRight className="w-4 h-4 ml-1.5" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/cctl" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full text-xs border-border/60">
                                    Aller aux CCTL
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
