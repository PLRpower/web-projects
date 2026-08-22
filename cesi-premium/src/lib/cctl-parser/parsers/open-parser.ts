import { CCTLChoice, CCTLFillBlankItem, CCTLStudentStatus } from '@/types/cctl';
import { VisualLine } from '../types';

/**
 * Parses short answer / open response questions
 */
export function parseOpenQuestion(
    filteredQLines: VisualLine[],
    statusIdx: number,
    expectedIdx: number,
    status: CCTLStudentStatus
): {
    cleanPrompt: string;
    choices: CCTLChoice[];
    fillBlanks: CCTLFillBlankItem[];
} {
    const promptEndIdx = statusIdx !== -1 ? statusIdx : (expectedIdx !== -1 ? expectedIdx : filteredQLines.length);
    const promptLinesShort = filteredQLines.slice(1, promptEndIdx).map(l => l.fullText.trim()).filter(Boolean);
    const cleanPrompt = promptLinesShort.join('\n');

    let studentAnswer = '';
    if (statusIdx !== -1 && expectedIdx !== -1 && expectedIdx > statusIdx + 1) {
        studentAnswer = filteredQLines.slice(statusIdx + 1, expectedIdx).map(l => l.fullText.trim()).filter(Boolean).join('\n');
    }

    let expectedAnswer = '';
    if (expectedIdx !== -1 && expectedIdx < filteredQLines.length) {
        expectedAnswer = filteredQLines.slice(expectedIdx + 1).map(l => l.fullText.trim()).filter(Boolean).join('\n');
    }

    if (!expectedAnswer && studentAnswer && status === 'correct') {
        expectedAnswer = studentAnswer;
    }

    const choices: CCTLChoice[] = [];
    const fillBlanks: CCTLFillBlankItem[] = [];

    if (expectedAnswer) {
        choices.push({
            id: 'A',
            text: expectedAnswer,
            isExpected: true,
            isStudentAnswer: Boolean(studentAnswer && (studentAnswer.toLowerCase() === expectedAnswer.toLowerCase() || status === 'correct')),
            isDiscordant: status !== 'correct'
        });

        fillBlanks.push({
            blankIndex: 1,
            expectedText: expectedAnswer,
            studentText: studentAnswer || undefined,
            isCorrect: status === 'correct'
        });
    }

    return { cleanPrompt, choices, fillBlanks };
}
