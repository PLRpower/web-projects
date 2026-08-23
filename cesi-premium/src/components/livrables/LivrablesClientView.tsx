'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    ArrowRight,
    RotateCcw,
    Download,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { LivrableEntry } from '@/types/livrable';

interface LivrablesClientViewProps {
    initialLivrables: LivrableEntry[];
}

export default function LivrablesClientView({ initialLivrables }: LivrablesClientViewProps) {
    const router = useRouter();
    const [livrables, setLivrables] = useState<LivrableEntry[]>(initialLivrables);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
    const [selectedCategory, setSelectedCategory] = useState('Tous');

    useEffect(() => {
        const fetchLivrables = async () => {
            try {
                const res = await fetch('/api/livrables/list');
                const data = await res.json();
                if (data.success && Array.isArray(data.livrables)) {
                    setLivrables(data.livrables);
                }
            } catch (e) {
                console.error('Failed to load livrables dynamically:', e);
            }
        };
        fetchLivrables();
    }, []);

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

    const handleAccessLivrable = (livrable: LivrableEntry) => {
        router.push(`/register?redirect=/dashboard/livrables`);
    };

    return (
        <div className="space-y-6">
            {/* Filters & Search */}
            <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher un livrable par mot-clé (DAT, CDC, C4, MoSCoW, Pentest, PPTX, SQL, BIM...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Filtrer par Catégorie"
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[140px]"
                        >
                            <option value="Tous">Tous Types</option>
                            <option value="DAT">DAT (Architecture)</option>
                            <option value="CDC">Cahier des Charges</option>
                            <option value="AUDIT">Audit &amp; Sécurité</option>
                            <option value="SOUTENANCE">Slides Soutenance</option>
                            <option value="BDD">Conception BDD</option>
                            <option value="TESTS">Cahier de Recette</option>
                        </select>

                        {/* Promo Filter */}
                        <select
                            value={selectedPromo}
                            onChange={(e) => setSelectedPromo(e.target.value)}
                            aria-label="Filtrer par Promo"
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[120px]"
                        >
                            <option value="Tous">Toutes Promos</option>
                            <option value="A1">Promo A1</option>
                            <option value="A2">Promo A2</option>
                            <option value="A3">Promo A3</option>
                            <option value="A4">Promo A4</option>
                            <option value="A5">Promo A5</option>
                        </select>

                        {/* Specialty Filter */}
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            aria-label="Filtrer par Spécialité"
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[170px]"
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
                                className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-text-primary text-xs font-semibold shrink-0 cursor-pointer"
                                title="Réinitialiser"
                                aria-label="Réinitialiser les filtres"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Deliverables Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-text-secondary">
                        <strong>{filteredLivrables.length}</strong> livrable{filteredLivrables.length > 1 ? 's' : ''} répertorié{filteredLivrables.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLivrables.map((livrable) => (
                        <div
                            key={livrable.id}
                            onClick={() => handleAccessLivrable(livrable)}
                            className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between shadow-lg p-6 space-y-5 cursor-pointer relative bg-surface-card"
                        >
                            <div className="space-y-4">
                                {/* Top Row Badges */}
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider font-mono">
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

                                {/* Deliverable Title & Subject */}
                                <div className="space-y-1">
                                    <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug line-clamp-2">
                                        {livrable.title}
                                    </h3>
                                    <p className="text-xs font-medium text-text-secondary">
                                        {livrable.categoryLabel}
                                    </p>
                                </div>

                                {/* Summary */}
                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                    {livrable.summary}
                                </p>

                                {/* Key Sections Preview */}
                                <div className="p-3 rounded-2xl bg-surface/50 border border-border/60 space-y-1.5 text-xs">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-yellow block">
                                        Structure du dossier ({livrable.keySections.length} chapitres) :
                                    </span>
                                    <ul className="space-y-1 text-text-secondary text-[11px] leading-tight">
                                        {livrable.keySections.slice(0, 3).map((sec, idx) => (
                                            <li key={idx} className="truncate">• {sec}</li>
                                        ))}
                                        {livrable.keySections.length > 3 && (
                                            <li className="text-text-muted italic">+ {livrable.keySections.length - 3} autres sections complètes</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Tags */}
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

                            {/* Footer & Grade Stamp */}
                            <div className="pt-4 border-t border-border/60 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                        <CheckCircle2 size={13} />
                                        {livrable.gradeHint}
                                    </span>
                                    <span className="text-[11px] text-text-muted font-mono">
                                        {livrable.downloadCount} dl
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs font-bold text-text-primary group-hover:text-accent-yellow transition-colors pt-1">
                                    <span className="flex items-center gap-1.5">
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Consulter le modèle &amp; sources</span>
                                    </span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
