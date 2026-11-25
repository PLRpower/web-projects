import { readAssociationRows } from '../answer-table';
import type { PageImages } from '../page-images';
import type { PageLayout } from '../page-layout';
import type { VisualLine } from '../types';

export async function parseMatchingQuestion(lines: VisualLine[], headerIndex: number, layouts: PageLayout[], images: PageImages) {
    const matchingPairs = await readAssociationRows(lines, headerIndex, layouts, images);
    const choices = matchingPairs.map(pair => ({
        id: pair.id,
        text: pair.leftItem ? `${pair.leftItem} : ${pair.rightExpected}` : pair.rightExpected,
        isExpected: true,
        isStudentAnswer: pair.isCorrect,
        isDiscordant: !pair.isCorrect,
        discordanceDetail: pair.discordanceDetail,
        explanation: pair.explanation,
        explanationImageUrl: pair.explanationImageUrl,
    }));
    return { matchingPairs, choices };
}
