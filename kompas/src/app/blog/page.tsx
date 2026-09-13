import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, Calendar, Clock, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog & Nouveautés | Kompas CESI',
    description: 'Toutes les actualités, mises à jour majeures et guides méthodologiques de la plateforme Kompas pour les étudiants du CESI.',
};

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary">
            <Navbar />

            <main className="flex-1 pt-28 pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour à l&apos;accueil</span>
                        </Link>
                    </div>

                    <header className="space-y-4 pb-8 border-b border-border">
                        <div className="font-mono text-xs text-accent-yellow uppercase tracking-wider font-semibold">
                            Journal des Mises à Jour &amp; Ingénierie
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Blog &amp; Nouveautés
                        </h1>
                        <p className="text-sm sm:text-base text-text-secondary">
                            Retrouvez ici les annonces de fonctionnalités, les retours d&apos;expérience pédagogiques et les nouveautés de Kompas.
                        </p>
                    </header>

                    {/* Articles List */}
                    <div className="space-y-6">
                        <article className="card-editorial rounded-3xl bg-surface-card border border-border p-6 sm:p-8 space-y-4 hover:border-accent-yellow/50 transition-all shadow-md group">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-yellow/15 border border-accent-yellow/30 text-accent-yellow font-mono text-xs font-semibold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    NOUVEAUTÉ JUILLET 2026
                                </span>
                                <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Juillet 2026
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        6 min
                                    </span>
                                </div>
                            </div>

                            <Link href="/blog/simulateur-examen-cctl" className="block space-y-2">
                                <h2 className="text-xl sm:text-2xl font-serif text-text-primary group-hover:text-accent-yellow transition-colors">
                                    Dans les coulisses du Simulateur d&apos;Examen CCTL : réviser sous tension réelle.
                                </h2>
                                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                    Découvrez comment nous avons conçu le nouveau banc d&apos;essai chronométré pour les épreuves de Contrôle Continu au CESI : mode pression, analyse de code syntaxé, Coach IA explicatif et générateur d&apos;examens sur-mesure.
                                </p>
                            </Link>

                            <div className="pt-2">
                                <Link
                                    href="/blog/simulateur-examen-cctl"
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-accent-yellow group-hover:translate-x-1 transition-transform"
                                >
                                    <span>Lire l&apos;article complet</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
