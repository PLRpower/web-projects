import { createCanvas } from '@napi-rs/canvas';
import type { Canvas } from '@napi-rs/canvas';
import type { Bounds, PageLayout, PDFDocument } from './page-layout';
import type { VisualLine } from './types';

interface PageRegion {
    page: number;
    bounds: Bounds;
}

export class PageImages {
    private pdf: PDFDocument;
    private layouts: PageLayout[];
    private cachedPage?: { number: number; canvas: Canvas };

    constructor(pdf: PDFDocument, layouts: PageLayout[]) {
        this.pdf = pdf;
        this.layouts = layouts;
    }

    async capture(regions: PageRegion[], lines: VisualLine[], force = false): Promise<string | undefined> {
        const boxRegions = regions.map(region => {
            const [left, bottom, right, top] = region.bounds;
            const graphics = this.layouts[region.page - 1].graphics.filter(([x0, y0, x1, y1]) =>
                x0 >= left - 1 && x1 <= right + 1 && y0 >= bottom - 1 && y1 <= top + 1);
            const groups = lines.filter(line => line.page === region.page).map(line => line.items
                .filter(item => item.x >= left && item.x < right && item.y >= bottom && item.y <= top));
            const items = groups.flat();
            const hasRaisedOrLoweredText = groups.some(group => group.some(item => group.some(other =>
                other.height > item.height * 1.2 && Math.abs(other.y - item.y) > 1.5)));
            const boxes: Bounds[] = [...graphics, ...items.map(({ x, y, width, height }) =>
                [x, y - height * 0.3, x + width, y + height] as Bounds)];
            if (boxes.length === 0) return undefined;
            return {
                page: region.page,
                hasGraphics: graphics.length > 0 || hasRaisedOrLoweredText ||
                    items.some(item => /[\u0000-\u0008\uFFFD]/.test(item.text)),
                bounds: [
                    Math.max(left, Math.floor(Math.min(...boxes.map(b => b[0])) - 3)),
                    Math.max(bottom, Math.floor(Math.min(...boxes.map(b => b[1])) - 3)),
                    Math.min(right, Math.ceil(Math.max(...boxes.map(b => b[2])) + 3)),
                    Math.min(top, Math.ceil(Math.max(...boxes.map(b => b[3])) + 3)),
                ] as Bounds,
            };
        }).filter(region => region !== undefined);
        if (!boxRegions.length || (!force && !boxRegions.some(region => region.hasGraphics))) return;

        const width = Math.ceil(Math.max(...boxRegions.map(({ bounds: b }) => b[2] - b[0])));
        const height = boxRegions.reduce((sum, { bounds: b }) => sum + Math.ceil(b[3] - b[1]), 0);
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        let offset = 0;
        for (const { page, bounds: [left, bottom, right, top] } of boxRegions) {
            const pageCanvas = await this.renderPage(page);
            context.drawImage(pageCanvas, left, this.layouts[page - 1].height - top, right - left, top - bottom,
                0, offset, right - left, top - bottom);
            offset += Math.ceil(top - bottom);
        }
        return canvas.toDataURL('image/webp', 0.9);
    }

    async between(start: VisualLine, end: VisualLine, lines: VisualLine[], left = 45, right?: number, force = false) {
        const regions: PageRegion[] = [];
        for (let page = start.page; page <= end.page; page++) {
            const layout = this.layouts[page - 1];
            regions.push({
                page,
                bounds: [
                    left,
                    page === end.page ? end.y + 20 : 29,
                    right ?? layout.width - 37,
                    page === start.page ? start.y - 8 : layout.height - 27,
                ],
            });
        }
        return this.capture(regions, lines, force);
    }

    private async renderPage(pageNumber: number): Promise<Canvas> {
        if (this.cachedPage?.number === pageNumber) return this.cachedPage.canvas;
        const page = await this.pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
        const canvasContext = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
        await page.render({ canvas: null, canvasContext, viewport }).promise;
        this.cachedPage = { number: pageNumber, canvas };
        return canvas;
    }
}
