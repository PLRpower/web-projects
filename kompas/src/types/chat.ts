export interface ChatMessage {
    id: string;
    scope: 'national' | 'campus' | 'direct';
    promo: string;
    channel: string;
    campus: string;
    author: string;
    authorInitial: string;
    authorId?: string;
    recipientId?: string;
    recipientName?: string;
    specialty: string;
    content: string;
    timestamp: string;
    createdAt?: string;
    reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface ChatChannel {
    id: string;
    label: string;
    description: string;
    category: string;
    scope: 'national' | 'campus';
    promo: string;
    campus?: string;
    createdBy?: string;
    isCustom?: boolean;
}

export const DEFAULT_CHANNELS: ChatChannel[] = [
    {
        id: 'general',
        label: 'général',
        description: 'Discussions quotidiennes, actus & vie de promo',
        category: 'Général',
        scope: 'national',
        promo: 'Tous'
    }
];
