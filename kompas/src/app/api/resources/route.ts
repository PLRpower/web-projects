import { NextRequest, NextResponse } from 'next/server';
import { getAllResources, publishResource } from '@/lib/resource-store';

export async function GET() {
    try {
        const resources = await getAllResources();
        return NextResponse.json({ success: true, resources });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, category, promo, specialty, author, campus, fileSize, fileType, content } = body;

        if (!title || !description || !content) {
            return NextResponse.json({ success: false, error: 'Champs obligatoires manquants.' }, { status: 400 });
        }

        const newResource = await publishResource({
            title,
            description,
            category: category || 'Fiche Mémo',
            promo: promo || 'A3',
            specialty: specialty || 'Informatique',
            author: author || 'Élève-Ingénieur CESI',
            campus: campus || 'CESI',
            fileSize: fileSize || '15 KB',
            fileType: fileType || 'MD',
            content
        });

        return NextResponse.json({ success: true, resource: newResource });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
