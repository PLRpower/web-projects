import fs from 'fs/promises';
import path from 'path';
import { LivrableEntry, LivrableCategory, LivrablePromo, LivrableSpecialty } from '@/types/livrable';
import { ALL_SEED_LIVRABLES } from '@/lib/livrable-seed-data';
import {
    uploadToSupabaseStorage,
    downloadFromSupabaseStorage,
    deleteFromSupabaseStorage,
    STORAGE_BUCKETS
} from '@/lib/supabase-storage';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'livrables.json');
const LIVRABLE_PDFS_DIR = path.join(DATA_DIR, 'livrables-pdfs');

async function ensureLivrableFile(): Promise<LivrableEntry[]> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(LIVRABLE_PDFS_DIR, { recursive: true });

        let existing: LivrableEntry[] = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            existing = JSON.parse(data);
        } catch {
            existing = [];
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
        }

        return existing;
    } catch (e) {
        console.error('Error ensuring livrable data file:', e);
        return [];
    }
}

export async function getAllLivrables(): Promise<LivrableEntry[]> {
    const entries = await ensureLivrableFile();
    return entries.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getLivrableById(id: string): Promise<LivrableEntry | null> {
    const entries = await ensureLivrableFile();
    const entry = entries.find(e => e.id === id);
    if (entry) {
        entry.viewsCount = (entry.viewsCount || 0) + 1;
        fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8').catch(() => {});
        return entry;
    }
    return null;
}

export async function getLivrablePdfBuffer(id: string): Promise<{ buffer: Buffer; fileName: string } | null> {
    const entries = await ensureLivrableFile();
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    entry.downloadCount = (entry.downloadCount || 0) + 1;
    fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8').catch(() => {});

    const cleanName = `Livrable_${entry.category}_${entry.title.replace(/[^a-zA-Z0-9]/g, '_')}_${entry.promo}.pdf`;
    const targetFileName = entry.pdfFileName || cleanName;

    // 1. Try Supabase Storage bucket 'livrables'
    try {
        const supabaseBuffer = await downloadFromSupabaseStorage(STORAGE_BUCKETS.LIVRABLES, `${id}.pdf`);
        if (supabaseBuffer && supabaseBuffer.length > 0) {
            return { buffer: supabaseBuffer, fileName: targetFileName };
        }
    } catch (e) {
        console.warn(`[Livrable Store] Supabase download error for ${id}:`, e);
    }

    // 2. Fallback to local
    const pdfPath = path.join(LIVRABLE_PDFS_DIR, `${id}.pdf`);
    try {
        const buffer = await fs.readFile(pdfPath);
        return { buffer, fileName: targetFileName };
    } catch {
        return null;
    }
}

export async function publishLivrable(livrable: {
    title: string;
    category: LivrableCategory;
    categoryLabel?: string;
    promo: LivrablePromo;
    specialty: LivrableSpecialty;
    year?: string;
    summary: string;
    keySections: string[];
    tags: string[];
    gradeHint?: string;
    format?: string;
    authorId?: string;
    authorEmail?: string;
    authorName?: string;
    isAnonymous?: boolean;
    markdownTemplate?: string;
    pdfBase64?: string;
    pdfFileName?: string;
}): Promise<LivrableEntry> {
    const entries = await ensureLivrableFile();

    const categoryMap: Record<LivrableCategory, string> = {
        DAT: 'Dossier d\'Architecture Technique',
        CDC: 'Cahier des Charges',
        AUDIT: 'Rapport d\'Audit & Pentest',
        SOUTENANCE: 'Support de Soutenance',
        BDD: 'Dossier de Conception BDD',
        TESTS: 'Cahier de Recette & Tests',
        DEVOPS: 'Pipeline & Infrastructure CI/CD',
        MISSION: 'Rapport de Mission d\'Ingénieur'
    };

    const id = `livrable-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    let hasPdf = false;
    const cleanName = `Livrable_${livrable.category}_${livrable.title.replace(/[^a-zA-Z0-9]/g, '_')}_${livrable.promo || 'A3'}.pdf`;
    const pdfFileName = livrable.pdfFileName || cleanName;

    if (livrable.pdfBase64) {
        try {
            const pdfBuffer = Buffer.from(livrable.pdfBase64, 'base64');
            const uploadRes = await uploadToSupabaseStorage(
                STORAGE_BUCKETS.LIVRABLES,
                `${id}.pdf`,
                pdfBuffer,
                'application/pdf'
            );
            if (uploadRes.success) {
                hasPdf = true;
            }

            try {
                const destPath = path.join(LIVRABLE_PDFS_DIR, `${id}.pdf`);
                await fs.writeFile(destPath, pdfBuffer);
                hasPdf = true;
            } catch (e) {
                console.warn('Error saving local fallback livrable PDF:', e);
            }
        } catch (e) {
            console.error('Error saving published livrable PDF:', e);
        }
    }

    const newEntry: LivrableEntry = {
        id,
        title: livrable.title,
        category: livrable.category,
        categoryLabel: livrable.categoryLabel || categoryMap[livrable.category] || 'Document de Projet',
        promo: livrable.promo || 'A3',
        specialty: livrable.specialty || 'Informatique',
        year: livrable.year || new Date().getFullYear().toString(),
        summary: livrable.summary,
        keySections: livrable.keySections,
        tags: livrable.tags,
        gradeHint: livrable.gradeHint || 'Évaluation : Grade A • Validé jury CESI',
        format: livrable.format || 'Fiche & Modèle de révision',
        downloadCount: 0,
        viewsCount: 1,
        authorId: livrable.authorId,
        authorEmail: livrable.authorEmail,
        authorName: livrable.isAnonymous ? 'Élève Anonyme' : (livrable.authorName || 'Élève-Ingénieur CESI'),
        isAnonymous: livrable.isAnonymous ?? false,
        publishedAt: new Date().toISOString(),
        markdownTemplate: livrable.markdownTemplate,
        hasPdf,
        pdfFileName
    };

    entries.unshift(newEntry);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return newEntry;
}

export async function deleteLivrable(id: string): Promise<boolean> {
    const entries = await ensureLivrableFile();
    const initLen = entries.length;
    const filtered = entries.filter(e => e.id !== id);

    if (filtered.length !== initLen) {
        await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
        
        // Remove from Supabase Storage bucket 'livrables'
        deleteFromSupabaseStorage(STORAGE_BUCKETS.LIVRABLES, `${id}.pdf`).catch(() => {});

        try {
            const pdfPath = path.join(LIVRABLE_PDFS_DIR, `${id}.pdf`);
            await fs.unlink(pdfPath);
        } catch {}
        return true;
    }
    return false;
}

export async function updateLivrable(id: string, updates: Partial<LivrableEntry>): Promise<LivrableEntry | null> {
    const entries = await ensureLivrableFile();
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    Object.assign(entry, updates);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return entry;
}

