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

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { deleteCCTL } = await import('@/lib/cctl-store');
        const deleted = await deleteCCTL(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: 'CCTL introuvable ou déjà supprimé.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'CCTL supprimé avec succès.' });
    } catch (err: any) {
        console.error('Error deleting CCTL:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Erreur lors de la suppression du CCTL.' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const updates = await request.json();
        const { updateCCTL } = await import('@/lib/cctl-store');
        const updated = await updateCCTL(id, updates);

        if (!updated) {
            return NextResponse.json(
                { success: false, error: 'CCTL introuvable.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, cctl: updated });
    } catch (err: any) {
        console.error('Error updating CCTL:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Erreur lors de la mise à jour du CCTL.' },
            { status: 500 }
        );
    }
}
