import { NextResponse } from 'next/server';
import { getAllPublishedCCTLs } from '@/lib/cctl-store';
import { getAllProsits } from '@/lib/prosit-store';
import { getAllLivrables } from '@/lib/livrable-store';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [cctls, prosits, livrables] = await Promise.all([
            getAllPublishedCCTLs(),
            getAllProsits(),
            getAllLivrables()
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                cctlCount: cctls.length,
                prositCount: prosits.length,
                livrableCount: livrables.length,
                campusCount: 25
            }
        });
    } catch (error) {
        console.error('Error fetching dynamic platform stats:', error);
        return NextResponse.json({
            success: false,
            stats: {
                cctlCount: 0,
                prositCount: 0,
                livrableCount: 0,
                campusCount: 25
            }
        }, { status: 500 });
    }
}
