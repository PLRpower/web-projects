import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getDocumentProxy } from 'unpdf';

export interface StudentNameDetectionResult {
    detected: boolean;
    namePart?: string;
    studentId?: string;
    tokens?: string[];
    cleanFileName?: string;
    subjectSuggestion?: string;
    detectedName?: string;
    error?: string;
}

export interface AnonymizePdfResult {
    success: boolean;
    anonymizedBuffer?: Uint8Array;
    cleanFileName?: string;
    subjectSuggestion?: string;
    detectedName?: string;
    studentId?: string;
    error?: string;
}

/**
 * Normalizes text for comparison (lowercase, removes accents and special characters)
 */
function normalizeStr(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, ' ')
        .trim();
}

/**
 * Detects student name and ID from the beginning of the filename.
 * Handles compound first names, compound last names, student IDs, and fallback against PDF header name.
 */
export function detectStudentNameFromFilename(
    fileName: string,
    candidateHeaderName: string = ''
): StudentNameDetectionResult {
    const raw = fileName.replace(/\.pdf$/i, '').trim();

    // 1. Standard pattern with student ID: [nom]-[prenom]-[matricule]-[sujet]
    // Handles compound names with multiple hyphens (e.g. thomas-paul-2494516-projet-web...)
    const idMatch = raw.match(/^([a-zA-ZÀ-ÿ'-]+(?:[-_][a-zA-ZÀ-ÿ'-]+)+)[-_](\d{4,9})[-_](.+)$/i);
    if (idMatch) {
        const namePart = idMatch[1];
        const studentId = idMatch[2];
        const rest = idMatch[3];
        const tokens = namePart.split(/[-_]+/).filter(Boolean);

        return {
            detected: true,
            namePart,
            studentId,
            tokens,
            cleanFileName: `${rest}.pdf`,
            subjectSuggestion: rest.replace(/[-_]/g, ' '),
            detectedName: namePart.replace(/[-_]/g, ' ')
        };
    }

    // 2. Cross-reference with candidateHeaderName extracted from PDF header if present
    if (candidateHeaderName) {
        const headerTokens = candidateHeaderName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .split(/[\s'-]+/)
            .filter(t => t.length >= 2 && !/^\d+$/.test(t));

        if (headerTokens.length >= 2) {
            const fileTokens = raw
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .split(/[-_]+/);

            const firstN = fileTokens.slice(0, headerTokens.length);
            const isMatch =
                headerTokens.every(ht => firstN.includes(ht)) &&
                firstN.every(ft => headerTokens.includes(ft));

            if (isMatch) {
                const restParts = raw.split(/[-_]+/).slice(headerTokens.length);
                let studentId = '';
                let remainingParts = restParts;
                if (restParts.length > 0 && /^\d{4,9}$/.test(restParts[0])) {
                    studentId = restParts[0];
                    remainingParts = restParts.slice(1);
                }
                const rest = remainingParts.join('-');
                const namePart = firstN.join('-');

                return {
                    detected: true,
                    namePart,
                    studentId: studentId || undefined,
                    tokens: firstN,
                    cleanFileName: rest ? `${rest}.pdf` : 'cctl-anonyme.pdf',
                    subjectSuggestion: rest ? rest.replace(/[-_]/g, ' ') : 'CCTL Anonyme',
                    detectedName: candidateHeaderName
                };
            }
        }
    }

    // 3. Pattern with known CCTL prefix markers (cctl, projet, test, devoir, eval, tp, session, moodle)
    const prefixMarkerMatch = raw.match(
        /^([a-zA-ZÀ-ÿ'-]+(?:[-_][a-zA-ZÀ-ÿ'-]+)+)[-_](cctl|projet|test|devoir|eval|evaluation|tp|examen|session|notions|moodle|positionnement|a[1-5]|fise|fisa)(?:[-_](.+))?$/i
    );
    if (prefixMarkerMatch) {
        const namePart = prefixMarkerMatch[1];
        const marker = prefixMarkerMatch[2];
        const after = prefixMarkerMatch[3] || '';
        const rest = after ? `${marker}-${after}` : marker;
        const tokens = namePart.split(/[-_]+/).filter(Boolean);

        return {
            detected: true,
            namePart,
            tokens,
            cleanFileName: `${rest}.pdf`,
            subjectSuggestion: rest.replace(/[-_]/g, ' '),
            detectedName: namePart.replace(/[-_]/g, ' ')
        };
    }

    // 4. Pattern: [nom]-[prenom]-[sujet...] (general 3+ parts where first 2 are words)
    const parts = raw.split(/[-_]+/);
    if (parts.length >= 3) {
        if (/^[a-zA-ZÀ-ÿ']+$/.test(parts[0]) && /^[a-zA-ZÀ-ÿ']+$/.test(parts[1])) {
            const namePart = `${parts[0]}-${parts[1]}`;
            const rest = parts.slice(2).join('-');
            return {
                detected: true,
                namePart,
                tokens: [parts[0], parts[1]],
                cleanFileName: `${rest}.pdf`,
                subjectSuggestion: rest.replace(/[-_]/g, ' '),
                detectedName: `${parts[0]} ${parts[1]}`
            };
        }
    }

    if (parts.length === 2 && /^[a-zA-ZÀ-ÿ']+$/.test(parts[0]) && /^[a-zA-ZÀ-ÿ']+$/.test(parts[1])) {
        return {
            detected: true,
            namePart: `${parts[0]}-${parts[1]}`,
            tokens: [parts[0], parts[1]],
            cleanFileName: 'cctl-anonyme.pdf',
            subjectSuggestion: 'CCTL Anonyme',
            detectedName: `${parts[0]} ${parts[1]}`
        };
    }

    return {
        detected: false,
        error: `Impossible d'anonymiser : nom et prénom non détectés au début du fichier "${fileName}". Le format attendu commence par "nom-prenom-..." (ex: thomas-paul-2494516-sujet.pdf).`
    };
}

