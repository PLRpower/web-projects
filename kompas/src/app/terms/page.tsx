import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Conditions Générales d\'Utilisation & Charte Éthique | Kompas | CESI',
    description: 'Conditions générales d\'utilisation, charte d\'honneur étudiante et règles de bonne conduite sur la plateforme Kompas | CESI.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <article className="max-w-3xl mx-auto px-6 space-y-12">
                    {/* Back link */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour à l&apos;accueil</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <header className="space-y-4 pb-8 border-b border-border">
                        <div className="font-mono text-xs text-accent-yellow uppercase tracking-wider font-semibold">
                            Cadre Réglementaire &amp; Charte Étudiante
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Conditions Générales d&apos;Utilisation
                        </h1>
                        <p className="text-sm text-text-secondary">
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} • Version 2.0
                        </p>
                        <p className="text-base text-text-secondary leading-relaxed pt-2">
                            Les présentes Conditions Générales d&apos;Utilisation (CGU) et la Charte Éthique définissent les droits, devoirs et règles de conduite applicables à tout membre ou visiteur de la plateforme <strong>Kompas | CESI</strong>.
                        </p>
                    </header>

                    {/* Content Sections */}
                    <div className="space-y-10 text-sm leading-relaxed text-text-secondary">
                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                1. Objet &amp; Nature du Service
                            </h2>
                            <p>
                                Kompas | CESI est une plateforme pédagogique et communautaire conçue pour accompagner les élèves-ingénieurs dans leurs apprentissages, la préparation des Contrôles Continus par Test en Ligne (CCTL), la méthodologie Problem-Based Learning (Prosits) et la structuration des livrables de projets de blocs.
                            </p>
                            <p>
                                L&apos;accès à la plateforme nécessite l&apos;acceptation sans réserve des présentes conditions par l&apos;utilisateur lors de son inscription.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                2. Charte d&apos;Honneur &amp; Probité Académique
                            </h2>
                            <p>
                                L&apos;ensemble des ressources, annales et simulateurs mis à disposition ont une vocation exclusive de <strong>travail personnel, d&apos;auto-évaluation et de révision formative</strong> en dehors des heures d&apos;évaluation officielle.
                            </p>
                            <p>
                                Il est formellement interdit d&apos;utiliser Kompas | CESI ou toute assistance automatisée en temps réel pendant le déroulement d&apos;une épreuve surveillée, d&apos;un examen officiel ou d&apos;une évaluation certificative. Tout manquement est contraire au code d&apos;éthique de l&apos;ingénieur et relève de la responsabilité exclusive de l&apos;apprenant.
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                3. Règles de Partage des Annales &amp; des Livrables
                            </h2>
                            <p>
                                Tout utilisateur choisissant de téléverser et partager un sujet de CCTL, une fiche de Prosit ou un livrable de projet s&apos;engage formellement à :
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>
                                    Ne déposer que des sujets d&apos;examens passés dont la session d&apos;évaluation est officiellement close.
                                </li>
                                <li>
                                    Vérifier l&apos;absence de données nominatives sensibles relatives aux intervenants ou aux tiers sans leur consentement.
                                </li>
                                <li>
                                    Respecter la propriété intellectuelle dans le cadre strict de l&apos;exception de révision pédagogique et du partage d&apos;expériences entre pairs.
                                </li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                4. Comptes Utilisateurs &amp; Sécurité des Identifiants
                            </h2>
                            <p>
                                Chaque membre est responsable de la confidentialité de ses identifiants de connexion et des actions effectuées depuis son compte. L&apos;utilisation d&apos;une adresse email valide (@viacesi.fr ou personnelle) est requise pour certifier l&apos;appartenance à la communauté.
                            </p>
                            <p>
                                En cas d&apos;utilisation frauduleuse ou de compromission de mot de passe, l&apos;utilisateur est invité à réinitialiser immédiatement son mot de passe depuis la page de récupération dédiée.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                5. Responsabilité &amp; Exactitude des Contenus
                            </h2>
                            <p>
                                Les corrigés, explications méthodologiques, trames de documents et questions générées par intelligence artificielle sont fournis à titre indicatif pour stimuler la réflexion critique et structurer le travail en équipe.
                            </p>
                            <p>
                                Kompas | CESI ne saurait être tenu responsable des résultats académiques obtenus par les utilisateurs, ces derniers étant invités à confronter systématiquement leurs connaissances avec les supports de cours et les recommandations de leurs tuteurs pédagogiques.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                6. Modification des Conditions &amp; Résiliation
                            </h2>
                            <p>
                                Nous nous réservons le droit d&apos;adapter les présentes CGU pour refléter les évolutions des fonctionnalités de la plateforme ou du cadre légal. Toute modification substantielle sera signalée aux membres actifs.
                            </p>
                            <p>
                                Tout utilisateur peut résilier son compte et supprimer l&apos;intégralité de ses données à tout moment depuis ses paramètres de profil.
                            </p>
                        </section>
                    </div>

                    {/* Bottom Action */}
                    <footer className="pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-text-primary">Rejoindre la communauté étudiante</p>
                            <p className="text-xs text-text-secondary">Explorez les annales et livrables dès aujourd&apos;hui.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/cctl">
                                <Button variant="outline" size="sm" className="text-xs">
                                    Voir les CCTL
                                </Button>
                            </Link>
                            <Link href="/livrables">
                                <Button variant="premium" size="sm" className="text-xs font-bold">
                                    Consulter les Livrables
                                </Button>
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>

            <Footer />
        </div>
    );
}
