'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    FileUp,
    BookOpen,
    Loader2,
    Sparkles,
    Zap
} from 'lucide-react';
import { PublishedCCTLMeta } from '@/lib/cctl-store';
import { Button } from '@/components/ui/button';
import { CCTLCard } from '@/components/cctl/CCTLCard';
import { formatAcademicYear } from '@/types/cctl';

export default function DashboardCCTLPage() {
    const [cctls, setCctls] = useState<PublishedCCTLMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedYear, setSelectedYear] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');

    useEffect(() => {
        fetchCCTLs();
    }, []);

    const fetchCCTLs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/cctl/list');
            const data = await res.json();
            if (data.success && data.cctls) {
                setCctls(data.cctls);
            }
        } catch (e) {
            console.error('Failed to load CCTL list:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredCCTLs = cctls.filter(cctl => {
        const matchesSearch =
            cctl.title.toLowerCase().includes(search.toLowerCase()) ||
            cctl.subject.toLowerCase().includes(search.toLowerCase()) ||
            (cctl.typesSummary && cctl.typesSummary.some(t => t.toLowerCase().includes(search.toLowerCase())));

        const matchesPromo = selectedPromo === 'Tous' || cctl.promo === selectedPromo;
        const matchesYear = selectedYear === 'Tous' ||
            cctl.year === selectedYear ||
            formatAcademicYear(cctl.year) === formatAcademicYear(selectedYear);
        const matchesSpecialty = selectedSpecialty === 'Tous' ||
            (cctl.specialty && cctl.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) ||
            (selectedSpecialty === 'Informatique' && (cctl.track === 'FISA' || cctl.track === 'FISE'));

        return matchesSearch && matchesPromo && matchesYear && matchesSpecialty;
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif flex items-center gap-3 text-text-primary">
                        <BookOpen className="w-8 h-8 text-accent-yellow" />
                        CCTL &amp; Annales <span className="italic font-normal">Collaboratives</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Accédez aux sujets d&apos;examens officiels et générez vos propres examens blancs sur-mesure.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <Link href="/dashboard/cctl/generateur">
                        <button
                            type="button"
                            className="px-5 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Générateur IA de CCTL</span>
                        </button>
                    </Link>
                    <Link href="/dashboard/import">
                        <button
                            type="button"
                            className="px-4 py-3 rounded-xl bg-surface border border-border text-text-primary font-semibold text-xs hover:bg-surface-highlight transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                            <FileUp className="w-4 h-4 text-accent-yellow" />
                            <span>Publier</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* AI Generator Promotional Banner */}
            <div className="card-editorial p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-accent-yellow/15 via-surface-card to-surface-card border-2 border-accent-yellow/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold shadow-md shadow-accent-yellow/20 shrink-0">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-lg sm:text-xl font-serif font-normal text-text-primary">
                                Générateur IA de CCTL Blancs &amp; Coach Pas-à-Pas
                            </h2>
                            <span className="text-[10px] font-mono font-bold uppercase bg-accent-yellow text-black px-2 py-0.5 rounded-full">
                                NOUVEAU
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
                            Déposez un cours ou des notes (PDF, Word, photos de tableau). L&apos;IA extrait automatiquement les concepts et génère un faux CCTL inédit au format officiel CESI. Entraînez-vous à l&apos;infini !
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/cctl/generateur" className="shrink-0 w-full sm:w-auto">
                    <Button variant="premium" className="w-full sm:w-auto font-bold text-xs shadow-lg shadow-accent-yellow/20 px-6">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Générer un CCTL Blanc
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="glass p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Rechercher par compétence, sujet ou technologie..."
                        className="w-full bg-surface-highlight/40 border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-secondary/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Promo Filter */}
                    <select
                        className="bg-surface-highlight/50 border border-border/50 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[110px]"
                        value={selectedPromo}
                        onChange={(e) => setSelectedPromo(e.target.value)}
                    >
                        <option value="Tous">Toutes Promos</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="A3">A3</option>
                        <option value="A4">A4</option>
                        <option value="A5">A5</option>
                    </select>

                    {/* Specialty Filter */}
                    <select
                        className="bg-surface-highlight/50 border border-border/50 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[160px]"
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                    >
                        <option value="Tous">Toutes Spécialités</option>
                        <option value="Informatique">Informatique</option>
                        <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                        <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                        <option value="Généraliste">Généraliste</option>
                    </select>

                    {/* Year Filter */}
                    <select
                        className="bg-surface-highlight/50 border border-border/50 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[135px]"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="Tous">Toutes Années</option>
                        <option value="2025 - 2026">2025 - 2026</option>
                        <option value="2024 - 2025">2024 - 2025</option>
                        <option value="2023 - 2024">2023 - 2024</option>
                        <option value="2022 - 2023">2022 - 2023</option>
                    </select>
                </div>
            </div>

            {/* Content State */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-10 h-10 text-accent-yellow animate-spin" />
                    <p className="text-sm text-text-secondary">Chargement des CCTL...</p>
                </div>
            ) : (
                /* Grid of CCTLs */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCCTLs.map((cctl) => (
                        <CCTLCard
                            key={cctl.id}
                            cctl={cctl}
                            href={`/dashboard/cctl/${cctl.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
