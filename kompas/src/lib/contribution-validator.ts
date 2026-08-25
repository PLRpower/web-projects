/**
 * Anti-spam and content quality verification system for student contributions (Livrables & Prosits).
 * Enforces quality, completeness, and substance before rewarding or publishing.
 */

const SPAM_PATTERNS = [
    /lorem\s+ipsum/i,
    /dolor\s+sit\s+amet/i,
    /azerty/i,
    /qwerty/i,
    /asdfgh/i,
    /blabla/i,
    /toto/i,
    /tata/i,
    /titi/i,
    /test\s+test/i,
    /sample\s+text/i,
    /placeholder/i,
    /n['’]importe\s+quoi/i,
    /rien\s+a\s+dire/i,
    /jsp/i,
    /truc\s+machin/i,
    /aaaaaaaa/i,
    /11111111/i,
    /xxxxxxxxx/i
];

function checkRepetitiveChars(text: string): boolean {
    // Single character repeated 5+ times (e.g. "aaaaa", ".....")
    return /(.)\1{4,}/.test(text);
}

function checkWordDiversity(text: string, minRatio = 0.45): boolean {
    const words = text
        .toLowerCase()
        .replace(/[^\w\sàâäéèêëîïôöùûüç]/gi, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);

    if (words.length < 5) return true;
    const unique = new Set(words);
    return (unique.size / words.length) >= minRatio;
}

function checkSpamKeywords(text: string): boolean {
    return SPAM_PATTERNS.some(pattern => pattern.test(text));
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export function validateLivrableSubmission(data: {
    title?: string;
    category?: string;
    summary?: string;
    keySections?: string[] | string;
    tags?: string[] | string;
}): ValidationResult {
    const errors: string[] = [];

    // Title validation
    const title = (data.title || '').trim();
    if (title.length < 8) {
        errors.push('Le titre du livrable doit comporter au moins 8 caractères.');
    } else if (checkSpamKeywords(title) || checkRepetitiveChars(title)) {
        errors.push('Le titre contient des termes non valides ou répétitifs.');
    }

    // Category validation
    const validCategories = ['DAT', 'CDC', 'AUDIT', 'SOUTENANCE', 'BDD', 'TESTS', 'DEVOPS', 'MISSION'];
    if (!data.category || !validCategories.includes(data.category)) {
        errors.push('La catégorie de livrable sélectionnée est invalide.');
    }

    // Summary validation (at least 45 chars, at least 8 words)
    const summary = (data.summary || '').trim();
    const summaryWords = summary.split(/\s+/).filter(Boolean);
    if (summary.length < 45 || summaryWords.length < 8) {
        errors.push('Le résumé doit être explicite et comporter au moins 45 caractères (minimum 8 mots).');
    } else if (checkSpamKeywords(summary) || checkRepetitiveChars(summary)) {
        errors.push('Le résumé contient du texte de remplissage ou du contenu non valide.');
    } else if (!checkWordDiversity(summary, 0.45)) {
        errors.push('Le résumé manque de variété textuelle (mots trop répétitifs).');
    }

    // Key sections validation (at least 2 distinct sections)
    let sections: string[] = [];
    if (Array.isArray(data.keySections)) {
        sections = data.keySections.map(s => (s || '').trim()).filter(Boolean);
    } else if (typeof data.keySections === 'string') {
        sections = data.keySections.split('\n').map(s => s.trim()).filter(Boolean);
    }

    if (sections.length < 2) {
        errors.push('Vous devez renseigner au moins 2 chapitres ou sections clés du livrable.');
    } else {
        const invalidSection = sections.find(s => s.length < 3 || checkRepetitiveChars(s) || checkSpamKeywords(s));
        if (invalidSection) {
            errors.push('Toutes les sections doivent être composées d\'un intitulé de chapitre valide.');
        }
    }

    // Tags validation
    let tagsList: string[] = [];
    if (Array.isArray(data.tags)) {
        tagsList = data.tags.map(t => (t || '').trim()).filter(Boolean);
    } else if (typeof data.tags === 'string') {
        tagsList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (tagsList.length === 0 || !tagsList.some(t => t.length >= 2)) {
        errors.push('Indiquez au moins 1 mot-clé ou technologie pertinente.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validatePrositSubmission(data: {
    title?: string;
    problemStatement?: string;
    context?: string;
    keywords?: string[] | string;
    hypotheses?: string[] | string;
    actionPlan?: string[] | string;
    constraints?: string[] | string;
    deliverables?: string[] | string;
}): ValidationResult {
    const errors: string[] = [];

    // Title validation
    const title = (data.title || '').trim();
    if (title.length < 8) {
        errors.push('Le titre du prosit doit comporter au moins 8 caractères.');
    } else if (checkSpamKeywords(title) || checkRepetitiveChars(title)) {
        errors.push('Le titre contient des termes non valides ou répétitifs.');
    }

    // Problem statement validation
    const problematic = (data.problemStatement || '').trim();
    const probWords = problematic.split(/\s+/).filter(Boolean);
    if (problematic.length < 20 || probWords.length < 4) {
        errors.push('La problématique centrale doit être détaillée (au moins 20 caractères et 4 mots).');
    } else if (checkSpamKeywords(problematic) || checkRepetitiveChars(problematic)) {
        errors.push('La problématique contient du texte de remplissage non recevable.');
    } else if (!checkWordDiversity(problematic, 0.45)) {
        errors.push('La formulation de la problématique est trop répétitive.');
    }

    // Context validation
    const context = (data.context || '').trim();
    if (context.length > 0 && context.length < 25) {
        errors.push('Le contexte doit comporter au moins 25 caractères pour expliquer la situation de l\'entreprise.');
    } else if (context.length > 0 && (checkSpamKeywords(context) || checkRepetitiveChars(context))) {
        errors.push('Le contexte contient du texte factice ou répétitif.');
    }

    // Hypotheses validation (at least 2 distinct items)
    let hypotheses: string[] = [];
    if (Array.isArray(data.hypotheses)) {
        hypotheses = data.hypotheses.map(h => (h || '').trim()).filter(Boolean);
    } else if (typeof data.hypotheses === 'string') {
        hypotheses = data.hypotheses.split('\n').map(h => h.trim()).filter(Boolean);
    }

    if (hypotheses.length < 2) {
        errors.push('Indiquez au moins 2 hypothèses de travail pour la résolution du prosit.');
    } else {
        const invalidHyp = hypotheses.find(h => h.length < 4 || checkSpamKeywords(h) || checkRepetitiveChars(h));
        if (invalidHyp) {
            errors.push('Chaque hypothèse doit être claire et formulée de manière intelligible.');
        }
    }

    // Action plan validation (at least 2 steps)
    let actionPlan: string[] = [];
    if (Array.isArray(data.actionPlan)) {
        actionPlan = data.actionPlan.map(a => (a || '').trim()).filter(Boolean);
    } else if (typeof data.actionPlan === 'string') {
        actionPlan = data.actionPlan.split('\n').map(a => a.trim()).filter(Boolean);
    }

    if (actionPlan.length < 2) {
        errors.push('Définissez au moins 2 étapes dans le plan d\'action de la séance PBL.');
    } else {
        const invalidStep = actionPlan.find(s => s.length < 4 || checkSpamKeywords(s) || checkRepetitiveChars(s));
        if (invalidStep) {
            errors.push('Chaque étape du plan d\'action doit être suffisamment détaillée.');
        }
    }

    // Constraints check (at least 1)
    let constraints: string[] = [];
    if (Array.isArray(data.constraints)) {
        constraints = data.constraints.map(c => (c || '').trim()).filter(Boolean);
    } else if (typeof data.constraints === 'string') {
        constraints = data.constraints.split('\n').map(c => c.trim()).filter(Boolean);
    }
    if (constraints.length < 1 || constraints[0].length < 4) {
        errors.push('Renseignez au moins 1 contrainte technique ou organisationnelle.');
    }

    // Deliverables check (at least 1)
    let deliverables: string[] = [];
    if (Array.isArray(data.deliverables)) {
        deliverables = data.deliverables.map(d => (d || '').trim()).filter(Boolean);
    } else if (typeof data.deliverables === 'string') {
        deliverables = data.deliverables.split('\n').map(d => d.trim()).filter(Boolean);
    }
    if (deliverables.length < 1 || deliverables[0].length < 4) {
        errors.push('Renseignez au moins 1 livrable attendu pour la résolution.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
