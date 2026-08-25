'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface LogoProps {
    size?: number;
    className?: string;
    showText?: boolean;
    priority?: boolean;
}

export function Logo({ size = 32, className = '', showText = false, priority = false }: LogoProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === 'dark' : true;
    const logoSrc = isDark ? '/img/logo-dark.png' : '/img/logo-light.png';

    return (
        <div className={cn("inline-flex items-center gap-2.5 transition-transform duration-200 ease-out group-hover:scale-105 origin-center", className)}>
            <div
                className="relative shrink-0 flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <Image
                    src={logoSrc}
                    alt="Kompas | CESI"
                    width={size}
                    height={size}
                    priority={priority}
                    className="w-full h-full object-contain"
                />
            </div>
            {showText && (
                <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-xl tracking-tight text-text-primary">
                        Kompas
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-accent-yellow/20 text-accent-yellow px-1.5 py-0.5 rounded border border-accent-yellow/30">
                        CESI
                    </span>
                </div>
            )}
        </div>
    );
}

export default Logo;
