'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import {
    User,
    Mail,
    MapPin,
    GraduationCap,
    Flame,
    Zap,
    CheckCircle2,
    Clock,
    TrendingUp,
    Sparkles,
    Edit3,
    Save,
    Check,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail } from '@/lib/admin';

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

export default function ProfilePage() {
    const supabase = createClient();
    const [isEditing, setIsEditing] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Profile state
    const [name, setName] = useState('Élève-Ingénieur');
    const [email, setEmail] = useState('');
    const [campus, setCampus] = useState('Rouen');
    const [promo, setPromo] = useState('A3');
    const [specialty, setSpecialty] = useState('Informatique & Numérique (FISE)');
    const [subscriptionTier, setSubscriptionTier] = useState<'Découverte' | 'Premium'>('Découverte');
    const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'monthly' | 'annual'>('free');
    const [isPremium, setIsPremium] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPortalLoading, setIsPortalLoading] = useState(false);

    // Stats
    const [stats] = useState({
        level: 7,
        levelTitle: 'Ingénieur Système Confirmé',
        xp: 3450,
        nextLevelXp: 5000,
        streakDays: 14,
        completedCctlCount: 18,
        totalQuestionsAnswered: 342,
        averageScore: 'Note A (87%)',
        accuracyRate: '87%'
    });

    useEffect(() => {
        // Load user from Supabase if available
        const loadUser = async () => {
            let dynamicName = '';
            let premiumResolved = false;
            let adminResolved = false;
            let planResolved: 'free' | 'monthly' | 'annual' = 'free';

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (user.email) setEmail(user.email);
                
                const meta = user.user_metadata;
                if (isAdminUser(user) || isAdminEmail(user.email)) {
                    adminResolved = true;
                    premiumResolved = true;
                }

                premiumResolved = Boolean(
                    adminResolved ||
                    meta?.is_premium === true ||
                    meta?.subscription_tier === 'Premium' ||
                    meta?.subscription_tier === 'Ultime' ||
                    meta?.role === 'admin'
                );

                if (meta?.subscription_plan) planResolved = meta.subscription_plan;
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

                if (meta?.campus) setCampus(meta.campus);
                if (meta?.promo) setPromo(meta.promo);
                if (meta?.specialty) setSpecialty(meta.specialty);
            }

            // Load local saved profile
            const savedProfile = localStorage.getItem('kompas_user_profile');
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.name && parsed.name !== 'Alexandre Martin') {
                        dynamicName = parsed.name;
                    }
                    if (parsed.email) {
                        setEmail(parsed.email);
                        if (isAdminEmail(parsed.email)) {
                            adminResolved = true;
                            premiumResolved = true;
                        }
                    }
                    if (parsed.campus) setCampus(parsed.campus);
                    if (parsed.promo) setPromo(parsed.promo);
                    if (parsed.specialty) setSpecialty(parsed.specialty);
                    if (parsed.role === 'admin' || parsed.isAdmin) {
                        adminResolved = true;
                        premiumResolved = true;
                    }
                    if (parsed.isPremium || parsed.subscriptionTier === 'Premium' || parsed.subscriptionTier === 'Ultime') {
                        premiumResolved = true;
                        if (parsed.subscriptionPlan) planResolved = parsed.subscriptionPlan;
                    }
                } catch {
                    // Ignore parse error
                }
            }

            if (dynamicName) {
                setName(dynamicName);
            }
            setIsAdmin(adminResolved);
            setIsPremium(premiumResolved);
            setSubscriptionTier(premiumResolved ? 'Premium' : 'Découverte');
            setSubscriptionPlan(planResolved);
        };

        loadUser();
    }, [supabase]);

    const handleOpenStripePortal = async () => {
        setIsPortalLoading(true);
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Impossible d\'accéder au portail Stripe. Si vous n\'avez pas encore souscrit par carte, vous pouvez vous abonner sur la page Tarifs.');
            }
        } catch (e) {
            console.error('Stripe portal error:', e);
            alert('Erreur de connexion au portail Stripe');
        } finally {
            setIsPortalLoading(false);
        }
    };


    const handleSaveProfile = async () => {
        const profileData = {
            name,
            email,
            campus,
            promo,
            specialty,
            subscriptionTier
        };
        localStorage.setItem('kompas_user_profile', JSON.stringify(profileData));

        try {
            await supabase.auth.updateUser({
                data: {
                    name,
                    campus,
                    promo,
                    specialty
                }
            });
        } catch (e) {
            console.warn('Supabase profile sync skipped:', e);
        }

        window.dispatchEvent(new Event('kompas_profile_updated'));

        setIsEditing(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-1 sm:space-y-2 relative z-10">
                    <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                        Mon Espace <span className="italic font-normal">Étudiant CESI</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary font-normal">
                        Gérez vos informations de scolarité, votre campus et vos statistiques académiques.
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
                    {/* Subtle Brand Watermark */}
                    <div className="absolute top-4 right-4 opacity-10 dark:opacity-15 pointer-events-none">
                        <Logo size={64} />
                    </div>

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
                                {isAdmin ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black shadow-md shadow-amber-500/20 font-mono">
                                        <span>👑</span>
                                        <span>ADMINISTRATEUR // Accès Total</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-yellow text-black">
                                        <Sparkles className="w-3 h-3" />
                                        {subscriptionTier}
                                    </span>
                                )}
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
                            </div>
                        )}

                        {/* Stripe Subscription Management Block */}
                        <div className="p-4 rounded-2xl bg-surface/70 border border-border/80 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold">
                                    Abonnement Kompas
                                </span>
                                {isPremium ? (
                                    <span className="text-[10px] font-mono uppercase font-bold text-accent-yellow bg-accent-yellow/15 px-2 py-0.5 rounded-full border border-accent-yellow/30">
                                        Actif
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-mono uppercase text-text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
                                        Gratuit
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-bold text-text-primary">
                                    {isPremium ? 'Kompas Premium' : 'Formule Découverte'}
                                </p>
                                <p className="text-xs text-text-secondary mt-0.5">
                                    {isPremium
                                        ? (subscriptionPlan === 'monthly' ? 'Facturation Mensuelle (4,99 €/mois)' : 'Paiement Annuel (39,99 €/an)')
                                        : 'Accès limité à 15 questions / jour'}
                                </p>
                            </div>

                            {isPremium ? (
                                <button
                                    type="button"
                                    onClick={handleOpenStripePortal}
                                    disabled={isPortalLoading}
                                    className="w-full py-2 px-3 rounded-xl bg-surface hover:bg-surface-highlight border border-border text-xs font-semibold text-text-primary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                >
                                    <span>{isPortalLoading ? 'Chargement Stripe...' : 'Gérer l\'abonnement & Factures'}</span>
                                </button>
                            ) : (
                                <Link href="/dashboard/pricing" className="block w-full">
                                    <button
                                        type="button"
                                        className="w-full py-2.5 px-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-sm shadow-accent-yellow/20 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Passer à Kompas Premium (3,33€/m)</span>
                                    </button>
                                </Link>
                            )}
                        </div>
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
                                    Progression d&apos;ingénieur
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
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span>Temps d&apos;étude</span>
                            </div>
                            <div className="text-2xl font-bold font-syne text-text-primary">26h</div>
                            <div className="text-[11px] text-purple-400">Ce mois-ci</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
