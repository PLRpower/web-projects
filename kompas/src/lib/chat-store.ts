import fs from 'fs/promises';
import path from 'path';
import { ChatMessage, ChatChannel, DEFAULT_CHANNELS } from '@/types/chat';

export type { ChatMessage, ChatChannel };
export { DEFAULT_CHANNELS };

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_MESSAGES_FILE = path.join(DATA_DIR, 'chat-messages.json');
const DATA_CHANNELS_FILE = path.join(DATA_DIR, 'chat-channels.json');

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

async function ensureDataFiles() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Messages
    try {
        await fs.access(DATA_MESSAGES_FILE);
    } catch {
        await fs.writeFile(DATA_MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    // Custom Channels
    try {
        await fs.access(DATA_CHANNELS_FILE);
    } catch {
        await fs.writeFile(DATA_CHANNELS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
}

export async function getChatChannels(filters?: {
    scope?: 'national' | 'campus';
    promo?: string;
    campus?: string;
}): Promise<ChatChannel[]> {
    await ensureDataFiles();
    const { scope = 'national', promo = 'A3', campus } = filters || {};

    let customChannels: ChatChannel[] = [];
    try {
        const raw = await fs.readFile(DATA_CHANNELS_FILE, 'utf-8');
        customChannels = JSON.parse(raw);
    } catch {
        customChannels = [];
    }

    // Filter custom channels matching this scope & promo & campus
    const matchedCustom = customChannels.filter(c => {
        if (c.scope !== scope) return false;
        if (c.promo && c.promo !== 'Tous' && c.promo !== promo) return false;
        if (scope === 'campus' && campus && c.campus && c.campus !== campus) return false;
        return true;
    });

    return [...DEFAULT_CHANNELS, ...matchedCustom];
}

export async function saveCustomChannel(input: {
    label: string;
    description: string;
    category?: string;
    scope: 'national' | 'campus';
    promo: string;
    campus?: string;
    createdBy?: string;
}): Promise<ChatChannel> {
    await ensureDataFiles();

    let customChannels: ChatChannel[] = [];
    try {
        const raw = await fs.readFile(DATA_CHANNELS_FILE, 'utf-8');
        customChannels = JSON.parse(raw);
    } catch {
        customChannels = [];
    }

    const cleanLabel = input.label
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const newChannel: ChatChannel = {
        id: `custom-${cleanLabel}-${Date.now().toString(36)}`,
        label: cleanLabel || 'nouveau-salon',
        description: input.description.trim() || 'Salon créé par un étudiant',
        category: input.category || 'Général',
        scope: input.scope,
        promo: input.promo,
        campus: input.campus,
        createdBy: input.createdBy || 'Étudiant',
        isCustom: true
    };

    customChannels.push(newChannel);
    await fs.writeFile(DATA_CHANNELS_FILE, JSON.stringify(customChannels, null, 2), 'utf-8');
    return newChannel;
}

export async function deleteChatChannel(channelId: string): Promise<boolean> {
    await ensureDataFiles();

    let customChannels: ChatChannel[] = [];
    try {
        const raw = await fs.readFile(DATA_CHANNELS_FILE, 'utf-8');
        customChannels = JSON.parse(raw);
    } catch {
        return false;
    }

    const initialLength = customChannels.length;
    customChannels = customChannels.filter(c => c.id !== channelId);

    if (customChannels.length !== initialLength) {
        await fs.writeFile(DATA_CHANNELS_FILE, JSON.stringify(customChannels, null, 2), 'utf-8');
        return true;
    }

    return false;
}

export async function getChatMessages(filters?: {
    scope?: 'national' | 'campus' | 'direct';
    campus?: string;
    promo?: string;
    channel?: string;
    recipientName?: string;
    currentUserName?: string;
    currentUserId?: string;
}): Promise<ChatMessage[]> {
    await ensureDataFiles();
    let messages: ChatMessage[] = [];
    try {
        const raw = await fs.readFile(DATA_MESSAGES_FILE, 'utf-8');
        messages = JSON.parse(raw);
    } catch {
        messages = INITIAL_CHAT_MESSAGES;
    }

    const { scope, campus, promo, channel, recipientName } = filters || {};

    return messages.filter(m => {
        if (scope === 'direct') {
            if (m.scope !== 'direct') return false;
            if (!recipientName) return true;

            const matchesDirect =
                (m.recipientName?.toLowerCase() === recipientName.toLowerCase() ||
                 m.author.toLowerCase() === recipientName.toLowerCase());

            return matchesDirect;
        }

        if (m.scope === 'direct') return false;

        // In both national and campus, discussions are filtered by Promo
        if (promo && promo !== 'Tous' && m.promo && m.promo !== promo && m.promo !== 'Tous') {
            return false;
        }

        if (scope && scope !== 'national') {
            if (m.scope && m.scope !== scope) return false;
        } else if (scope === 'national') {
            if (m.scope && m.scope !== 'national') return false;
        }

        if (scope === 'campus' && campus && campus !== 'Tous') {
            if (m.campus !== campus) return false;
        }

        if (channel && channel !== 'all') {
            if (m.channel !== channel) return false;
        }

        return true;
    });
}

export async function saveChatMessage(input: {
    scope?: 'national' | 'campus' | 'direct';
    promo?: string;
    channel?: string;
    campus?: string;
    author: string;
    authorInitial?: string;
    authorId?: string;
    recipientId?: string;
    recipientName?: string;
    specialty?: string;
    content: string;
}): Promise<ChatMessage> {
    await ensureDataFiles();
    let messages: ChatMessage[] = [];
    try {
        const raw = await fs.readFile(DATA_MESSAGES_FILE, 'utf-8');
        messages = JSON.parse(raw);
    } catch {
        messages = [];
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        scope: input.scope || 'national',
        promo: input.promo || 'A3',
        channel: input.channel || 'general',
        campus: input.campus || 'CESI',
        author: input.author || 'Élève-Ingénieur',
        authorInitial: input.authorInitial || input.author.charAt(0).toUpperCase() || 'E',
        authorId: input.authorId || '',
        recipientId: input.recipientId || '',
        recipientName: input.recipientName || '',
        specialty: input.specialty || 'Informatique',
        content: input.content.trim(),
        timestamp: timeStr,
        createdAt: now.toISOString(),
        reactions: []
    };

    messages.push(newMsg);
    await fs.writeFile(DATA_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return newMsg;
}

export async function toggleChatReaction(messageId: string, emoji: string, userId: string): Promise<ChatMessage | null> {
    await ensureDataFiles();
    let messages: ChatMessage[] = [];
    try {
        const raw = await fs.readFile(DATA_MESSAGES_FILE, 'utf-8');
        messages = JSON.parse(raw);
    } catch {
        return null;
    }

    const msg = messages.find(m => m.id === messageId);
    if (!msg) return null;

    if (!Array.isArray(msg.reactions)) {
        msg.reactions = [];
    }

    const existingIndex = msg.reactions.findIndex(r => r.emoji === emoji);

    if (existingIndex >= 0) {
        const r = msg.reactions[existingIndex];
        const userIndex = r.users.indexOf(userId);

        if (userIndex >= 0) {
            r.users.splice(userIndex, 1);
            r.count = r.users.length;
            if (r.count <= 0) {
                msg.reactions.splice(existingIndex, 1);
            }
        } else {
            r.users.push(userId);
            r.count = r.users.length;
        }
    } else {
        msg.reactions.push({
            emoji,
            count: 1,
            users: [userId]
        });
    }

    await fs.writeFile(DATA_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return msg;
}

export async function deleteChatMessage(messageId: string): Promise<boolean> {
    await ensureDataFiles();
    let messages: ChatMessage[] = [];
    try {
        const raw = await fs.readFile(DATA_MESSAGES_FILE, 'utf-8');
        messages = JSON.parse(raw);
    } catch {
        return false;
    }

    const initLen = messages.length;
    messages = messages.filter(m => m.id !== messageId);

    if (messages.length !== initLen) {
        await fs.writeFile(DATA_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
        return true;
    }
    return false;
}

export async function updateChatMessage(messageId: string, newContent: string): Promise<ChatMessage | null> {
    await ensureDataFiles();
    let messages: ChatMessage[] = [];
    try {
        const raw = await fs.readFile(DATA_MESSAGES_FILE, 'utf-8');
        messages = JSON.parse(raw);
    } catch {
        return null;
    }

    const msg = messages.find(m => m.id === messageId);
    if (!msg) return null;

    msg.content = newContent.trim();
    await fs.writeFile(DATA_MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
    return msg;
}
