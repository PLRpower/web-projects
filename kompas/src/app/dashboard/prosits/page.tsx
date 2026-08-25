'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Wand2,
    Copy,
    Download,
    Check,
    Users,
    Lightbulb,
    FileText,
    Search,
    BookOpen,
    Plus,
    RotateCcw,
    Eye,
    X,
    CheckCircle2,
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
import { PrositEntry, PrositPromo, PrositSpecialty } from '@/types/prosit';
import { ALL_SEED_PROSITS } from '@/lib/prosit-seed-data';
import {
    recordPrositContribution,
    getUserRewardsProfile,
    PROSITS_REWARD_THRESHOLD,
    MAX_CROWDSOURCED_PREMIUM_MONTHS,
    UserRewardsProfile
} from '@/lib/rewards-store';
import { validatePrositSubmission } from '@/lib/contribution-validator';
import { RewardCelebrationModal } from '@/components/rewards/RewardCelebrationModal';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail, checkIsAdminClient } from '@/lib/admin';

export default function DashboardPrositsPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'catalog' | 'generator'>('catalog');
    const [prosits, setProsits] = useState<PrositEntry[]>(ALL_SEED_PROSITS);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Filter states for catalog
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
    const [selectedPrositModal, setSelectedPrositModal] = useState<PrositEntry | null>(null);

    // Generator Form States
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [promo, setPromo] = useState<PrositPromo>('A3');
    const [specialty, setSpecialty] = useState<PrositSpecialty>('Informatique');
    const [keywords, setKeywords] = useState('');
    const [context, setContext] = useState('');
    const [problematic, setProblematic] = useState('');
    const [constraints, setConstraints] = useState('');
    const [hypotheses, setHypotheses] = useState('');
    const [actionPlan, setActionPlan] = useState('');
    const [deliverables, setDeliverables] = useState('');
    const [roles, setRoles] = useState({
        animateur: '',
        scribe: '',
        secretaire: '',
        gestionnaire: ''
    });
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [copied, setCopied] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Crowdsourcing Reward State
    const [rewardsProfile, setRewardsProfile] = useState<UserRewardsProfile | null>(null);
    const [awardedReward, setAwardedReward] = useState<any>(null);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

    // Editing modal state for Admin
    const [editingProsit, setEditingProsit] = useState<PrositEntry | null>(null);
    const [editPrositForm, setEditPrositForm] = useState({
        title: '',
        subject: '',
        promo: 'A3' as PrositPromo,
        specialty: 'Informatique' as PrositSpecialty,
        problemStatement: '',
        context: '',
        keywords: '',
        hypotheses: '',
        actionPlan: ''
    });
    const [isSavingPrositEdit, setIsSavingPrositEdit] = useState(false);

    // Fetch dynamic prosits from API
    const fetchProsits = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/prosits/list');
            const data = await res.json();
            if (data.success && Array.isArray(data.prosits)) {
                setProsits(data.prosits);
            }
        } catch (e) {
            console.error('Failed to load prosits:', e);
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
        fetchProsits();
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

    const handleDeleteProsit = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Voulez-vous vraiment supprimer définitivement ce prosit ?')) return;

        setProsits(prev => prev.filter(p => p.id !== id));
        if (selectedPrositModal?.id === id) setSelectedPrositModal(null);

        try {
            await fetch(`/api/prosits/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete prosit:', err);
            fetchProsits();
        }
    };

    const handleStartEditProsit = (prosit: PrositEntry, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingProsit(prosit);
        setEditPrositForm({
            title: prosit.title,
            subject: prosit.subject,
            promo: prosit.promo,
            specialty: prosit.specialty,
            problemStatement: prosit.problemStatement,
            context: prosit.context || '',
            keywords: prosit.keywords.join(', '),
            hypotheses: prosit.hypotheses ? prosit.hypotheses.join('\n') : '',
            actionPlan: prosit.actionPlan ? prosit.actionPlan.join('\n') : ''
        });
    };

    const handleSaveEditProsit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProsit || isSavingPrositEdit) return;

        setIsSavingPrositEdit(true);
        try {
            const updates = {
                title: editPrositForm.title,
                subject: editPrositForm.subject,
                promo: editPrositForm.promo,
                specialty: editPrositForm.specialty,
                problemStatement: editPrositForm.problemStatement,
                context: editPrositForm.context,
                keywords: editPrositForm.keywords.split(',').map(k => k.trim()).filter(Boolean),
                hypotheses: editPrositForm.hypotheses.split('\n').map(h => h.trim()).filter(Boolean),
                actionPlan: editPrositForm.actionPlan.split('\n').map(a => a.trim()).filter(Boolean)
            };

            const res = await fetch(`/api/prosits/${editingProsit.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            const data = await res.json();
            if (data.success && data.prosit) {
                setProsits(prev => prev.map(p => p.id === editingProsit.id ? data.prosit : p));
                if (selectedPrositModal?.id === editingProsit.id) {
                    setSelectedPrositModal(data.prosit);
                }
            }
            setEditingProsit(null);
        } catch (err) {
            console.error('Failed to update prosit:', err);
        } finally {
            setIsSavingPrositEdit(false);
        }
    };

    const hasActiveFilters = searchQuery || selectedPromo !== 'Tous' || selectedSpecialty !== 'Tous';

    const handleResetFilters = () => {
        setSelectedPromo('Tous');
        setSelectedSpecialty('Tous');
        setSearchQuery('');
    };

    const filteredProsits = useMemo(() => {
        return prosits.filter(item => {
            const matchesPromo = selectedPromo === 'Tous' || item.promo === selectedPromo;
            const matchesSpecialty = selectedSpecialty === 'Tous' || item.specialty === selectedSpecialty;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                item.title.toLowerCase().includes(q) ||
                item.subject.toLowerCase().includes(q) ||
                item.specialty.toLowerCase().includes(q) ||
                item.keywords.some(k => k.toLowerCase().includes(q)) ||
                item.problemStatement.toLowerCase().includes(q);

            return matchesPromo && matchesSpecialty && matchesSearch;
        });
    }, [prosits, selectedPromo, selectedSpecialty, searchQuery]);

    const generateMarkdown = () => {
        return `# PROSIT : ${title || '[Titre du Prosit]'}
**Sujet / Thématique :** ${subject || 'Non spécifié'}
**Promotion :** ${promo} • **Spécialité :** ${specialty}

---

## 👥 Répartition des Rôles (Séance PBL)
- **Animateur :** ${roles.animateur || 'Non assigné'}
- **Scribe :** ${roles.scribe || 'Non assigné'}
- **Secrétaire :** ${roles.secretaire || 'Non assigné'}
- **Gestionnaire du Temps :** ${roles.gestionnaire || 'Non assigné'}

---

## 1. Mots-clés & Vocabulaire
${keywords.split(',').filter(k => k.trim()).map(k => `- \`${k.trim()}\``).join('\n') || '- (Aucun mot-clé renseigné)'}

## 2. Contexte & Situation du problème
${context || '(Décrivez le contexte de l\'entreprise et la situation du problème ici...)'}

## 3. Problématique
> **"${problematic || 'Formulez ici la question centrale...'}"**

## 4. Contraintes
${constraints.split('\n').filter(c => c.trim()).map(c => `- ${c.trim()}`).join('\n') || '- (Aucune contrainte listée)'}

## 5. Hypothèses
${hypotheses.split('\n').filter(h => h.trim()).map(h => `- ${h.trim()}`).join('\n') || '- (Aucune hypothèse formulée)'}

## 6. Plan d'action
${actionPlan.split('\n').filter(a => a.trim()).map((a, i) => `${i + 1}. ${a.trim()}`).join('\n') || '1. (Définir les étapes)'}

## 7. Livrables attendus
${deliverables.split('\n').filter(d => d.trim()).map(d => `- [ ] ${d.trim()}`).join('\n') || '- [ ] (Livrable 1)'}

---
*Généré sur Kompas | CESI — Plateforme collaborative d'ingénierie*
`;
    };

    const handleCopyMarkdown = () => {
        navigator.clipboard.writeText(generateMarkdown());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadMarkdown = (prositTitle?: string, content?: string) => {
        const mdContent = content || generateMarkdown();
        const blob = new Blob([mdContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prosit-${(prositTitle || title || 'cesi').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePublishSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors([]);

        // Anti-spam and completeness verification
        const validation = validatePrositSubmission({
            title,
            problemStatement: problematic,
            context,
            keywords,
            hypotheses,
            actionPlan,
            constraints,
            deliverables
        });

        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            return;
        }

        setIsPublishing(true);
        try {
            const res = await fetch('/api/prosits/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    subject: subject || title,
                    promo,
                    specialty,
                    keywords,
                    context,
                    problemStatement: problematic,
                    constraints,
                    hypotheses,
                    actionPlan,
                    deliverables,
                    roles,
                    isAnonymous
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erreur lors de la publication de la fiche de prosit.');
            }

            if (data.success && data.published) {
                // Record contribution towards 10 prosits = 1 month Premium
                const rewardResult = recordPrositContribution(title);
                updateRewards();

                if (rewardResult.unlockedReward) {
                    setAwardedReward(rewardResult);
                    setIsRewardModalOpen(true);
                }

                setPublishSuccess(true);
                await fetchProsits();
                setTimeout(() => {
                    setPublishSuccess(false);
                    setActiveTab('catalog');
                    setValidationErrors([]);
                }, 1800);
            }
        } catch (err: any) {
            console.error('Failed to publish prosit:', err);
            setValidationErrors([err.message || 'Une erreur est survenue lors de la publication.']);
        } finally {
            setIsPublishing(false);
        }
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
                            Prosits &amp; Problématiques <span className="italic font-normal">PBL</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary font-normal max-w-2xl">
                            Base collaborative de fiches de Prosits et rédacteur officiel selon la méthode PBL en 7 étapes.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab(activeTab === 'generator' ? 'catalog' : 'generator')}
                            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-accent-yellow text-black text-xs font-bold hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {activeTab === 'generator' ? (
                                <>
                                    <BookOpen className="w-4 h-4" />
                                    <span>Voir la base de données ({prosits.length})</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Rédiger &amp; Publier</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Tabs & Catalog Filters */}
                <div className="pt-4 border-t border-border/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between relative z-10">
                    {/* View Switcher Tabs */}
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
                            <span>Catalogue ({prosits.length})</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('generator')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                activeTab === 'generator'
                                    ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                    : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight border border-border/60'
                            }`}
                        >
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Rédacteur PBL</span>
                        </button>
                    </div>

                    {/* Filters (only displayed in catalog mode) */}
                    {activeTab === 'catalog' && (
                        <div className="flex flex-col sm:flex-row gap-2 items-center flex-1 md:justify-end">
                            <div className="relative flex-1 w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher (JWT, CAN, RE2020, SOLID, SQL...)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                                />
                            </div>

                            <div className="flex items-center gap-1.5 w-full sm:w-auto">
                                <select
                                    value={selectedPromo}
                                    onChange={(e) => setSelectedPromo(e.target.value)}
                                    aria-label="Filtrer par promotion"
                                    className="bg-surface border border-border rounded-xl px-2.5 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[100px]"
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
                                    aria-label="Filtrer par spécialité"
                                    className="bg-surface border border-border rounded-xl px-2.5 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[130px]"
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

            {/* TAB 1: PROSIT CATALOG / DATABASE */}
            {activeTab === 'catalog' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProsits.map((prosit) => (
                                <div
                                    key={prosit.id}
                                    className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all p-6 flex flex-col justify-between space-y-4 bg-surface-card shadow-sm"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider font-mono">
                                                    {prosit.promo}
                                                </span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface text-text-secondary border border-border">
                                                    {prosit.specialty}
                                                </span>
                                            </div>

                                            <span className="text-[11px] font-mono font-bold text-accent-yellow bg-accent-yellow/10 px-2.5 py-0.5 rounded-full border border-accent-yellow/20">
                                                7 Étapes
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug">
                                                {prosit.title}
                                            </h3>
                                            <p className="text-xs font-medium text-text-secondary">
                                                {prosit.subject}
                                            </p>
                                        </div>

                                        {/* Problem Statement */}
                                        <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/60 space-y-1 text-xs">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-yellow block">
                                                Problématique centrale
                                            </span>
                                            <p className="text-text-secondary leading-relaxed italic line-clamp-2">
                                                &ldquo;{prosit.problemStatement}&rdquo;
                                            </p>
                                        </div>

                                        {/* Keywords */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {prosit.keywords.map((kw, i) => (
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
                                                onClick={() => setSelectedPrositModal(prosit)}
                                                className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-highlight border border-border text-text-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-accent-yellow" />
                                                <span>Consulter</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDownloadMarkdown(prosit.title, `# PROSIT : ${prosit.title}\n\n## 3. Problématique\n${prosit.problemStatement}\n\n## 2. Contexte\n${prosit.context}\n\n## 6. Plan d'action\n${prosit.actionPlan.join('\n')}`)}
                                                className="px-3 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                                                title="Télécharger la fiche en Markdown"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>.md</span>
                                            </button>
                                        </div>

                                        {isAdmin && (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleStartEditProsit(prosit, e)}
                                                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-accent-yellow transition-all cursor-pointer"
                                                    title="Modifier ce Prosit (Admin)"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteProsit(prosit.id, e)}
                                                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-red-400 transition-all cursor-pointer"
                                                    title="Supprimer ce Prosit (Admin)"
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

                    {filteredProsits.length === 0 && !isLoading && (
                        <div className="card-editorial p-12 text-center rounded-3xl border border-border text-text-secondary space-y-4 max-w-md mx-auto bg-surface-card">
                            <div className="p-4 bg-accent-yellow/10 rounded-2xl w-fit mx-auto text-accent-yellow border border-accent-yellow/20">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-normal font-serif text-lg text-text-primary">Aucun Prosit trouvé</h3>
                                <p className="text-xs leading-relaxed">
                                    Aucune fiche ne correspond à vos filtres. Essayez de réinitialiser vos critères.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: GENERATOR & WRITER */}
            {activeTab === 'generator' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                    {/* Left: Form Inputs */}
                    <div className="space-y-6">
                        <form onSubmit={handlePublishSubmit} className="card-editorial rounded-3xl p-6 sm:p-8 space-y-6 bg-surface-card">
                            <div className="space-y-1 border-b border-border pb-4">
                                <h2 className="text-xl font-serif font-bold text-text-primary">Rédiger une fiche de Prosit</h2>
                                <p className="text-xs text-text-secondary">Renseignez les 7 étapes officielles pour exporter votre compte-rendu ou le publier.</p>
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
                                                Programme Contributeur Prosits
                                            </h3>
                                            <span className="text-[10px] font-mono font-bold uppercase bg-accent-yellow text-black px-2 py-0.5 rounded-full">
                                                10 Prosits = 1 Mois Premium
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-secondary leading-relaxed">
                                            Partagez vos comptes-rendus de prosits selon la méthode 7 étapes. Dès 10 prosits complets publiés, débloquez <strong>1 Mois Premium</strong> offert (limite : 1 mois par compte).
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                                    <div className="text-xs font-mono font-bold text-accent-yellow">
                                        {(rewardsProfile?.prositsPublishedCount || 0) >= PROSITS_REWARD_THRESHOLD
                                            ? '🎉 Palier 10/10 validé !'
                                            : `Progression : ${rewardsProfile?.prositsPublishedCount || 0}/${PROSITS_REWARD_THRESHOLD}`}
                                    </div>
                                    <div className="w-full sm:w-36 h-2 rounded-full bg-surface border border-border/80 overflow-hidden">
                                        <div
                                            className="h-full bg-accent-yellow transition-all duration-300"
                                            style={{
                                                width: `${Math.min(100, ((rewardsProfile?.prositsPublishedCount || 0) / PROSITS_REWARD_THRESHOLD) * 100)}%`
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

                            {publishSuccess && (
                                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Votre fiche de Prosit a été vérifiée et publiée avec succès !</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">Titre du Prosit *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Architecture Microservices & Scalabilité"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-text-primary block">Promotion *</label>
                                        <select
                                            value={promo}
                                            onChange={(e) => setPromo(e.target.value as any)}
                                            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary"
                                        >
                                            <option value="A1">A1</option>
                                            <option value="A2">A2</option>
                                            <option value="A3">A3</option>
                                            <option value="A4">A4</option>
                                            <option value="A5">A5</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1 sm:col-span-2">
                                        <label className="text-xs font-bold text-text-primary block">Spécialité *</label>
                                        <select
                                            value={specialty}
                                            onChange={(e) => setSpecialty(e.target.value as any)}
                                            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary"
                                        >
                                            <option value="Informatique">Informatique</option>
                                            <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                                            <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                            <option value="Généraliste">Généraliste</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Roles */}
                                <div className="p-4 rounded-2xl bg-surface/50 border border-border/50 space-y-3">
                                    <span className="text-xs font-bold text-accent-yellow flex items-center gap-1.5 font-mono">
                                        <Users className="w-3.5 h-3.5" /> Répartition des rôles de séance PBL
                                    </span>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <label className="text-[11px] text-text-secondary block mb-0.5">Animateur</label>
                                            <input
                                                type="text"
                                                value={roles.animateur}
                                                onChange={(e) => setRoles({ ...roles, animateur: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] text-text-secondary block mb-0.5">Scribe</label>
                                            <input
                                                type="text"
                                                value={roles.scribe}
                                                onChange={(e) => setRoles({ ...roles, scribe: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] text-text-secondary block mb-0.5">Secrétaire</label>
                                            <input
                                                type="text"
                                                value={roles.secretaire}
                                                onChange={(e) => setRoles({ ...roles, secretaire: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] text-text-secondary block mb-0.5">Gestionnaire Temps</label>
                                            <input
                                                type="text"
                                                value={roles.gestionnaire}
                                                onChange={(e) => setRoles({ ...roles, gestionnaire: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Step 1: Keywords */}
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">
                                        1. Mots-clés &amp; Vocabulaire (séparés par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="OAuth, JWT, PostgreSQL, REST, ACID"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>

                                {/* Step 2: Context */}
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">
                                        2. Contexte &amp; Situation du problème
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Décrivez l'entreprise, le scénario et le besoin initial..."
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                                    />
                                </div>

                                {/* Step 3: Problematic */}
                                <div>
                                    <label className="text-xs font-bold text-accent-yellow block mb-1 flex items-center gap-1.5 font-mono">
                                        <Lightbulb className="w-3.5 h-3.5" />
                                        3. Problématique centrale *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Comment concevoir... ? / En quoi... ?"
                                        value={problematic}
                                        onChange={(e) => setProblematic(e.target.value)}
                                        className="w-full bg-surface border border-accent-yellow/40 rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                                    />
                                </div>

                                {/* Step 4: Constraints */}
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">
                                        4. Contraintes techniques &amp; organisationnelles (une par ligne)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Temps de réponse < 150ms&#10;Norme ISO 27001"
                                        value={constraints}
                                        onChange={(e) => setConstraints(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>

                                {/* Step 5: Hypotheses */}
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">
                                        5. Hypothèses de résolution (une par ligne)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="L'indexation B-Tree élimine les sequential scans"
                                        value={hypotheses}
                                        onChange={(e) => setHypotheses(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>

                                {/* Step 6: Action Plan */}
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">
                                        6. Plan d&apos;action &amp; Répartition (une par ligne)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="1. Audit de performance&#10;2. Modélisation relationnelle"
                                        value={actionPlan}
                                        onChange={(e) => setActionPlan(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>

                                {/* Step 7: Deliverables */}
                                <div>
                                    <label className="text-xs font-bold text-text-primary block mb-1">
                                        7. Livrables attendus &amp; Critères d&apos;acceptation
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Dossier d'architecture&#10;Code source commenté"
                                        value={deliverables}
                                        onChange={(e) => setDeliverables(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="anon-prosit"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="rounded text-accent-yellow focus:ring-accent-yellow"
                                    />
                                    <label htmlFor="anon-prosit" className="text-xs text-text-secondary cursor-pointer">
                                        Publier anonymement sous le statut <em>&quot;Élève Anonyme&quot;</em>
                                    </label>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3">
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
                                        <span>Publier dans la base de données</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right: Live Preview & Export */}
                    <div className="space-y-6">
                        <div className="card-editorial rounded-3xl border border-border p-6 sm:p-8 space-y-6 shadow-xl sticky top-24 bg-surface-card">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <div>
                                    <h2 className="text-xl font-normal font-serif text-text-primary">Aperçu Markdown</h2>
                                    <p className="text-xs text-text-secondary">Prêt à copier dans Notion, Word ou Obsidian.</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyMarkdown}
                                        className="border-border text-xs"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                                                Copié !
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5 mr-1.5" />
                                                Copier
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="premium"
                                        size="sm"
                                        onClick={() => handleDownloadMarkdown()}
                                        className="text-xs bg-accent-yellow text-black hover:brightness-105"
                                    >
                                        <Download className="w-3.5 h-3.5 mr-1.5" />
                                        Télécharger .md
                                    </Button>
                                </div>
                            </div>

                            {/* Markdown preview container */}
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border/60 max-h-[600px] overflow-y-auto font-mono text-xs text-text-secondary leading-relaxed space-y-3 whitespace-pre-wrap">
                                {generateMarkdown()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL 7-STEP PROSIT DETAIL MODAL */}
            {selectedPrositModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="card-editorial rounded-3xl border border-border bg-surface-card p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedPrositModal(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase font-mono">
                                    {selectedPrositModal.promo}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-surface text-text-secondary border border-border">
                                    {selectedPrositModal.specialty}
                                </span>
                                <span className="text-xs font-mono text-text-muted">
                                    Publié par {selectedPrositModal.authorName} • {selectedPrositModal.year}
                                </span>
                            </div>

                            <h2 className="text-2xl font-normal font-serif text-text-primary">
                                {selectedPrositModal.title}
                            </h2>

                            <p className="text-xs text-text-secondary font-medium">
                                {selectedPrositModal.subject}
                            </p>
                        </div>

                        {/* 7-Step Breakdown */}
                        <div className="space-y-4 text-xs">
                            {/* Step 1 */}
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-2">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    1. Mots-clés &amp; Vocabulaire
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedPrositModal.keywords.map((kw, idx) => (
                                        <span key={idx} className="font-mono bg-surface border border-border px-2 py-0.5 rounded-md">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    2. Contexte &amp; Situation du Problème
                                </span>
                                <p className="text-text-secondary leading-relaxed">
                                    {selectedPrositModal.context}
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="p-4 rounded-2xl bg-accent-yellow/10 border border-accent-yellow/30 space-y-1">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    3. Problématique Centrale
                                </span>
                                <p className="text-text-primary font-serif text-sm italic">
                                    &ldquo;{selectedPrositModal.problemStatement}&rdquo;
                                </p>
                            </div>

                            {/* Step 4 & 5 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-2">
                                    <span className="font-mono font-bold uppercase text-accent-yellow block">
                                        4. Contraintes ({selectedPrositModal.constraints.length})
                                    </span>
                                    <ul className="space-y-1 text-text-secondary list-disc list-inside">
                                        {selectedPrositModal.constraints.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-2">
                                    <span className="font-mono font-bold uppercase text-accent-yellow block">
                                        5. Hypothèses ({selectedPrositModal.hypotheses.length})
                                    </span>
                                    <ul className="space-y-1 text-text-secondary list-disc list-inside">
                                        {selectedPrositModal.hypotheses.map((h, i) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Step 6 */}
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-2">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    6. Plan d&apos;Action &amp; Répartition
                                </span>
                                <ol className="space-y-1 text-text-secondary list-decimal list-inside">
                                    {selectedPrositModal.actionPlan.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>

                            {/* Step 7 */}
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-2">
                                <span className="font-mono font-bold uppercase text-accent-yellow block">
                                    7. Livrables Attendus
                                </span>
                                <ul className="space-y-1 text-text-secondary">
                                    {selectedPrositModal.deliverables.map((d, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-yellow shrink-0" />
                                            <span>{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPrositModal(null)}
                                className="text-xs"
                            >
                                Fermer
                            </Button>
                            <Button
                                variant="premium"
                                size="sm"
                                onClick={() => handleDownloadMarkdown(selectedPrositModal.title, `# PROSIT : ${selectedPrositModal.title}\n\n## 3. Problématique\n${selectedPrositModal.problemStatement}\n\n## 2. Contexte\n${selectedPrositModal.context}\n\n## 6. Plan d'action\n${selectedPrositModal.actionPlan.join('\n')}`)}
                                className="text-xs bg-accent-yellow text-black hover:brightness-105"
                            >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                Télécharger la fiche (.md)
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reward Celebration Modal */}
            <RewardCelebrationModal
                isOpen={isRewardModalOpen}
                onClose={() => setIsRewardModalOpen(false)}
                reward={awardedReward}
                examTitle={title}
                contributionType="prosit"
            />

            {/* Modal: Edit Prosit (Admin) */}
            {editingProsit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div className="flex items-center gap-2.5">
                                <Edit3 className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    Modifier le Prosit (Mode Admin)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingProsit(null)}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditProsit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Titre du Prosit</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPrositForm.title}
                                        onChange={(e) => setEditPrositForm({ ...editPrositForm, title: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Sujet / Matière</label>
                                    <input
                                        type="text"
                                        required
                                        value={editPrositForm.subject}
                                        onChange={(e) => setEditPrositForm({ ...editPrositForm, subject: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Promotion</label>
                                    <select
                                        value={editPrositForm.promo}
                                        onChange={(e) => setEditPrositForm({ ...editPrositForm, promo: e.target.value as PrositPromo })}
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
                                        value={editPrositForm.specialty}
                                        onChange={(e) => setEditPrositForm({ ...editPrositForm, specialty: e.target.value as PrositSpecialty })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="Informatique">Informatique</option>
                                        <option value="Généraliste">Généraliste</option>
                                        <option value="BTP">BTP</option>
                                        <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Problématique centrale</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editPrositForm.problemStatement}
                                    onChange={(e) => setEditPrositForm({ ...editPrositForm, problemStatement: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Contexte & Enjeux</label>
                                <textarea
                                    rows={2}
                                    value={editPrositForm.context}
                                    onChange={(e) => setEditPrositForm({ ...editPrositForm, context: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Mots-clés (séparés par des virgules)</label>
                                <input
                                    type="text"
                                    value={editPrositForm.keywords}
                                    onChange={(e) => setEditPrositForm({ ...editPrositForm, keywords: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Hypothèses (1 par ligne)</label>
                                    <textarea
                                        rows={3}
                                        value={editPrositForm.hypotheses}
                                        onChange={(e) => setEditPrositForm({ ...editPrositForm, hypotheses: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Plan d&apos;action (1 étape par ligne)</label>
                                    <textarea
                                        rows={3}
                                        value={editPrositForm.actionPlan}
                                        onChange={(e) => setEditPrositForm({ ...editPrositForm, actionPlan: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingProsit(null)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingPrositEdit}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isSavingPrositEdit ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

