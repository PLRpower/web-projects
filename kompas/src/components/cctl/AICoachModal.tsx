'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Sparkles,
    Brain,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Send,
    Bot,
    Loader2,
    X,
    Lightbulb,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CCTLQuestion } from '@/types/cctl';
import { CoachExplanationResponse } from '@/lib/ai-cctl-generator';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { CodeBlock } from '@/components/cctl/CodeBlock';

interface AICoachModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: CCTLQuestion;
    studentAnswerText?: string;
    isCorrect?: boolean;
}

export function AICoachModal({
    isOpen,
    onClose,
    question,
    studentAnswerText,
    isCorrect = false
}: AICoachModalProps) {
    const [explanation, setExplanation] = useState<CoachExplanationResponse | null>(null);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to determine if a choice was selected by the student
    const isChoiceSelected = (choice: { id: string; text?: string }) => {
        if (!studentAnswerText) return false;
        const cleanStudent = studentAnswerText.trim().toLowerCase();
        const cleanId = choice.id.trim().toLowerCase();
        const cleanText = (choice.text || '').trim().toLowerCase();

        if (cleanStudent === cleanId) return true;
        if (cleanStudent.startsWith(`${cleanId}.`) || cleanStudent.startsWith(`${cleanId} `) || cleanStudent.startsWith(`${cleanId}:`)) return true;
        if (cleanStudent.includes(` ${cleanId}.`) || cleanStudent.includes(` ${cleanId},`) || cleanStudent.includes(`, ${cleanId}`) || cleanStudent.includes(`(${cleanId})`)) return true;
        if (cleanText && cleanStudent.includes(cleanText)) return true;
        return false;
    };

    const isShortAnswer = question.type === 'fill_blank' || question.type === 'short_answer';
    const isMatching = question.type === 'matching';

    // Live Coach Chat State
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isSendingChat, setIsSendingChat] = useState(false);
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // Fetch AI Coach explanation on open
    useEffect(() => {
        if (isOpen && question) {
            fetchExplanation();
        } else {
            // Reset state
            setExplanation(null);
            setChatMessages([]);
            setInputMessage('');
            setError(null);
        }
    }, [isOpen, question?.id]);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isSendingChat]);

    const fetchExplanation = async () => {
        setIsLoadingExplanation(true);
        setError(null);

        try {
            const res = await fetch('/api/cctl/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    studentAnswerText,
                    isCorrect
                })
            });

            const data = await res.json();
            if (!res.ok || !data.success || !data.explanation) {
                throw new Error(data.error || 'Impossible de générer l\'explication du Coach IA.');
            }

            setExplanation(data.explanation);
        } catch (e: any) {
            console.error('Coach explanation error:', e);
            setError(e?.message || 'Erreur de connexion avec le Coach IA.');
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    const handleSendChatMessage = async (msgToSend?: string) => {
        const message = (msgToSend || inputMessage).trim();
        if (!message || isSendingChat) return;

        const newHistory = [...chatMessages, { role: 'user' as const, content: message }];
        setChatMessages(newHistory);
        setInputMessage('');
        setIsSendingChat(true);

        const expectedText = question.choices.find(c => c.isExpected)?.text || question.fillBlanks?.[0]?.expectedText || '';

        try {
            const res = await fetch('/api/cctl/coach-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionContext: {
                        prompt: question.prompt,
                        codeSnippet: question.codeSnippet,
                        expectedAnswer: expectedText,
                        explanation: question.explanation
                    },
                    userMessage: message,
                    conversationHistory: chatMessages
                })
            });

            const data = await res.json();
            if (data.success && data.reply) {
                setChatMessages([...newHistory, { role: 'assistant', content: data.reply }]);
            } else {
                setChatMessages([...newHistory, { role: 'assistant', content: 'Je suis à votre écoute. Pouvez-vous reformuler votre question ?' }]);
            }
        } catch (e) {
            console.error('Chat error:', e);
            setChatMessages([...newHistory, { role: 'assistant', content: 'Désolé, une brève interruption s\'est produite. Réessayez dans un instant.' }]);
        } finally {
            setIsSendingChat(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-border/80 bg-gradient-to-r from-accent-yellow/15 via-surface-card to-surface-card flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-accent-yellow text-black flex items-center justify-center font-bold shadow-md shadow-accent-yellow/20 shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg sm:text-xl font-serif font-normal text-text-primary">
                                    Coach IA Pas-à-Pas
                                </h3>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-yellow/20 text-accent-yellow border border-accent-yellow/30 uppercase">
                                    Tuteur 24/7
                                </span>
                            </div>
                            <p className="text-xs text-text-secondary">
                                Explication du raisonnement, pièges déjoués &amp; tuteur interactif 24/7.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                        title="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
                    {/* Complete CCTL Question & Choices Card */}
                    <div className="card-editorial rounded-2xl p-5 sm:p-6 space-y-4 bg-surface border border-border shadow-sm">
                        {/* Header: Badges & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-border/60 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-accent-yellow text-black font-mono font-bold text-xs shadow-xs">
                                    Q{question.number < 10 ? `0${question.number}` : question.number}
                                </span>
                                {question.sectionTitle && (
                                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                                        {question.sectionTitle}
                                    </span>
                                )}
                                <span className="text-[11px] font-mono text-text-secondary px-2 py-0.5 rounded-md bg-surface-highlight border border-border">
                                    {question.typeLabel || 'QCM'}
                                </span>
                            </div>

                            <span
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full border ${
                                    isCorrect
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                        : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                                }`}
                            >
                                {isCorrect ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Réponse Validée (+1 pt)
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-3.5 h-3.5" />
                                        Réponse Incorrecte / À Réviser
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Statement / Prompt */}
                        <p className="text-sm sm:text-base font-semibold text-text-primary leading-relaxed whitespace-pre-line select-text">
                            {question.prompt}
                        </p>

                        {/* Math Formula Image if present */}
                        {(question.formulaImageUrl || (question.promptImageUrl && question.hasPromptFormula)) && (
                            <div className="inline-flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-border shadow-xs">
                                <span className="text-[10px] font-mono font-bold text-text-muted">Formule :</span>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={question.formulaImageUrl || question.promptImageUrl}
                                    alt="Formule de l'énoncé"
                                    className="max-h-12 w-auto object-contain dark:invert rounded"
                                />
                            </div>
                        )}

                        {/* Code Snippet if present */}
                        {question.codeSnippet && (
                            <CodeBlock
                                code={question.codeSnippet}
                                language={question.codeLanguage || 'javascript'}
                            />
                        )}

                        {/* QCM Choices List (Single & Multiple Choice) */}
                        {!isShortAnswer && !isMatching && question.choices && question.choices.length > 0 && (
                            <div className="space-y-2 pt-1">
                                {question.choices.map((choice) => {
                                    const isSelected = isChoiceSelected(choice);
                                    const isExpected = choice.isExpected;

                                    let choiceCardStyle = 'bg-surface-card/60 border border-border/70 text-text-primary';
                                    let textStyle = 'text-text-primary font-medium';
                                    let badgeText: string | null = null;
                                    let badgeColor = '';
                                    let idBadgeStyle = 'bg-surface-highlight text-text-secondary border border-border';

                                    if (isExpected && isSelected) {
                                        choiceCardStyle = 'bg-emerald-500/10 border-2 border-emerald-500 ring-1 ring-emerald-500/30 dark:bg-emerald-500/15 dark:border-emerald-400 shadow-xs';
                                        textStyle = 'text-emerald-800 dark:text-emerald-300 font-bold';
                                        badgeText = '✓ Votre choix (Bonne réponse)';
                                        badgeColor = 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold';
                                        idBadgeStyle = 'bg-emerald-500/20 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200 border border-emerald-500/40';
                                    } else if (isExpected && !isSelected) {
                                        choiceCardStyle = 'bg-emerald-500/10 border-2 border-emerald-500 ring-1 ring-emerald-500/30 dark:bg-emerald-500/15 dark:border-emerald-400 shadow-xs';
                                        textStyle = 'text-emerald-800 dark:text-emerald-300 font-bold';
                                        badgeText = '✓ Réponse attendue';
                                        badgeColor = 'bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold';
                                        idBadgeStyle = 'bg-emerald-500/20 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200 border border-emerald-500/40';
                                    } else if (!isExpected && isSelected) {
                                        choiceCardStyle = 'bg-red-500/10 border-2 border-red-500 ring-1 ring-red-500/30 dark:bg-red-500/15 dark:border-red-400 shadow-xs';
                                        textStyle = 'text-red-800 dark:text-red-300 font-bold';
                                        badgeText = '✗ Votre choix (Incorrect)';
                                        badgeColor = 'bg-red-500/15 text-red-800 dark:bg-red-500/20 dark:text-red-300 border border-red-500/30 font-semibold';
                                        idBadgeStyle = 'bg-red-500/20 text-red-800 dark:bg-red-500/25 dark:text-red-200 border border-red-500/40';
                                    }

                                    return (
                                        <div
                                            key={choice.id}
                                            className={`p-3.5 rounded-xl transition-all flex items-start gap-3 text-xs sm:text-sm ${choiceCardStyle}`}
                                        >
                                            {/* Choice Badge (A, B, C, D) */}
                                            <div
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 shadow-xs ${idBadgeStyle}`}
                                            >
                                                {choice.id}
                                            </div>

                                            {/* Choice Text or Image */}
                                            <div className="flex-1 leading-relaxed space-y-1">
                                                {choice.imageUrl && !choice.text ? (
                                                    <div className="py-0.5">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={choice.imageUrl}
                                                            alt={`Formule proposition ${choice.id}`}
                                                            className="max-h-12 w-auto object-contain dark:invert rounded"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className={textStyle}>
                                                        {choice.text || `Proposition ${choice.id}`}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Result Status Badge */}
                                            {badgeText && (
                                                <span className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg shrink-0 shadow-xs ${badgeColor}`}>
                                                    {badgeText}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Matching Pairs (Associations) */}
                        {isMatching && question.matchingPairs && question.matchingPairs.length > 0 && (
                            <div className="space-y-2 pt-1 text-xs">
                                {question.matchingPairs.map((pair) => (
                                    <div
                                        key={pair.id}
                                        className="p-3 rounded-xl bg-surface-card border border-border/80 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-2 font-mono">
                                            <span className="w-5 h-5 rounded bg-surface-highlight border border-border flex items-center justify-center text-[10px] font-bold text-text-muted">
                                                {pair.id}
                                            </span>
                                            <span className="text-text-primary font-semibold">{pair.leftItem}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="w-3.5 h-3.5 text-accent-yellow" />
                                            <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 font-mono font-semibold text-[11px] shadow-xs">{pair.rightExpected}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Short Answer / Fill in the blank */}
                        {isShortAnswer && (
                            <div className="p-3.5 rounded-xl bg-surface-card border border-border space-y-2 text-xs">
                                {studentAnswerText && (
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-text-muted font-mono uppercase text-[10px] font-bold">Votre réponse saisie :</span>
                                        <span className={`font-mono font-bold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                                            {studentAnswerText}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-1.5">
                                    <span className="text-emerald-700 dark:text-emerald-400 font-mono uppercase text-[10px] font-bold">Réponse attendue :</span>
                                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-lg">
                                        {question.fillBlanks?.[0]?.expectedText || question.choices?.find(c => c.isExpected)?.text || 'Réponse officielle'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {isLoadingExplanation ? (
                        <div className="py-16 flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-accent-yellow/10 border border-accent-yellow/30 flex items-center justify-center text-accent-yellow animate-bounce">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="text-sm font-bold text-text-primary flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-accent-yellow" />
                                    Le Coach IA génère votre explication...
                                </h4>
                                <p className="text-xs text-text-secondary">
                                    Détection du piège, analyse logique et rédaction de la démonstration pas-à-pas.
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-xs space-y-4">
                            <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold text-sm">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span>Échec de la génération par l&apos;IA</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-surface/80 border border-red-500/20 font-mono text-[11px] text-text-primary leading-relaxed">
                                {error}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                                <p className="text-[11px] text-text-secondary">
                                    Aucun faux contenu de secours n&apos;a été substitué pour garantir la rigueur de vos révisions.
                                </p>
                                <Button size="sm" variant="outline" onClick={fetchExplanation} className="font-bold border-red-500/40 hover:bg-red-500/10 text-red-500 cursor-pointer shrink-0">
                                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Réessayer la requête
                                </Button>
                            </div>
                        </div>
                    ) : explanation ? (
                        <div className="space-y-6">
                            {/* Block 1: Trap & Diagnosis */}
                            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>1. Diagnostic &amp; Piège déjoué</span>
                                </div>
                                <div className="text-text-primary text-xs sm:text-sm leading-relaxed">
                                    <MarkdownRenderer content={explanation.diagnosis} />
                                </div>
                            </div>

                            {/* Block 2: Methodical Step-by-Step Reasoning */}
                            <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 text-accent-yellow font-bold uppercase tracking-wider text-xs">
                                    <Lightbulb className="w-4 h-4" />
                                    <span>2. Raisonnement Pas-à-Pas &amp; Démonstration</span>
                                </div>
                                <div className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                                    <MarkdownRenderer content={explanation.demonstration} />
                                </div>
                            </div>

                            {/* Block 3: Mnemonic Tip */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-yellow/20 via-surface to-accent-orange/10 border border-accent-yellow/40 space-y-1.5">
                                <div className="flex items-center gap-1.5 text-accent-yellow font-bold uppercase tracking-wider text-xs">
                                    <Brain className="w-4 h-4" />
                                    <span>3. Astuce Mnémo CESI (Le jour de l&apos;examen)</span>
                                </div>
                                <div className="text-xs sm:text-sm text-text-primary font-medium leading-relaxed">
                                    <MarkdownRenderer content={explanation.mnemonicTip} />
                                </div>
                            </div>

                            {/* Block 4: Interactive Coach Live Chat */}
                            <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-accent-yellow" />
                                        <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                                            Poser une question au Coach sur ce sujet
                                        </h4>
                                    </div>
                                    <span className="text-[10px] font-mono text-text-muted">Chat IA en direct</span>
                                </div>

                                {/* Suggested Prompts */}
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Pourquoi l'option fausse est-elle un piège ?",
                                        "Donne-moi un exemple concret en code",
                                        "Comment retenir cette notion facilement ?"
                                    ].map((sug, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSendChatMessage(sug)}
                                            className="px-2.5 py-1 rounded-lg bg-surface-highlight hover:bg-surface border border-border/60 text-[11px] text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                                        >
                                            {sug}
                                        </button>
                                    ))}
                                </div>

                                {/* Chat conversation thread */}
                                {chatMessages.length > 0 && (
                                    <div className="space-y-3 max-h-60 overflow-y-auto p-2 bg-surface-card rounded-xl border border-border/40 text-xs">
                                        {chatMessages.map((msg, mIdx) => (
                                            <div
                                                key={mIdx}
                                                className={`flex items-start gap-2.5 ${
                                                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                {msg.role === 'assistant' && (
                                                    <div className="w-6 h-6 rounded-md bg-accent-yellow/20 text-accent-yellow flex items-center justify-center shrink-0 font-bold">
                                                        <Bot className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                                                        msg.role === 'user'
                                                            ? 'bg-accent-yellow text-black font-semibold rounded-br-none'
                                                            : 'bg-surface border border-border text-text-primary rounded-bl-none'
                                                    }`}
                                                >
                                                    <MarkdownRenderer content={msg.content} />
                                                </div>
                                            </div>
                                        ))}
                                        {isSendingChat && (
                                            <div className="flex items-center gap-2 text-text-muted text-xs p-2">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-yellow" />
                                                <span>Le Coach rédige sa réponse...</span>
                                            </div>
                                        )}
                                        <div ref={chatBottomRef} />
                                    </div>
                                )}

                                {/* Chat Input Bar */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                                        placeholder="Ex: Peux-tu détailler le cas d'erreur ?"
                                        className="flex-1 h-10 rounded-xl bg-surface-card border border-border px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                                    />
                                    <Button
                                        size="sm"
                                        variant="premium"
                                        onClick={() => handleSendChatMessage()}
                                        disabled={!inputMessage.trim() || isSendingChat}
                                        className="h-10 px-4"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/80 bg-surface/50 flex items-center justify-between gap-3 text-xs">
                    <span className="text-text-muted flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent-yellow" />
                        Tuteur IA disponible en continu sur tous les CCTLs.
                    </span>
                    <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
                        Terminer &amp; Continuer le test
                    </Button>
                </div>
            </div>
        </div>
    );
}
