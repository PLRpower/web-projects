'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    FileDown,
    Search,
    Download,
    BookOpen,
    Filter,
    Sparkles,
    Check,
    FolderGit2,
    Code2,
    Cpu,
    FileText,
    Building2,
    GraduationCap,
    Plus,
    Edit3,
    Trash2,
    X,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail, checkIsAdminClient } from '@/lib/admin';

export interface ResourceItem {
    id: string;
    title: string;
    description: string;
    category: 'Fiche Mémo' | 'Cheat Sheet' | 'Template Soutenance' | 'Code & Infra' | 'Méthodologie PBL' | 'Maths & Physique';
    promo: string;
    specialty: string;
    author: string;
    campus: string;
    downloads: number;
    fileSize: string;
    fileType: 'PDF' | 'MD' | 'PPTX' | 'ZIP' | 'YAML';
    content: string;
}

const CATEGORIES = [
    'Toutes',
    'Fiche Mémo',
    'Cheat Sheet',
    'Template Soutenance',
    'Code & Infra',
    'Méthodologie PBL',
    'Maths & Physique'
] as const;

export default function ResourcesPage() {
    const supabase = createClient();
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
    const [selectedPromo, setSelectedPromo] = useState<string>('Toutes');
    const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});

    // Modal state for Admin Edit/Create
    const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        category: 'Fiche Mémo' as ResourceItem['category'],
        promo: 'A3',
        specialty: 'Informatique',
        author: 'Administrateur Kompas',
        campus: 'Nanterre',
        fileSize: '15 KB',
        fileType: 'MD' as ResourceItem['fileType'],
        content: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/resources');
            const data = await res.json();
            if (data.success && Array.isArray(data.resources)) {
                setResources(data.resources);
            }
        } catch (e) {
            console.error('Failed to load resources:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const checkAdmin = async () => {
        if (checkIsAdminClient()) {
            setIsAdmin(true);
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && checkIsAdminClient(user)) {
                setIsAdmin(true);
            }
        } catch {}
    };

    useEffect(() => {
        fetchResources();
        checkAdmin();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user && checkIsAdminClient(session.user)) {
                setIsAdmin(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleDeleteResource = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Voulez-vous vraiment supprimer cette fiche ?')) return;

        setResources(prev => prev.filter(r => r.id !== id));
        try {
            await fetch(`/api/resources/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete resource:', err);
            fetchResources();
        }
    };

    const handleStartEdit = (item: ResourceItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingResource(item);
        setFormState({
            title: item.title,
            description: item.description,
            category: item.category,
            promo: item.promo,
            specialty: item.specialty,
            author: item.author,
            campus: item.campus,
            fileSize: item.fileSize,
            fileType: item.fileType,
            content: item.content
        });
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingResource || isSaving) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/resources/${editingResource.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });
            const data = await res.json();
            if (data.success && data.resource) {
                setResources(prev => prev.map(r => r.id === editingResource.id ? data.resource : r));
            }
            setEditingResource(null);
        } catch (err) {
            console.error('Failed to update resource:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        try {
            const res = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState)
            });
            const data = await res.json();
            if (data.success && data.resource) {
                setResources(prev => [data.resource, ...prev]);
                setIsCreateModalOpen(false);
            }
        } catch (err) {
            console.error('Failed to create resource:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredResources = useMemo(() => {
        return resources.filter(item => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.specialty.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === 'Toutes' || item.category === selectedCategory;

            const matchesPromo =
                selectedPromo === 'Toutes' || item.promo === selectedPromo;

            return matchesSearch && matchesCategory && matchesPromo;
        });
    }, [resources, searchQuery, selectedCategory, selectedPromo]);

    const handleDownload = (resource: ResourceItem) => {
        const mimeType = resource.fileType === 'YAML' ? 'text/yaml' : 'text/markdown';
        const extension = resource.fileType.toLowerCase();
        const blob = new Blob([resource.content], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);

        setDownloadedIds(prev => ({ ...prev, [resource.id]: true }));
        setTimeout(() => {
            setDownloadedIds(prev => ({ ...prev, [resource.id]: false }));
        }, 2500);
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Unified Header & Filter Card */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden space-y-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

                {/* Top: Title & Subtitle & Action */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                            Fiches &amp; Synthèses <span className="italic font-normal">d&apos;Ingénierie</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary font-normal max-w-2xl">
                            Banque collaborative de synthèses, cheat sheets et guides méthodologiques partagés par les majors de promo du CESI.
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => {
                                setFormState({
                                    title: '',
                                    description: '',
                                    category: 'Fiche Mémo',
                                    promo: 'A3',
                                    specialty: 'Informatique',
                                    author: 'Administrateur Kompas',
                                    campus: 'Nanterre',
                                    fileSize: '15 KB',
                                    fileType: 'MD',
                                    content: ''
                                });
                                setIsCreateModalOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter une fiche (Admin)</span>
                        </button>
                    )}
                </div>

                {/* Bottom: Search, Promo Selector & Category Tags */}
                <div className="space-y-4 pt-4 border-t border-border/60 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une fiche (SQL, Docker, Git, PBL, Maths, C4)..."
                                className="w-full bg-surface-card border border-border rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 transition-all"
                            />
                        </div>

                        {/* Promo Selector */}
                        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {['Toutes', 'A1', 'A2', 'A3', 'A4', 'A5'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setSelectedPromo(p)}
                                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        selectedPromo === p
                                            ? 'bg-accent-yellow text-black shadow-xs'
                                            : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border/60'
                                    }`}
                                >
                                    {p === 'Toutes' ? 'Toutes Promos' : p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Categories Row */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/40">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? 'bg-text-primary text-surface font-semibold'
                                        : 'bg-surface-card text-text-secondary hover:text-text-primary hover:bg-surface-highlight border border-border/50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resources Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent-yellow animate-spin" />
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="card-editorial p-12 rounded-3xl text-center space-y-3 bg-surface-card border-border">
                    <BookOpen className="w-10 h-10 text-text-muted mx-auto" />
                    <h3 className="font-serif text-lg font-normal text-text-primary">Aucune fiche trouvée</h3>
                    <p className="text-xs text-text-secondary">
                        Essayez d&apos;ajuster vos termes de recherche ou sélectionnez une autre catégorie.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredResources.map((item) => {
                        const isDownloaded = downloadedIds[item.id];
                        return (
                            <div
                                key={item.id}
                                className="card-editorial rounded-3xl p-6 border border-border bg-surface-card hover:border-accent-yellow/40 transition-all flex flex-col justify-between space-y-5 shadow-sm group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider bg-accent-yellow/15 border border-accent-yellow/40 text-text-primary px-2.5 py-0.5 rounded-lg">
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                                            <span className="font-bold text-text-secondary">{item.promo}</span>
                                            <span>•</span>
                                            <span>{item.fileType} ({item.fileSize})</span>
                                        </div>
                                    </div>

                                    <h3 className="font-serif font-normal text-lg text-text-primary group-hover:text-accent-yellow transition-colors leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs gap-2">
                                    <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono truncate">
                                        <span className="truncate">{item.author}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {isAdmin && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleStartEdit(item, e)}
                                                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-accent-yellow transition-all cursor-pointer"
                                                    title="Modifier cette fiche (Admin)"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteResource(item.id, e)}
                                                    className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-highlight text-text-secondary hover:text-red-400 transition-all cursor-pointer"
                                                    title="Supprimer cette fiche (Admin)"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}

                                        <Button
                                            variant="premium"
                                            size="sm"
                                            onClick={() => handleDownload(item)}
                                            className="text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                                        >
                                            {isDownloaded ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Téléchargé !</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>Télécharger</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal: Edit / Create Resource */}
            {(editingResource || isCreateModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div className="flex items-center gap-2.5">
                                <FileDown className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    {editingResource ? 'Modifier la Fiche (Admin)' : 'Ajouter une Fiche (Admin)'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingResource(null);
                                    setIsCreateModalOpen(false);
                                }}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={editingResource ? handleSaveEdit : handleCreateResource} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Titre de la fiche</label>
                                <input
                                    type="text"
                                    required
                                    value={formState.title}
                                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Description sommaire</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formState.description}
                                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Catégorie</label>
                                    <select
                                        value={formState.category}
                                        onChange={(e) => setFormState({ ...formState, category: e.target.value as ResourceItem['category'] })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="Fiche Mémo">Fiche Mémo</option>
                                        <option value="Cheat Sheet">Cheat Sheet</option>
                                        <option value="Template Soutenance">Template Soutenance</option>
                                        <option value="Code & Infra">Code & Infra</option>
                                        <option value="Méthodologie PBL">Méthodologie PBL</option>
                                        <option value="Maths & Physique">Maths & Physique</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Promotion</label>
                                    <select
                                        value={formState.promo}
                                        onChange={(e) => setFormState({ ...formState, promo: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="A1">Promo A1</option>
                                        <option value="A2">Promo A2</option>
                                        <option value="A3">Promo A3</option>
                                        <option value="A4">Promo A4</option>
                                        <option value="A5">Promo A5</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Format de fichier</label>
                                    <select
                                        value={formState.fileType}
                                        onChange={(e) => setFormState({ ...formState, fileType: e.target.value as ResourceItem['fileType'] })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="MD">Markdown (.md)</option>
                                        <option value="YAML">YAML (.yaml)</option>
                                        <option value="PDF">PDF (.pdf)</option>
                                        <option value="PPTX">PPTX (.pptx)</option>
                                        <option value="ZIP">ZIP (.zip)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Contenu / Code de la fiche</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={formState.content}
                                    onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                                    placeholder="# Titre du document..."
                                    className="w-full font-mono bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingResource(null);
                                        setIsCreateModalOpen(false);
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer la fiche'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
