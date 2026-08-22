'use client';

import { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
}

export function CodeBlock({ code, language = 'javascript', className = '' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error('Failed to copy code:', e);
        }
    };

    const lines = code.split('\n');

    return (
        <div className={`my-3 rounded-xl overflow-hidden border border-border/80 bg-[#12100E] text-[#F3F4F6] shadow-md ${className}`}>
            {/* Code Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-border/40 text-xs">
                <div className="flex items-center gap-2 text-text-secondary font-mono">
                    <Code2 className="w-3.5 h-3.5 text-accent-yellow" />
                    <span className="uppercase tracking-wider font-semibold text-[11px] text-accent-yellow/90">
                        {language}
                    </span>
                    <span className="text-text-secondary/50">• {lines.length} lignes</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-highlight/30 hover:bg-surface-highlight/60 text-text-secondary hover:text-text-primary transition-all text-xs font-medium"
                    title="Copier le code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-green-400 text-[11px]">Copié !</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copier</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed">
                <table className="w-full border-collapse">
                    <tbody>
                        {lines.map((line, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                                <td className="pr-4 py-0.5 select-none text-right text-text-secondary/40 text-[11px] w-6 align-top">
                                    {idx + 1}
                                </td>
                                <td className="py-0.5 font-mono whitespace-pre text-yellow-100/90 align-top">
                                    {line}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
