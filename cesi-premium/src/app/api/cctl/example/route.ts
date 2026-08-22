import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parseCCTLPdf } from '@/lib/cctl-parser';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'exemple-cctl.pdf');
        const fileBuffer = await fs.readFile(filePath);
        const buffer = new Uint8Array(fileBuffer);
        const stats = await fs.stat(filePath);

        const exam = await parseCCTLPdf(buffer, 'exemple-cctl.pdf', stats.size);

        return NextResponse.json({
            success: true,
            exam
        });
    } catch (err: any) {
        console.error('Error loading example CCTL:', err);
        return NextResponse.json(
            {
                success: false,
                error: err?.message || 'Impossible de charger l\'exemple de CCTL.'
            },
            { status: 500 }
        );
    }
}
