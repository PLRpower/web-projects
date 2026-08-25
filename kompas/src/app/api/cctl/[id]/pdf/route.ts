import { NextRequest, NextResponse } from 'next/server';
import { getCCTLPdfBuffer } from '@/lib/cctl-store';

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const pdfData = await getCCTLPdfBuffer(id);

        if (!pdfData) {
            return NextResponse.json(
                { success: false, error: 'Fichier PDF introuvable pour ce CCTL.' },
                { status: 404 }
            );
        }

        const safeAsciiName = (pdfData.fileName || 'cctl.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
        const encodedName = encodeURIComponent(pdfData.fileName || 'cctl.pdf');

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedName}`);
        headers.set('Content-Length', pdfData.buffer.length.toString());
        headers.set('X-Kompas-License-Watermark', "Licence individuelle personnelle accordee a l'eleve-ingenieur - viacesi.fr - Reproduction et diffusion publique strictement interdites");
        headers.set('X-Kompas-Daily-Quota-Limit', '10');
        headers.set('Cache-Control', 'private, no-cache, no-transform');

        return new NextResponse(new Uint8Array(pdfData.buffer), {
            status: 200,
            headers
        });
    } catch (err: any) {
        console.error('Error downloading CCTL PDF:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Erreur lors du téléchargement du PDF.' },
            { status: 500 }
        );
    }
}
