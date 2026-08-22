'use client';

import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    MapPin,
    GraduationCap,
    Award,
    Flame,
    Zap,
    BookOpen,
    CheckCircle2,
    Clock,
    TrendingUp,
    Sparkles,
    Shield,
    Calendar,
    Edit3,
    Save,
    Check,
    Star,
    Layers,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

const CESI_CAMPUSES = [
    'Aix-en-Provence',
    'Angoulême',
    'Arras',
    'Bordeaux',
    'Brest',
    'Caen',
    'Châteauroux',
    'Dijon',
    'Grenoble',
    'La Rochelle',
    'Le Mans',
    'Lille',
    'Lyon',
    'Montpellier',
    'Nancy',
    'Nantes',
    'Nice',
    'Orléans',
    'Paris Nanterre',
    'Pau',
    'Reims',
    'Rouen',
    'Saint-Nazaire',
    'Strasbourg',
    'Toulouse'
];

const PROMOS = [
    { id: 'A1', label: 'A1 - 1ère année Prépa Intégrée' },
    { id: 'A2', label: 'A2 - 2ème année Prépa Intégrée' },
    { id: 'A3', label: 'A3 - 1ère année Cycle Ingénieur (FISE/FISA)' },
    { id: 'A4', label: 'A4 - 2ème année Cycle Ingénieur' },
    { id: 'A5', label: 'A5 - Année diplômante / Mastère Spécialisé' }
];

const SPECIALTIES = [
    'Informatique',
    'BTP & Génie Civil',
    'Systèmes Embarqués',
    'Généraliste'
];

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'major',
        title: 'Major de Promo',
        description: 'Obtenir le Grade A à une épreuve CCTL officielle.',
        icon: '🎓',
        unlocked: true,
        progress: '1/1 complété',
        rarity: 'legendary'
    },
    {
        id: 'prosit-master',
        title: 'Survivant du Prosit',
        description: 'Compléter 5 fiches méthodologiques de Prosit.',
        icon: '⚡',
        unlocked: true,
        progress: '5/5 complétés',
        rarity: 'rare'
    },
    {
        id: 'sniper',
        title: 'CCTL Sniper',
        description: 'Répondre correctement à 20 questions consécutives.',
        icon: '🎯',
        unlocked: true,
        progress: '20/20 d\'affilée',
        rarity: 'epic'
    },
    {
        id: 'contributor',
        title: 'Bibliothécaire Agora',
        description: 'Partager un sujet de CCTL dans les archives.',
        icon: '📚',
        unlocked: false,
        progress: '0/1 uploadé',
        rarity: 'rare'
    },
    {
        id: 'night-owl',
        title: 'Noctambule du FabLab',
        description: 'Terminer une session de révision après 23h.',
        icon: '☕',
        unlocked: true,
        progress: 'Débloqué à 23h42',
        rarity: 'common'
    },
    {
        id: 'streak-god',
        title: 'Discipline de Fer',
        description: 'Maintenir une série de révision de 14 jours.',
        icon: '🔥',
        unlocked: true,
        progress: '14/14 jours',
        rarity: 'epic'
    },
    {
        id: 'guardian',
        title: 'Gardien du Livrable',
        description: 'Valider un bloc complet sans rattrapage.',
        icon: '🛡️',
        unlocked: false,
        progress: 'En cours (Bloc Web)',
        rarity: 'common'
    },
    {
        id: 'ultimate',
        title: 'Membre Ultime',
        description: 'Accéder aux explications détaillées par IA 24/7.',
        icon: '👑',
        unlocked: true,
        progress: 'Actif',
        rarity: 'legendary'
    }
];

