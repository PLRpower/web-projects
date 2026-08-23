'use client';

export interface PdfQuotaStatus {
    allowed: boolean;
    usedToday: number;
    remainingToday: number;
    maxLimit: number;
    watermarkText: string;
}

const QUOTA_STORAGE_KEY = 'kompas_pdf_exports_quota';
const DAILY_LIMIT = 10; // Max 10 PDF exports per day per student

/**
 * Checks the daily PDF export quota for the current student.
 */
export function checkPdfExportQuota(userName = 'Élève-Ingénieur', userEmail = 'etudiant@viacesi.fr'): PdfQuotaStatus {
    const todayStr = new Date().toISOString().split('T')[0];
    let usedToday = 0;

    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(QUOTA_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.date === todayStr) {
                    usedToday = parsed.count || 0;
                }
            }
        } catch {}
    }

    const remainingToday = Math.max(0, DAILY_LIMIT - usedToday);
    const allowed = remainingToday > 0;
    const watermarkText = `Licence personnelle accordée à ${userName} (${userEmail}) • viacesi.fr • Reproduction, partage Discord et diffusion publique strictement interdits • ID: ${Date.now().toString(36)}`;

    return {
        allowed,
        usedToday,
        remainingToday,
        maxLimit: DAILY_LIMIT,
        watermarkText
    };
}

/**
 * Records a PDF download in local quota tracker.
 */
export function recordPdfExport(): boolean {
    if (typeof window === 'undefined') return false;
    const todayStr = new Date().toISOString().split('T')[0];

    try {
        let currentCount = 0;
        const saved = localStorage.getItem(QUOTA_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.date === todayStr) {
                currentCount = parsed.count || 0;
            }
        }

        const newCount = currentCount + 1;
        localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({ date: todayStr, count: newCount }));
        return true;
    } catch (e) {
        console.error('Error recording PDF export:', e);
        return false;
    }
}
