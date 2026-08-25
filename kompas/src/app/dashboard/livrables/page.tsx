'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Plus,
    Download,
    FolderGit2,
    CheckCircle2,
    BookOpen,
    Eye,
    X,
    RotateCcw,
    Send,
    Loader2,
    Gift,
    Crown,
    Sparkles,
    AlertCircle,
    Trash2,
    Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LivrableEntry, LivrableCategory, LivrablePromo, LivrableSpecialty } from '@/types/livrable';
import { ALL_SEED_LIVRABLES } from '@/lib/livrable-seed-data';
import {
    recordLivrableContribution,
    getUserRewardsProfile,
    LIVRABLES_REWARD_THRESHOLD,
    MAX_CROWDSOURCED_PREMIUM_MONTHS,
    UserRewardsProfile
} from '@/lib/rewards-store';
import { validateLivrableSubmission } from '@/lib/contribution-validator';
import { RewardCelebrationModal } from '@/components/rewards/RewardCelebrationModal';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail, checkIsAdminClient } from '@/lib/admin';

export default function DashboardLivrablesPage() {
    const supabase = createClient();
    const [livrables, setLivrables] = useState<LivrableEntry[]>(ALL_SEED_LIVRABLES);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
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
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Crowdsourcing Reward State
    const [rewardsProfile, setRewardsProfile] = useState<UserRewardsProfile | null>(null);
    const [awardedReward, setAwardedReward] = useState<any>(null);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

    // Selected Livrable Preview Modal
    const [previewLivrable, setPreviewLivrable] = useState<LivrableEntry | null>(null);

    // Editing modal state for Admin
    const [editingLivrable, setEditingLivrable] = useState<LivrableEntry | null>(null);
    const [editLivrableForm, setEditLivrableForm] = useState({
        title: '',
        category: 'DAT' as LivrableCategory,
        promo: 'A3' as LivrablePromo,
        specialty: 'Informatique' as LivrableSpecialty,
        summary: '',
        keySections: '',
        tags: '',
        gradeHint: ''
    });
    const [isSavingLivrableEdit, setIsSavingLivrableEdit] = useState(false);

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

    const updateRewards = () => {
        setRewardsProfile(getUserRewardsProfile());
    };

    const checkAdmin = async () => {
        if (checkIsAdminClient()) {
            setIsAdmin(true);
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && checkIsAdminClient(user)) {
                setIsAdmin(true);
            }
        } catch {}
    };

    useEffect(() => {
        fetchLivrables();
        updateRewards();
        checkAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && checkIsAdminClient(session.user)) {
                setIsAdmin(true);
            }
        });

        window.addEventListener('kompas_rewards_updated', updateRewards);
        return () => {
            subscription.unsubscribe();
            window.removeEventListener('kompas_rewards_updated', updateRewards);
        };
    }, []);

    const handleDeleteLivrable = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Voulez-vous vraiment supprimer définitivement ce livrable ?')) return;

        setLivrables(prev => prev.filter(l => l.id !== id));
        if (previewLivrable?.id === id) setPreviewLivrable(null);

        try {
            await fetch(`/api/livrables/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete livrable:', err);
            fetchLivrables();
        }
    };

    const handleStartEditLivrable = (livrable: LivrableEntry, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingLivrable(livrable);
        setEditLivrableForm({
            title: livrable.title,
            category: livrable.category,
            promo: livrable.promo,
            specialty: livrable.specialty,
            summary: livrable.summary,
            keySections: livrable.keySections.join('\n'),
            tags: livrable.tags.join(', '),
            gradeHint: livrable.gradeHint || ''
        });
    };

    const handleSaveEditLivrable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLivrable || isSavingLivrableEdit) return;

        setIsSavingLivrableEdit(true);
        try {
            const updates = {
                title: editLivrableForm.title,
                category: editLivrableForm.category,
                promo: editLivrableForm.promo,
                specialty: editLivrableForm.specialty,
                summary: editLivrableForm.summary,
                keySections: editLivrableForm.keySections.split('\n').map(s => s.trim()).filter(Boolean),
                tags: editLivrableForm.tags.split(',').map(t => t.trim()).filter(Boolean),
                gradeHint: editLivrableForm.gradeHint
            };

            const res = await fetch(`/api/livrables/${editingLivrable.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            const data = await res.json();
            if (data.success && data.livrable) {
                setLivrables(prev => prev.map(l => l.id === editingLivrable.id ? data.livrable : l));
                if (previewLivrable?.id === editingLivrable.id) {
                    setPreviewLivrable(data.livrable);
                }
            }
            setEditingLivrable(null);
        } catch (err) {
            console.error('Failed to update livrable:', err);
        } finally {
            setIsSavingLivrableEdit(false);
        }
    };

    const hasActiveFilters = searchQuery || selectedPromo !== 'Tous' || selectedSpecialty !== 'Tous' || selectedCategory !== 'Tous';

    const handleResetFilters = () => {
        setSelectedPromo('Tous');
        setSelectedSpecialty('Tous');
        setSelectedCategory('Tous');
        setSearchQuery('');
    };

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
        setValidationErrors([]);

        // Anti-spam and completeness verification
        const validation = validateLivrableSubmission({
            title: shareTitle,
            category: shareCategory,
            summary: shareSummary,
            keySections: shareSections,
            tags: shareTags
        });

        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

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
                    gradeHint: 'Évaluation : Note A • Validé bloc CESI'
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erreur lors de la publication du livrable.');
            }

            if (data.success && data.published) {
                // Record contribution towards 5 livrables = 1 month Premium
                const rewardResult = recordLivrableContribution(shareTitle);
                updateRewards();

                if (rewardResult.unlockedReward) {
                    setAwardedReward(rewardResult);
                    setIsRewardModalOpen(true);
                }

                setShareSuccess(true);
                await fetchLivrables();
                setTimeout(() => {
                    setShareSuccess(false);
                    setActiveTab('catalog');
                    setShareTitle('');
                    setShareSummary('');
                    setShareSections('');
                    setShareTags('');
                    setValidationErrors([]);
                }, 1800);
            }
        } catch (err: any) {
            console.error('Failed to publish livrable:', err);
            setValidationErrors([err.message || 'Une erreur est survenue lors de la publication.']);
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
${livrable.keySections.map((sec) => `### ${sec}\n- [ ] *Détailler ici les livrables associés à ce chapitre*\n`).join('\n')}

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
        <div className="space-y-6 pb-16">
            {/* Unified Header & Controls Card */}
            <div className="card-editorial p-5 sm:p-6 rounded-3xl bg-surface-card border-border shadow-lg space-y-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-millimeter opacity-20 pointer-events-none" />

                {/* Top Row: Title + Action */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Livrables &amp; Projets <span className="italic font-normal">d&apos;Ingénierie</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary font-normal max-w-2xl">
                            Consultez les dossiers d&apos;architecture technique (DAT), cahiers des charges (CDC) et diaporamas validés.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab(activeTab === 'share' ? 'catalog' : 'share')}
                            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-accent-yellow text-black text-xs font-bold hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {activeTab === 'share' ? (
                                <>
                                    <BookOpen className="w-4 h-4" />
                                    <span>Bibliothèque ({livrables.length})</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Déposer un Livrable</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs & Catalog Filters */}
                <div className="pt-4 border-t border-border/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between relative z-10">
                    {/* View Tabs */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setActiveTab('catalog')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                activeTab === 'catalog'
                                    ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                    : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight border border-border/60'
                            }`}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Bibliothèque ({livrables.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('share')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                activeTab === 'share'
                                    ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                    : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight border border-border/60'
                            }`}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Déposer</span>
                        </button>
                    </div>

                    {/* Catalog Filters */}
                    {activeTab === 'catalog' && (
                        <div className="flex flex-col sm:flex-row gap-2 items-center flex-1 md:justify-end">
                            <div className="relative flex-1 w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher (DAT, CDC, C4, MoSCoW, SQL...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    aria-label="Filtrer par type de livrable"
                                    className="bg-surface border border-border rounded-xl px-2.5 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[110px]"
                                >
                                    <option value="Tous">Tous Types</option>
                                    <option value="DAT">DAT (Arch.)</option>
                                    <option value="CDC">CDC</option>
                                    <option value="AUDIT">Audit</option>
                                    <option value="SOUTENANCE">Slides</option>
                                    <option value="BDD">BDD</option>
                                    <option value="TESTS">Recette</option>
                                </select>

                                <select
                                    value={selectedPromo}
                                    onChange={(e) => setSelectedPromo(e.target.value)}
                                    aria-label="Filtrer par promotion"
                                    className="bg-surface border border-border rounded-xl px-2.5 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[95px]"
                                >
                                    <option value="Tous">Toutes Promos</option>
                                    <option value="A1">A1</option>
                                    <option value="A2">A2</option>
                                    <option value="A3">A3</option>
                                    <option value="A4">A4</option>
                                    <option value="A5">A5</option>
                                </select>

                                <select
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                    aria-label="Filtrer par spécialité"
                                    className="bg-surface border border-border rounded-xl px-2.5 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[125px]"
                                >
                                    <option value="Tous">Toutes Spécialités</option>
                                    <option value="Informatique">Informatique</option>
                                    <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                                    <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                    <option value="Généraliste">Généraliste</option>
                                </select>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-text-primary text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                                        title="Réinitialiser"
                                        aria-label="Réinitialiser les filtres"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TAB 1: CATALOG */}
            {activeTab === 'catalog' && (
                <div className="space-y-6 animate-in fade-in duration-300">
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
                                        <div className="flex items-center gap-2">
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
                                                <span>.md</span>
                                            </button>
                                        </div>

                                        {isAdmin && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleStartEditLivrable(livrable, e)}
                                                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-accent-yellow transition-all cursor-pointer"
                                                    title="Modifier ce Livrable (Admin)"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteLivrable(livrable.id, e)}
                                                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-red-400 transition-all cursor-pointer"
                                                    title="Supprimer ce Livrable (Admin)"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredLivrables.length === 0 && !isLoading && (
                        <div className="card-editorial p-12 text-center rounded-3xl border border-border text-text-secondary space-y-4 max-w-md mx-auto bg-surface-card">
                            <div className="p-4 bg-accent-yellow/10 rounded-2xl w-fit mx-auto text-accent-yellow border border-accent-yellow/20">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-normal font-serif text-lg text-text-primary">Aucun Livrable trouvé</h3>
                                <p className="text-xs leading-relaxed">
                                    Aucun document ne correspond à vos filtres. Essayez de réinitialiser vos critères.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
                                Réinitialiser les filtres
                            </Button>
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

                    {/* Crowdsourcing Rewards Incentive Card */}
                    <div className="card-editorial p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-accent-yellow/15 via-surface-card to-surface-card border-2 border-accent-yellow/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold shadow-md shadow-accent-yellow/20 shrink-0">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-serif text-base sm:text-lg font-bold text-text-primary">
                                        Programme Contributeur Livrables
                                    </h3>
                                    <span className="text-[10px] font-mono font-bold uppercase bg-accent-yellow text-black px-2 py-0.5 rounded-full">
                                        5 Livrables = 1 Mois Premium
                                    </span>
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Partagez vos dossiers d&apos;ingénierie (DAT, CDC, BDD, etc.) complets et validés. Dès 5 livrables publiés, obtenez <strong>1 Mois Premium</strong> offert (limite : 1 mois par compte).
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                            <div className="text-xs font-mono font-bold text-accent-yellow">
                                {(rewardsProfile?.livrablesPublishedCount || 0) >= LIVRABLES_REWARD_THRESHOLD
                                    ? '🎉 Palier 5/5 validé !'
                                    : `Progression : ${rewardsProfile?.livrablesPublishedCount || 0}/${LIVRABLES_REWARD_THRESHOLD}`}
                            </div>
                            <div className="w-full sm:w-36 h-2 rounded-full bg-surface border border-border/80 overflow-hidden">
                                <div
                                    className="h-full bg-accent-yellow transition-all duration-300"
                                    style={{
                                        width: `${Math.min(100, ((rewardsProfile?.livrablesPublishedCount || 0) / LIVRABLES_REWARD_THRESHOLD) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {validationErrors.length > 0 && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs space-y-1.5 animate-in fade-in">
                            <div className="font-bold flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                <span>Veuillez vérifier les points suivants :</span>
                            </div>
                            <ul className="list-disc pl-5 space-y-0.5 text-text-secondary">
                                {validationErrors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {shareSuccess && (
                        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Livrable vérifié et partagé avec succès dans la communauté CESI !</span>
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

            {/* Reward Celebration Modal */}
            <RewardCelebrationModal
                isOpen={isRewardModalOpen}
                onClose={() => setIsRewardModalOpen(false)}
                reward={awardedReward}
                examTitle={shareTitle}
                contributionType="livrable"
            />

            {/* Modal: Edit Livrable (Admin) */}
            {editingLivrable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div className="flex items-center gap-2.5">
                                <Edit3 className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    Modifier le Livrable (Mode Admin)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingLivrable(null)}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditLivrable} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Titre du document</label>
                                    <input
                                        type="text"
                                        required
                                        value={editLivrableForm.title}
                                        onChange={(e) => setEditLivrableForm({ ...editLivrableForm, title: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Catégorie</label>
                                    <select
                                        value={editLivrableForm.category}
                                        onChange={(e) => setEditLivrableForm({ ...editLivrableForm, category: e.target.value as LivrableCategory })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="DAT">DAT (Dossier d'Architecture Technique)</option>
                                        <option value="Cahier des Charges">Cahier des Charges Fonctionnel & Technique</option>
                                        <option value="Plan de Test">Plan de Tests & Stratégie QA</option>
                                        <option value="Rapport d'Audit">Rapport d'Audit & Sécurité</option>
                                        <option value="Rapport de Stage">Rapport de Stage / Alternance</option>
                                        <option value="Soutenance">Support de Soutenance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Promotion</label>
                                    <select
                                        value={editLivrableForm.promo}
                                        onChange={(e) => setEditLivrableForm({ ...editLivrableForm, promo: e.target.value as LivrablePromo })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="A1">Promo A1</option>
                                        <option value="A2">Promo A2</option>
                                        <option value="A3">Promo A3</option>
                                        <option value="A4">Promo A4</option>
                                        <option value="A5">Promo A5</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Spécialité</label>
                                    <select
                                        value={editLivrableForm.specialty}
                                        onChange={(e) => setEditLivrableForm({ ...editLivrableForm, specialty: e.target.value as LivrableSpecialty })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="Informatique">Informatique</option>
                                        <option value="Généraliste">Généraliste</option>
                                        <option value="BTP & Génie Civil">BTP & Génie Civil</option>
                                        <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Résumé & Objectifs</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editLivrableForm.summary}
                                    onChange={(e) => setEditLivrableForm({ ...editLivrableForm, summary: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Chapitres & Sections (1 par ligne)</label>
                                <textarea
                                    rows={3}
                                    value={editLivrableForm.keySections}
                                    onChange={(e) => setEditLivrableForm({ ...editLivrableForm, keySections: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Tags (séparés par des virgules)</label>
                                <input
                                    type="text"
                                    value={editLivrableForm.tags}
                                    onChange={(e) => setEditLivrableForm({ ...editLivrableForm, tags: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingLivrable(null)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingLivrableEdit}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isSavingLivrableEdit ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

