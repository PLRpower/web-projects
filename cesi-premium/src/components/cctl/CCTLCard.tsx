'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublishedCCTLMeta } from '@/lib/cctl-store';
import { formatAcademicYear } from '@/types/cctl';

interface CCTLCardProps {
    cctl: PublishedCCTLMeta;
    href: string;
}

export function CCTLCard({ cctl, href }: CCTLCardProps) {
    const promoBadgeText = cctl.specialty
        ? (cctl.specialty.includes(cctl.promo) ? cctl.specialty : `${cctl.specialty} • ${cctl.promo}`)
        : cctl.promo;

    return (
        <div className="glass group rounded-3xl border border-border/80 hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col shadow-lg hover:shadow-accent-yellow/5 relative">
            <div className="p-6 flex-1 space-y-4">
                {/* Top Bar: Single Combined Promo/Specialty Badge on Left, Year on Right */}
                <div className="flex justify-between items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider font-mono shadow-xs">
                        {promoBadgeText}
                    </span>
                    <span className="text-text-secondary text-xs font-semibold bg-surface-highlight/70 px-2.5 py-1 rounded-lg border border-border/50 font-mono">
                        {formatAcademicYear(cctl.year)}
                    </span>
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

                {/* Types Tags */}
                {cctl.typesSummary && cctl.typesSummary.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {cctl.typesSummary.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="text-[11px] font-medium bg-surface-highlight/50 text-text-secondary px-2.5 py-0.5 rounded-md border border-border/50 font-mono"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions footer */}
            <div className="p-4 bg-surface/50 border-t border-border/60">
                <Link href={href} className="block w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold hover:bg-surface-highlight border-border flex items-center justify-center gap-1.5 cursor-pointer">
                        <Eye className="w-3.5 h-3.5 text-accent-yellow" />
                        <span>Consulter le sujet &amp; correction</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
