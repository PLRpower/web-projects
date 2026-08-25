import { getDocumentProxy } from 'unpdf';
import { VisualLine, VisualItem } from './types';

/**
 * Extracts all text items from a PDF with their 2D spatial coordinates (X, Y)
 * and groups them into visually ordered lines.
 */
export async function extractVisualLines(pdfBuffer: Uint8Array): Promise<{ lines: VisualLine[]; numPages: number }> {
    const clone = new Uint8Array(
        pdfBuffer.buffer.slice(
            pdfBuffer.byteOffset,
            pdfBuffer.byteOffset + pdfBuffer.byteLength
        )
    );
    const pdf = await getDocumentProxy(clone);
    const numPages = pdf.numPages;
    const allVisualLines: VisualLine[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const items: { text: string; x: number; y: number }[] = [];
        for (const item of textContent.items) {
            if ('str' in item && typeof item.str === 'string' && item.str.trim()) {
                items.push({
                    text: item.str,
                    x: Math.round(item.transform[4]),
                    y: Math.round(item.transform[5])
                });
            }
        }

        // Sort items by Y (top to bottom), then by X (left to right)
        const sortedItems = items.sort((a, b) => {
            if (Math.abs(b.y - a.y) > 4) {
                return b.y - a.y;
            }
            return a.x - b.x;
        });

        // Group into lines with a tolerance of 4 units on Y axis
        let currentY: number | null = null;
        let currentLineItems: VisualItem[] = [];

        for (const item of sortedItems) {
            if (currentY === null || Math.abs(currentY - item.y) <= 4) {
                currentLineItems.push({ text: item.text, x: item.x });
                currentY = item.y;
            } else {
                if (currentLineItems.length > 0) {
                    allVisualLines.push({
                        page: pageNum,
                        y: currentY,
                        items: currentLineItems,
                        fullText: currentLineItems.map(i => i.text).join(' ').trim()
                    });
                }
                currentLineItems = [{ text: item.text, x: item.x }];
                currentY = item.y;
            }
        }

        if (currentLineItems.length > 0 && currentY !== null) {
            allVisualLines.push({
                page: pageNum,
                y: currentY,
                items: currentLineItems,
                fullText: currentLineItems.map(i => i.text).join(' ').trim()
            });
        }
    }

    return { lines: allVisualLines, numPages };
}
