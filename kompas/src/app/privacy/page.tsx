import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Politique de Confidentialité & RGPD | Kompas | CESI',
    description: 'Protection de la vie privée, traitement des données personnelles et conformité RGPD sur la plateforme Kompas | CESI.',
};

export default function PrivacyPage() {
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
                            Règlement Général sur la Protection des Données (RGPD)
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Politique de Confidentialité
                        </h1>
                        <p className="text-sm text-text-secondary">
                            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} • Version 2.0
                        </p>
                        <p className="text-base text-text-secondary leading-relaxed pt-2">
                            La présente Politique de Confidentialité a pour objet d&apos;informer les étudiants et utilisateurs de la plateforme <strong>Kompas | CESI</strong> sur la manière dont leurs données à caractère personnel sont collectées, utilisées, protégées et conservées, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.
                        </p>
                    </header>

                    {/* Content Sections - Clean & Professional Typography */}
                    <div className="space-y-10 text-sm leading-relaxed text-text-secondary">
                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                1. Responsable du Traitement
                            </h2>
                            <p>
                                Le traitement des données est opéré par l&apos;équipe du projet étudiant <strong>Kompas | CESI</strong>, initiative collaborative d&apos;élèves-ingénieurs du groupe CESI.
                            </p>
                            <p>
                                Pour toute demande relative à vos données personnelles ou pour exercer vos droits, vous pouvez nous contacter directement par email à l&apos;adresse : <span className="font-mono text-text-primary">privacy@cesi-kompas.fr</span> ou via les paramètres de votre compte étudiant.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                2. Données Personnelles Collectées
                            </h2>
                            <p>
                                Nous collectons uniquement les données strictement nécessaires au fonctionnement des services pédagogiques et à la personnalisation de votre espace de travail :
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>
                                    <strong className="text-text-primary">Données d&apos;identification :</strong> Adresse email (institutionnelle @viacesi.fr ou personnelle), prénom, nom et mot de passe chiffré.
                                </li>
                                <li>
                                    <strong className="text-text-primary">Données de scolarité :</strong> Campus de rattachement, promotion (A1, A2, A3, A4, A5), modalité de formation (FISE ou FISA apprentissage) et domaine de spécialité.
                                </li>
                                <li>
                                    <strong className="text-text-primary">Données de progression :</strong> Historique des simulations d&apos;examens CCTL passées, scores obtenus, taux de réussite par domaine, fiches de révision et decks de flashcards créés.
                                </li>
                                <li>
                                    <strong className="text-text-primary">Contenus déposés :</strong> Fichiers PDF d&apos;examens passés, fiches de Prosits et livrables de projets que vous choisissez de téléverser et/ou publier.
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                3. Finalités &amp; Bases Légales du Traitement
                            </h2>
                            <p>
                                Vos données personnelles sont traitées pour les finalités suivantes :
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>
                                    <strong className="text-text-primary">Fourniture du service :</strong> Création et gestion de votre compte, accès au simulateur d&apos;examens, génération de trames de Prosits et mémorisation active. (Base légale : Exécution du service).
                                </li>
                                <li>
                                    <strong className="text-text-primary">Amélioration pédagogique :</strong> Recommandation d&apos;annales et de fiches ciblées en fonction de vos points faibles identifiés lors des QCMs. (Base légale : Intérêt légitime).
                                </li>
                                <li>
                                    <strong className="text-text-primary">Sécurité de la plateforme :</strong> Prévention des abus, sécurisation des accès et détection des comportements frauduleux. (Base légale : Obligation légale et intérêt légitime).
                                </li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                4. Politique d&apos;Anonymisation des Examens &amp; Livrables
                            </h2>
                            <p>
                                Dans le cadre du partage collaboratif d&apos;annales CCTL et de livrables de projets, notre moteur d&apos;extraction traite automatiquement les documents pour supprimer ou masquer toute information nominative non désirée.
                            </p>
                            <p>
                                Lors de la publication d&apos;un document, chaque utilisateur a le choix explicite de publier sous son pseudonyme étudiant ou sous la mention <em>&quot;Élève Anonyme&quot;</em>. Aucun identifiant personnel ou adresse email n&apos;est divulgué publiquement.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                5. Sécurité, Hébergement &amp; Sous-traitants
                            </h2>
                            <p>
                                Vos données sont stockées au sein de l&apos;Union Européenne ou auprès de prestataires certifiés garantissant un niveau de protection adéquat :
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>
                                    <strong className="text-text-primary">Base de données &amp; Authentification :</strong> Supabase (chiffrement au repos AES-256 et en transit TLS 1.3).
                                </li>
                                <li>
                                    <strong className="text-text-primary">Hébergement applicatif :</strong> Infrastructure Cloud haute sécurité avec pare-feu WAF et sauvegardes chiffrées quotidiennes.
                                </li>
                            </ul>
                            <p>
                                Nous ne vendons, ne louons et ne commercialisons aucune donnée personnelle à des régies publicitaires ou tiers commerciaux.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                6. Durée de Conservation des Données
                            </h2>
                            <p>
                                Vos données de compte et de progression sont conservées pendant toute la durée de votre scolarité active sur la plateforme, et supprimées automatiquement après 24 mois d&apos;inactivité consécutive, sauf demande expresse de suppression anticipée de votre part.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                7. Vos Droits &amp; Modalités d&apos;Exercice
                            </h2>
                            <p>
                                Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants concernant vos données personnelles :
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li><strong>Droit d&apos;accès :</strong> Obtenir une copie intégrale des données vous concernant.</li>
                                <li><strong>Droit de rectification :</strong> Corriger vos informations directement depuis votre profil.</li>
                                <li><strong>Droit à l&apos;effacement (droit à l&apos;oubli) :</strong> Demander la suppression définitive de votre compte et de toutes vos données associées.</li>
                                <li><strong>Droit à la portabilité :</strong> Télécharger vos données dans un format structuré et lisible par machine (.JSON).</li>
                                <li><strong>Droit d&apos;opposition :</strong> Vous opposer au traitement de certaines données non essentielles.</li>
                            </ul>
                            <p className="pt-2">
                                Vous pouvez exercer ces droits à tout moment depuis la page <strong>Paramètres &gt; Données &amp; Confidentialité</strong> ou par simple message à notre support.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section className="space-y-3 pt-6 border-t border-border/60">
                            <h2 className="text-xl sm:text-2xl font-normal font-serif text-text-primary">
                                8. Avertissement &amp; Non-Affiliation
                            </h2>
                            <p>
                                <strong>Kompas | CESI</strong> est une plateforme étudiante indépendante développée dans un but d&apos;entraide, d&apos;apprentissage collaboratif et de révision des examens. Elle n&apos;est pas affiliée, sponsorisée ou gérée de manière officielle par la direction générale du groupe CESI.
                            </p>
                        </section>
                    </div>

                    {/* Bottom Action */}
                    <footer className="pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-text-primary">Une question sur vos données ?</p>
                            <p className="text-xs text-text-secondary">Gérez vos préférences de compte en toute autonomie.</p>
                        </div>
                        <Link href="/dashboard/settings">
                            <Button variant="outline" size="sm" className="text-xs">
                                Accéder aux paramètres du compte
                            </Button>
                        </Link>
                    </footer>
                </article>
            </main>

            <Footer />
        </div>
    );
}
