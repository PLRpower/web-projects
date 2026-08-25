'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    Plus,
    BookOpen,
    Search,
    Brain,
    Layers,
    Trash2,
    Edit3,
    Globe,
    Lock,
    Heart,
    CheckCircle2,
    XCircle,
    RotateCw,
    Shuffle,
    ArrowLeft,
    ArrowRight,
    Code2,
    Check,
    HelpCircle,
    User,
    Share2,
    Calendar,
    GraduationCap,
    Copy,
    Download,
    WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/cctl/CodeBlock';
import { FlashcardDeck, FlashcardItem } from '@/types/flashcard';
import { SEED_FLASHCARD_DECKS } from '@/lib/flashcard-seed-data';
import {
    saveDeckOffline,
    removeDeckOffline,
    isDeckSavedOffline,
    getOfflineDecks,
    useNetworkStatus
} from '@/lib/offline-storage';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail } from '@/lib/admin';

const PROMO_OPTIONS = ['Tous', 'A1', 'A2', 'A3', 'A4', 'A5'];
const DOMAIN_OPTIONS = [
    'Tous',
    'Sciences & Mathématiques',
    'Physique, Électronique & Automatique',
    'Développement & Algorithmique',
    'Bases de Données & Systèmes',
    'Réseau & Cybersécurité',
    'Gestion de Projet & Management',
    'BTP & Génie Civil'
];

