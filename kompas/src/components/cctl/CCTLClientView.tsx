'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    BookOpen,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublishedCCTLMeta } from '@/lib/cctl-store';
import { CCTLCard } from '@/components/cctl/CCTLCard';
import { formatAcademicYear } from '@/types/cctl';

const PROMO_OPTIONS = [
    { id: 'Tous', label: 'Toutes les Promos' },
    { id: 'A3', label: 'Promo A3 (Bac+3)' },
    { id: 'A4', label: 'Promo A4 (Bac+4)' },
    { id: 'A2', label: 'Promo A2 (Prépa 2)' },
    { id: 'A1', label: 'Promo A1 (Prépa 1)' },
    { id: 'A5', label: 'Promo A5 (Bac+5)' }
];

const SPECIALTY_OPTIONS = [
    { id: 'Tous', label: 'Toutes Spécialités' },
    { id: 'Informatique', label: '💻 Informatique' },
    { id: 'BTP', label: '🏗️ BTP' },
    { id: 'Systèmes Embarqués', label: '🤖 Systèmes Embarqués' },
    { id: 'Généraliste', label: '⚙️ Généraliste' }
];

const YEAR_OPTIONS = [
    { id: 'Tous', label: 'Toutes les Années' },
    { id: '2025 - 2026', label: '2025 - 2026' },
    { id: '2024 - 2025', label: '2024 - 2025' },
    { id: '2023 - 2024', label: '2023 - 2024' },
    { id: '2022 - 2023', label: '2022 - 2023' }
];

interface CCTLClientViewProps {
    initialCctls: PublishedCCTLMeta[];
}

export default function CCTLClientView({ initialCctls }: CCTLClientViewProps) {
    const [cctls, setCctls] = useState<PublishedCCTLMeta[]>(initialCctls);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
    const [selectedYear, setSelectedYear] = useState('Tous');

    useEffect(() => {
        const fetchCctls = async () => {
            try {
                const res = await fetch('/api/cctl/list');
                const data = await res.json();
                if (data.success && Array.isArray(data.cctls)) {
                    setCctls(data.cctls);
                }
            } catch (e) {
                console.error('Failed to load cctl dynamically:', e);
            }
        };
        fetchCctls();
    }, []);

    const filteredCCTLs = useMemo(() => {
        return cctls.filter(cctl => {
            const matchesPromo = selectedPromo === 'Tous' || cctl.promo === selectedPromo;
            const matchesSpecialty = selectedSpecialty === 'Tous' ||
                (cctl.specialty && cctl.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) ||
                (selectedSpecialty === 'Informatique' && (cctl.track === 'FISA' || cctl.track === 'FISE'));
            const matchesYear = selectedYear === 'Tous' ||
                cctl.year === selectedYear ||
                formatAcademicYear(cctl.year) === formatAcademicYear(selectedYear);

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                cctl.title.toLowerCase().includes(q) ||
                cctl.subject.toLowerCase().includes(q) ||
                (cctl.specialty && cctl.specialty.toLowerCase().includes(q)) ||
                (cctl.domain && cctl.domain.toLowerCase().includes(q)) ||
                (cctl.typesSummary && cctl.typesSummary.some(t => t.toLowerCase().includes(q)));

            return matchesPromo && matchesSpecialty && matchesYear && matchesSearch;
        });
    }, [cctls, selectedPromo, selectedSpecialty, selectedYear, searchQuery]);

    return (
        <div className="space-y-10">
            {/* Search & Filters Bar */}
            <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher par mot-clé, compétence (React, SQL, Docker, OAuth, Dijkstra, SOLID...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {/* Promo filter */}
                        <select
                            value={selectedPromo}
                            onChange={(e) => setSelectedPromo(e.target.value)}
                            aria-label="Filtrer par Promo"
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[140px]"
                        >
                            {PROMO_OPTIONS.map(p => (
                                <option key={p.id} value={p.id}>{p.label}</option>
                            ))}
                        </select>

                        {/* Specialty filter */}
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            aria-label="Filtrer par Spécialité"
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[170px]"
                        >
                            {SPECIALTY_OPTIONS.map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                        </select>

                        {/* Year filter */}
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            aria-label="Filtrer par Année"
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[140px]"
                        >
                            {YEAR_OPTIONS.map(y => (
                                <option key={y.id} value={y.id}>{y.label}</option>
                            ))}
                        </select>

                        {(selectedPromo !== 'Tous' || selectedSpecialty !== 'Tous' || selectedYear !== 'Tous' || searchQuery) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedPromo('Tous');
                                    setSelectedSpecialty('Tous');
                                    setSelectedYear('Tous');
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

            {/* CCTL Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-text-secondary">
                        <strong>{filteredCCTLs.length}</strong> épreuve{filteredCCTLs.length > 1 ? 's' : ''} CCTL répertoriée{filteredCCTLs.length > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCCTLs.map((cctl) => (
                        <CCTLCard
                            key={cctl.id}
                            cctl={cctl}
                            href={`/cctl/${cctl.id}`}
                        />
                    ))}
                </div>

                {filteredCCTLs.length === 0 && (
                    <div className="card-editorial p-16 text-center rounded-3xl border border-border text-text-secondary space-y-4 max-w-lg mx-auto bg-surface-card">
                        <div className="p-4 bg-accent-yellow/10 rounded-2xl w-fit mx-auto text-accent-yellow border border-accent-yellow/20">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-normal font-serif text-lg text-text-primary">Aucun CCTL trouvé</h3>
                            <p className="text-xs leading-relaxed">
                                Aucun sujet ne correspond à vos filtres. Essayez de réinitialiser vos critères de recherche.
                            </p>
                        </div>
                        <Button
                            variant="premium"
                            size="sm"
                            onClick={() => {
                                setSelectedPromo('Tous');
                                setSelectedSpecialty('Tous');
                                setSelectedYear('Tous');
                                setSearchQuery('');
                            }}
                        >
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
