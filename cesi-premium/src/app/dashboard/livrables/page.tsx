'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Plus,
    Download,
    FileText,
    FolderGit2,
    CheckCircle2,
    BookOpen,
    Eye,
    X,
    RotateCcw,
    Send,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LivrableEntry, LivrableCategory, LivrablePromo, LivrableSpecialty } from '@/types/livrable';
import { ALL_SEED_LIVRABLES } from '@/lib/livrable-seed-data';

export default function DashboardLivrablesPage() {
    const [livrables, setLivrables] = useState<LivrableEntry[]>(ALL_SEED_LIVRABLES);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [activeTab, setActiveTab] = useState<'catalog' | 'share'>('catalog');

    // Share Form State
    const [shareTitle, setShareTitle] = useState('');
    const [shareCategory, setShareCategory] = useState<LivrableCategory>('DAT');
    const [sharePromo, setSharePromo] = useState<LivrablePromo>('A3');
    const [shareSpecialty, setShareSpecialty] = useState<LivrableSpecialty>('Informatique');
    const [shareSummary, setShareSummary] = useState('');
    const [shareSections, setShareSections] = useState('');
    const [shareTags, setShareTags] = useState('');
    const [shareIsAnonymous, setShareIsAnonymous] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    // Selected Livrable Preview Modal
    const [previewLivrable, setPreviewLivrable] = useState<LivrableEntry | null>(null);

    const fetchLivrables = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/livrables/list');
            const data = await res.json();
            if (data.success && Array.isArray(data.livrables)) {
                setLivrables(data.livrables);
            }
        } catch (e) {
            console.error('Failed to load livrables:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLivrables();
    }, []);

    // Filter logic
    const filteredLivrables = useMemo(() => {
        return livrables.filter(item => {
            const matchesPromo = selectedPromo === 'Tous' || item.promo === selectedPromo;
            const matchesSpecialty = selectedSpecialty === 'Tous' || item.specialty === selectedSpecialty;
            const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                item.title.toLowerCase().includes(q) ||
                item.categoryLabel.toLowerCase().includes(q) ||
                item.specialty.toLowerCase().includes(q) ||
                item.summary.toLowerCase().includes(q) ||
                item.tags.some(k => k.toLowerCase().includes(q));

            return matchesPromo && matchesSpecialty && matchesCategory && matchesSearch;
        });
    }, [livrables, selectedPromo, selectedSpecialty, selectedCategory, searchQuery]);

    const handleShareSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shareTitle.trim() || !shareSummary.trim()) return;

        setIsPublishing(true);
        try {
            const res = await fetch('/api/livrables/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: shareTitle,
                    category: shareCategory,
                    promo: sharePromo,
                    specialty: shareSpecialty,
                    summary: shareSummary,
                    keySections: shareSections.split('\n').map(s => s.trim()).filter(Boolean),
                    tags: shareTags.split(',').map(t => t.trim()).filter(Boolean),
                    isAnonymous: shareIsAnonymous,
                    gradeHint: 'Évaluation : Grade A • Validé bloc CESI'
                })
            });

            const data = await res.json();
            if (data.success && data.published) {
                setShareSuccess(true);
                await fetchLivrables();
                setTimeout(() => {
                    setShareSuccess(false);
                    setActiveTab('catalog');
                    setShareTitle('');
                    setShareSummary('');
                    setShareSections('');
                    setShareTags('');
                }, 1500);
            }
        } catch (e) {
            console.error('Failed to publish livrable:', e);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDownloadTemplate = (livrable: LivrableEntry) => {
        const content = `# LIVRABLE CESI : ${livrable.title}
**Catégorie :** ${livrable.categoryLabel} (${livrable.category})
**Promotion :** ${livrable.promo} • **Spécialité :** ${livrable.specialty}
**Évaluation :** ${livrable.gradeHint}
**Auteur :** ${livrable.authorName}

---

## 📌 Résumé & Objectifs du Livrable
${livrable.summary}

---

## 📑 Structure & Chapitres du Dossier
${livrable.keySections.map((sec, idx) => `### ${sec}\n- [ ] *Détailler ici les livrables associés à ce chapitre*\n`).join('\n')}

---

## 🏷️ Mots-Clés & Technologies
${livrable.tags.map(t => `- \`${t}\``).join('\n')}

---
*Téléchargé depuis Kompas | CESI — Espace Étudiant d'Ingénierie*
`;

        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `livrable-${livrable.category.toLowerCase()}-${livrable.id}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif text-text-primary flex items-center gap-3">
                        <FolderGit2 className="w-8 h-8 text-accent-yellow" />
                        Livrables <span className="italic font-normal">de Projet</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
                        Consultez les dossiers d&apos;architecture technique (DAT), cahiers des charges (CDC), rapports d&apos;audit et diaporamas de soutenance validés.
                    </p>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <button
                        type="button"
                        onClick={() => setActiveTab('share')}
                        className="px-4 py-2.5 rounded-xl bg-accent-yellow text-black text-xs font-bold hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Déposer un Livrable</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-3">
                <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'catalog'
                            ? 'bg-accent-yellow text-black shadow-xs font-bold'
                            : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                    }`}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Bibliothèque des Livrables ({livrables.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('share')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'share'
                            ? 'bg-accent-yellow text-black shadow-xs font-bold'
                            : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                    }`}
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Déposer un nouveau livrable</span>
                </button>
            </div>

            {/* TAB 1: CATALOG */}
            {activeTab === 'catalog' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Filter Card */}
                    <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl space-y-4">
                        <div className="flex flex-col md:flex-row gap-3 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par mot-clé (DAT, CDC, C4, MoSCoW, Pentest, PPTX, SQL, BIM...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[140px]"
                                >
                                    <option value="Tous">Tous Types</option>
                                    <option value="DAT">DAT (Architecture)</option>
                                    <option value="CDC">Cahier des Charges</option>
                                    <option value="AUDIT">Audit &amp; Sécurité</option>
                                    <option value="SOUTENANCE">Slides Soutenance</option>
                                    <option value="BDD">Conception BDD</option>
                                    <option value="TESTS">Cahier de Recette</option>
                                </select>

                                <select
                                    value={selectedPromo}
                                    onChange={(e) => setSelectedPromo(e.target.value)}
                                    className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[120px]"
                                >
                                    <option value="Tous">Toutes Promos</option>
                                    <option value="A1">Promo A1</option>
                                    <option value="A2">Promo A2</option>
                                    <option value="A3">Promo A3</option>
                                    <option value="A4">Promo A4</option>
                                    <option value="A5">Promo A5</option>
                                </select>

                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[170px]"
                                >
                                    <option value="Tous">Toutes Spécialités</option>
                                    <option value="Informatique">Informatique</option>
                                    <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                                    <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                    <option value="Généraliste">Généraliste</option>
                                </select>

                                {(selectedPromo !== 'Tous' || selectedSpecialty !== 'Tous' || selectedCategory !== 'Tous' || searchQuery) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPromo('Tous');
                                            setSelectedSpecialty('Tous');
                                            setSelectedCategory('Tous');
                                            setSearchQuery('');
                                        }}
                                        className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-text-primary text-xs font-semibold shrink-0 cursor-pointer"
                                        title="Réinitialiser"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLivrables.map((livrable) => (
                                <div
                                    key={livrable.id}
                                    className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all p-6 flex flex-col justify-between space-y-4 bg-surface-card shadow-sm"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase font-mono">
                                                    {livrable.category}
                                                </span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface text-text-secondary border border-border">
                                                    {livrable.promo} • {livrable.specialty}
                                                </span>
                                            </div>

                                            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                                {livrable.year}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug">
                                                {livrable.title}
                                            </h3>
                                            <p className="text-xs font-medium text-text-secondary">
                                                {livrable.categoryLabel}
                                            </p>
                                        </div>

                                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                            {livrable.summary}
                                        </p>

                                        <div className="p-3 rounded-2xl bg-surface/50 border border-border/60 space-y-1.5 text-xs">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-yellow block">
                                                Structure ({livrable.keySections.length} chapitres) :
                                            </span>
                                            <ul className="space-y-1 text-text-secondary text-[11px] leading-tight">
                                                {livrable.keySections.slice(0, 3).map((sec, idx) => (
                                                    <li key={idx} className="truncate">• {sec}</li>
                                                ))}
                                                {livrable.keySections.length > 3 && (
                                                    <li className="text-text-muted italic">+ {livrable.keySections.length - 3} autres sections</li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {livrable.tags.map((kw, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] font-mono bg-surface text-text-secondary px-2 py-0.5 rounded-md border border-border"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewLivrable(livrable)}
                                            className="px-3 py-2 rounded-xl bg-surface hover:bg-surface-highlight border border-border text-text-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-accent-yellow" />
                                            <span>Aperçu</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDownloadTemplate(livrable)}
                                            className="px-3.5 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Télécharger .md</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: SHARE LIVRABLE FORM */}
            {activeTab === 'share' && (
                <div className="card-editorial rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-6 bg-surface-card animate-in fade-in duration-300">
                    <div className="space-y-1 border-b border-border pb-4">
                        <h2 className="text-2xl font-normal font-serif text-text-primary">Déposer un Livrable de Projet</h2>
                        <p className="text-xs text-text-secondary">Partagez votre modèle de DAT, CDC ou diaporama de soutenance pour aider votre promotion.</p>
                    </div>

                    {shareSuccess && (
                        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Livrable partagé avec succès dans la communauté CESI !</span>
                        </div>
                    )}

                    <form onSubmit={handleShareSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-text-primary block mb-1">Titre complet du Livrable *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Dossier d'Architecture Technique (DAT) : Microservices & Cloud"
                                value={shareTitle}
                                onChange={(e) => setShareTitle(e.target.value)}
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-primary block">Type de livrable *</label>
                                <select
                                    value={shareCategory}
                                    onChange={(e) => setShareCategory(e.target.value as any)}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary"
                                >
                                    <option value="DAT">DAT (Architecture)</option>
                                    <option value="CDC">Cahier des Charges</option>
                                    <option value="AUDIT">Audit &amp; Pentest</option>
                                    <option value="SOUTENANCE">Slides Soutenance</option>
                                    <option value="BDD">Conception BDD</option>
                                    <option value="TESTS">Cahier de Recette</option>
                                    <option value="DEVOPS">DevOps &amp; CI/CD</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-primary block">Promotion *</label>
                                <select
                                    value={sharePromo}
                                    onChange={(e) => setSharePromo(e.target.value as any)}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary"
                                >
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="A3">A3</option>
                                    <option value="A4">A4</option>
                                    <option value="A5">A5</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-primary block">Spécialité *</label>
                                <select
                                    value={shareSpecialty}
                                    onChange={(e) => setShareSpecialty(e.target.value as any)}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary"
                                >
                                    <option value="Informatique">Informatique</option>
                                    <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                                    <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                    <option value="Généraliste">Généraliste</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-primary block mb-1">Résumé &amp; Objectifs du livrable *</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Présentez le projet, le périmètre couvert et la valeur ajoutée du document..."
                                value={shareSummary}
                                onChange={(e) => setShareSummary(e.target.value)}
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-primary block mb-1">
                                Structure / Chapitres clés (un par ligne)
                            </label>
                            <textarea
                                rows={3}
                                placeholder="1. Contexte & Objectifs&#10;2. Modélisation C4&#10;3. Matrice de choix technologiques"
                                value={shareSections}
                                onChange={(e) => setShareSections(e.target.value)}
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-primary block mb-1">
                                Mots-clés &amp; Technologies (séparés par des virgules)
                            </label>
                            <input
                                type="text"
                                placeholder="C4 Model, React, Docker, OpenAPI, MoSCoW, ISO 27001"
                                value={shareTags}
                                onChange={(e) => setShareTags(e.target.value)}
                                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="anon-livrable"
                                checked={shareIsAnonymous}
                                onChange={(e) => setShareIsAnonymous(e.target.checked)}
                                className="rounded text-accent-yellow focus:ring-accent-yellow"
                            />
                            <label htmlFor="anon-livrable" className="text-xs text-text-secondary cursor-pointer">
                                Partager anonymement sous le nom <em>&quot;Élève Anonyme&quot;</em>
                            </label>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                            <button
                                type="button"
                                onClick={() => setActiveTab('catalog')}
                                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-text-primary cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isPublishing}
                                className="px-6 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                            >
                                {isPublishing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                <span>Publier le livrable</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* PREVIEW MODAL */}
            {previewLivrable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="card-editorial rounded-3xl border border-border bg-surface-card p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setPreviewLivrable(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase font-mono">
                                    {previewLivrable.category}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-surface text-text-secondary border border-border">
                                    {previewLivrable.promo} • {previewLivrable.specialty}
                                </span>
                                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                                    {previewLivrable.gradeHint}
                                </span>
                            </div>

                            <h2 className="text-2xl font-normal font-serif text-text-primary">
                                {previewLivrable.title}
                            </h2>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    Résumé &amp; Périmètre
                                </span>
                                <p className="text-text-secondary leading-relaxed">
                                    {previewLivrable.summary}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-2">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    Chapitres du document ({previewLivrable.keySections.length})
                                </span>
                                <ul className="space-y-1 text-text-secondary">
                                    {previewLivrable.keySections.map((sec, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-yellow shrink-0" />
                                            <span>{sec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs font-mono text-text-muted">
                                {previewLivrable.tags.join(' • ')}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleDownloadTemplate(previewLivrable)}
                                className="px-5 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                            >
                                <Download className="w-4 h-4" />
                                <span>Télécharger le modèle (.md)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
