'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import {
    ArrowLeft,
    MessageSquare,
    Sparkles,
    Flame,
    Zap,
    CheckCircle2,
    Clock,
    TrendingUp,
    Star,
    Award,
    BookOpen,
    Tv,
    ShieldCheck,
    GraduationCap,
    MapPin,
    Edit3,
    Trash2,
    X
} from 'lucide-react';
import { getStudentProfile, StudentProfileData } from '@/lib/student-profiles';
import { createClient } from '@/utils/supabase/client';
import { isAdminUser, isAdminEmail } from '@/lib/admin';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function StudentProfilePage({ params }: PageProps) {
    const supabase = createClient();
    const resolvedParams = use(params);
    const studentId = resolvedParams.id;
    const [profile, setProfile] = useState<StudentProfileData>(() => getStudentProfile(studentId));
    const [isAdmin, setIsAdmin] = useState(false);

    // Admin Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        campus: '',
        promo: '',
        specialty: '',
        bio: '',
        tier: 'Découverte' as StudentProfileData['tier'],
        level: 1,
        levelTitle: '',
        xp: 0,
        streakDays: 0,
        completedCctlCount: 0,
        averageScore: '',
        accuracyRate: '',
        topSkills: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/profiles/${studentId}`);
            const data = await res.json();
            if (data.success && data.profile) {
                setProfile(data.profile);
            } else {
                setProfile(getStudentProfile(studentId));
            }
        } catch {
            setProfile(getStudentProfile(studentId));
        }
    };

    const checkAdmin = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && (isAdminUser(user) || isAdminEmail(user.email))) {
                setIsAdmin(true);
                return;
            }
        } catch {}

        try {
            const saved = localStorage.getItem('kompas_user_profile');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.email && isAdminEmail(parsed.email)) setIsAdmin(true);
                if (parsed.role === 'admin' || parsed.isAdmin) setIsAdmin(true);
            }
        } catch {}
    };

    useEffect(() => {
        if (studentId) {
            fetchProfile();
            checkAdmin();
        }
    }, [studentId]);

    const handleOpenEdit = () => {
        setEditForm({
            name: profile.name,
            campus: profile.campus,
            promo: profile.promo,
            specialty: profile.specialty,
            bio: profile.bio,
            tier: profile.tier,
            level: profile.level,
            levelTitle: profile.levelTitle,
            xp: profile.xp,
            streakDays: profile.streakDays,
            completedCctlCount: profile.completedCctlCount,
            averageScore: profile.averageScore,
            accuracyRate: profile.accuracyRate,
            topSkills: profile.topSkills.join(', ')
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        try {
            const updates = {
                name: editForm.name,
                campus: editForm.campus,
                promo: editForm.promo,
                specialty: editForm.specialty,
                bio: editForm.bio,
                tier: editForm.tier,
                level: Number(editForm.level),
                levelTitle: editForm.levelTitle,
                xp: Number(editForm.xp),
                streakDays: Number(editForm.streakDays),
                completedCctlCount: Number(editForm.completedCctlCount),
                averageScore: editForm.averageScore,
                accuracyRate: editForm.accuracyRate,
                topSkills: editForm.topSkills.split(',').map(s => s.trim()).filter(Boolean)
            };

            const res = await fetch(`/api/profiles/${studentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const data = await res.json();
            if (data.success && data.profile) {
                setProfile(data.profile);
            }
            setIsEditModalOpen(false);
        } catch (err) {
            console.error('Failed to update student profile:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetProfile = async () => {
        if (!window.confirm(`Voulez-vous vraiment réinitialiser le profil de ${profile.name} ?`)) return;

        try {
            await fetch(`/api/profiles/${studentId}`, { method: 'DELETE' });
            setProfile(getStudentProfile(studentId));
        } catch (err) {
            console.error('Failed to reset profile:', err);
        }
    };

    const xpPercentage = Math.min(100, Math.round((profile.xp / (profile.nextLevelXp || 1000)) * 100));

    return (
        <div className="space-y-8 pb-16">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/dashboard/community"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface border border-border text-xs font-semibold text-text-primary hover:bg-surface-highlight transition-all cursor-pointer shadow-xs"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour au Chat Promo</span>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-surface border border-border text-[11px] font-mono text-text-secondary">
                        PROFIL ÉTUDIANT CESI // {profile.promo}
                    </span>
                    {isAdmin && (
                        <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow/15 border border-accent-yellow/40 text-[10px] font-mono font-bold text-accent-yellow">
                            ADMIN VUE
                        </span>
                    )}
                </div>
            </div>

            {/* Header Hero Card */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent-yellow font-bold">
                            Passeport Étudiant • CESI {profile.campus}
                        </span>
                        {profile.isOnline && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {profile.status}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                        Profil de <span className="italic font-normal">{profile.name}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary font-normal max-w-xl">
                        {profile.bio}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleOpenEdit}
                                className="px-4 py-3 rounded-xl bg-accent-yellow/15 border border-accent-yellow text-accent-yellow font-bold text-xs hover:bg-accent-yellow hover:text-black transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Modifier (Admin)</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleResetProfile}
                                className="px-3 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-xs hover:bg-red-500/20 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                                title="Réinitialiser le profil"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <Link
                        href={`/dashboard/community?dm=${encodeURIComponent(profile.id)}`}
                        className="px-5 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message privé</span>
                    </Link>

                    <Link
                        href="/live"
                        className="px-4 py-3 rounded-xl bg-surface-card border border-border text-text-primary font-semibold text-xs hover:bg-surface transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                        <Tv className="w-4 h-4 text-accent-yellow" />
                        <span>Live Battle</span>
                    </Link>
                </div>
            </div>

            {/* Profile Grid: Left Identity Card + Right Academic Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Official Student Identity Passport Card */}
                <div className="lg:col-span-1 glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 relative overflow-hidden flex flex-col justify-between">
                    {/* Subtle Brand Watermark */}
                    <div className="absolute top-4 right-4 opacity-10 dark:opacity-15 pointer-events-none">
                        <Logo size={64} />
                    </div>

                    <div className="space-y-6 relative z-10">
                        {/* Avatar & Badges */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-accent-orange to-accent-yellow flex items-center justify-center text-3xl font-bold text-black shadow-xl shadow-accent-yellow/10">
                                    {profile.avatarInitial || profile.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute -bottom-1 -right-1 p-1 bg-surface border-2 border-background rounded-full text-xs">
                                    🔥
                                </span>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-xl font-bold font-syne text-text-primary leading-tight">{profile.name}</h2>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-yellow text-black">
                                    <Sparkles className="w-3 h-3" />
                                    {profile.tier}
                                </span>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="space-y-3 text-sm">
                            <div className="p-3.5 rounded-2xl bg-surface/70 border border-border/60 flex items-center justify-between">
                                <span className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-accent-yellow" />
                                    Campus CESI
                                </span>
                                <span className="text-xs font-bold text-text-primary">{profile.campus}</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-surface/70 border border-border/60 flex items-center justify-between">
                                <span className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5 text-accent-yellow" />
                                    Promotion
                                </span>
                                <span className="text-xs font-bold text-text-primary font-mono">{profile.promo}</span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-surface/70 border border-border/60 flex items-center justify-between">
                                <span className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-accent-yellow" />
                                    Spécialité
                                </span>
                                <span className="text-xs font-bold text-text-primary truncate max-w-[170px]" title={profile.specialty}>
                                    {profile.specialty}
                                </span>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-surface/70 border border-border/60 flex items-center justify-between">
                                <span className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-accent-yellow" />
                                    Inscrit depuis
                                </span>
                                <span className="text-xs font-bold text-text-primary font-mono">{profile.joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Private Message Action */}
                    <div className="pt-4 border-t border-border/60 relative z-10">
                        <Link
                            href={`/dashboard/community?dm=${encodeURIComponent(profile.id)}`}
                            className="w-full py-3 rounded-xl bg-surface border border-accent-yellow/40 text-text-primary font-semibold text-xs hover:bg-surface-highlight transition-all flex items-center justify-center gap-2 cursor-pointer group"
                        >
                            <MessageSquare className="w-4 h-4 text-accent-yellow group-hover:scale-110 transition-transform" />
                            <span>Démarrer un chat privé</span>
                        </Link>
                    </div>
                </div>

                {/* Right: Academic Performance, Level & Skills */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Level Card */}
                    <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border space-y-5 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono uppercase tracking-wider text-accent-yellow font-bold">
                                        Niveau {profile.level}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-mono text-text-muted">
                                        Rang Académique
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold font-serif text-text-primary">
                                    {profile.levelTitle}
                                </h3>
                            </div>

                            <div className="flex items-center gap-2 text-right font-mono text-xs text-text-secondary">
                                <Zap className="w-4 h-4 text-accent-yellow" />
                                <span><strong className="text-text-primary">{profile.xp}</strong> / {profile.nextLevelXp} XP</span>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="space-y-1.5">
                            <div className="w-full h-3 rounded-full bg-surface border border-border overflow-hidden p-0.5">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-accent-yellow to-accent-orange transition-all duration-500"
                                    style={{ width: `${xpPercentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-text-muted">
                                <span>Progression vers Niveau {profile.level + 1}</span>
                                <span>{xpPercentage}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="card-editorial p-4 rounded-2xl bg-surface-card border-border space-y-2">
                            <div className="flex items-center justify-between text-text-muted">
                                <Flame className="w-4 h-4 text-accent-orange" />
                                <span className="text-[10px] font-mono uppercase">Régularité</span>
                            </div>
                            <p className="text-2xl font-serif font-bold text-text-primary">{profile.streakDays} j</p>
                            <p className="text-[11px] text-text-secondary font-normal">Série de révisions</p>
                        </div>

                        <div className="card-editorial p-4 rounded-2xl bg-surface-card border-border space-y-2">
                            <div className="flex items-center justify-between text-text-muted">
                                <BookOpen className="w-4 h-4 text-accent-yellow" />
                                <span className="text-[10px] font-mono uppercase">CCTLs</span>
                            </div>
                            <p className="text-2xl font-serif font-bold text-text-primary">{profile.completedCctlCount}</p>
                            <p className="text-[11px] text-text-secondary font-normal">Annales réussies</p>
                        </div>

                        <div className="card-editorial p-4 rounded-2xl bg-surface-card border-border space-y-2">
                            <div className="flex items-center justify-between text-text-muted">
                                <Star className="w-4 h-4 text-accent-yellow" />
                                <span className="text-[10px] font-mono uppercase">Moyenne</span>
                            </div>
                            <p className="text-2xl font-serif font-bold text-text-primary">{profile.averageScore}</p>
                            <p className="text-[11px] text-text-secondary font-normal">Score estimé</p>
                        </div>

                        <div className="card-editorial p-4 rounded-2xl bg-surface-card border-border space-y-2">
                            <div className="flex items-center justify-between text-text-muted">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-mono uppercase">Précision</span>
                            </div>
                            <p className="text-2xl font-serif font-bold text-emerald-400">{profile.accuracyRate}</p>
                            <p className="text-[11px] text-text-secondary font-normal">Taux de réussite</p>
                        </div>
                    </div>

                    {/* Skills & Badges */}
                    <div className="card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border-border space-y-4">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-accent-yellow" />
                            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
                                Compétences &amp; Domaines de prédilection
                            </h4>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                            {profile.topSkills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-semibold text-text-primary flex items-center gap-2 shadow-xs hover:border-accent-yellow/50 transition-colors"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-yellow" />
                                    <span>{skill}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Edit Student Profile (Admin) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border border-border shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-border">
                            <div className="flex items-center gap-2.5">
                                <Edit3 className="w-5 h-5 text-accent-yellow" />
                                <h3 className="font-serif text-lg font-normal text-text-primary">
                                    Modifier le Profil Étudiant (Mode Admin)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Nom complet</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Campus</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.campus}
                                        onChange={(e) => setEditForm({ ...editForm, campus: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Promotion</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.promo}
                                        onChange={(e) => setEditForm({ ...editForm, promo: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Spécialité</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.specialty}
                                        onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Statut / Tier</label>
                                    <select
                                        value={editForm.tier}
                                        onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as StudentProfileData['tier'] })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    >
                                        <option value="Découverte">Découverte</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Major de Promo">Major de Promo</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Biographie</label>
                                <textarea
                                    rows={2}
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40 resize-y"
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Niveau</label>
                                    <input
                                        type="number"
                                        value={editForm.level}
                                        onChange={(e) => setEditForm({ ...editForm, level: Number(e.target.value) })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">XP</label>
                                    <input
                                        type="number"
                                        value={editForm.xp}
                                        onChange={(e) => setEditForm({ ...editForm, xp: Number(e.target.value) })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Série (Jours)</label>
                                    <input
                                        type="number"
                                        value={editForm.streakDays}
                                        onChange={(e) => setEditForm({ ...editForm, streakDays: Number(e.target.value) })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">CCTLs Finis</label>
                                    <input
                                        type="number"
                                        value={editForm.completedCctlCount}
                                        onChange={(e) => setEditForm({ ...editForm, completedCctlCount: Number(e.target.value) })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Titre de Niveau</label>
                                    <input
                                        type="text"
                                        value={editForm.levelTitle}
                                        onChange={(e) => setEditForm({ ...editForm, levelTitle: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Moyenne Estimée</label>
                                    <input
                                        type="text"
                                        value={editForm.averageScore}
                                        onChange={(e) => setEditForm({ ...editForm, averageScore: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-text-secondary block mb-1">Taux de Réussite</label>
                                    <input
                                        type="text"
                                        value={editForm.accuracyRate}
                                        onChange={(e) => setEditForm({ ...editForm, accuracyRate: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-text-secondary block mb-1">Compétences (séparées par des virgules)</label>
                                <input
                                    type="text"
                                    value={editForm.topSkills}
                                    onChange={(e) => setEditForm({ ...editForm, topSkills: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/40"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-xl bg-accent-yellow text-black font-bold text-xs disabled:opacity-40 hover:brightness-105 cursor-pointer shadow-xs"
                                >
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