export default function ProfilePage() {
    const supabase = createClient();
    const [isEditing, setIsEditing] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Profile state
    const [name, setName] = useState('Alexandre Martin');
    const [email, setEmail] = useState('alexandre.martin@viacesi.fr');
    const [campus, setCampus] = useState('Rouen');
    const [promo, setPromo] = useState('A3');
    const [specialty, setSpecialty] = useState('Informatique & Numérique (FISE)');
    const [bio, setBio] = useState('Futur ingénieur full-stack au CESI Rouen. Passionné d\'architecture logicielle et de devops.');
    const [subscriptionTier, setSubscriptionTier] = useState<'Découverte' | 'Premium' | 'Ultime'>('Ultime');

    // Stats
    const [stats] = useState({
        level: 7,
        levelTitle: 'Ingénieur Système Confirmé',
        xp: 3450,
        nextLevelXp: 5000,
        streakDays: 14,
        completedCctlCount: 18,
        totalQuestionsAnswered: 342,
        averageScore: '16.4 / 20',
        accuracyRate: '87%'
    });

    useEffect(() => {
        // Load user from Supabase if available
        const loadUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.email) {
                setEmail(user.email);
                if (user.user_metadata?.name) {
                    setName(user.user_metadata.name);
                }
            }

            // Load local saved profile
            const savedProfile = localStorage.getItem('cesi_agora_user_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.name) setName(parsed.name);
                    if (parsed.campus) setCampus(parsed.campus);
                    if (parsed.promo) setPromo(parsed.promo);
                    if (parsed.specialty) setSpecialty(parsed.specialty);
                    if (parsed.bio) setBio(parsed.bio);
                    if (parsed.subscriptionTier) setSubscriptionTier(parsed.subscriptionTier);
                } catch {
                    // Ignore parse error
                }
            }
        };

        loadUser();
    }, [supabase]);

    const handleSaveProfile = () => {
        const profileData = {
            name,
            email,
            campus,
            promo,
            specialty,
            bio,
            subscriptionTier
        };
        localStorage.setItem('cesi_agora_user_profile', JSON.stringify(profileData));
        setIsEditing(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    const getRarityBadge = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'legendary':
                return 'bg-gradient-to-r from-amber-500 to-accent-yellow text-black font-bold';
            case 'epic':
                return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
            case 'rare':
                return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
            default:
                return 'bg-surface-highlight text-text-secondary border border-border';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-surface-card border border-border text-[11px] font-mono text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse" />
                        <span>ESPACE ÉTUDIANT // PROFIL &amp; XP</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-normal font-serif flex items-center gap-3 text-text-primary">
                        <User className="w-8 h-8 text-accent-yellow" />
                        Mon Espace <span className="italic font-normal">Étudiant CESI</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary">
                        Gérez vos informations de scolarité, suivez vos statistiques et votre palmarès de badges.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleSaveProfile}
                            className="px-5 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>Enregistrer</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-5 py-3 rounded-xl bg-surface-card border border-border text-text-primary font-semibold text-xs hover:bg-surface transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Modifier mon profil</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Saved Alert Banner */}
            {savedSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span className="text-sm font-semibold">Profil mis à jour avec succès sur Kompas | CESI !</span>
                </div>
            )}

            {/* Main Profile Card & Level Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: User Identity Card */}
                <div className="lg:col-span-1 glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Avatar & Badges */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-orange to-accent-yellow flex items-center justify-center text-3xl font-bold text-black shadow-xl shadow-accent-yellow/10">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute -bottom-1 -right-1 p-1 bg-surface border-2 border-background rounded-full text-xs">
                                    🔥
                                </span>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-xl font-bold font-syne text-text-primary leading-tight">{name}</h2>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-yellow text-black">
                                    <Sparkles className="w-3 h-3" />
                                    {subscriptionTier}
                                </span>
                            </div>
                        </div>

                        {/* Editable or Display Info */}
                        {isEditing ? (
                            <div className="space-y-3 text-sm">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Nom complet</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-surface-highlight/40 border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Campus CESI</label>
                                    <select
                                        value={campus}
                                        onChange={(e) => setCampus(e.target.value)}
                                        className="w-full bg-surface-highlight/40 border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    >
                                        {CESI_CAMPUSES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Promotion</label>
                                    <select
                                        value={promo}
                                        onChange={(e) => setPromo(e.target.value)}
                                        className="w-full bg-surface-highlight/40 border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    >
                                        {PROMOS.map((p) => (
                                            <option key={p.id} value={p.id}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Filière</label>
                                    <select
                                        value={specialty}
                                        onChange={(e) => setSpecialty(e.target.value)}
                                        className="w-full bg-surface-highlight/40 border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                    >
                                        {SPECIALTIES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Bio / Statut</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={2}
                                        className="w-full bg-surface-highlight/40 border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 resize-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2.5 text-text-secondary">
                                    <Mail className="w-4 h-4 text-accent-yellow" />
                                    <span className="truncate">{email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-text-secondary">
                                    <MapPin className="w-4 h-4 text-accent-orange" />
                                    <span>Campus CESI {campus}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-text-secondary">
                                    <GraduationCap className="w-4 h-4 text-blue-400" />
                                    <span>Promo {promo} — {specialty}</span>
                                </div>
                                {bio && (
                                    <p className="text-xs text-text-secondary/90 bg-surface-highlight/40 p-3 rounded-xl border border-border/50 italic">
                                        &ldquo;{bio}&rdquo;
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Streak & Plan Footer */}
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
                            <div>
                                <div className="text-sm font-bold text-text-primary">{stats.streakDays} jours</div>
                                <div className="text-[11px] text-text-secondary">Série de révision</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                Statut Actif
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Level, XP & Key Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    {/* XP & Level Progress Card */}
                    <div className="glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-5 bg-gradient-to-br from-surface via-surface to-surface-highlight/30">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-accent-yellow text-xs font-bold uppercase tracking-wider">
                                    <Star className="w-4 h-4 fill-accent-yellow text-accent-yellow" />
                                    Progression d&apos;ingénieur Agora
                                </div>
                                <h3 className="text-2xl font-bold font-syne text-text-primary">
                                    Niveau {stats.level} : {stats.levelTitle}
                                </h3>
                            </div>
                            <span className="text-sm font-bold text-accent-yellow bg-accent-yellow/10 px-3.5 py-1.5 rounded-xl border border-accent-yellow/20">
                                {stats.xp} / {stats.nextLevelXp} XP
                            </span>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="space-y-1.5">
                            <div className="h-3 bg-surface-highlight rounded-full overflow-hidden p-0.5 border border-border/40">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-orange to-accent-yellow rounded-full transition-all duration-500"
                                    style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-text-secondary">
                                <span>Encore {stats.nextLevelXp - stats.xp} XP pour atteindre le Niveau {stats.level + 1} (Expert CCTL)</span>
                                <span>{Math.round((stats.xp / stats.nextLevelXp) * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="glass p-5 rounded-2xl border border-border space-y-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary text-xs">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>CCTLs validés</span>
                            </div>
                            <div className="text-2xl font-bold font-syne text-text-primary">{stats.completedCctlCount}</div>
                            <div className="text-[11px] text-text-secondary">100% anonymisés</div>
                        </div>

                        <div className="glass p-5 rounded-2xl border border-border space-y-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary text-xs">
                                <TrendingUp className="w-4 h-4 text-accent-yellow" />
                                <span>Moyenne Sim.</span>
                            </div>
                            <div className="text-2xl font-bold font-syne text-text-primary">{stats.averageScore}</div>
                            <div className="text-[11px] text-emerald-400">+1.8 pts ce mois</div>
                        </div>

                        <div className="glass p-5 rounded-2xl border border-border space-y-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary text-xs">
                                <Zap className="w-4 h-4 text-accent-orange" />
                                <span>Précision QCM</span>
                            </div>
                            <div className="text-2xl font-bold font-syne text-text-primary">{stats.accuracyRate}</div>
                            <div className="text-[11px] text-text-secondary">{stats.totalQuestionsAnswered} questions</div>
                        </div>

                        <div className="glass p-5 rounded-2xl border border-border space-y-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-text-secondary text-xs">
                                <Award className="w-4 h-4 text-purple-400" />
                                <span>Badges CESI</span>
                            </div>
                            <div className="text-2xl font-bold font-syne text-text-primary">
                                {INITIAL_ACHIEVEMENTS.filter(a => a.unlocked).length} / {INITIAL_ACHIEVEMENTS.length}
                            </div>
                            <div className="text-[11px] text-purple-400">6 débloqués</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements / Palmarès CESI */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold font-syne text-text-primary flex items-center gap-2.5">
                            <Award className="w-6 h-6 text-accent-yellow" />
                            Palmarès & Trophées d&apos;Élève-Ingénieur
                        </h2>
                        <p className="text-xs text-text-secondary mt-0.5">
                            Accomplissez des défis de révision pour débloquer des trophées exclusifs.
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-text-secondary">
                        {INITIAL_ACHIEVEMENTS.filter(a => a.unlocked).length} débloqués sur {INITIAL_ACHIEVEMENTS.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {INITIAL_ACHIEVEMENTS.map((ach) => (
                        <div
                            key={ach.id}
                            className={`glass rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                                ach.unlocked
                                    ? 'border-border/80 hover:border-accent-yellow/40 hover:-translate-y-0.5 shadow-md'
                                    : 'opacity-50 border-border/40 grayscale'
                            }`}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl p-2 rounded-xl bg-surface-highlight/50 inline-block">
                                        {ach.icon}
                                    </span>
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${getRarityBadge(ach.rarity)}`}>
                                        {ach.rarity}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm font-syne text-text-primary">{ach.title}</h3>
                                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">{ach.description}</p>
                                </div>
                            </div>

                            <div className="pt-3 mt-4 border-t border-border/40 flex items-center justify-between text-[11px]">
                                <span className={ach.unlocked ? 'text-emerald-400 font-semibold flex items-center gap-1' : 'text-text-secondary'}>
                                    {ach.unlocked ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                    {ach.progress}
                                </span>
                                {ach.unlocked && <span className="text-accent-yellow font-bold">+250 XP</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
