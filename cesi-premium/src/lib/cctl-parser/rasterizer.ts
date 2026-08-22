import { getDocumentProxy, renderPageAsImage } from 'unpdf';
import { VisualLine, QuestionBoundary, SectionData } from './types';

export interface RasterizedExamVisuals {
    questionSnapshots: Map<number, string>;
    promptSnapshots: Map<number, string>;
    choiceSnapshots: Map<string, string>; // key: `${qGlobalNumber}_${choiceId}`
}

/**
 * Trims surrounding white/transparent borders from a canvas to isolate pure formula/text content.
 */
function trimCanvas(canvas: any, pad: number = 4): any {
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;

    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    let nonWhiteCount = 0;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // If pixel is not white and not transparent (contains ink/drawing)
            if (a > 20 && (r < 240 || g < 240 || b < 240)) {
                nonWhiteCount++;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    // If practically empty or no strokes found
    if (nonWhiteCount < 10 || minX >= maxX || minY >= maxY) {
        return null;
    }

    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w, maxX + pad);
    maxY = Math.min(h, maxY + pad);

    const cropW = maxX - minX;
    const cropH = maxY - minY;

    return { minX, minY, cropW, cropH };
}

/**
 * Renders all pages of the PDF and crops:
 * 1. Full question snapshots
 * 2. Individual prompt statement formula crops
 * 3. Individual choice formula crops
 */
