import { NextRequest, NextResponse } from 'next/server';
import { publishLivrable } from '@/lib/livrable-store';
import { validateLivrableSubmission } from '@/lib/contribution-validator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            category,
            categoryLabel,
            promo,
            specialty,
            year,
            summary,
            keySections,
            tags,
            gradeHint,
            format,
            authorName,
            isAnonymous,
            markdownTemplate
        } = body;

        // Content & quality verification
        const validation = validateLivrableSubmission({
            title,
            category,
            summary,
            keySections,
            tags
        });

        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, error: validation.errors.join(' • '), errors: validation.errors },
                { status: 400 }
            );
        }

        const published = await publishLivrable({
            title,
            category,
            categoryLabel,
            promo: promo || 'A3',
            specialty: specialty || 'Informatique',
            year: year || new Date().getFullYear().toString(),
            summary,
            keySections: Array.isArray(keySections) ? keySections : typeof keySections === 'string' ? keySections.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
            tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            gradeHint,
            format,
            authorName,
            isAnonymous,
            markdownTemplate
        });

        return NextResponse.json({
            success: true,
            published
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la publication du livrable.' },
            { status: 500 }
        );
    }
}
