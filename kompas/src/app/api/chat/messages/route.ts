import { NextRequest, NextResponse } from 'next/server';
import { getChatMessages, saveChatMessage } from '@/lib/chat-store';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const scope = (searchParams.get('scope') as 'national' | 'campus' | 'direct') || undefined;
        const promo = searchParams.get('promo') || undefined;
        const campus = searchParams.get('campus') || undefined;
        const channel = searchParams.get('channel') || undefined;
        const recipientName = searchParams.get('recipientName') || undefined;
        const currentUserName = searchParams.get('currentUserName') || undefined;

        const messages = await getChatMessages({
            scope,
            campus,
            promo,
            channel,
            recipientName,
            currentUserName
        });
        return NextResponse.json({ success: true, messages });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json();
        const {
            scope,
            promo,
            campus: bodyCampus,
            channel,
            content,
            author: reqAuthor,
            specialty: reqSpecialty,
            campus: reqCampus,
            recipientName,
            recipientId
        } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ success: false, error: 'Le contenu du message est vide.' }, { status: 400 });
        }

        // Determine user identity
        let author = reqAuthor;
        let authorId = user?.id || '';
        let specialty = reqSpecialty || 'Informatique';
        let campus = bodyCampus || reqCampus || 'CESI';

        if (user) {
            const meta = user.user_metadata;
            if (meta?.name) author = meta.name;
            else if (meta?.firstname && meta?.lastname) author = `${meta.firstname} ${meta.lastname}`.trim();
            else if (meta?.full_name) author = meta.full_name;
            else if (user.email && !author) {
                const parts = user.email.split('@')[0].split('.');
                if (parts.length >= 2) {
                    author = `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} ${parts[1].toUpperCase()}`;
                } else {
                    author = user.email.split('@')[0];
                }
            }

            if (meta?.specialty) specialty = meta.specialty;
            if (meta?.campus && !bodyCampus) campus = meta.campus;
        }

        if (!author || author === 'Élève-Ingénieur') {
            author = reqAuthor || 'Élève-Ingénieur CESI';
        }

        const authorInitial = author.charAt(0).toUpperCase();

        const message = await saveChatMessage({
            scope: scope || 'national',
            promo: promo || 'A3',
            channel: channel || 'general',
            campus: campus || 'CESI',
            author,
            authorInitial,
            authorId,
            recipientName,
            recipientId,
            specialty,
            content: content.trim()
        });

        return NextResponse.json({ success: true, message });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const messageId = searchParams.get('id');

        if (!messageId) {
            return NextResponse.json({ success: false, error: 'Identifiant de message manquant.' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // In demo/offline mode, delete directly. If user is present, admin can delete any message.
        const { deleteChatMessage } = await import('@/lib/chat-store');
        const deleted = await deleteChatMessage(messageId);

        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Message non trouvé.' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, content } = body;

        if (!id || !content || !content.trim()) {
            return NextResponse.json({ success: false, error: 'Identifiant ou contenu manquant.' }, { status: 400 });
        }

        const { updateChatMessage } = await import('@/lib/chat-store');
        const updated = await updateChatMessage(id, content.trim());

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Message non trouvé.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: updated });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