export default function FlashcardsPage() {
    const supabase = createClient();
    // Current user name
    const [userName, setUserName] = useState('Élève-Ingénieur');
    const [userPromo, setUserPromo] = useState('A3');
    const [isAdmin, setIsAdmin] = useState(false);

    // Decks state
    const [decks, setDecks] = useState<FlashcardDeck[]>(SEED_FLASHCARD_DECKS);
    const [likedDecks, setLikedDecks] = useState<Record<string, boolean>>({});

    // Active View: 'hub' | 'creator' | 'player'
    const [viewMode, setViewMode] = useState<'hub' | 'creator' | 'player'>('hub');
    const [activeTab, setActiveTab] = useState<'community' | 'my_decks' | 'offline'>('community');

    // Network & Offline Storage State
    const { isOnline } = useNetworkStatus();
    const [offlineDeckIds, setOfflineDeckIds] = useState<Record<string, boolean>>({});

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPromo, setSelectedPromo] = useState('Tous');
    const [selectedDomain, setSelectedDomain] = useState('Tous');

    // Creator / Editor State
    const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        promo: string;
        specialty: string;
        domain: string;
        tagsInput: string;
        isPublic: boolean;
        cards: FlashcardItem[];
    }>({
        title: '',
        description: '',
        promo: 'A3',
        specialty: 'FISA Info',
        domain: 'Sciences & Mathématiques',
        tagsInput: 'Cours, Révision, CESI',
        isPublic: true,
        cards: [
            { id: '1', front: '', back: '' }
        ]
    });

    // Player State
    const [playingDeck, setPlayingDeck] = useState<FlashcardDeck | null>(null);
    const [deckCards, setDeckCards] = useState<FlashcardItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCards, setKnownCards] = useState<Record<string, boolean>>({});
    const [isFinished, setIsFinished] = useState(false);

    // Sync Offline Decks
    const syncOfflineDecks = () => {
        const offline = getOfflineDecks();
        const map: Record<string, boolean> = {};
        offline.forEach(d => {
            map[d.id] = true;
        });
        setOfflineDeckIds(map);
    };

    // Load from localStorage & Supabase
    useEffect(() => {
        const checkUserAndAdmin = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    if (isAdminUser(user) || isAdminEmail(user.email)) {
                        setIsAdmin(true);
                    }
                    const meta = user.user_metadata;
                    if (meta?.name) setUserName(`${meta.name} (${meta.promo || 'A3'})`);
                    else if (user.email) setUserName(`${user.email.split('@')[0]} (${meta?.promo || 'A3'})`);
                }
            } catch {}
        };

        checkUserAndAdmin();

        const savedProfile = localStorage.getItem('kompas_user_profile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                if (parsed.name) setUserName(`${parsed.name} (${parsed.promo || 'A3'})`);
                if (parsed.promo) setUserPromo(parsed.promo);
                if (parsed.email && isAdminEmail(parsed.email)) setIsAdmin(true);
                if (parsed.role === 'admin' || parsed.isAdmin) setIsAdmin(true);
            } catch {}
        }

        const savedDecks = localStorage.getItem('kompas_custom_flashcards_decks');
        if (savedDecks) {
            try {
                const parsed = JSON.parse(savedDecks);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setDecks(parsed);
                }
            } catch {}
        } else {
            // Save initial seed to localStorage
            localStorage.setItem('kompas_custom_flashcards_decks', JSON.stringify(SEED_FLASHCARD_DECKS));
        }

        const savedLikes = localStorage.getItem('kompas_flashcards_liked_decks');
        if (savedLikes) {
            try {
                setLikedDecks(JSON.parse(savedLikes));
            } catch {}
        }

        syncOfflineDecks();
        window.addEventListener('kompas_offline_updated', syncOfflineDecks);
        return () => window.removeEventListener('kompas_offline_updated', syncOfflineDecks);
    }, []);

    // Save decks to localStorage
    const persistDecks = (updated: FlashcardDeck[]) => {
        setDecks(updated);
        localStorage.setItem('kompas_custom_flashcards_decks', JSON.stringify(updated));
    };

    // Toggle Offline Download for a Deck
    const handleToggleOffline = (deck: FlashcardDeck, e: React.MouseEvent) => {
        e.stopPropagation();
        const isSaved = offlineDeckIds[deck.id];
        if (isSaved) {
            removeDeckOffline(deck.id);
        } else {
            saveDeckOffline(deck);
        }
        syncOfflineDecks();
    };

    // Filtered decks
    const filteredDecks = useMemo(() => {
        return decks.filter(deck => {
            if (activeTab === 'my_decks' && deck.authorName !== userName) return false;
            if (activeTab === 'offline' && !offlineDeckIds[deck.id]) return false;
            if (activeTab === 'community' && !deck.isPublic && deck.authorName !== userName) return false;

            const promoMatch = selectedPromo === 'Tous' || deck.promo === selectedPromo;
            const domainMatch = selectedDomain === 'Tous' || deck.domain === selectedDomain;

            const q = searchQuery.toLowerCase().trim();
            const searchMatch = !q ||
                deck.title.toLowerCase().includes(q) ||
                deck.description.toLowerCase().includes(q) ||
                deck.domain.toLowerCase().includes(q) ||
                deck.tags.some(t => t.toLowerCase().includes(q)) ||
                deck.cards.some(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q));

            return promoMatch && domainMatch && searchMatch;
        });
    }, [decks, activeTab, userName, selectedPromo, selectedDomain, searchQuery, offlineDeckIds]);

    // Handle Start Practice
    const handleStartPractice = (deck: FlashcardDeck) => {
        setPlayingDeck(deck);
        setDeckCards([...deck.cards]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCards({});
        setIsFinished(false);
        setViewMode('player');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Increment practice count
        const updated = decks.map(d => d.id === deck.id ? { ...d, practicesCount: d.practicesCount + 1 } : d);
        persistDecks(updated);
    };

    // Toggle Like
    const handleToggleLike = (deckId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const isLiked = likedDecks[deckId];
        const updatedLikes = { ...likedDecks, [deckId]: !isLiked };
        setLikedDecks(updatedLikes);
        localStorage.setItem('kompas_flashcards_liked_decks', JSON.stringify(updatedLikes));

        const updated = decks.map(d => {
            if (d.id === deckId) {
                return {
                    ...d,
                    likesCount: isLiked ? Math.max(0, d.likesCount - 1) : d.likesCount + 1
                };
            }
            return d;
        });
        persistDecks(updated);
    };

    // Open Creator for a new Deck
    const handleOpenCreator = () => {
        setEditingDeckId(null);
        setFormData({
            title: '',
            description: '',
            promo: userPromo || 'A3',
            specialty: 'FISA Info',
            domain: 'Développement Web',
            tagsInput: 'TypeScript, Clean Code, CESI',
            isPublic: true,
            cards: [
                { id: 'card-1', front: '', back: '', codeSnippet: '', codeLanguage: 'typescript' },
                { id: 'card-2', front: '', back: '', codeSnippet: '', codeLanguage: 'typescript' }
            ]
        });
        setViewMode('creator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Open Editor for an existing Deck
    const handleOpenEditor = (deck: FlashcardDeck, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingDeckId(deck.id);
        setFormData({
            title: deck.title,
            description: deck.description,
            promo: deck.promo,
            specialty: deck.specialty,
            domain: deck.domain,
            tagsInput: deck.tags.join(', '),
            isPublic: deck.isPublic,
            cards: deck.cards.map((c, idx) => ({ ...c, id: c.id || `card-${idx + 1}` }))
        });
        setViewMode('creator');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Delete Deck
    const handleDeleteDeck = (deckId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Êtes-vous sûr de vouloir supprimer ce deck de flashcards ?')) {
            const updated = decks.filter(d => d.id !== deckId);
            persistDecks(updated);
        }
    };

    // Toggle Public/Private for own deck
    const handleTogglePublic = (deckId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = decks.map(d => {
            if (d.id === deckId) {
                return { ...d, isPublic: !d.isPublic };
            }
            return d;
        });
        persistDecks(updated);
    };

    // Add Card in Creator
    const handleAddCard = () => {
        setFormData({
            ...formData,
            cards: [
                ...formData.cards,
                {
                    id: `card-${Date.now().toString(36)}`,
                    front: '',
                    back: ''
                }
            ]
        });
    };

    // Remove Card in Creator
    const handleRemoveCard = (cardIdx: number) => {
        if (formData.cards.length <= 1) return;
        setFormData({
            ...formData,
            cards: formData.cards.filter((_, idx) => idx !== cardIdx)
        });
    };

    // Duplicate Card in Creator
    const handleDuplicateCard = (cardIdx: number) => {
        const target = formData.cards[cardIdx];
        const newCard: FlashcardItem = {
            ...target,
            id: `card-${Date.now().toString(36)}`
        };
        const newCards = [...formData.cards];
        newCards.splice(cardIdx + 1, 0, newCard);
        setFormData({ ...formData, cards: newCards });
    };

    // Save Deck (Create or Edit)
    const handleSaveDeck = () => {
        if (!formData.title.trim()) {
            alert('Veuillez renseigner un titre pour votre deck de flashcards.');
            return;
        }

        const validCards = formData.cards.filter(c => c.front.trim() && c.back.trim());
        if (validCards.length === 0) {
            alert('Veuillez renseigner au moins une carte complète (recto et verso).');
            return;
        }

        const tags = formData.tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        if (editingDeckId) {
            // Edit existing
            const updated = decks.map(d => {
                if (d.id === editingDeckId) {
                    return {
                        ...d,
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                        promo: formData.promo,
                        specialty: formData.specialty,
                        domain: formData.domain,
                        tags,
                        isPublic: formData.isPublic,
                        updatedAt: new Date().toISOString(),
                        cards: validCards
                    };
                }
                return d;
            });
            persistDecks(updated);
        } else {
            // Create new
            const newDeck: FlashcardDeck = {
                id: `deck-${Date.now().toString(36)}`,
                title: formData.title.trim(),
                description: formData.description.trim(),
                promo: formData.promo,
                specialty: formData.specialty,
                domain: formData.domain,
                tags: tags.length > 0 ? tags : ['Flashcards', 'CESI'],
                authorName: userName,
                isPublic: formData.isPublic,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                likesCount: 0,
                practicesCount: 0,
                cards: validCards
            };
            persistDecks([newDeck, ...decks]);
        }

        setViewMode('hub');
        setActiveTab('my_decks');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-8 pb-16">
            {/* VIEW 1: FLASHCARDS HUB */}
            {viewMode === 'hub' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Unified Header & Filters Card */}
                    <div className="card-editorial p-5 sm:p-6 rounded-3xl bg-surface-card border-border shadow-lg space-y-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

                        {/* Top: Title & Primary Action */}
                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1 sm:space-y-2">
                                <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                                    Flashcards &amp; Decks <span className="italic font-normal">d&apos;Étude</span>
                                </h1>
                                <p className="text-xs sm:text-sm text-text-secondary font-normal">
                                    Créez vos paquets de cartes, révisez vos cours d&apos;ingénieur et partagez-les avec votre promo.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleOpenCreator}
                                className="px-4 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Créer un Deck</span>
                            </button>
                        </div>

                        {/* Bottom: Inline Tabs & Filter Toolbar */}
                        <div className="relative z-10 pt-3 border-t border-border/60 flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('community')}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        activeTab === 'community'
                                            ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                                    }`}
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Communauté ({decks.filter(d => d.isPublic || d.authorName === userName).length})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('my_decks')}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        activeTab === 'my_decks'
                                            ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                                    }`}
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span>Mes Decks ({decks.filter(d => d.authorName === userName).length})</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('offline')}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        activeTab === 'offline'
                                            ? 'bg-accent-yellow text-black font-bold shadow-xs'
                                            : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                                    }`}
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Hors-Ligne ({Object.keys(offlineDeckIds).length})</span>
                                </button>
                            </div>

                            {/* Filters row */}
                            <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 lg:max-w-xl">
                                <div className="relative flex-1 w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher concept, mot-clé, tag..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-surface/80 border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-yellow/50 transition-all placeholder:text-text-secondary/50"
                                    />
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                    <select
                                        value={selectedPromo}
                                        onChange={(e) => setSelectedPromo(e.target.value)}
                                        className="bg-surface/80 border border-border rounded-xl px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-yellow/50 cursor-pointer"
                                    >
                                        {PROMO_OPTIONS.map(p => (
                                            <option key={p} value={p}>{p === 'Tous' ? 'Toutes Promos' : `Promo ${p}`}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedDomain}
                                        onChange={(e) => setSelectedDomain(e.target.value)}
                                        className="bg-surface/80 border border-border rounded-xl px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-yellow/50 cursor-pointer max-w-[150px] truncate"
                                    >
                                        {DOMAIN_OPTIONS.map(d => (
                                            <option key={d} value={d}>{d === 'Tous' ? 'Toutes Matières' : d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decks Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDecks.map((deck) => {
                            const isMyDeck = deck.authorName === userName;
                            const canManage = isMyDeck || isAdmin;
                            const isLiked = likedDecks[deck.id];

                            return (
                                <div
                                    key={deck.id}
                                    className="glass group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between shadow-xl relative"
                                >
                                    <div className="space-y-4">
                                        {/* Badges Top */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                                                    {deck.promo}
                                                </span>
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface-highlight text-text-secondary border border-border/50">
                                                    {deck.domain}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {canManage && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                        deck.isPublic
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                            : 'bg-surface-highlight text-text-secondary border-border'
                                                    }`}>
                                                        {deck.isPublic ? 'Public' : 'Privé'}
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={(e) => handleToggleLike(deck.id, e)}
                                                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-red-400 transition-colors"
                                                    title="J'aime ce deck"
                                                >
                                                    <Heart className={`w-4 h-4 ${isLiked ? 'text-red-400 fill-red-400' : ''}`} />
                                                    <span>{deck.likesCount}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-1.5">
                                            <h3 className="font-bold font-syne text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug">
                                                {deck.title}
                                            </h3>
                                            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                                                {deck.description || 'Deck de révision thématique pour les étudiants du CESI.'}
                                            </p>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {deck.tags.slice(0, 3).map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[11px] font-medium bg-surface-highlight/40 text-text-secondary px-2 py-0.5 rounded-md border border-border/40"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer & Actions */}
                                    <div className="pt-5 mt-5 border-t border-border/40 space-y-3">
                                        <div className="flex items-center justify-between text-xs text-text-secondary">
                                            <span className="font-bold text-accent-yellow">
                                                {deck.cards.length} Carte{deck.cards.length > 1 ? 's' : ''}
                                            </span>
                                            <span className="truncate max-w-[140px]">Par {deck.authorName}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="premium"
                                                size="sm"
                                                onClick={() => handleStartPractice(deck)}
                                                className="flex-1 font-bold text-xs shadow-md shadow-accent-yellow/20 h-9"
                                            >
                                                <Brain className="w-3.5 h-3.5 mr-1.5" />
                                                S&apos;entraîner
                                            </Button>

                                            {/* Offline Download Button */}
                                            <button
                                                type="button"
                                                onClick={(e) => handleToggleOffline(deck, e)}
                                                className={`px-2.5 h-9 rounded-xl border text-xs font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                                                    offlineDeckIds[deck.id]
                                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                                                        : 'bg-surface border-border/70 text-text-muted hover:text-text-primary hover:border-accent-yellow'
                                                }`}
                                                title={
                                                    offlineDeckIds[deck.id]
                                                        ? 'Enregistré hors-ligne pour révision sans connexion'
                                                        : 'Télécharger pour réviser dans le train/bus sans réseau'
                                                }
                                            >
                                                {offlineDeckIds[deck.id] ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="hidden sm:inline">Hors-Ligne</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Télécharger</span>
                                                    </>
                                                )}
                                            </button>

                                            {canManage && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => handleOpenEditor(deck, e)}
                                                        className="border-border/70 text-xs px-2.5 h-9"
                                                        title="Modifier ce deck"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => handleTogglePublic(deck.id, e)}
                                                        className="border-border/70 text-xs px-2.5 h-9"
                                                        title={deck.isPublic ? 'Rendre privé' : 'Publier à la communauté'}
                                                    >
                                                        {deck.isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => handleDeleteDeck(deck.id, e)}
                                                        className="border-border/70 hover:bg-red-500/10 hover:text-red-400 text-xs px-2.5 h-9"
                                                        title="Supprimer ce deck"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredDecks.length === 0 && (
                        <div className="glass p-16 text-center rounded-3xl border border-border text-text-secondary space-y-4 max-w-md mx-auto">
                            <div className="p-4 bg-accent-yellow/10 rounded-2xl w-fit mx-auto text-accent-yellow border border-accent-yellow/20">
                                <Layers className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold font-syne text-lg text-text-primary">
                                    {activeTab === 'offline' ? 'Aucun deck téléchargé hors-ligne' : 'Aucun deck trouvé'}
                                </h3>
                                <p className="text-xs leading-relaxed">
                                    {activeTab === 'offline'
                                        ? 'Téléchargez des paquets de cartes en cliquant sur le bouton « Télécharger » pour y accéder sans connexion dans les transports.'
                                        : activeTab === 'my_decks'
                                        ? 'Vous n\'avez pas encore créé de deck de flashcards. Créez-en un pour réviser et le partager !'
                                        : 'Aucun deck ne correspond à vos filtres actuels.'}
                                </p>
                            </div>
                            {activeTab === 'offline' ? (
                                <Button variant="premium" size="sm" onClick={() => setActiveTab('community')}>
                                    <Globe className="w-4 h-4 mr-1.5" />
                                    Explorer les decks communauté
                                </Button>
                            ) : (
                                <Button variant="premium" size="sm" onClick={handleOpenCreator}>
                                    <Plus className="w-4 h-4 mr-1.5" />
                                    Créer mon premier deck
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 2: DECK CREATOR & EDITOR */}
            {viewMode === 'creator' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewMode('hub')}
                            className="border-border/60 text-xs"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Retour aux decks
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData({ ...formData, isPublic: false });
                                    handleSaveDeck();
                                }}
                                className="border-border/60 text-xs"
                            >
                                Enregistrer Brouillon
                            </Button>
                            <Button
                                variant="premium"
                                size="sm"
                                onClick={handleSaveDeck}
                                className="font-bold text-xs shadow-md shadow-accent-yellow/20"
                            >
                                <Check className="w-4 h-4 mr-1.5" />
                                {formData.isPublic ? 'Enregistrer & Publier' : 'Enregistrer'}
                            </Button>
                        </div>
                    </div>

                    {/* Deck Settings Box */}
                    <div className="glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-border/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-accent-yellow/10 rounded-2xl text-accent-yellow border border-accent-yellow/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold font-syne text-text-primary">
                                        {editingDeckId ? 'Modifier le Deck' : 'Créer un nouveau Deck de Flashcards'}
                                    </h2>
                                    <p className="text-xs text-text-secondary">
                                        Remplissez les métadonnées de votre deck pour faciliter sa découverte par vos camarades de promo.
                                    </p>
                                </div>
                            </div>

                            {/* Public / Private toggle */}
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                    formData.isPublic
                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                                        : 'bg-surface-highlight text-text-secondary border-border'
                                }`}
                            >
                                {formData.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                <span>{formData.isPublic ? 'Public (Visible par tous)' : 'Privé (Brouillon)'}</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                                    Titre du Deck *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Clean Architecture, SOLID & Patrons de conception en TypeScript"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-surface-highlight/50 border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                                        Promotion Cible
                                    </label>
                                    <select
                                        value={formData.promo}
                                        onChange={(e) => setFormData({ ...formData, promo: e.target.value })}
                                        className="w-full bg-surface-highlight/50 border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    >
                                        <option value="A3">Promo A3 (Bac+3)</option>
                                        <option value="A4">Promo A4 (Bac+4)</option>
                                        <option value="A2">Promo A2 (Prépa 2)</option>
                                        <option value="A1">Promo A1 (Prépa 1)</option>
                                        <option value="A5">Promo A5 (Bac+5)</option>
                                        <option value="Tous">Toutes Promos</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                                        Matière / Domaine
                                    </label>
                                    <select
                                        value={formData.domain}
                                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                        className="w-full bg-surface-highlight/50 border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    >
                                        {DOMAIN_OPTIONS.filter(d => d !== 'Tous').map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                                        Tags (séparés par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SOLID, Docker, JWT, SQL..."
                                        value={formData.tagsInput}
                                        onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                                        className="w-full bg-surface-highlight/50 border border-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-1.5">
                                    Description & Conseils de révision
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Décrivez brièvement les notions clés révisées dans ce paquet..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-surface-highlight/50 border border-border rounded-xl p-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cards Editor List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold font-syne text-text-primary flex items-center gap-2">
                                <Layers className="w-5 h-5 text-accent-yellow" />
                                Cartes du Deck ({formData.cards.length})
                            </h3>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddCard}
                                className="border-border/70 hover:bg-surface-highlight text-xs font-semibold"
                            >
                                <Plus className="w-4 h-4 mr-1.5 text-accent-yellow" />
                                Ajouter une carte
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {formData.cards.map((card, idx) => (
                                <div
                                    key={card.id || idx}
                                    className="glass rounded-3xl border border-border/80 p-5 sm:p-6 space-y-4 shadow-lg relative"
                                >
                                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                                        <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider">
                                            Carte {idx + 1}
                                        </span>

                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDuplicateCard(idx)}
                                                className="h-8 px-2 text-xs text-text-secondary hover:text-text-primary"
                                                title="Dupliquer"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>

                                            {formData.cards.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveCard(idx)}
                                                    className="h-8 px-2 text-xs text-text-secondary hover:text-red-400"
                                                    title="Supprimer cette carte"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Front & Back fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                                                Recto (Question / Définition / Théorème) *
                                            </label>
                                            <textarea
                                                rows={4}
                                                placeholder="Ex: Énoncé du théorème de Gauss, définition de l'entropie ou question de cours..."
                                                value={card.front}
                                                onChange={(e) => {
                                                    const updated = [...formData.cards];
                                                    updated[idx].front = e.target.value;
                                                    setFormData({ ...formData, cards: updated });
                                                }}
                                                className="w-full bg-surface-highlight/40 border border-border rounded-xl p-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                                                Verso (Réponse / Démonstration / Explication) *
                                            </label>
                                            <textarea
                                                rows={4}
                                                placeholder="Ex: Réponse détaillée, formule ou explication attendue..."
                                                value={card.back}
                                                onChange={(e) => {
                                                    const updated = [...formData.cards];
                                                    updated[idx].back = e.target.value;
                                                    setFormData({ ...formData, cards: updated });
                                                }}
                                                className="w-full bg-surface-highlight/40 border border-border rounded-xl p-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex items-center justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddCard}
                                className="border-border hover:bg-surface-highlight font-bold text-xs sm:text-sm"
                            >
                                <Plus className="w-4 h-4 mr-2 text-accent-yellow" />
                                Ajouter une autre carte ({formData.cards.length + 1})
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW 3: INTERACTIVE FLASHCARD PLAYER */}
            {viewMode === 'player' && playingDeck && deckCards.length > 0 && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                    {/* Top Header */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewMode('hub')}
                            className="border-border/60 text-xs"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Quitter la session
                        </Button>

                        <div className="text-right">
                            <span className="text-xs font-bold text-accent-yellow block">
                                {playingDeck.title}
                            </span>
                            <span className="text-[11px] text-text-secondary">
                                {playingDeck.domain} • {playingDeck.promo}
                            </span>
                        </div>
                    </div>

                    {!isFinished ? (
                        <>
                            {/* Header controls & progress */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-syne font-bold text-lg text-text-primary">
                                        Carte {currentIndex + 1} <span className="text-text-secondary font-normal text-sm">/ {deckCards.length}</span>
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
                                            setDeckCards(shuffled);
                                            setCurrentIndex(0);
                                            setIsFlipped(false);
                                        }}
                                        className="border-border/60 text-xs h-8"
                                    >
                                        <Shuffle className="w-3.5 h-3.5 mr-1.5" /> Mélanger
                                    </Button>
                                </div>

                                {/* Progress bar */}
                                <div className="flex items-center gap-3 w-44">
                                    <div className="flex-1 h-2 bg-surface-highlight rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent-yellow transition-all duration-300 rounded-full"
                                            style={{ width: `${Math.round(((currentIndex + 1) / deckCards.length) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-text-secondary">
                                        {Math.round(((currentIndex + 1) / deckCards.length) * 100)}%
                                    </span>
                                </div>
                            </div>

                            {/* 3D Flashcard */}
                            {(() => {
                                const currentCard = deckCards[currentIndex];

                                return (
                                    <div
                                        onClick={() => setIsFlipped(!isFlipped)}
                                        className="perspective-1000 w-full min-h-[380px] cursor-pointer select-none group"
                                    >
                                        <div
                                            className={`relative w-full h-full min-h-[380px] transition-transform duration-500 preserve-3d ${
                                                isFlipped ? 'rotate-y-180' : ''
                                            }`}
                                        >
                                            {/* RECTO (Front Face) */}
                                            <div className="absolute inset-0 backface-hidden rounded-3xl glass border border-border/80 hover:border-accent-yellow/40 transition-all duration-300 shadow-2xl p-8 flex flex-col justify-between">
                                                {/* Card Top */}
                                                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-highlight text-text-secondary border border-border/70">
                                                        Recto (Question / Concept)
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-xs text-text-secondary group-hover:text-accent-yellow transition-colors">
                                                        <RotateCw className="w-3.5 h-3.5" />
                                                        <span>Cliquez pour voir la réponse</span>
                                                    </div>
                                                </div>

                                                {/* Card Main Body */}
                                                <div className="py-6 flex-1 flex flex-col justify-center space-y-4">
                                                    <p className="text-xl sm:text-2xl font-bold font-syne text-text-primary leading-relaxed">
                                                        {currentCard.front}
                                                    </p>
                                                    {currentCard.codeSnippet && (
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <CodeBlock
                                                                code={currentCard.codeSnippet}
                                                                language={currentCard.codeLanguage || 'typescript'}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Bottom */}
                                                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-text-secondary">
                                                    <span>Appuyez sur la carte pour la retourner</span>
                                                    <span className="italic">Session en cours</span>
                                                </div>
                                            </div>

                                            {/* VERSO (Back Face) */}
                                            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl glass border-2 border-emerald-500/40 shadow-2xl p-8 flex flex-col justify-between">
                                                {/* Card Top */}
                                                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                        Verso (Réponse / Définition)
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-xs text-accent-yellow">
                                                        <RotateCw className="w-3.5 h-3.5" />
                                                        <span>Cliquez pour voir la question</span>
                                                    </div>
                                                </div>

                                                {/* Card Main Body */}
                                                <div className="py-6 flex-1 flex flex-col justify-center space-y-4">
                                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        <span>Réponse &amp; Explication :</span>
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 text-base font-medium leading-relaxed whitespace-pre-line">
                                                        {currentCard.back}
                                                    </div>
                                                </div>

                                                {/* Card Bottom */}
                                                <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-text-secondary">
                                                    <span className="text-emerald-400 font-semibold">Réponse validée</span>
                                                    <span className="italic">Évaluez votre niveau ci-dessous</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Bottom Navigation & Mastery Buttons */}
                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (currentIndex > 0) {
                                            setCurrentIndex(currentIndex - 1);
                                            setIsFlipped(false);
                                        }
                                    }}
                                    disabled={currentIndex === 0}
                                    className="border-border/60"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Précédente
                                </Button>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            setKnownCards({ ...knownCards, [deckCards[currentIndex].id]: false });
                                            if (currentIndex < deckCards.length - 1) {
                                                setCurrentIndex(currentIndex + 1);
                                                setIsFlipped(false);
                                            } else {
                                                setIsFinished(true);
                                            }
                                        }}
                                        className="text-xs hover:bg-red-500/20 hover:text-red-300"
                                    >
                                        <XCircle className="w-4 h-4 mr-1.5 text-red-400" /> À revoir
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            setKnownCards({ ...knownCards, [deckCards[currentIndex].id]: true });
                                            if (currentIndex < deckCards.length - 1) {
                                                setCurrentIndex(currentIndex + 1);
                                                setIsFlipped(false);
                                            } else {
                                                setIsFinished(true);
                                            }
                                        }}
                                        className="text-xs hover:bg-emerald-500/20 hover:text-emerald-300"
                                    >
                                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" /> Maîtrisé
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (currentIndex < deckCards.length - 1) {
                                            setCurrentIndex(currentIndex + 1);
                                            setIsFlipped(false);
                                        } else {
                                            setIsFinished(true);
                                        }
                                    }}
                                    className="border-border/60"
                                >
                                    {currentIndex === deckCards.length - 1 ? 'Terminer' : 'Suivante'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        /* Deck Finished Debriefing */
                        <div className="glass rounded-3xl border border-border/80 p-8 sm:p-10 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
                            <span className="text-5xl inline-block p-4 rounded-3xl bg-accent-yellow/15 border border-accent-yellow/30">
                                🌟
                            </span>
                            <div className="space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-bold font-syne text-text-primary">
                                    Deck Terminé !
                                </h2>
                                <p className="text-xs sm:text-sm text-text-secondary">
                                    Vous avez révisé les {deckCards.length} cartes du deck <strong>{playingDeck.title}</strong>.
                                </p>
                            </div>

                            {(() => {
                                const masteredCount = Object.values(knownCards).filter(Boolean).length;
                                const masteryPct = Math.round((masteredCount / deckCards.length) * 100);

                                return (
                                    <div className="p-6 rounded-2xl bg-surface-highlight/30 border border-border max-w-xs mx-auto space-y-2">
                                        <span className="text-xs text-text-secondary uppercase tracking-wider block">
                                            Score de Maîtrise
                                        </span>
                                        <div className="text-4xl font-extrabold font-syne text-accent-yellow">
                                            {masteryPct}%
                                        </div>
                                        <span className="text-xs text-text-secondary">
                                            {masteredCount} maîtrisée{masteredCount > 1 ? 's' : ''} sur {deckCards.length}
                                        </span>
                                    </div>
                                );
                            })()}

                            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/40">
                                <Button
                                    variant="premium"
                                    onClick={() => handleStartPractice(playingDeck)}
                                    className="font-bold shadow-md shadow-accent-yellow/20"
                                >
                                    <RotateCw className="w-4 h-4 mr-2" />
                                    Recommencer la révision
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => setViewMode('hub')}
                                    className="border-border/70"
                                >
                                    Retour aux Decks
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
