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
    Sparkles,
    Search,
    BookOpen,
    Plus,
    RotateCcw,
    Eye,
    X,
    CheckCircle2,
    Send,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrositEntry, PrositPromo, PrositSpecialty } from '@/types/prosit';
import { ALL_SEED_PROSITS } from '@/lib/prosit-seed-data';

export default function DashboardPrositsPage() {
    const [activeTab, setActiveTab] = useState<'catalog' | 'generator'>('catalog');
    const [prosits, setProsits] = useState<PrositEntry[]>(ALL_SEED_PROSITS);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        fetchProsits();
    }, []);

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
        if (!title.trim() || !problematic.trim()) return;

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
            if (data.success && data.published) {
                setPublishSuccess(true);
                await fetchProsits();
                setTimeout(() => {
                    setPublishSuccess(false);
                    setActiveTab('catalog');
                }, 1500);
            }
        } catch (e) {
            console.error('Failed to publish prosit:', e);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-card border border-border text-[11px] font-mono text-accent-orange">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-orange animate-pulse" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif text-text-primary flex items-center gap-3">
                        <Wand2 className="w-8 h-8 text-accent-orange" />
                        Prosits <span className="italic font-normal">CESI</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
                        Consultez la base de données collaborative des fiches de Prosits et rédigez facilement vos synthèses selon la méthode PBL en 7 étapes.
                    </p>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                    <button
                        type="button"
                        onClick={() => setActiveTab('generator')}
                        className="px-4 py-2.5 rounded-xl bg-accent-orange text-black text-xs font-bold hover:brightness-105 transition-all shadow-md shadow-accent-orange/20 flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Rédiger &amp; Publier un Prosit</span>
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
                            ? 'bg-accent-orange text-black shadow-xs font-bold'
                            : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                    }`}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Base de données Prosits ({prosits.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('generator')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'generator'
                            ? 'bg-accent-orange text-black shadow-xs font-bold'
                            : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                    }`}
                >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Rédacteur &amp; Générateur PBL</span>
                </button>
            </div>

            {/* TAB 1: PROSIT CATALOG / DATABASE */}
            {activeTab === 'catalog' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Search and Filters */}
                    <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl flex flex-col md:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher par mot-clé, sujet (JWT, CAN, RE2020, Lean, SOLID, SQL...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 transition-all placeholder:text-text-muted"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <select
                                value={selectedPromo}
                                onChange={(e) => setSelectedPromo(e.target.value)}
                                className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 cursor-pointer min-w-[120px]"
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
                                className="bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 cursor-pointer min-w-[170px]"
                            >
                                <option value="Tous">Toutes Spécialités</option>
                                <option value="Informatique">Informatique</option>
                                <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                                <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                                <option value="Généraliste">Généraliste</option>
                            </select>

                            {(selectedPromo !== 'Tous' || selectedSpecialty !== 'Tous' || searchQuery) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedPromo('Tous');
                                        setSelectedSpecialty('Tous');
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

                    {/* Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProsits.map((prosit) => (
                                <div
                                    key={prosit.id}
                                    className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-orange/50 transition-all p-6 flex flex-col justify-between space-y-4 bg-surface-card shadow-sm"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2.5 py-0.5 rounded-full bg-accent-orange text-black font-bold text-xs uppercase tracking-wider font-mono">
                                                    {prosit.promo}
                                                </span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface text-text-secondary border border-border">
                                                    {prosit.specialty}
                                                </span>
                                            </div>

                                            <span className="text-[11px] font-mono font-bold text-accent-orange bg-accent-orange/10 px-2.5 py-0.5 rounded-full border border-accent-orange/20">
                                                7 Étapes
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-orange transition-colors leading-snug">
                                                {prosit.title}
                                            </h3>
                                            <p className="text-xs font-medium text-text-secondary">
                                                {prosit.subject}
                                            </p>
                                        </div>

                                        {/* Problem Statement */}
                                        <div className="p-3.5 rounded-2xl bg-surface/50 border border-border/60 space-y-1 text-xs">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-orange block">
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
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPrositModal(prosit)}
                                            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-highlight border border-border text-text-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-accent-orange" />
                                            <span>Consulter en 7 étapes</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDownloadMarkdown(prosit.title, `# PROSIT : ${prosit.title}\n\n## 3. Problématique\n${prosit.problemStatement}\n\n## 2. Contexte\n${prosit.context}\n\n## 6. Plan d'action\n${prosit.actionPlan.join('\n')}`)}
                                            className="px-3.5 py-2 rounded-xl bg-accent-orange text-black font-bold text-xs hover:brightness-105 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>.md</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
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

                            {publishSuccess && (
                                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Votre fiche de Prosit a été publiée avec succès dans la base de données !</span>
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
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
                                    <span className="text-xs font-bold text-accent-orange flex items-center gap-1.5 font-mono">
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 resize-none"
                                    />
                                </div>

                                {/* Step 3: Problematic */}
                                <div>
                                    <label className="text-xs font-bold text-accent-orange block mb-1 flex items-center gap-1.5 font-mono">
                                        <Lightbulb className="w-3.5 h-3.5" />
                                        3. Problématique centrale *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Comment concevoir... ? / En quoi... ?"
                                        value={problematic}
                                        onChange={(e) => setProblematic(e.target.value)}
                                        className="w-full bg-surface border border-accent-orange/40 rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange"
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
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
                                        className="w-full bg-surface border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="anon-prosit"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="rounded text-accent-orange focus:ring-accent-orange"
                                    />
                                    <label htmlFor="anon-prosit" className="text-xs text-text-secondary cursor-pointer">
                                        Publier anonymement sous le statut <em>&quot;Élève Anonyme&quot;</em>
                                    </label>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3">
                                    <button
                                        type="submit"
                                        disabled={isPublishing}
                                        className="px-6 py-2.5 rounded-xl bg-accent-orange text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-orange/20 flex items-center gap-2 cursor-pointer"
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
                                        className="text-xs bg-accent-orange text-black hover:brightness-105"
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
                                <span className="px-2.5 py-0.5 rounded-full bg-accent-orange text-black font-bold text-xs uppercase font-mono">
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

                        {/* 7-Step breakdown */}
                        <div className="space-y-4 text-xs">
                            {/* Problématique */}
                            <div className="p-4 rounded-2xl bg-accent-orange/10 border border-accent-orange/30 space-y-1">
                                <span className="font-mono font-bold uppercase text-accent-orange block">
                                    3. Problématique centrale
                                </span>
                                <p className="text-text-primary text-sm italic font-serif">
                                    &ldquo;{selectedPrositModal.problemStatement}&rdquo;
                                </p>
                            </div>

                            {/* Contexte */}
                            <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1">
                                <span className="font-mono font-bold uppercase text-text-secondary block">
                                    2. Contexte &amp; Situation
                                </span>
                                <p className="text-text-secondary leading-relaxed">
                                    {selectedPrositModal.context}
                                </p>
                            </div>

                            {/* Contraintes & Hypothèses */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1.5">
                                    <span className="font-mono font-bold uppercase text-text-secondary block">
                                        4. Contraintes
                                    </span>
                                    <ul className="space-y-1 text-text-secondary">
                                        {selectedPrositModal.constraints.map((c, i) => (
                                            <li key={i}>• {c}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1.5">
                                    <span className="font-mono font-bold uppercase text-text-secondary block">
                                        5. Hypothèses
                                    </span>
                                    <ul className="space-y-1 text-text-secondary">
                                        {selectedPrositModal.hypotheses.map((h, i) => (
                                            <li key={i}>• {h}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Plan d'action & Livrables */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1.5">
                                    <span className="font-mono font-bold uppercase text-text-secondary block">
                                        6. Plan d&apos;action
                                    </span>
                                    <ul className="space-y-1 text-text-secondary">
                                        {selectedPrositModal.actionPlan.map((a, i) => (
                                            <li key={i}>{a}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-1.5">
                                    <span className="font-mono font-bold uppercase text-text-secondary block">
                                        7. Livrables attendus
                                    </span>
                                    <ul className="space-y-1 text-text-secondary">
                                        {selectedPrositModal.deliverables.map((d, i) => (
                                            <li key={i}>• {d}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-xs font-mono text-text-muted">
                                {selectedPrositModal.keywords.join(' • ')}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleDownloadMarkdown(selectedPrositModal.title, `# PROSIT : ${selectedPrositModal.title}\n\n## 3. Problématique\n${selectedPrositModal.problemStatement}\n\n## 2. Contexte\n${selectedPrositModal.context}\n\n## 6. Plan d'action\n${selectedPrositModal.actionPlan.join('\n')}`)}
                                className="px-5 py-2.5 rounded-xl bg-accent-orange text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-orange/20 flex items-center gap-2 cursor-pointer"
                            >
                                <Download className="w-4 h-4" />
                                <span>Télécharger la fiche (.md)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
