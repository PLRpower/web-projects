export type LivrableCategory = 'DAT' | 'CDC' | 'AUDIT' | 'SOUTENANCE' | 'BDD' | 'TESTS' | 'DEVOPS' | 'MISSION';
export type LivrablePromo = 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
export type LivrableSpecialty = 'Informatique' | 'BTP & Génie Civil' | 'Systèmes Embarqués' | 'Généraliste';

export interface LivrableEntry {
    id: string;
    title: string;
    category: LivrableCategory;
    categoryLabel: string;
    promo: LivrablePromo;
    specialty: LivrableSpecialty;
    year: string;
    summary: string;
    keySections: string[];
    tags: string[];
    gradeHint: string;
    format: string;
    downloadCount: number;
    viewsCount: number;
    authorName: string;
    isAnonymous: boolean;
    publishedAt: string;
    markdownTemplate?: string;
}
