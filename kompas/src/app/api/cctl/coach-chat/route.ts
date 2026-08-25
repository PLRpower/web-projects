import { NextRequest, NextResponse } from 'next/server';
import { askCoachQuestion } from '@/lib/ai-cctl-generator';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { questionContext, userMessage, conversationHistory = [] } = body;

        if (!questionContext || !userMessage) {
            return NextResponse.json(
                { success: false, error: 'Paramètres de conversation incomplets.' },
                { status: 400 }
            );
        }

        const chatResponse = await askCoachQuestion(questionContext, userMessage, conversationHistory);

        return NextResponse.json({
            success: true,
            reply: chatResponse.reply,
            suggestedFollowUps: chatResponse.suggestedFollowUps || []
        });
    } catch (e: any) {
        console.error('Error in coach chat:', e);
        return NextResponse.json(
            { success: false, error: e?.message || 'Erreur lors de la réponse du Coach IA.' },
            { status: 500 }
        );
    }
}
