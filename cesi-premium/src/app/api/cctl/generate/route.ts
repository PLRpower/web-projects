import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromUploadedFile, generateMockCCTLExam } from '@/lib/ai-cctl-generator';
import { publishCCTL } from '@/lib/cctl-store';

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let rawContent = '';
        let subject = '';
        let promo = 'A3';
        let specialty = 'Informatique';
        let domain = 'Informatique & Logiciel';
        let difficulty = 'Examen Officiel Blanc';
        let questionCount = 10;
        let questionTypes: string[] = ['single_choice', 'multiple_choice', 'matching', 'fill_blank', 'code_analysis'];
        let saveToLibrary = true;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            const subjectField = formData.get('subject') as string | null;
            const promoField = formData.get('promo') as string | null;
            const specialtyField = formData.get('specialty') as string | null;
            const difficultyField = formData.get('difficulty') as string | null;
            const questionCountField = formData.get('questionCount') as string | null;
            const textNotesField = formData.get('notes') as string | null;

            if (subjectField) subject = subjectField;
            if (promoField) promo = promoField;
            if (specialtyField) specialty = specialtyField;
            if (difficultyField) difficulty = difficultyField;
            if (questionCountField) questionCount = parseInt(questionCountField, 10) || 10;
            if (textNotesField) rawContent = textNotesField;

            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const extracted = await extractTextFromUploadedFile(buffer, file.name, file.type);
                rawContent = (rawContent ? rawContent + '\n\n' : '') + extracted;
                if (!subject) {
                    subject = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
                }
            }
        } else {
            const body = await req.json();
            rawContent = body.notes || body.rawContent || '';
            subject = body.subject || '';
            promo = body.promo || 'A3';
            specialty = body.specialty || 'Informatique';
            domain = body.domain || 'Informatique & Logiciel';
            difficulty = body.difficulty || 'Examen Officiel Blanc';
            questionCount = body.questionCount || 10;
            if (Array.isArray(body.questionTypes)) {
                questionTypes = body.questionTypes;
            }
            if (typeof body.saveToLibrary === 'boolean') {
                saveToLibrary = body.saveToLibrary;
            }
        }

        // Generate CCTL Exam
        const exam = await generateMockCCTLExam({
            rawContent,
            subject: subject || 'Architecture Logicielle & Systèmes Distribués',
            promo,
            specialty,
            domain,
            difficulty,
            questionCount,
            questionTypes
        });

        // Optionally publish / store in local database so it is directly playable at /dashboard/cctl/[id]
        let publishedMeta: any = null;
        if (saveToLibrary) {
            try {
                const published = await publishCCTL(exam, {
                    title: exam.title,
                    subject: exam.subject,
                    promo: exam.promo,
                    year: exam.year,
                    domain: exam.domain,
                    isAnonymous: false
                });
                publishedMeta = published;
                exam.id = published.id;
            } catch (e) {
                console.warn('Could not auto-publish generated exam:', e);
            }
        }

        return NextResponse.json({
            success: true,
            exam,
            published: publishedMeta
        });
    } catch (e: any) {
        console.error('Error generating mock CCTL:', e);
        return NextResponse.json(
            { success: false, error: e?.message || 'Erreur lors de la génération du CCTL blanc.' },
            { status: 500 }
        );
    }
}
