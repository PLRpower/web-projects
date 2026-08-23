export type CCTLQuestionType =
    | 'single_choice'      // QCM à réponse unique (radio)
    | 'multiple_choice'    // QCM à réponses multiples (checkboxes)
    | 'fill_blank'         // Texte à trous / saisie libre
    | 'matching'           // Association d'éléments (paires A <-> B)
    | 'image_matching'     // Association texte <-> image ou schéma
    | 'ordering'           // Remise en ordre chronologique / séquentiel
    | 'true_false'         // Vrai / Faux
    | 'short_answer'       // Réponse courte
    | 'numerical'          // Question à valeurs numériques / intervalles
    | 'code_analysis';     // Analyse de code source

export type CCTLStudentStatus =
    | 'correct'            // Réponses correctes (0 discordance)
    | 'partially_correct'  // Réponses partiellement correctes
    | 'incorrect'          // Réponses incorrectes
    | 'unanswered'         // Non répondu
    | 'unknown';

export interface CCTLChoice {
    id: string;                 // 'A', 'B', 'C', 'D', etc.
    text: string;
    imageUrl?: string;          // Capture crop de la formule mathématique individuelle
    isExpected: boolean;        // Réponse attendue (bonne réponse)
    isStudentAnswer?: boolean;  // Réponse saisie par l'étudiant (optionnel)
    isDiscordant?: boolean;     // Présence d'une discordance (optionnel)
    discordanceDetail?: string; // e.g. "(+1)"
}

export interface CCTLMatchingPair {
    id: string;
    leftItem: string;           // Élément de gauche (texte ou réf image)
    rightExpected: string;      // Association attendue
    rightStudent?: string;      // Association saisie par l'étudiant
    isCorrect?: boolean;
    discordanceDetail?: string; // e.g. "Oui (+1)"
}

export interface CCTLFillBlankItem {
    blankIndex: number;
    expectedText: string;
    studentText?: string;
    isCorrect?: boolean;
}

export interface CCTLQuestion {
    id: string;
    number: number;
    sectionTitle?: string;          // ex: "DL1 POO" ou "Partie 2"
    sectionQuestionNumber?: number; // Numéro de la question dans la sous-partie (ex: 1, 2)
    type: CCTLQuestionType;
    typeLabel: string;          // Label brut (ex: "Question à réponse unique")
    status: CCTLStudentStatus;
    statusRaw?: string;         // Label brut (ex: "Réponses partiellement correctes (2 discordances)")
    discordanceCount: number;
    prompt: string;             // Énoncé de la question
    promptImageUrl?: string;    // Capture cropée de l'énoncé avec formules mathématiques
    formulaImageUrl?: string;   // Formule mathématique isolée à afficher avec le texte copiable
    hasPromptFormula?: boolean; // Indique si l'énoncé contient une formule graphique manquante
    codeSnippet?: string;       // Extrait de code associé si présent
    codeLanguage?: string;      // Langage détecté (ex: javascript, sql, etc.)
    imageUrl?: string;          // URL de l'image si présente
    imageAlt?: string;
    snapshotUrl?: string;       // Capture haute-définition de la question / formule
    hasMathFormula?: boolean;   // Indique si la question repose sur des formules vectorielles
    choices: CCTLChoice[];
    matchingPairs?: CCTLMatchingPair[];
    fillBlanks?: CCTLFillBlankItem[];
    correctAnswersCount: number;
    points?: number;
    explanation?: string;       // Explication / correction détaillée
    category?: string;          // Thème / Chapitre
    rawText?: string;
}

export interface CCTLSection {
    id: string;
    title: string;
    introText?: string;
    codeSnippet?: string;
    codeLanguage?: string;
    questionCount: number;
}

export interface CCTLExam {
    id: string;
    title: string;
    studentName?: string;
    evaluationStandard?: string; // ex: "B (% de réussite compris entre 50 et 75%)"
    evaluationWeighted?: string;
    promo: string;               // ex: "A3", "A4", "FISE", "FISA"
    specialty?: string;          // ex: "FISA Info", "FISE Info", "Cybersécurité & Réseaux"
    track?: string;              // ex: "FISA", "FISE"
    domain?: string;             // ex: "Informatique", "Web", "Réseau"
    year?: string;                // ex: "2024-2025"
    subject: string;             // ex: "Sécurité et techniques de développement web - I"
    sections?: CCTLSection[];    // Sous-parties détectées (ex: DL1 POO)
    description?: string;
    difficulty?: string;         // ex: "Examen Officiel", "Intermédiaire", "Avancé"
    durationMinutes?: number;    // ex: 45
    totalQuestions: number;
    questions: CCTLQuestion[];
    stats: {
        correctCount: number;
        partialCount: number;
        incorrectCount: number;
        totalDiscordances: number;
        typeCounts: Partial<Record<CCTLQuestionType, number>>;
    };
    metadata: {
        fileName?: string;
        fileSize?: number;
        totalPages: number;
        parsedAt: string;
        source: 'pdf_export' | 'manual' | 'database';
    };
}

export function formatAcademicYear(yearStr?: string): string {
    if (!yearStr) return '2024 - 2025';
    const trimmed = yearStr.trim();
    if (trimmed.includes('-') || trimmed.includes('/')) {
        const parts = trimmed.split(/[-/]/).map(p => p.trim());
        if (parts.length >= 2) {
            return `${parts[0]} - ${parts[1]}`;
        }
    }
    const num = parseInt(trimmed, 10);
    if (!isNaN(num) && num > 2000) {
        return `${num - 1} - ${num}`;
    }
    return trimmed;
}

export interface CCTLImportResponse {
    success: boolean;
    exam?: CCTLExam;
    error?: string;
    warnings?: string[];
}
