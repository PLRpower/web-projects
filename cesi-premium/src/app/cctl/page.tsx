import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CCTLClientView from '@/components/cctl/CCTLClientView';
import { getAllPublishedCCTLs } from '@/lib/cctl-store';

export const metadata: Metadata = {
    title: 'Annales & Épreuves CCTL Corrigées (A1 à A5)',
    description: 'Bibliothèque complète d\'annales d\'examens et QCMs CCTL réels pour les étudiants du CESI. Filtrez par promo (A1, A2, A3, A4, A5), spécialité et année.',
    alternates: {
        canonical: '/cctl',
    },
    openGraph: {
        title: 'Annales & Épreuves CCTL Corrigées (A1 à A5) | Kompas CESI',
        description: 'Entraînez-vous sur les vrais examens CCTL du CESI avec corrigés détaillés et simulateur chronométré.',
        url: '/cctl',
    },
};

export default async function PublicCCTLPage() {
    const initialCctls = await getAllPublishedCCTLs();

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

                <CCTLClientView initialCctls={initialCctls} />
            </main>

            <Footer />
        </div>
    );
}