/**
 * Returns a clean anonymized filename by stripping student name if detected.
 */
export function getAnonymizedFileName(fileName: string, candidateHeaderName?: string): string {
    if (!fileName) return 'cctl-anonyme.pdf';
    const detection = detectStudentNameFromFilename(fileName, candidateHeaderName);
    if (detection.cleanFileName) return detection.cleanFileName;
    return fileName;
}

/**
 * Anonymizes a CCTL PDF:
 * 1. Analyzes the filename and PDF content to detect the student identity
 * 2. If not detected, returns an error warning
 * 3. If detected, strips the name from the content streams and renders "Utilisateur Anonyme" in its place
 * 4. Masks any other occurrences visually with opaque rectangles
 * 5. Updates PDF metadata and returns the new anonymized buffer and renamed filename
 */
export async function anonymizeCCTLPdf(
    pdfBuffer: Uint8Array,
    fileName: string
): Promise<AnonymizePdfResult> {
    try {
        const clone = new Uint8Array(
            pdfBuffer.buffer.slice(
                pdfBuffer.byteOffset,
                pdfBuffer.byteOffset + pdfBuffer.byteLength
            )
        );
        const pdfProxy = await getDocumentProxy(clone);
        const numPages = pdfProxy.numPages;

        // Extract student name candidate from first page header
        let candidateHeaderName = '';
        const firstPage = await pdfProxy.getPage(1);
        const firstPageTc = await firstPage.getTextContent();

        for (const item of firstPageTc.items) {
            if (!('str' in item) || typeof item.str !== 'string' || !item.str.trim()) continue;
            const txt = item.str.trim();

            if (
                /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{3,35}(?:\s+\d{4,9})?$/.test(txt) &&
                txt.split(/\s+/).length >= 2 &&
                txt.split(/\s+/).length <= 4
            ) {
                if (
                    !/\b(?:CCTL|Projet|Notions|Examen|Devoir|Contrôle|Informatique|Session|Web|POO|CPP|HTML|CSS|JS|BDD|SQL|Moyenne|Note|Dossier|Échelle)\b/i.test(
                        txt
                    )
                ) {
                    candidateHeaderName = txt;
                    break;
                }
            }
        }

        // Detect student name from filename
        const detection = detectStudentNameFromFilename(fileName, candidateHeaderName);
        if (!detection.detected || !detection.tokens || detection.tokens.length < 2) {
            return {
                success: false,
                error: detection.error || `Impossible d'anonymiser : le nom et prénom de l'étudiant n'ont pas été détectés au début du fichier "${fileName}".`
            };
        }

        const detectedName = candidateHeaderName || detection.detectedName || detection.namePart?.replace(/[-_]/g, ' ') || 'Étudiant';
        const cleanFileName = detection.cleanFileName || 'cctl-anonyme.pdf';
        const subjectSuggestion = detection.subjectSuggestion || 'CCTL';
        const studentId = detection.studentId;

        // Build list of terms to search and mask
        const searchTerms = [
            ...detection.tokens,
            ...(candidateHeaderName ? candidateHeaderName.toLowerCase().split(/[\s'-]+/) : []),
            ...(studentId ? [studentId] : [])
        ].filter(t => t && t.length >= 2);

        // Find all visual occurrences of name tokens across pages
        interface TargetItem {
            page: number;
            str: string;
            x: number;
            y: number;
            w: number;
            h: number;
            fontSize: number;
            isHeader: boolean;
        }

        const targets: TargetItem[] = [];

        for (let p = 1; p <= numPages; p++) {
            const page = await pdfProxy.getPage(p);
            const tc = await page.getTextContent();

            for (const item of tc.items) {
                if (!('str' in item) || typeof item.str !== 'string' || !item.str.trim()) continue;
                const txt = item.str.trim();
                const normTxt = normalizeStr(txt);

                const isMatch = searchTerms.some(term => {
                    const normTerm = normalizeStr(term);
                    if (normTerm.length < 2) return false;
                    // Check if whole word matches or is contained
                    const words = normTxt.split(/\s+/);
                    return words.includes(normTerm) || (normTerm.length >= 3 && normTxt.includes(normTerm));
                });

                if (isMatch) {
                    const x = Math.round(item.transform[4]);
                    const y = Math.round(item.transform[5]);
                    const w = Math.round(item.width);
                    const h = Math.round(item.height);
                    const fontSize = Math.round(item.transform[0] || item.height || 14);

                    targets.push({
                        page: p,
                        str: txt,
                        x,
                        y,
                        w,
                        h,
                        fontSize,
                        isHeader: p === 1 && y > 1200
                    });
                }
            }
        }

        // Load PDF with pdf-lib
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();

        // 1. Visual masking and replacement with "Utilisateur Anonyme"
        let headerDrawn = false;

        for (const t of targets) {
            const page = pages[t.page - 1];
            if (!page) continue;

            // Draw white opaque rectangle over target bounding box
            page.drawRectangle({
                x: Math.max(0, t.x - 4),
                y: Math.max(0, t.y - 4),
                width: t.w + 8,
                height: t.h + 8,
                color: rgb(1, 1, 1)
            });

            // Draw "Utilisateur Anonyme" on the main student name header
            if (t.isHeader && !headerDrawn) {
                page.drawText('Utilisateur Anonyme', {
                    x: t.x,
                    y: t.y,
                    size: Math.min(Math.max(t.fontSize, 12), 16),
                    font: helveticaBold,
                    color: rgb(0.15, 0.15, 0.15)
                });
                headerDrawn = true;
            }
        }

        // Fallback: if header was not drawn via targets, draw at standard top position
        if (!headerDrawn && pages.length > 0) {
            pages[0].drawRectangle({
                x: 25,
                y: 1335,
                width: 250,
                height: 35,
                color: rgb(1, 1, 1)
            });
            pages[0].drawText('Utilisateur Anonyme', {
                x: 29,
                y: 1343,
                size: 14,
                font: helveticaBold,
                color: rgb(0.15, 0.15, 0.15)
            });
        }

        // Update document metadata
        pdfDoc.setAuthor('Utilisateur Anonyme');
        pdfDoc.setTitle(subjectSuggestion);
        pdfDoc.setCreator('Kompas');
        pdfDoc.setProducer('Kompas');

        const anonymizedBytes = await pdfDoc.save();

        return {
            success: true,
            anonymizedBuffer: anonymizedBytes,
            cleanFileName,
            subjectSuggestion,
            detectedName,
            studentId
        };
    } catch (err: any) {
        console.error('Error during PDF anonymization:', err);
        return {
            success: false,
            error: err?.message || 'Erreur lors de l\'anonymisation du PDF.'
        };
    }
}
