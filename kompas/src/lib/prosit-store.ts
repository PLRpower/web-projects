import fs from 'fs/promises';
import path from 'path';
import { PrositEntry, PrositPromo, PrositSpecialty } from '@/types/prosit';
import { ALL_SEED_PROSITS } from '@/lib/prosit-seed-data';
import {
    uploadToSupabaseStorage,
    downloadFromSupabaseStorage,
    deleteFromSupabaseStorage,
    STORAGE_BUCKETS
} from '@/lib/supabase-storage';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'prosits.json');
const PROSIT_PDFS_DIR = path.join(DATA_DIR, 'prosits-pdfs');

async function ensurePrositFile(): Promise<PrositEntry[]> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(PROSIT_PDFS_DIR, { recursive: true });

        let existing: PrositEntry[] = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            existing = JSON.parse(data);
        } catch {
            existing = [];
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
        }

        return existing;
    } catch (e) {
        console.error('Error ensuring prosit data file:', e);
        return [];
    }
}

export async function getAllProsits(): Promise<PrositEntry[]> {
    const entries = await ensurePrositFile();
    return entries.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPrositById(id: string): Promise<PrositEntry | null> {
    const entries = await ensurePrositFile();
    const entry = entries.find(e => e.id === id);
    if (entry) {
        entry.viewsCount = (entry.viewsCount || 0) + 1;
        fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8').catch(() => {});
        return entry;
    }
    return null;
}

export async function getPrositPdfBuffer(id: string): Promise<{ buffer: Buffer; fileName: string } | null> {
    const entries = await ensurePrositFile();
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    entry.downloadsCount = (entry.downloadsCount || 0) + 1;
    fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8').catch(() => {});

    const cleanName = `Prosit_${entry.title.replace(/[^a-zA-Z0-9]/g, '_')}_${entry.promo}.pdf`;
    const targetFileName = entry.pdfFileName || cleanName;

    // 1. Try Supabase Storage bucket 'prosits'
    try {
        const supabaseBuffer = await downloadFromSupabaseStorage(STORAGE_BUCKETS.PROSITS, `${id}.pdf`);
        if (supabaseBuffer && supabaseBuffer.length > 0) {
            return { buffer: supabaseBuffer, fileName: targetFileName };
        }
    } catch (e) {
        console.warn(`[Prosit Store] Supabase download error for ${id}:`, e);
    }

    // 2. Fallback to local
    const pdfPath = path.join(PROSIT_PDFS_DIR, `${id}.pdf`);
    try {
        const buffer = await fs.readFile(pdfPath);
        return { buffer, fileName: targetFileName };
    } catch {
        return null;
    }
}

export async function publishProsit(prosit: {
    title: string;
    subject: string;
    promo: PrositPromo;
    specialty: PrositSpecialty;
    year?: string;
    authorId?: string;
    authorEmail?: string;
    authorName?: string;
    isAnonymous?: boolean;
    keywords: string[];
    context: string;
    problemStatement: string;
    constraints: string[];
    hypotheses: string[];
    actionPlan: string[];
    deliverables: string[];
    roles?: {
        animateur?: string;
        scribe?: string;
        secretaire?: string;
        gestionnaire?: string;
    };
    markdownContent?: string;
    pdfBase64?: string;
    pdfFileName?: string;
}): Promise<PrositEntry> {
    const entries = await ensurePrositFile();

    const id = `prosit-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    let hasPdf = false;
    const cleanName = `Prosit_${prosit.title.replace(/[^a-zA-Z0-9]/g, '_')}_${prosit.promo || 'A3'}.pdf`;
    const pdfFileName = prosit.pdfFileName || cleanName;

    if (prosit.pdfBase64) {
        try {
            const pdfBuffer = Buffer.from(prosit.pdfBase64, 'base64');
            const uploadRes = await uploadToSupabaseStorage(
                STORAGE_BUCKETS.PROSITS,
                `${id}.pdf`,
                pdfBuffer,
                'application/pdf'
            );
            if (uploadRes.success) {
                hasPdf = true;
            }

            try {
                const destPath = path.join(PROSIT_PDFS_DIR, `${id}.pdf`);
                await fs.writeFile(destPath, pdfBuffer);
                hasPdf = true;
            } catch (e) {
                console.warn('Error saving local fallback prosit PDF:', e);
            }
        } catch (e) {
            console.error('Error saving published prosit PDF:', e);
        }
    }

    const newEntry: PrositEntry = {
        id,
        title: prosit.title,
        subject: prosit.subject || prosit.title,
        promo: prosit.promo || 'A3',
        specialty: prosit.specialty || 'Informatique',
        year: prosit.year || new Date().getFullYear().toString(),
        authorId: prosit.authorId,
        authorEmail: prosit.authorEmail,
        authorName: prosit.isAnonymous ? 'Élève Anonyme' : (prosit.authorName || 'Élève-Ingénieur CESI'),
        isAnonymous: prosit.isAnonymous ?? false,
        publishedAt: new Date().toISOString(),
        viewsCount: 1,
        downloadsCount: 0,
        keywords: prosit.keywords || [],
        context: prosit.context || '',
        problemStatement: prosit.problemStatement || '',
        constraints: prosit.constraints || [],
        hypotheses: prosit.hypotheses || [],
        actionPlan: prosit.actionPlan || [],
        deliverables: prosit.deliverables || [],
        roles: prosit.roles,
        markdownContent: prosit.markdownContent,
        hasPdf,
        pdfFileName
    };

    entries.unshift(newEntry);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return newEntry;
}

export async function deleteProsit(id: string): Promise<boolean> {
    const entries = await ensurePrositFile();
    const initLen = entries.length;
    const filtered = entries.filter(e => e.id !== id);

    if (filtered.length !== initLen) {
        await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
        
        // Remove from Supabase Storage bucket 'prosits'
        deleteFromSupabaseStorage(STORAGE_BUCKETS.PROSITS, `${id}.pdf`).catch(() => {});

        try {
            const pdfPath = path.join(PROSIT_PDFS_DIR, `${id}.pdf`);
            await fs.unlink(pdfPath);
        } catch {}
        return true;
    }
    return false;
}

export async function updateProsit(id: string, updates: Partial<PrositEntry>): Promise<PrositEntry | null> {
    const entries = await ensurePrositFile();
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    Object.assign(entry, updates);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return entry;
}

