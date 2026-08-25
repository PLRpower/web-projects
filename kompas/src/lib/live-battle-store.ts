'use client';

import { CCTLQuestion } from '@/types/cctl';

export interface LivePlayer {
    id: string;
    nickname: string;
    score: number;
    avatar: string;
    answers: Record<number, { choiceId: string; timeMs: number; isCorrect: boolean }>;
    missedQuestions: CCTLQuestion[];
}

export interface LiveBattleSession {
    pin: string;
    title: string;
    promo: string;
    subject: string;
    hostName: string;
    createdAt: string;
    status: 'lobby' | 'question' | 'reveal' | 'podium';
    currentQuestionIndex: number;
    totalQuestions: number;
    timeRemaining: number;
    questions: CCTLQuestion[];
    players: Record<string, LivePlayer>;
}

const LIVE_SESSIONS_KEY = 'kompas_live_battles';
const BROADCAST_CHANNEL_NAME = 'kompas_live_battle_channel';

const DEFAULT_QUESTIONS_BATTLE: CCTLQuestion[] = [
    {
        id: 'battle-q1',
        number: 1,
        type: 'single_choice',
        typeLabel: 'Cybersécurité & Headers',
        status: 'correct',
        discordanceCount: 0,
        correctAnswersCount: 1,
        prompt: 'Quel en-tête HTTP empêche votre application web d\'être intégrée dans une iframe malveillante (protection anti-Clickjacking) ?',
        choices: [
            { id: 'A', text: 'X-Frame-Options: DENY (ou CSP frame-ancestors)', isExpected: true },
            { id: 'B', text: 'Access-Control-Allow-Origin: *', isExpected: false },
            { id: 'C', text: 'Strict-Transport-Security: max-age=0', isExpected: false },
            { id: 'D', text: 'Cache-Control: no-cache', isExpected: false }
        ],
        explanation: 'X-Frame-Options: DENY ou Content-Security-Policy: frame-ancestors \'none\' interdit formellement à tout site tiers d\'imbriquer la page.'
    },
    {
        id: 'battle-q2',
        number: 2,
        type: 'single_choice',
        typeLabel: 'Bases de Données & ACID',
        status: 'correct',
        discordanceCount: 0,
        correctAnswersCount: 1,
        prompt: 'Dans les propriétés ACID des transactions SQL, que signifie la lettre "I" (Isolation) ?',
        choices: [
            { id: 'A', text: 'Les index B-Tree sont régénérés instantanément', isExpected: false },
            { id: 'B', text: 'L\'exécution concurrente de plusieurs transactions produit le même résultat qu\'une exécution séquentielle', isExpected: true },
            { id: 'C', text: 'Toutes les tables sont stockées sur un disque isolé', isExpected: false },
            { id: 'D', text: 'Les clés primaires sont irréversibles', isExpected: false }
        ],
        explanation: 'L\'Isolation garantit que les transactions en cours d\'exécution simultanée ne se perturbent pas mutuellement et évitent les lectures sales (dirty reads).'
    },
    {
        id: 'battle-q3',
        number: 3,
        type: 'single_choice',
        typeLabel: 'Architecture & Next.js',
        status: 'correct',
        discordanceCount: 0,
        correctAnswersCount: 1,
        prompt: 'Quelle est la méthode recommandée dans Next.js pour revalider automatiquement des données générées en statique (ISR) toutes les 60 secondes ?',
        choices: [
            { id: 'A', text: 'setInterval() dans un hook useEffect', isExpected: false },
            { id: 'B', text: 'fetch(url, { next: { revalidate: 60 } })', isExpected: true },
            { id: 'C', text: 'Redémarrer le serveur Node.js via un Cron Linux', isExpected: false },
            { id: 'D', text: 'Désactiver le cache du navigateur client', isExpected: false }
        ],
        explanation: 'L\'option next: { revalidate: 60 } active la Revalidation Incrémentale Statique (ISR) côté serveur Next.js.'
    },
    {
        id: 'battle-q4',
        number: 4,
        type: 'single_choice',
        typeLabel: 'Génie Logiciel & SOLID',
        status: 'correct',
        discordanceCount: 0,
        correctAnswersCount: 1,
        prompt: 'Selon le principe de Substitution de Liskov (LSP), que doit respecter une sous-classe dérivée ?',
        choices: [
            { id: 'A', text: 'Elle doit pouvoir remplacer sa classe de base sans altérer la cohérence du programme', isExpected: true },
            { id: 'B', text: 'Elle doit obligatoirement être instanciée via le pattern Singleton', isExpected: false },
            { id: 'C', text: 'Elle ne peut contenir aucune méthode privée', isExpected: false },
            { id: 'D', text: 'Elle doit hériter d\'au moins trois interfaces', isExpected: false }
        ],
        explanation: 'Le principe LSP (L de SOLID) stipule que les objets d\'une classe dérivée doivent pouvoir être substitués aux objets de la classe mère sans briser l\'application.'
    }
];

