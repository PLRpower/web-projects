import { NextRequest, NextResponse } from 'next/server';
import { publishProsit } from '@/lib/prosit-store';
import { validatePrositSubmission } from '@/lib/contribution-validator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            subject,
            promo,
            specialty,
            year,
            authorId,
            authorEmail,
            authorName,
            isAnonymous,
            keywords,
            context,
            problemStatement,
            constraints,
            hypotheses,
            actionPlan,
            deliverables,
            roles
        } = body;

        // Content & quality verification
        const validation = validatePrositSubmission({
            title,
            problemStatement,
            context,
            keywords,
            hypotheses,
            actionPlan,
            constraints,
            deliverables
        });

        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, error: validation.errors.join(' • '), errors: validation.errors },
                { status: 400 }
            );
        }

        const published = await publishProsit({
            title,
            subject: subject || title,
            promo: promo || 'A3',
            specialty: specialty || 'Informatique',
            year: year || new Date().getFullYear().toString(),
            authorId,
            authorEmail,
            authorName,
            isAnonymous,
            keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [],
            context: context || '',
            problemStatement: problemStatement || '',
            constraints: Array.isArray(constraints) ? constraints : typeof constraints === 'string' ? constraints.split('\n').map((c: string) => c.trim()).filter(Boolean) : [],
            hypotheses: Array.isArray(hypotheses) ? hypotheses : typeof hypotheses === 'string' ? hypotheses.split('\n').map((h: string) => h.trim()).filter(Boolean) : [],
            actionPlan: Array.isArray(actionPlan) ? actionPlan : typeof actionPlan === 'string' ? actionPlan.split('\n').map((a: string) => a.trim()).filter(Boolean) : [],
            deliverables: Array.isArray(deliverables) ? deliverables : typeof deliverables === 'string' ? deliverables.split('\n').map((d: string) => d.trim()).filter(Boolean) : [],
            roles,
            markdownContent: body.markdownContent,
            pdfBase64: body.pdfBase64,
            pdfFileName: body.pdfFileName
        });

        return NextResponse.json({
            success: true,
            published
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Erreur lors de la publication du prosit.' },
            { status: 500 }
        );
    }
}
