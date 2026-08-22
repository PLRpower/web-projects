import { NextRequest, NextResponse } from 'next/server';
import { getLivrableById } from '@/lib/livrable-store';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const livrable = await getLivrableById(id);

        if (!livrable) {
            return NextResponse.json(
                { success: false, error: 'Livrable non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            livrable
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la récupération du livrable' },
            { status: 500 }
        );
    }
}
