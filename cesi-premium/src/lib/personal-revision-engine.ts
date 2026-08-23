import { getSkillsDiagnostic, calculatePredictiveGrade, SkillScore } from './skills-diagnostic';
import { CCTLQuestion } from '@/types/cctl';

export interface DailyWorkoutPlan {
    date: string;
    targetSkills: SkillScore[];
    questions: CCTLQuestion[];
    totalQuestions: number;
    estimatedMinutes: number;
    streakDays: number;
    isCompletedToday: boolean;
    todayScore?: number;
}

export interface PromoLeaderboardEntry {
    rank: number;
    name: string;
    campus: string;
    promo: string;
    scoreOn20: number;
    accuracyPct: number;
    isCurrentUser?: boolean;
    avatarLetter: string;
}

export interface CampusLeaderboardStats {
    userRank: number;
    totalStudentsInCohort: number;
    percentileTopPct: number;
    campusName: string;
    promo: string;
    userScoreOn20: number;
    averageScoreOn20: number;
    topScoreOn20: number;
    gapToFirstPts: number;
    rankings: PromoLeaderboardEntry[];
}

const WORKOUT_STORAGE_KEY = 'kompas_daily_workout_state';

// High-yield questions bank for daily workouts targeting specific weaknesses
const WEAKNESS_QUESTIONS_BANK: Record<string, CCTLQuestion[]> = {
    'cyber-sec': [
        {
            id: 'daily-sec-1',
            number: 1,
            type: 'single_choice',
            typeLabel: 'Cybersécurité OWASP',
            status: 'correct',
            discordanceCount: 0,
            correctAnswersCount: 1,
            prompt: 'Quelle est la protection la plus efficace contre les attaques CSRF (Cross-Site Request Forgery) sur une application SPA moderne avec API REST ?',
            choices: [
                { id: 'A', text: 'Stocker le JWT dans le LocalStorage sans en-tête d\'autorisation', isExpected: false },
                { id: 'B', text: 'Utiliser un cookie avec l\'attribut SameSite=Strict (ou Lax) et un token anti-CSRF synchronisé', isExpected: true },
                { id: 'C', text: 'Désactiver le protocole HTTPS en local pour éviter les interférences TLS', isExpected: false },
                { id: 'D', text: 'Encoder toutes les requêtes HTTP en Base64', isExpected: false }
            ],
            explanation: 'L\'attribut SameSite=Strict sur les cookies d\'authentification empêche le navigateur d\'envoyer le cookie lors de requêtes initiées par un site tiers, neutralisant l\'attaque CSRF.'
        },
        {
            id: 'daily-sec-2',
            number: 2,
            type: 'single_choice',
            typeLabel: 'Sécurité Web',
            status: 'correct',
            discordanceCount: 0,
            correctAnswersCount: 1,
            prompt: 'Quelle politique CSP (Content Security Policy) neutralise l\'exécution de scripts inline injectés par une faille XSS ?',
            choices: [
                { id: 'A', text: "script-src 'unsafe-inline' *", isExpected: false },
                { id: 'B', text: "script-src 'self' https://trusted.cdn.com (sans 'unsafe-inline')", isExpected: true },
                { id: 'C', text: "default-src *", isExpected: false },
                { id: 'D', text: "frame-ancestors 'none'", isExpected: false }
            ],
            explanation: "En omettant 'unsafe-inline' dans la directive script-src, le navigateur bloque strictement l'exécution de tout tag <script> non autorisé inséré dans le DOM."
        }
    ],
    'devops-infra': [
        {
            id: 'daily-ops-1',
            number: 1,
            type: 'single_choice',
            typeLabel: 'Conteneurisation Docker',
            status: 'correct',
            discordanceCount: 0,
            correctAnswersCount: 1,
            prompt: 'Pourquoi privilégie-t-on le Multi-Stage Build dans un Dockerfile de production Next.js ou Node.js ?',
            choices: [
                { id: 'A', text: 'Pour exécuter plusieurs conteneurs simultanément dans une seule image', isExpected: false },
                { id: 'B', text: 'Pour isoler l\'environnement de build (compilateurs, devDependencies) et ne conserver que le runtime optimisé dans l\'image finale', isExpected: true },
                { id: 'C', text: 'Pour contourner les limites de mémoire du démon Docker', isExpected: false },
                { id: 'D', text: 'Pour fusionner Docker et Kubernetes sans configuration réseau', isExpected: false }
            ],
            explanation: 'Le Multi-stage build permet de réduire drastiquement la taille de l\'image finale et d\'éliminer les outils de build et secrets inutiles en production.'
        },
        {
            id: 'daily-ops-2',
            number: 2,
            type: 'single_choice',
            typeLabel: 'Orchestration Kubernetes',
            status: 'correct',
            discordanceCount: 0,
            correctAnswersCount: 1,
            prompt: 'Quel objet Kubernetes permet d\'exposer un ensemble de Pods avec un point d\'entrée réseau stable et un équilibrage de charge interne ?',
            choices: [
                { id: 'A', text: 'Un ConfigMap', isExpected: false },
                { id: 'B', text: 'Un Service (de type ClusterIP ou NodePort)', isExpected: true },
                { id: 'C', text: 'Un StatefulSet sans headless service', isExpected: false },
                { id: 'D', text: 'Un VolumeClaim', isExpected: false }
            ],
            explanation: 'Le Service Kubernetes utilise des sélecteurs de labels pour router dynamiquement le trafic vers les Pods sains correspondants.'
        }
    ],
    'db-sql': [
        {
            id: 'daily-bdd-1',
            number: 1,
            type: 'single_choice',
            typeLabel: 'Modélisation BDD',
            status: 'correct',
            discordanceCount: 0,
            correctAnswersCount: 1,
            prompt: 'Dans le modèle relationnel, que garantit la Troisième Forme Normale (3NF) ?',
            choices: [
                { id: 'A', text: 'Tous les attributs sont atomiques', isExpected: false },
                { id: 'B', text: 'Aucune dépendance transitive entre attributs non-clés et la clé primaire', isExpected: true },
                { id: 'C', text: 'La base de données ne contient aucun index B-Tree', isExpected: false },
                { id: 'D', text: 'Toutes les tables sont dénormalisées pour accélérer les jointures', isExpected: false }
            ],
            explanation: 'La 3NF exige d\'être en 2NF et qu\'aucun attribut non-clé ne dépende d\'un autre attribut non-clé (élimination des dépendances transitives).'
        }
    ],
    'web-arch': [
        {
            id: 'daily-web-1',
            number: 1,
            type: 'single_choice',
            typeLabel: 'Next.js & React',
            status: 'correct',
            discordanceCount: 0,
            correctAnswersCount: 1,
            prompt: 'Dans Next.js App Router, quel est le comportement par défaut d\'un composant situé dans le dossier app/ ?',
            choices: [
                { id: 'A', text: 'Il s\'exécute exclusivement côté client (Client Component)', isExpected: false },
                { id: 'B', text: 'Il est rendu par défaut côté serveur (React Server Component - RSC)', isExpected: true },
                { id: 'C', text: 'Il est compilé en WebAssembly', isExpected: false },
                { id: 'D', text: 'Il nécessite obligatoirement la directive "use client"', isExpected: false }
            ],
            explanation: 'Dans Next.js (App Router), tous les composants sont des Server Components par défaut, réduisant la taille du bundle JavaScript envoyé au navigateur.'
        }
    ]
};

