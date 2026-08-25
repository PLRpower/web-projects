'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    HelpCircle,
    Code2,
    Layers,
    ArrowRight,
    ArrowRightLeft,
    Check,
    RotateCcw,
    Sparkles,
    Eye,
    EyeOff
} from 'lucide-react';
import { CCTLQuestion, CCTLChoice } from '@/types/cctl';
import { CodeBlock } from './CodeBlock';
import { Button } from '@/components/ui/button';
import { AICoachModal } from './AICoachModal';

interface CCTLQuestionCardProps {
    question: CCTLQuestion;
    mode: 'review' | 'practice';
    onUpdateQuestion?: (updated: CCTLQuestion) => void;
    hideQuestionNumber?: boolean;
    displayIndex?: number;
}

export function CCTLQuestionCard({
    question,
    mode,
    onUpdateQuestion,
    hideQuestionNumber = false,
    displayIndex
}: CCTLQuestionCardProps) {
    // State for practice / training mode
    const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
    const [hasSubmittedPractice, setHasSubmittedPractice] = useState(false);
    const [showCorrectionInPractice, setShowCorrectionInPractice] = useState(false);
    const [isCoachOpen, setIsCoachOpen] = useState(false);

    const isMultiple = question.type === 'multiple_choice';
    const isNumerical = question.type === 'numerical';
    const hasMatchingPairs = Boolean(question.matchingPairs && question.matchingPairs.length > 0);
    const isMatching = (question.type === 'matching' || (isNumerical && hasMatchingPairs)) && hasMatchingPairs;
    const isShortAnswer = question.type === 'short_answer' || question.type === 'fill_blank' || (isNumerical && !hasMatchingPairs);

    const expectedAnswerText = question.choices.find(c => c.isExpected)?.text || question.fillBlanks?.[0]?.expectedText || '';

    const checkNumericalMatch = (input: string, intervalStr: string) => {
        const cleanInput = input.trim().replace(',', '.');
        const numVal = parseFloat(cleanInput);
        const intMatch = intervalStr.match(/([\[\]])\s*(-?\d+(?:\.\d+)?)\s*;\s*(-?\d+(?:\.\d+)?)\s*([\[\]])/);
        if (intMatch && !isNaN(numVal)) {
            const leftBracket = intMatch[1];
            const minVal = parseFloat(intMatch[2]);
            const maxVal = parseFloat(intMatch[3]);
            const rightBracket = intMatch[4];

            const leftOk = leftBracket === '[' ? numVal >= minVal : numVal > minVal;
            const rightOk = rightBracket === ']' ? numVal <= maxVal : numVal < maxVal;
            return leftOk && rightOk;
        }
        return input.trim().toLowerCase() === intervalStr.trim().toLowerCase();
    };

    const handleTogglePracticeChoice = (choiceId: string) => {
        if (hasSubmittedPractice) return;
        if (isMultiple) {
            setSelectedChoiceIds(prev =>
                prev.includes(choiceId) ? prev.filter(id => id !== choiceId) : [...prev, choiceId]
            );
        } else {
            setSelectedChoiceIds([choiceId]);
        }
    };

    const handlePracticeSubmit = () => {
        setHasSubmittedPractice(true);
        setShowCorrectionInPractice(true);
    };

    const handlePracticeReset = () => {
        setSelectedChoiceIds([]);
        setTypedAnswer('');
        setMatchingAnswers({});
        setHasSubmittedPractice(false);
        setShowCorrectionInPractice(false);
    };

    // Calculate practice result
    const expectedIds = question.choices.filter(c => c.isExpected).map(c => c.id);
    const isPracticeFullyCorrect = isShortAnswer
        ? (isNumerical ? checkNumericalMatch(typedAnswer, expectedAnswerText) : typedAnswer.trim().toLowerCase() === expectedAnswerText.trim().toLowerCase())
        : isMatching
        ? (question.matchingPairs?.every(p => (matchingAnswers[p.id] || '').trim().toLowerCase() === p.rightExpected.trim().toLowerCase()) ?? false)
        : (selectedChoiceIds.length === expectedIds.length && selectedChoiceIds.every(id => expectedIds.includes(id)));

    // Badge styling helper - Uniform Neutral Gray
    const getTypeBadge = () => {
        const neutralGrayClass = 'bg-surface-highlight text-text-secondary border-border/70 font-medium';

        switch (question.type) {
            case 'numerical':
                return {
                    label: isMatching ? 'Valeurs numériques (Multi-parties)' : 'Valeur numérique / Intervalle',
                    className: neutralGrayClass
                };
            case 'short_answer':
                return {
                    label: mode === 'practice' ? 'Réponse ouverte & courte' : 'Question ouverte & courte',
                    className: neutralGrayClass
                };
            case 'single_choice':
                return {
                    label: mode === 'practice' ? 'Réponse à choix unique' : 'QCM Réponse Unique',
                    className: neutralGrayClass
                };
            case 'multiple_choice':
                return {
                    label: 'Réponse à choix multiples',
                    className: neutralGrayClass
                };
            case 'matching':
                return {
                    label: 'Association d\'éléments',
                    className: neutralGrayClass
                };
            case 'fill_blank':
                return {
                    label: 'Texte à trous / Saisie',
                    className: neutralGrayClass
                };
            case 'image_matching':
                return {
                    label: 'Association Visuelle / Image',
                    className: neutralGrayClass
                };
            default:
                return {
                    label: question.typeLabel || 'Question',
                    className: neutralGrayClass
                };
        }
    };

    const getStatusBadge = () => {
        if (mode === 'review') {
            return (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Corrigé
                </span>
            );
        }
        return null;
    };

    const typeBadge = getTypeBadge();

    const resolvedStudentAnswerText = isShortAnswer
        ? typedAnswer
        : isMatching
        ? Object.entries(matchingAnswers).map(([k, v]) => `${k} -> ${v}`).join(', ')
        : question.choices.filter(c => selectedChoiceIds.includes(c.id)).map(c => `${c.id}. ${c.text}`).join(', ');

    return (
        <div className="card-editorial rounded-3xl p-6 sm:p-7 space-y-5 bg-surface-card transition-all duration-200 hover:border-accent-yellow">
            {/* Header: Question Number on Left, Type Badge and Status on Right */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5 flex-wrap">
                    {!hideQuestionNumber ? (
                        <span className="flex items-center justify-center px-2.5 py-1 rounded-lg bg-accent-yellow text-black font-mono font-bold text-xs shadow-xs">
                            Q{question.number < 10 ? `0${question.number}` : question.number}
                        </span>
                    ) : (
                        <span className="flex items-center justify-center px-2.5 py-1 rounded-lg bg-accent-yellow text-black font-mono font-bold text-xs shadow-xs tracking-wider">
                            Q##
                        </span>
                    )}
                    {!hideQuestionNumber && question.sectionTitle && (
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                            {question.sectionTitle} {question.sectionQuestionNumber ? `• Q${question.sectionQuestionNumber}` : ''}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-surface text-text-secondary border border-border">
                        {typeBadge.label}
                    </span>
                    {mode === 'review' ? (
                        getStatusBadge()
                    ) : (
                        hasSubmittedPractice && (
                            <span
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                                    isPracticeFullyCorrect
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                                }`}
                            >
                                {isPracticeFullyCorrect ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Correct (+1 pt)
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-3.5 h-3.5" />
                                        Incorrect
                                    </>
                                )}
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Prompt & Statement (100% Copyable / Selectable Text) */}
            <div className="space-y-3">
                <p className="text-base sm:text-lg font-medium text-text-primary leading-relaxed whitespace-pre-line select-text">
                    {question.prompt}
                </p>

                {/* Inline isolated formula crop when prompt has missing vector formulas */}
                {(question.formulaImageUrl || (question.promptImageUrl && question.hasPromptFormula)) && (
                    <div className="inline-flex items-center gap-3 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-white dark:bg-zinc-950 border border-border/80 shadow-xs max-w-full overflow-x-auto">
                        <span className="text-[11px] font-mono font-bold text-text-muted shrink-0">Formule :</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={question.formulaImageUrl || question.promptImageUrl}
                            alt="Formule mathématique de l'énoncé"
                            className="max-h-14 sm:max-h-16 w-auto object-contain dark:invert rounded"
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
            </div>

            {/* Short Answer / Fill Blank Input (Practice & Review) */}
            {isShortAnswer && (
                <div className="space-y-3 pt-1">
                    {mode === 'practice' ? (
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-text-muted">
                                    Votre réponse libre :
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={typedAnswer}
                                        onChange={(e) => !hasSubmittedPractice && setTypedAnswer(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && typedAnswer.trim() && !hasSubmittedPractice) {
                                                handlePracticeSubmit();
                                            }
                                        }}
                                        disabled={hasSubmittedPractice}
                                        placeholder="Tapez votre réponse ici..."
                                        className={`flex-1 h-12 rounded-2xl bg-surface border px-4 text-sm font-medium text-text-primary focus:outline-none transition-all ${
                                            hasSubmittedPractice
                                                ? isPracticeFullyCorrect
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
                                                : 'border-border focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20'
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Practice Correction for Short Answer */}
                            {showCorrectionInPractice && (
                                <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5 text-xs">
                                    <span className="font-mono text-[10px] uppercase text-text-muted">Réponse attendue :</span>
                                    <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                                        {expectedAnswerText}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Review Mode for Short Answer */
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 dark:bg-emerald-500/15 flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase text-text-muted">Réponse attendue</span>
                                <p className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
                                    {expectedAnswerText}
                                </p>
                            </div>
                            <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs shrink-0">
                                <Check className="w-4 h-4" /> Réponse attendue
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Matching Pairs (Association Cards) */}
            {isMatching && question.matchingPairs && question.matchingPairs.length > 0 && (
                <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 gap-3">
                        {question.matchingPairs.map((pair) => {
                            const studentSelection = matchingAnswers[pair.id] || '';
                            const isItemPracticeCorrect = studentSelection.trim().toLowerCase() === pair.rightExpected.trim().toLowerCase();

                            return (
                                <div
                                    key={pair.id}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        mode === 'review'
                                            ? 'bg-surface/80 border-border/80 hover:border-emerald-500/40'
                                            : hasSubmittedPractice
                                            ? isItemPracticeCorrect
                                                ? 'bg-emerald-500/10 border-emerald-500/40'
                                                : 'bg-red-500/10 border-red-500/40'
                                            : 'bg-surface border-border/70 hover:border-accent-yellow/40'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                                        {/* Left: Proposition / Élément à associer */}
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <span className="w-6 h-6 rounded-lg bg-surface-highlight border border-border flex items-center justify-center text-xs font-mono font-bold text-text-muted shrink-0 mt-0.5">
                                                {pair.id}
                                            </span>
                                            <div className="font-mono text-xs sm:text-sm font-semibold text-text-primary break-words leading-relaxed">
                                                {pair.leftItem}
                                            </div>
                                        </div>

                                        {/* Center: Arrow Connector */}
                                        <div className="hidden md:flex items-center text-accent-yellow shrink-0 px-2 opacity-70">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>

                                        {/* Right: Association Target */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 md:justify-end">
                                            {mode === 'review' ? (
                                                /* Bonne Association Attendue */
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
                                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                    <span>{pair.rightExpected}</span>
                                                </div>
                                            ) : (
                                                /* Practice Mode Dropdown / Selection */
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <select
                                                        value={studentSelection}
                                                        onChange={(e) => {
                                                            if (hasSubmittedPractice) return;
                                                            setMatchingAnswers(prev => ({
                                                                ...prev,
                                                                [pair.id]: e.target.value
                                                            }));
                                                        }}
                                                        disabled={hasSubmittedPractice}
                                                        className={`w-full sm:w-64 h-10 bg-surface border rounded-xl px-3 text-xs font-mono font-semibold focus:outline-none transition-all cursor-pointer ${
                                                            hasSubmittedPractice
                                                                ? isItemPracticeCorrect
                                                                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                                    : 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400'
                                                                : 'border-border focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 text-text-primary'
                                                        }`}
                                                    >
                                                        <option value="" disabled>Associer à...</option>
                                                        {Array.from(new Set(question.matchingPairs!.map(p => p.rightExpected))).map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>

                                                    {showCorrectionInPractice && !isItemPracticeCorrect && (
                                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold shrink-0">
                                                            <span>Attendu : {pair.rightExpected}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Choices list (Multiple choice / Single choice) */}
            {!isShortAnswer && !isMatching && question.choices && question.choices.length > 0 && (
                <div className="space-y-2.5 pt-1">
                    {question.choices.map((choice) => {
                        if (mode === 'review') {
                            // REVIEW MODE
                            const isExpected = choice.isExpected;

                            return (
                                <div
                                    key={choice.id}
                                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                                        isExpected
                                            ? 'bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-500/15'
                                            : 'bg-surface border-border/70 text-text-secondary'
                                    }`}
                                >
                                    {/* Choice ID Badge */}
                                    <div
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                                            isExpected
                                                ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold'
                                                : 'bg-surface-highlight text-text-secondary border border-border'
                                        }`}
                                    >
                                        {choice.id}
                                    </div>

                                    {/* Choice Text & Formula Image */}
                                    <div className="flex-1 text-sm leading-relaxed space-y-1">
                                        {choice.imageUrl && !choice.text ? (
                                            <div className="py-0.5 flex items-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={choice.imageUrl}
                                                    alt={`Formule proposition ${choice.id}`}
                                                    className="max-h-12 sm:max-h-14 w-auto object-contain dark:invert rounded"
                                                />
                                            </div>
                                        ) : choice.text ? (
                                            <p className={`font-semibold ${isExpected ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-neutral-900 dark:text-neutral-100'}`}>
                                                {choice.text}
                                            </p>
                                        ) : (
                                            <p className="italic text-text-secondary text-xs flex items-center gap-1.5 py-0.5">
                                                <span className="font-mono not-italic px-1.5 py-0.5 rounded bg-surface-highlight border border-border text-[10px] font-bold text-text-primary">
                                                    Proposition {choice.id}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Badges / Correction Indicators */}
                                    {isExpected && (
                                        <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs shrink-0">
                                            <Check className="w-3.5 h-3.5" /> Bonne réponse
                                        </span>
                                    )}
                                </div>
                            );
                        } else {
                            // PRACTICE / TRAINING MODE
                            const isSelected = selectedChoiceIds.includes(choice.id);
                            const isExpected = choice.isExpected;

                            let practiceStyle = 'bg-surface border-border/70 hover:bg-surface-highlight text-text-primary';

                            if (showCorrectionInPractice) {
                                if (isExpected) {
                                    practiceStyle = 'bg-emerald-500/10 border-emerald-500 text-neutral-900 dark:text-neutral-100 ring-1 ring-emerald-500/50 dark:bg-emerald-500/15';
                                } else if (isSelected && !isExpected) {
                                    practiceStyle = 'bg-red-500/10 border-red-500 text-neutral-900 dark:text-neutral-100 ring-1 ring-red-500/50 dark:bg-red-500/15';
                                } else {
                                    practiceStyle = 'opacity-40 bg-surface/30 border-border/30 text-text-secondary';
                                }
                            } else if (isSelected) {
                                practiceStyle = 'bg-accent-yellow/15 border-accent-yellow text-neutral-900 dark:text-neutral-100 shadow-xs shadow-accent-yellow/10';
                            }

                            return (
                                <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => handleTogglePracticeChoice(choice.id)}
                                    disabled={hasSubmittedPractice}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${practiceStyle}`}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 transition-all ${
                                            isSelected
                                                ? 'bg-accent-yellow text-black font-bold'
                                                : 'bg-surface-highlight text-text-secondary border border-border'
                                        }`}
                                    >
                                        {isSelected ? (isMultiple ? '✓' : '●') : choice.id}
                                    </div>

                                    <div className="flex-1 text-sm leading-relaxed font-semibold text-neutral-900 dark:text-neutral-100">
                                        {choice.imageUrl && !choice.text ? (
                                            <div className="py-0.5 flex items-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={choice.imageUrl}
                                                    alt={`Formule proposition ${choice.id}`}
                                                    className="max-h-12 sm:max-h-14 w-auto object-contain dark:invert rounded"
                                                />
                                            </div>
                                        ) : choice.text ? (
                                            choice.text
                                        ) : (
                                            <span className="italic text-text-secondary text-xs font-normal flex items-center gap-1.5 py-0.5">
                                                <span className="font-mono not-italic px-1.5 py-0.5 rounded bg-surface-highlight border border-border text-[10px] font-bold text-text-primary">
                                                    Proposition {choice.id}
                                                </span>
                                            </span>
                                        )}
                                    </div>

                                    {showCorrectionInPractice && isExpected && (
                                        <span className="shrink-0 flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px]">
                                            <Check className="w-3.5 h-3.5" /> Bonne réponse
                                        </span>
                                    )}
                                </button>
                            );
                        }
                    })}
                </div>
            )}

            {/* Practice Actions Bar */}
            {mode === 'practice' && (
                <div className="space-y-3 pt-3 border-t border-border/40">
                    {/* Failure Coaching Alert when student answers incorrectly */}
                    {hasSubmittedPractice && !isPracticeFullyCorrect && (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-medium">
                                <Sparkles className="w-4 h-4 text-accent-yellow shrink-0" />
                                <span>Question non validée : Le Coach IA vous explique le piège et vous propose 2 exercices similaires.</span>
                            </div>
                            <Button
                                type="button"
                                variant="premium"
                                size="sm"
                                onClick={() => setIsCoachOpen(true)}
                                className="text-xs font-bold shrink-0 shadow-md shadow-accent-yellow/20"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                Expliquer la réponse (Coach IA)
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {hasSubmittedPractice ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCoachOpen(true)}
                                className="border-accent-yellow/50 bg-accent-yellow/10 hover:bg-accent-yellow/20 text-text-primary text-xs font-bold"
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                Coach IA : Explication &amp; Drills
                            </Button>
                        ) : <div />}

                        <div className="flex items-center gap-2">
                            {!hasSubmittedPractice ? (
                                <Button
                                    type="button"
                                    variant="premium"
                                    size="sm"
                                    onClick={handlePracticeSubmit}
                                    disabled={
                                        isShortAnswer
                                            ? !typedAnswer.trim()
                                            : isMatching
                                            ? !question.matchingPairs?.every(p => Boolean(matchingAnswers[p.id]))
                                            : selectedChoiceIds.length === 0
                                    }
                                >
                                    Valider ma réponse
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowCorrectionInPractice(!showCorrectionInPractice)}
                                        className="border-border text-xs"
                                    >
                                        {showCorrectionInPractice ? (
                                            <>
                                                <EyeOff className="w-3.5 h-3.5 mr-1.5" /> Masquer corrigé
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-3.5 h-3.5 mr-1.5" /> Voir corrigé
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={handlePracticeReset}
                                        className="text-xs"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Réessayer
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Review Mode Bottom Action Bar */}
            {mode === 'review' && (
                <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-accent-yellow" />
                        Tuteur IA disponible pour détailler le raisonnement et tester des variantes.
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCoachOpen(true)}
                        className="border-accent-yellow/40 hover:bg-accent-yellow/10 text-xs font-bold text-text-primary"
                    >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                        Coach IA : Raisonnement Pas-à-Pas
                    </Button>
                </div>
            )}

            {/* Interactive Coach IA Modal */}
            <AICoachModal
                isOpen={isCoachOpen}
                onClose={() => setIsCoachOpen(false)}
                question={question}
                studentAnswerText={resolvedStudentAnswerText}
                isCorrect={mode === 'practice' ? isPracticeFullyCorrect : true}
            />
        </div>
    );
}
