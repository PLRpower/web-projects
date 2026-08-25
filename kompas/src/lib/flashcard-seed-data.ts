import { FlashcardDeck } from '@/types/flashcard';

export const SEED_FLASHCARD_DECKS: FlashcardDeck[] = [
    {
        id: 'deck-maths-analyse-ingenieur',
        title: 'Mathématiques & Analyse Appliquée pour l\'Ingénieur',
        description: 'Transformée de Laplace, calcul matriciel, équations différentielles et lois de probabilités fondamentales.',
        promo: 'A2',
        specialty: 'Toutes Spécialités CESI',
        domain: 'Sciences & Mathématiques',
        tags: ['Mathématiques', 'Matrices', 'Laplace', 'Probabilités', 'Analyse'],
        authorName: 'Alexandre Martin (A2)',
        isPublic: true,
        createdAt: '2026-02-01T09:00:00.000Z',
        updatedAt: '2026-02-18T10:30:00.000Z',
        likesCount: 38,
        practicesCount: 165,
        cards: [
            {
                id: 'maths-1',
                front: 'Quelle est la définition et l\'utilité de la Transformée de Laplace en ingénierie ?',
                back: 'Elle transforme une équation différentielle temporelle f(t) en une équation algébrique simple dans le domaine fréquentiel complexe F(s), facilitant grandement l\'étude des systèmes linéaires et des fonctions de transfert.'
            },
            {
                id: 'maths-2',
                front: 'Qu\'indique le déterminant d\'une matrice carrée A lorsqu\'il est nul (det(A) = 0) ?',
                back: 'La matrice est dite singulière (non inversible), ses vecteurs colonnes sont linéairement dépendants et le système d\'équations linéaires associé n\'admet pas de solution unique.'
            },
            {
                id: 'maths-3',
                front: 'Qu\'énonce le Théorème Central Limite (TCL) en statistiques ?',
                back: 'La somme ou moyenne d\'un grand nombre de variables aléatoires indépendantes et identiquement distribuées tend vers une loi normale (gaussienne), quelle que soit la loi d\'origine.'
            },
            {
                id: 'maths-4',
                front: 'Quelle est la condition nécessaire pour qu\'une fonction f soit dérivable en un point x₀ ?',
                back: 'La fonction doit être continue en ce point et le taux d\'accroissement [f(x₀+h) - f(x₀)] / h doit admettre une limite finie lorsque h tend vers 0 (à gauche et à droite).'
            }
        ]
    },
    {
        id: 'deck-gestion-projet-agile',
        title: 'Gestion de Projet, Méthodes Agiles & RSE',
        description: 'Rôles Scrum, matrice RACI, diagramme d\'Ishikawa, calcul de chemin critique (PERT) et démarche RSE de l\'ingénieur.',
        promo: 'A3',
        specialty: 'Toutes Spécialités CESI',
        domain: 'Gestion de Projet & Management',
        tags: ['Scrum', 'RACI', 'PERT', 'Gestion de Risques', 'RSE', 'Ingénierie'],
        authorName: 'Camille Dubois (A3)',
        isPublic: true,
        createdAt: '2026-01-20T14:00:00.000Z',
        updatedAt: '2026-02-12T16:45:00.000Z',
        likesCount: 29,
        practicesCount: 134,
        cards: [
            {
                id: 'gp-1',
                front: 'Que signifient les 4 lettres de la matrice des responsabilités RACI ?',
                back: '• R = Responsible (Réalisateur)\n• A = Accountable (Décideur / Approbateur unique)\n• C = Consulted (Consulté pour expertise)\n• I = Informed (Informé de l\'avancement)'
            },
            {
                id: 'gp-2',
                front: 'Quel est le rôle précis du Product Owner (PO) dans l\'équipe Scrum ?',
                back: 'Le PO est garant de la vision produit et maximise la valeur créée. Il rédige et ordonnance le Product Backlog en fonction des besoins utilisateurs et des priorités business.'
            },
            {
                id: 'gp-3',
                front: 'Qu\'est-ce que le "Chemin Critique" dans un diagramme PERT ?',
                back: 'C\'est la séquence de tâches dépendantes dont la marge totale est nulle. Tout retard sur une tâche du chemin critique retarde directement la date finale de livraison du projet.'
            },
            {
                id: 'gp-4',
                front: 'Quels sont les 5M du diagramme d\'Ishikawa (cause-effet) ?',
                back: '• Matière (ressources, intrants)\n• Matériel (machines, logiciels, outils)\n• Méthode (processus, protocoles)\n• Main d\'œuvre (compétences, équipe)\n• Milieu (environnement de travail, contexte)'
            }
        ]
    },
    {
        id: 'deck-clean-code-solid',
        title: 'Principes SOLID & Conception Modulaire',
        description: 'Les 5 principes fondamentaux d\'architecture modulaire, couplage faible et haute cohésion.',
        promo: 'A3',
        specialty: 'FISA / FISE Info',
        domain: 'Développement & Algorithmique',
        tags: ['SOLID', 'Clean Code', 'Design Patterns', 'Architecture'],
        authorName: 'Paul THOMAS (FISA A3)',
        isPublic: true,
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-02-10T14:30:00.000Z',
        likesCount: 28,
        practicesCount: 142,
        cards: [
            {
                id: 'solid-1',
                front: 'Que stipule le principe de Responsabilité Unique (SRP - Single Responsibility Principle) ?',
                back: 'Un module ou une classe ne doit avoir qu\'une seule et unique raison de changer, c\'est-à-dire être dédié à un seul rôle ou cas d\'usage métier.'
            },
            {
                id: 'solid-2',
                front: 'Quelle est la règle du principe Ouvert/Fermé (OCP - Open/Closed Principle) ?',
                back: 'Les entités (classes, modules) doivent être ouvertes à l\'extension mais fermées à la modification via le polymorphisme et les abstractions.'
            },
            {
                id: 'solid-3',
                front: 'En quoi consiste le principe de Substitution de Liskov (LSP) ?',
                back: 'Les sous-classes doivent pouvoir remplacer leur classe parente sans altérer le fonctionnement correct ni violer les contrats de service.'
            },
            {
                id: 'solid-4',
                front: 'Expliquez le principe de Ségrégation des Interfaces (ISP).',
                back: 'Les composants ne doivent pas être contraints de dépendre de contrats ou d\'interfaces qu\'ils n\'utilisent pas. Mieux vaut des interfaces courtes et spécialisées.'
            },
            {
                id: 'solid-5',
                front: 'Que préconise le principe d\'Inversion des Dépendances (DIP) ?',
                back: 'Les modules de haut niveau ne doivent pas dépendre des détails de bas niveau : tous deux doivent dépendre d\'abstractions découplées.'
            }
        ]
    },
    {
        id: 'deck-cyber-tls-crypto',
        title: 'Cybersécurité, Réseaux & Protection des Données',
        description: 'Vecteurs d\'attaque, chiffrement asymétrique, segmentation réseau et conformité RGPD.',
        promo: 'A3',
        specialty: 'Toutes Spécialités CESI',
        domain: 'Réseau & Cybersécurité',
        tags: ['Cybersécurité', 'TLS 1.3', 'Chiffrement', 'RGPD', 'Réseau'],
        authorName: 'Julien Lefebvre (Cyber A3)',
        isPublic: true,
        createdAt: '2026-01-25T08:30:00.000Z',
        updatedAt: '2026-02-18T11:00:00.000Z',
        likesCount: 42,
        practicesCount: 188,
        cards: [
            {
                id: 'cyber-1',
                front: 'Quelle est la différence fondamentale entre chiffrement symétrique et asymétrique ?',
                back: '• Symétrique : Une seule et même clé secrète partagée sert au chiffrement et au déchiffrement (très rapide, ex: AES-256).\n• Asymétrique : Une paire de clés (clé publique pour chiffrer, clé privée gardée secrète pour déchiffrer, ex: RSA, ECC).'
            },
            {
                id: 'cyber-2',
                front: 'Qu\'est-ce que le principe du "Moindre Privilège" (PoLP) en sécurité ?',
                back: 'Chaque utilisateur, système ou processus ne doit disposer que des droits et accès strictement indispensables à l\'accomplissement de sa mission, et pour une durée limitée.'
            },
            {
                id: 'cyber-3',
                front: 'Pourquoi les fonctions de hachage comme SHA-256 ne suffisent-elles pas pour stocker des mots de passe ?',
                back: 'Parce que SHA-256 est trop rapide (vulnérable aux GPU/ASIC). Il faut employer des fonctions de dérivation lentes avec coût et sel intégrés (Argon2id ou bcrypt).'
            }
        ]
    }
];
