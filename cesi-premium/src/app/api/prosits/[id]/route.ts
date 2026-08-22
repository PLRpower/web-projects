import { NextRequest, NextResponse } from 'next/server';
import { getPrositById } from '@/lib/prosit-store';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const prosit = await getPrositById(id);

        if (!prosit) {
            return NextResponse.json(
                { success: false, error: 'Prosit non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            prosit
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la récupération du prosit' },
            { status: 500 }
        );
    }
}
