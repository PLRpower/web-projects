import { PublishedCCTLEntry } from '@/lib/cctl-store';
import { CCTLExam, CCTLQuestion } from '@/types/cctl';

// Helper to create questions
function createQ(
    id: string,
    num: number,
    prompt: string,
    choices: { id: string; text: string; isExpected: boolean }[],
    options?: {
        isMultiple?: boolean;
        codeSnippet?: string;
        codeLanguage?: string;
        explanation?: string;
        category?: string;
        discordanceCount?: number;
    }
): CCTLQuestion {
    const isMultiple = options?.isMultiple ?? choices.filter(c => c.isExpected).length > 1;
    const expectedChoices = choices.filter(c => c.isExpected);

    return {
        id,
        number: num,
        type: isMultiple ? 'multiple_choice' : 'single_choice',
        typeLabel: isMultiple ? 'Question à réponses multiples' : 'Question à réponse unique',
        status: 'correct',
        discordanceCount: options?.discordanceCount ?? 0,
        prompt,
        codeSnippet: options?.codeSnippet,
        codeLanguage: options?.codeLanguage || (options?.codeSnippet ? 'typescript' : undefined),
        choices: choices.map(c => ({
            id: c.id,
            text: c.text,
            isExpected: c.isExpected,
            isStudentAnswer: c.isExpected,
            isDiscordant: false
        })),
        correctAnswersCount: expectedChoices.length,
        explanation: options?.explanation || 'Bonne réponse attendue selon le référentiel d\'évaluation CESI.',
        category: options?.category
    };
}

