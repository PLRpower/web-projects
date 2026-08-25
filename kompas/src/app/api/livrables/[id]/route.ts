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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { deleteLivrable } = await import('@/lib/livrable-store');
        const deleted = await deleteLivrable(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Livrable non trouvé ou déjà supprimé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Livrable supprimé avec succès' });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la suppression du livrable' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { updateLivrable } = await import('@/lib/livrable-store');
        const updated = await updateLivrable(id, body);

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Livrable non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, livrable: updated });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la mise à jour du livrable' },
            { status: 500 }
        );
    }
}
