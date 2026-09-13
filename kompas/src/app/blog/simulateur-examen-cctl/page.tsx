import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { InteractiveSimulatorDemo } from '@/components/blog/InteractiveSimulatorDemo';
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Sparkles,
    Bot,
    Zap,
    BookOpen,
    Code2,
    Calendar,
    User,
    Compass
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Nouveauté Juillet 2026 : Le Simulateur d\'Examen CCTL Nouvelle Génération | Kompas CESI',
    description: 'Découvrez les coulisses de la conception du Simulateur d\'Examen CCTL sur Kompas : Mode Pression Chronométré, Coach IA interactif, Générateur d\'épreuves et barème officiel CESI.',
    openGraph: {
        title: 'Nouveauté Juillet 2026 : Le Simulateur d\'Examen CCTL | Kompas CESI',
        description: 'Entraînez-vous dans les conditions réelles d\'évaluation avec chronomètre, code syntaxé et débriefing par Coach IA.',
        url: '/blog/simulateur-examen-cctl',
        type: 'article',
    },
};

export default function BlogSimulateurCCTLPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-text-primary">
            <Navbar />

            <main className="flex-1 pt-28 pb-24">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
                    {/* Navigation Back */}
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-accent-yellow transition-colors group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span>Retour à l&apos;accueil</span>
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="space-y-6 pb-8 border-b border-border">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-yellow/15 border border-accent-yellow/30 text-accent-yellow font-mono text-xs font-semibold">
                                <Sparkles className="w-3.5 h-3.5" />
                                NOUVEAUTÉ JUILLET 2026
                            </span>
                            <span className="text-xs font-mono text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
                                Version 2.4 • Module CCTL
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal font-serif text-text-primary tracking-tight leading-[1.12]">
                            Dans les coulisses du <span className="italic">Simulateur d&apos;Examen CCTL</span> : réviser sous tension réelle.
                        </h1>

                        {/* Author & Meta */}
                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-text-secondary font-mono border-t border-border/50">
                            <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-accent-yellow" />
                                <span>Équipe Produit &amp; R&amp;D Kompas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-text-muted" />
                                <span>Juillet 2026 (Mis à jour Août 2026)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-text-muted" />
                                <span>Lecture : ~6 min</span>
                            </div>
                        </div>

                        {/* Executive Summary Card */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-surface/70 border border-border space-y-3">
                            <div className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                                <Compass className="w-4 h-4 text-accent-yellow" />
                                <span>Ce qu&apos;il faut retenir en un coup d&apos;œil :</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Le <strong>Simulateur d&apos;Examen CCTL</strong> est notre réponse au stress des épreuves de Contrôle Continu au CESI. Il combine un <strong>moteur d&apos;évaluation chronométré</strong> calqué sur l&apos;interface officielle, un <strong>Coach IA conversationnel</strong> capable d&apos;expliquer chaque piège à froid, et un <strong>générateur d&apos;épreuves inédites</strong> à partir de vos supports de cours.
                            </p>
                        </div>
                    </header>

                    {/* Section 1: La Genèse */}
                    <section className="space-y-6 text-text-secondary leading-relaxed">
                        <div className="space-y-2">
                            <div className="font-mono text-xs text-accent-yellow uppercase tracking-wider font-semibold">
                                01. La Genèse du Projet
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-normal font-serif text-text-primary">
                                Pourquoi le CCTL au CESI nécessitait un renouveau radical
                            </h2>
                        </div>

                        <p className="text-sm sm:text-base">
                            Pour tout élève-ingénieur du CESI — que l&apos;on soit en cycle préparatoire (A1/A2) ou en cycle ingénieur (A3/A4/A5) — le <strong>CCTL (Contrôle Continu par Test en Ligne)</strong> est une étape décisive. Souvent programmé en fin de bloc thématique, il sanctionne plusieurs semaines de Problem-Based Learning (Prosits) et de projets techniques.
                        </p>

                        <p className="text-sm sm:text-base">
                            Pourtant, la préparation à ces examens souffrait depuis des années de trois écueils majeurs :
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <h3 className="text-sm font-semibold text-text-primary">
                                    Annales statiques &amp; dispersées
                                </h3>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Captures d&apos;écran floues sur Discord ou PDF incomplets sans aucune correction certifiée ni explications logiques.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                                <div className="w-8 h-8 rounded-xl bg-accent-yellow/10 text-accent-yellow flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <h3 className="text-sm font-semibold text-text-primary">
                                    L&apos;absence de gestion du temps
                                </h3>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Réviser sans chronomètre donne une fausse confiance. En situation réelle (1h30 pour 30 questions denses), la panique s&apos;installe vite.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <h3 className="text-sm font-semibold text-text-primary">
                                    Le syndrome du &quot;Vrai / Faux&quot; muet
                                </h3>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Savoir qu&apos;on a eu tort ne suffit pas. Sans explication du distracteur, on reproduit la même erreur à l&apos;évaluation suivante.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Comment ça a été conçu */}
                    <section className="space-y-8 text-text-secondary leading-relaxed pt-6 border-t border-border">
                        <div className="space-y-2">
                            <div className="font-mono text-xs text-accent-yellow uppercase tracking-wider font-semibold">
                                02. Architecture &amp; Fonctionnalités
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-normal font-serif text-text-primary">
                                Comment le simulateur a été pensé et conçu
                            </h2>
                        </div>

                        <p className="text-sm sm:text-base">
                            Nous avons développé le simulateur avec une obsession : <strong>reproduire fidèlement la pression du direct tout en maximisant la rétention mémorielle à long terme</strong>.
                        </p>

                        {/* Feature Deep Dive Grid */}
                        <div className="space-y-6">
                            {/* Feature 1 */}
                            <div className="p-6 rounded-3xl bg-surface-card border border-border space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-yellow/15 text-accent-yellow flex items-center justify-center">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-text-primary">
                                            1. Mode Pression Examen &amp; Chronomètre Intelligent
                                        </h3>
                                        <p className="text-xs text-text-muted">
                                            Interface sans distraction et gestion adaptative du temps restant
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Le simulateur isole l&apos;étudiant dans un mode d&apos;examen immersif. Le minuteur dynamique s&apos;adapte à la volumétrie de l&apos;épreuve (environ 2 minutes par question ou durée personnalisée). Une barre de navigation latérale permet de repérer en un clin d&apos;œil les questions non répondues ou marquées pour relecture avant le décompte final.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-6 rounded-3xl bg-surface-card border border-border space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                                        <Code2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-text-primary">
                                            2. Moteur Multi-Formats &amp; Blocs de Code Syntaxés
                                        </h3>
                                        <p className="text-xs text-text-muted">
                                            QCM unique, choix multiple à points partiels, appariement et analyse de scripts
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Les examens d&apos;ingénierie ne sont pas de simples QCM textuels. Notre moteur gère les questions d&apos;analyse de snippets de code (TypeScript, Python, C/C++, SQL, Assembleur, Dockerfile) avec coloration syntaxique haute précision, ainsi que les questions d&apos;appariement de définitions et calculs numériques.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-6 rounded-3xl bg-surface-card border border-border space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
                                        <Bot className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-text-primary">
                                            3. Coach IA Débriefing &amp; Dialogue Pédagogique
                                        </h3>
                                        <p className="text-xs text-text-muted">
                                            Comprendre la racine de l&apos;erreur sans jugement
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Dès la soumission de l&apos;épreuve, l&apos;étudiant accède au <strong>Coach IA</strong>. Pour chaque réponse manquée, l&apos;IA explicite la règle d&apos;ingénierie sous-jacente, pourquoi le distracteur choisi était un piège classique, et ouvre un fil de discussion en direct pour répondre à toutes les questions complémentaires.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="p-6 rounded-3xl bg-surface-card border border-border space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-text-primary">
                                            4. Générateur d&apos;Examens Blancs par Ingestion PDF
                                        </h3>
                                        <p className="text-xs text-text-muted">
                                            Transformez vos cours et diaporamas en épreuves officielles en 10 secondes
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    Vous n&apos;avez pas assez d&apos;annales pour votre matière ? Le générateur IA intégré ingère vos fiches de révision, vos diapos de cours ou vos sujets d&apos;entraînement pour forger un CCTL complet et inédit, respectant scrupuleusement la difficulté du CESI.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Interactive Demo */}
                    <section className="space-y-6 pt-6 border-t border-border">
                        <div className="space-y-2 text-center max-w-2xl mx-auto">
                            <div className="font-mono text-xs text-accent-yellow uppercase tracking-wider font-semibold">
                                03. À quoi ça ressemble en pratique ?
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-normal font-serif text-text-primary">
                                Testez le simulateur directement ici
                            </h2>
                            <p className="text-xs sm:text-sm text-text-secondary">
                                Découvrez l&apos;ergonomie, la syntaxe de code et le débriefing immédiat du Coach IA sur cette question type d&apos;A3 Informatique.
                            </p>
                        </div>

                        {/* Embedded Client Interactive Component */}
                        <div className="pt-2">
                            <InteractiveSimulatorDemo />
                        </div>
                    </section>

                    {/* Section 4: Design System & UX Philosophy */}
                    <section className="space-y-6 text-text-secondary leading-relaxed pt-6 border-t border-border">
                        <div className="space-y-2">
                            <div className="font-mono text-xs text-accent-yellow uppercase tracking-wider font-semibold">
                                04. Design &amp; Expérience Utilisateur
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-normal font-serif text-text-primary">
                                La philosophie &quot;Engineering Blueprint&quot;
                            </h2>
                        </div>

                        <p className="text-sm sm:text-base">
                            Visuellement, nous avons rejeté les interfaces de quiz enfantines et bariolées. Un futur ingénieur mérite un environnement de travail sobre, lisible et chirurgical :
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                                <div className="font-mono text-xs text-accent-yellow font-bold">
                                    Typographie &amp; Lisibilité
                                </div>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Combinaison de la police avec empattements <em>Literata</em> pour les énoncés denses et de <em>JetBrains Mono</em> pour les paramètres d&apos;ingénierie et lignes de code.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                                <div className="font-mono text-xs text-accent-yellow font-bold">
                                    Mode Sombre &amp; Confort Visuel
                                </div>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Palette Obsidian (#0D0F13) et accents ambrés conçus pour limiter la fatigue oculaire lors des sessions de révision tardives précédant les partiels.
                                </p>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="pt-4 space-y-3">
                            <h3 className="text-base font-semibold text-text-primary">
                                Tableau Comparatif des Méthodes
                            </h3>

                            <div className="overflow-x-auto rounded-2xl border border-border">
                                <table className="w-full text-left text-xs font-sans">
                                    <thead className="bg-surface border-b border-border text-text-primary font-mono font-semibold">
                                        <tr>
                                            <th className="p-3.5">Critère</th>
                                            <th className="p-3.5 text-text-muted">Révision PDF Traditionnelle</th>
                                            <th className="p-3.5 text-accent-yellow bg-accent-yellow/5">Simulateur Kompas CCTL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        <tr>
                                            <td className="p-3.5 font-medium text-text-primary">Pression temporelle</td>
                                            <td className="p-3.5 text-text-muted">❌ Aucune (lecture passive)</td>
                                            <td className="p-3.5 font-semibold text-emerald-500 bg-accent-yellow/5">✅ Chronomètre examen en direct</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-text-primary">Qualité des corrigés</td>
                                            <td className="p-3.5 text-text-muted">❌ Souvent sans justification</td>
                                            <td className="p-3.5 font-semibold text-emerald-500 bg-accent-yellow/5">✅ Analyse détaillée + Coach IA</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-text-primary">Renouvellement des questions</td>
                                            <td className="p-3.5 text-text-muted">❌ Limité aux annales existantes</td>
                                            <td className="p-3.5 font-semibold text-emerald-500 bg-accent-yellow/5">✅ Générateur IA de nouveaux sujets</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-medium text-text-primary">Suivi de progression</td>
                                            <td className="p-3.5 text-text-muted">❌ Aucun suivi mesurable</td>
                                            <td className="p-3.5 font-semibold text-emerald-500 bg-accent-yellow/5">✅ Radar de compétences &amp; Historique</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Call to Action Banner */}
                    <section className="p-8 sm:p-10 rounded-3xl bg-surface-card border border-accent-yellow/40 shadow-2xl relative overflow-hidden space-y-6 text-center">
                        <div className="absolute inset-0 bg-accent-yellow/5 pointer-events-none" />

                        <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
                            <span className="px-3.5 py-1.5 rounded-full bg-accent-yellow text-black font-mono font-bold text-xs uppercase tracking-wider">
                                Prêt à tester vos connaissances ?
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-normal font-serif text-text-primary">
                                Lancez votre première épreuve blanche dès maintenant
                            </h2>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                Accédez à des centaines d&apos;annales officielles classées par promo ou générez votre propre examen sur mesure en quelques clics.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
                            <Link href="/cctl">
                                <Button variant="premium" size="lg" className="gap-2 shadow-lg">
                                    <BookOpen className="w-4 h-4" />
                                    <span>Explorer les Annales CCTL</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>

                            <Link href="/dashboard/cctl/generateur">
                                <Button variant="outline" size="lg" className="gap-2 border-border hover:border-accent-yellow">
                                    <Sparkles className="w-4 h-4 text-accent-yellow" />
                                    <span>Générer un CCTL avec l&apos;IA</span>
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* Footer Nav inside Article */}
                    <footer className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-text-secondary">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 hover:text-accent-yellow transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Retour à la page d&apos;accueil</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/cctl"
                                className="hover:text-accent-yellow transition-colors"
                            >
                                Bibliothèque CCTL
                            </Link>
                            <span>•</span>
                            <Link
                                href="/prosits"
                                className="hover:text-accent-yellow transition-colors"
                            >
                                Prosits
                            </Link>
                            <span>•</span>
                            <Link
                                href="/livrables"
                                className="hover:text-accent-yellow transition-colors"
                            >
                                Livrables
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>

            <Footer />
        </div>
    );
}
