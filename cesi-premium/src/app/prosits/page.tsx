'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Lock,
    ArrowRight,
    X,
    RotateCcw,
    Sparkles,
    CheckCircle2,
    BookOpen,
    Loader2,
    Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { PrositEntry } from '@/types/prosit';
import { ALL_SEED_PROSITS } from '@/lib/prosit-seed-data';

export default function PublicPrositsPage() {
    const router = useRouter();
    const [prosits, setProsits] = useState<PrositEntry[]>(ALL_SEED_PROSITS);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedSpecialty, setSelectedSpecialty] = useState('Tous');

    useEffect(() => {
        const fetchProsits = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/prosits/list');
                const data = await res.json();
                if (data.success && Array.isArray(data.prosits)) {
                    setProsits(data.prosits);
                }
            } catch (e) {
                console.error('Failed to load prosits dynamically:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProsits();
    }, []);

    // Auth modal state
    const [authModal, setAuthModal] = useState<{
        open: boolean;
        title: string;
        description: string;
    }>({
        open: false,
        title: '',
        description: ''
    });

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
        setAuthModal({
            open: true,
            title: `Accéder à la fiche : ${prosit.title}`,
            description: `Pour consulter l'intégralité des 7 étapes (Mots-clés, Contexte, Problématique, Hypothèses, Plan d'action, Livrables, Rôles) et générer vos propres fiches avec l'Assistant IA, connectez-vous à votre compte étudiant CESI.`
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 pt-28 pb-24 flex-1 space-y-10 max-w-7xl">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">

                    <h1 className="text-4xl sm:text-6xl font-normal font-serif text-text-primary tracking-tight">
                        Prosits <span className="italic font-normal">CESI</span>
                    </h1>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                        Explorez la bibliothèque collaborative d&apos;études de cas et fiches méthodologiques PBL partagées par les promotions du CESI.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher par sujet, mot-clé (JWT, CAN, RE2020, Lean, SOLID, SQL...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 transition-all placeholder:text-text-muted"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <select
                            value={selectedPromo}
                            onChange={(e) => setSelectedPromo(e.target.value)}
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 cursor-pointer min-w-[130px]"
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
                            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/50 cursor-pointer min-w-[170px]"
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

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProsits.map((prosit) => (
                                <div
                                    key={prosit.id}
                                    onClick={() => handleAccessProsit(prosit)}
                                    className="card-editorial group rounded-3xl border border-border/80 hover:border-accent-orange/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between shadow-lg p-6 space-y-4 cursor-pointer relative bg-surface-card"
                                >
                                    <div className="space-y-4">
                                        {/* Top Row Badges */}
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

                                        {/* Prosit Title & Subject */}
                                        <div className="space-y-1">
                                            <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-orange transition-colors leading-snug line-clamp-2">
                                                {prosit.title}
                                            </h3>
                                            <p className="text-xs font-medium text-text-secondary">
                                                {prosit.subject}
                                            </p>
                                        </div>

                                        {/* Problem Statement Box */}
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
                                                    className="text-[11px] font-mono bg-surface text-text-secondary px-2 py-0.5 rounded-md border border-border"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer link preview */}
                                    <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-text-secondary group-hover:text-accent-orange transition-colors">
                                        <span>Consulter le Prosit</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Callout */}
                <div className="card-editorial rounded-3xl border border-accent-orange/40 bg-surface p-8 sm:p-10 text-center space-y-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-millimeter opacity-25 pointer-events-none" />
                    <div className="space-y-2 max-w-xl mx-auto relative z-10">
                        <span className="text-3xl">🪄</span>
                        <h2 className="text-2xl sm:text-3xl font-normal font-serif text-text-primary">
                            Générez et publiez vos fiches de Prosit en 1 clic
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                            Importez votre énoncé de Prosit ou saisissez un sujet pour obtenir automatiquement une analyse en 7 étapes, vos hypothèses, votre plan d&apos;action et exportez en Markdown.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
                        <Link href="/register">
                            <Button variant="premium" size="lg" className="shadow-xl shadow-accent-yellow/20 font-bold">
                                Créer mon compte gratuit CESI
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="border-border/70">
                                Se connecter
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Auth Redirect Modal for Prosit Access */}
            {authModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="card-editorial rounded-3xl border border-accent-orange/30 bg-surface-card p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            onClick={() => setAuthModal({ ...authModal, open: false })}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-3 text-center pt-2">
                            <div className="w-14 h-14 rounded-2xl bg-accent-orange/15 text-accent-orange border border-accent-orange/30 flex items-center justify-center mx-auto text-2xl shadow-lg">
                                <Lock className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-normal font-serif text-text-primary">
                                {authModal.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                {authModal.description}
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link href="/login?redirect=/dashboard/prosits" className="block w-full">
                                <Button variant="premium" className="w-full font-bold shadow-lg shadow-accent-yellow/20">
                                    Se connecter avec mon compte CESI
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>

                            <Link href="/register" className="block w-full">
                                <Button variant="outline" className="w-full border-border font-semibold text-xs">
                                    Créer un compte gratuit
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
