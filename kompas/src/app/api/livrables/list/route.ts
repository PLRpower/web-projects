import { NextResponse } from 'next/server';
import { getAllLivrables } from '@/lib/livrable-store';

export async function GET() {
    try {
        const livrables = await getAllLivrables();
        return NextResponse.json({
            success: true,
            livrables,
            total: livrables.length
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors du chargement des livrables' },
            { status: 500 }
        );
    }
}
