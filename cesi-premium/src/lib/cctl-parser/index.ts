import {
    CCTLExam,
    CCTLQuestion,
    CCTLQuestionType,
    CCTLStudentStatus,
    CCTLChoice,
    CCTLMatchingPair,
    CCTLFillBlankItem
} from '@/types/cctl';

import { extractVisualLines } from './spatial';
import { extractExamHeaderMeta, detectPromoAndDomain } from './metadata';
import { detectSectionsAndBoundaries } from './sections';
import { separatePromptAndCode } from './code-detector';
import { parseChoiceQuestion } from './parsers/choice-parser';
import { parseMatchingQuestion } from './parsers/matching-parser';
import { parseNumericalQuestion } from './parsers/numerical-parser';
import { parseOpenQuestion } from './parsers/open-parser';
import { generateQuestionSnapshots } from './rasterizer';

export * from './types';
export * from './metadata';
export * from './spatial';
export * from './sections';
export * from './code-detector';

const ROW_START_REGEX = /^([A-Z])\s+([☑■☐])\s+([☑■☐])\s+(Oui\s*\(\+\d+\)|Oui|Non)\s+(.*)$/;
const ROW_START_REGEX_ALT = /^([A-Z])\s+([☑■☐])\s+([☑■☐])\s+(.*)$/;

/**
 * Main parser entry point. Takes a raw PDF Uint8Array and returns a fully parsed,
 * structured, and verified CCTLExam object.
 */
