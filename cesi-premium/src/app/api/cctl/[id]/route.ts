import { NextRequest, NextResponse } from 'next/server';
import { getPublishedCCTLById } from '@/lib/cctl-store';

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const entry = await getPublishedCCTLById(id);

        if (!entry) {
            return NextResponse.json(
                { success: false, error: 'CCTL non trouvé dans les archives.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            cctl: entry
        });
    } catch (err: any) {
        console.error('Error fetching CCTL by ID:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Erreur lors du chargement du CCTL.' },
            { status: 500 }
        );
    }
}
