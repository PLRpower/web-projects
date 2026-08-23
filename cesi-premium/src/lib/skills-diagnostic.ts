export interface SkillScore {
    id: string;
    name: string;
    shortCode: string;
    category: string;
    mastery: number; // 0 to 100%
    cohortAverage: number; // 0 to 100%
    questionsAttempted: number;
    questionsCorrect: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    iconName?: string;
}

export interface ExamSessionRecord {
    id: string;
    examId: string;
    examTitle: string;
    promo: string;
    subject: string;
    completedAt: string;
    scoreOn20: number;
    totalQuestions: number;
    correctCount: number;
    durationSeconds: number;
    timePerQuestionAvg: number;
    mode: 'pressure' | 'practice';
    domainBreakdown: { domain: string; scorePct: number }[];
}

export interface PredictiveGradeResult {
    predictedScoreOn20: number;
    letterGrade: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D (Rattrapage)';
    confidencePct: number;
    validationProbabilityPct: number;
    estimatedLostPoints: number;
    riskTier: 'safe' | 'moderate' | 'high_risk' | 'critical';
    criticalWeaknesses: SkillScore[];
    recommendations: string[];
}

export const DEFAULT_SKILL_SCORES: SkillScore[] = [
    {
        id: 'web-arch',
        name: 'Architecture Web & Next.js',
        shortCode: 'WEB',
        category: 'Développement',
        mastery: 84,
        cohortAverage: 72,
        questionsAttempted: 45,
        questionsCorrect: 38,
        priority: 'low'
    },
    {
        id: 'cyber-sec',
        name: 'Cybersécurité & OWASP',
        shortCode: 'SEC',
        category: 'Sécurité',
        mastery: 42,
        cohortAverage: 65,
        questionsAttempted: 24,
        questionsCorrect: 10,
        priority: 'critical'
    },
    {
        id: 'db-sql',
        name: 'Bases de Données & ACID',
        shortCode: 'BDD',
        category: 'Données',
        mastery: 78,
        cohortAverage: 70,
        questionsAttempted: 36,
        questionsCorrect: 28,
        priority: 'medium'
    },
    {
        id: 'devops-infra',
        name: 'DevOps, Docker & K8s',
        shortCode: 'OPS',
        category: 'Systèmes',
        mastery: 48,
        cohortAverage: 62,
        questionsAttempted: 25,
        questionsCorrect: 12,
        priority: 'high'
    },
    {
        id: 'solid-oop',
        name: 'Conception Objet & SOLID',
        shortCode: 'POO',
        category: 'Génie Logiciel',
        mastery: 86,
        cohortAverage: 74,
        questionsAttempted: 40,
        questionsCorrect: 34,
        priority: 'low'
    },
    {
        id: 'algo-graph',
        name: 'Algorithmique & Graphes',
        shortCode: 'ALG',
        category: 'Algorithmes',
        mastery: 90,
        cohortAverage: 68,
        questionsAttempted: 30,
        questionsCorrect: 27,
        priority: 'low'
    }
];

const STORAGE_KEY = 'kompas_skills_diagnostic';
const SESSIONS_KEY = 'kompas_exam_sessions_history';

/**
 * Loads skills diagnostic from localStorage with safe fallback.
 */
export function getSkillsDiagnostic(): SkillScore[] {
    if (typeof window === 'undefined') return DEFAULT_SKILL_SCORES;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Failed to parse skills diagnostic:', e);
    }
    return DEFAULT_SKILL_SCORES;
}

/**
 * Saves skills diagnostic to localStorage and triggers window update event.
 */
export function saveSkillsDiagnostic(skills: SkillScore[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
        window.dispatchEvent(new Event('kompas_skills_updated'));
    } catch (e) {
        console.error('Failed to save skills diagnostic:', e);
    }
}

/**
 * Loads historical exam sessions.
 */
export function getExamSessionsHistory(): ExamSessionRecord[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(SESSIONS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn('Failed to parse exam sessions history:', e);
    }
    return [];
}

/**
 * Records an exam session (especially from Pressure Exam mode) and updates skill masteries.
 */
