'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
    distance?: number;
    delay?: number;
    duration?: number;
    once?: boolean;
    margin?: string;
    className?: string;
}

export function ScrollReveal({
    children,
    direction = 'up',
    distance = 28,
    delay = 0,
    duration = 0.6,
    once = true,
    margin = '-60px',
    className = '',
    ...props
}: ScrollRevealProps) {
    const getInitialProps = () => {
        switch (direction) {
            case 'up':
                return { opacity: 0, y: distance };
            case 'down':
                return { opacity: 0, y: -distance };
            case 'left':
                return { opacity: 0, x: distance };
            case 'right':
                return { opacity: 0, x: -distance };
            case 'scale':
                return { opacity: 0, scale: 0.95 };
            case 'none':
                return { opacity: 0 };
            default:
                return { opacity: 0, y: distance };
        }
    };

    const getAnimateProps = () => {
        switch (direction) {
            case 'up':
            case 'down':
                return { opacity: 1, y: 0 };
            case 'left':
            case 'right':
                return { opacity: 1, x: 0 };
            case 'scale':
                return { opacity: 1, scale: 1 };
            case 'none':
                return { opacity: 1 };
            default:
                return { opacity: 1, y: 0 };
        }
    };

    return (
        <motion.div
            initial={getInitialProps()}
            whileInView={getAnimateProps()}
            viewport={{ once, margin: margin as `${number}px` | `${number}%` }}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1]
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
