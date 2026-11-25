import { getResolvedPDFJS } from 'unpdf';
import type { getDocumentProxy } from 'unpdf';
import type { VisualItem } from './types';

// Coordinates are in PDF points, with the origin at the bottom left.
export type Bounds = [left: number, bottom: number, right: number, top: number];

interface Rule {
    start: number;
    end: number;
    position: number;
}

export interface PageLayout {
    width: number;
    height: number;
    horizontalRules: Rule[];
    verticalRules: Rule[];
    graphics: Bounds[];
}

export type PDFDocument = Awaited<ReturnType<typeof getDocumentProxy>>;
type PDFPage = Awaited<ReturnType<PDFDocument['getPage']>>;

function transformBounds([x0, y0, x1, y1]: Bounds, [a, b, c, d, e, f]: number[]): Bounds {
    const xs = [a * x0 + c * y0 + e, a * x1 + c * y0 + e, a * x0 + c * y1 + e, a * x1 + c * y1 + e];
    const ys = [b * x0 + d * y0 + f, b * x1 + d * y0 + f, b * x0 + d * y1 + f, b * x1 + d * y1 + f];
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

export async function extractPageLayout(page: PDFPage): Promise<PageLayout> {
    const { OPS, Util } = await getResolvedPDFJS();
    const { fnArray, argsArray } = await page.getOperatorList();
    const [left, bottom, right, top] = page.view;
    const width = right - left;
    const height = top - bottom;
    const horizontalRules: Rule[] = [];
    const verticalRules: Rule[] = [];
    const graphics: Bounds[] = [];
    type State = { matrix: number[]; fill: string; stroke: string };
    let state: State = { matrix: [1, 0, 0, 1, 0, 0], fill: '#000000', stroke: '#000000' };
    const stack: State[] = [];

    for (const [i, op] of fnArray.entries()) {
        const args = argsArray[i];
        if (op === OPS.save) stack.push(state);
        if (op === OPS.restore) state = stack.pop() ?? state;
        if (op === OPS.transform) state = { ...state, matrix: Util.transform(state.matrix, args) };
        if (op === OPS.setFillRGBColor) state = { ...state, fill: args[0] };
        if (op === OPS.setStrokeRGBColor) state = { ...state, stroke: args[0] };
        if (op === OPS.paintImageXObject || op === OPS.paintInlineImageXObject) {
            const box = transformBounds([0, 0, 1, 1], state.matrix);
            // The report uses full-width images for card borders, shadows and headings.
            if (box[2] - box[0] < width * 0.88) graphics.push(box);
        }
        if (op !== OPS.constructPath || !args[2]) continue;

        const box = transformBounds(args[2], state.matrix);
        const [x0, y0, x1, y1] = box;
        const w = x1 - x0;
        const h = y1 - y0;
        const operation = args[0];
        if (operation === OPS.fill && state.fill === '#dddddd') {
            if (h <= 1 && w > 5) horizontalRules.push({ start: x0, end: x1, position: (y0 + y1) / 2 });
            if (w <= 1 && h > 5) verticalRules.push({ start: y0, end: y1, position: (x0 + x1) / 2 });
        }
        // MathJax equations in these reports are drawn as dark paths.
        const paint = operation === OPS.stroke ? state.stroke : state.fill;
        if ((operation === OPS.fill || operation === OPS.eoFill || operation === OPS.stroke) &&
            /^#(?:000000|333333)$/.test(paint) && (w > 0.8 || h > 0.8) && w < width * 0.88) {
            graphics.push(box);
        }
    }

    return { width, height, horizontalRules, verticalRules, graphics };
}

export function tableRow(layout: PageLayout, item: VisualItem): Bounds {
    let top = Infinity;
    let bottom = -Infinity;
    for (const rule of layout.horizontalRules) {
        if (item.x < rule.start || item.x > rule.end) continue;
        if (rule.position > item.y) top = Math.min(top, rule.position);
        else bottom = Math.max(bottom, rule.position);
    }
    return [0, bottom, layout.width, top];
}

export function tableColumns(layout: PageLayout, y: number): number[] {
    return layout.verticalRules
        .filter(rule => rule.start < y && rule.end > y)
        .map(rule => rule.position)
        .sort((a, b) => a - b)
        .filter((x, index, xs) => index === 0 || x - xs[index - 1] > 1);
}
