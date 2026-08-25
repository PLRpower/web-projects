import { NextRequest, NextResponse } from 'next/server';
import { generateCoachStepByStepExplanation } from '@/lib/ai-cctl-generator';
import { CCTLQuestion } from '@/types/cctl';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const question: CCTLQuestion = body.question;
        const studentAnswerText: string = body.studentAnswerText || '';
        const isCorrect: boolean = body.isCorrect ?? false;

        if (!question || !question.prompt) {
            return NextResponse.json(
                { success: false, error: 'Question invalide ou manquante.' },
                { status: 400 }
            );
        }

        const explanation = await generateCoachStepByStepExplanation(question, studentAnswerText, isCorrect);

        return NextResponse.json({
            success: true,
            explanation
        });
    } catch (e: any) {
        console.error('Error generating coach explanation:', e);
        return NextResponse.json(
            { success: false, error: e?.message || 'Erreur lors de la génération de l\'explication du Coach.' },
            { status: 500 }
        );
    }
}
