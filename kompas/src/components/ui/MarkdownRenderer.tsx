'use client';

import React from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    if (!content) return null;

    // Parse blocks (paragraphs, lists, code blocks, headings)
    const renderFormattedText = (text: string) => {
        // Split by code tags or bold tags or inline code
        const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code
                        key={index}
                        className="px-1.5 py-0.5 mx-0.5 rounded-md bg-surface-highlight border border-border/80 font-mono text-[0.85em] text-accent-yellow font-bold"
                    >
                        {part.slice(1, -1)}
                    </code>
                );
            }
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={index} className="font-bold text-text-primary">
                        {part.slice(2, -2)}
                    </strong>
                );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return (
                    <em key={index} className="italic text-text-secondary">
                        {part.slice(1, -1)}
                    </em>
                );
            }
            return part;
        });
    };

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockLines: string[] = [];

    const flushList = () => {
        if (currentList) {
            if (currentList.type === 'ul') {
                elements.push(
                    <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2">
                        {currentList.items.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                    </ul>
                );
            } else {
                elements.push(
                    <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-2 pl-2">
                        {currentList.items.map((item, idx) => (
                            <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                    </ol>
                );
            }
            currentList = null;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block start / end
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                flushList();
                inCodeBlock = true;
                codeBlockLang = line.trim().slice(3).trim();
                codeBlockLines = [];
            } else {
                inCodeBlock = false;
                elements.push(
                    <div
                        key={`code-${elements.length}`}
                        className="my-3 p-3.5 rounded-2xl bg-surface border border-border/80 font-mono text-xs overflow-x-auto text-text-primary shadow-sm"
                    >
                        {codeBlockLang && (
                            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block mb-1">
                                {codeBlockLang}
                            </span>
                        )}
                        <pre className="m-0 leading-relaxed">{codeBlockLines.join('\n')}</pre>
                    </div>
                );
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
        }

        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
            flushList();
            continue;
        }

        // Headings (###, ##, #)
        if (trimmed.startsWith('### ')) {
            flushList();
            elements.push(
                <h4 key={`h4-${elements.length}`} className="text-sm font-bold text-text-primary mt-3 mb-1">
                    {renderFormattedText(trimmed.slice(4))}
                </h4>
            );
            continue;
        }
        if (trimmed.startsWith('## ')) {
            flushList();
            elements.push(
                <h3 key={`h3-${elements.length}`} className="text-base font-bold text-text-primary mt-4 mb-2">
                    {renderFormattedText(trimmed.slice(3))}
                </h3>
            );
            continue;
        }

        // Unordered list item (- or *)
        const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
        if (ulMatch) {
            if (!currentList || currentList.type !== 'ul') {
                flushList();
                currentList = { type: 'ul', items: [] };
            }
            currentList.items.push(renderFormattedText(ulMatch[2]));
            continue;
        }

        // Ordered list item (1. or 2.)
        const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
        if (olMatch) {
            if (!currentList || currentList.type !== 'ol') {
                flushList();
                currentList = { type: 'ol', items: [] };
            }
            currentList.items.push(renderFormattedText(olMatch[2]));
            continue;
        }

        // Regular paragraph line
        flushList();
        elements.push(
            <p key={`p-${elements.length}`} className="leading-relaxed mb-2 last:mb-0">
                {renderFormattedText(trimmed)}
            </p>
        );
    }

    flushList();

    return <div className={`space-y-1.5 ${className}`}>{elements}</div>;
}
