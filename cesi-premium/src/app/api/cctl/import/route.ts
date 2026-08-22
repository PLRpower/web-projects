import { NextRequest, NextResponse } from 'next/server';
import { parseCCTLPdf } from '@/lib/cctl-parser';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Aucun fichier PDF fourni dans la requête.' },
                { status: 400 }
            );
        }

        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
            return NextResponse.json(
                { success: false, error: 'Format de fichier non supporté. Veuillez importer un fichier .pdf.' },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const nodeBuffer = Buffer.from(arrayBuffer);
        const pdfBase64 = nodeBuffer.toString('base64');

        // Pass a copy Uint8Array to parser so underlying buffer detachment won't affect anything
        const buffer = new Uint8Array(nodeBuffer.buffer.slice(nodeBuffer.byteOffset, nodeBuffer.byteOffset + nodeBuffer.byteLength));

        const exam = await parseCCTLPdf(buffer, file.name, file.size);

        if (!exam.questions || exam.questions.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Aucune question détectée dans ce PDF. Vérifiez qu\'il s\'agit bien d\'un export de CCTL valide.'
                },
                { status: 422 }
            );
        }

        return NextResponse.json({
            success: true,
            exam,
            pdfBase64
        });
    } catch (err: any) {
        console.error('Error importing CCTL PDF:', err);
        return NextResponse.json(
            {
                success: false,
                error: err?.message || 'Une erreur est survenue lors de l\'analyse du PDF.'
            },
            { status: 500 }
        );
    }
}
