import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import LivrablesClientView from '@/components/livrables/LivrablesClientView';
import { getAllLivrables } from '@/lib/livrable-store';

export const metadata: Metadata = {
    title: 'Livrables & Dossiers Techniques d\'Ingénierie CESI (DAT, CDC, BDD, Audits)',
    description: 'Consultez les dossiers d\'architecture technique (DAT), cahiers des charges (CDC), diaporamas de soutenance et rapports validés par les élèves-ingénieurs du CESI.',
    alternates: {
        canonical: '/livrables',
    },
    openGraph: {
        title: 'Livrables & Dossiers Techniques d\'Ingénierie CESI | Kompas CESI',
        description: 'Téléchargez les modèles de livrables, DAT, CDC et diaporamas de soutenance pour valider vos projets d\'ingénierie au CESI.',
        url: '/livrables',
    },
};

export default async function PublicLivrablesPage() {
    const initialLivrables = await getAllLivrables();

    return (
        <div className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 pt-28 pb-24 flex-1 space-y-10 max-w-7xl">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-6xl font-normal font-serif text-text-primary tracking-tight">
                        Livrables <span className="italic font-normal">CESI</span>
                    </h1>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                        Accédez aux dossiers d&apos;architecture technique (DAT), cahiers des charges (CDC), rapports d&apos;audit, schémas de BDD et diaporamas de soutenance ayant validé les blocs d&apos;ingénierie.
                    </p>
                </div>

                <LivrablesClientView initialLivrables={initialLivrables} />

                {/* Bottom Callout Banner */}
                <div className="card-editorial rounded-3xl border border-accent-yellow/30 bg-surface p-8 sm:p-10 text-center space-y-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-millimeter opacity-25 pointer-events-none" />
                    <div className="space-y-2 max-w-xl mx-auto relative z-10">
                        <span className="text-3xl">📁</span>
                        <h2 className="text-2xl sm:text-3xl font-normal font-serif text-text-primary">
                            Partagez vos livrables &amp; accédez aux dossiers d&apos;ingénierie
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                            Connectez-vous pour télécharger les dossiers complets et échanger vos retours d&apos;expériences avec toute la promo.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
                        <Link href="/register">
                            <Button variant="premium" size="lg" className="shadow-xl shadow-accent-yellow/20 font-bold">
                                Créer mon compte étudiant CESI
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
