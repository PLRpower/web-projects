import { PrositEntry } from '@/types/prosit';

export const ALL_SEED_PROSITS: PrositEntry[] = [
    {
        id: 'prosit-web-jwt-rest',
        title: 'Conception & Sécurisation d\'une API RESTful Node.js / PostgreSQL',
        subject: 'Architecture Web & Authentification Sécurisée',
        promo: 'A3',
        specialty: 'Informatique',
        year: '2025',
        authorName: 'Alexandre Martin (A3)',
        isAnonymous: false,
        publishedAt: '2025-10-15T14:30:00.000Z',
        viewsCount: 524,
        downloadsCount: 198,
        keywords: ['OAuth 2.0', 'JWT Bearer', 'Express.js', 'PostgreSQL', 'ACID', 'Clean Code', 'CORS', 'Argon2'],
        context: 'L\'entreprise FinTech "SecurePay" développe une plateforme de micro-paiement. L\'équipe backend doit remplacer un vieux monolithe par une API RESTful haute performance devant gérer 500 req/sec avec conformité PCI-DSS.',
        problemStatement: 'Comment concevoir et sécuriser une API RESTful scalable respectant les standards OWASP pour une application multi-utilisateurs ?',
        constraints: [
            'Temps de réponse p95 < 150ms sous charge continue',
            'Authentification par JSON Web Token (JWT) asymétrique RS256',
            'Chiffrement des mots de passe avec sel aléatoire et Argon2id',
            'Architecture modulaire en couches (Controller / Service / Repository)',
            'Base de données relationnelle normalisée en 3NF'
        ],
        hypotheses: [
            'L\'utilisation d\'un middleware de validation de schéma (Zod/Joi) élimine 90% des injections SQL/XSS',
            'Le découplage des tokens d\'accès (courte durée 15min) et tokens de rafraîchissement (stockés en httpOnly) protège contre le vol de session',
            'L\'isolation des requêtes dans un pool de connexions PostgreSQL pg-pool optimise l\'utilisation des ressources CPU'
        ],
        actionPlan: [
            '1. Définition du contrat d\'API selon la spécification OpenAPI 3.0',
            '2. Modélisation relationnelle de la base de données et scripts DDL',
            '3. Implémentation du pipeline d\'authentification (login, refresh, middleware verifyToken)',
            '4. Développement des routes CRUD avec validation stricte des DTOs',
            '5. Écriture des tests d\'intégration avec Supertest et Jest',
            '6. Benchmarking de charge avec k6 et audit de sécurité OWASP ZAP'
        ],
        deliverables: [
            'Code source documenté avec architecture en couches',
            'Spécification OpenAPI / Swagger UI accessible',
            'Rapport d\'analyse de performance et métriques de charge',
            'Fiche méthodologique de synthèse et retours d\'expérience'
        ],
        roles: {
            animateur: 'Lucas B.',
            scribe: 'Sarah D.',
            secretaire: 'Thomas P.',
            gestionnaire: 'Alexandre M.'
        }
    },
    {
        id: 'prosit-bdd-optimisation',
        title: 'Modélisation Relationnelle Avancée & Optimisation de Requêtes SQL',
        subject: 'Bases de Données Relationnelles & Performances',
        promo: 'A3',
        specialty: 'Informatique',
        year: '2025',
        authorName: 'Camille Dubois (A3)',
        isAnonymous: false,
        publishedAt: '2025-11-02T09:15:00.000Z',
        viewsCount: 412,
        downloadsCount: 167,
        keywords: ['3NF', 'BCNF', 'B-Tree Index', 'EXPLAIN ANALYZE', 'Window Functions', 'ACID', 'Transactions'],
        context: 'Une plateforme e-commerce en forte croissance subit des ralentissements majeurs lors des périodes de soldes. Certaines requêtes de consultation du catalogue et de génération de rapports financiers bloquent les tables.',
        problemStatement: 'Comment normaliser une base de données transactionnelle et optimiser le temps de réponse des requêtes complexes sous forte charge ?',
        constraints: [
            'Respect strict des propriétés ACID sur les écritures de commandes',
            'Interdiction de modifier les schémas existants en production sans migration sans coupure',
            'Temps d\'exécution des requêtes de recherche < 50ms',
            'Traçabilité complète des transactions via des triggers d\'audit'
        ],
        hypotheses: [
            'L\'ajout d\'index composites B-Tree sur les clés de jointure et de filtrage supprime les Sequential Scans coûteux',
            'L\'utilisation de fonctions fenêtrées SQL (Window Functions) remplace avantageusement les sous-requêtes imbriquées',
            'Le partitionnement horizontal des tables de logs historiques allège les tables actives'
        ],
        actionPlan: [
            '1. Audit des requêtes lentes avec pg_stat_statements et EXPLAIN ANALYZE',
            '2. Normalisation du schéma conceptuel en 3e forme normale (3NF)',
            '3. Stratégie d\'indexation ciblée (index partiels et composites)',
            '4. Réécriture des requêtes analytiques lourdes avec CTE et Window Functions',
            '5. Configuration du niveau d\'isolation des transactions (Read Committed vs Serializable)'
        ],
        deliverables: [
            'Schéma relationnel révisé (MCD / MLD) validé 3NF',
            'Scripts SQL de migration et création d\'index',
            'Comparatif avant/après des plans d\'exécution EXPLAIN'
        ],
        roles: {
            animateur: 'Camille D.',
            scribe: 'Maxime R.',
            secretaire: 'Chloé V.',
            gestionnaire: 'Julien T.'
        }
    },
    {
        id: 'prosit-embarque-can-freertos',
        title: 'Bus CAN, Gestion Temps Réel & Sécurité Fonctionnelle sur STM32',
        subject: 'Systèmes Embarqués & Microcontrôleurs',
        promo: 'A3',
        specialty: 'Systèmes Embarqués',
        year: '2026',
        authorName: 'Nicolas Moreau (A3)',
        isAnonymous: false,
        publishedAt: '2026-01-18T11:00:00.000Z',
        viewsCount: 368,
        downloadsCount: 142,
        keywords: ['FreeRTOS', 'Bus CAN', 'STM32', 'ARM Cortex', 'UART', 'SPI', 'Watchdog', 'Temps Réel'],
        context: 'Pour un véhicule autonome expérimental, le sous-système de freinage d\'urgence doit communiquer avec la centrale inertielle et le calculateur moteur via un bus CAN 2.0B.',
        problemStatement: 'Comment garantir l\'absence d\'inversion de priorité et le respect des échéances temporelles strictes sur un calculateur automobile communicant ?',
        constraints: [
            'Échéance stricte temps réel dur : réaction en moins de 10ms',
            'Microcontrôleur cible : STM32F4 (ARM Cortex-M4 à 168MHz)',
            'Protocole de transmission : Bus CAN 2.0B à 500 kbps',
            'Surveillance par Watchdog matériel indépendant (IWDG)'
        ],
        hypotheses: [
            'L\'utilisation de l\'ordonnanceur préemptif basé sur les priorités de FreeRTOS garantit l\'exécution immédiate de la tâche critique',
            'L\'implémentation du protocole d\'héritage de priorité (Priority Inheritance) élimine les blocages de ressources par des tâches secondaires',
            'Le filtrage matériel des trames CAN décharge le cœur CPU'
        ],
        actionPlan: [
            '1. Analyse des exigences temporelles et matrice des tâches FreeRTOS',
            '2. Configuration des masques et filtres matériels du contrôleur CAN STM32',
            '3. Implémentation des files de messages (Queues) et sémaphores protégés',
            '4. Intégration du Watchdog et traitement des erreurs de bus',
            '5. Mesures à l\'oscilloscope et analyseur logique des temps de réponse'
        ],
        deliverables: [
            'Projet STM32CubeIDE complet et compilable',
            'Traces d\'exécution des tâches et métriques de latence',
            'Dossier de justification de la sûreté de fonctionnement'
        ],
        roles: {
            animateur: 'Nicolas M.',
            scribe: 'Antoine F.',
            secretaire: 'Emma L.',
            gestionnaire: 'Hugo G.'
        }
    },
    {
        id: 'prosit-btp-dimensionnement-rse',
        title: 'Éco-Conception, Bilan Carbone RE2020 & Résistance des Matériaux',
        subject: 'Génie Civil, Éco-Matériaux & Énergies',
        promo: 'A4',
        specialty: 'BTP & Génie Civil',
        year: '2025',
        authorName: 'Julien Lefebvre (A4)',
        isAnonymous: false,
        publishedAt: '2025-11-20T16:00:00.000Z',
        viewsCount: 295,
        downloadsCount: 110,
        keywords: ['RE2020', 'BIM', 'Eurocodes', 'Bilan Carbone', 'RDM', 'Éco-Matériaux', 'Structure Bois'],
        context: 'La métropole lance un appel d\'offres pour la construction d\'un bâtiment tertiaire bas carbone de 2500 m². L\'ouvrage doit allier ossature bois/béton et satisfaire aux seuils d\'émissions carbone RE2025.',
        problemStatement: 'Comment optimiser la performance thermique et mécanique d\'un bâtiment collectif tout en réduisant son impact carbone sous le seuil RE2025 ?',
        constraints: [
            'Conformité aux calculs structurels Eurocode 5 (Bois) et Eurocode 2 (Béton)',
            'Indicateur carbone Ic_construction < 650 kg eq CO2/m²',
            'Intégration d\'au moins 40% de matériaux biosourcés en masse',
            'Modélisation BIM collaborative au format IFC (LOD 300)'
        ],
        hypotheses: [
            'L\'emploi d\'une structure mixte poteaux-poutres bois lamellé-collé et planchers bois réduit l\'empreinte carbone de 35% par rapport au tout-béton',
            'Une isolation en fibre de bois associée à une ventilation double flux thermodynamique permet d\'atteindre les objectifs Bbio de la RE2020'
        ],
        actionPlan: [
            '1. Calcul des descentes de charges et dimensionnement des porteurs principaux (RDM)',
            '2. Analyse du Cycle de Vie (ACV) du bâtiment avec les FDES de la base INIES',
            '3. Modélisation de la maquette numérique sous Autodesk Revit',
            '4. Simulation thermique dynamique (STD) pour vérifier le confort d\'été',
            '5. Synthèse financière et analyse coût global sur 50 ans'
        ],
        deliverables: [
            'Note de calculs structurels selon les Eurocodes',
            'Rapport d\'Analyse de Cycle de Vie et Bilan Carbone',
            'Maquette numérique BIM (.IFC) exportée'
        ],
        roles: {
            animateur: 'Julien L.',
            scribe: 'Pauline M.',
            secretaire: 'Kévin D.',
            gestionnaire: 'Sarah B.'
        }
    },
    {
        id: 'prosit-gestion-industrie-lean',
        title: 'Optimisation de Flux Industriels, Lean Manufacturing & Ligne 4.0',
        subject: 'Génie Industriel & Amélioration Continue',
        promo: 'A2',
        specialty: 'Généraliste',
        year: '2025',
        authorName: 'Équipe Agora CESI',
        isAnonymous: true,
        publishedAt: '2025-12-05T10:00:00.000Z',
        viewsCount: 340,
        downloadsCount: 125,
        keywords: ['Lean 6 Sigma', 'VSM', '5S & Kaizen', 'TRS / OEE', 'IoT Industriel', 'Supply Chain', 'Kanban'],
        context: 'Une usine d\'assemblage de pompes hydrauliques fait face à des retards de livraison récurrents et un taux d\'en-cours (WIP) excessif générant des coûts d\'immobilisation élevés.',
        problemStatement: 'Comment reconfigurer une ligne de production pour absorber une variabilité de 30% de demande sans augmenter le temps de cycle ?',
        constraints: [
            'Taux de Rendement Synthétique (TRS) cible > 85%',
            'Délai de traversée (Lead Time) à diviser par deux',
            'Budget d\'investissement limité (démarche Kaizen prioritaire)',
            'Implication des opérateurs de ligne dans la démarche d\'amélioration'
        ],
        hypotheses: [
            'La cartographie de la chaîne de valeur (VSM) mettra en évidence les goulets d\'étranglement et les temps de non-valeur ajoutée',
            'La mise en place d\'un flux tiré avec système Kanban réduit drastiquement les stocks tampons',
            'L\'équilibrage des postes selon le Takt Time stabilise le rythme de production'
        ],
        actionPlan: [
            '1. Cartographie VSM de l\'état actuel et calcul du Lead Time',
            '2. Identification des 7 gaspillages (Muda) et analyse des causes racines (5 Pourquoi)',
            '3. Conception de la VSM cible en flux pièce à pièce (One Piece Flow)',
            '4. Dimensionnement des boucles Kanban et standardisation des postes (5S)',
            '5. Définition du tableau de bord de pilotage visuel et KPIs'
        ],
        deliverables: [
            'Cartographie VSM actuelle et future documentée',
            'Dimensionnement des stocks de sécurité et règles Kanban',
            'Plan de déploiement et matrice de suivi des gains'
        ],
        roles: {
            animateur: 'Théo V.',
            scribe: 'Émilie R.',
            secretaire: 'Bastien N.',
            gestionnaire: 'Lucas P.'
        }
    }
];
