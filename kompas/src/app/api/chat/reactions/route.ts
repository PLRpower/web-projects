import { NextRequest, NextResponse } from 'next/server';
import { toggleChatReaction } from '@/lib/chat-store';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json();
        const { messageId, emoji, userId: clientUserId } = body;

        if (!messageId || !emoji) {
            return NextResponse.json({ success: false, error: 'messageId et emoji requis' }, { status: 400 });
        }

        const effectiveUserId = user?.id || clientUserId || 'anonymous-user';

        const updatedMessage = await toggleChatReaction(messageId, emoji, effectiveUserId);

        if (!updatedMessage) {
            return NextResponse.json({ success: false, error: 'Message introuvable' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: updatedMessage });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
