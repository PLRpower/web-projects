import fs from 'fs/promises';
import path from 'path';
import { CCTLExam } from '@/types/cctl';
import { ALL_SEED_CCTLS } from '@/lib/cctl-seed-data';
import { generateCCTLBadges } from '@/lib/ai-cctl-badges';
import { anonymizeCCTLPdf } from '@/lib/cctl-anonymizer';
import {
    uploadToSupabaseStorage,
    downloadFromSupabaseStorage,
    deleteFromSupabaseStorage,
    STORAGE_BUCKETS
} from '@/lib/supabase-storage';

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
    authorId?: string;
    authorEmail?: string;
    authorName?: string;
    isAnonymous: boolean;
    publishedAt: string;
    viewsCount: number;
    downloadsCount: number;
    hasPdf: boolean;
    typesSummary: string[];
    aiBadges?: string[];
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

        let existing: PublishedCCTLEntry[] = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            existing = JSON.parse(data);
        } catch {
            existing = [];
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
        }

        return existing;
    } catch (e) {
        console.error('Error ensuring cctl data file:', e);
        return [];
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

    const cleanName = `${entry.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${entry.promo}_${entry.year}.pdf`;
    const targetFileName = entry.pdfFileName || cleanName;

    // 1. Try fetching from Supabase Storage bucket 'cctl'
    try {
        const supabaseBuffer = await downloadFromSupabaseStorage(STORAGE_BUCKETS.CCTL, `${id}.pdf`);
        if (supabaseBuffer && supabaseBuffer.length > 0) {
            return { buffer: supabaseBuffer, fileName: targetFileName };
        }
    } catch (e) {
        console.warn(`[CCTL Store] Supabase download error for ${id}:`, e);
    }

    // 2. Fallback to local filesystem .data/pdfs
    const pdfPath = path.join(PDFS_DIR, `${id}.pdf`);
    try {
        const buffer = await fs.readFile(pdfPath);
        return { buffer, fileName: targetFileName };
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
        authorId?: string;
        authorEmail?: string;
        authorName?: string;
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
    const authorId = customMeta?.authorId || exam.authorId;
    const authorEmail = customMeta?.authorEmail || exam.authorEmail;

    let hasPdf = false;
    const pdfFileName = `${subject.replace(/[^a-zA-Z0-9]/g, '_')}_${promo}_${year}.pdf`;

    // Save PDF to Supabase Storage and local fallback
    if (customMeta?.pdfBase64) {
        try {
            let pdfBuffer = Buffer.from(customMeta.pdfBase64, 'base64');
            
            // Ensure student identity inside PDF is anonymized when publishing anonymously
            if (isAnonymous) {
                try {
                    const anonResult = await anonymizeCCTLPdf(
                        pdfBuffer,
                        exam.originalFileName || exam.metadata?.fileName || pdfFileName
                    );
                    if (anonResult.success && anonResult.anonymizedBuffer) {
                        pdfBuffer = Buffer.from(anonResult.anonymizedBuffer);
                    }
                } catch (anonErr) {
                    console.warn('PDF anonymization during publish:', anonErr);
                }
            }

            // Upload to Supabase bucket 'cctl'
            const uploadRes = await uploadToSupabaseStorage(
                STORAGE_BUCKETS.CCTL,
                `${id}.pdf`,
                pdfBuffer,
                'application/pdf'
            );
            if (uploadRes.success) {
                hasPdf = true;
            }

            // Local fallback copy
            try {
                const destPath = path.join(PDFS_DIR, `${id}.pdf`);
                await fs.writeFile(destPath, pdfBuffer);
                hasPdf = true;
            } catch (e) {
                console.warn('Error saving local fallback PDF:', e);
            }
        } catch (e) {
            console.error('Error saving published PDF:', e);
        }
    } else {
        // Fallback to example pdf if it's the default example
        try {
            const examplePath = path.join(process.cwd(), 'exemple-cctl.pdf');
            const buffer = await fs.readFile(examplePath);
            await uploadToSupabaseStorage(
                STORAGE_BUCKETS.CCTL,
                `${id}.pdf`,
                buffer,
                'application/pdf'
            );
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

    const aiBadges = Array.isArray(exam.aiBadges)
        ? exam.aiBadges
        : (await generateCCTLBadges(exam)).badges;

    const newEntry: PublishedCCTLEntry = {
        id,
        title,
        subject,
        promo,
        year,
        domain,
        totalQuestions: exam.questions.length,
        authorId,
        authorEmail,
        authorName: isAnonymous ? 'Utilisateur Anonyme' : (customMeta?.authorName || exam.studentName || 'Étudiant CESI'),
        isAnonymous,
        publishedAt: new Date().toISOString(),
        viewsCount: 1,
        downloadsCount: 0,
        hasPdf,
        pdfFileName,
        typesSummary: Array.from(typeSet),
        aiBadges,
        exam: {
            ...exam,
            id,
            title,
            subject,
            promo,
            domain,
            authorId,
            authorEmail,
            aiBadges
        }
    };

    entries.unshift(newEntry);
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');

    return newEntry;
}

export async function deleteCCTL(id: string): Promise<boolean> {
    const entries = await ensureDataFile();
    const initLen = entries.length;
    const filtered = entries.filter(e => e.id !== id);

    if (filtered.length !== initLen) {
        await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
        
        // Remove from Supabase Storage bucket 'cctl'
        deleteFromSupabaseStorage(STORAGE_BUCKETS.CCTL, `${id}.pdf`).catch(() => {});

        // Also remove local PDF if exists
        try {
            const pdfPath = path.join(PDFS_DIR, `${id}.pdf`);
            await fs.unlink(pdfPath);
        } catch {
            // Ignore if local pdf doesn't exist
        }
        return true;
    }
    return false;
}

export async function updateCCTL(
    id: string,
    updates: Partial<PublishedCCTLMeta> & { exam?: Partial<CCTLExam> }
): Promise<PublishedCCTLEntry | null> {
    const entries = await ensureDataFile();
    const entry = entries.find(e => e.id === id);
    if (!entry) return null;

    if (updates.title !== undefined) entry.title = updates.title;
    if (updates.subject !== undefined) entry.subject = updates.subject;
    if (updates.promo !== undefined) entry.promo = updates.promo;
    if (updates.year !== undefined) entry.year = updates.year;
    if (updates.domain !== undefined) entry.domain = updates.domain;
    if (updates.specialty !== undefined) entry.specialty = updates.specialty;
    if (updates.track !== undefined) entry.track = updates.track;
    if (updates.difficulty !== undefined) entry.difficulty = updates.difficulty;
    if (updates.durationMinutes !== undefined) entry.durationMinutes = updates.durationMinutes;
    if (updates.description !== undefined) entry.description = updates.description;
    if (updates.authorName !== undefined) entry.authorName = updates.authorName;
    if (updates.aiBadges !== undefined) entry.aiBadges = updates.aiBadges;

    if (entry.exam) {
        entry.exam = {
            ...entry.exam,
            ...updates.exam,
            title: entry.title,
            subject: entry.subject,
            promo: entry.promo,
            domain: entry.domain,
            aiBadges: entry.aiBadges,
        };
        if (updates.exam?.questions) {
            entry.totalQuestions = updates.exam.questions.length;
        }
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    return entry;
}
