'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Users,
    MessageSquare,
    FileDown,
    Send,
    Sparkles,
    CheckCircle2,
    BookOpen,
    Download,
    Hash,
    Smile,
    Heart,
    Zap,
    GraduationCap,
    Clock,
    Circle,
    UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResourceItem {
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    campus: string;
    downloads: number;
    fileSize: string;
    fileType: string;
}

const RESOURCES: ResourceItem[] = [
    {
        id: 'r1',
        title: 'Fiche Révision Express : SQL Avancé & Optimisation PostgreSQL',
        description: 'Indexation B-Tree vs GIN, Explain Analyze, Niveaux d\'isolation ACID et requêtes fenêtrées.',
        category: 'Fiche Mémo',
        author: 'Sarah B. (A4)',
        campus: 'Lyon',
        downloads: 412,
        fileSize: '1.2 Mo',
        fileType: 'PDF'
    },
    {
        id: 'r2',
        title: 'Template PowerPoint : Soutenance de Livrable & PFA CESI',
        description: 'Trame officielle 15 slides : Contexte, Problématique, Architecture C4, Démo et Bilan financier.',
        category: 'Template Soutenance',
        author: 'Alexandre M. (A3)',
        campus: 'Rouen',
        downloads: 689,
        fileSize: '3.4 Mo',
        fileType: 'PPTX'
    },
    {
        id: 'r3',
        title: 'Cheat Sheet Git : Workflow Feature Branch & Rebase Propre',
        description: 'Commandes indispensables, conventions de commit Conventional Commits, merge et stash.',
        category: 'Cheat Sheet',
        author: 'Lucas B. (A3)',
        campus: 'Nanterre',
        downloads: 530,
        fileSize: '650 Ko',
        fileType: 'PDF'
    },
    {
        id: 'r4',
        title: 'Docker & Docker Compose : Kit de démarrage Prosits Systèmes',
        description: 'Fichiers docker-compose.yml prêts à l\'emploi pour PostgreSQL, Redis, RabbitMQ et Nginx.',
        category: 'Code & Infra',
        author: 'Camille D. (A5)',
        campus: 'Bordeaux',
        downloads: 310,
        fileSize: '420 Ko',
        fileType: 'ZIP'
    }
];

interface ChatMessage {
    id: string;
    promo: string;
    channel: string;
    author: string;
    authorInitial: string;
    specialty: string;
    campus: string;
    content: string;
    timestamp: string;
    isCurrentUser?: boolean;
    reactions?: { emoji: string; count: number; userReacted?: boolean }[];
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
    {
        id: 'm1',
        promo: 'A3',
        channel: 'general',
        author: 'Théo V.',
        authorInitial: 'T',
        specialty: 'Informatique',
        campus: 'Lyon',
        content: 'Salut tout le monde ! Est-ce que quelqu\'un a commencé la préparation de la soutenance de bloc pour vendredi ? On fait un point sur Discord ce soir vers 19h si ça vous dit.',
        timestamp: '17:42',
        reactions: [{ emoji: '👍', count: 4, userReacted: true }, { emoji: '🚀', count: 2 }]
    },
    {
        id: 'm2',
        promo: 'A3',
        channel: 'general',
        author: 'Inès M.',
        authorInitial: 'I',
        specialty: 'Informatique',
        campus: 'Nanterre',
        content: 'Super idée Théo ! J\'ai fini la trame du DAT et le schéma C4, je pourrai vous montrer la structure pour avoir vos avis.',
        timestamp: '17:45',
        reactions: [{ emoji: '🔥', count: 3 }]
    },
    {
        id: 'm3',
        promo: 'A3',
        channel: 'cctl-revisions',
        author: 'Alexandre M.',
        authorInitial: 'A',
        specialty: 'Informatique',
        campus: 'Rouen',
        content: 'Rappel pour le CCTL d\'Architecture Web : révisez bien les différences entre Server Components et Client Components sous Next.js 15/16. Il y a eu 3 questions là-dessus dans l\'annale 2025.',
        timestamp: '16:20',
        reactions: [{ emoji: '💡', count: 7, userReacted: true }]
    },
    {
        id: 'm4',
        promo: 'A3',
        channel: 'prosits-pbl',
        author: 'Camille D.',
        authorInitial: 'C',
        specialty: 'Systèmes Embarqués',
        campus: 'Bordeaux',
        content: 'Pour le Prosit sur le Bus CAN & FreeRTOS, pensez bien à mentionner l\'héritage de priorité dans vos hypothèses pour éviter les inversions de priorité.',
        timestamp: '15:10',
        reactions: [{ emoji: '👏', count: 5 }]
    },
    {
        id: 'm5',
        promo: 'A4',
        channel: 'general',
        author: 'Sarah B.',
        authorInitial: 'S',
        specialty: 'Informatique',
        campus: 'Lyon',
        content: 'Hello les A4 ! Les sujets de PFA viennent d\'être publiés sur le portail CESI. On recherche une 4ème personne dans notre équipe pour le projet Cyber & DevSecOps.',
        timestamp: '14:30',
        reactions: [{ emoji: '🤝', count: 2 }]
    }
];

