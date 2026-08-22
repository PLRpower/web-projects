import { VisualLine, SectionData, QuestionBoundary } from './types';
import { isScaleLine } from './metadata';

/**
 * Detects exam sections/sub-parts (e.g. DL1 POO) and question boundaries.
 */
export function detectSectionsAndBoundaries(visualLines: VisualLine[]): {
    detectedSections: SectionData[];
    questionStarts: QuestionBoundary[];
} {
    const detectedSections: SectionData[] = [];
    let currentSec: SectionData = {
        id: 'sec-main',
        title: 'Partie Principale',
        startLineIndex: 0,
        questionCount: 0
    };
    detectedSections.push(currentSec);

    const questionStarts: QuestionBoundary[] = [];
    let lastQNum = 0;
    let globalQNum = 0;

    for (let i = 0; i < visualLines.length; i++) {
        const line = visualLines[i];
        const trimmed = line.fullText.trim();

        // Check if line is an explicit section header (e.g. DL1 POO, Partie 2, etc.)
        const isSectionHeader = /^(?:DL\d+|Partie\s+\d+|Section\s+\d+|Devoir\s+Libre\s*\d*)\b/i.test(trimmed);
        if (isSectionHeader) {
            currentSec.endLineIndex = i;
            currentSec = {
                id: `sec-${detectedSections.length + 1}`,
                title: trimmed,
                startLineIndex: i,
                questionCount: 0
            };
            detectedSections.push(currentSec);
            lastQNum = 0;
            continue;
        }

        // Only match genuine Moodle question headers at the start of a line
        const qMatch = line.fullText.match(/^\s*(?:\s*)?Question\s+(\d+)(?:\s+(?:Question|Vrai|QCM|Option|Réponse|Analyse|d'association|numérique)|[:—-]|\s*$)/i);
        if (qMatch) {
            const rawNum = parseInt(qMatch[1], 10);
            // If question numbers reset without an explicit title, create an implicit section
            if (rawNum <= lastQNum && currentSec.title === 'Partie Principale') {
                currentSec.endLineIndex = i;
                currentSec = {
                    id: `sec-${detectedSections.length + 1}`,
                    title: `Partie ${detectedSections.length + 1}`,
                    startLineIndex: i,
                    questionCount: 0
                };
                detectedSections.push(currentSec);
            }
            lastQNum = rawNum;
            globalQNum++;
            currentSec.questionCount++;

            questionStarts.push({
                globalNumber: globalQNum,
                sectionQuestionNumber: rawNum,
                sectionTitle: currentSec.title,
                sectionData: currentSec,
                lineIndex: i
            });
        }
    }

    // Determine section intro text and shared code blocks (between section start and first question)
    for (const sec of detectedSections) {
        const firstQ = questionStarts.find(q => q.sectionData === sec);
        if (firstQ && firstQ.lineIndex > sec.startLineIndex) {
            const introLines = visualLines.slice(sec.startLineIndex + 1, firstQ.lineIndex)
                .filter(l => !/^\d+\s*\/\s*\d+$/.test(l.fullText.trim()) && !isScaleLine(l.fullText));

            const codeParts: string[] = [];
            const textParts: string[] = [];
            let inCode = false;

            for (const il of introLines) {
                const txt = il.fullText.trim();
                const isCodeStarter = /^(?:#include|#define|using\s+namespace|class\s+\w+|struct\s+\w+|template\s*<|int\s+main|void\s+\w+|public:|private:|protected:)/i.test(txt);
                if (isCodeStarter) inCode = true;

                if (inCode) codeParts.push(txt);
                else textParts.push(txt);
            }

            sec.introText = textParts.join('\n');
            sec.codeSnippet = codeParts.join('\n');
            if (sec.codeSnippet.includes('#include') || sec.codeSnippet.includes('class ')) {
                sec.codeLanguage = 'cpp';
            }
        }
    }

    return { detectedSections, questionStarts };
}
