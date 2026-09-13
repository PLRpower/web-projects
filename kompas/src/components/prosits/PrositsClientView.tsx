'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    ArrowRight,
    RotateCcw,
} from 'lucide-react';
import { PrositEntry } from '@/types/prosit';

interface PrositsClientViewProps {
    initialProsits: PrositEntry[];
}

export default function PrositsClientView({ initialProsits }: PrositsClientViewProps) {
    const router = useRouter();
    const [prosits, setProsits] = useState<PrositEntry[]>(initialProsits);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');

    useEffect(() => {
        const fetchProsits = async () => {
            try {
                const res = await fetch('/api/prosits/list');
                const data = await res.json();
                if (data.success && Array.isArray(data.prosits)) {
                    setProsits(data.prosits);
                }
            } catch (e) {
                console.error('Failed to load prosits dynamically:', e);
            }
        };

        window.addEventListener('kompas_prosit_published', fetchProsits);
        return () => window.removeEventListener('kompas_prosit_published', fetchProsits);
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

    const handleAccessProsit = (prosit: PrositEntry) => {
        router.push(`/register?redirect=/dashboard/prosits`);
    };

    return (
        <div className="space-y-10">
            {/* Filters & Search */}
            <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Rechercher par sujet, mot-clé (JWT, CAN, RE2020, Lean, SOLID, SQL...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <select
                        value={selectedPromo}
                        onChange={(e) => setSelectedPromo(e.target.value)}
                        aria-label="Filtrer par Promo"
                        className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[130px]"
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
                        aria-label="Filtrer par Spécialité"
                        className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[170px]"
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
                            className="p-2.5 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-text-primary text-xs font-semibold shrink-0 cursor-pointer"
                            title="Réinitialiser"
                            aria-label="Réinitialiser les filtres"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Prosits Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-text-secondary">
                        <strong>{filteredProsits.length}</strong> fiche{filteredProsits.length > 1 ? 's' : ''} de Prosit répertoriée{filteredProsits.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProsits.map((prosit) => (
                        <div
                            key={prosit.id}
                            onClick={() => handleAccessProsit(prosit)}
                            className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between shadow-lg p-6 space-y-4 cursor-pointer relative bg-surface-card"
                        >
                            <div className="space-y-4">
                                {/* Top Row Badges */}
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

                                {/* Prosit Title & Subject */}
                                <div className="space-y-1">
                                    <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug line-clamp-2">
                                        {prosit.title}
                                    </h3>
                                    <p className="text-xs font-medium text-text-secondary">
                                        {prosit.subject}
                                    </p>
                                </div>

                                {/* Problem Statement Box */}
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
                                            className="text-[11px] font-mono bg-surface text-text-secondary px-2 py-0.5 rounded-md border border-border"
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer link preview */}
                            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-text-secondary group-hover:text-accent-yellow transition-colors">
                                <span>Consulter le Prosit</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
