import fs from 'fs/promises';
import path from 'path';
import { LivrableEntry, LivrableCategory, LivrablePromo, LivrableSpecialty } from '@/types/livrable';
import { ALL_SEED_LIVRABLES } from '@/lib/livrable-seed-data';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'livrables.json');

async function ensureLivrableFile(): Promise<LivrableEntry[]> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

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
    authorName?: string;
    isAnonymous?: boolean;
    markdownTemplate?: string;
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
        authorName: livrable.isAnonymous ? 'Élève Anonyme' : (livrable.authorName || 'Élève-Ingénieur CESI'),
        isAnonymous: livrable.isAnonymous ?? false,
        publishedAt: new Date().toISOString(),
        markdownTemplate: livrable.markdownTemplate
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
