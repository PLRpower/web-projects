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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { deleteProsit } = await import('@/lib/prosit-store');
        const deleted = await deleteProsit(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'Prosit non trouvé ou déjà supprimé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Prosit supprimé avec succès' });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la suppression du prosit' },
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
        const { updateProsit } = await import('@/lib/prosit-store');
        const updated = await updateProsit(id, body);

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'Prosit non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, prosit: updated });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la mise à jour du prosit' },
            { status: 500 }
        );
    }
}
