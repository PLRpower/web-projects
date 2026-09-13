export interface FlashcardItem {
    id: string;
    front: string;
    back: string;
    codeSnippet?: string;
    codeLanguage?: string;
}

export interface FlashcardDeck {
    id: string;
    title: string;
    description: string;
    promo: string;
    specialty: string;
    domain: string;
    tags: string[];
    cards: FlashcardItem[];
    authorId?: string;
    authorEmail?: string;
    authorName: string;
    isAnonymous?: boolean;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    practicesCount: number;
}
