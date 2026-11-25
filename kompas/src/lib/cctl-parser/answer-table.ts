import { tableColumns, tableRow } from './page-layout';
import type { Bounds, PageLayout } from './page-layout';
import type { PageImages } from './page-images';
import { joinVisualItems } from './spatial';
import type { VisualItem, VisualLine } from './types';

const PROPOSAL_COMMENT = /^\uf075?\s*Commentaire de correction de la proposition$/i;

interface Row {
    page: number;
    bounds: Bounds;
    columns: number[];
    lines: VisualLine[];
    explanation?: string;
    explanationImageUrl?: string;
}

export async function readRow(
    lines: VisualLine[], marker: VisualLine, anchor: VisualItem, next: VisualLine | undefined,
    layout: PageLayout, images: PageImages
): Promise<Row> {
    const bounds = tableRow(layout, anchor);
    const columns = tableColumns(layout, anchor.y);
    if (!Number.isFinite(bounds[3])) bounds[3] = marker.y + anchor.height;
    if (!Number.isFinite(bounds[1])) bounds[1] = next?.page === marker.page ? next.y + anchor.height : 28;
    const rowLines = lines.filter(l => l.page === marker.page && l.y > bounds[1] && l.y <= bounds[3]);
    const comment = rowLines.findIndex(l => l.items.some(item => PROPOSAL_COMMENT.test(item.text.trim())));
    if (comment === -1) return { page: marker.page, bounds, columns, lines: rowLines };

    const commentLine = rowLines[comment];
    const commentLines = rowLines.slice(comment + 1);
    const explanation = commentLines.map(l => l.fullText).join('\n') || undefined;
    const explanationImageUrl = await images.capture([{
        page: marker.page,
        bounds: [commentLine.items[0].x - 3, bounds[1], bounds[2], commentLine.y - 5],
    }], commentLines);
    bounds[1] = commentLine.y + 16;
    return { page: marker.page, bounds, columns, lines: rowLines.slice(0, comment), explanation, explanationImageUrl };
}

export function readCell(row: Row, left: number, right: number, separator = ' '): string {
    return row.lines.map(line => joinVisualItems(line.items.filter(item => item.x >= left && item.x < right)))
        .filter(Boolean).join(separator);
}

export function captureCell(row: Row, images: PageImages, left: number, right: number) {
    return images.capture([{ page: row.page, bounds: [left + 1, row.bounds[1], right - 1, row.bounds[3]] }], row.lines);
}

export const DISCORDANCE = /^(Non|Oui)(?:\s*(\(\+\d+\)))?$/i;

export async function readAssociationRows(lines: VisualLine[], headerIndex: number, layouts: PageLayout[], images: PageImages) {
    if (headerIndex === -1) return [];
    const header = lines[headerIndex];
    const expectedX = header.items.find(i => /attendue/i.test(i.text))?.x;
    const studentX = header.items.find(i => /saisie/i.test(i.text))?.x;
    const discordanceX = header.items.find(i => /discordante/i.test(i.text))?.x;
    if (expectedX === undefined || studentX === undefined || discordanceX === undefined) return [];

    const body = lines.slice(headerIndex + 1);
    const markers = body.flatMap(line => {
        const anchor = line.items.find(item => Math.abs(item.x - discordanceX) < 4 && DISCORDANCE.test(item.text.trim()));
        return anchor ? [{ line, anchor }] : [];
    });

    const pairs = [];
    for (const [i, { line, anchor }] of markers.entries()) {
        const row = await readRow(body, line, anchor, markers[i + 1]?.line, layouts[line.page - 1], images);
        const columnStart = (x: number) => row.columns.findLast(c => c <= x) ?? x - 10;
        const left = row.columns[0] ?? 45;
        const expected = columnStart(expectedX);
        const student = columnStart(studentX);
        const discordance = columnStart(discordanceX);
        const marker = readCell(row, discordance, row.columns.find(c => c > discordance + 1) ?? row.bounds[2]);
        const detail = marker.match(DISCORDANCE);
        pairs.push({
            id: String.fromCharCode(65 + i),
            leftItem: readCell(row, left, expected),
            leftImageUrl: left < expected ? await captureCell(row, images, left, expected) : undefined,
            rightExpected: readCell(row, expected, student),
            rightStudent: readCell(row, student, discordance) || undefined,
            isCorrect: /^Non\b/i.test(anchor.text),
            discordanceDetail: detail?.[2] ? `Oui ${detail[2]}` : undefined,
            explanation: row.explanation,
            explanationImageUrl: row.explanationImageUrl,
        });
    }
    return pairs;
}
