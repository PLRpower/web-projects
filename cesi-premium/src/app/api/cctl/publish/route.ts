import { NextRequest, NextResponse } from 'next/server';
import { publishCCTL } from '@/lib/cctl-store';
import { CCTLExam } from '@/types/cctl';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { exam, meta } = body as { exam: CCTLExam; meta?: any };

        if (!exam || !exam.questions || exam.questions.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Données de CCTL invalides ou questions manquantes.' },
                { status: 400 }
            );
        }

        const published = await publishCCTL(exam, meta);

        return NextResponse.json({
            success: true,
            published
        });
    } catch (err: any) {
        console.error('Error publishing CCTL:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Une erreur est survenue lors de la publication du CCTL.' },
            { status: 500 }
        );
    }
}
