import { NextRequest, NextResponse } from 'next/server';
import { getLivrablePdfBuffer } from '@/lib/livrable-store';

export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const pdfData = await getLivrablePdfBuffer(id);

        if (!pdfData) {
            return NextResponse.json(
                { success: false, error: 'Fichier PDF introuvable pour ce Livrable.' },
                { status: 404 }
            );
        }

        const safeAsciiName = (pdfData.fileName || 'livrable.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
        const encodedName = encodeURIComponent(pdfData.fileName || 'livrable.pdf');

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedName}`);
        headers.set('Content-Length', pdfData.buffer.length.toString());
        headers.set('X-Kompas-License-Watermark', "Livrable CESI - viacesi.fr - Reproduction et diffusion publique strictement interdites");
        headers.set('Cache-Control', 'private, no-cache, no-transform');

        return new NextResponse(new Uint8Array(pdfData.buffer), {
            status: 200,
            headers
        });
    } catch (err: any) {
        console.error('Error downloading Livrable PDF:', err);
        return NextResponse.json(
            { success: false, error: err?.message || 'Erreur lors du téléchargement du PDF.' },
            { status: 500 }
        );
    }
}
