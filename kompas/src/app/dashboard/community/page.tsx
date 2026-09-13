'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Users,
    MessageSquare,
    Send,
    Hash,
    Building2,
    Globe2,
    UserCheck,
    Loader2,
    Lock,
    Search,
    Plus,
    ShieldCheck,
    X,
    FolderPlus,
    Trash2,
    Edit3,
    User as UserIcon,
    ArrowUpRight,
    Tv
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { DEFAULT_CHANNELS, ChatChannel, ChatMessage } from '@/types/chat';
import { isAdminUser, isAdminEmail, checkIsAdminClient } from '@/lib/admin';

interface StudentContact {
    id: string;
    name: string;
    promo: string;
    specialty: string;
    campus: string;
    status: string;
    avatarInitial: string;
}

export default function CommunityPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Discussion scope: 'national' (all campuses) | 'campus' (user's campus) | 'direct' (1-on-1 MP)
    const [scope, setScope] = useState<'national' | 'campus' | 'direct'>('national');
    const [selectedPromo, setSelectedPromo] = useState<string>('A3');
    const [selectedChannel, setSelectedChannel] = useState<string>('general');

    // Channels state (Default #general + Custom modular channels)
    const [channels, setChannels] = useState<ChatChannel[]>(DEFAULT_CHANNELS);
    const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDesc, setNewChannelDesc] = useState('');
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);

    // Direct Messages state
    const [selectedContact, setSelectedContact] = useState<StudentContact | null>(null);
    const [contactSearchQuery, setContactSearchQuery] = useState('');

    // User action modal (View Profile vs Send DM)
    const [userActionModalContact, setUserActionModalContact] = useState<StudentContact | null>(null);

    // Messages state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [newMessageText, setNewMessageText] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Authenticated user state
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [userName, setUserName] = useState('Élève-Ingénieur');
    const [userSpecialty, setUserSpecialty] = useState('Informatique');
    const [userCampus, setUserCampus] = useState('Nanterre');
    const [isAdmin, setIsAdmin] = useState(false);

    // Edit message modal/state
    const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
    const [editMessageContent, setEditMessageContent] = useState('');
    const [isUpdatingMessage, setIsUpdatingMessage] = useState(false);

    // Load actual user profile from Supabase & LocalStorage
    useEffect(() => {
        const loadUserProfile = async () => {
            let dynamicName = '';
            let dynamicPromo = 'A3';
            let dynamicSpecialty = 'Informatique';
            let dynamicCampus = 'Nanterre';
            let dynamicId = '';
            let adminResolved = false;

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    dynamicId = user.id;
                    if (isAdminUser(user) || isAdminEmail(user.email)) {
                        adminResolved = true;
                    }
                    const meta = user.user_metadata;
                    if (meta?.name) {
                        dynamicName = meta.name;
                    } else if (meta?.firstname && meta?.lastname) {
                        dynamicName = `${meta.firstname} ${meta.lastname}`.trim();
                    } else if (meta?.full_name) {
                        dynamicName = meta.full_name;
                    } else if (user.email) {
                        const parts = user.email.split('@')[0].split('.');
                        if (parts.length >= 2) {
                            const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                            const last = parts[1].toUpperCase();
                            dynamicName = `${first} ${last}`;
                        } else {
                            dynamicName = user.email.split('@')[0];
                        }
                    }

                    if (checkIsAdminClient(user)) adminResolved = true;
                    if (meta?.promo) dynamicPromo = meta.promo;
                    if (meta?.specialty) dynamicSpecialty = meta.specialty;
                    if (meta?.campus) dynamicCampus = meta.campus;
                }
            } catch (e) {
                console.error('Error fetching user in Community:', e);
            }

            if (checkIsAdminClient()) adminResolved = true;

            const savedProfile = localStorage.getItem('kompas_user_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.name) dynamicName = parsed.name;
                    if (parsed.promo) dynamicPromo = parsed.promo;
                    if (parsed.specialty) dynamicSpecialty = parsed.specialty;
                    if (parsed.campus) dynamicCampus = parsed.campus;
                    if (parsed.email && isAdminEmail(parsed.email)) adminResolved = true;
                    if (parsed.role === 'admin' || parsed.isAdmin) adminResolved = true;
                } catch {}
            }

            if (dynamicName) setUserName(dynamicName);
            if (dynamicPromo) setSelectedPromo(dynamicPromo);
            if (dynamicSpecialty) setUserSpecialty(dynamicSpecialty);
            if (dynamicCampus) setUserCampus(dynamicCampus);
            if (dynamicId) setCurrentUserId(dynamicId);
            setIsAdmin(adminResolved);
        };

        loadUserProfile();
    }, [supabase]);

    const handleDeleteMessage = async (messageId: string) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;

        setMessages(prev => prev.filter(m => m.id !== messageId));
        try {
            await fetch(`/api/chat/messages?id=${encodeURIComponent(messageId)}`, {
                method: 'DELETE'
            });
        } catch (e) {
            console.error('Failed to delete message:', e);
        }
    };

    const handleStartEditMessage = (msg: ChatMessage) => {
        setEditingMessage(msg);
        setEditMessageContent(msg.content);
    };

    const handleSaveEditMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMessage || !editMessageContent.trim() || isUpdatingMessage) return;

        setIsUpdatingMessage(true);
        try {
            const res = await fetch('/api/chat/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingMessage.id,
                    content: editMessageContent.trim()
                })
            });
            const data = await res.json();
            if (data.success && data.message) {
                setMessages(prev => prev.map(m => m.id === editingMessage.id ? data.message : m));
            } else {
                setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, content: editMessageContent.trim() } : m));
            }
            setEditingMessage(null);
        } catch (e) {
            console.error('Failed to update message:', e);
        } finally {
            setIsUpdatingMessage(false);
        }
    };

    // Handle deep link into DM via ?dm=[id or name]
    useEffect(() => {
        const dmParam = searchParams.get('dm');
        if (dmParam) {
            const cleanName = decodeURIComponent(dmParam);
            const dynamicContact: StudentContact = {
                id: dmParam,
                name: cleanName,
                promo: selectedPromo,
                specialty: 'Cycle Ingénieur FISE',
                campus: 'CESI Campus',
                status: 'En ligne',
                avatarInitial: cleanName.charAt(0).toUpperCase() || 'E'
            };
            setSelectedContact(dynamicContact);
            setScope('direct');
        }
    }, [searchParams, selectedPromo]);

    const handleOpenUserActions = (userIdentifier: { id?: string; name: string; campus?: string; promo?: string; specialty?: string }) => {
        setUserActionModalContact({
            id: userIdentifier.id || userIdentifier.name,
            name: userIdentifier.name,
            promo: userIdentifier.promo || selectedPromo,
            specialty: userIdentifier.specialty || 'Cycle Ingénieur FISE',
            campus: userIdentifier.campus || userCampus,
            status: 'En ligne',
            avatarInitial: userIdentifier.name.charAt(0).toUpperCase() || 'E'
        });
    };

    // Fetch channels for the active scope & promo
    const fetchChannels = useCallback(async () => {
        if (scope === 'direct') return;
        try {
            const params = new URLSearchParams();
            params.set('scope', scope);
            params.set('promo', selectedPromo);
            if (scope === 'campus') {
                params.set('campus', userCampus);
            }

            const res = await fetch(`/api/chat/channels?${params.toString()}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.channels)) {
                setChannels(data.channels);
                if (!data.channels.some((c: ChatChannel) => c.id === selectedChannel)) {
                    setSelectedChannel('general');
                }
            }
        } catch (e) {
            console.error('Failed to load channels:', e);
        }
    }, [scope, selectedPromo, userCampus, selectedChannel]);

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    // Fetch messages from backend API
    const fetchMessages = useCallback(async (quiet = false) => {
        if (!quiet) setIsLoadingMessages(true);
        try {
            const params = new URLSearchParams();
            params.set('scope', scope);

            if (scope === 'direct') {
                if (selectedContact) {
                    params.set('recipientName', selectedContact.name);
                }
                params.set('currentUserName', userName);
            } else {
                params.set('promo', selectedPromo);
                params.set('channel', selectedChannel);
                if (scope === 'campus') {
                    params.set('campus', userCampus);
                }
            }

            const res = await fetch(`/api/chat/messages?${params.toString()}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
        } catch (e) {
            console.error('Failed to load chat messages:', e);
        } finally {
            if (!quiet) setIsLoadingMessages(false);
        }
    }, [scope, selectedPromo, userCampus, selectedChannel, selectedContact, userName]);

    useEffect(() => {
        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages(true);
        }, 4000);

        return () => clearInterval(interval);
    }, [fetchMessages]);

    const scrollToBottomInsideContainer = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessageText.trim() || isSending) return;

        const textToSend = newMessageText.trim();
        setNewMessageText('');
        setIsSending(true);

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const msgCampus = scope === 'campus' ? userCampus : (scope === 'national' ? `CESI ${userCampus}` : userCampus);

        // Optimistic message
        const optimisticMsg: ChatMessage = {
            id: `temp-${Date.now()}`,
            scope,
            promo: selectedPromo,
            channel: scope === 'direct' ? 'direct' : selectedChannel,
            campus: msgCampus,
            author: userName,
            authorInitial: userName.charAt(0).toUpperCase() || 'E',
            authorId: currentUserId,
            recipientName: scope === 'direct' ? (selectedContact?.name || undefined) : undefined,
            recipientId: scope === 'direct' ? (selectedContact?.id || undefined) : undefined,
            specialty: userSpecialty,
            content: textToSend,
            timestamp: timeStr,
            createdAt: now.toISOString(),
            reactions: []
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setTimeout(scrollToBottomInsideContainer, 50);

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scope,
                    promo: selectedPromo,
                    campus: msgCampus,
                    channel: scope === 'direct' ? 'direct' : selectedChannel,
                    recipientName: scope === 'direct' ? (selectedContact?.name || undefined) : undefined,
                    recipientId: scope === 'direct' ? (selectedContact?.id || undefined) : undefined,
                    content: textToSend,
                    author: userName,
                    specialty: userSpecialty
                })
            });

            const data = await res.json();
            if (data.success && data.message) {
                setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data.message : m));
            } else {
                fetchMessages(true);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            fetchMessages(true);
        } finally {
            setIsSending(false);
            setTimeout(scrollToBottomInsideContainer, 80);
        }
    };

    const handleCreateCustomChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim() || isCreatingChannel) return;

        setIsCreatingChannel(true);
        try {
            const res = await fetch('/api/chat/channels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: newChannelName.trim(),
                    description: newChannelDesc.trim() || 'Salon créé par un étudiant',
                    scope,
                    promo: selectedPromo,
                    campus: scope === 'campus' ? userCampus : undefined
                })
            });

            const data = await res.json();
            if (data.success && data.channel) {
                setChannels(prev => [...prev, data.channel]);
                setSelectedChannel(data.channel.id);
                setIsCreateChannelModalOpen(false);
                setNewChannelName('');
                setNewChannelDesc('');
            }
        } catch (e) {
            console.error('Failed to create channel:', e);
        } finally {
            setIsCreatingChannel(false);
        }
    };

    const handleDeleteChannel = async (channelId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (channelId === 'general') return;

        setChannels(prev => prev.filter(c => c.id !== channelId));
        if (selectedChannel === channelId) {
            setSelectedChannel('general');
        }

        try {
            await fetch(`/api/chat/channels?id=${encodeURIComponent(channelId)}`, {
                method: 'DELETE'
            });
        } catch (err) {
            console.error('Error deleting channel:', err);
        }
    };

    const handleReaction = async (messageId: string, emoji: string) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id !== messageId) return msg;

            const existingReactions = msg.reactions || [];
            const rIdx = existingReactions.findIndex(r => r.emoji === emoji);

            if (rIdx >= 0) {
                const r = existingReactions[rIdx];
                const hasReacted = r.users?.includes(currentUserId || 'self');
                let newUsers = hasReacted
                    ? r.users.filter(u => u !== (currentUserId || 'self'))
                    : [...(r.users || []), currentUserId || 'self'];

                if (newUsers.length === 0) {
                    return {
                        ...msg,
                        reactions: existingReactions.filter((_, idx) => idx !== rIdx)
                    };
                } else {
                    return {
                        ...msg,
                        reactions: existingReactions.map((item, idx) =>
                            idx === rIdx ? { ...item, count: newUsers.length, users: newUsers } : item
                        )
                    };
                }
            } else {
                return {
                    ...msg,
                    reactions: [...existingReactions, { emoji, count: 1, users: [currentUserId || 'self'] }]
                };
            }
        }));

        try {
            await fetch('/api/chat/reactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId,
                    emoji,
                    userId: currentUserId || 'self'
                })
            });
        } catch (e) {
            console.error('Reaction error:', e);
        }
    };

    const isCurrentAuthor = (msg: ChatMessage) => {
        if (currentUserId && msg.authorId) {
            return msg.authorId === currentUserId;
        }
        return msg.author.toLowerCase() === userName.toLowerCase();
    };

    const currentChannelMeta = channels.find(c => c.id === selectedChannel) || channels[0] || DEFAULT_CHANNELS[0];

    const activeContacts: StudentContact[] = useMemo(() => {
        const map = new Map<string, StudentContact>();
        messages.forEach(m => {
            if (m.author && m.author !== userName && !map.has(m.author)) {
                map.set(m.author, {
                    id: m.authorId || m.author,
                    name: m.author,
                    promo: m.promo || selectedPromo,
                    specialty: m.specialty || 'Cycle Ingénieur FISE',
                    campus: m.campus || 'CESI',
                    status: 'En ligne',
                    avatarInitial: m.authorInitial || m.author.charAt(0).toUpperCase() || 'E'
                });
            }
        });
        return Array.from(map.values());
    }, [messages, userName, selectedPromo]);

    const currentScopeHeader = useMemo(() => {
        if (scope === 'national') return `Promo ${selectedPromo} • Tous les campus CESI`;
        if (scope === 'campus') return `Promo ${selectedPromo} • Campus ${userCampus}`;
        return selectedContact ? `Message Privé avec ${selectedContact.name}` : 'Messages Privés';
    }, [scope, selectedPromo, userCampus, selectedContact]);

    const filteredContacts = useMemo(() => {
        if (!contactSearchQuery.trim()) return activeContacts;
        const q = contactSearchQuery.toLowerCase();
        return activeContacts.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.campus.toLowerCase().includes(q) ||
            c.specialty.toLowerCase().includes(q) ||
            c.promo.toLowerCase().includes(q)
        );
    }, [contactSearchQuery, activeContacts]);

    const startDirectMessageWith = (contact: StudentContact) => {
        setSelectedContact(contact);
        setScope('direct');
    };

    return (
        <div className="space-y-6 pb-16">
            {/* Unified Compact Header Card */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden space-y-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

                {/* Top Row: Title + Integrated Student Disclaimer */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Chat Promo &amp; <span className="italic font-normal">Entraide CESI</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary font-normal">
                            Espace collaboratif par promotion : échangez avec toute la France, avec votre campus local ({userCampus}) ou en direct.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span className="font-mono text-[11px]">
                            100% Étudiant • Accès @viacesi.fr • Non surveillé
                        </span>
                    </div>
                </div>

                {/* Bottom Row: Integrated Filter & Scope Toolbar */}
                <div className="pt-4 border-t border-border/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between relative z-10">
                    {/* Left: Promo Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-text-secondary uppercase">Promo :</span>
                        <div className="flex items-center gap-1">
                            {['A1', 'A2', 'A3', 'A4', 'A5'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setSelectedPromo(p)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                                        selectedPromo === p
                                            ? 'bg-accent-yellow text-black shadow-xs'
                                            : 'bg-surface text-text-secondary hover:text-text-primary border border-border/50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Scope Switcher */}
                    <div className="flex items-center gap-1.5 p-1 bg-surface rounded-2xl border border-border/60 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setScope('national')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                scope === 'national'
                                    ? 'bg-text-primary text-surface font-bold shadow-xs'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                            }`}
                            title={`Discuter avec les étudiants de promo ${selectedPromo} sur toute la France`}
                        >
                            <Globe2 className="w-3.5 h-3.5" />
                            <span>National (Tous Campus)</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setScope('campus')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                scope === 'campus'
                                    ? 'bg-text-primary text-surface font-bold shadow-xs'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                            }`}
                            title={`Discuter avec les étudiants de promo ${selectedPromo} du campus de ${userCampus}`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Campus {userCampus}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setScope('direct')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                scope === 'direct'
                                    ? 'bg-text-primary text-surface font-bold shadow-xs'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-highlight'
                            }`}
                            title="Discussions privées individuelles en direct"
                        >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Messages Privés</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Chat Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {scope === 'direct' ? (
                        /* Direct Messages Contacts Sidebar */
                        <div className="card-editorial p-4 rounded-3xl bg-surface-card border-border space-y-3">
                            <div className="flex items-center justify-between pb-1">
                                <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider font-mono">
                                    Camarades &amp; Contacts
                                </span>
                            </div>

                            {/* Contact Search Input */}
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={contactSearchQuery}
                                    onChange={(e) => setContactSearchQuery(e.target.value)}
                                    placeholder="Rechercher un camarade..."
                                    className="w-full bg-surface border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-yellow/40"
                                />
                            </div>

                            {/* Contacts List */}
                            <div className="space-y-1 max-h-[500px] overflow-y-auto pt-1">
                                {filteredContacts.length === 0 ? (
                                    <p className="text-xs text-text-muted italic p-3 text-center">Aucun contact trouvé</p>
                                ) : (
                                    filteredContacts.map((contact) => (
                                        <button
                                            key={contact.id}
                                            type="button"
                                            onClick={() => setSelectedContact(contact)}
                                            className={`w-full text-left p-2.5 rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                                selectedContact?.id === contact.id
                                                    ? 'bg-accent-yellow/15 border border-accent-yellow/40 text-text-primary font-bold shadow-xs'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                                    selectedContact?.id === contact.id
                                                        ? 'bg-accent-yellow text-black'
                                                        : 'bg-surface-highlight text-text-primary border border-border'
                                                }`}>
                                                    {contact.avatarInitial}
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-semibold text-text-primary truncate">{contact.name}</p>
                                                    <p className="text-[10px] text-text-muted truncate">{contact.campus} • {contact.promo}</p>
                                                </div>
                                            </div>
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title={contact.status} />
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Public Promo Scope Channels Sidebar */
                        <>
                            <div className="card-editorial p-4 rounded-3xl bg-surface-card border-border space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                                    <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider font-mono truncate">
                                        Salons Promo {selectedPromo}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateChannelModalOpen(true)}
                                        className="text-[11px] text-accent-yellow hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                                        title="Créer un salon textuel personnalisé pour ce groupe"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Créer</span>
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    {channels.map((ch) => (
                                        <div
                                            key={ch.id}
                                            onClick={() => setSelectedChannel(ch.id)}
                                            className={`group w-full text-left px-3 py-2 rounded-2xl text-xs transition-all cursor-pointer flex flex-col gap-0.5 ${
                                                selectedChannel === ch.id
                                                    ? 'bg-accent-yellow/15 border border-accent-yellow/40 text-text-primary font-bold shadow-xs'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Hash className={`w-3.5 h-3.5 shrink-0 ${selectedChannel === ch.id ? 'text-accent-yellow' : 'text-text-muted'}`} />
                                                    <span className="truncate">{ch.label}</span>
                                                </div>
                                                {ch.id !== 'general' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteChannel(ch.id, e)}
                                                        className="p-1 rounded-lg text-text-muted hover:text-red-400 hover:bg-surface opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                                        title="Supprimer ce salon"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                            {ch.description && (
                                                <span className="text-[10px] text-text-muted pl-5 font-normal truncate">
                                                    {ch.description}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Online Members List */}
                            <div className="card-editorial p-4 rounded-3xl bg-surface-card border-border space-y-3 hidden lg:block">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono flex items-center gap-1.5">
                                        <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        Membres Actifs ({activeContacts.length})
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>

                                <div className="space-y-2">
                                    {activeContacts.length === 0 ? (
                                        <p className="text-xs text-text-muted italic py-1">Aucun participant pour le moment</p>
                                    ) : (
                                        activeContacts.map((m) => (
                                            <div
                                                key={m.id}
                                                onClick={() => handleOpenUserActions(m)}
                                                className="flex items-center justify-between text-xs py-1.5 px-2 rounded-xl hover:bg-surface transition-colors cursor-pointer group"
                                                title={`Voir le profil ou discuter avec ${m.name}`}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-6 h-6 rounded-full bg-surface-highlight border border-border flex items-center justify-center font-bold text-[10px] text-accent-yellow shrink-0">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <div className="truncate">
                                                        <p className="font-semibold text-text-primary truncate group-hover:text-accent-yellow transition-colors">{m.name}</p>
                                                        <p className="text-[10px] text-text-muted font-mono truncate">{m.campus} • {m.promo}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-mono text-accent-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Profil / MP &rarr;
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Active Chat Room */}
                <div className="lg:col-span-3 card-editorial rounded-3xl bg-surface-card border-border shadow-xl flex flex-col h-[650px] overflow-hidden">
                    {/* Chat Room Header */}
                    <div className="p-4 sm:p-5 border-b border-border bg-surface/50 flex flex-wrap items-center justify-between gap-3">
                        {scope === 'direct' ? (
                            selectedContact ? (
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenUserActions(selectedContact)}
                                            className="w-10 h-10 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform cursor-pointer"
                                            title={`Voir le profil de ${selectedContact.name}`}
                                        >
                                            {selectedContact.avatarInitial}
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenUserActions(selectedContact)}
                                                    className="font-bold text-sm sm:text-base text-text-primary hover:text-accent-yellow transition-colors cursor-pointer text-left"
                                                >
                                                    {selectedContact.name}
                                                </button>
                                                <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary font-mono text-[10px]">
                                                    CESI {selectedContact.campus} • {selectedContact.promo}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span>{selectedContact.status} — {selectedContact.specialty}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/dashboard/profile/${encodeURIComponent(selectedContact.id || selectedContact.name)}`}
                                        className="px-3.5 py-1.5 rounded-xl bg-surface border border-border hover:border-accent-yellow/50 text-xs font-semibold text-text-primary hover:text-accent-yellow transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Voir son profil</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-yellow/15 border border-accent-yellow/30 text-accent-yellow flex items-center justify-center font-bold">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-text-primary">Messages Privés</h3>
                                        <p className="text-xs text-text-secondary">Sélectionnez un membre dans la liste ou démarrez une conversation</p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-accent-yellow/15 border border-accent-yellow/30 text-accent-yellow flex items-center justify-center font-bold">
                                    <Hash className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm sm:text-base text-text-primary">
                                            #{currentChannelMeta.label}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-full bg-accent-yellow text-black font-bold font-mono text-[10px]">
                                            {currentScopeHeader}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-secondary">
                                        {currentChannelMeta.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages Stream */}
                    <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                        {isLoadingMessages ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-accent-yellow animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-text-muted">
                                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-xl">
                                    {scope === 'direct' ? '🔒' : '💬'}
                                </div>
                                <p className="text-xs sm:text-sm">
                                    {scope === 'direct' ? (
                                        selectedContact ? (
                                            <>Aucun message privé échangé avec {selectedContact.name} pour le moment.<br />Envoyez un premier message pour démarrer la discussion !</>
                                        ) : (
                                            <>Sélectionnez un membre dans la liste pour démarrer une conversation privée.</>
                                        )
                                    ) : (
                                        <>Aucun message dans #{currentChannelMeta.label} pour {currentScopeHeader}.<br />Soyez le premier à lancer la discussion !</>
                                    )}
                                </p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMine = isCurrentAuthor(msg);
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 group ${isMine ? 'flex-row-reverse' : ''}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => !isMine && handleOpenUserActions({ id: msg.authorId, name: msg.author, campus: msg.campus, specialty: msg.specialty })}
                                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 border transition-all ${
                                                isMine
                                                    ? 'bg-accent-yellow text-black border-accent-yellow'
                                                    : 'bg-surface text-accent-yellow border-border hover:scale-105 hover:border-accent-yellow cursor-pointer'
                                            }`}
                                            title={isMine ? 'Vous' : `Options pour ${msg.author}`}
                                        >
                                            {msg.authorInitial || msg.author.charAt(0).toUpperCase()}
                                        </button>

                                        <div className={`space-y-1.5 max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end text-right' : ''}`}>
                                            <div className={`flex items-center gap-2 text-xs ${isMine ? 'justify-end' : ''}`}>
                                                {isMine ? (
                                                    <span className="font-bold text-text-primary flex items-center gap-1">
                                                        <span>{msg.author}</span>
                                                        <span className="text-[10px] font-normal text-text-muted">(Vous)</span>
                                                        {isAdmin && (
                                                            <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">
                                                                👑 ADMIN
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenUserActions({ id: msg.authorId, name: msg.author, campus: msg.campus, specialty: msg.specialty })}
                                                            className="font-bold text-text-primary hover:text-accent-yellow hover:underline transition-colors cursor-pointer text-left"
                                                            title={`Voir les options pour ${msg.author}`}
                                                        >
                                                            {msg.author}
                                                        </button>
                                                        {(isAdminEmail(msg.author) || msg.author.toLowerCase().includes('admin') || msg.author.toLowerCase().includes('paul.thomas')) && (
                                                            <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">
                                                                👑 ADMIN
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <span className="text-[10px] font-mono text-text-muted">
                                                    {isMine ? msg.timestamp : `${msg.campus || 'CESI'} • ${msg.timestamp}`}
                                                </span>
                                            </div>

                                            <div className="relative group/bubble">
                                                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                                    isMine
                                                        ? 'bg-accent-yellow text-black font-medium rounded-tr-none shadow-sm'
                                                        : 'bg-surface border border-border text-text-primary rounded-tl-none'
                                                }`}>
                                                    {msg.content}
                                                </div>

                                                {/* Admin or Author Quick Controls */}
                                                {(isMine || isAdmin) && (
                                                    <div className={`absolute top-1 ${isMine ? 'left-[-54px]' : 'right-[-54px]'} opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 bg-surface/90 border border-border px-1.5 py-0.5 rounded-xl shadow-md`}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartEditMessage(msg)}
                                                            className="p-1 text-text-muted hover:text-accent-yellow hover:bg-surface-highlight rounded transition-colors"
                                                            title="Modifier le message"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteMessage(msg.id)}
                                                            className="p-1 text-text-muted hover:text-red-400 hover:bg-surface-highlight rounded transition-colors"
                                                            title="Supprimer le message"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Reactions Row */}
                                            <div className={`flex flex-wrap items-center gap-1.5 pt-0.5 ${isMine ? 'justify-end' : ''}`}>
                                                {msg.reactions && msg.reactions.map((r, i) => {
                                                    const userReacted = r.users?.includes(currentUserId || 'self');
                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => handleReaction(msg.id, r.emoji)}
                                                            className={`px-2 py-0.5 rounded-full text-[11px] font-mono flex items-center gap-1 border transition-all cursor-pointer ${
                                                                userReacted
                                                                    ? 'bg-accent-yellow/20 border-accent-yellow/50 text-text-primary font-bold'
                                                                    : 'bg-surface border-border text-text-secondary hover:bg-surface-highlight'
                                                            }`}
                                                        >
                                                            <span>{r.emoji}</span>
                                                            <span>{r.count}</span>
                                                        </button>
                                                    );
                                                })}

                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                    {['👍', '💡', '🔥', '🚀', '🙌'].map((emoji) => (
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
                                );
                            })
                        )}
                    </div>

                    {/* Message Input Form */}
                    <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-border bg-surface/50 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {['💡', '👍', '🚀', '🔥', '🙌'].map((em) => (
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
                            placeholder={
                                scope === 'direct'
                                    ? `Envoyer un message privé ${selectedContact ? 'à ' + selectedContact.name : ''}...`
                                    : `Envoyer un message sur #${currentChannelMeta.label} (${currentScopeHeader})...`
                            }
                            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 placeholder:text-text-muted"
                        />

                        <button
                            type="submit"
                            disabled={!newMessageText.trim() || isSending}
                            className="p-2.5 rounded-xl bg-accent-yellow text-black font-bold disabled:opacity-40 hover:brightness-105 transition-all shadow-xs cursor-pointer shrink-0"
                            aria-label="Envoyer"
                        >
                            {isSending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal: Create Custom Channel */}
            {isCreateChannelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="card-editorial w-full max-w-md p-6 rounded-3xl bg-surface-card border-border shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <div className="flex items-center gap-2">
                                <FolderPlus className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    Créer un nouveau salon
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateChannelModalOpen(false)}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCustomChannel} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold text-text-secondary">
                                    Nom du salon (ex: hackathon-ia, projet-web, groupe-td2)
                                </label>
                                <div className="relative">
                                    <Hash className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        required
                                        value={newChannelName}
                                        onChange={(e) => setNewChannelName(e.target.value)}
                                        placeholder="nom-du-salon"
                                        className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold text-text-secondary">
                                    Description / Objectif (facultatif)
                                </label>
                                <input
                                    type="text"
                                    value={newChannelDesc}
                                    onChange={(e) => setNewChannelDesc(e.target.value)}
                                    placeholder="Ex: Échange de code, organisation de réunions..."
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div className="p-3 rounded-2xl bg-surface border border-border/60 text-[11px] text-text-muted font-mono">
                                Portée : {scope === 'national' ? `National (Promo ${selectedPromo})` : `Campus ${userCampus} (Promo ${selectedPromo})`}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateChannelModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newChannelName.trim() || isCreatingChannel}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isCreatingChannel ? 'Création...' : 'Créer le salon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Student Actions (View Profile vs Send DM) */}
            {userActionModalContact && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setUserActionModalContact(null)}
                >
                    <div
                        className="w-full max-w-md card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background millimeter */}
                        <div className="absolute inset-0 bg-millimeter opacity-20 pointer-events-none" />

                        {/* Top Row: User Summary + Close button */}
                        <div className="flex items-start justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-3.5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-orange to-accent-yellow flex items-center justify-center font-bold text-2xl text-black shadow-lg shadow-accent-yellow/10 shrink-0">
                                    {userActionModalContact.avatarInitial}
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-serif font-bold text-xl text-text-primary">
                                        {userActionModalContact.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
                                        <span className="font-mono">CESI {userActionModalContact.campus}</span>
                                        <span>•</span>
                                        <span className="font-mono font-bold text-accent-yellow">{userActionModalContact.promo}</span>
                                    </div>
                                    <p className="text-[11px] text-text-muted">
                                        {userActionModalContact.specialty}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setUserActionModalContact(null)}
                                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status chip */}
                        <div className="p-3 rounded-2xl bg-surface border border-border/70 flex items-center justify-between text-xs relative z-10">
                            <span className="text-text-secondary">Statut académique :</span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {userActionModalContact.status || 'En ligne'}
                            </span>
                        </div>

                        {/* Action Buttons: View Profile vs Send DM vs Live Battle */}
                        <div className="space-y-2.5 pt-1 relative z-10">
                            <button
                                type="button"
                                onClick={() => {
                                    const targetId = userActionModalContact.id || userActionModalContact.name;
                                    setUserActionModalContact(null);
                                    router.push(`/dashboard/profile/${encodeURIComponent(targetId)}`);
                                }}
                                className="w-full py-3.5 px-4 rounded-2xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span>Voir son profil complet</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    startDirectMessageWith(userActionModalContact);
                                    setUserActionModalContact(null);
                                }}
                                className="w-full py-3.5 px-4 rounded-2xl bg-surface border border-border text-text-primary font-semibold text-xs hover:bg-surface-highlight hover:border-accent-yellow/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <MessageSquare className="w-4 h-4 text-accent-yellow" />
                                <span>Lui envoyer un message privé</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setUserActionModalContact(null);
                                    router.push('/live');
                                }}
                                className="w-full py-3 px-4 rounded-2xl bg-surface-card border border-border/70 text-text-secondary font-medium text-xs hover:text-text-primary hover:bg-surface transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Tv className="w-3.5 h-3.5 text-accent-yellow" />
                                <span>Inviter en session CCTL Battle Live</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Edit Message */}
            {editingMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg card-editorial p-6 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    Modifier le message
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingMessage(null)}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEditMessage} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono font-bold text-text-secondary">
                                    Contenu du message (Auteur : {editingMessage.author})
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={editMessageContent}
                                    onChange={(e) => setEditMessageContent(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingMessage(null)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!editMessageContent.trim() || isUpdatingMessage}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isUpdatingMessage ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

