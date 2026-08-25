'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    FileUp,
    BookOpen,
    Loader2,
    Sparkles,
    RotateCcw
} from 'lucide-react';
import { PublishedCCTLMeta } from '@/lib/cctl-store';
import { Button } from '@/components/ui/button';
import { CCTLCard } from '@/components/cctl/CCTLCard';
import { formatAcademicYear } from '@/types/cctl';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail, checkIsAdminClient } from '@/lib/admin';
import { X, Edit3, Check } from 'lucide-react';

export default function DashboardCCTLPage() {
    const supabase = createClient();
    const [cctls, setCctls] = useState<PublishedCCTLMeta[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedYear, setSelectedYear] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');
    const [isAdmin, setIsAdmin] = useState(false);

    // Editing modal state
    const [editingCCTL, setEditingCCTL] = useState<PublishedCCTLMeta | null>(null);
    const [editForm, setEditForm] = useState({
        title: '',
        subject: '',
        promo: 'A3',
        year: '2025',
        domain: 'Informatique',
        description: ''
    });
    const [isSavingEdit, setIsSavingEdit] = useState(false);

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
        fetchCCTLs();
        checkAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && checkIsAdminClient(session.user)) {
                setIsAdmin(true);
            }
        });

        return () => subscription.unsubscribe();
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

    const handleDeleteCCTL = async (id: string) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce sujet CCTL ? Cette action est irréversible.')) {
            return;
        }

        setCctls(prev => prev.filter(c => c.id !== id));
        try {
            await fetch(`/api/cctl/${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error('Error deleting CCTL:', e);
            fetchCCTLs();
        }
    };

    const handleStartEdit = (cctl: PublishedCCTLMeta) => {
        setEditingCCTL(cctl);
        setEditForm({
            title: cctl.title,
            subject: cctl.subject || cctl.title,
            promo: cctl.promo,
            year: cctl.year,
            domain: cctl.domain || 'Informatique',
            description: cctl.description || ''
        });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCCTL || isSavingEdit) return;

        setIsSavingEdit(true);
        try {
            const res = await fetch(`/api/cctl/${editingCCTL.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success && data.cctl) {
                setCctls(prev => prev.map(c => c.id === editingCCTL.id ? { ...c, ...editForm } : c));
            }
            setEditingCCTL(null);
        } catch (e) {
            console.error('Error updating CCTL:', e);
        } finally {
            setIsSavingEdit(false);
        }
    };

    const filteredCCTLs = cctls.filter(cctl => {
        const matchesSearch =
            !search ||
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

    const hasActiveFilters = Boolean(search || selectedPromo !== 'Tous' || selectedYear !== 'Tous' || selectedSpecialty !== 'Tous');

    const handleResetFilters = () => {
        setSearch('');
        setSelectedPromo('Tous');
        setSelectedYear('Tous');
        setSelectedSpecialty('Tous');
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Unified Compact Header & Search/Filters Section */}
            <div className="card-editorial p-5 sm:p-6 rounded-3xl bg-surface-card border-border shadow-lg space-y-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-millimeter opacity-20 pointer-events-none" />

                {/* Top Row: Title + Quick Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Annales &amp; QCMs <span className="italic font-normal">de CCTL</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary font-normal">
                            Accédez aux sujets officiels d&apos;examen ou générez une épreuve blanche inédite avec l&apos;IA.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                        <Link href="/dashboard/cctl/generateur" className="flex-1 md:flex-none">
                            <button
                                type="button"
                                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Générateur IA</span>
                            </button>
                        </Link>
                        <Link href="/dashboard/import" className="flex-1 md:flex-none">
                            <button
                                type="button"
                                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary font-semibold text-xs hover:bg-surface-highlight transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FileUp className="w-4 h-4 text-accent-yellow" />
                                <span>Publier</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Row: Integrated Filter & Search Toolbar */}
                <div className="pt-4 border-t border-border/60 flex flex-col md:flex-row gap-2.5 items-center relative z-10">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher par matière, sujet ou technologie (React, SQL, Docker, OAuth...)"
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {/* Promo Filter */}
                        <select
                            className="bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[110px]"
                            value={selectedPromo}
                            onChange={(e) => setSelectedPromo(e.target.value)}
                            aria-label="Filtrer par promotion"
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
                            className="bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[150px]"
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            aria-label="Filtrer par spécialité"
                        >
                            <option value="Tous">Toutes Spécialités</option>
                            <option value="Informatique">Informatique</option>
                            <option value="BTP & Génie Civil">BTP &amp; Génie Civil</option>
                            <option value="Systèmes Embarqués">Systèmes Embarqués</option>
                            <option value="Généraliste">Généraliste</option>
                        </select>

                        {/* Year Filter */}
                        <select
                            className="bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer flex-1 sm:flex-none min-w-[125px]"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            aria-label="Filtrer par année"
                        >
                            <option value="Tous">Toutes Années</option>
                            <option value="2025 - 2026">2025 - 2026</option>
                            <option value="2024 - 2025">2024 - 2025</option>
                            <option value="2023 - 2024">2023 - 2024</option>
                            <option value="2022 - 2023">2022 - 2023</option>
                        </select>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-text-primary transition-all text-xs font-semibold cursor-pointer shrink-0"
                                title="Réinitialiser les filtres"
                                aria-label="Réinitialiser les filtres"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Count */}
            {!isLoading && (
                <div className="flex items-center justify-between text-xs text-text-secondary px-1">
                    <span>
                        <strong>{filteredCCTLs.length}</strong> épreuve{filteredCCTLs.length > 1 ? 's' : ''} CCTL disponible{filteredCCTLs.length > 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Content State */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                    <p className="text-xs text-text-secondary">Chargement des épreuves CCTL...</p>
                </div>
            ) : filteredCCTLs.length === 0 ? (
                <div className="card-editorial p-12 text-center rounded-3xl border border-border text-text-secondary space-y-4 max-w-md mx-auto bg-surface-card">
                    <div className="p-4 bg-accent-yellow/10 rounded-2xl w-fit mx-auto text-accent-yellow border border-accent-yellow/20">
                        <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-normal font-serif text-lg text-text-primary">Aucun CCTL trouvé</h3>
                        <p className="text-xs leading-relaxed">
                            Aucun sujet ne correspond à vos filtres. Essayez de réinitialiser vos critères.
                        </p>
                    </div>
                    <Button variant="premium" size="sm" onClick={handleResetFilters} className="text-xs font-bold">
                        Réinitialiser les filtres
                    </Button>
                </div>
            ) : (
                /* Grid of CCTLs */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCCTLs.map((cctl) => (
                        <CCTLCard
                            key={cctl.id}
                            cctl={cctl}
                            href={`/dashboard/cctl/${cctl.id}`}
                            isAdmin={isAdmin}
                            onEdit={handleStartEdit}
                            onDelete={handleDeleteCCTL}
                        />
                    ))}
                </div>
            )}

            {/* Modal: Edit CCTL */}
            {editingCCTL && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg card-editorial p-6 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    Modifier le CCTL (Mode Admin)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingCCTL(null)}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-3.5">
                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Titre / Sujet</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.subject}
                                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value, title: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Promotion</label>
                                    <select
                                        value={editForm.promo}
                                        onChange={(e) => setEditForm({ ...editForm, promo: e.target.value })}
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
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Année</label>
                                    <input
                                        type="text"
                                        value={editForm.year}
                                        onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Domaine / Spécialité</label>
                                <input
                                    type="text"
                                    value={editForm.domain}
                                    onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingCCTL(null)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingEdit}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isSavingEdit ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

