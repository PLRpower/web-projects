import { CCTLChoice, CCTLMatchingPair } from '@/types/cctl';
import { VisualLine } from '../types';

/**
 * Parses association / matching questions using dynamic horizontal (X) column positions
 * from the table headers and vertical midpoint segmentation.
 */
export function parseMatchingQuestion(
    filteredQLines: VisualLine[],
    tableHeaderLi: number
): { matchingPairs: CCTLMatchingPair[]; choices: CCTLChoice[] } {
    const matchingPairs: CCTLMatchingPair[] = [];
    const choices: CCTLChoice[] = [];

    if (tableHeaderLi === -1) {
        return { matchingPairs, choices };
    }

    const tableHeaderLine = filteredQLines[tableHeaderLi];
    const headerY = tableHeaderLine.y;
    const bodyLines = filteredQLines.filter(l => l.page === tableHeaderLine.page && l.y < headerY);

    // Detect column positions dynamically from header lines
    const headerScanLines = filteredQLines.slice(Math.max(0, tableHeaderLi - 1), tableHeaderLi + 1);
    let expX: number | null = null;
    let studX: number | null = null;
    let discX: number | null = null;

    for (const hl of headerScanLines) {
        for (const item of hl.items) {
            if (/attendue/i.test(item.text) && expX === null) expX = item.x;
            if (/saisie/i.test(item.text) && studX === null) studX = item.x;
            if (/discordante/i.test(item.text) && discX === null) discX = item.x;
        }
    }

    const col1MaxX = expX ? expX - 15 : 400;
    const col2MaxX = studX ? studX - 15 : 600;
    const col3MaxX = discX ? discX - 15 : 750;
    const discMinX = discX ? discX - 25 : 740;

    const allItems: { text: string; x: number; y: number }[] = [];
    for (const bl of bodyLines) {
        for (const it of bl.items) {
            allItems.push({ text: it.text.trim(), x: it.x, y: bl.y });
        }
    }

    const discItems = allItems
        .filter(it => it.x >= discMinX && (/^Non\b/i.test(it.text) || /^Oui\b/i.test(it.text)))
        .sort((a, b) => b.y - a.y);

    if (discItems.length > 0) {
        for (let di = 0; di < discItems.length; di++) {
            const currentDisc = discItems[di];
            const prevY = di === 0 ? headerY : (discItems[di - 1].y + currentDisc.y) / 2;
            const nextY = di === discItems.length - 1 ? -9999 : (currentDisc.y + discItems[di + 1].y) / 2;

            const rowItems = allItems.filter(it => it.y <= prevY && it.y > nextY);
            const leftItems = rowItems.filter(it => it.x < col1MaxX).sort((a, b) => b.y - a.y || a.x - b.x);
            const expItems = rowItems.filter(it => it.x >= col1MaxX && it.x < col2MaxX).sort((a, b) => b.y - a.y || a.x - b.x);
            const studItems = rowItems.filter(it => it.x >= col2MaxX && it.x < col3MaxX).sort((a, b) => b.y - a.y || a.x - b.x);

            const leftText = leftItems.map(it => it.text).join(' ').trim();
            const expText = expItems.map(it => it.text).join(' ').trim();
            const studText = studItems.map(it => it.text).join(' ').trim();
            const isCorrect = currentDisc.text.toLowerCase().startsWith('non');
            const pairId = String.fromCharCode(65 + di);

            if (leftText && expText) {
                matchingPairs.push({
                    id: pairId,
                    leftItem: leftText,
                    rightExpected: expText,
                    rightStudent: studText || undefined,
                    isCorrect,
                    discordanceDetail: currentDisc.text.includes('+') ? currentDisc.text : undefined
                });

                choices.push({
                    id: pairId,
                    text: `${leftText} : ${expText}`,
                    isExpected: true,
                    isStudentAnswer: isCorrect,
                    isDiscordant: !isCorrect,
                    discordanceDetail: currentDisc.text.includes('+') ? currentDisc.text : undefined
                });
            }
        }
    }

    return { matchingPairs, choices };
}
