'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Download,
    Eye,
    FileUp,
    Zap,
    BookOpen,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublishedCCTLMeta } from '@/lib/cctl-store';

export default function ArchivesPage() {
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
            console.error('Failed to load archives:', e);
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
        const matchesYear = selectedYear === 'Tous' || cctl.year === selectedYear;
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
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-card border border-border text-[11px] font-mono text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
                        <span>ANNALES CESI // BASE COLLABORATIVE</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif flex items-center gap-3 text-text-primary">
                        <BookOpen className="w-8 h-8 text-accent-yellow" />
                        Archives CCTL <span className="italic font-normal">Collaboratives</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Accédez aux sujets d&apos;examens et annales partagés par les élèves-ingénieurs du CESI.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 relative z-10">
                    <Link href="/dashboard/import">
                        <button
                            type="button"
                            className="px-5 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                        >
                            <FileUp className="w-4 h-4" />
                            <span>Publier un CCTL</span>
                        </button>
                    </Link>
                </div>
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
                        className="bg-surface-highlight/50 border border-border/50 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[110px]"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="Tous">Toutes Années</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                    </select>
                </div>
            </div>

            {/* Content State */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-10 h-10 text-accent-yellow animate-spin" />
                    <p className="text-sm text-text-secondary">Chargement des archives CCTL...</p>
                </div>
            ) : (
                /* Grid of CCTLs */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCCTLs.map((cctl) => (
                        <div
                            key={cctl.id}
                            className="glass group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col shadow-lg hover:shadow-accent-yellow/5 relative"
                        >
                            <div className="p-6 flex-1 space-y-4">
                                {/* Badges */}
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider font-mono">
                                            {cctl.promo}
                                        </span>
                                        <span className="text-text-secondary text-xs font-semibold bg-surface-highlight/60 px-2.5 py-1 rounded-lg border border-border/40">
                                            {cctl.year}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-accent-yellow/90 bg-accent-yellow/10 px-2.5 py-1 rounded-full border border-accent-yellow/20 font-mono">
                                        {cctl.totalQuestions} Questions
                                    </span>
                                </div>

                                {/* Title & Subject */}
                                <div className="space-y-1">
                                    <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors line-clamp-2">
                                        {cctl.subject || cctl.title}
                                    </h3>
                                    <p className="text-text-secondary text-xs font-medium">
                                        {cctl.specialty || 'Toutes Spécialités'}
                                    </p>
                                </div>

                                {/* Types Tags */}
                                {cctl.typesSummary && cctl.typesSummary.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {cctl.typesSummary.slice(0, 3).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-[11px] font-medium bg-surface-highlight/50 text-text-secondary px-2.5 py-0.5 rounded-md border border-border/50 font-mono"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions footer */}
                            <div className="p-4 bg-surface/50 border-t border-border/60">
                                <Link href={`/dashboard/archives/${cctl.id}`} className="block w-full">
                                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold hover:bg-surface-highlight border-border flex items-center justify-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5 text-accent-yellow" />
                                        <span>Consulter le sujet &amp; correction</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
