import { NextResponse } from 'next/server';
import { getAllPublishedCCTLs } from '@/lib/cctl-store';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const cctls = await getAllPublishedCCTLs();
        return NextResponse.json({
            success: true,
            cctls
        });
    } catch (err: any) {
        console.error('Error fetching published CCTLs:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Erreur lors de la récupération des archives CCTL.' },
            { status: 500 }
        );
    }
}
