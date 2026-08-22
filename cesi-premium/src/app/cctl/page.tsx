'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    BookOpen,
    ArrowRight,
    RotateCcw,
    Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ALL_SEED_CCTLS } from '@/lib/cctl-seed-data';
import { PublishedCCTLMeta } from '@/lib/cctl-store';

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

export default function PublicCCTLPage() {
    const [cctls, setCctls] = useState<PublishedCCTLMeta[]>(ALL_SEED_CCTLS.map(({ exam, ...meta }) => meta));
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');

    useEffect(() => {
        const fetchCctls = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/cctl/list');
                const data = await res.json();
                if (data.success && Array.isArray(data.cctls)) {
                    setCctls(data.cctls);
                }
            } catch (e) {
                console.error('Failed to load cctl dynamically:', e);
            } finally {
                setIsLoading(false);
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

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q ||
                cctl.title.toLowerCase().includes(q) ||
                cctl.subject.toLowerCase().includes(q) ||
                (cctl.specialty && cctl.specialty.toLowerCase().includes(q)) ||
                (cctl.domain && cctl.domain.toLowerCase().includes(q)) ||
                (cctl.typesSummary && cctl.typesSummary.some(t => t.toLowerCase().includes(q)));

            return matchesPromo && matchesSpecialty && matchesSearch;
        });
    }, [cctls, selectedPromo, selectedSpecialty, searchQuery]);

    return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 pt-28 pb-20 flex-1 space-y-10 max-w-7xl">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">

                    <h1 className="text-4xl sm:text-6xl font-normal font-serif text-text-primary tracking-tight">
                        CCTL <span className="italic font-normal">CESI</span>
                    </h1>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                        Découvrez la bibliothèque d&apos;examens et de QCMs réels partagés par les élèves-ingénieurs du CESI. Consultez librement les sujets et corrigés types.
                    </p>
                </div>

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
                                className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[170px]"
                            >
                                {SPECIALTY_OPTIONS.map(s => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
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
                            <Link
                                key={cctl.id}
                                href={`/cctl/${cctl.id}`}
                                className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between shadow-lg p-6 space-y-4 cursor-pointer relative bg-surface-card"
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider font-mono">
                                                {cctl.promo}
                                            </span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface text-text-secondary border border-border">
                                                {cctl.specialty || 'Ingénierie'}
                                            </span>
                                        </div>

                                        <span className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                            {cctl.year}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug line-clamp-2">
                                            {cctl.subject || cctl.title}
                                        </h3>
                                        <p className="text-xs font-mono text-text-secondary">
                                            {cctl.totalQuestions} Questions • Grille d&apos;évaluation officielle
                                        </p>
                                    </div>

                                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                        {cctl.description || `Sujet complet portant sur le référentiel de compétences CESI ${cctl.promo}.`}
                                    </p>

                                    {/* Question tags */}
                                    {cctl.typesSummary && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {cctl.typesSummary.slice(0, 3).map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[11px] font-mono bg-surface text-text-secondary px-2 py-0.5 rounded-md border border-border"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {cctl.typesSummary.length > 3 && (
                                                <span className="text-[10px] text-text-muted px-1.5 py-0.5">
                                                    +{cctl.typesSummary.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-text-secondary group-hover:text-accent-yellow transition-colors">
                                    <span>Consulter l&apos;épreuve</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
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
                                    setSearchQuery('');
                                }}
                            >
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