const ONLINE_MEMBERS = [
    { name: 'Théo Vernet', promo: 'A3', specialty: 'Informatique', status: 'En ligne' },
    { name: 'Inès Mansouri', promo: 'A3', specialty: 'Informatique', status: 'En révision CCTL' },
    { name: 'Alexandre Martin', promo: 'A3', specialty: 'Systèmes Embarqués', status: 'En ligne' },
    { name: 'Camille Dubois', promo: 'A3', specialty: 'BTP & Génie Civil', status: 'Sur Prosit PBL' },
    { name: 'Lucas Bernard', promo: 'A3', specialty: 'Généraliste', status: 'En ligne' }
];

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'chat' | 'feed' | 'resources'>('chat');
    const [selectedPromo, setSelectedPromo] = useState('A3');
    const [selectedChannel, setSelectedChannel] = useState('general');
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
    const [newMessageText, setNewMessageText] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // User profile state
    const [userName, setUserName] = useState('Élève-Ingénieur');
    const [userSpecialty, setUserSpecialty] = useState('Informatique');

    useEffect(() => {
        const saved = localStorage.getItem('cesi_agora_user_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.name) setUserName(parsed.name);
                if (parsed.specialty) setUserSpecialty(parsed.specialty);
                if (parsed.promo) setSelectedPromo(parsed.promo);
            } catch {}
        }

        const savedMessages = localStorage.getItem('cesi_promo_chat_messages');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            } catch {}
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedPromo, selectedChannel, activeTab]);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessageText.trim()) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            promo: selectedPromo,
            channel: selectedChannel,
            author: userName,
            authorInitial: userName.charAt(0).toUpperCase(),
            specialty: userSpecialty,
            campus: 'Campus CESI',
            content: newMessageText.trim(),
            timestamp: timeStr,
            isCurrentUser: true,
            reactions: []
        };

        const updated = [...messages, newMsg];
        setMessages(updated);
        setNewMessageText('');
        localStorage.setItem('cesi_promo_chat_messages', JSON.stringify(updated));
    };

    const handleReaction = (messageId: string, emoji: string) => {
        const updated = messages.map(msg => {
            if (msg.id !== messageId) return msg;

            const existingReactions = msg.reactions || [];
            const foundIndex = existingReactions.findIndex(r => r.emoji === emoji);

            if (foundIndex >= 0) {
                const r = existingReactions[foundIndex];
                if (r.userReacted) {
                    // Remove reaction
                    const newCount = r.count - 1;
                    if (newCount <= 0) {
                        return {
                            ...msg,
                            reactions: existingReactions.filter((_, idx) => idx !== foundIndex)
                        };
                    } else {
                        return {
                            ...msg,
                            reactions: existingReactions.map((item, idx) =>
                                idx === foundIndex ? { ...item, count: newCount, userReacted: false } : item
                            )
                        };
                    }
                } else {
                    return {
                        ...msg,
                        reactions: existingReactions.map((item, idx) =>
                            idx === foundIndex ? { ...item, count: item.count + 1, userReacted: true } : item
                        )
                    };
                }
            } else {
                return {
                    ...msg,
                    reactions: [...existingReactions, { emoji, count: 1, userReacted: true }]
                };
            }
        });

        setMessages(updated);
        localStorage.setItem('cesi_promo_chat_messages', JSON.stringify(updated));
    };

    const filteredMessages = messages.filter(
        m => m.promo === selectedPromo && m.channel === selectedChannel
    );

    const channelsList = [
        { id: 'general', label: 'général-promo', description: 'Échanges quotidiens & entraide générale' },
        { id: 'cctl-revisions', label: 'cctl-révisions', description: 'Questions, corrigés & révisions collectives' },
        { id: 'prosits-pbl', label: 'prosits-pbl', description: 'Cas d\'études, problématiques & plans d\'action' },
        { id: 'projets-soutenances', label: 'projets-soutenances', description: 'Livrables, DAT, retours de jurys' }
    ];

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-card border border-border text-[11px] font-mono text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
                        <span>ESPACE COMMUNAUTAIRE // 25 CAMPUS CESI</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif flex items-center gap-3 text-text-primary">
                        <Users className="w-8 h-8 text-accent-yellow" />
                        Chat Promo &amp; <span className="italic font-normal">Entraide CESI</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
                        Discutez en direct avec vos camarades de promo, échangez vos astuces pour les CCTLs et accédez aux ressources partagées.
                    </p>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-3">
                <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'chat'
                            ? 'bg-accent-yellow text-black font-bold shadow-xs'
                            : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                    }`}
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Tchat Direct de Promo</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('resources')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'resources'
                            ? 'bg-accent-yellow text-black font-bold shadow-xs'
                            : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                    }`}
                >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Fiches &amp; Cheat Sheets ({RESOURCES.length})</span>
                </button>
            </div>

            {/* TAB 1: PROMO LIVE CHAT */}
            {activeTab === 'chat' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
                    {/* Left: Promo & Channel Selectors */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Promo Selector Card */}
                        <div className="card-editorial p-4 rounded-3xl bg-surface-card border-border space-y-3">
                            <label className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-accent-yellow" />
                                Sélection de Promotion
                            </label>
                            <div className="grid grid-cols-5 gap-1">
                                {['A1', 'A2', 'A3', 'A4', 'A5'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setSelectedPromo(p)}
                                        className={`py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer text-center ${
                                            selectedPromo === p
                                                ? 'bg-accent-yellow text-black shadow-xs'
                                                : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-highlight border border-border/50'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Channels List */}
                        <div className="card-editorial p-4 rounded-3xl bg-surface-card border-border space-y-2">
                            <span className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono block px-2 pb-1">
                                Salons Promo {selectedPromo}
                            </span>
                            <div className="space-y-1">
                                {channelsList.map((ch) => (
                                    <button
                                        key={ch.id}
                                        type="button"
                                        onClick={() => setSelectedChannel(ch.id)}
                                        className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs transition-all cursor-pointer flex flex-col gap-0.5 ${
                                            selectedChannel === ch.id
                                                ? 'bg-accent-yellow/15 border border-accent-yellow/40 text-text-primary font-bold'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Hash className={`w-3.5 h-3.5 ${selectedChannel === ch.id ? 'text-accent-yellow' : 'text-text-muted'}`} />
                                            <span>{ch.label}</span>
                                        </div>
                                        <span className="text-[10px] text-text-muted pl-5 font-normal truncate">
                                            {ch.description}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Online Students Widget */}
                        <div className="card-editorial p-4 rounded-3xl bg-surface-card border-border space-y-3 hidden lg:block">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    En Ligne ({ONLINE_MEMBERS.length})
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                {ONLINE_MEMBERS.map((m, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-surface-highlight border border-border flex items-center justify-center font-bold text-[10px] text-accent-yellow shrink-0">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div className="truncate">
                                                <p className="font-semibold text-text-primary truncate">{m.name}</p>
                                                <p className="text-[10px] text-text-muted font-mono truncate">{m.specialty}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Live Chat Room */}
                    <div className="lg:col-span-3 card-editorial rounded-3xl bg-surface-card border-border shadow-xl flex flex-col h-[650px] overflow-hidden">
                        {/* Chat Room Header */}
                        <div className="p-4 sm:p-5 border-b border-border bg-surface/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-accent-yellow/15 border border-accent-yellow/30 text-accent-yellow flex items-center justify-center font-bold">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm sm:text-base text-text-primary">
                                            #{channelsList.find(c => c.id === selectedChannel)?.label}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-accent-yellow text-black font-bold font-mono text-[10px]">
                                            Promo {selectedPromo}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-secondary">
                                        {channelsList.find(c => c.id === selectedChannel)?.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Direct</span>
                            </div>
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                            {filteredMessages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-text-muted">
                                    <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-xl">
                                        💬
                                    </div>
                                    <p className="text-xs sm:text-sm">
                                        Aucun message dans ce salon pour le moment.<br />
                                        Soyez le premier à engager la discussion avec la promo {selectedPromo} !
                                    </p>
                                </div>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 group ${msg.isCurrentUser ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                                            msg.isCurrentUser
                                                ? 'bg-accent-yellow text-black border-accent-yellow'
                                                : 'bg-surface text-accent-yellow border-border'
                                        }`}>
                                            {msg.authorInitial}
                                        </div>

                                        <div className={`space-y-1.5 max-w-[85%] sm:max-w-[75%] ${msg.isCurrentUser ? 'items-end text-right' : ''}`}>
                                            <div className={`flex items-center gap-2 text-xs ${msg.isCurrentUser ? 'justify-end' : ''}`}>
                                                <span className="font-bold text-text-primary">{msg.author}</span>
                                                <span className="text-[10px] font-mono text-text-muted">
                                                    {msg.specialty} • {msg.timestamp}
                                                </span>
                                            </div>

                                            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                                msg.isCurrentUser
                                                    ? 'bg-accent-yellow text-black font-medium rounded-tr-none shadow-sm'
                                                    : 'bg-surface border border-border text-text-primary rounded-tl-none'
                                            }`}>
                                                {msg.content}
                                            </div>

                                            {/* Reactions Row */}
                                            <div className={`flex flex-wrap items-center gap-1.5 pt-0.5 ${msg.isCurrentUser ? 'justify-end' : ''}`}>
                                                {msg.reactions && msg.reactions.map((r, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleReaction(msg.id, r.emoji)}
                                                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono flex items-center gap-1 border transition-all cursor-pointer ${
                                                            r.userReacted
                                                                ? 'bg-accent-yellow/20 border-accent-yellow/50 text-text-primary font-bold'
                                                                : 'bg-surface border-border text-text-secondary hover:bg-surface-highlight'
                                                        }`}
                                                    >
                                                        <span>{r.emoji}</span>
                                                        <span>{r.count}</span>
                                                    </button>
                                                ))}

                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                    {['👍', '💡', '🔥'].map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            type="button"
                                                            onClick={() => handleReaction(msg.id, emoji)}
                                                            className="p-1 rounded-lg hover:bg-surface text-xs cursor-pointer"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Message Input Box */}
                        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-border bg-surface/50 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {['💡', '👍', '🚀'].map((em) => (
                                    <button
                                        key={em}
                                        type="button"
                                        onClick={() => setNewMessageText(prev => prev + ' ' + em)}
                                        className="p-2 rounded-xl hover:bg-surface text-xs cursor-pointer transition-colors"
                                        title={`Insérer ${em}`}
                                    >
                                        {em}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                placeholder={`Envoyer un message sur #${channelsList.find(c => c.id === selectedChannel)?.label} (Promo ${selectedPromo})...`}
                                className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 placeholder:text-text-muted"
                            />

                            <button
                                type="submit"
                                disabled={!newMessageText.trim()}
                                className="p-2.5 rounded-xl bg-accent-yellow text-black font-bold disabled:opacity-40 hover:brightness-105 transition-all shadow-xs cursor-pointer shrink-0"
                                aria-label="Envoyer"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB 2: RESOURCES & MEMO SHEETS */}
            {activeTab === 'resources' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-normal font-serif text-text-primary">
                                Banque de Fiches &amp; Ressources Indispensables
                            </h2>
                            <p className="text-xs text-text-secondary">
                                Téléchargez les fiches mémos et guides partagés par les majors de promo du CESI.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {RESOURCES.map((r) => (
                            <div
                                key={r.id}
                                className="card-editorial rounded-3xl p-5 border border-border/80 hover:border-accent-yellow/40 transition-all flex flex-col justify-between space-y-4 shadow-md bg-surface-card"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider bg-accent-yellow text-black px-2 py-0.5 rounded-md">
                                            {r.category}
                                        </span>
                                        <span className="text-[11px] font-semibold text-text-secondary font-mono">
                                            {r.fileType} • {r.fileSize}
                                        </span>
                                    </div>

                                    <h3 className="font-serif font-normal text-base text-text-primary line-clamp-2">{r.title}</h3>
                                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{r.description}</p>
                                </div>

                                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                                    <span className="text-[11px] text-text-secondary font-mono">
                                        {r.author}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => alert(`Téléchargement de "${r.title}" lancé !`)}
                                        className="border-border text-xs h-8 px-2.5 font-semibold"
                                    >
                                        <Download className="w-3.5 h-3.5 mr-1 text-accent-yellow" />
                                        Télécharger
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
