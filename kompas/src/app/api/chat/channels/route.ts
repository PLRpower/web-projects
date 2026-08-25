import { NextRequest, NextResponse } from 'next/server';
import { getChatChannels, saveCustomChannel, deleteChatChannel } from '@/lib/chat-store';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const scope = (searchParams.get('scope') as 'national' | 'campus') || 'national';
        const promo = searchParams.get('promo') || 'A3';
        const campus = searchParams.get('campus') || undefined;

        const channels = await getChatChannels({ scope, promo, campus });
        return NextResponse.json({ success: true, channels });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const body = await request.json();
        const { label, description, scope, promo, campus } = body;

        if (!label || !label.trim()) {
            return NextResponse.json({ success: false, error: 'Le nom du salon est obligatoire.' }, { status: 400 });
        }

        let createdBy = 'Élève-Ingénieur';
        if (user) {
            const meta = user.user_metadata;
            if (meta?.name) createdBy = meta.name;
            else if (meta?.firstname && meta?.lastname) createdBy = `${meta.firstname} ${meta.lastname}`;
            else if (meta?.full_name) createdBy = meta.full_name;
        }

        const newChannel = await saveCustomChannel({
            label,
            description: description || '',
            scope: scope || 'national',
            promo: promo || 'A3',
            campus: campus || undefined,
            createdBy
        });

        return NextResponse.json({ success: true, channel: newChannel });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get('id');

        if (!channelId) {
            return NextResponse.json({ success: false, error: 'Identifiant de salon requis.' }, { status: 400 });
        }

        if (channelId === 'general') {
            return NextResponse.json({ success: false, error: 'Le salon général ne peut pas être supprimé.' }, { status: 400 });
        }

        const deleted = await deleteChatChannel(channelId);
        return NextResponse.json({ success: deleted });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
