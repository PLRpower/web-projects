'use client';

import { useState } from 'react';
import { SkillScore } from '@/lib/skills-diagnostic';

interface SkillsRadarChartProps {
    skills: SkillScore[];
    size?: number;
    showCohortComparison?: boolean;
}

export function SkillsRadarChart({
    skills,
    size = 320,
    showCohortComparison = true
}: SkillsRadarChartProps) {
    const [hoveredSkill, setHoveredSkill] = useState<SkillScore | null>(null);

    const numAxes = skills.length;
    if (numAxes < 3) return null;

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.36;

    // Helper to get coordinates for an axis at a given value (0 to 100)
    const getCoordinates = (index: number, value: number) => {
        const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
        const r = (value / 100) * radius;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return { x, y, angle };
    };

    // Build SVG polygon points string
    const studentPoints = skills
        .map((s, i) => {
            const { x, y } = getCoordinates(i, s.mastery);
            return `${x},${y}`;
        })
        .join(' ');

    const cohortPoints = skills
        .map((s, i) => {
            const { x, y } = getCoordinates(i, s.cohortAverage);
            return `${x},${y}`;
        })
        .join(' ');

    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="overflow-visible"
            >
                <defs>
                    {/* Glowing yellow gradient for student mastery */}
                    <radialGradient id="radarYellowGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#eab308" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.05" />
                    </radialGradient>
                    {/* Glow filter */}
                    <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Concentric Web Polygon Grids */}
                {gridLevels.map((level) => {
                    const levelPoints = skills
                        .map((_, i) => {
                            const { x, y } = getCoordinates(i, level);
                            return `${x},${y}`;
                        })
                        .join(' ');

                    return (
                        <g key={level}>
                            <polygon
                                points={levelPoints}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={level === 100 ? '1.5' : '1'}
                                className={
                                    level === 100
                                        ? 'text-border opacity-80'
                                        : 'text-border/40'
                                }
                            />
                            {/* Axis level percentage label on top axis */}
                            {level === 100 && (
                                <text
                                    x={cx}
                                    y={cy - radius - 6}
                                    textAnchor="middle"
                                    className="text-[9px] font-mono fill-text-muted select-none"
                                >
                                    100%
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Radial Spokes / Axes */}
                {skills.map((_, i) => {
                    const { x, y } = getCoordinates(i, 100);
                    return (
                        <line
                            key={i}
                            x1={cx}
                            y1={cy}
                            x2={x}
                            y2={y}
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-border/50 stroke-dasharray-[2_2]"
                        />
                    );
                })}

                {/* Cohort Average Benchmark Polygon (Blue/Indigo dotted line) */}
                {showCohortComparison && (
                    <polygon
                        points={cohortPoints}
                        fill="rgba(59, 130, 246, 0.08)"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="opacity-75"
                    />
                )}

                {/* Student Mastery Polygon (Vibrant Amber / Yellow) */}
                <polygon
                    points={studentPoints}
                    fill="url(#radarYellowGradient)"
                    stroke="#eab308"
                    strokeWidth="2.5"
                    filter="url(#radarGlow)"
                    className="transition-all duration-500 ease-out"
                />

                {/* Axis Vertices & Interactive Dots */}
                {skills.map((s, i) => {
                    const { x, y } = getCoordinates(i, s.mastery);
                    const isHovered = hoveredSkill?.id === s.id;
                    const isWeak = s.mastery < 50;

                    return (
                        <g
                            key={s.id}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredSkill(s)}
                            onMouseLeave={() => setHoveredSkill(null)}
                        >
                            <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 6 : 4}
                                fill={isWeak ? '#ef4444' : '#f59e0b'}
                                stroke="#18181b"
                                strokeWidth="2"
                                className="transition-all duration-200"
                            />
                        </g>
                    );
                })}

                {/* Axis Labels (Placed outside radius) */}
                {skills.map((s, i) => {
                    const labelDistance = radius + (size > 300 ? 24 : 18);
                    const angle = (i * 2 * Math.PI) / numAxes - Math.PI / 2;
                    const lx = cx + labelDistance * Math.cos(angle);
                    const ly = cy + labelDistance * Math.sin(angle);

                    const isWeak = s.mastery < 50;
                    const isHovered = hoveredSkill?.id === s.id;

                    return (
                        <g
                            key={`label-${s.id}`}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredSkill(s)}
                            onMouseLeave={() => setHoveredSkill(null)}
                        >
                            <text
                                x={lx}
                                y={ly}
                                textAnchor={Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end'}
                                dominantBaseline="central"
                                className={`text-[10px] font-mono font-bold select-none transition-colors ${
                                    isHovered
                                        ? 'fill-accent-yellow font-bold'
                                        : isWeak
                                        ? 'fill-red-400'
                                        : 'fill-text-primary'
                                }`}
                            >
                                {s.shortCode} ({s.mastery}%)
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredSkill && (
                <div className="absolute bottom-2 px-3 py-1.5 rounded-xl bg-surface-card/95 border border-accent-yellow/50 text-center shadow-lg backdrop-blur-sm pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-xs font-bold text-text-primary">
                        {hoveredSkill.name}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[11px] font-mono mt-0.5">
                        <span className="text-accent-yellow font-bold">
                            Votre maîtrise : {hoveredSkill.mastery}%
                        </span>
                        <span className="text-text-muted">•</span>
                        <span className="text-blue-400">
                            Promo : {hoveredSkill.cohortAverage}%
                        </span>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] font-mono text-text-secondary">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-accent-yellow/80 border border-yellow-500 shrink-0" />
                    <span>Votre Niveau</span>
                </div>
                {showCohortComparison && (
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-blue-500 border-t border-dashed border-blue-400 shrink-0" />
                        <span>Moyenne Promo CESI</span>
                    </div>
                )}
            </div>
        </div>
    );
}
