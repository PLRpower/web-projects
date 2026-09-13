export type PrositSpecialty = 'Informatique' | 'BTP & Génie Civil' | 'Systèmes Embarqués' | 'Généraliste';
export type PrositPromo = 'A1' | 'A2' | 'A3' | 'A4' | 'A5';

export interface PrositRoles {
    animateur?: string;
    scribe?: string;
    secretaire?: string;
    gestionnaire?: string;
}

export interface PrositEntry {
    id: string;
    title: string;
    subject: string;
    promo: PrositPromo;
    specialty: PrositSpecialty;
    year: string;
    authorId?: string;
    authorEmail?: string;
    authorName: string;
    isAnonymous: boolean;
    publishedAt: string;
    viewsCount: number;
    downloadsCount: number;
    keywords: string[];
    context: string;
    problemStatement: string;
    constraints: string[];
    hypotheses: string[];
    actionPlan: string[];
    deliverables: string[];
    roles?: PrositRoles;
    markdownContent?: string;
    hasPdf?: boolean;
    pdfFileName?: string;
    pdfUrl?: string;
}
