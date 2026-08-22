import { NextResponse } from 'next/server';
import { getAllProsits } from '@/lib/prosit-store';

export async function GET() {
    try {
        const prosits = await getAllProsits();
        return NextResponse.json({
            success: true,
            prosits,
            total: prosits.length
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors du chargement des prosits' },
            { status: 500 }
        );
    }
}
