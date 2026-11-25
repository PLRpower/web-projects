import type { CCTLChoice } from '@/types/cctl';
import { captureCell, readCell, readRow } from '../answer-table';
import type { PageImages } from '../page-images';
import type { PageLayout } from '../page-layout';
import type { VisualLine } from '../types';

export const CHOICE_ROW = /^([A-Z])\s+([☑■☐])\s+([☑■☐])(?:\s+(Oui(?:\s*\(\+\d+\))?|Non)(?=\s|$))?\s*(.*)$/;

export async function parseChoiceQuestion(lines: VisualLine[], layouts: PageLayout[], images: PageImages): Promise<CCTLChoice[]> {
    const markers = lines.flatMap(line => {
        const match = line.fullText.match(CHOICE_ROW);
        return match ? [{ line, match }] : [];
    });
    const choices: CCTLChoice[] = [];
    for (const [index, { line, match }] of markers.entries()) {
        const [, id, expected, student, discordance, fallbackText] = match;
        const row = await readRow(lines, line, line.items[0], markers[index + 1]?.line, layouts[line.page - 1], images);
        const right = row.columns.at(-1) ?? row.bounds[2];
        const left = row.columns[4];
        const expression = discordance?.replace(/\s+/g, ' ');
        choices.push({
            id,
            text: left === undefined ? fallbackText : readCell(row, left, right),
            imageUrl: left === undefined ? undefined : await captureCell(row, images, left, right),
            isExpected: expected === '☑',
            isStudentAnswer: student === '☑',
            isDiscordant: expression?.startsWith('Oui') ?? false,
            discordanceDetail: expression?.includes('+') ? expression : undefined,
            explanation: row.explanation,
            explanationImageUrl: row.explanationImageUrl,
        });
    }
    return choices;
}