// 1. FISA INFO A3 - DEV WEB & ARCHITECTURE (20 questions from original PDF)
export const CCTL_FISA_A3_DEV_WEB: PublishedCCTLEntry = {
    id: 'cctl-a3-dev-web-2025',
    title: 'FISA Info A3 — Sécurité et techniques de développement web - I',
    subject: 'Sécurité et techniques de développement web - I',
    promo: 'A3',
    specialty: 'FISA Info',
    track: 'FISA',
    year: '2025',
    domain: 'Développement Web',
    totalQuestions: 20,
    difficulty: 'Examen Officiel',
    durationMinutes: 45,
    authorName: 'Enseignant CESI',
    isAnonymous: false,
    publishedAt: '2025-11-15T09:00:00.000Z',
    viewsCount: 234,
    downloadsCount: 142,
    hasPdf: true,
    pdfFileName: 'CCTL_FISA_A3_Securite_Dev_Web_2025.pdf',
    typesSummary: ['QCM Unique', 'QCM Multiples', 'React 19', 'Express.js', 'OAuth 2.0 / JWT'],
    exam: {
        id: 'cctl-a3-dev-web-2025',
        title: 'FISA Info A3 — Sécurité et techniques de développement web - I',
        studentName: 'Élève-Ingénieur FISA A3',
        promo: 'A3',
        specialty: 'FISA Info',
        track: 'FISA',
        domain: 'Développement Web',
        subject: 'Sécurité et techniques de développement web - I',
        description: 'Examen complet portant sur les architectures monolithiques vs microservices, APIs REST Node.js/Express, cycle de vie React & hooks, et sécurité OAuth 2.0 / JWT.',
        difficulty: 'Examen Officiel',
        durationMinutes: 45,
        totalQuestions: 20,
        questions: [
            createQ(
                'fisa-a3-web-q1',
                1,
                'Dans une architecture monolithique, quel est le principal inconvénient lors du passage à l\'échelle (scaling) ?',
                [
                    { id: 'A', text: 'Chaque module doit être déployé sur une infrastructure distincte.', isExpected: false },
                    { id: 'B', text: 'Toute l\'application doit être répliquée pour absorber la charge.', isExpected: true },
                    { id: 'C', text: 'Les échanges internes nécessitent des appels réseau systématiques.', isExpected: false },
                    { id: 'D', text: 'Les composants utilisent des bases de données indépendantes.', isExpected: false }
                ],
                { explanation: 'Dans un monolithe, toutes les couches et modules partagent le même binaire/processus. Pour augmenter la capacité, on doit dupliquer l\'intégralité du monolithe même si un seul module est sous forte charge.' }
            ),
            createQ(
                'fisa-a3-web-q2',
                2,
                'Parmi les caractéristiques suivantes, lesquelles sont des avantages reconnus d\'une architecture microservices ? (Plusieurs réponses attendues)',
                [
                    { id: 'A', text: 'Déploiement indépendant de chaque service.', isExpected: true },
                    { id: 'B', text: 'Réduction systématique de la latence réseau entre composants.', isExpected: false },
                    { id: 'C', text: 'Possibilité d\'utiliser des technologies différentes pour chaque service.', isExpected: true },
                    { id: 'D', text: 'Complexité opérationnelle réduite par rapport à un monolithe.', isExpected: false },
                    { id: 'E', text: 'Isolation des pannes : la défaillance d\'un service n\'entraîne pas obligatoirement l\'arrêt de l\'ensemble.', isExpected: true }
                ],
                { isMultiple: true, explanation: 'Les microservices permettent des déploiements autonomes, une stack technologique polyglotte et une meilleure résilience/isolation des pannes. En revanche, ils augmentent la latence réseau et la complexité opérationnelle.' }
            ),
            createQ(
                'fisa-a3-web-q3',
                3,
                'Qu\'est-ce qu\'une architecture orientée services (SOA) par rapport aux microservices ?',
                [
                    { id: 'A', text: 'Les services sont généralement plus spécialisés et autonomes.', isExpected: false },
                    { id: 'B', text: 'Les échanges reposent souvent sur un intermédiaire centralisé (ex: ESB - Enterprise Service Bus).', isExpected: true },
                    { id: 'C', text: 'Les communications utilisent exclusivement le protocole HTTP.', isExpected: false },
                    { id: 'D', text: 'Les déploiements nécessitent un environnement partagé unique.', isExpected: false }
                ],
                { explanation: 'La SOA traditionnelle s\'articule souvent autour d\'un Enterprise Service Bus (ESB) central qui gère le routage et les transformations, là où les microservices favorisent des "smart endpoints and dumb pipes".' }
            ),
            createQ(
                'fisa-a3-web-q4',
                4,
                'Lors de la représentation d\'une architecture logicielle, quels diagrammes UML sont couramment utilisés pour décrire les composants et leurs interactions temporelles ?',
                [
                    { id: 'A', text: 'Diagramme de composants UML.', isExpected: true },
                    { id: 'B', text: 'Diagramme de Gantt.', isExpected: false },
                    { id: 'C', text: 'Diagramme de contexte.', isExpected: true },
                    { id: 'D', text: 'Diagramme de séquence UML.', isExpected: true },
                    { id: 'E', text: 'Diagramme de classes UML pour modéliser les flux réseau.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'Le diagramme de composants montre la structure statique modulaire, le diagramme de séquence détaille les échanges chronologiques, et le diagramme de contexte situe le système dans son environnement.' }
            ),
            createQ(
                'fisa-a3-web-q5',
                5,
                'La scalabilité horizontale (Scale-Out) consiste à :',
                [
                    { id: 'A', text: 'Augmenter les ressources matérielles (CPU, RAM) d\'une instance existante.', isExpected: false },
                    { id: 'B', text: 'Répartir la charge entre plusieurs instances d\'un même service via un Load Balancer.', isExpected: true },
                    { id: 'C', text: 'Réduire les dépendances entre les composants applicatifs.', isExpected: false },
                    { id: 'D', text: 'Optimiser les algorithmes les plus consommateurs en ressources.', isExpected: false }
                ],
                { explanation: 'La scalabilité horizontale consiste à ajouter davantage de serveurs ou de conteneurs pour distribuer la charge, contrairement à la scalabilité verticale (Scale-Up) qui augmente la puissance d\'une seule machine.' }
            ),
            createQ(
                'fisa-a3-web-q6',
                6,
                'Parmi les métriques suivantes, lesquelles sont couramment utilisées pour mesurer la disponibilité et la fiabilité d\'un système ?',
                [
                    { id: 'A', text: 'SLA (Service Level Agreement) exprimé en pourcentage de temps de disponibilité (ex: 99.9%).', isExpected: true },
                    { id: 'B', text: 'MTBF (Mean Time Between Failures) mesurant le temps moyen entre pannes.', isExpected: true },
                    { id: 'C', text: 'Le nombre de lignes de code du service.', isExpected: false },
                    { id: 'D', text: 'MTTR (Mean Time To Repair) mesurant le temps moyen de rétablissement.', isExpected: true },
                    { id: 'E', text: 'La consommation mémoire maximale.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'La disponibilité est calculée à partir du MTBF (temps avant panne) et du MTTR (temps de réparation), encadrée contractuellement par le SLA.' }
            ),
            createQ(
                'fisa-a3-web-q7',
                7,
                'Considérez le code Express.js suivant :\nQuelle bonne pratique REST et code de statut HTTP est violée dans cette route ?',
                [
                    { id: 'A', text: 'La réponse devrait inclure systématiquement un en-tête Cache-Control.', isExpected: false },
                    { id: 'B', text: 'La création d\'une ressource devrait renvoyer le statut HTTP 201 Created.', isExpected: true },
                    { id: 'C', text: 'La route devrait utiliser PUT au lieu de POST pour créer une ressource avec ID généré.', isExpected: false },
                    { id: 'D', text: 'La réponse devrait obligatoirement contenir un identifiant dans l\'en-tête Authorization.', isExpected: false }
                ],
                {
                    codeSnippet: `app.post('/users', async (req, res) => {
  const user = await db.createUser(req.body);
  res.send(user); // Renvoie 200 OK par défaut
});`,
                    codeLanguage: 'javascript',
                    explanation: 'La création réussie d\'une ressource via POST doit renvoyer un statut HTTP 201 (Created), souvent accompagné de l\'en-tête Location vers la nouvelle ressource.'
                }
            ),
            createQ(
                'fisa-a3-web-q8',
                8,
                'Quelles bonnes pratiques sont recommandées pour le déploiement d\'une API REST Node.js en production ?',
                [
                    { id: 'A', text: 'Utiliser un gestionnaire de processus comme PM2 pour assurer le redémarrage automatique en cas de crash.', isExpected: true },
                    { id: 'B', text: 'Désactiver HTTPS pour réduire la latence des connexions.', isExpected: false },
                    { id: 'C', text: 'Mettre en place une gestion centralisée des erreurs (middleware d\'erreur Express à 4 paramètres).', isExpected: true },
                    { id: 'D', text: 'Définir les variables sensibles via des variables d\'environnement (process.env) et non dans le code source.', isExpected: true },
                    { id: 'E', text: 'Activer le mode verbose de débogage en production.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'En production : utilisation de PM2 ou conteneurs Docker, secrets injectés via variables d\'environnement, HTTPS strict et middleware d\'erreur global.' }
            ),
            createQ(
                'fisa-a3-web-q9',
                9,
                'Quel est le rôle du middleware suivant dans une application Express ?',
                [
                    { id: 'A', text: 'Intercepter toutes les requêtes entrantes pour les journaliser.', isExpected: false },
                    { id: 'B', text: 'Gérer les erreurs non capturées remontées via next(err) dans les routes.', isExpected: true },
                    { id: 'C', text: 'Servir des fichiers statiques depuis un répertoire public.', isExpected: false },
                    { id: 'D', text: 'Vérifier l\'authentification de chaque requête.', isExpected: false }
                ],
                {
                    codeSnippet: `app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});`,
                    codeLanguage: 'javascript',
                    explanation: 'Un middleware Express comportant 4 arguments \`(err, req, res, next)\` est automatiquement reconnu comme un gestionnaire d\'erreurs centralisé.'
                }
            ),
            createQ(
                'fisa-a3-web-q10',
                10,
                'Dans React, quel hook permet d\'exécuter un effet de bord (appel API, abonnement) après le rendu d\'un composant fonctionnel, avec nettoyage lors du démontage ?',
                [
                    { id: 'A', text: 'useState', isExpected: false },
                    { id: 'B', text: 'useEffect', isExpected: true },
                    { id: 'C', text: 'useContext', isExpected: false },
                    { id: 'D', text: 'useReducer', isExpected: false }
                ],
                { explanation: '\`useEffect\` permet d\'exécuter des effets secondaires et de retourner une fonction de cleanup (nettoyage) exécutée avant le prochain effet ou au démontage du composant.' }
            ),
            createQ(
                'fisa-a3-web-q11',
                11,
                'Quelles phases font partie du cycle de vie d\'un composant React basé sur les classes ?',
                [
                    { id: 'A', text: 'componentDidMount', isExpected: true },
                    { id: 'B', text: 'componentWillRender', isExpected: false },
                    { id: 'C', text: 'componentDidUpdate', isExpected: true },
                    { id: 'D', text: 'componentWillUnmount', isExpected: true },
                    { id: 'E', text: 'componentFetched', isExpected: false }
                ],
                { isMultiple: true, explanation: 'Les méthodes de cycle de vie officielles sont \`componentDidMount\` (montage), \`componentDidUpdate\` (mise à jour) et \`componentWillUnmount\` (démontage).' }
            ),
            createQ(
                'fisa-a3-web-q12',
                12,
                'Considérez ce composant React :\nQuel est le comportement exact de ce useEffect ?',
                [
                    { id: 'A', text: 'L\'effet s\'exécute uniquement lors du premier montage du composant.', isExpected: false },
                    { id: 'B', text: 'L\'effet s\'exécute après chaque rendu où la valeur de count a changé.', isExpected: true },
                    { id: 'C', text: 'L\'effet s\'exécute après chaque rendu sans exception.', isExpected: false },
                    { id: 'D', text: 'L\'effet ne s\'exécute jamais car le tableau de dépendances est présent.', isExpected: false }
                ],
                {
                    codeSnippet: `const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Compteur : \${count}\`;
}, [count]);`,
                    codeLanguage: 'typescript',
                    explanation: 'La présence du tableau de dépendances \`[count]\` indique à React de n\'exécuter l\'effet que si la valeur de \`count\` a changé entre deux rendus.'
                }
            ),
            createQ(
                'fisa-a3-web-q13',
                13,
                'Quels éléments doivent typiquement figurer dans la modélisation d\'une application frontend (wireframes, maquettes fonctionnelles) ?',
                [
                    { id: 'A', text: 'L\'arborescence des vues/pages et la navigation entre elles.', isExpected: true },
                    { id: 'B', text: 'Les détails d\'implémentation des algorithmes de tri.', isExpected: false },
                    { id: 'C', text: 'Les composants réutilisables et leur hiérarchie.', isExpected: true },
                    { id: 'D', text: 'Les interactions utilisateur (événements, transitions d\'état).', isExpected: true },
                    { id: 'E', text: 'La structure interne du schéma SQL de la base de données.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'La modélisation frontend décrit l\'expérience utilisateur, l\'architecture des composants, l\'arborescence de navigation et les flux d\'interaction.' }
            ),
            createQ(
                'fisa-a3-web-q14',
                14,
                'Dans un flux OAuth 2.0 de type Authorization Code, quel acteur délivre le access_token à l\'application cliente ?',
                [
                    { id: 'A', text: 'Le client OAuth après authentification directe de l\'utilisateur.', isExpected: false },
                    { id: 'B', text: 'Le serveur de ressources (Resource Server) après validation des permissions.', isExpected: false },
                    { id: 'C', text: 'Le serveur d\'autorisation (Authorization Server) après échange du code d\'autorisation.', isExpected: true },
                    { id: 'D', text: 'Le navigateur web après validation du cookie de session.', isExpected: false }
                ],
                { explanation: 'Le serveur d\'autorisation authentifie l\'utilisateur, émet le code d\'autorisation temporaire, puis l\'échange contre le \`access_token\` via un canal sécurisé back-to-back.' }
            ),
            createQ(
                'fisa-a3-web-q15',
                15,
                'Parmi les affirmations suivantes sur les JSON Web Tokens (JWT), lesquelles sont correctes ?',
                [
                    { id: 'A', text: 'Un JWT est composé de trois parties encodées en Base64Url : header, payload et signature.', isExpected: true },
                    { id: 'B', text: 'Le payload d\'un JWT est chiffré par défaut, rendant son contenu illisible sans clé.', isExpected: false },
                    { id: 'C', text: 'La signature permet de vérifier l\'intégrité du token et l\'identité de l\'émetteur.', isExpected: true },
                    { id: 'D', text: 'Il est recommandé de stocker des mots de passe en clair dans le payload.', isExpected: false },
                    { id: 'E', text: 'Un JWT peut avoir une durée de validité définie via le claim standard exp.', isExpected: true }
                ],
                { isMultiple: true, explanation: 'Un JWT standard est signé mais NON chiffré (le payload est du JSON encodé en Base64Url lisible par quiconque). La signature garantit qu\'il n\'a pas été altéré.' }
            ),
            createQ(
                'fisa-a3-web-q16',
                16,
                'Quelle est la différence principale entre les protocoles OAuth 2.0 et OpenID Connect (OIDC) ?',
                [
                    { id: 'A', text: 'OAuth 2.0 est un protocole d\'authentification ; OIDC est un protocole d\'autorisation.', isExpected: false },
                    { id: 'B', text: 'OAuth 2.0 gère l\'autorisation (délégation d\'accès) ; OIDC ajoute une couche d\'authentification (identité avec id_token).', isExpected: true },
                    { id: 'C', text: 'OIDC remplace complètement OAuth 2.0 et n\'utilise aucun token OAuth.', isExpected: false },
                    { id: 'D', text: 'OAuth 2.0 utilise exclusivement des certificats X.509 pour signer les tokens.', isExpected: false }
                ],
                { explanation: 'OAuth 2.0 permet à une application d\'accéder à des ressources au nom d\'un utilisateur (autorisation). OpenID Connect étend OAuth 2.0 en introduisant le jeton d\'identité \`id_token\` pour prouver l\'identité de l\'utilisateur (authentification).' }
            ),
            createQ(
                'fisa-a3-web-q17',
                17,
                'Lors de la mise en place d\'une authentification JWT dans une API Node.js, quelles pratiques sont recommandées ?',
                [
                    { id: 'A', text: 'Signer le token avec un secret fort ou une paire de clés asymétriques (RS256 / EdDSA).', isExpected: true },
                    { id: 'B', text: 'Définir une durée de vie courte pour le access_token et utiliser un refresh_token stocké de façon sécurisée.', isExpected: true },
                    { id: 'C', text: 'Stocker le JWT dans le localStorage accessible à n\'importe quel script XSS tiers.', isExpected: false },
                    { id: 'D', text: 'Vérifier la signature et l\'expiration du token à chaque requête sur une route protégée.', isExpected: true },
                    { id: 'E', text: 'Transmettre le token dans l\'en-tête HTTP Authorization: Bearer <token>.', isExpected: true }
                ],
                { isMultiple: true, explanation: 'Pratiques recommandées : signature asymétrique RS256, access token court (15 min) + refresh token en cookie HttpOnly/Secure, en-tête \`Authorization: Bearer\`.' }
            ),
            createQ(
                'fisa-a3-web-q18',
                18,
                'Dans Redux, quel est le rôle unique d\'un reducer ?',
                [
                    { id: 'A', text: 'Exécuter des requêtes asynchrones et des effets de bord réseau.', isExpected: false },
                    { id: 'B', text: 'Produire un nouvel état immuable à partir de l\'état courant et d\'une action reçue : (state, action) => newState.', isExpected: true },
                    { id: 'C', text: 'Distribuer les actions aux différents composants React.', isExpected: false },
                    { id: 'D', text: 'Synchroniser directement le store avec la base de données.', isExpected: false }
                ],
                { explanation: 'Un reducer Redux est une fonction pure sans effets secondaires qui prend \`(previousState, action)\` et retourne le nouvel état sans muter l\'état existant.' }
            ),
            createQ(
                'fisa-a3-web-q19',
                19,
                'Quels avantages offre l\'utilisation d\'un store centralisé (Redux, Zustand, Pinia) dans une application frontend ?',
                [
                    { id: 'A', text: 'Constituer une source unique de vérité (Single Source of Truth) pour l\'état partagé.', isExpected: true },
                    { id: 'B', text: 'Faciliter le débogage et le suivi des mutations d\'état (Time-Travel Debugging).', isExpected: true },
                    { id: 'C', text: 'Éliminer totalement le besoin de composants avec un état local.', isExpected: false },
                    { id: 'D', text: 'Simplifier le partage d\'état entre composants éloignés sans subir le "prop drilling".', isExpected: true },
                    { id: 'E', text: 'Garantir une synchronisation automatique sans réseau avec la base de données.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'Un store global évite le prop drilling à travers l\'arbre React, unifie l\'état partagé et fournit d\'excellents outils de débogage.' }
            ),
            createQ(
                'fisa-a3-web-q20',
                20,
                'Dans une application React / Next.js utilisant Zustand, à quoi correspond le concept de sélecteur ou de getter dérivé du state ?',
                [
                    { id: 'A', text: 'Des fonctions qui modifient directement le state de manière asynchrone.', isExpected: false },
                    { id: 'B', text: 'Des valeurs calculées dynamiquement à partir du state sans dupliquer les données brutes.', isExpected: true },
                    { id: 'C', text: 'Des middlewares de journalisation HTTP.', isExpected: false },
                    { id: 'D', text: 'Des hooks de routage natif Next.js.', isExpected: false }
                ],
                {
                    codeSnippet: `export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: () => Boolean(get().token),
}));`,
                    codeLanguage: 'typescript',
                    explanation: 'Les sélecteurs ou getters dérivés calculent des informations dérivées (comme \`isAuthenticated\`) à la volée, évitant ainsi la redondance et les désynchronisations d\'état.'
                }
            )
        ],
        stats: {
            correctCount: 20,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 11,
                multiple_choice: 9,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISA_A3_Securite_Dev_Web_2025.pdf',
            totalPages: 10,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 2. FISA INFO A3 - BASES DE DONNEES & SQL AVANCE (16 questions)
export const CCTL_FISA_A3_BDD_SQL: PublishedCCTLEntry = {
    id: 'cctl-fisa-a3-bdd-sql-2025',
    title: 'FISA Info A3 — Bases de Données Relationnelles & Modélisation Avancée',
    subject: 'Bases de Données Relationnelles, Optimisation & Transactions ACID',
    promo: 'A3',
    specialty: 'FISA Info',
    track: 'FISA',
    year: '2025',
    domain: 'Bases de Données & SQL',
    totalQuestions: 16,
    difficulty: 'Examen Officiel',
    durationMinutes: 45,
    authorName: 'Enseignant CESI Informatique',
    isAnonymous: false,
    publishedAt: '2025-10-20T14:00:00.000Z',
    viewsCount: 189,
    downloadsCount: 96,
    hasPdf: true,
    pdfFileName: 'CCTL_FISA_A3_Bases_Donnees_SQL_2025.pdf',
    typesSummary: ['Formes Normales', 'PostgreSQL', 'ACID', 'Index B-Tree', 'Window Functions'],
    exam: {
        id: 'cctl-fisa-a3-bdd-sql-2025',
        title: 'FISA Info A3 — Bases de Données Relationnelles & Modélisation Avancée',
        studentName: 'Élève-Ingénieur FISA A3',
        promo: 'A3',
        specialty: 'FISA Info',
        track: 'FISA',
        domain: 'Bases de Données & SQL',
        subject: 'Bases de Données Relationnelles, Optimisation & Transactions ACID',
        description: 'Examen de synthèse sur la normalisation (1NF à BCNF), les propriétés ACID, les niveaux d\'isolation, l\'optimisation de requêtes avec EXPLAIN ANALYZE et les fonctions de fenêtrage.',
        difficulty: 'Examen Officiel',
        durationMinutes: 45,
        totalQuestions: 16,
        questions: [
            createQ(
                'fisa-a3-bdd-q1',
                1,
                'Pour qu\'une relation soit en Troisième Forme Normale (3NF), quelles conditions doivent impérativement être satisfaites ?',
                [
                    { id: 'A', text: 'Elle doit être en 2NF et aucun attribut non-clé ne doit dépendre d\'un autre attribut non-clé (pas de dépendance transitive).', isExpected: true },
                    { id: 'B', text: 'Elle doit comporter au moins 3 tables reliées par des clés étrangères.', isExpected: false },
                    { id: 'C', text: 'Toutes les colonnes doivent être indexées avec des index B-Tree.', isExpected: false },
                    { id: 'D', text: 'Elle doit refuser l\'usage des valeurs NULL sur l\'ensemble des colonnes.', isExpected: false }
                ],
                { explanation: 'La 3NF exige que la relation soit en 2NF et que chaque attribut non-clé dépende directement et uniquement de la clé primaire (élimination des dépendances transitives X -> Y -> Z).' }
            ),
            createQ(
                'fisa-a3-bdd-q2',
                2,
                'Quelle est la différence fondamentale entre les niveaux d\'isolation READ COMMITTED et REPEATABLE READ dans PostgreSQL ?',
                [
                    { id: 'A', text: 'REPEATABLE READ garantit qu\'une requête SELECT exécutée plusieurs fois dans la même transaction verra exactement les mêmes données (snapshot initial), évitant les Non-Repeatable Reads.', isExpected: true },
                    { id: 'B', text: 'READ COMMITTED verrouille toute la table en écriture pendant toute la transaction.', isExpected: false },
                    { id: 'C', text: 'Il n\'y a aucune différence dans PostgreSQL car MVCC est actif par défaut.', isExpected: false },
                    { id: 'D', text: 'REPEATABLE READ interdit tout INSERT concurrent sur toute la base de données.', isExpected: false }
                ],
                { explanation: 'Sous READ COMMITTED, chaque requête d\'une transaction voit les modifications validées au moment où la requête démarre. Sous REPEATABLE READ, la transaction entière voit un snapshot figé au moment de sa première commande.' }
            ),
            createQ(
                'fisa-a3-bdd-q3',
                3,
                'Dans un index B-Tree composite créé sur les colonnes `(nom, prenom)`, quelle requête tirera le meilleur parti de l\'index ?',
                [
                    { id: 'A', text: 'SELECT * FROM etudiants WHERE nom = \'Dupont\' AND prenom = \'Lucas\';', isExpected: true },
                    { id: 'B', text: 'SELECT * FROM etudiants WHERE prenom = \'Lucas\';', isExpected: false },
                    { id: 'C', text: 'SELECT * FROM etudiants WHERE age = 22;', isExpected: false },
                    { id: 'D', text: 'SELECT * FROM etudiants WHERE prenom LIKE \'%cas\';', isExpected: false }
                ],
                {
                    codeSnippet: `CREATE INDEX idx_etudiants_nom_prenom ON etudiants (nom, prenom);`,
                    codeLanguage: 'sql',
                    explanation: 'Un index composite B-Tree est ordonné selon la première colonne de gauche à droite (Leftmost Prefix). Une recherche sur \`nom\` ou \`(nom, prenom)\` utilise l\'index, tandis qu\'une recherche sur \`prenom\` seul ne peut pas l\'exploiter efficacement.'
                }
            ),
            createQ(
                'fisa-a3-bdd-q4',
                4,
                'Considérez la table `commandes` liée à `clients` par une clé étrangère avec `ON DELETE CASCADE`. Que se produit-il lorsqu\'un client est supprimé ?',
                [
                    { id: 'A', text: 'Toutes les commandes associées à ce client sont automatiquement supprimées de la base.', isExpected: true },
                    { id: 'B', text: 'La suppression du client est bloquée avec une erreur d\'intégrité référentielle.', isExpected: false },
                    { id: 'C', text: 'La colonne client_id des commandes passe à NULL.', isExpected: false },
                    { id: 'D', text: 'Le client est marqué comme archivé sans modifier la table commandes.', isExpected: false }
                ],
                { explanation: '\`ON DELETE CASCADE\` propage automatiquement la suppression de la ligne parente aux lignes filles associées dans la table référençant la clé étrangère.' }
            ),
            createQ(
                'fisa-a3-bdd-q5',
                5,
                'Considérez la requête SQL suivante utilisant les fonctions de fenêtrage :\nQuel résultat retourne cette requête ?',
                [
                    { id: 'A', text: 'Le classement des notes des étudiants calculé indépendamment au sein de chaque promotion.', isExpected: true },
                    { id: 'B', text: 'La moyenne générale de chaque promotion.', isExpected: false },
                    { id: 'C', text: 'Le nombre total d\'étudiants par promotion.', isExpected: false },
                    { id: 'D', text: 'Une erreur de syntaxe car GROUP BY est absent.', isExpected: false }
                ],
                {
                    codeSnippet: `SELECT 
    nom, 
    promo, 
    note,
    DENSE_RANK() OVER (PARTITION BY promo ORDER BY note DESC) as rang
FROM evaluations;`,
                    codeLanguage: 'sql',
                    explanation: '\`PARTITION BY promo\` partitionne les données par promo, et \`DENSE_RANK() OVER (... ORDER BY note DESC)\` calcule le rang de l\'étudiant au sein de sa promotion sans sauter de rang en cas d\'ex-aequo.'
                }
            ),
            createQ(
                'fisa-a3-bdd-q6',
                6,
                'Quelles affirmations relatives aux transactions et aux propriétés ACID sont exactes ? (Plusieurs réponses attendues)',
                [
                    { id: 'A', text: 'L\'Atomicité garantit que toutes les opérations d\'une transaction sont validées intégralement ou annulées (tout ou rien).', isExpected: true },
                    { id: 'B', text: 'La Durabilité garantit qu\'une transaction validée par COMMIT survit même à un crash matériel serveur.', isExpected: true },
                    { id: 'C', text: 'L\'Isolation empêche deux transactions concurrentes de s\'interférer mutuellement selon le niveau choisi.', isExpected: true },
                    { id: 'D', text: 'La Consistance oblige à dupliquer chaque table sur 3 disques RAID.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'ACID correspond à : Atomicité (tout ou rien), Consistance (respect des contraintes d\'intégrité), Isolation (séparation des transactions concurrentes) et Durabilité (persistance sur disque après commit).' }
            ),
            createQ(
                'fisa-a3-bdd-q7',
                7,
                'Quelle clause SQL permet de définir une expression de table commune (CTE - Common Table Expression) pour structurer des requêtes complexes lisibles ?',
                [
                    { id: 'A', text: 'WITH', isExpected: true },
                    { id: 'B', text: 'HAVING', isExpected: false },
                    { id: 'C', text: 'UNION ALL', isExpected: false },
                    { id: 'D', text: 'AS TEMPORARY', isExpected: false }
                ],
                {
                    codeSnippet: `WITH MeilleursEtudiants AS (
    SELECT id, nom, note FROM etudiants WHERE note >= 16
)
SELECT * FROM MeilleursEtudiants;`,
                    codeLanguage: 'sql',
                    explanation: 'La clause \`WITH\` introduit une CTE qui agit comme une vue temporaire nommée utilisable dans la requête principale ou dans des CTEs récursives.'
                }
            ),
            createQ(
                'fisa-a3-bdd-q8',
                8,
                'Dans PostgreSQL, quelle est la différence majeure entre le type de données `json` et `jsonb` ?',
                [
                    { id: 'A', text: '`jsonb` stocke les données sous forme binaire décomposée, éliminant les espaces et permettant une indexation rapide avec des index GIN.', isExpected: true },
                    { id: 'B', text: '`json` est chiffré alors que `jsonb` est en texte clair.', isExpected: false },
                    { id: 'C', text: '`jsonb` est limité à 256 caractères maximum.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence d\'indexation ou de performances.', isExpected: false }
                ],
                { explanation: '\`json\` conserve la copie exacte du texte source, tandis que \`jsonb\` stocke une structure binaire parsée, optimisée pour les requêtes, la recherche de clés et l\'indexation GIN.' }
            ),
            createQ(
                'fisa-a3-bdd-q9',
                9,
                'Comment se prémunir efficacement contre les attaques par injection SQL lors de l\'exécution de requêtes dynamiques depuis une application Node.js ou Java ?',
                [
                    { id: 'A', text: 'Utiliser systématiquement des requêtes préparées avec des paramètres typés (Prepared Statements / Parametric Queries).', isExpected: true },
                    { id: 'B', text: 'Concaténer manuellement les chaînes avec des guillemets doubles.', isExpected: false },
                    { id: 'C', text: 'Désactiver les clés primaires sur les tables utilisateurs.', isExpected: false },
                    { id: 'D', text: 'Remplacer toutes les tables par des fichiers CSV.', isExpected: false }
                ],
                {
                    codeSnippet: `// Requête sécurisée avec paramètres
const query = 'SELECT * FROM users WHERE email = $1 AND role = $2';
const result = await db.query(query, [userEmail, role]);`,
                    codeLanguage: 'javascript',
                    explanation: 'Les requêtes préparées séparent le code SQL des données utilisateur. Le moteur SGBD compile le plan d\'exécution avant d\'insérer les valeurs en tant que littéraux purs.'
                }
            ),
            createQ(
                'fisa-a3-bdd-q10',
                10,
                'Que signifie une opération de type "Seq Scan" (Sequential Scan) observée lors de l\'analyse d\'une requête avec `EXPLAIN ANALYZE` ?',
                [
                    { id: 'A', text: 'Le moteur parcourt l\'intégralité des lignes de la table sur le disque car aucun index adapté n\'a pu être utilisé.', isExpected: true },
                    { id: 'B', text: 'Le moteur a trouvé le résultat instantanément dans le cache mémoire.', isExpected: false },
                    { id: 'C', text: 'La requête a échoué en raison d\'un blocage de verrou.', isExpected: false },
                    { id: 'D', text: 'Un index B-Tree a été parcouru de façon binaire optimisée.', isExpected: false }
                ],
                { explanation: 'Un Sequential Scan lit toutes les pages de la table du début à la fin. Sur une table volumineuse, c\'est le signe qu\'un index sur les colonnes de filtrage WHERE manque.' }
            ),
            createQ(
                'fisa-a3-bdd-q11',
                11,
                'Que stipule le théorème CAP d\'Eric Brewer concernant les systèmes de bases de données distribuées ?',
                [
                    { id: 'A', text: 'En présence d\'un partitionnement réseau (P), un système distribué doit choisir entre la Cohérence forte (C) et la Disponibilité (A).', isExpected: true },
                    { id: 'B', text: 'Un cluster peut garantir 100% de Cohérence, Disponibilité et Performance en simultané.', isExpected: false },
                    { id: 'C', text: 'Toutes les bases NoSQL sont obligatoirement ACID.', isExpected: false },
                    { id: 'D', text: 'Le partitionnement réseau est impossible sur les architectures Cloud.', isExpected: false }
                ],
                { explanation: 'Le théorème CAP prouve qu\'un système distribué ne peut garantir simultanément que 2 des 3 propriétés : Consistance (C), Disponibilité (A), et Tolérance au Partitionnement (P). Comme P est inévitable sur un réseau, on choisit CP ou AP.' }
            ),
            createQ(
                'fisa-a3-bdd-q12',
                12,
                'Quelle est la différence entre un verrou partagé (Shared Lock - S) et un verrou exclusif (Exclusive Lock - X) ?',
                [
                    { id: 'A', text: 'Plusieurs transactions peuvent détenir simultanément un verrou partagé (lecture), tandis qu\'une seule transaction peut détenir un verrou exclusif (écriture).', isExpected: true },
                    { id: 'B', text: 'Le verrou exclusif est réservé aux administrateurs de la base.', isExpected: false },
                    { id: 'C', text: 'Les verrous partagés suppriment automatiquement les transactions en conflit.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence dans les bases relationnelles.', isExpected: false }
                ],
                { explanation: 'Un verrou partagé (S) permet des lectures concurrentes. Un verrou exclusif (X) garantit qu\'aucune autre transaction ne peut lire ou écrire la ressource pendant la modification.' }
            ),
            createQ(
                'fisa-a3-bdd-q13',
                13,
                'Dans une transaction SQL, quelle instruction permet de créer un point de reprise intermédiaire sans annuler l\'intégralité des opérations précédentes ?',
                [
                    { id: 'A', text: 'SAVEPOINT nom_point;', isExpected: true },
                    { id: 'B', text: 'CHECKPOINT nom_point;', isExpected: false },
                    { id: 'C', text: 'PAUSE TRANSACTION;', isExpected: false },
                    { id: 'D', text: 'COMMIT PARTIAL;', isExpected: false }
                ],
                { explanation: '\`SAVEPOINT\` définit un point d\'ancrage au sein d\'une transaction, vers lequel on peut revenir via \`ROLLBACK TO SAVEPOINT nom_point;\` sans annuler toute la transaction.' }
            ),
            createQ(
                'fisa-a3-bdd-q14',
                14,
                'Considérez la requête suivante avec jointures :\nQuelle sera la différence entre un `LEFT JOIN` et un `INNER JOIN` entre `clients` et `commandes` ?',
                [
                    { id: 'A', text: '`LEFT JOIN` retournera tous les clients, y compris ceux qui n\'ont jamais passé de commande (avec des valeurs NULL pour les colonnes commandes), alors que `INNER JOIN` n\'affiche que les clients ayant au moins une commande.', isExpected: true },
                    { id: 'B', text: '`INNER JOIN` supprime les doublons alors que `LEFT JOIN` les conserve.', isExpected: false },
                    { id: 'C', text: '`LEFT JOIN` est plus rapide car il n\'examine pas les clés étrangères.', isExpected: false },
                    { id: 'D', text: '`LEFT JOIN` ne fonctionne que sur les colonnes de type entier.', isExpected: false }
                ],
                {
                    codeSnippet: `SELECT clients.nom, commandes.id_commande 
FROM clients 
LEFT JOIN commandes ON clients.id = commandes.client_id;`,
                    codeLanguage: 'sql',
                    explanation: 'La jointure externe gauche (\`LEFT JOIN\`) conserve toutes les lignes de la table de gauche, associant les lignes correspondantes de droite ou NULL si aucune correspondance n\'existe.'
                }
            ),
            createQ(
                'fisa-a3-bdd-q15',
                15,
                'Quels sont les rôles d\'un Trigger (déclencheur) `BEFORE INSERT` par rapport à un Trigger `AFTER INSERT` ?',
                [
                    { id: 'A', text: '`BEFORE INSERT` permet de valider ou de modifier les données de la nouvelle ligne (`NEW`) avant qu\'elle ne soit inscrite sur le disque, tandis que `AFTER INSERT` est idéal pour propager des actions annexes (audit, logs, notifications).', isExpected: true },
                    { id: 'B', text: '`AFTER INSERT` s\'exécute uniquement si la base de données est redémarrée.', isExpected: false },
                    { id: 'C', text: '`BEFORE INSERT` ne peut pas lever d\'exception.', isExpected: false },
                    { id: 'D', text: 'Il est impossible d\'accéder à la variable `NEW` dans un trigger `BEFORE INSERT`.', isExpected: false }
                ],
                { explanation: 'Le trigger BEFORE peut altérer la ligne entrante \`NEW\` ou bloquer l\'insertion si les conditions métier échouent. Le trigger AFTER s\'exécute une fois la ligne confirmée dans la table.' }
            ),
            createQ(
                'fisa-a3-bdd-q16',
                16,
                'Dans quel cas est-il généralement préférable d\'utiliser une base de données NoSQL orientée documents (comme MongoDB) par rapport à un SGBD relationnel (PostgreSQL) ?',
                [
                    { id: 'A', text: 'Lorsque les données ont une structure hiérarchique semi-structurée fortement variable, évoluent rapidement sans schéma strict, et nécessitent une distribution horizontale massive.', isExpected: true },
                    { id: 'B', text: 'Lorsque des transactions bancaires multi-tables avec garanties ACID strictes et fortes contraintes d\'intégrité sont requises.', isExpected: false },
                    { id: 'C', text: 'Lorsque toutes les requêtes reposent sur des jointures complexes entre plus de 10 tables normalisées.', isExpected: false },
                    { id: 'D', text: 'Pour stocker exclusivement des données tabulaires simples sans relations.', isExpected: false }
                ],
                { explanation: 'Les bases de documents sont adaptées aux modèles polymorphes, au stockage de catalogues de produits ou de payloads JSON dynamiques sans schémas rigides.' }
            )
        ],
        stats: {
            correctCount: 16,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 14,
                multiple_choice: 2,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISA_A3_Bases_Donnees_SQL_2025.pdf',
            totalPages: 8,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 3. FISA INFO A3 - CYBERSECURITE & RESEAUX D'ENTREPRISE (15 questions)
export const CCTL_FISA_A3_CYBER_RESEAUX: PublishedCCTLEntry = {
    id: 'cctl-fisa-a3-cyber-reseaux-2025',
    title: 'FISA Info A3 — Cybersécurité, Cryptographie & Réseaux d\'Entreprise',
    subject: 'Cybersécurité, Cryptographie, Top 10 OWASP & Protocoles Réseaux',
    promo: 'A3',
    specialty: 'FISA Info',
    track: 'FISA',
    year: '2025',
    domain: 'Réseau & Cybersécurité',
    totalQuestions: 15,
    difficulty: 'Examen Officiel',
    durationMinutes: 45,
    authorName: 'Enseignant CESI Cybersécurité',
    isAnonymous: false,
    publishedAt: '2025-12-05T10:30:00.000Z',
    viewsCount: 215,
    downloadsCount: 118,
    hasPdf: true,
    pdfFileName: 'CCTL_FISA_A3_Cyber_Reseaux_2025.pdf',
    typesSummary: ['TLS 1.3', 'OWASP Top 10', 'OSI / TCP-IP', 'VLAN 802.1Q', 'Cryptographie AES/RSA'],
    exam: {
        id: 'cctl-fisa-a3-cyber-reseaux-2025',
        title: 'FISA Info A3 — Cybersécurité, Cryptographie & Réseaux d\'Entreprise',
        studentName: 'Élève-Ingénieur FISA A3',
        promo: 'A3',
        specialty: 'FISA Info',
        track: 'FISA',
        domain: 'Réseau & Cybersécurité',
        subject: 'Cybersécurité, Cryptographie, Top 10 OWASP & Protocoles Réseaux',
        description: 'Épreuve complète couvrant la sécurité applicative (XSS, CSRF, SSRF), le chiffrement symétrique et asymétrique, les protocoles TLS 1.3, le routage et le cloisonnement réseau.',
        difficulty: 'Examen Officiel',
        durationMinutes: 45,
        totalQuestions: 15,
        questions: [
            createQ(
                'fisa-a3-sec-q1',
                1,
                'Quelles améliorations majeures ont été introduites dans le protocole TLS 1.3 par rapport à TLS 1.2 ? (Plusieurs réponses attendues)',
                [
                    { id: 'A', text: 'Réduction du handshake complet à 1 seul aller-retour (1-RTT) et support du mode 0-RTT (Zero Round Trip Time) pour les sessions reprises.', isExpected: true },
                    { id: 'B', text: 'Suppression définitive des suites cryptographiques obsolètes et non sécurisées (comme RC4, DES, CBC-mode, RSA key exchange sans PFS).', isExpected: true },
                    { id: 'C', text: 'Obligation de la confidentialité persistante (PFS - Perfect Forward Secrecy) via Diffie-Hellman éphémère (ECDHE).', isExpected: true },
                    { id: 'D', text: 'Suppression du besoin de certificats numériques X.509.', isExpected: false }
                ],
                { isMultiple: true, explanation: 'TLS 1.3 accélère la connexion (1-RTT), élimine les algorithmes faibles et impose le Perfect Forward Secrecy (PFS).' }
            ),
            createQ(
                'fisa-a3-sec-q2',
                2,
                'Quelle est la différence fondamentale entre une attaque XSS (Cross-Site Scripting) et une attaque CSRF (Cross-Site Request Forgery) ?',
                [
                    { id: 'A', text: 'Le XSS injecte et exécute du code malveillant (JavaScript) dans le navigateur de la victime, tandis que le CSRF abuse de la confiance d\'un site web envers le navigateur de la victime pour exécuter des actions non désirées à son insu.', isExpected: true },
                    { id: 'B', text: 'Le XSS ne cible que les bases de données SQL, alors que le CSRF cible les routeurs réseau.', isExpected: false },
                    { id: 'C', text: 'Le CSRF nécessite d\'avoir un accès physique au serveur web de la cible.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence technique entre ces deux vulnérabilités.', isExpected: false }
                ],
                { explanation: 'XSS vole le contexte d\'exécution (cookies, DOM) via l\'exécution de JS non filtré. CSRF usurpe les droits de l\'utilisateur authentifié pour soumettre des formulaires ou requêtes sans son consentement.' }
            ),
            createQ(
                'fisa-a3-sec-q3',
                3,
                'Dans un schéma de chiffrement hybride moderne (utilisé par exemple dans HTTPS ou PGP) :',
                [
                    { id: 'A', text: 'Une clé symétrique de session (ex: AES-256-GCM) chiffre les données en masse, et cette clé de session est elle-même chiffrée avec la clé publique asymétrique du destinataire (ex: RSA ou ECC).', isExpected: true },
                    { id: 'B', text: 'Toutes les données sont chiffrées exclusivement avec une clé privée RSA.', isExpected: false },
                    { id: 'C', text: 'Le destinataire doit partager sa clé privée avant toute communication.', isExpected: false },
                    { id: 'D', text: 'Le chiffrement n\'utilise que des tables de hachage SHA-256 sans clés.', isExpected: false }
                ],
                { explanation: 'Le chiffrement asymétrique est trop lent pour de gros volumes. Le chiffrement hybride combine la rapidité du chiffrement symétrique et la sécurité de l\'échange de clé asymétrique.' }
            ),
            createQ(
                'fisa-a3-sec-q4',
                4,
                'Quel est le rôle du tag 802.1Q (VLAN Tagging) sur une liaison Trunk entre deux commutateurs (switchs) ?',
                [
                    { id: 'A', text: 'Ajouter un identifiant de 12 bits (VLAN ID) dans l\'en-tête de la trame Ethernet pour transporter le trafic de multiples réseaux virtuels isolés sur un câble physique unique.', isExpected: true },
                    { id: 'B', text: 'Chiffrer le trafic réseau au niveau de la couche 2.', isExpected: false },
                    { id: 'C', text: 'Attribuer automatiquement des adresses IP aux stations de travail.', isExpected: false },
                    { id: 'D', text: 'Bloquer les connexions Wi-Fi non autorisées.', isExpected: false }
                ],
                { explanation: 'La norme IEEE 802.1Q insère un champ de 4 octets (contenant le VLAN ID de 1 à 4094) dans les trames Ethernet transitant sur les liens Trunk.' }
            ),
            createQ(
                'fisa-a3-sec-q5',
                5,
                'Quelle vulnérabilité du Top 10 OWASP permet à un attaquant de forcer un serveur d\'application à envoyer des requêtes HTTP forgées vers son réseau local interne ou des services cloud de métadonnées (169.254.169.254) ?',
                [
                    { id: 'A', text: 'SSRF (Server-Side Request Forgery)', isExpected: true },
                    { id: 'B', text: 'XSS Stored', isExpected: false },
                    { id: 'C', text: 'SQL Injection Time-based', isExpected: false },
                    { id: 'D', text: 'Clickjacking', isExpected: false }
                ],
                { explanation: 'SSRF (Server-Side Request Forgery) permet à l\'attaquant d\'exploiter les requêtes sortantes générées par le serveur pour atteindre des ressources internes non exposées publiquement.' }
            ),
            createQ(
                'fisa-a3-sec-q6',
                6,
                'Dans le modèle OSI, à quelles couches respectives appartiennent le protocole IP et le protocole TCP ?',
                [
                    { id: 'A', text: 'IP appartient à la Couche 3 (Réseau) et TCP appartient à la Couche 4 (Transport).', isExpected: true },
                    { id: 'B', text: 'IP appartient à la Couche 2 (Liaison) et TCP à la Couche 3 (Réseau).', isExpected: false },
                    { id: 'C', text: 'IP appartient à la Couche 4 (Transport) et TCP à la Couche 7 (Application).', isExpected: false },
                    { id: 'D', text: 'Les deux protocoles appartiennent à la Couche 5 (Session).', isExpected: false }
                ],
                { explanation: 'Couche 3 (Réseau) : routage des paquets IP. Couche 4 (Transport) : contrôle de flux, fiabilité et ports avec TCP / UDP.' }
            ),
            createQ(
                'fisa-a3-sec-q7',
                7,
                'Pourquoi est-il crucial d\'utiliser une fonction de dérivation de clé lente avec sel (salt) comme Argon2id ou bcrypt pour le stockage des mots de passe, plutôt qu\'une fonction de hachage rapide comme SHA-256 ?',
                [
                    { id: 'A', text: 'Les fonctions comme bcrypt et Argon2id intègrent un facteur de travail (cost factor) qui ralentit considérablement les attaques par force brute et par dictionnaires massifs accélérées par GPU/ASIC.', isExpected: true },
                    { id: 'B', text: 'SHA-256 ne produit pas d\'empreintes uniques.', isExpected: false },
                    { id: 'C', text: 'bcrypt chiffre les mots de passe de façon réversible sans clé.', isExpected: false },
                    { id: 'D', text: 'SHA-256 est limité aux mots de passe de moins de 8 caractères.', isExpected: false }
                ],
                { explanation: 'SHA-256 est conçu pour être rapide (des milliards de hashs/sec par GPU). Pour les mots de passe, une fonction délibérément lente (memory-hard) comme Argon2id ou bcrypt est requise pour résister au cassage de hash.' }
            ),
            createQ(
                'fisa-a3-sec-q8',
                8,
                'Quel en-tête HTTP de sécurité permet d\'empêcher le navigateur d\'afficher une page web dans une balise `<iframe\>`, bloquant ainsi les attaques par Clickjacking ?',
                [
                    { id: 'A', text: 'X-Frame-Options: DENY (ou CSP frame-ancestors \'none\')', isExpected: true },
                    { id: 'B', text: 'Strict-Transport-Security: max-age=31536000', isExpected: false },
                    { id: 'C', text: 'X-Content-Type-Options: nosniff', isExpected: false },
                    { id: 'D', text: 'Access-Control-Allow-Origin: *', isExpected: false }
                ],
                { explanation: '\`X-Frame-Options: DENY\` ou la directive Content Security Policy \`frame-ancestors \'none\'\` interdit l\'intégration en iframe pour empêcher les attaques par détournement de clic (Clickjacking).' }
            ),
            createQ(
                'fisa-a3-sec-q9',
                9,
                'Quel mécanisme permet de mitiger efficacement une attaque par inondation de requêtes SYN (TCP SYN Flood DoS) sur un serveur web ?',
                [
                    { id: 'A', text: 'L\'activation des SYN Cookies au niveau de la pile TCP du noyau système.', isExpected: true },
                    { id: 'B', text: 'L\'augmentation de la taille du disque dur du serveur.', isExpected: false },
                    { id: 'C', text: 'La désactivation du protocole HTTPS.', isExpected: false },
                    { id: 'D', text: 'L\'utilisation de requêtes HTTP GET au lieu de POST.', isExpected: false }
                ],
                { explanation: 'Les SYN Cookies évitent d\'allouer de l\'espace dans la table des connexions semi-ouvertes en encodant les informations de connexion dans le numéro de séquence initial (ISN) du SYN-ACK.' }
            ),
            createQ(
                'fisa-a3-sec-q10',
                10,
                'Quel protocole de routage dynamique utilise l\'algorithme de Dijkstra (Shortest Path First) pour calculer la route la plus courte au sein d\'un Autonomous System (IGP) ?',
                [
                    { id: 'A', text: 'OSPF (Open Shortest Path First)', isExpected: true },
                    { id: 'B', text: 'BGP (Border Gateway Protocol)', isExpected: false },
                    { id: 'C', text: 'RIPv1', isExpected: false },
                    { id: 'D', text: 'ICMP', isExpected: false }
                ],
                { explanation: 'OSPF est un protocole à état de liens (Link-State) qui construit une topologie complète du réseau et calcule les plus courts chemins grâce à l\'algorithme de Dijkstra.' }
            ),
            createQ(
                'fisa-a3-sec-q11',
                11,
                'Qu\'est-ce qu\'une attaque de type "ARP Poisoning / ARP Spoofing" sur un réseau local Ethernet ?',
                [
                    { id: 'A', text: 'L\'envoi de fausses réponses ARP gratuites associant l\'adresse IP de la passerelle par défaut à l\'adresse MAC de l\'attaquant pour intercepter le trafic (Man-in-the-Middle).', isExpected: true },
                    { id: 'B', text: 'Une saturation de la bande passante par des requêtes DNS récursives.', isExpected: false },
                    { id: 'C', text: 'Le vol du mot de passe administrateur du commutateur par bruteforce Telnet.', isExpected: false },
                    { id: 'D', text: 'L\'interdiction d\'accès au serveur DHCP.', isExpected: false }
                ],
                { explanation: 'ARP ne comportant aucune authentification, un attaquant peut émettre de faux paquets ARP pour empoisonner le cache des stations et détourner les flux vers sa propre machine (MitM).' }
            ),
            createQ(
                'fisa-a3-sec-q12',
                12,
                'Quel attribut de cookie doit obligatoirement être activé pour empêcher les scripts JavaScript exécutés dans le navigateur de lire le cookie de session (atténuation du vol de session par XSS) ?',
                [
                    { id: 'A', text: 'HttpOnly', isExpected: true },
                    { id: 'B', text: 'SameSite=None', isExpected: false },
                    { id: 'C', text: 'Domain=.cesi.fr', isExpected: false },
                    { id: 'D', text: 'Max-Age=3600', isExpected: false }
                ],
                { explanation: 'L\'attribut \`HttpOnly\` interdit à \`document.cookie\` d\'accéder au cookie, protégeant ainsi le jeton de session contre le vol direct par injection XSS.' }
            ),
            createQ(
                'fisa-a3-sec-q13',
                13,
                'Quelle est la fonction d\'un WAF (Web Application Firewall) par rapport à un pare-feu réseau classique de niveau 3/4 ?',
                [
                    { id: 'A', text: 'Le WAF inspecte le trafic au niveau de la couche applicative (Couche 7 HTTP/HTTPS) pour détecter les attaques web comme les injections SQL, XSS et payloads malveillants.', isExpected: true },
                    { id: 'B', text: 'Le WAF remplace les commutateurs Ethernet physiques.', isExpected: false },
                    { id: 'C', text: 'Le WAF chiffre tous les disques durs des postes de travail.', isExpected: false },
                    { id: 'D', text: 'Le WAF s\'occupe uniquement d\'attribuer des adresses IP publiques.', isExpected: false }
                ],
                { explanation: 'Un firewall de niveau 3/4 filtre sur les IP et ports, tandis qu\'un WAF analyse la sémantique des requêtes HTTP/HTTPS entrantes pour bloquer les attaques web complexes.' }
            ),
            createQ(
                'fisa-a3-sec-q14',
                14,
                'Dans une infrastructure PKI (Public Key Infrastructure), quel est le rôle d\'une autorité de certification (CA) ?',
                [
                    { id: 'A', text: 'Signer numériquement les certificats X.509 pour lier de manière vérifiable une clé publique à l\'identité d\'une entité ou d\'un domaine web.', isExpected: true },
                    { id: 'B', text: 'Conserver les clés privées de tous les utilisateurs sur un serveur public.', isExpected: false },
                    { id: 'C', text: 'Fournir l\'accès à internet aux entreprises clientes.', isExpected: false },
                    { id: 'D', text: 'Réinitialiser les mots de passe des bases de données SQL.', isExpected: false }
                ],
                { explanation: 'L\'autorité de certification (CA) vérifie l\'identité du demandeur et appose sa signature numérique sur le certificat X.509 pour établir la chaîne de confiance (Chain of Trust).' }
            ),
            createQ(
                'fisa-a3-sec-q15',
                15,
                'Considérez la règle de pare-feu iptables suivante :\nQuelle action est effectuée ?',
                [
                    { id: 'A', text: 'Elle autorise les paquets de réponses légitimes liés à des connexions sortantes déjà établies (filtrage avec état Stateful).', isExpected: true },
                    { id: 'B', text: 'Elle bloque toutes les connexions HTTPS.', isExpected: false },
                    { id: 'C', text: 'Elle réinitialise l\'interface réseau.', isExpected: false },
                    { id: 'D', text: 'Elle enregistre les logs de toutes les connexions refusées.', isExpected: false }
                ],
                {
                    codeSnippet: `iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT`,
                    codeLanguage: 'bash',
                    explanation: 'Cette règle active le suivi des états de connexion (conntrack) pour accepter les paquets entrants appartenant à une session réseau préalablement initiée par le serveur.'
                }
            )
        ],
        stats: {
            correctCount: 15,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 14,
                multiple_choice: 1,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISA_A3_Cyber_Reseaux_2025.pdf',
            totalPages: 8,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 4. FISA INFO A3 - CLEAN ARCHITECTURE & DESIGN PATTERNS (15 questions)
export const CCTL_FISA_A3_ARCHI_PATTERNS: PublishedCCTLEntry = {
    id: 'cctl-fisa-a3-archi-patterns-2026',
    title: 'FISA Info A3 — Conception Logicielle, Clean Architecture & Design Patterns',
    subject: 'Conception Logicielle, Principes SOLID, Clean Architecture & Design Patterns GoF',
    promo: 'A3',
    specialty: 'FISA Info',
    track: 'FISA',
    year: '2026',
    domain: 'Développement Web',
    totalQuestions: 15,
    difficulty: 'Examen Officiel',
    durationMinutes: 45,
    authorName: 'Enseignant CESI Génie Logiciel',
    isAnonymous: false,
    publishedAt: '2026-01-18T08:30:00.000Z',
    viewsCount: 178,
    downloadsCount: 92,
    hasPdf: true,
    pdfFileName: 'CCTL_FISA_A3_Archi_Patterns_2026.pdf',
    typesSummary: ['SOLID', 'Clean Architecture', 'Design Patterns GoF', 'DDD', 'TDD'],
    exam: {
        id: 'cctl-fisa-a3-archi-patterns-2026',
        title: 'FISA Info A3 — Conception Logicielle, Clean Architecture & Design Patterns',
        studentName: 'Élève-Ingénieur FISA A3',
        promo: 'A3',
        specialty: 'FISA Info',
        track: 'FISA',
        domain: 'Développement Web',
        subject: 'Conception Logicielle, Principes SOLID, Clean Architecture & Design Patterns GoF',
        description: 'Examen de modélisation logicielle avancée : principes SOLID, Architecture Hexagonale (Ports & Adapters), patterns de création, structure et comportement (GoF), et Domain-Driven Design.',
        difficulty: 'Examen Officiel',
        durationMinutes: 45,
        totalQuestions: 15,
        questions: [
            createQ(
                'fisa-a3-pat-q1',
                1,
                'Que stipule le principe de responsabilité unique (Single Responsibility Principle - SRP) parmi les principes SOLID ?',
                [
                    { id: 'A', text: 'Une classe ne doit avoir qu\'une seule et unique raison de changer (un seul acteur métier / responsabilité).', isExpected: true },
                    { id: 'B', text: 'Un fichier de code ne doit contenir qu\'une seule ligne d\'instruction.', isExpected: false },
                    { id: 'C', text: 'Un programme ne doit posséder qu\'une seule classe principale.', isExpected: false },
                    { id: 'D', text: 'Toutes les méthodes d\'une classe doivent être publiques.', isExpected: false }
                ],
                { explanation: 'Le SRP (formulé par Robert C. Martin) impose qu\'un module logiciel ne soit responsable que vis-à-vis d\'un seul sous-système ou acteur métier afin de limiter les effets de bord lors des évolutions.' }
            ),
            createQ(
                'fisa-a3-pat-q2',
                2,
                'Dans la Clean Architecture (ou Architecture Hexagonale), quelle est la règle fondamentale de dépendance (Dependency Rule) ?',
                [
                    { id: 'A', text: 'Les dépendances dans le code source ne doivent pointer que vers l\'intérieur, vers les couches métier de plus haut niveau (le domaine ne doit dépendre d\'aucune infrastructure ou framework).', isExpected: true },
                    { id: 'B', text: 'Les entités métier doivent dépendre directement de la base de données SQL et des contrôleurs HTTP.', isExpected: false },
                    { id: 'C', text: 'Chaque fonction doit obligatoirement être asynchrone.', isExpected: false },
                    { id: 'D', text: 'L\'interface utilisateur doit communiquer directement avec les drivers de stockage.', isExpected: false }
                ],
                { explanation: 'La règle de dépendance garantit que le cœur métier (Entities & Use Cases) est totalement découplé des détails techniques (UI, DB, Web, Devices), inversant les dépendances via des interfaces (Ports).' }
            ),
            createQ(
                'fisa-a3-pat-q3',
                3,
                'Considérez le code suivant mettant en œuvre un Design Pattern GoF :\nQuel Design Pattern est illustré ici ?',
                [
                    { id: 'A', text: 'Strategy Pattern', isExpected: true },
                    { id: 'B', text: 'Singleton Pattern', isExpected: false },
                    { id: 'C', text: 'Decorator Pattern', isExpected: false },
                    { id: 'D', text: 'Prototype Pattern', isExpected: false }
                ],
                {
                    codeSnippet: `interface PaymentStrategy {
  pay(amount: number): Promise<void>;
}

class CreditCardPayment implements PaymentStrategy {
  async pay(amount: number) { /* Carte bancaire */ }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amount: number) { /* PayPal */ }
}

class CheckoutService {
  constructor(private strategy: PaymentStrategy) {}
  async processOrder(amount: number) {
    await this.strategy.pay(amount);
  }
}`,
                    codeLanguage: 'typescript',
                    explanation: 'Le pattern Strategy encapsule une famille d\'algorithmes interchangeables derrière une interface commune, permettant au client \`CheckoutService\` de changer de mode de paiement à l\'exécution sans modifier son code.'
                }
            ),
            createQ(
                'fisa-a3-pat-q4',
                4,
                'En Domain-Driven Design (DDD), quelle est la différence essentielle entre une Entité (Entity) et un Objet-Valeur (Value Object) ?',
                [
                    { id: 'A', text: 'Une Entité possède un identifiant unique immuable (ID) qui persiste malgré l\'évolution de ses attributs, tandis qu\'un Objet-Valeur est immuable et défini uniquement par la valeur de ses propriétés (sans identifiant).', isExpected: true },
                    { id: 'B', text: 'Une Entité ne peut pas contenir de méthodes, alors qu\'un Objet-Valeur ne contient que des méthodes.', isExpected: false },
                    { id: 'C', text: 'Les Objets-Valeurs sont toujours stockés dans des tables MongoDB et les Entités en PostgreSQL.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence en TypeScript.', isExpected: false }
                ],
                { explanation: 'Exemple : un \`Utilisateur\` est une Entité (il garde son ID même s\'il change d\'adresse). Une \`Adresse\` ou un \`PrixMonétaire (10 EUR)\` est un Value Object interchangeable.' }
            ),
            createQ(
                'fisa-a3-pat-q5',
                5,
                'Quel problème majeur résout le principe d\'inversion de dépendances (Dependency Inversion Principle - DIP) dans SOLID ?',
                [
                    { id: 'A', text: 'Il évite que les modules de haut niveau dépendent directement des modules de bas niveau, en les faisant tous dépendre d\'abstractions (interfaces).', isExpected: true },
                    { id: 'B', text: 'Il supprime le besoin d\'écrire des tests unitaires.', isExpected: false },
                    { id: 'C', text: 'Il accélère la vitesse d\'exécution du processeur.', isExpected: false },
                    { id: 'D', text: 'Il empêche l\'utilisation de classes abstraites.', isExpected: false }
                ],
                { explanation: 'Le DIP stipule que les modules de haut niveau ne doivent pas dépendre des modules de bas niveau ; les deux doivent dépendre d\'abstractions.' }
            ),
            createQ(
                'fisa-a3-pat-q6',
                6,
                'Quel Design Pattern GoF permet d\'ajouter dynamiquement de nouvelles responsabilités à un objet sans modifier sa structure interne ni avoir recours à une prolifération de sous-classes ?',
                [
                    { id: 'A', text: 'Decorator Pattern', isExpected: true },
                    { id: 'B', text: 'Factory Method', isExpected: false },
                    { id: 'C', text: 'Facade Pattern', isExpected: false },
                    { id: 'D', text: 'Command Pattern', isExpected: false }
                ],
                { explanation: 'Le Decorator emballe un objet dans un wrapper implémentant la même interface, interceptant les appels pour enrichir le comportement (ex: ajout de logging, compression, ou cache).' }
            ),
            createQ(
                'fisa-a3-pat-q7',
                7,
                'Dans le pattern architectural CQRS (Command Query Responsibility Segregation) :',
                [
                    { id: 'A', text: 'Les opérations de modification d\'état (Commands - Write) sont strictement séparées des opérations de consultation des données (Queries - Read), avec des modèles et potentiellement des bases distincts.', isExpected: true },
                    { id: 'B', text: 'Toutes les requêtes SQL doivent être remplacées par du GraphQL.', isExpected: false },
                    { id: 'C', text: 'La base de données principale refuse tout index.', isExpected: false },
                    { id: 'D', text: 'Les clients ne peuvent communiquer qu\'en UDP.', isExpected: false }
                ],
                { explanation: 'CQRS sépare les modèles de lecture (optimisés pour l\'affichage rapide sans jointures complexes) et les modèles d\'écriture (concentrés sur les règles métier et la consistance).' }
            ),
            createQ(
                'fisa-a3-pat-q8',
                8,
                'Que représente le cycle standard du développement guidé par les tests (TDD - Test-Driven Development) ?',
                [
                    { id: 'A', text: 'Red (écrire un test qui échoue) -> Green (écrire le code minimal pour faire passer le test) -> Refactor (nettoyer le code en conservant les tests verts).', isExpected: true },
                    { id: 'B', text: 'Code -> Déploiement -> Tests manuels en production.', isExpected: false },
                    { id: 'C', text: 'Génération de code IA -> Validation par le client -> Audit externe.', isExpected: false },
                    { id: 'D', text: 'Documentation -> Tests end-to-end -> Suppression du code mort.', isExpected: false }
                ],
                { explanation: 'Le cycle Red-Green-Refactor est le cœur du TDD, garantissant une couverture de test élevée et une conception modulaire orientée besoins.' }
            ),
            createQ(
                'fisa-a3-pat-q9',
                9,
                'Quelle est la différence fondamentale entre le Design Pattern Adapter et le Design Pattern Facade ?',
                [
                    { id: 'A', text: 'L\'Adapter convertit l\'interface d\'une classe existante en une autre interface attendue par le client pour les rendre compatibles, tandis que la Facade offre une interface simplifiée de haut niveau masquant la complexité d\'un sous-système entier.', isExpected: true },
                    { id: 'B', text: 'La Facade ne s\'utilise que pour les bases de données relationnelles.', isExpected: false },
                    { id: 'C', text: 'L\'Adapter crée obligatoirement des threads système.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence structurelle.', isExpected: false }
                ],
                { explanation: 'Adapter = compatibilité entre interfaces divergentes. Facade = simplification d\'un groupe complexe de classes.' }
            ),
            createQ(
                'fisa-a3-pat-q10',
                10,
                'Pourquoi le pattern Singleton est-il parfois considéré comme un anti-pattern dans les architectures modernes testables ?',
                [
                    { id: 'A', text: 'Il introduit un état global partagé difficile à mocker lors des tests unitaires et masque les dépendances réelles des composants.', isExpected: true },
                    { id: 'B', text: 'Il utilise trop de mémoire processeur.', isExpected: false },
                    { id: 'C', text: 'Il empêche l\'utilisation de TypeScript.', isExpected: false },
                    { id: 'D', text: 'Il provoque des erreurs de compilation dans Node.js.', isExpected: false }
                ],
                { explanation: 'Un singleton crée un couplage fort avec une instance globale unique, compliquant les tests parallèles et l\'injection de mocks.' }
            ),
            createQ(
                'fisa-a3-pat-q11',
                11,
                'Dans le principe de substitution de Liskov (LSP - Liskov Substitution Principle) :',
                [
                    { id: 'A', text: 'Les objets d\'une sous-classe doivent pouvoir remplacer les objets de la classe mère sans altérer le bon fonctionnement ou la cohérence du programme.', isExpected: true },
                    { id: 'B', text: 'Une classe enfant doit obligatoirement redéfinir toutes les méthodes de sa classe parente en levant des exceptions.', isExpected: false },
                    { id: 'C', text: 'L\'héritage est interdit dans tous les projets d\'ingénierie logicielle.', isExpected: false },
                    { id: 'D', text: 'Toutes les propriétés doivent être statiques.', isExpected: false }
                ],
                { explanation: 'Le LSP interdit les sous-classes qui cassent les contrats de la classe mère (par exemple la classique violation Rectangle / Carré avec \`setWidth\`/\`setHeight\`).' }
            ),
            createQ(
                'fisa-a3-pat-q12',
                12,
                'Quel Design Pattern comportemental permet à des objets abonnés d\'être notifiés automatiquement de tout changement d\'état intervenu sur un sujet observé ?',
                [
                    { id: 'A', text: 'Observer Pattern (Observateur / Publication-Abonnement)', isExpected: true },
                    { id: 'B', text: 'Builder Pattern', isExpected: false },
                    { id: 'C', text: 'Flyweight Pattern', isExpected: false },
                    { id: 'D', text: 'Bridge Pattern', isExpected: false }
                ],
                { explanation: 'Le pattern Observer découple la source d\'événements (Subject) de ses auditeurs (Observers), utilisé dans les architectures événementielles, RxJS ou les gestionnaires d\'état.' }
            ),
            createQ(
                'fisa-a3-pat-q13',
                13,
                'Dans une architecture hexagonale, que représentent respectivement les concepts de "Port" et d\'"Adaptateur" (Adapter) ?',
                [
                    { id: 'A', text: 'Le Port est une interface définie par le domaine métier (contrat), et l\'Adaptateur est la classe concrète d\'infrastructure qui implémente cette interface (ex: PostgreSQLRepository ou StripePaymentService).', isExpected: true },
                    { id: 'B', text: 'Le Port est le port TCP réseau (ex: 8080) et l\'Adaptateur est la carte réseau Ethernet.', isExpected: false },
                    { id: 'C', text: 'Le Port est une base de données et l\'Adaptateur est un câble HDMI.', isExpected: false },
                    { id: 'D', text: 'Les deux termes sont synonymes de contrôleurs REST.', isExpected: false }
                ],
                { explanation: 'Le domaine possède ses Ports (interfaces d\'entrée et de sortie). Les Adaptateurs traduisent les technologies externes pour dialoguer avec ces Ports.' }
            ),
            createQ(
                'fisa-a3-pat-q14',
                14,
                'Quel est l\'objectif du Design Pattern Factory Method (Fabrique) ?',
                [
                    { id: 'A', text: 'Définir une interface de création d\'objets tout en laissant aux sous-classes le choix des classes concrètes à instancier.', isExpected: true },
                    { id: 'B', text: 'Sauvegarder l\'état d\'un objet pour pouvoir l\'annuler plus tard (Undo).', isExpected: false },
                    { id: 'C', text: 'Partager des objets de granularité fine pour économiser la mémoire.', isExpected: false },
                    { id: 'D', text: 'Sérialiser des données en format JSON.', isExpected: false }
                ],
                { explanation: 'La Factory Method délègue la logique d\'instanciation complexe à des méthodes dédiées sans coupler le code client aux classes concrètes (\`new ConcreteProduct()\`).' }
            ),
            createQ(
                'fisa-a3-pat-q15',
                15,
                'Que désigne le concept d\'Agrégat (Aggregate) et de Racine d\'Agrégat (Aggregate Root) en Domain-Driven Design ?',
                [
                    { id: 'A', text: 'Un ensemble cohérent d\'Entités et d\'Objets-Valeurs traités comme une seule unité transactionnelle, accessible uniquement via une entité principale appelée Racine d\'Agrégat.', isExpected: true },
                    { id: 'B', text: 'Une requête SQL contenant des fonctions \`SUM()\`, \`AVG()\` et \`COUNT()\`.', isExpected: false },
                    { id: 'C', text: 'Un cluster de machines virtuelles Kubernetes.', isExpected: false },
                    { id: 'D', text: 'Un fichier de configuration YAML de déploiement.', isExpected: false }
                ],
                { explanation: 'L\'Agrégat protège les invariants métier. Tout accès ou modification des éléments internes de l\'agrégat doit impérativement transiter par sa racine (ex: \`Commande\` racine contrôlant ses \`LignesDeCommande\`).' }
            )
        ],
        stats: {
            correctCount: 15,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 15,
                multiple_choice: 0,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISA_A3_Archi_Patterns_2026.pdf',
            totalPages: 9,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 5. FISA INFO A3 - METHODES AGILES & SCRUM (12 questions)
export const CCTL_FISA_A3_AGILE_SCRUM: PublishedCCTLEntry = {
    id: 'cctl-fisa-a3-agile-scrum-2025',
    title: 'FISA Info A3 — Méthodes Agiles, Scrum & Gestion de Projet Ingénieur',
    subject: 'Gestion de Projet Agile, Cadre Scrum & Métriques de Performance IT',
    promo: 'A3',
    specialty: 'FISA Info',
    track: 'FISA',
    year: '2025',
    domain: 'Gestion de Projet Agile',
    totalQuestions: 12,
    difficulty: 'Examen Officiel',
    durationMinutes: 35,
    authorName: 'Enseignant CESI Management de Projet',
    isAnonymous: false,
    publishedAt: '2025-11-28T16:00:00.000Z',
    viewsCount: 162,
    downloadsCount: 88,
    hasPdf: true,
    pdfFileName: 'CCTL_FISA_A3_Agile_Scrum_2025.pdf',
    typesSummary: ['Scrum Guide', 'Product Owner', 'User Stories', 'Sprint Retro', 'Kanban'],
    exam: {
        id: 'cctl-fisa-a3-agile-scrum-2025',
        title: 'FISA Info A3 — Méthodes Agiles, Scrum & Gestion de Projet Ingénieur',
        studentName: 'Élève-Ingénieur FISA A3',
        promo: 'A3',
        specialty: 'FISA Info',
        track: 'FISA',
        domain: 'Gestion de Projet Agile',
        subject: 'Gestion de Projet Agile, Cadre Scrum & Métriques de Performance IT',
        description: 'Évaluation complète sur les rôles, cérémonies et artefacts Scrum (Scrum Guide 2020), la rédaction de User Stories (INVEST), le calcul de vélocité et le Kanban.',
        difficulty: 'Examen Officiel',
        durationMinutes: 35,
        totalQuestions: 12,
        questions: [
            createQ(
                'fisa-a3-agile-q1',
                1,
                'Dans le cadre Scrum, quel événement a pour objectif exclusif l\'amélioration continue des processus, des outils et des interactions de l\'équipe à la fin de chaque sprint ?',
                [
                    { id: 'A', text: 'La Rétrospective de Sprint (Sprint Retrospective)', isExpected: true },
                    { id: 'B', text: 'La Revue de Sprint (Sprint Review)', isExpected: false },
                    { id: 'C', text: 'Le Daily Scrum (Stand-up)', isExpected: false },
                    { id: 'D', text: 'Le Sprint Planning', isExpected: false }
                ],
                { explanation: 'La Sprint Review inspecte l\'Incrément produit avec les parties prenantes. La Rétrospective inspecte le fonctionnement humain, technique et méthodologique de l\'équipe pour s\'améliorer au sprint suivant.' }
            ),
            createQ(
                'fisa-a3-agile-q2',
                2,
                'Quels sont les 3 rôles officiels définis dans une Scrum Team selon le Scrum Guide ?',
                [
                    { id: 'A', text: 'Product Owner, Scrum Master, Developers (Développeurs)', isExpected: true },
                    { id: 'B', text: 'Chef de projet, Développeur Senior, Testeur QA', isExpected: false },
                    { id: 'C', text: 'Directeur Technique, Architecte Logiciel, Développeur Junior', isExpected: false },
                    { id: 'D', text: 'Product Manager, Release Manager, Scrum Lead', isExpected: false }
                ],
                { explanation: 'Le Scrum Guide 2020 définit une équipe pluridisciplinaire unie composée du Product Owner (valeur produit), du Scrum Master (efficacité du cadre) et des Developers (réalisation technique).' }
            ),
            createQ(
                'fisa-a3-agile-q3',
                3,
                'Quelle est la responsabilité principale du Product Owner (PO) ?',
                [
                    { id: 'A', text: 'Maximiser la valeur du produit résultant du travail de la Scrum Team et gérer efficacement le Product Backlog.', isExpected: true },
                    { id: 'B', text: 'Assigner quotidiennement les tâches techniques à chaque développeur.', isExpected: false },
                    { id: 'C', text: 'Rédiger tout le code source de l\'application.', isExpected: false },
                    { id: 'D', text: 'Fixer la date des vacances des membres de l\'équipe.', isExpected: false }
                ],
                { explanation: 'Le PO est le garant de la vision produit et du ROI. Il priorise les éléments du Product Backlog selon la valeur métier délivrée aux utilisateurs.' }
            ),
            createQ(
                'fisa-a3-agile-q4',
                4,
                'Que représente l\'acronyme INVEST utilisé comme standard de qualité pour la rédaction des User Stories ?',
                [
                    { id: 'A', text: 'Indépendante, Négociable, Valeur (Valuable), Estimable, Suffisamment petite (Small), Testable.', isExpected: true },
                    { id: 'B', text: 'Instantanée, Normalisée, Validée, Exécutable, Sécurisée, Terminée.', isExpected: false },
                    { id: 'C', text: 'Ingénierie, Numérique, Vectorielle, Évolutive, Structurée, Technique.', isExpected: false },
                    { id: 'D', text: 'Investissement, Négociation, Vélocité, Efficacité, Stratégie, Temporalité.', isExpected: false }
                ],
                { explanation: 'INVEST (Bill Wake) est le critère de référence pour s\'assurer qu\'une User Story est prête à être planifiée et développée dans un sprint.' }
            ),
            createQ(
                'fisa-a3-agile-q5',
                5,
                'Quelle est la différence fondamentale entre la "Definition of Done" (DoD) et les "Critères d\'Acceptation" (Acceptance Criteria) ?',
                [
                    { id: 'A', text: 'La DoD est transversale et s\'applique à TOUS les éléments du Product Backlog (qualité, tests, build vert, déploiement), tandis que les Critères d\'Acceptation sont spécifiques à UNE User Story donnée.', isExpected: true },
                    { id: 'B', text: 'La DoD ne concerne que la documentation commerciale.', isExpected: false },
                    { id: 'C', text: 'Les Critères d\'Acceptation sont rédigés par le Scrum Master uniquement.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence, les deux termes sont interchangeables.', isExpected: false }
                ],
                { explanation: 'La DoD garantit le standard de qualité global de l\'Incrément (tests unitaires validés, linting, review). Les critères d\'acceptation valident le comportement fonctionnel propre à la story.' }
            ),
            createQ(
                'fisa-a3-agile-q6',
                6,
                'À quoi sert un graphique de "Burndown Chart" au cours d\'un sprint ?',
                [
                    { id: 'A', text: 'Visualiser la quantité de travail restant à accomplir (en Story Points ou heures) au fil des jours du sprint pour anticiper l\'atteinte du Sprint Goal.', isExpected: true },
                    { id: 'B', text: 'Mesurer la consommation électrique des serveurs de build.', isExpected: false },
                    { id: 'C', text: 'Compter le nombre de lignes de code supprimées par le refactoring.', isExpected: false },
                    { id: 'D', text: 'Attribuer des primes individuelles aux développeurs.', isExpected: false }
                ],
                { explanation: 'Le Sprint Burndown Chart montre la trajectoire du travail restant face à la ligne idéale, permettant d\'adapter le scope du sprint si nécessaire.' }
            ),
            createQ(
                'fisa-a3-agile-q7',
                7,
                'Pourquoi utilise-t-on la suite de Fibonacci modifiée (1, 2, 3, 5, 8, 13, 21...) lors des séances de Planning Poker ?',
                [
                    { id: 'A', text: 'Pour refléter l\'incertitude croissante proportionnelle à la taille et à la complexité des tâches estimées.', isExpected: true },
                    { id: 'B', text: 'Parce que le Scrum Guide interdit les nombres pairs.', isExpected: false },
                    { id: 'C', text: 'Pour convertir directement les points en jours-hommes de facturation client.', isExpected: false },
                    { id: 'D', text: 'Parce que les ordinateurs ne calculent qu\'en base exponentielle.', isExpected: false }
                ],
                { explanation: 'Plus une tâche est grande, plus l\'estimation précise est illusoire. Les écarts exponentiels de Fibonacci évitent les débats stériles entre 11 et 12 points.' }
            ),
            createQ(
                'fisa-a3-agile-q8',
                8,
                'Dans la méthode Kanban, quel est l\'impact direct de l\'instauration de limites WIP (Work In Progress) strictes sur chaque colonne ?',
                [
                    { id: 'A', text: 'Réduire le multitâche, éliminer les goulots d\'étranglement (bottlenecks) et accélérer le Lead Time (délai de livraison de bout en bout).', isExpected: true },
                    { id: 'B', text: 'Interdire aux développeurs de travailler sur plus d\'un projet par an.', isExpected: false },
                    { id: 'C', text: 'Supprimer toutes les réunions de l\'entreprise.', isExpected: false },
                    { id: 'D', text: 'Imposer le travail en présentiel exclusif.', isExpected: false }
                ],
                { explanation: 'Limiter le travail en cours ("Stop starting, start finishing") fluidifie le flux de valeur en forçant la résolution des blocages avant d\'entamer de nouvelles tâches.' }
            ),
            createQ(
                'fisa-a3-agile-q9',
                9,
                'Quelle est la durée maximale (timebox) recommandée pour le Daily Scrum d\'une équipe de 7 personnes ?',
                [
                    { id: 'A', text: '15 minutes', isExpected: true },
                    { id: 'B', text: '45 minutes', isExpected: false },
                    { id: 'C', text: '1 heure et demie', isExpected: false },
                    { id: 'D', text: 'Aucune limite, la réunion dure tant qu\'il y a des désaccords techniques.', isExpected: false }
                ],
                { explanation: 'Le Daily Scrum est strictement limité à 15 minutes pour maintenir un rythme concis axé sur la synchronisation et les blocages, les discussions techniques détaillées ayant lieu après.' }
            ),
            createQ(
                'fisa-a3-agile-q10',
                10,
                'Quelle est la définition exacte de la "Vélocité" d\'une équipe Scrum ?',
                [
                    { id: 'A', text: 'Le nombre moyen de Story Points totalement terminés (validés selon la DoD) par l\'équipe au cours d\'un sprint.', isExpected: true },
                    { id: 'B', text: 'Le nombre de lignes de code produites par heure de travail.', isExpected: false },
                    { id: 'C', text: 'Le temps nécessaire pour déployer une mise à jour sur AWS.', isExpected: false },
                    { id: 'D', text: 'La vitesse de frappe au clavier des développeurs.', isExpected: false }
                ],
                { explanation: 'La vélocité est une métrique interne d\'équipe mesurant la capacité moyenne d\'absorption de charge par sprint pour faciliter la planification prévisionnelle.' }
            ),
            createQ(
                'fisa-a3-agile-q11',
                11,
                'Parmi les 4 valeurs fondatrices du Manifeste Agile (2001), laquelle est correcte ?',
                [
                    { id: 'A', text: 'Les individus et leurs interactions de préférence aux processus et aux outils.', isExpected: true },
                    { id: 'B', text: 'Le respect strict d\'un plan initial de préférence à l\'adaptation au changement.', isExpected: false },
                    { id: 'C', text: 'La négociation contractuelle de préférence à la collaboration avec les clients.', isExpected: false },
                    { id: 'D', text: 'Une documentation exhaustive de préférence à un logiciel fonctionnel.', isExpected: false }
                ],
                { explanation: 'Les 4 valeurs privilégient : Individus > Processus, Logiciel fonctionnel > Documentation exhaustive, Collaboration client > Négociation contractuelle, et Adaptation au changement > Suivi d\'un plan.' }
            ),
            createQ(
                'fisa-a3-agile-q12',
                12,
                'Que doit faire l\'équipe si elle constate en cours de sprint qu\'elle ne pourra pas terminer l\'ensemble des tâches du Sprint Backlog ?',
                [
                    { id: 'A', text: 'Le Product Owner et les Developers négocient pour réajuster le périmètre du sprint tout en préservant l\'atteinte du Sprint Goal principal.', isExpected: true },
                    { id: 'B', text: 'Le Scrum Master annule immédiatement le projet.', isExpected: false },
                    { id: 'C', text: 'L\'équipe supprime la phase de test pour tout valider à temps.', isExpected: false },
                    { id: 'D', text: 'Le sprint est prolongé automatiquement de 2 semaines supplémentaires.', isExpected: false }
                ],
                { explanation: 'La durée d\'un sprint est fixe (timeboxed). On négocie avec le PO pour réduire le scope secondaire sans compromettre le Sprint Goal ni baisser les exigences qualité de la DoD.' }
            )
        ],
        stats: {
            correctCount: 12,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 12,
                multiple_choice: 0,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISA_A3_Agile_Scrum_2025.pdf',
            totalPages: 6,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 6. FISE INFO A3 - ALGORITHMIQUE AVANCEE & COMPLEXITE (15 questions)
export const CCTL_FISE_A3_ALGO_DATA: PublishedCCTLEntry = {
    id: 'cctl-fise-a3-algo-data-2025',
    title: 'FISE Info A3 — Algorithmique Avancée, Structures de Données & Complexité',
    subject: 'Algorithmique Avancée, Graphes, Programmation Dynamique & Arbres Équilibrés',
    promo: 'A3',
    specialty: 'FISE Info',
    track: 'FISE',
    year: '2025',
    domain: 'Algorithmique & Data',
    totalQuestions: 15,
    difficulty: 'Examen Officiel',
    durationMinutes: 45,
    authorName: 'Enseignant CESI Mathématiques & Algorithmique',
    isAnonymous: false,
    publishedAt: '2025-10-10T11:00:00.000Z',
    viewsCount: 195,
    downloadsCount: 104,
    hasPdf: true,
    pdfFileName: 'CCTL_FISE_A3_Algo_Data_2025.pdf',
    typesSummary: ['Graphes Dijkstra', 'Arbres AVL', 'Programmation Dynamique', 'Complexité Big-O', 'Hash Tables'],
    exam: {
        id: 'cctl-fise-a3-algo-data-2025',
        title: 'FISE Info A3 — Algorithmique Avancée, Structures de Données & Complexité',
        studentName: 'Élève-Ingénieur FISE A3',
        promo: 'A3',
        specialty: 'FISE Info',
        track: 'FISE',
        domain: 'Algorithmique & Data',
        subject: 'Algorithmique Avancée, Graphes, Programmation Dynamique & Arbres Équilibrés',
        description: 'Examen d\'algorithmique théorique et appliquée : parcours de graphes (Dijkstra, A*, BFS/DFS), arbres équilibrés (AVL), programmation dynamique (sac à dos), et analyse asymptotique Big-O.',
        difficulty: 'Examen Officiel',
        durationMinutes: 45,
        totalQuestions: 15,
        questions: [
            createQ(
                'fise-a3-algo-q1',
                1,
                'Quelle est la complexité temporelle asymptotique dans le pire des cas (Worst Case) de l\'algorithme de tri rapide (Quicksort) lorsqu\'un mauvais choix de pivot est opéré systématiquement ?',
                [
                    { id: 'A', text: 'O(n²)', isExpected: true },
                    { id: 'B', text: 'O(n log n)', isExpected: false },
                    { id: 'C', text: 'O(n)', isExpected: false },
                    { id: 'D', text: 'O(log n)', isExpected: false }
                ],
                { explanation: 'En moyenne Quicksort est en O(n log n). Si le pivot choisi est toujours le minimum ou maximum sur une liste déjà triée, la récursion dégénère en O(n²).' }
            ),
            createQ(
                'fise-a3-algo-q2',
                2,
                'Quelle condition est impérative pour pouvoir appliquer l\'algorithme de Dijkstra afin de trouver les plus courts chemins dans un graphe orienté pondéré ?',
                [
                    { id: 'A', text: 'Tous les poids des arêtes doivent être strictement positifs ou nuls (aucun poids négatif).', isExpected: true },
                    { id: 'B', text: 'Le graphe doit obligatoirement être sans aucun cycle (DAG).', isExpected: false },
                    { id: 'C', text: 'Le graphe doit comporter moins de 100 sommets.', isExpected: false },
                    { id: 'D', text: 'Toutes les arêtes doivent avoir le même poids.', isExpected: false }
                ],
                { explanation: 'Dijkstra suppose de façon gloutonne qu\'ajouter une arête ne peut qu\'augmenter la distance. En présence de poids négatifs, il faut utiliser l\'algorithme de Bellman-Ford.' }
            ),
            createQ(
                'fise-a3-algo-q3',
                3,
                'Dans un Arbre Binaire de Recherche Équilibré de type AVL, quelle propriété sur le facteur d\'équilibre (Balance Factor) de chaque nœud est garantie à tout moment ?',
                [
                    { id: 'A', text: 'La différence de hauteur entre le sous-arbre gauche et le sous-arbre droit appartient à {-1, 0, +1}.', isExpected: true },
                    { id: 'B', text: 'Tous les nœuds feuilles sont situés sur le même niveau horizontal.', isExpected: false },
                    { id: 'C', text: 'Chaque nœud possède obligatoirement 2 enfants.', isExpected: false },
                    { id: 'D', text: 'Le facteur d\'équilibre doit être supérieur à +2.', isExpected: false }
                ],
                { explanation: 'Les rotations AVL (gauche/droite) maintiennent la hauteur en O(log n) en garantissant que |hauteur(G) - hauteur(D)| <= 1 pour chaque nœud.' }
            ),
            createQ(
                'fise-a3-algo-q4',
                4,
                'Quel principe fondamental caractérise la méthode de Programmation Dynamique par rapport à la méthode Diviser pour Régner (Divide and Conquer) ?',
                [
                    { id: 'A', text: 'La programmation dynamique mémorise les solutions des sous-problèmes chevauchants (mémoïsation / tabulation) pour éviter de recalculer plusieurs fois les mêmes états.', isExpected: true },
                    { id: 'B', text: 'La programmation dynamique ne s\'applique qu\'aux calculs matriciels en C++.', isExpected: false },
                    { id: 'C', text: 'Diviser pour Régner utilise des tables de hachage alors que la programmation dynamique utilise des pointeurs.', isExpected: false },
                    { id: 'D', text: 'Il n\'y a aucune différence d\'optimisation de complexité.', isExpected: false }
                ],
                { explanation: 'La programmation dynamique résout les problèmes à sous-structures optimales et sous-problèmes chevauchants (ex: sac à dos 0/1, distance d\'édition de Levenshtein, Fibonacci en O(n)).' }
            ),
            createQ(
                'fise-a3-algo-q5',
                5,
                'Quelle est la complexité spatiale et temporelle moyenne de la recherche d\'un élément dans une Table de Hachage (HashMap) avec une bonne fonction de dispersion ?',
                [
                    { id: 'A', text: 'O(1) en temps en moyenne', isExpected: true },
                    { id: 'B', text: 'O(n) en temps systématique', isExpected: false },
                    { id: 'C', text: 'O(log n) en temps', isExpected: false },
                    { id: 'D', text: 'O(n²)', isExpected: false }
                ],
                { explanation: 'Sous l\'hypothèse de hachage uniforme et avec un facteur de charge maîtrisé, le calcul du hash donne un accès direct en O(1).' }
            ),
            createQ(
                'fise-a3-algo-q6',
                6,
                'Dans le problème classique du Sac à Dos 0/1 (0/1 Knapsack Problem) avec n objets et une capacité W entière, quelle est la complexité temporelle de la résolution par programmation dynamique ?',
                [
                    { id: 'A', text: 'O(n * W) - Complexité pseudo-polynomiale', isExpected: true },
                    { id: 'B', text: 'O(2^n) avec mémoïsation', isExpected: false },
                    { id: 'C', text: 'O(1)', isExpected: false },
                    { id: 'D', text: 'O(n!)', isExpected: false }
                ],
                { explanation: 'La matrice DP de taille (n+1) x (W+1) se remplit en temps O(n * W), ce qui est pseudo-polynomial (dépendant de la valeur de W).' }
            ),
            createQ(
                'fise-a3-algo-q7',
                7,
                'Quel algorithme de parcours de graphe utilise une file (Queue - FIFO) pour explorer les sommets niveau par niveau, permettant de trouver le plus court chemin en nombre d\'arêtes dans un graphe non pondéré ?',
                [
                    { id: 'A', text: 'BFS (Breadth-First Search / Parcours en Largeur)', isExpected: true },
                    { id: 'B', text: 'DFS (Depth-First Search / Parcours en Profondeur)', isExpected: false },
                    { id: 'C', text: 'Algorithme de Kruskal', isExpected: false },
                    { id: 'D', text: 'Algorithme de Floyd-Warshall', isExpected: false }
                ],
                { explanation: 'Le BFS explore tous les voisins immédiats (distance k) avant de passer aux sommets à distance k+1, garantissant le plus court chemin non pondéré.' }
            ),
            createQ(
                'fise-a3-algo-q8',
                8,
                'Dans l\'algorithme de recherche de chemin A*, que représente la fonction d\'évaluation f(n) = g(n) + h(n) ?',
                [
                    { id: 'A', text: 'g(n) est le coût exact pour atteindre le sommet n depuis la source, et h(n) est l\'estimation heuristique admissible du coût restant pour atteindre la destination.', isExpected: true },
                    { id: 'B', text: 'g(n) est la vitesse du CPU et h(n) le nombre d\'arêtes.', isExpected: false },
                    { id: 'C', text: 'h(n) doit obligatoirement surestimer le coût réel.', isExpected: false },
                    { id: 'D', text: 'f(n) est un nombre aléatoire pour explorer les branches.', isExpected: false }
                ],
                { explanation: 'Si l\'heuristique h(n) est admissible (ne surestime jamais le coût réel), l\'algorithme A* est garanti de trouver le chemin optimal tout en explorant beaucoup moins de sommets que Dijkstra.' }
            ),
            createQ(
                'fise-a3-algo-q9',
                9,
                'Quelle structure de données sous-jacente est traditionnellement utilisée pour implémenter efficacement une File à Priorité (Priority Queue) avec des opérations d\'insertion et d\'extraction du minimum en O(log n) ?',
                [
                    { id: 'A', text: 'Un Tas Binaire (Binary Min-Heap / Max-Heap)', isExpected: true },
                    { id: 'B', text: 'Une liste simplement chaînée non triée', isExpected: false },
                    { id: 'C', text: 'Un tableau statique non indexé', isExpected: false },
                    { id: 'D', text: 'Une matrice d\'adjacence', isExpected: false }
                ],
                { explanation: 'Un tas binaire (représenté dans un tableau contigu) maintient la propriété de tas partiel, permettant \`push\` et \`pop_min\` en O(log n) et consultation du min en O(1).' }
            ),
            createQ(
                'fise-a3-algo-q10',
                10,
                'Considérez la relation de récurrence T(n) = 2T(n/2) + O(n). Selon le Master Theorem, quelle est la complexité asymptotique de T(n) ?',
                [
                    { id: 'A', text: 'O(n log n)', isExpected: true },
                    { id: 'B', text: 'O(n²)', isExpected: false },
                    { id: 'C', text: 'O(n)', isExpected: false },
                    { id: 'D', text: 'O(log n)', isExpected: false }
                ],
                { explanation: 'Avec a=2, b=2, et f(n)=O(n) : n^(log_2(2)) = n^1 = n. Comme f(n) = Theta(n), nous sommes dans le cas 2 du Master Theorem : T(n) = Theta(n log n) (ex: Mergesort).' }
            ),
            createQ(
                'fise-a3-algo-q11',
                11,
                'Quelle technique de résolution de collisions dans une table de hachage consiste à stocker tous les éléments ayant le même hash dans une liste chaînée rattachée à l\'alvéole ?',
                [
                    { id: 'A', text: 'Le chaînage séparé (Separate Chaining)', isExpected: true },
                    { id: 'B', text: 'L\'adressage ouvert à sondage linéaire (Linear Probing)', isExpected: false },
                    { id: 'C', text: 'Le double hachage (Double Hashing)', isExpected: false },
                    { id: 'D', text: 'Le tri par fusion', isExpected: false }
                ],
                { explanation: 'Le chaînage séparé place chaque élément en collision dans une liste chaînée ou un arbre rouge-noir (comme dans Java HashMap depuis Java 8).' }
            ),
            createQ(
                'fise-a3-algo-q12',
                12,
                'Pour trouver l\'Arbre Couvrant de Poids Minimum (Minimum Spanning Tree - MST) dans un graphe non orienté pondéré, quel algorithme glouton trie d\'abord toutes les arêtes par poids croissant ?',
                [
                    { id: 'A', text: 'L\'algorithme de Kruskal (utilisant la structure Union-Find / Disjoint Set)', isExpected: true },
                    { id: 'B', text: 'L\'algorithme de Prim', isExpected: false },
                    { id: 'C', text: 'L\'algorithme de Floyd-Warshall', isExpected: false },
                    { id: 'D', text: 'L\'algorithme de Tarjan', isExpected: false }
                ],
                { explanation: 'Kruskal trie les arêtes en O(E log E) et les ajoute une à une s\'ils ne créent pas de cycle, validé en temps quasi-constant grâce à la structure Union-Find.' }
            ),
            createQ(
                'fise-a3-algo-q13',
                13,
                'Quelle est la complexité temporelle du tri par tas (Heapsort) dans le pire des cas ?',
                [
                    { id: 'A', text: 'O(n log n) garanti, avec O(1) de mémoire additionnelle (tri en place)', isExpected: true },
                    { id: 'B', text: 'O(n²)', isExpected: false },
                    { id: 'C', text: 'O(n)', isExpected: false },
                    { id: 'D', text: 'O(2^n)', isExpected: false }
                ],
                { explanation: 'Heapsort garantit O(n log n) même dans le pire des cas en construisant un tas max en O(n) puis en extrayant successivement le max n fois en O(log n).' }
            ),
            createQ(
                'fise-a3-algo-q14',
                14,
                'Quel algorithme permet de détecter les composantes fortement connexes (SCC) dans un graphe orienté en un seul parcours en profondeur en temps linéaire O(V + E) ?',
                [
                    { id: 'A', text: 'L\'algorithme de Tarjan (ou algorithme de Kosaraju)', isExpected: true },
                    { id: 'B', text: 'L\'algorithme de Bellman-Ford', isExpected: false },
                    { id: 'C', text: 'L\'algorithme de Dijkstra', isExpected: false },
                    { id: 'D', text: 'L\'algorithme de Ford-Fulkerson', isExpected: false }
                ],
                { explanation: 'L\'algorithme de Tarjan utilise la numérotation DFS et les indices de plus petit sommet accessible (low-link) pour extraire les composantes fortement connexes en un seul passage O(V+E).' }
            ),
            createQ(
                'fise-a3-algo-q15',
                15,
                'Que garantit la propriété de sous-structure optimale dans un problème d\'optimisation combinatoire ?',
                [
                    { id: 'A', text: 'La solution optimale globale au problème peut être construite efficacement à partir des solutions optimales de ses sous-problèmes.', isExpected: true },
                    { id: 'B', text: 'Le problème n\'a aucune solution.', isExpected: false },
                    { id: 'C', text: 'Toutes les variables sont booléennes.', isExpected: false },
                    { id: 'D', text: 'Le temps d\'exécution est obligatoirement exponentiel.', isExpected: false }
                ],
                { explanation: 'La sous-structure optimale est la condition sine qua non pour appliquer les algorithmes gloutons ou la programmation dynamique.' }
            )
        ],
        stats: {
            correctCount: 15,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 15,
                multiple_choice: 0,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISE_A3_Algo_Data_2025.pdf',
            totalPages: 8,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 7. FISA INFO A4 - DEVOPS, DOCKER & KUBERNETES (15 questions)
export const CCTL_FISA_A4_DEVOPS: PublishedCCTLEntry = {
    id: 'cctl-fisa-a4-devops-cloud-2025',
    title: 'FISA Info A4 — DevOps, Conteneurisation Docker & Orchestration Kubernetes',
    subject: 'DevOps, Docker Multi-Stage, Kubernetes Pods/Services & CI/CD Pipelines',
    promo: 'A4',
    specialty: 'FISA Info',
    track: 'FISA',
    year: '2025',
    domain: 'Réseau & Cybersécurité',
    totalQuestions: 15,
    difficulty: 'Examen Officiel',
    durationMinutes: 45,
    authorName: 'Enseignant CESI Cloud & DevOps',
    isAnonymous: false,
    publishedAt: '2025-11-02T13:00:00.000Z',
    viewsCount: 145,
    downloadsCount: 79,
    hasPdf: true,
    pdfFileName: 'CCTL_FISA_A4_DevOps_Cloud_2025.pdf',
    typesSummary: ['Docker Multi-stage', 'Kubernetes Pods', 'Helm', 'CI/CD Pipelines', 'Terraform'],
    exam: {
        id: 'cctl-fisa-a4-devops-cloud-2025',
        title: 'FISA Info A4 — DevOps, Conteneurisation Docker & Orchestration Kubernetes',
        studentName: 'Élève-Ingénieur FISA A4',
        promo: 'A4',
        specialty: 'FISA Info',
        track: 'FISA',
        domain: 'Réseau & Cybersécurité',
        subject: 'DevOps, Docker Multi-Stage, Kubernetes Pods/Services & CI/CD Pipelines',
        description: 'Examen d\'ingénierie DevOps : conception de Dockerfiles optimisés multi-stage, architecture de cluster Kubernetes (Control Plane vs Workers), objets K8s et automatisation CI/CD.',
        difficulty: 'Examen Officiel',
        durationMinutes: 45,
        totalQuestions: 15,
        questions: [
            createQ(
                'fisa-a4-devops-q1',
                1,
                'Quel est le principal avantage de l\'utilisation du "Multi-Stage Build" dans un Dockerfile pour une application Node.js ou Go en production ?',
                [
                    { id: 'A', text: 'Produire une image finale légère ne contenant que le binaire/artefact compilé et les dépendances d\'exécution, en excluant les compilateurs et outils de build du conteneur final.', isExpected: true },
                    { id: 'B', text: 'Permettre d\'exécuter plusieurs conteneurs simultanément sur le même port.', isExpected: false },
                    { id: 'C', text: 'Chiffrer le code source avec une clé asymétrique.', isExpected: false },
                    { id: 'D', text: 'Désactiver les couches de cache Docker.', isExpected: false }
                ],
                {
                    codeSnippet: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]`,
                    codeLanguage: 'dockerfile',
                    explanation: 'Le multi-stage build sépare l\'étape de compilation lourde de l\'étape d\'exécution minimale, réduisant la taille de l\'image et sa surface d\'attaque de vulnérabilités.'
                }
            ),
            createQ(
                'fisa-a4-devops-q2',
                2,
                'Dans un cluster Kubernetes, quel composant du Control Plane (Master Node) est responsable du stockage persistant et distribué de l\'état complet du cluster ?',
                [
                    { id: 'A', text: 'etcd (base de données clé-valeur distribuée hautement cohérente)', isExpected: true },
                    { id: 'B', text: 'kube-scheduler', isExpected: false },
                    { id: 'C', text: 'kubelet', isExpected: false },
                    { id: 'D', text: 'kube-proxy', isExpected: false }
                ],
                { explanation: '\`etcd\` est le magasin de stockage clé-valeur distribué et cohérent qui stocke la configuration, les specs des objets et l\'état réel du cluster K8s.' }
            ),
            createQ(
                'fisa-a4-devops-q3',
                3,
                'Quel type de Service Kubernetes expose une application sur une adresse IP interne accessible uniquement depuis l\'intérieur du cluster K8s (type par défaut) ?',
                [
                    { id: 'A', text: 'ClusterIP', isExpected: true },
                    { id: 'B', text: 'NodePort', isExpected: false },
                    { id: 'C', text: 'LoadBalancer', isExpected: false },
                    { id: 'D', text: 'ExternalName', isExpected: false }
                ],
                { explanation: '\`ClusterIP\` fournit une adresse IP virtuelle interne stable pour équilibrer la charge entre les Pods d\'un même service au sein du réseau du cluster.' }
            ),
            createQ(
                'fisa-a4-devops-q4',
                4,
                'Dans une chaîne d\'intégration continue (CI/CD), quel est le rôle d\'une étape de "Static Application Security Testing" (SAST) comme SonarQube ou Snyk ?',
                [
                    { id: 'A', text: 'Analyser le code source sans l\'exécuter pour détecter les failles de sécurité, les bugs potentiels et les violations de standards avant le merge.', isExpected: true },
                    { id: 'B', text: 'Envoyer des attaques DDoS sur l\'application en production.', isExpected: false },
                    { id: 'C', text: 'Gérer la paie des ingénieurs DevOps.', isExpected: false },
                    { id: 'D', text: 'Redémarrer les serveurs physiques en cas de panne.', isExpected: false }
                ],
                { explanation: 'Le SAST (Static Application Security Testing) inspecte le code source et les dépendances (SCA) dans le pipeline CI pour bloquer les vulnérabilités au plus tôt (Shift Left Security).' }
            ),
            createQ(
                'fisa-a4-devops-q5',
                5,
                'Que représente un "Pod" dans l\'écosystème Kubernetes ?',
                [
                    { id: 'A', text: 'La plus petite unité de déploiement dans Kubernetes, encapsulant un ou plusieurs conteneurs partageant le même namespace réseau (adresse IP) et les mêmes volumes de stockage.', isExpected: true },
                    { id: 'B', text: 'Une machine physique sur laquelle est installé Linux.', isExpected: false },
                    { id: 'C', text: 'Un compte utilisateur administrateur dans AWS.', isExpected: false },
                    { id: 'D', text: 'Un commutateur réseau virtuel.', isExpected: false }
                ],
                { explanation: 'Un Pod regroupe un ou plusieurs conteneurs étroitement couplés (ex: conteneur principal + conteneur sidecar de logging/proxy) qui partagent localhost et les volumes.' }
            ),
            createQ(
                'fisa-a4-devops-q6',
                6,
                'Quel outil d\'Infrastructure as Code (IaC) déclaratif permet de provisionner et versionner des ressources Cloud (VPC, instances EC2, bases RDS) sur de multiples fournisseurs grâce à des fichiers HCL ?',
                [
                    { id: 'A', text: 'Terraform (HashiCorp)', isExpected: true },
                    { id: 'B', text: 'Docker Compose', isExpected: false },
                    { id: 'C', text: 'PM2', isExpected: false },
                    { id: 'D', text: 'Postman', isExpected: false }
                ],
                { explanation: 'Terraform permet de déclarer l\'état désiré de l\'infrastructure cloud en HCL (HashiCorp Configuration Language) et de gérer le cycle de vie via \`terraform plan\` et \`terraform apply\`.' }
            ),
            createQ(
                'fisa-a4-devops-q7',
                7,
                'Quelle est la différence entre une sonde de type "LivenessProbe" et une sonde de type "ReadinessProbe" dans un Pod Kubernetes ?',
                [
                    { id: 'A', text: 'La LivenessProbe vérifie si le conteneur est toujours vivant (s\'il échoue, Kubernetes tue et redémarre le conteneur), tandis que la ReadinessProbe vérifie si le conteneur est prêt à recevoir du trafic utilisateur (s\'il échoue, K8s le retire des endpoints du Service sans le tuer).', isExpected: true },
                    { id: 'B', text: 'La ReadinessProbe ne fonctionne que pour les bases de données SQL.', isExpected: false },
                    { id: 'C', text: 'La LivenessProbe n\'est exécutée qu\'une seule fois au démarrage.', isExpected: false },
                    { id: 'D', text: 'Les deux sondes ont exactement le même comportement destructif.', isExpected: false }
                ],
                { explanation: 'Liveness = relance en cas de deadlock/crash. Readiness = gestion de la disponibilité pour recevoir des requêtes réseau sans erreurs 502/503.' }
            ),
            createQ(
                'fisa-a4-devops-q8',
                8,
                'Dans Docker, quelle est la différence entre un volume géré (`docker volume create`) et un "Bind Mount" ?',
                [
                    { id: 'A', text: 'Les volumes Docker sont stockés dans un répertoire géré par le démon Docker (`/var/lib/docker/volumes`), isolés du système hôte et portables, tandis que les Bind Mounts montent directement un dossier spécifique quelconque du système de fichiers de l\'hôte.', isExpected: true },
                    { id: 'B', text: 'Les Bind Mounts sont chiffrés alors que les volumes sont en clair.', isExpected: false },
                    { id: 'C', text: 'Les volumes Docker sont effacés dès que le conteneur s\'arrête.', isExpected: false },
                    { id: 'D', text: 'Il est impossible de monter un volume en lecture seule.', isExpected: false }
                ],
                { explanation: 'Les volumes Docker sont recommandés en production pour leur isolation et leurs performances, tandis que les Bind Mounts sont pratiques en dev pour synchroniser le code source.' }
            ),
            createQ(
                'fisa-a4-devops-q9',
                9,
                'Quel objet Kubernetes gère le déploiement déclaratif de Pods sans état (Stateless), assure les mises à jour progressives (Rolling Updates) et permet le retour arrière (Rollback) ?',
                [
                    { id: 'A', text: 'Deployment', isExpected: true },
                    { id: 'B', text: 'StatefulSet', isExpected: false },
                    { id: 'C', text: 'DaemonSet', isExpected: false },
                    { id: 'D', text: 'ConfigMap', isExpected: false }
                ],
                { explanation: 'L\'objet \`Deployment\` orchestre les ReplicaSets sous-jacents pour assurer des mises à jour progressives sans interruption de service (Zero-downtime Rolling Updates).' }
            ),
            createQ(
                'fisa-a4-devops-q10',
                10,
                'Quel outil standard agit comme gestionnaire de paquets pour Kubernetes en permettant de regrouper, paramétrer avec des `values.yaml` et déployer des applications complexes sous forme de "Charts" ?',
                [
                    { id: 'A', text: 'Helm', isExpected: true },
                    { id: 'B', text: 'npm', isExpected: false },
                    { id: 'C', text: 'apt-get', isExpected: false },
                    { id: 'D', text: 'Gradle', isExpected: false }
                ],
                { explanation: 'Helm est le gestionnaire de packages officiel de Kubernetes qui simplifie le templating des manifestes YAML et la gestion des releases applicatives.' }
            ),
            createQ(
                'fisa-a4-devops-q11',
                11,
                'Quelle stratégie de déploiement consiste à faire tourner deux environnements identiques en parallèle (un ancien et un nouveau), puis à basculer instantanément le routeur de trafic vers la nouvelle version ?',
                [
                    { id: 'A', text: 'Blue/Green Deployment', isExpected: true },
                    { id: 'B', text: 'Canary Deployment', isExpected: false },
                    { id: 'C', text: 'Recreate Deployment', isExpected: false },
                    { id: 'D', text: 'Shadow Deployment', isExpected: false }
                ],
                { explanation: 'Le déploiement Blue/Green maintient la version active (Blue) pendant le test complet de la nouvelle (Green), puis bascule le Load Balancer instantanément, permettant un rollback immédiat.' }
            ),
            createQ(
                'fisa-a4-devops-q12',
                12,
                'Dans Prometheus et Grafana, quel est le mode de collecte des métriques privilégié par Prometheus ?',
                [
                    { id: 'A', text: 'Le modèle "Pull" : Prometheus interroge périodiquement (scrape) un endpoint HTTP `/metrics` exposé par les applications ou les exporters.', isExpected: true },
                    { id: 'B', text: 'Le modèle "Push" continu obligatoire sur chaque microseconde.', isExpected: false },
                    { id: 'C', text: 'L\'envoi d\'emails quotidiens aux administrateurs.', isExpected: false },
                    { id: 'D', text: 'La lecture directe des fichiers journaux Windows Event Viewer.', isExpected: false }
                ],
                { explanation: 'Prometheus utilise une architecture de scraping "Pull" où le serveur interroge les cibles à intervalle régulier sur leur endpoint de métriques au format texte Prometheus.' }
            ),
            createQ(
                'fisa-a4-devops-q13',
                13,
                'À quoi sert l\'objet Kubernetes `Ingress` combiné à un Ingress Controller (comme NGINX ou Traefik) ?',
                [
                    { id: 'A', text: 'Gérer le routage HTTP/HTTPS entrant vers les Services internes du cluster en fonction du nom d\'hôte (domaine) ou du chemin d\'URL (Path routing), avec gestion de la terminaison TLS.', isExpected: true },
                    { id: 'B', text: 'Allouer automatiquement de la mémoire vive aux nœuds physiques.', isExpected: false },
                    { id: 'C', text: 'Supprimer les conteneurs inactifs.', isExpected: false },
                    { id: 'D', text: 'Remplacer l\'API Server de Kubernetes.', isExpected: false }
                ],
                { explanation: 'L\'Ingress agit comme un reverse proxy d\'entrée unique pour tout le cluster, évitant de payer un LoadBalancer cloud distinct pour chaque service interne.' }
            ),
            createQ(
                'fisa-a4-devops-q14',
                14,
                'Dans Docker, comment optimiser l\'utilisation du cache des couches (Layer Caching) lors de la création d\'une image pour une application Node.js ?',
                [
                    { id: 'A', text: 'Copier `package.json` et exécuter `npm install` AVANT de copier le reste des fichiers sources (`COPY . .`), afin que la couche de dépendances ne soit pas réexécutée à chaque modification de code.', isExpected: true },
                    { id: 'B', text: 'Mettre tout le code dans une seule ligne `RUN`.', isExpected: false },
                    { id: 'C', text: 'Désactiver le fichier `.dockerignore`.', isExpected: false },
                    { id: 'D', text: 'Réinstaller Node.js à chaque exécution de conteneur.', isExpected: false }
                ],
                { explanation: 'Docker invalide le cache dès qu\'un fichier copié change. En séparant \`COPY package*.json\` et \`RUN npm ci\` avant \`COPY . .\`, les dépendances restent en cache si seuls les fichiers \`.ts\` ou \`.js\` changent.' }
            ),
            createQ(
                'fisa-a4-devops-q15',
                15,
                'Quel objet Kubernetes est spécialement conçu pour déployer des applications avec état nécessitant des identifiants réseau stables et des volumes persistants ordonnés (comme des clusters PostgreSQL ou Kafka) ?',
                [
                    { id: 'A', text: 'StatefulSet', isExpected: true },
                    { id: 'B', text: 'Deployment', isExpected: false },
                    { id: 'C', text: 'Job', isExpected: false },
                    { id: 'D', text: 'HorizontalPodAutoscaler', isExpected: false }
                ],
                { explanation: '\`StatefulSet\` garantit des noms de pods séquentiels stables (\`db-0\`, \`db-1\`), un ordre strict de démarrage et d\'arrêt, et un volume persistant dédié attaché à chaque réplique.' }
            )
        ],
        stats: {
            correctCount: 15,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 15,
                multiple_choice: 0,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_FISA_A4_DevOps_Cloud_2025.pdf',
            totalPages: 8,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

// 8. FISA/FISE A2 - LINUX & PROGRAMMATION SYSTEME C (12 questions)
export const CCTL_A2_LINUX_SYSTEME: PublishedCCTLEntry = {
    id: 'cctl-a2-linux-systeme-c-2025',
    title: 'A2 Prépa Intégrée — Systèmes d\'Exploitation Linux & Programmation Système C',
    subject: 'Systèmes Linux, Gestion des Processus fork/exec, Signaux & Mémoire C',
    promo: 'A2',
    specialty: 'Généraliste & Informatique',
    track: 'FISA',
    year: '2025',
    domain: 'Algorithmique & Data',
    totalQuestions: 12,
    difficulty: 'Examen Officiel',
    durationMinutes: 35,
    authorName: 'Enseignant CESI Systèmes & C',
    isAnonymous: false,
    publishedAt: '2025-09-25T09:00:00.000Z',
    viewsCount: 138,
    downloadsCount: 65,
    hasPdf: true,
    pdfFileName: 'CCTL_A2_Linux_Systeme_C_2025.pdf',
    typesSummary: ['Linux fork()', 'Pointeurs C', 'Signaux POSIX', 'Valgrind', 'Mutexes'],
    exam: {
        id: 'cctl-a2-linux-systeme-c-2025',
        title: 'A2 Prépa Intégrée — Systèmes d\'Exploitation Linux & Programmation Système C',
        studentName: 'Élève-Ingénieur A2',
        promo: 'A2',
        specialty: 'Généraliste & Informatique',
        track: 'FISA',
        domain: 'Algorithmique & Data',
        subject: 'Systèmes Linux, Gestion des Processus fork/exec, Signaux & Mémoire C',
        description: 'Examen d\'architecture système et programmation C : création de processus (`fork`, `exec`), gestion de la mémoire dynamique (`malloc`, `free`), fuites mémoires et synchronisation de threads.',
        difficulty: 'Examen Officiel',
        durationMinutes: 35,
        totalQuestions: 12,
        questions: [
            createQ(
                'a2-linux-q1',
                1,
                'Considérez le code C suivant :\nCombien de fois le mot "CESI" sera-t-il affiché à l\'écran ?',
                [
                    { id: 'A', text: '4 fois', isExpected: true },
                    { id: 'B', text: '2 fois', isExpected: false },
                    { id: 'C', text: '3 fois', isExpected: false },
                    { id: 'D', text: '1 fois', isExpected: false }
                ],
                {
                    codeSnippet: `#include <stdio.h>
#include <unistd.h>

int main() {
    fork();
    fork();
    printf("CESI\\n");
    return 0;
}`,
                    codeLanguage: 'c',
                    explanation: 'Le premier \`fork()\` crée 2 processus. Le second \`fork()\` est exécuté par ces 2 processus, créant au total 2² = 4 processus distincts qui exécutent chacun le \`printf\`.'
                }
            ),
            createQ(
                'a2-linux-q2',
                2,
                'Que retourne l\'appel système `fork()` dans le processus parent (père) en cas de succès ?',
                [
                    { id: 'A', text: 'Le PID (Process ID) du processus fils créé (nombre strictement positif > 0).', isExpected: true },
                    { id: 'B', text: 'La valeur 0.', isExpected: false },
                    { id: 'C', text: 'La valeur -1.', isExpected: false },
                    { id: 'D', text: 'L\'adresse mémoire du pointeur de pile.', isExpected: false }
                ],
                { explanation: '\`fork()\` retourne 0 dans le processus fils, le PID du fils (>0) dans le processus père, et -1 en cas d\'erreur de création.' }
            ),
            createQ(
                'a2-linux-q3',
                3,
                'En langage C, quelle fonction permet d\'allouer dynamiquement un bloc de mémoire sur le Tas (Heap) sans initialiser les octets à zéro ?',
                [
                    { id: 'A', text: 'malloc()', isExpected: true },
                    { id: 'B', text: 'calloc()', isExpected: false },
                    { id: 'C', text: 'free()', isExpected: false },
                    { id: 'D', text: 'realloc()', isExpected: false }
                ],
                { explanation: '\`malloc(size)\` alloue la mémoire sur le tas sans mise à zéro, tandis que \`calloc(num, size)\` alloue et initialise tous les octets à 0.' }
            ),
            createQ(
                'a2-linux-q4',
                4,
                'Quel outil open-source d\'analyse dynamique sous Linux est couramment utilisé pour détecter les fuites de mémoire (memory leaks) et les accès invalides en C/C++ ?',
                [
                    { id: 'A', text: 'Valgrind (avec l\'outil Memcheck)', isExpected: true },
                    { id: 'B', text: 'GDB uniquement', isExpected: false },
                    { id: 'C', text: 'Git status', isExpected: false },
                    { id: 'D', text: 'Wireshark', isExpected: false }
                ],
                { explanation: '\`valgrind --leak-check=full ./mon_programme\` intercepte tous les \`malloc\` et \`free\` pour signaler les blocs non libérés et les accès hors limites.' }
            ),
            createQ(
                'a2-linux-q5',
                5,
                'Quel signal POSIX sous Linux ne peut être ni intercepté, ni ignoré, ni bloqué par un processus utilisateur pour forcer son arrêt immédiat ?',
                [
                    { id: 'A', text: 'SIGKILL (signal 9)', isExpected: true },
                    { id: 'B', text: 'SIGINT (signal 2 - Ctrl+C)', isExpected: false },
                    { id: 'C', text: 'SIGTERM (signal 15)', isExpected: false },
                    { id: 'D', text: 'SIGUSR1', isExpected: false }
                ],
                { explanation: '\`SIGKILL\` (signal 9) et \`SIGSTOP\` sont directement traités par le noyau Linux et ne peuvent jamais être interceptés ou bloqués par un handler utilisateur.' }
            ),
            createQ(
                'a2-linux-q6',
                6,
                'Considérez la déclaration suivante en C :\nQue représente la variable `p` ?',
                [
                    { id: 'A', text: 'Un pointeur vers un pointeur d\'entier (pointeur double).', isExpected: true },
                    { id: 'B', text: 'Un tableau de 2 entiers.', isExpected: false },
                    { id: 'C', text: 'Une multiplication d\'entiers.', isExpected: false },
                    { id: 'D', text: 'Une variable constante.', isExpected: false }
                ],
                {
                    codeSnippet: `int **p;`,
                    codeLanguage: 'c',
                    explanation: '\`int **p\` est un pointeur qui contient l\'adresse mémoire d\'un autre pointeur \`int *\`, couramment utilisé pour allouer des matrices 2D dynamiques.'
                }
            ),
            createQ(
                'a2-linux-q7',
                7,
                'À quoi sert l\'appel système `wait()` ou `waitpid()` exécuté par un processus parent sous Linux ?',
                [
                    { id: 'A', text: 'Attendre la fin de l\'exécution d\'un processus fils, récupérer son code de sortie et éviter qu\'il ne devienne un processus Zombie.', isExpected: true },
                    { id: 'B', text: 'Mettre le processeur en veille prolongée.', isExpected: false },
                    { id: 'C', text: 'Bloquer toutes les connexions réseau.', isExpected: false },
                    { id: 'D', text: 'Sauvegarder le code source sur disque.', isExpected: false }
                ],
                { explanation: 'Un processus fils terminé dont le père n\'a pas appelé \`wait()\` reste dans la table des processus sous forme de processus Zombie.' }
            ),
            createQ(
                'a2-linux-q8',
                8,
                'Que signifie la permission de fichier Linux `chmod 755 script.sh` ?',
                [
                    { id: 'A', text: 'Propriétaire : Lecture, Écriture, Exécution (rwx - 7) ; Groupe : Lecture, Exécution (r-x - 5) ; Autres : Lecture, Exécution (r-x - 5).', isExpected: true },
                    { id: 'B', text: 'Tous les utilisateurs ont tous les droits d\'écriture.', isExpected: false },
                    { id: 'C', text: 'Le fichier est totalement caché et verrouillé.', isExpected: false },
                    { id: 'D', text: 'Seul root peut exécuter le script.', isExpected: false }
                ],
                { explanation: '7 = 4(r) + 2(w) + 1(x) pour le propriétaire. 5 = 4(r) + 1(x) pour le groupe et les autres.' }
            ),
            createQ(
                'a2-linux-q9',
                9,
                'Dans un programme multithread utilisant la bibliothèque POSIX Threads (`pthread`), quel mécanisme permet d\'empêcher une condition de course (Race Condition) lors de l\'accès à une variable partagée ?',
                [
                    { id: 'A', text: 'Un Mutex (Mutual Exclusion) avec `pthread_mutex_lock` et `pthread_mutex_unlock`.', isExpected: true },
                    { id: 'B', text: 'L\'utilisation de boucles `while(1)`.', isExpected: false },
                    { id: 'C', text: 'L\'augmentation de la priorité du processus.', isExpected: false },
                    { id: 'D', text: 'L\'appel à `exit(0)`.', isExpected: false }
                ],
                { explanation: 'Un mutex protège la section critique en garantissant qu\'un seul thread à la fois peut exécuter le code accédant à la variable partagée.' }
            ),
            createQ(
                'a2-linux-q10',
                10,
                'Quelle est la conséquence d\'une déréférenciation de pointeur NULL (`int *p = NULL; *p = 42;`) en C ?',
                [
                    { id: 'A', text: 'Une erreur de segmentation (Segmentation Fault / SIGSEGV) entraînant le crash immédiat du programme.', isExpected: true },
                    { id: 'B', text: 'La variable est automatiquement créée sur le disque.', isExpected: false },
                    { id: 'C', text: 'Le compilateur ignore l\'instruction silencieusement.', isExpected: false },
                    { id: 'D', text: 'La mémoire RAM est libérée.', isExpected: false }
                ],
                { explanation: 'L\'adresse 0 (NULL) est protégée par la MMU et le système d\'exploitation. Toute tentative de lecture ou écriture provoque un signal SIGSEGV.' }
            ),
            createQ(
                'a2-linux-q11',
                11,
                'Quel appel système de la famille `exec` (ex: `execve`, `execlp`) permet de remplacer l\'image mémoire du processus courant par un nouveau programme exécutable ?',
                [
                    { id: 'A', text: 'execve()', isExpected: true },
                    { id: 'B', text: 'fork()', isExpected: false },
                    { id: 'C', text: 'clone()', isExpected: false },
                    { id: 'D', text: 'pipe()', isExpected: false }
                ],
                { explanation: '\`execve()\` charge et exécute un nouvel exécutable dans l\'espace d\'adressage du processus appelant, remplaçant son code et sa pile.' }
            ),
            createQ(
                'a2-linux-q12',
                12,
                'Quel mécanisme IPC (Inter-Process Communication) sous Linux permet d\'établir un canal de communication unidirectionnel entre deux processus apparentés (souvent créé avant un fork) ?',
                [
                    { id: 'A', text: 'Un Tube anonyme (Pipe) créé via l\'appel `pipe(int fd[2])`.', isExpected: true },
                    { id: 'B', text: 'Une variable globale simple.', isExpected: false },
                    { id: 'C', text: 'Un fichier temporaire sur clé USB.', isExpected: false },
                    { id: 'D', text: 'Un cookie de session HTTP.', isExpected: false }
                ],
                { explanation: '\`pipe(fd)\` crée deux descripteurs de fichiers : \`fd[0]\` pour la lecture et \`fd[1]\` pour l\'écriture, permettant la transmission d\'octets en flux unidirectionnel.' }
            )
        ],
        stats: {
            correctCount: 12,
            partialCount: 0,
            incorrectCount: 0,
            totalDiscordances: 0,
            typeCounts: {
                single_choice: 12,
                multiple_choice: 0,
                fill_blank: 0,
                matching: 0,
                image_matching: 0,
                ordering: 0,
                true_false: 0,
                short_answer: 0,
                code_analysis: 0
            }
        },
        metadata: {
            fileName: 'CCTL_A2_Linux_Systeme_C_2025.pdf',
            totalPages: 6,
            parsedAt: new Date().toISOString(),
            source: 'database'
        }
    }
};

export const ALL_SEED_CCTLS: PublishedCCTLEntry[] = [
    CCTL_FISA_A3_DEV_WEB,
    CCTL_FISA_A3_BDD_SQL,
    CCTL_FISA_A3_CYBER_RESEAUX,
    CCTL_FISA_A3_ARCHI_PATTERNS,
    CCTL_FISA_A3_AGILE_SCRUM,
    CCTL_FISE_A3_ALGO_DATA,
    CCTL_FISA_A4_DEVOPS,
    CCTL_A2_LINUX_SYSTEME
];