/**
 * Generates the personalized daily workout targeting student's specific weaknesses.
 */
export function getPersonalDailyWorkout(): DailyWorkoutPlan {
    const todayStr = new Date().toISOString().split('T')[0];
    const skills = getSkillsDiagnostic();

    // Find the 2 weakest skills (< 70% or lowest scores)
    const sortedWeaknesses = [...skills].sort((a, b) => a.mastery - b.mastery);
    const targetSkills = sortedWeaknesses.slice(0, 2);

    // Pick questions matching these specific weaknesses
    const questions: CCTLQuestion[] = [];
    targetSkills.forEach(skill => {
        const bank = WEAKNESS_QUESTIONS_BANK[skill.id] || WEAKNESS_QUESTIONS_BANK['cyber-sec'];
        questions.push(...bank);
    });

    // Fallback if needed
    if (questions.length === 0) {
        questions.push(...WEAKNESS_QUESTIONS_BANK['cyber-sec']);
    }

    // Load saved streak state
    let streakDays = 7;
    let isCompletedToday = false;
    let todayScore: number | undefined = undefined;

    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(WORKOUT_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.lastDate === todayStr) {
                    isCompletedToday = parsed.isCompleted;
                    todayScore = parsed.score;
                    streakDays = parsed.streak || 7;
                }
            }
        } catch {}
    }

    return {
        date: todayStr,
        targetSkills,
        questions: questions.slice(0, 5),
        totalQuestions: Math.min(5, questions.length),
        estimatedMinutes: 5,
        streakDays,
        isCompletedToday,
        todayScore
    };
}