export function recordExamSession(session: Omit<ExamSessionRecord, 'id' | 'completedAt'>) {
    if (typeof window === 'undefined') return;

    const history = getExamSessionsHistory();
    const newSession: ExamSessionRecord = {
        ...session,
        id: `sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        completedAt: new Date().toISOString()
    };

    history.unshift(newSession);
    try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(history.slice(0, 30)));
    } catch {}

    // Update relevant skill masteries dynamically
    const currentSkills = getSkillsDiagnostic();
    const ratio = session.totalQuestions > 0 ? (session.correctCount / session.totalQuestions) * 100 : 75;

    const updatedSkills = currentSkills.map(skill => {
        // If subject or domain matches this skill
        const isRelated =
            session.subject.toLowerCase().includes(skill.shortCode.toLowerCase()) ||
            session.subject.toLowerCase().includes(skill.name.toLowerCase()) ||
            session.examTitle.toLowerCase().includes(skill.shortCode.toLowerCase());

        if (isRelated) {
            const newAttempted = skill.questionsAttempted + session.totalQuestions;
            const newCorrect = skill.questionsCorrect + session.correctCount;
            const newMastery = Math.round((newCorrect / newAttempted) * 100);
            const priority: SkillScore['priority'] =
                newMastery < 50 ? 'critical' : newMastery < 65 ? 'high' : newMastery < 80 ? 'medium' : 'low';

            return {
                ...skill,
                questionsAttempted: newAttempted,
                questionsCorrect: newCorrect,
                mastery: Math.min(100, Math.max(10, newMastery)),
                priority
            };
        }
        return skill;
    });

    saveSkillsDiagnostic(updatedSkills);
}

/**
 * Calculates predictive note on 20, confidence level, and critical warnings.
 */
export function calculatePredictiveGrade(skills: SkillScore[]): PredictiveGradeResult {
    if (!skills || skills.length === 0) skills = DEFAULT_SKILL_SCORES;

    const totalMastery = skills.reduce((sum, s) => sum + s.mastery, 0);
    const avgMastery = totalMastery / skills.length;

    // Predicted note scaled to /20 with subtle curve matching CESI grading standard
    const baseScore = (avgMastery / 100) * 20;
    const predictedScoreOn20 = parseFloat(Math.min(20, Math.max(2, baseScore)).toFixed(1));

    let letterGrade: PredictiveGradeResult['letterGrade'] = 'Grade C';
    let riskTier: PredictiveGradeResult['riskTier'] = 'moderate';
    let validationProbabilityPct = 70;

    if (predictedScoreOn20 >= 15.5) {
        letterGrade = 'Grade A';
        riskTier = 'safe';
        validationProbabilityPct = 96;
    } else if (predictedScoreOn20 >= 12.0) {
        letterGrade = 'Grade B';
        riskTier = 'moderate';
        validationProbabilityPct = 84;
    } else if (predictedScoreOn20 >= 10.0) {
        letterGrade = 'Grade C';
        riskTier = 'high_risk';
        validationProbabilityPct = 60;
    } else {
        letterGrade = 'Grade D (Rattrapage)';
        riskTier = 'critical';
        validationProbabilityPct = 25;
    }

    const totalQuestions = skills.reduce((sum, s) => sum + s.questionsAttempted, 0);
    const confidencePct = Math.min(95, Math.max(50, 40 + Math.round(totalQuestions * 0.3)));

    const criticalWeaknesses = skills
        .filter(s => s.mastery < 60)
        .sort((a, b) => a.mastery - b.mastery);

    const estimatedLostPoints = parseFloat(((100 - avgMastery) * 0.2).toFixed(1));

    const recommendations: string[] = [];
    if (criticalWeaknesses.length > 0) {
        criticalWeaknesses.forEach(w => {
            recommendations.push(
                `🚨 Module « ${w.name} » à ${w.mastery}% : Risque élevé de perdre jusqu'à ${(
                    (100 - w.mastery) *
                    0.05
                ).toFixed(1)} points.`
            );
        });
    } else {
        recommendations.push(
            "✨ Excellent niveau global : Maintenez votre entraînement en mode chronométré pour sécuriser le Grade A."
        );
    }

    return {
        predictedScoreOn20,
        letterGrade,
        confidencePct,
        validationProbabilityPct,
        estimatedLostPoints,
        riskTier,
        criticalWeaknesses,
        recommendations
    };
}
