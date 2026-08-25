import { NextRequest, NextResponse } from 'next/server';
import { getResourceById, updateResource, deleteResource } from '@/lib/resource-store';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const resource = await getResourceById(id);

        if (!resource) {
            return NextResponse.json({ success: false, error: 'Fiche non trouvée' }, { status: 404 });
        }

        return NextResponse.json({ success: true, resource });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deleted = await deleteResource(id);

        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Fiche non trouvée ou déjà supprimée' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Fiche supprimée avec succès' });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = await updateResource(id, body);

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Fiche non trouvée' }, { status: 404 });
        }

        return NextResponse.json({ success: true, resource: updated });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
