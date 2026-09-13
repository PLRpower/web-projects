'use client';

import Link from 'next/link';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublishedCCTLMeta } from '@/lib/cctl-store';
import { formatAcademicYear } from '@/types/cctl';

interface CCTLCardProps {
    cctl: PublishedCCTLMeta;
    href: string;
    isAdmin?: boolean;
    canManage?: boolean;
    isOwner?: boolean;
    onEdit?: (cctl: PublishedCCTLMeta) => void;
    onDelete?: (id: string) => void;
}

export function CCTLCard({ cctl, href, isAdmin, canManage, isOwner, onEdit, onDelete }: CCTLCardProps) {
    const promoBadgeText = cctl.specialty
        ? (cctl.specialty.includes(cctl.promo) ? cctl.specialty : `${cctl.specialty} • ${cctl.promo}`)
        : cctl.promo;

    const userCanManage = Boolean(canManage || isAdmin);

    return (
        <div className="glass group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col shadow-lg hover:shadow-accent-yellow/5 relative">
            <div className="p-6 flex-1 space-y-4">
                {/* Top Bar: Single Combined Promo/Specialty Badge on Left, Year on Right */}
                <div className="flex justify-between items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider font-mono shadow-xs">
                        {promoBadgeText}
                    </span>
                    <div className="flex items-center gap-2">
                        {isAdmin ? (
                            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40">
                                ADMIN
                            </span>
                        ) : isOwner ? (
                            <span className="text-[10px] font-mono font-bold bg-accent-yellow/15 text-text-primary px-1.5 py-0.5 rounded border border-accent-yellow/30">
                                VOTRE DÉPÔT
                            </span>
                        ) : null}
                        <span className="text-text-secondary text-xs font-semibold bg-surface-highlight/70 px-2.5 py-1 rounded-lg border border-border/50 font-mono">
                            {formatAcademicYear(cctl.year)}
                        </span>
                    </div>
                </div>

                {/* Title & Question Count in Description */}
                <div className="space-y-1.5">
                    <h3 className="font-normal font-serif text-lg text-text-primary group-hover:text-accent-yellow transition-colors line-clamp-2">
                        {cctl.subject || cctl.title}
                    </h3>
                    <p className="text-text-secondary text-xs font-medium">
                        {cctl.totalQuestions} questions
                    </p>
                </div>

                {/* AI Badges Row (2-3 badges) */}
                {((cctl.aiBadges && cctl.aiBadges.length > 0) || (cctl.typesSummary && cctl.typesSummary.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {(cctl.aiBadges && cctl.aiBadges.length > 0 ? cctl.aiBadges : cctl.typesSummary).slice(0, 3).map((badge, i) => (
                            <span
                                key={i}
                                className="text-[11px] font-mono font-medium bg-surface/90 border border-border/70 group-hover:border-accent-yellow/40 text-text-secondary group-hover:text-text-primary px-2.5 py-1 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                            >
                                <span>{badge}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions footer */}
            <div className="p-4 bg-surface/50 border-t border-border/60 flex items-center justify-between gap-2">
                <Link href={href} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold hover:bg-surface-highlight border-border flex items-center justify-center gap-1.5 cursor-pointer">
                        <Eye className="w-3.5 h-3.5 text-accent-yellow" />
                        <span>Consulter</span>
                    </Button>
                </Link>

                {userCanManage && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(cctl);
                                }}
                                className="px-2.5 py-1.5 rounded-xl border border-accent-yellow/40 bg-accent-yellow/10 hover:bg-accent-yellow hover:text-black text-accent-yellow transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
                                title={isOwner && !isAdmin ? "Modifier mon CCTL" : "Modifier ce CCTL"}
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Éditer</span>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(cctl.id);
                                }}
                                className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                                title={isOwner && !isAdmin ? "Supprimer mon CCTL" : "Supprimer ce CCTL"}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

