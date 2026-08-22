import { VisualLine } from './types';

/**
 * Checks if a line is an evaluation scale description from Moodle
 */
export function isScaleLine(text: string): boolean {
    return /Échelle\s+d'évaluation|%\s+de\s+réussite|compris\s+entre|\bentre\s+\d+\s+et\s+\d+%/i.test(text);
}

/**
 * Cleans the raw extracted exam title by removing promo patterns, years, and file artifacts
 */
export function cleanRawTitle(raw: string): string {
    let t = raw;

    t = t.replace(/\b(?:20\d{2}[-_/]?20\d{2}|20\d{2})\b/gi, '');
    t = t.replace(/\b(?:FISE|FISA|CPIA\d|CPI[-_\s]?A\d|A\d|ING\d|BAC\+\d)\b/gi, '');
    t = t.replace(/\b(?:INFORMATIQUE|INFO|BTP|GENERALISTE|SYS-RESEAUX|CYBER)\b/gi, '');
    t = t.replace(/\b(?:DEVOIR\s+SURVEILL[ÉE]|EXAMEN|SESSION\s+\d+|CCTL|CONTROLE|RATTRAPAGE)\b/gi, '');

    t = t.replace(/^[-_\s—:;.,/|\\]+/, '');
    t = t.replace(/[-_\s—:;.,/|\\]+$/, '');

    const rMatch = t.match(/\s*-\s*([A-Z0-9]{1,3})\s*$/);
    const suffix = rMatch ? ` - ${rMatch[1]}` : '';
    if (rMatch) {
        t = t.slice(0, rMatch.index);
    }

    t = t.replace(/\(\s*\)/g, '');
    t = t.replace(/[-_]+/g, ' ');
    t = t.replace(/\s+/g, ' ').trim();

    if (suffix && !t.endsWith(suffix)) {
        t += suffix;
    }

    return t.trim();
}

/**
 * Detects Promo, Domain, Academic Year and cleaned Subject from header lines and file metadata
 */
export function detectPromoAndDomain(
    rawTitle: string | undefined,
    fileName: string,
    sampleHeaderLines: string,
    studentName?: string
): { promo: string; domain: string; cleanSubject: string; academicYear: string } {
    const combined = `${fileName} ${rawTitle || ''} ${sampleHeaderLines}`.toUpperCase();

    // 1. Promo Detection (do not default to A3)
    let promo = '';
    if (/\b(?:CPI\s*A1|CPIA1|A1)\b/.test(combined)) promo = 'A1';
    else if (/\b(?:CPI\s*A2|CPIA2|A2)\b/.test(combined)) promo = 'A2';
    else if (/\b(?:FISE\s*A3|FISA\s*A3|CPI\s*A3|CPIA3|\bA3\b)\b/.test(combined)) promo = 'A3';
    else if (/\b(?:FISE\s*A4|FISA\s*A4|\bA4\b)\b/.test(combined)) promo = 'A4';
    else if (/\b(?:FISE\s*A5|FISA\s*A5|\bA5\b)\b/.test(combined)) promo = 'A5';
    else if (/\bFISE\b/.test(combined)) promo = 'FISE';
    else if (/\bFISA\b/.test(combined)) promo = 'FISA';

    // 2. Domain Detection
    let domain = 'Informatique';
    if (/WEB|HTML|CSS|JAVASCRIPT|PHP|BACKEND|FRONTEND|REACT|NODE/i.test(combined)) {
        domain = 'Développement Web';
    } else if (/POO|CPP|C\+\+|JAVA|PYTHON|ALGORITHMIQUE|OBJET|CLASSE/i.test(combined)) {
        domain = 'Programmation Orientée Objet';
    } else if (/RESEAU|APACHE|LINUX|SYSTEME|DOCKER|DEVOPS|SERVEUR|TCP|IP/i.test(combined)) {
        domain = 'Systèmes & Réseaux';
    } else if (/CYBER|SECURITE|CRYPTOGRAPHIE|AUTHENTIFICATION/i.test(combined)) {
        domain = 'Cybersécurité';
    } else if (/DATA|SQL|DATABASE|BDD|POSTGRES|BASE DE DONNEES/i.test(combined)) {
        domain = 'Bases de Données';
    }

    // 3. Academic Year Detection
    let academicYear = '2024-2025';
    const yearRangeMatch = combined.match(/\b(20\d{2})[-_/](20\d{2})\b/);
    if (yearRangeMatch) {
        academicYear = `${yearRangeMatch[1]}-${yearRangeMatch[2]}`;
    } else {
        const singleYearMatch = combined.match(/\b(202[0-9])\b/);
        if (singleYearMatch) {
            const y = parseInt(singleYearMatch[1], 10);
            academicYear = `${y - 1}-${y}`;
        }
    }

    // 4. Subject Extraction
    let cleanSubject = '';
    const subjectCandidate = rawTitle || fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    if (subjectCandidate) {
        cleanSubject = cleanRawTitle(subjectCandidate);
    }

    return { promo, domain, cleanSubject, academicYear };
}

/**
 * Extracts student name, evaluation scale and raw title from header lines
 */
export function extractExamHeaderMeta(visualLines: VisualLine[], fileName: string) {
    let studentName: string | undefined;
    let evaluationStandard: string | undefined;
    let evaluationWeighted: string | undefined;
    let rawTitle = '';

    const firstPageLines = visualLines.slice(0, 40);

    for (let i = 0; i < firstPageLines.length; i++) {
        const text = firstPageLines[i].fullText.trim();
        if (!text) continue;

        // Student name (e.g. "Paul THOMAS", "THOMAS Paul 2494516", "DUPONT Jean")
        if (!studentName && !isScaleLine(text) && !/Question\s+\d+/i.test(text)) {
            if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{3,35}(?:\s+\d{4,9})?$/.test(text) && text.split(/\s+/).length >= 2 && text.split(/\s+/).length <= 4) {
                // If line does not look like a subject title (e.g. doesn't have CCTL, POO, Web, Examen)
                if (!/\b(?:CCTL|Projet|Notions|Examen|Devoir|Contrôle|Informatique|Session|Web|POO|CPP|HTML|CSS|JS|BDD|SQL)\b/i.test(text)) {
                    studentName = text;
                    continue;
                }
            }
        }

        // Evaluation scales
        if (/Échelle\s+d'évaluation\s+standard\s*:\s*([A-Z]\s*\([^)]+\))/i.test(text)) {
            const m = text.match(/Échelle\s+d'évaluation\s+standard\s*:\s*([A-Z]\s*\([^)]+\))/i);
            if (m) evaluationStandard = m[1].trim();
            continue;
        }
        if (/Échelle\s+d'évaluation\s+pondérée\s*:\s*([A-Z]\s*\([^)]+\))/i.test(text)) {
            const m = text.match(/Échelle\s+d'évaluation\s+pondérée\s*:\s*([A-Z]\s*\([^)]+\))/i);
            if (m) evaluationWeighted = m[1].trim();
            continue;
        }

        // Candidate title
        if (
            !rawTitle &&
            text !== studentName &&
            !isScaleLine(text) &&
            !/Question\s+\d+/i.test(text) &&
            text.length >= 4
        ) {
            rawTitle = text;
        }
    }

    return { studentName, evaluationStandard, evaluationWeighted, rawTitle };
}
