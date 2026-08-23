'use client';

import { useMemo } from 'react';
import { generateQRCodeMatrix } from '@/lib/qr-generator';

interface QRCodeSVGProps {
    value: string;
    size?: number;
    className?: string;
    bgColor?: string;
    fgColor?: string;
}

export function QRCodeSVG({
    value,
    size = 200,
    className = '',
    bgColor = '#FFFFFF',
    fgColor = '#0A0A0B'
}: QRCodeSVGProps) {
    const matrix = useMemo(() => {
        try {
            return generateQRCodeMatrix(value);
        } catch (e) {
            console.error('Error generating QR matrix:', e);
            return [];
        }
    }, [value]);

    if (!matrix || matrix.length === 0) return null;

    const moduleCount = matrix.length;
    const quietZone = 2; // margin in modules
    const viewBoxSize = moduleCount + quietZone * 2;

    // Generate SVG path for dark modules
    let path = '';
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (matrix[r][c]) {
                const x = c + quietZone;
                const y = r + quietZone;
                path += `M${x},${y}h1v1h-1z `;
            }
        }
    }

    return (
        <div className={`inline-block p-3 rounded-2xl bg-white shadow-xl ${className}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                width={size}
                height={size}
                shapeRendering="crispEdges"
                className="block w-full h-full"
            >
                <rect width="100%" height="100%" fill={bgColor} />
                <path d={path} fill={fgColor} />
            </svg>
        </div>
    );
}
