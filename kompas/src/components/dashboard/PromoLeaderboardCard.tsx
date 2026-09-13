'use client';

import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { getCampusLeaderboard, CampusLeaderboardStats } from '@/lib/personal-revision-engine';

interface PromoLeaderboardCardProps {
    campus?: string;
    promo?: string;
}

export function PromoLeaderboardCard({
    campus = 'Strasbourg',
    promo = 'A3'
}: PromoLeaderboardCardProps) {
    const [stats, setStats] = useState<CampusLeaderboardStats | null>(null);

    useEffect(() => {
        const load = () => {
            const savedProfile = localStorage.getItem('kompas_user_profile');
            let userCampus = campus;
            let userPromo = promo;
            if (savedProfile) {
                try {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.campus) userCampus = parsed.campus;
                    if (parsed.promo) userPromo = parsed.promo;
                } catch {}
            }
            setStats(getCampusLeaderboard(userCampus, userPromo));
        };

        load();
        window.addEventListener('kompas_skills_updated', load);
        return () => window.removeEventListener('kompas_skills_updated', load);
    }, [campus, promo]);

    if (!stats) return null;

    return (
        <div className="card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border-border shadow-xl space-y-6 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-accent-yellow text-black font-bold shadow-xs">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-serif text-lg font-normal text-text-primary">
                                Classement Promo &amp; Benchmark Campus
                            </h3>
                            <span className="text-[10px] font-mono font-bold bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 px-2 py-0.5 rounded-full uppercase">
                                {stats.campusName} • {stats.promo}
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                            Positionnement en temps réel sur {stats.totalStudentsInCohort} élèves-ingénieurs.
                        </p>
                    </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                    Top {stats.percentileTopPct}% de la Promo
                </span>
            </div>

            {/* Main Rank Indicator */}
            <div className="p-5 rounded-2xl bg-surface border border-accent-yellow/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
                        VOTRE RANG ACTUEL
                    </p>
                    <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <span className="text-4xl font-serif font-bold text-text-primary">
                            {stats.userRank}<sup>ème</sup>
                        </span>
                        <span className="text-sm font-mono text-text-muted">
                            / {stats.totalStudentsInCohort} étudiants ({stats.campusName})
                        </span>
                    </div>
                    <p className="text-xs text-text-secondary">
                        Écart avec le 1er du campus :{' '}
                        <strong className="text-accent-yellow">
                            {stats.gapToFirstPct > 0 ? `-${stats.gapToFirstPct}% de précision` : 'Major de promo !'}
                        </strong>
                    </p>
                </div>

                {/* Score vs Average */}
                <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="text-center p-3 rounded-xl bg-surface-highlight border border-border min-w-[110px]">
                        <p className="text-[10px] text-text-muted uppercase">VOTRE MAÎTRISE</p>
                        <p className="text-sm font-bold text-accent-yellow mt-0.5">
                            {stats.userAccuracyPct}% <span className="text-[11px] font-normal">précision</span>
                        </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-surface-highlight border border-border min-w-[110px]">
                        <p className="text-[10px] text-text-muted uppercase">MOYENNE PROMO</p>
                        <p className="text-sm font-bold text-text-primary mt-0.5">
                            {stats.averageAccuracyPct}% <span className="text-[11px] font-normal">précision</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Cohort Leaderboard Top Table */}
            <div className="space-y-2">
                <p className="text-xs font-mono font-semibold text-text-muted uppercase tracking-wider">
                    Top 5 du Campus :
                </p>
                <div className="space-y-1.5">
                    {stats.rankings.slice(0, 5).map((entry) => (
                        <div
                            key={entry.rank}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                entry.isCurrentUser
                                    ? 'bg-accent-yellow/15 border-accent-yellow text-text-primary font-bold shadow-xs'
                                    : 'bg-surface border-border/70 text-text-secondary'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                                        entry.rank === 1
                                            ? 'bg-amber-400 text-black'
                                            : entry.rank === 2
                                            ? 'bg-gray-300 text-black'
                                            : entry.rank === 3
                                            ? 'bg-amber-700 text-white'
                                            : 'bg-surface-highlight text-text-muted'
                                    }`}
                                >
                                    {entry.rank}
                                </span>
                                <span className="font-semibold text-text-primary">
                                    {entry.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 font-mono">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                    entry.accuracyPct >= 85
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                        : entry.accuracyPct >= 70
                                        ? 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/40'
                                        : 'bg-surface-highlight text-text-muted border-border'
                                }`}>
                                    {entry.accuracyPct}% de réussite
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