function getBroadcastChannel(): BroadcastChannel | null {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    }
    return null;
}

function broadcastEvent(type: string, data: any) {
    const channel = getBroadcastChannel();
    if (channel) {
        channel.postMessage({ type, data });
    }
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kompas_live_event', { detail: { type, data } }));
    }
}

/**
 * Loads all live sessions from storage.
 */
function getAllSessions(): Record<string, LiveBattleSession> {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem(LIVE_SESSIONS_KEY);
        if (saved) return JSON.parse(saved);
    } catch {}
    return {};
}

function saveAllSessions(sessions: Record<string, LiveBattleSession>) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(LIVE_SESSIONS_KEY, JSON.stringify(sessions));
    } catch {}
}

/**
 * Creates a new live battle session on the host screen.
 */
export function createLiveBattleSession(params?: {
    title?: string;
    promo?: string;
    subject?: string;
    hostName?: string;
    questions?: CCTLQuestion[];
}): LiveBattleSession {
    const pin = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN e.g. "8421"
    const questions = params?.questions && params.questions.length > 0 ? params.questions : DEFAULT_QUESTIONS_BATTLE;

    const session: LiveBattleSession = {
        pin,
        title: params?.title || 'CCTL Live Promo : Sécurité & Dev Web',
        promo: params?.promo || 'A3 Info',
        subject: params?.subject || 'Architecture Web & Cybersécurité',
        hostName: params?.hostName || 'Élève-Ingénieur (Hôte)',
        createdAt: new Date().toISOString(),
        status: 'lobby',
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        timeRemaining: 20,
        questions,
        players: {}
    };

    const sessions = getAllSessions();
    sessions[pin] = session;
    saveAllSessions(sessions);
    broadcastEvent('session_created', session);

    return session;
}

/**
 * Gets a session by PIN.
 */
export function getLiveBattleSession(pin: string): LiveBattleSession | null {
    const sessions = getAllSessions();
    return sessions[pin] || null;
}

/**
 * Joins a live battle from student smartphone.
 */
export function joinLiveBattle(pin: string, nickname: string): { success: boolean; player?: LivePlayer; error?: string } {
    const sessions = getAllSessions();
    const session = sessions[pin];

    if (!session) {
        return { success: false, error: 'Code PIN introuvable. Vérifiez l\'écran du rétroprojecteur.' };
    }

    const playerId = `player-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const avatars = ['🦊', '🚀', '⚡', '💻', '🐺', '🦁', '🎯', '🔥', '🛡️', '🧠'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const player: LivePlayer = {
        id: playerId,
        nickname: nickname.trim() || 'Élève CESI',
        score: 0,
        avatar: randomAvatar,
        answers: {},
        missedQuestions: []
    };

    session.players[playerId] = player;
    sessions[pin] = session;
    saveAllSessions(sessions);

    broadcastEvent('player_joined', { pin, player });
    return { success: true, player };
}

/**
 * Submits an answer from a smartphone.
 */
export function submitPlayerAnswer(pin: string, playerId: string, questionIndex: number, choiceId: string, timeMs: number) {
    const sessions = getAllSessions();
    const session = sessions[pin];
    if (!session) return;

    const player = session.players[playerId];
    const q = session.questions[questionIndex];
    if (!player || !q) return;

    const isCorrect = q.choices.find(c => c.id === choiceId)?.isExpected || false;

    // Speed bonus: up to 1000 pts (faster answer = more points)
    const pointsEarned = isCorrect ? Math.max(500, Math.round(1000 - (timeMs / 20000) * 500)) : 0;

    player.score += pointsEarned;
    player.answers[questionIndex] = { choiceId, timeMs, isCorrect };

    if (!isCorrect) {
        player.missedQuestions.push(q);
    }

    sessions[pin] = session;
    saveAllSessions(sessions);

    broadcastEvent('answer_submitted', { pin, playerId, questionIndex, choiceId, isCorrect });
}

/**
 * Advances the session state on the host screen.
 */
export function updateSessionStatus(pin: string, status: LiveBattleSession['status'], questionIndex?: number) {
    const sessions = getAllSessions();
    const session = sessions[pin];
    if (!session) return;

    session.status = status;
    if (typeof questionIndex === 'number') {
        session.currentQuestionIndex = questionIndex;
    }
    if (status === 'question') {
        session.timeRemaining = 20;
    }

    sessions[pin] = session;
    saveAllSessions(sessions);

    broadcastEvent('status_changed', { pin, status, questionIndex: session.currentQuestionIndex });
}