export async function parseCCTLPdf(
    pdfBuffer: Uint8Array,
    fileName: string,
    fileSizeInput?: number
): Promise<CCTLExam> {
    const { lines: allVisualLines, numPages } = await extractVisualLines(pdfBuffer);
    const fileSize = fileSizeInput || pdfBuffer.byteLength;

    // Extract Exam Header Metadata (Student name, Evaluation Scales, candidate title)
    const { studentName, evaluationStandard, evaluationWeighted, rawTitle } = extractExamHeaderMeta(
        allVisualLines,
        fileName
    );

    // Detect Exam Sections / Sub-parts and Question Boundaries
    const { detectedSections, questionStarts } = detectSectionsAndBoundaries(allVisualLines);

    // Pre-render high-definition visual snapshots of each question
    const { questionSnapshots, promptSnapshots, choiceSnapshots } = await generateQuestionSnapshots(
        pdfBuffer,
        allVisualLines,
        questionStarts,
        detectedSections
    );

    const questions: CCTLQuestion[] = [];
    const typeCounts: Record<CCTLQuestionType, number> = {
        single_choice: 0,
        multiple_choice: 0,
        fill_blank: 0,
        matching: 0,
        image_matching: 0,
        ordering: 0,
        true_false: 0,
        short_answer: 0,
        numerical: 0,
        code_analysis: 0
    };

    let correctCount = 0;
    let partialCount = 0;
    let incorrectCount = 0;
    let totalDiscordances = 0;

    for (let qIdx = 0; qIdx < questionStarts.length; qIdx++) {
        const start = questionStarts[qIdx];
        const nextStart = questionStarts[qIdx + 1];
        const startLineIdx = start.lineIndex;

        // Boundary calculation: end at next question OR next section start, whichever comes first
        const nextSec = detectedSections.find(s => s.startLineIndex > startLineIdx);
        let endLineIdx = nextStart ? nextStart.lineIndex : allVisualLines.length;
        if (nextSec && nextSec.startLineIndex < endLineIdx) {
            endLineIdx = nextSec.startLineIndex;
        }

        const qLines = allVisualLines.slice(startLineIdx, endLineIdx);
        const filteredQLines = qLines.filter(l => !/^\d+\s*\/\s*\d+$/.test(l.fullText.trim()));

        // Determine question type from top lines
        const topLinesText = filteredQLines.slice(0, 3).map(l => l.fullText).join(' ');
        let rawType = 'Question à réponse unique';
        let qType: CCTLQuestionType = 'single_choice';

        if (/numériques?|numérique|valeurs?\s+numériques?/i.test(topLinesText)) {
            rawType = 'Question à valeurs numériques';
            qType = 'numerical';
        } else if (/ouverte|courte|saisie\s+manuelle|texte\s+court|saisie\s+libre/i.test(topLinesText)) {
            rawType = 'Question à réponse ouverte et courte';
            qType = 'short_answer';
        } else if (/réponses?\s+multiples?/i.test(topLinesText)) {
            rawType = 'Question à réponses multiples';
            qType = 'multiple_choice';
        } else if (/réponse\s+unique/i.test(topLinesText)) {
            rawType = 'Question à réponse unique';
            qType = 'single_choice';
        } else if (/trou|remplir|compléter|saisie/i.test(topLinesText)) {
            rawType = 'Question à texte à trous / saisie';
            qType = 'fill_blank';
        } else if (/image|schéma|figure|visuel/i.test(topLinesText)) {
            rawType = 'Question visuelle / image';
            qType = 'image_matching';
        } else if (/association|apparier|relier|paires?/i.test(topLinesText)) {
            rawType = "Question d'association";
            qType = 'matching';
        } else if (/ordonnancement|ordre|chronologique/i.test(topLinesText)) {
            rawType = "Question d'ordonnancement";
            qType = 'ordering';
        } else if (/vrai\s*\/\s*faux/i.test(topLinesText)) {
            rawType = 'Vrai / Faux';
            qType = 'true_false';
        }

        // Determine Student Correction Status
        let status: CCTLStudentStatus = 'unknown';
        let statusRaw = '';
        let discordanceCount = 0;

        for (const l of filteredQLines) {
            if (/^\s*Réponses?\s+correctes?\b/i.test(l.fullText)) {
                status = 'correct';
                statusRaw = l.fullText;
                const discMatch = l.fullText.match(/(\d+)\s*discordances?/i);
                if (discMatch) discordanceCount = parseInt(discMatch[1], 10);
                break;
            } else if (/^\s*Réponses?\s+partiellement\s+correctes?\b/i.test(l.fullText)) {
                status = 'partially_correct';
                statusRaw = l.fullText;
                const discMatch = l.fullText.match(/(\d+)\s*discordances?/i);
                if (discMatch) discordanceCount = parseInt(discMatch[1], 10);
                break;
            } else if (/^\s*Réponses?\s+incorrectes?\b/i.test(l.fullText)) {
                status = 'incorrect';
                statusRaw = l.fullText;
                const discMatch = l.fullText.match(/(\d+)\s*discordances?/i);
                if (discMatch) discordanceCount = parseInt(discMatch[1], 10);
                break;
            }
        }

        if (status === 'correct') correctCount++;
        else if (status === 'partially_correct') partialCount++;
        else if (status === 'incorrect') incorrectCount++;
        totalDiscordances += discordanceCount;

        // Identify table indices
        let firstChoiceIdx = -1;
        let tableHeaderIdx = -1;

        for (let li = 0; li < filteredQLines.length; li++) {
            const txt = filteredQLines[li].fullText.trim();
            if (
                /Réponse(?:\s+attendue|\s+saisie|\s+discordante)/i.test(txt) ||
                /^attendue\s+saisie\s+discordante$/i.test(txt) ||
                /^Réponse\s+Réponse\s+Réponse$/i.test(txt)
            ) {
                if (tableHeaderIdx === -1) tableHeaderIdx = li;
            }
            if (
                ROW_START_REGEX.test(txt) ||
                (ROW_START_REGEX_ALT.test(txt) && ['☑', '■', '☐'].includes(txt.match(ROW_START_REGEX_ALT)?.[2] || ''))
            ) {
                if (firstChoiceIdx === -1) firstChoiceIdx = li;
                break;
            }
        }

        const promptCutoff = firstChoiceIdx !== -1
            ? (tableHeaderIdx !== -1 && tableHeaderIdx < firstChoiceIdx ? tableHeaderIdx : firstChoiceIdx)
            : (tableHeaderIdx !== -1 ? tableHeaderIdx : filteredQLines.length);

        const promptLines: string[] = [];
        for (let li = 1; li < promptCutoff; li++) {
            const txt = filteredQLines[li].fullText.trim();
            if (/^\s*Réponses?\s+(?:partiellement\s+)?(?:correctes?|incorrectes?)/i.test(txt)) continue;
            if (/Réponse|attendue|saisie|discordante/i.test(txt) && txt.length < 40) continue;
            if (/^multiples?$/i.test(txt)) continue;
            promptLines.push(filteredQLines[li].fullText);
        }

        const fullPrompt = promptLines.join('\n').trim();

        // Check if question is Numerical / Interval question
        const isNumericalQuestion = qType === 'numerical' || /numériques?/i.test(topLinesText) || filteredQLines.some(l => /valeurs?\s+numériques?/i.test(l.fullText));
        // Check if question is Association / Matching format
        const isMatchingTable = !isNumericalQuestion && (qType === 'matching' || filteredQLines.some(l => /Élément\s+à\s+associer/i.test(l.fullText)));
        // Check if question is Open / Short Answer
        const isOpenQuestion = !isNumericalQuestion && !isMatchingTable && (qType === 'short_answer' || (firstChoiceIdx === -1 && filteredQLines.some(l => /Réponses?\s+attendues?/i.test(l.fullText))));

        let cleanPrompt = fullPrompt;
        let codeSnippet: string | undefined;
        let codeLanguage = 'javascript';
        let choices: CCTLChoice[] = [];
        let matchingPairs: CCTLMatchingPair[] | undefined;
        let fillBlanks: CCTLFillBlankItem[] | undefined;

        if (isNumericalQuestion) {
            qType = 'numerical';
            rawType = 'Question à valeurs numériques';

            let statusLi = -1;
            let numTableHeaderLi = -1;
            for (let li = 0; li < filteredQLines.length; li++) {
                const txt = filteredQLines[li].fullText.trim();
                if (statusLi === -1 && /Réponses?\s+(?:correctes?|partiellement|incorrectes?)/i.test(txt)) {
                    statusLi = li;
                }
                if (numTableHeaderLi === -1 && (/Réponse\s+attendue/i.test(txt) || /^attendue\s+saisie/i.test(txt))) {
                    numTableHeaderLi = li;
                }
            }

            const numResult = parseNumericalQuestion(filteredQLines, numTableHeaderLi, statusLi !== -1 ? statusLi : (numTableHeaderLi !== -1 ? numTableHeaderLi : filteredQLines.length));
            cleanPrompt = numResult.cleanPrompt;
            codeSnippet = numResult.codeSnippet;
            codeLanguage = numResult.codeLanguage || 'cpp';
            choices = numResult.choices;
            if (numResult.matchingPairs.length > 0) {
                matchingPairs = numResult.matchingPairs;
            }
        } else if (isMatchingTable) {
            qType = 'matching';
            rawType = "Question d'association";

            let tableHeaderLi = -1;
            let statusLi = -1;
            for (let li = 0; li < filteredQLines.length; li++) {
                const txt = filteredQLines[li].fullText.trim();
                if (statusLi === -1 && /Réponses?\s+(?:correctes?|partiellement|incorrectes?)/i.test(txt)) {
                    statusLi = li;
                }
                if (tableHeaderLi === -1 && /Élément\s+à\s+associer/i.test(txt)) {
                    tableHeaderLi = li;
                }
            }

            const promptEndIdx = statusLi !== -1 ? statusLi : (tableHeaderLi !== -1 ? tableHeaderLi : filteredQLines.length);
            const matchingPromptLines = filteredQLines.slice(1, promptEndIdx).map(l => l.fullText.trim()).filter(Boolean);
            if (matchingPromptLines.length > 0) {
                cleanPrompt = matchingPromptLines.join('\n');
            }

            const matchResult = parseMatchingQuestion(filteredQLines, tableHeaderLi);
            matchingPairs = matchResult.matchingPairs;
            choices = matchResult.choices;
        } else if (isOpenQuestion) {
            qType = 'short_answer';
            rawType = 'Question à réponse ouverte et courte';

            let statusIdx = -1;
            let expectedIdx = -1;
            for (let li = 0; li < filteredQLines.length; li++) {
                const txt = filteredQLines[li].fullText.trim();
                if (statusIdx === -1 && /Réponses?\s+(?:correctes?|partiellement|incorrectes?)/i.test(txt)) {
                    statusIdx = li;
                }
                if (expectedIdx === -1 && /Réponses?\s+attendues?/i.test(txt)) {
                    expectedIdx = li;
                }
            }

            const openResult = parseOpenQuestion(filteredQLines, statusIdx, expectedIdx, status);
            if (openResult.cleanPrompt) cleanPrompt = openResult.cleanPrompt;
            choices = openResult.choices;
            fillBlanks = openResult.fillBlanks;
        } else {
            // Default QCM parsing
            choices = parseChoiceQuestion(filteredQLines, firstChoiceIdx);

            const promptCodeResult = separatePromptAndCode(fullPrompt.split('\n'));
            cleanPrompt = promptCodeResult.cleanPrompt || fullPrompt;
            codeSnippet = promptCodeResult.codeSnippet;
            if (promptCodeResult.codeLanguage) {
                codeLanguage = promptCodeResult.codeLanguage;
            }
        }

        // If question has no codeSnippet but section has a shared codeSnippet, inherit it
        if (!codeSnippet && start.sectionData.codeSnippet) {
            codeSnippet = start.sectionData.codeSnippet;
            codeLanguage = start.sectionData.codeLanguage || 'cpp';
        }

        const validPrompt = (cleanPrompt || fullPrompt).trim();
        const hasOptions = (choices && choices.length > 0) || (matchingPairs && matchingPairs.length > 0) || (fillBlanks && fillBlanks.length > 0);

        // Skip invalid empty questions without choices/answers or with trivial prompt like "cesi.fr"
        if (!hasOptions && (!validPrompt || /^cesi\.fr$/i.test(validPrompt) || validPrompt.length < 5)) {
            continue;
        }

        const isMainSection = start.sectionTitle === 'Partie Principale';
        const correctExpectedCount = choices.filter(c => c.isExpected).length;
        typeCounts[qType] = (typeCounts[qType] || 0) + 1;

        const snapshotUrl = questionSnapshots.get(start.globalNumber);

        // Detect if prompt contains missing math formulas or formula gap patterns
        const hasPromptFormula = Boolean(
            validPrompt && (
                /l['’]équation\s*(?::|\?|\s+sur)/i.test(validPrompt) ||
                /particulière\s+de\s*(?::|\?)/i.test(validPrompt) ||
                /intégrale\s+(?:double|triple|simple)?\s+suivante/i.test(validPrompt) ||
                /au\s+point\s+de\s+la\s+fonction/i.test(validPrompt) ||
                /du\s+champ\s+vectoriel\s+suivant/i.test(validPrompt) ||
                /fonction\s+suivante\s*\?/i.test(validPrompt) ||
                /de\s+la\s+fonction\s*\?/i.test(validPrompt) ||
                /dérivée\s+partielle\s+de/i.test(validPrompt) ||
                /matrice\s+suivante/i.test(validPrompt) ||
                /somme\s+suivante/i.test(validPrompt) ||
                /gradient\s+(?:au\s+point|de)/i.test(validPrompt) ||
                /divergence\s+du/i.test(validPrompt) ||
                /rotationnel\s+du/i.test(validPrompt) ||
                /:\s*\?/i.test(validPrompt) ||
                /:\s*sur\s*\?/i.test(validPrompt)
            )
        );

        // Only attach promptImageUrl if the prompt actually has a missing vector formula
        const promptImageUrl = hasPromptFormula ? promptSnapshots.get(start.globalNumber) : undefined;

        // Attach individual choice formula image ONLY if choice text is empty (was a vector formula)
        const enrichedChoices = choices.map(c => {
            const isMissingTextFormula = !c.text || c.text.trim().length === 0;
            const choiceImg = isMissingTextFormula ? choiceSnapshots.get(`${start.globalNumber}_${c.id}`) : undefined;
            return {
                ...c,
                imageUrl: choiceImg || c.imageUrl
            };
        });

        const hasMathFormula = hasPromptFormula || enrichedChoices.some(c => Boolean(c.imageUrl));

        questions.push({
            id: `q-${start.globalNumber}-${Date.now().toString(36)}`,
            number: start.globalNumber,
            sectionTitle: !isMainSection ? start.sectionTitle : undefined,
            sectionQuestionNumber: start.sectionQuestionNumber,
            category: !isMainSection ? start.sectionTitle : undefined,
            type: qType,
            typeLabel: rawType,
            status,
            statusRaw,
            discordanceCount,
            prompt: validPrompt,
            promptImageUrl,
            formulaImageUrl: promptImageUrl,
            hasPromptFormula,
            codeSnippet,
            codeLanguage,
            snapshotUrl,
            hasMathFormula,
            choices: enrichedChoices,
            matchingPairs: matchingPairs && matchingPairs.length > 0 ? matchingPairs : undefined,
            fillBlanks: fillBlanks && fillBlanks.length > 0 ? fillBlanks : undefined,
            correctAnswersCount: correctExpectedCount,
            rawText: filteredQLines.map(l => l.fullText).join('\n')
        });
    }

    // Determine Subject, Promo, Domain and Academic Year
    const sampleHeaderLines = allVisualLines.slice(0, 35).map(l => l.fullText).join(' ');
    const { promo, domain, cleanSubject, academicYear } = detectPromoAndDomain(
        rawTitle,
        fileName,
        sampleHeaderLines,
        studentName
    );
    const subject = cleanSubject || rawTitle || fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');

    const examSections = detectedSections
        .filter(s => s.questionCount > 0)
        .map(s => ({
            id: s.id,
            title: s.title,
            introText: s.introText || undefined,
            codeSnippet: s.codeSnippet || undefined,
            codeLanguage: s.codeLanguage || undefined,
            questionCount: s.questionCount
        }));

    return {
        id: `exam-${Date.now().toString(36)}`,
        title: `${subject} (${promo} - ${academicYear})`,
        studentName,
        evaluationStandard,
        evaluationWeighted,
        promo,
        domain,
        subject,
        year: academicYear,
        sections: examSections.length > 1 ? examSections : undefined,
        totalQuestions: questions.length,
        questions,
        stats: {
            correctCount,
            partialCount,
            incorrectCount,
            totalDiscordances,
            typeCounts
        },
        metadata: {
            fileName,
            fileSize,
            totalPages: numPages,
            parsedAt: new Date().toISOString(),
            source: 'pdf_export'
        }
    };
}
