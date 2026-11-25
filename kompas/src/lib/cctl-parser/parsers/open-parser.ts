import type { CCTLChoice, CCTLFillBlankItem, CCTLStudentStatus } from '@/types/cctl';
import type { VisualLine } from '../types';

export function parseOpenQuestion(lines: VisualLine[], expectedIndex: number, status: CCTLStudentStatus) {
    const studentText = lines.slice(0, expectedIndex === -1 ? undefined : expectedIndex)
        .map(l => l.fullText).filter(l => !/^(?:Pas encore corrigée|Aucune réponse saisie)$/i.test(l)).join('\n');
    const expectedText = expectedIndex === -1 ? '' : lines.slice(expectedIndex + 1).map(l => l.fullText).join('\n');
    const choices: CCTLChoice[] = expectedText ? [{
        id: 'A',
        text: expectedText,
        isExpected: true,
        isStudentAnswer: status === 'correct',
        isDiscordant: status === 'incorrect' || status === 'partially_correct'
    }] : [];
    const fillBlanks: CCTLFillBlankItem[] = studentText || expectedText ? [{
        blankIndex: 1,
        expectedText,
        studentText: studentText || undefined,
        isCorrect: status === 'correct'
    }] : [];
    return { choices, fillBlanks };
}
