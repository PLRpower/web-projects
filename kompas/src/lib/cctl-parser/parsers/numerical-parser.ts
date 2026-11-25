import { readAssociationRows } from '../answer-table';
import type { PageImages } from '../page-images';
import type { PageLayout } from '../page-layout';
import type { VisualLine } from '../types';

export async function parseNumericalQuestion(lines: VisualLine[], headerIndex: number, layouts: PageLayout[], images: PageImages) {
    const rows = await readAssociationRows(lines, headerIndex, layouts, images);
    const matchingPairs = rows.length > 1 || rows.some(row => row.leftItem || row.leftImageUrl) ? rows : [];
    const choices = rows.map(row => ({
        id: row.id,
        text: row.leftItem ? `${row.leftItem} : ${row.rightExpected}` : row.rightExpected,
        isExpected: true,
        isStudentAnswer: row.isCorrect,
        isDiscordant: !row.isCorrect,
        discordanceDetail: row.discordanceDetail,
        explanation: row.explanation,
        explanationImageUrl: row.explanationImageUrl,
    }));
    const fillBlanks = matchingPairs.length ? [] : rows.map(row => ({
        blankIndex: 1,
        expectedText: row.rightExpected,
        studentText: row.rightStudent,
        isCorrect: row.isCorrect,
    }));
    return { choices, matchingPairs, fillBlanks };
}