export async function generateQuestionSnapshots(
    pdfBuffer: Uint8Array,
    visualLines: VisualLine[],
    questionStarts: QuestionBoundary[],
    detectedSections: SectionData[]
): Promise<RasterizedExamVisuals> {
    const questionSnapshots = new Map<number, string>();
    const promptSnapshots = new Map<number, string>();
    const choiceSnapshots = new Map<string, string>();

    try {
        const { createCanvas, loadImage } = await import('@napi-rs/canvas');

        const initialClone = new Uint8Array(
            pdfBuffer.buffer.slice(
                pdfBuffer.byteOffset,
                pdfBuffer.byteOffset + pdfBuffer.byteLength
            )
        );
        const pdf = await getDocumentProxy(initialClone);
        const numPages = pdf.numPages;
        const scale = 2.0; // High DPI crisp rendering for razor-sharp math formulas

        const pageImages: any[] = [];
        const pageViewports: any[] = [];

        for (let p = 1; p <= numPages; p++) {
            const page = await pdf.getPage(p);
            const vp = page.getViewport({ scale: 1.0 });
            pageViewports.push(vp);

            const abClone = pdfBuffer.buffer.slice(
                pdfBuffer.byteOffset,
                pdfBuffer.byteOffset + pdfBuffer.byteLength
            );
            const clonedUint8 = new Uint8Array(abClone);

            const imgBuf = await renderPageAsImage(clonedUint8, p, {
                canvasImport: () => import('@napi-rs/canvas'),
                scale
            });
            const img = await loadImage(Buffer.from(imgBuf));
            pageImages.push(img);
        }

        for (let qIdx = 0; qIdx < questionStarts.length; qIdx++) {
            const start = questionStarts[qIdx];
            const nextStart = questionStarts[qIdx + 1];
            const startLineIdx = start.lineIndex;
            const nextSec = detectedSections.find(s => s.startLineIndex > startLineIdx);
            let endLineIdx = nextStart ? nextStart.lineIndex : visualLines.length;
            if (nextSec && nextSec.startLineIndex < endLineIdx) {
                endLineIdx = nextSec.startLineIndex;
            }

            const qLines = visualLines.slice(startLineIdx, endLineIdx);
            if (qLines.length === 0) continue;

            const qPage = qLines[0].page;
            if (qPage > numPages) continue;

            const vp = pageViewports[qPage - 1];
            const pageImg = pageImages[qPage - 1];
            const qLinesOnPage = qLines.filter(l => l.page === qPage);
            if (qLinesOnPage.length === 0) continue;

            // 1. Full Question Snapshot
            const maxY = Math.max(...qLinesOnPage.map(l => l.y)) + 18;
            const minY = Math.min(...qLinesOnPage.map(l => l.y)) - 25;
            const canvasTopY = Math.max(0, Math.round((vp.height - maxY) * scale));
            const canvasBottomY = Math.min(pageImg.height, Math.round((vp.height - minY) * scale));
            const cropHeight = Math.max(50, canvasBottomY - canvasTopY);
            const cropWidth = pageImg.width;

            const qCanvas = createCanvas(cropWidth, cropHeight);
            const qCtx = qCanvas.getContext('2d');
            qCtx.drawImage(pageImg, 0, canvasTopY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            const qPngBuf = qCanvas.toBuffer('image/png');
            questionSnapshots.set(start.globalNumber, `data:image/png;base64,${qPngBuf.toString('base64')}`);

            // 2. Targeted Prompt Statement Formula Crop (isolates the math formula)
            const statusLi = qLines.findIndex(l => /Réponses?\s+(?:correctes?|partiellement|incorrectes?)/i.test(l.fullText));
            const promptEndLi = statusLi !== -1 ? statusLi : qLines.length;
            const promptLines = qLines.slice(1, promptEndLi);

            if (promptLines.length > 0) {
                const pMaxY = Math.max(...promptLines.map(l => l.y)) + 16;
                const pMinY = Math.min(...promptLines.map(l => l.y)) - 16;
                const pTopY = Math.max(0, Math.round((vp.height - pMaxY) * scale));
                const pBottomY = Math.min(pageImg.height, Math.round((vp.height - pMinY) * scale));
                const pH = pBottomY - pTopY;

                // Identify if prompt has leading text to isolate formula
                const firstPromptLine = promptLines[0];
                const leadingItem = firstPromptLine.items.find(it => it.text.trim().length > 5);
                const formulaStartX = leadingItem ? Math.max(50, leadingItem.x + 180) : 50;

                const cropLeftX = Math.round((formulaStartX - 10) * scale);
                const cropRightX = Math.round(960 * scale);
                const cW = cropRightX - cropLeftX;

                if (pH > 10 && cW > 10) {
                    const pCanvas = createCanvas(cW, pH);
                    pCanvas.getContext('2d').drawImage(pageImg, cropLeftX, pTopY, cW, pH, 0, 0, cW, pH);
                    const trimBounds = trimCanvas(pCanvas, 4);
                    if (trimBounds) {
                        const trimmedCanvas = createCanvas(trimBounds.cropW, trimBounds.cropH);
                        trimmedCanvas.getContext('2d').drawImage(
                            pCanvas,
                            trimBounds.minX,
                            trimBounds.minY,
                            trimBounds.cropW,
                            trimBounds.cropH,
                            0,
                            0,
                            trimBounds.cropW,
                            trimBounds.cropH
                        );
                        const pBuf = trimmedCanvas.toBuffer('image/png');
                        promptSnapshots.set(start.globalNumber, `data:image/png;base64,${pBuf.toString('base64')}`);
                    }
                }
            }

            // 3. Individual Choice Formula Crops
            const choiceLines = qLines.filter(l => /^[A-Z]\s+[☑■☐]/.test(l.fullText.trim()));
            for (const cl of choiceLines) {
                const optId = cl.fullText.trim()[0];
                const rowTopY = Math.max(0, Math.round((vp.height - (cl.y + 16)) * scale));
                const rowBottomY = Math.min(pageImg.height, Math.round((vp.height - (cl.y - 16)) * scale));
                const rowLeftX = Math.round(650 * scale);
                const rowRightX = Math.round(960 * scale);
                const cW = rowRightX - rowLeftX;
                const cH = rowBottomY - rowTopY;

                if (cH > 10 && cW > 10) {
                    const rCanvas = createCanvas(cW, cH);
                    rCanvas.getContext('2d').drawImage(pageImg, rowLeftX, rowTopY, cW, cH, 0, 0, cW, cH);
                    const trimBounds = trimCanvas(rCanvas, 4);
                    if (trimBounds) {
                        const trimmedCanvas = createCanvas(trimBounds.cropW, trimBounds.cropH);
                        trimmedCanvas.getContext('2d').drawImage(
                            rCanvas,
                            trimBounds.minX,
                            trimBounds.minY,
                            trimBounds.cropW,
                            trimBounds.cropH,
                            0,
                            0,
                            trimBounds.cropW,
                            trimBounds.cropH
                        );
                        const cBuf = trimmedCanvas.toBuffer('image/png');
                        choiceSnapshots.set(`${start.globalNumber}_${optId}`, `data:image/png;base64,${cBuf.toString('base64')}`);
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error generating question snapshots:', err);
    }

    return { questionSnapshots, promptSnapshots, choiceSnapshots };
}
