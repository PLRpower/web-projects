import { CCTLChoice, CCTLMatchingPair } from '@/types/cctl';
import { VisualLine } from '../types';

/**
 * Parses numerical interval questions [ min ; max ]
 * Handles both single questions and multi-part questions (e.g. Q8).
 */
export function parseNumericalQuestion(
    filteredQLines: VisualLine[],
    tableHeaderLi: number,
    promptEndIdx: number
): {
    cleanPrompt: string;
    codeSnippet?: string;
    codeLanguage?: string;
    choices: CCTLChoice[];
    matchingPairs: CCTLMatchingPair[];
} {
    const promptLines = filteredQLines.slice(1, promptEndIdx).map(l => l.fullText.trim()).filter(Boolean);

    const textParts: string[] = [];
    const codeParts: string[] = [];
    let inCodeBlock = false;

    for (const pl of promptLines) {
        if (/^(?:#include|class\s+\w+|struct\s+\w+|int\s+main|namespace\s+\w+|template\s*<)/.test(pl) || inCodeBlock) {
            inCodeBlock = true;
            codeParts.push(pl);
        } else {
            textParts.push(pl);
        }
    }

    const cleanPrompt = textParts.join('\n');
    let codeSnippet: string | undefined;
    let codeLanguage: string | undefined;

    if (codeParts.length > 0) {
        codeSnippet = codeParts.join('\n');
        codeLanguage = 'cpp';
    }

    const answerLines = filteredQLines.slice(tableHeaderLi !== -1 ? tableHeaderLi + 1 : promptEndIdx);
    const numPairs: CCTLMatchingPair[] = [];
    const numChoices: CCTLChoice[] = [];

    let currentLabel = '';
    let currentInterval = '';

    for (const l of answerLines) {
        if (/Commentaire\s+de\s+correction/i.test(l.fullText) || /^\d+\s*\/\s*\d+$/.test(l.fullText.trim())) {
            if (currentInterval) {
                if (!currentLabel || currentLabel.toLowerCase() === 'énoncé') {
                    numChoices.push({ id: 'A', text: currentInterval, isExpected: true });
                } else {
                    numPairs.push({
                        id: String.fromCharCode(65 + numPairs.length),
                        leftItem: currentLabel,
                        rightExpected: currentInterval,
                        isCorrect: true
                    });
                }
                currentLabel = '';
                currentInterval = '';
            }
            continue;
        }

        const intervalMatch = l.fullText.match(/([\[\]]\s*-?\d+(?:[.,]\d+)?\s*;\s*-?\d+(?:[.,]\d+)?\s*[\[\]])/);
        if (intervalMatch) {
            if (currentInterval) {
                if (!currentLabel || currentLabel.toLowerCase() === 'énoncé') {
                    numChoices.push({ id: 'A', text: currentInterval, isExpected: true });
                } else {
                    numPairs.push({
                        id: String.fromCharCode(65 + numPairs.length),
                        leftItem: currentLabel,
                        rightExpected: currentInterval,
                        isCorrect: true
                    });
                }
                currentLabel = '';
                currentInterval = '';
            }

            currentInterval = intervalMatch[1].trim();
            const beforeInterval = l.fullText.slice(0, l.fullText.indexOf(currentInterval)).trim();
            if (beforeInterval) {
                currentLabel = (currentLabel ? currentLabel + ' ' : '') + beforeInterval;
            }
        } else if (currentInterval) {
            const extra = l.fullText.trim();
            if (extra && !/Réponse/i.test(extra)) {
                currentLabel = (currentLabel ? currentLabel + ' ' : '') + extra;
            }
        } else {
            const txt = l.fullText.trim();
            if (txt && !/Réponse/i.test(txt)) {
                currentLabel = (currentLabel ? currentLabel + ' ' : '') + txt;
            }
        }
    }

    if (currentInterval) {
        if (!currentLabel || currentLabel.toLowerCase() === 'énoncé') {
            numChoices.push({ id: 'A', text: currentInterval, isExpected: true });
        } else {
            numPairs.push({
                id: String.fromCharCode(65 + numPairs.length),
                leftItem: currentLabel,
                rightExpected: currentInterval,
                isCorrect: true
            });
        }
    }

    const choices: CCTLChoice[] = [];
    const matchingPairs: CCTLMatchingPair[] = [];

    if (numPairs.length > 0) {
        matchingPairs.push(...numPairs);
        for (const p of numPairs) {
            choices.push({
                id: p.id,
                text: `${p.leftItem} : ${p.rightExpected}`,
                isExpected: true
            });
        }
    } else if (numChoices.length > 0) {
        choices.push(...numChoices);
    }

    return { cleanPrompt, codeSnippet, codeLanguage, choices, matchingPairs };
}
