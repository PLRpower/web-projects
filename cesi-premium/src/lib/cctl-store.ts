import fs from 'fs/promises';
import path from 'path';
import { CCTLExam } from '@/types/cctl';
import { ALL_SEED_CCTLS } from '@/lib/cctl-seed-data';

export interface PublishedCCTLMeta {
    id: string;
    title: string;
    subject: string;
    promo: string;
    specialty?: string;
    track?: string;
    difficulty?: string;
    durationMinutes?: number;
    description?: string;
    year: string;
    domain: string;
    totalQuestions: number;
    authorName?: string;
    isAnonymous: boolean;
    publishedAt: string;
    viewsCount: number;
    downloadsCount: number;
    hasPdf: boolean;
    typesSummary: string[];
}

export interface PublishedCCTLEntry extends PublishedCCTLMeta {
    exam: CCTLExam;
    pdfFileName?: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'cctls.json');
const PDFS_DIR = path.join(DATA_DIR, 'pdfs');

async function ensureDataFile(): Promise<PublishedCCTLEntry[]> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(PDFS_DIR, { recursive: true });

        // Copy example PDF to storage if present
        try {
            const examplePdfPath = path.join(process.cwd(), 'exemple-cctl.pdf');
            const buffer = await fs.readFile(examplePdfPath);
            await fs.writeFile(path.join(PDFS_DIR, 'cctl-a3-dev-web-2025.pdf'), buffer);
        } catch {}

        let existing: PublishedCCTLEntry[] = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            existing = JSON.parse(data);
        } catch {
            existing = [];
        }

        // Merge seed CCTLs with existing (preserving user-uploaded CCTLs while ensuring rich seeds exist)
        const map = new Map<string, PublishedCCTLEntry>();
        for (const seed of ALL_SEED_CCTLS) {
            map.set(seed.id, seed);
        }
        for (const item of existing) {
            map.set(item.id, item);
        }

        const merged = Array.from(map.values());
        await fs.writeFile(DATA_FILE, JSON.stringify(merged, null, 2), 'utf-8');
        return merged;
    } catch (e) {
        console.error('Error ensuring cctl data file:', e);
        return ALL_SEED_CCTLS;
    }
}

export async function getAllPublishedCCTLs(): Promise<PublishedCCTLMeta[]> {
    const entries = await ensureDataFile();
    return entries.map(({ exam, ...meta }) => meta).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPublishedCCTLById(id: string): Promise<PublishedCCTLEntry | null> {
    const entries = await ensureDataFile();
    const entry = entries.find(e => e.id === id);
    if (entry) {
        entry.viewsCount = (entry.viewsCount || 0) + 1;
        fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8').catch(() => {});
        return entry;
    }
    return null;
}

export async function getCCTLPdfBuffer(id: string): Promise<{ buffer: Buffer; fileName: string } | null> {
    const entries = await ensureDataFile();
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    // Increment download count
    entry.downloadsCount = (entry.downloadsCount || 0) + 1;
    fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8').catch(() => {});

    const pdfPath = path.join(PDFS_DIR, `${id}.pdf`);
    try {
        const buffer = await fs.readFile(pdfPath);
        const cleanName = `${entry.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${entry.promo}_${entry.year}.pdf`;
        return { buffer, fileName: entry.pdfFileName || cleanName };
    } catch {
        // Fallback to example pdf if original not found
        try {
            const fallbackPath = path.join(process.cwd(), 'exemple-cctl.pdf');
            const buffer = await fs.readFile(fallbackPath);
            return { buffer, fileName: `${entry.subject.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` };
        } catch {
            return null;
        }
    }
}

export async function publishCCTL(
    exam: CCTLExam,
    customMeta?: {
        title?: string;
        subject?: string;
        promo?: string;
        year?: string;
        domain?: string;
        isAnonymous?: boolean;
        pdfBase64?: string;
    }
): Promise<PublishedCCTLEntry> {
    const entries = await ensureDataFile();

    const id = `cctl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const promo = customMeta?.promo || exam.promo || 'A3';
    const year = customMeta?.year || new Date().getFullYear().toString();
    const domain = customMeta?.domain || exam.domain || 'Informatique';
    const subject = customMeta?.subject || exam.subject || exam.title;
    const title = customMeta?.title || `${subject} (${promo} - ${year})`;
    const isAnonymous = customMeta?.isAnonymous ?? false;

    let hasPdf = false;
    let pdfFileName = `${subject.replace(/[^a-zA-Z0-9]/g, '_')}_${promo}_${year}.pdf`;

    // Save PDF if base64 buffer provided
    if (customMeta?.pdfBase64) {
        try {
            const pdfBuffer = Buffer.from(customMeta.pdfBase64, 'base64');
            const destPath = path.join(PDFS_DIR, `${id}.pdf`);
            await fs.writeFile(destPath, pdfBuffer);
            hasPdf = true;
        } catch (e) {
            console.error('Error saving published PDF:', e);
        }
    } else {
        // Try fallback to example pdf if it's the example
        try {
            const examplePath = path.join(process.cwd(), 'exemple-cctl.pdf');
            const buffer = await fs.readFile(examplePath);
            const destPath = path.join(PDFS_DIR, `${id}.pdf`);
            await fs.writeFile(destPath, buffer);
            hasPdf = true;
        } catch {}
    }

    const typeSet = new Set<string>();
    exam.questions.forEach(q => {
        if (q.type === 'single_choice') typeSet.add('QCM Unique');
        if (q.type === 'multiple_choice') typeSet.add('QCM Multiple');
        if (q.type === 'matching') typeSet.add('Association');
        if (q.type === 'fill_blank') typeSet.add('Texte à trous');
        if (q.codeSnippet) typeSet.add('Code Snippets');
    });

    const newEntry: PublishedCCTLEntry = {
        id,
        title,
        subject,
        promo,
        year,
        domain,
        totalQuestions: exam.questions.length,
        authorName: isAnonymous ? 'Anonyme' : (exam.studentName || 'Étudiant CESI'),
        isAnonymous,
        publishedAt: new Date().toISOString(),
        viewsCount: 1,
        downloadsCount: 0,
        hasPdf,
        pdfFileName,
        typesSummary: Array.from(typeSet),
        exam: {
            ...exam,
            id,
            title,
            subject,
            promo,
            domain
        }
    };

    entries.unshift(newEntry);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');

    return newEntry;
}
