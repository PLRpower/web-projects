import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import PrositsClientView from '@/components/prosits/PrositsClientView';
import { getAllProsits } from '@/lib/prosit-store';

export const metadata: Metadata = {
    title: 'Prosits CESI & Études de Cas (Méthode PBL 7 Étapes)',
    description: 'Bibliothèque collaborative de fiches de Prosits pour élèves-ingénieurs du CESI. Problématiques, hypothèses, plans d\'action et méthodologie PBL.',
    alternates: {
        canonical: '/prosits',
    },
    openGraph: {
        title: 'Prosits CESI & Études de Cas (Méthode PBL 7 Étapes) | Kompas CESI',
        description: 'Explorez et préparez vos fiches de Prosits avec l\'aide de l\'intelligence artificielle et la méthode 7 étapes du CESI.',
        url: '/prosits',
    },
};

export default async function PublicPrositsPage() {
    const initialProsits = await getAllProsits();

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

                <PrositsClientView initialProsits={initialProsits} />

                {/* Bottom Callout */}
                <div className="card-editorial rounded-3xl border border-accent-yellow/40 bg-surface p-8 sm:p-10 text-center space-y-5 shadow-2xl relative overflow-hidden">
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
                                Créer mon compte
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

            <Footer />
        </div>
    );
}
