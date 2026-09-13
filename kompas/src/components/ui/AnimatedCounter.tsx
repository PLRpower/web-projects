'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    formatter?: (val: number) => string;
    className?: string;
}

export function AnimatedCounter({
    value,
    duration = 1.6,
    formatter = (val) => Math.round(val).toLocaleString('fr-FR'),
    className = ''
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        stiffness: 70,
        damping: 25,
        restDelta: 0.5
    });
    const isInView = useInView(ref, { once: true, margin: '-40px' });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = formatter(latest);
            }
        });
        return () => unsubscribe();
    }, [springValue, formatter]);

    return (
        <span ref={ref} className={className}>
            {formatter(0)}
        </span>
    );
}