/**
 * Records completion of the daily workout.
 */
export function recordDailyWorkoutCompletion(scorePct: number) {
    if (typeof window === 'undefined') return;
    const todayStr = new Date().toISOString().split('T')[0];

    const currentWorkout = getPersonalDailyWorkout();
    const newStreak = currentWorkout.isCompletedToday ? currentWorkout.streakDays : currentWorkout.streakDays + 1;

    const data = {
        lastDate: todayStr,
        isCompleted: true,
        score: scorePct,
        streak: newStreak
    };

    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('kompas_workout_completed'));
}

/**
 * Calculates student's rank, percentile, and leaderboard in their campus cohort.
 */
export function getCampusLeaderboard(userCampus: string = 'Strasbourg', userPromo: string = 'A3'): CampusLeaderboardStats {
    const skills = getSkillsDiagnostic();
    const prediction = calculatePredictiveGrade(skills);
    const userScore = prediction.predictedScoreOn20;

    // Representative cohort for the campus
    const cohortStudents: { name: string; score: number; accuracy: number; avatar: string }[] = [
        { name: 'Alexandre M.', score: 18.5, accuracy: 94, avatar: 'A' },
        { name: 'Camille D.', score: 17.2, accuracy: 89, avatar: 'C' },
        { name: 'Thomas L.', score: 16.8, accuracy: 88, avatar: 'T' },
        { name: 'Vous (Compte Personnel)', score: userScore, accuracy: Math.round((userScore / 20) * 100), avatar: 'V' },
        { name: 'Sophie B.', score: 13.8, accuracy: 76, avatar: 'S' },
        { name: 'Maxime R.', score: 12.5, accuracy: 71, avatar: 'M' },
        { name: 'Hugo P.', score: 11.2, accuracy: 64, avatar: 'H' },
        { name: 'Inès K.', score: 9.8, accuracy: 52, avatar: 'I' }
    ];

    // Sort by score descending
    cohortStudents.sort((a, b) => b.score - a.score);

    let userRank = 4;
    const totalStudentsInCohort = 48; // Total students in this campus promo

    const rankings: PromoLeaderboardEntry[] = cohortStudents.map((s, idx) => {
        const isCurrent = s.name.startsWith('Vous');
        if (isCurrent) userRank = idx + 1;

        return {
            rank: idx + 1,
            name: isCurrent ? 'Vous' : s.name,
            campus: userCampus,
            promo: userPromo,
            scoreOn20: s.score,
            accuracyPct: s.accuracy,
            isCurrentUser: isCurrent,
            avatarLetter: s.avatar
        };
    });

    const percentileTopPct = Math.round((userRank / totalStudentsInCohort) * 100);
    const topScore = cohortStudents[0].score;
    const gapToFirstPts = parseFloat(Math.max(0, topScore - userScore).toFixed(1));
    const averageScore = 13.4;

    return {
        userRank,
        totalStudentsInCohort,
        percentileTopPct,
        campusName: userCampus,
        promo: userPromo,
        userScoreOn20: userScore,
        averageScoreOn20: averageScore,
        topScoreOn20: topScore,
        gapToFirstPts,
        rankings
    };
}
