import { createIsomorphicCanvasFactory, getDocumentProxy } from 'unpdf';
import type { VisualLine, VisualItem } from './types';
import { extractPageLayout } from './page-layout';
import type { PageLayout } from './page-layout';

export function joinVisualItems(items: VisualItem[]): string {
    return items.reduce((text, item, index) => {
        const previous = items[index - 1];
        const gap = previous ? item.x - previous.x - previous.width : 0;
        const space = gap > 0.8 && !/\s$/.test(text) && !/^\s/.test(item.text);
        return text + (space ? ' ' : '') + item.text;
    }, '').trim();
}

export function isSectionTitleLine(line: VisualLine, next?: VisualLine): boolean {
    const { x, height } = line.items[0];
    return x >= 34 && x < 46 && (height >= 20 ||
        (height >= 18 && /^(?:Échelle d'évaluation standard|Note du dossier)/i.test(next?.fullText ?? '')));
}

/**
 * Extracts all text items from a PDF with their 2D spatial coordinates (X, Y)
 * and groups them into visually ordered lines.
 */
export async function extractVisualLines(pdfBuffer: Uint8Array, includeLayout = false) {
    const clone = new Uint8Array(
        pdfBuffer.buffer.slice(
            pdfBuffer.byteOffset,
            pdfBuffer.byteOffset + pdfBuffer.byteLength
        )
    );
    const options = includeLayout ? { CanvasFactory: await createIsomorphicCanvasFactory(() => import('@napi-rs/canvas')) } : undefined;
    const pdf = await getDocumentProxy(clone, options);
    const numPages = pdf.numPages;
    const allVisualLines: VisualLine[] = [];
    const layouts: PageLayout[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        if (includeLayout) layouts.push(await extractPageLayout(page));

        const items: VisualItem[] = [];
        for (const item of textContent.items) {
            if ('str' in item && typeof item.str === 'string' && item.str.trim()) {
                items.push({
                    text: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                    width: item.width,
                    height: item.height,
                });
            }
        }

        const pageLines: VisualLine[] = [];
        for (const item of items.sort((a, b) => b.y - a.y || a.x - b.x)) {
            const line = pageLines.at(-1);
            if (line && line.y - item.y <= 5) {
                line.items.push(item);
                continue;
            }
            pageLines.push({ page: pageNum, y: item.y, items: [item], fullText: '' });
        }

        for (const line of pageLines) {
            line.items.sort((a, b) => a.x - b.x);
            line.fullText = joinVisualItems(line.items);
        }
        allVisualLines.push(...pageLines);
    }

    return { lines: allVisualLines, numPages, layouts, pdf };
}
