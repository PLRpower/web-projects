'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Check,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    RotateCcw,
    ShieldAlert,
    Target,
    Zap,
    Lock,
    Eye,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CCTLExam, CCTLQuestion } from '@/types/cctl';
import { CodeBlock } from './CodeBlock';
import { AICoachModal } from './AICoachModal';
import { recordExamSession } from '@/lib/skills-diagnostic';

interface CCTLExamPressurePlayerProps {
    exam: CCTLExam;
    onExit?: () => void;
}

export function CCTLExamPressurePlayer({ exam, onExit }: CCTLExamPressurePlayerProps) {
    const questions = exam.questions;
    const totalQuestions = questions.length;

    // Time limit: 2 minutes per question (e.g. 20 min for 10 questions)
    const initialSeconds = useMemo(() => {
        return Math.max(300, (exam.durationMinutes ? exam.durationMinutes * 60 : totalQuestions * 120));
    }, [exam.durationMinutes, totalQuestions]);

    const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Persistent answers per question: { [qId]: { choices: string[], typed: string, matching: Record<string, string> } }
    const [answers, setAnswers] = useState<
        Record<string, { choices: string[]; typed: string; matching: Record<string, string> }>
    >({});

    // Exam status
    const [isFinished, setIsFinished] = useState(false);
    const [timeExpired, setTimeExpired] = useState(false);

    // Coach IA modal on finished report
    const [selectedCoachQuestion, setSelectedCoachQuestion] = useState<CCTLQuestion | null>(null);

    // Timer countdown
    useEffect(() => {
        if (isFinished) return;

        const timer = setInterval(() => {
            setSecondsRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeExpired(true);
                    handleAutoFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished]);

    const currentQ = questions[currentIndex];
    const isMultiple = currentQ.type === 'multiple_choice';
    const isNumerical = currentQ.type === 'numerical';
    const hasMatching = Boolean(currentQ.matchingPairs && currentQ.matchingPairs.length > 0);
    const isMatching = (currentQ.type === 'matching' || (isNumerical && hasMatching)) && hasMatching;
    const isShortAnswer = currentQ.type === 'short_answer' || currentQ.type === 'fill_blank' || (isNumerical && !hasMatching);

    const currentAnswer = answers[currentQ.id] || { choices: [], typed: '', matching: {} };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleToggleChoice = (choiceId: string) => {
        setAnswers(prev => {
            const curr = prev[currentQ.id] || { choices: [], typed: '', matching: {} };
            let nextChoices: string[];
            if (isMultiple) {
                nextChoices = curr.choices.includes(choiceId)
                    ? curr.choices.filter(id => id !== choiceId)
                    : [...curr.choices, choiceId];
            } else {
                nextChoices = [choiceId];
            }
            return {
                ...prev,
                [currentQ.id]: {
                    ...curr,
                    choices: nextChoices
                }
            };
        });
    };

    const handleSetTyped = (typed: string) => {
        setAnswers(prev => {
            const curr = prev[currentQ.id] || { choices: [], typed: '', matching: {} };
            return {
                ...prev,
                [currentQ.id]: {
                    ...curr,
                    typed
                }
            };
        });
    };

    const handleSetMatching = (pairId: string, val: string) => {
        setAnswers(prev => {
            const curr = prev[currentQ.id] || { choices: [], typed: '', matching: {} };
            return {
                ...prev,
                [currentQ.id]: {
                    ...curr,
                    matching: {
                        ...curr.matching,
                        [pairId]: val
                    }
                }
            };
        });
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleJumpToQuestion = (idx: number) => {
        setCurrentIndex(idx);
    };

    const handleAutoFinish = () => {
        setIsFinished(true);
    };

    const handleFinishExam = () => {
        setIsFinished(true);
    };

    const isQuestionAnswered = (q: CCTLQuestion) => {
        const a = answers[q.id];
        if (!a) return false;
        if (q.type === 'matching' || (q.type === 'numerical' && q.matchingPairs?.length)) {
            return Boolean(q.matchingPairs && q.matchingPairs.length > 0 && q.matchingPairs.every(p => Boolean(a.matching[p.id])));
        }
        if (q.type === 'short_answer' || q.type === 'fill_blank') {
            return Boolean(a.typed && a.typed.trim().length > 0);
        }
        return a.choices && a.choices.length > 0;
    };

    const answeredQuestionsCount = useMemo(() => {
        return questions.filter(q => isQuestionAnswered(q)).length;
    }, [questions, answers]);

    // Calculate Final Results
    const results = useMemo(() => {
        if (!isFinished) return null;

        let correctCount = 0;
        const details = questions.map((q) => {
            const answer = answers[q.id] || { choices: [], typed: '', matching: {} };
            const expectedIds = q.choices.filter(c => c.isExpected).map(c => c.id);
            const expectedAnswerText = q.choices.find(c => c.isExpected)?.text || q.fillBlanks?.[0]?.expectedText || '';

            let isCorrect = false;
            let formattedStudentAnswer = '';

            if (q.type === 'matching' || (q.type === 'numerical' && q.matchingPairs?.length)) {
                isCorrect = Boolean(
                    q.matchingPairs &&
                    q.matchingPairs.length > 0 &&
                    q.matchingPairs.every(
                        p => (answer.matching[p.id] || '').trim().toLowerCase() === p.rightExpected.trim().toLowerCase()
                    )
                );
                formattedStudentAnswer = Object.entries(answer.matching).map(([k, v]) => `${k} -> ${v}`).join(', ') || 'Aucune association';
            } else if (q.type === 'short_answer' || q.type === 'fill_blank') {
                isCorrect = answer.typed.trim().toLowerCase() === expectedAnswerText.trim().toLowerCase();
                formattedStudentAnswer = answer.typed || 'Aucune réponse saisie';
            } else {
                isCorrect =
                    answer.choices.length === expectedIds.length &&
                    answer.choices.every(id => expectedIds.includes(id));
                formattedStudentAnswer = q.choices.filter(c => answer.choices.includes(c.id)).map(c => `${c.id}. ${c.text}`).join(', ') || 'Aucun choix sélectionné';
            }

            if (isCorrect) correctCount++;

            return {
                question: q,
                studentAnswer: answer,
                formattedStudentAnswer,
                isCorrect
            };
        });

        const scoreOn20 = parseFloat(((correctCount / totalQuestions) * 20).toFixed(1));
        const timeSpentSeconds = initialSeconds - secondsRemaining;
        const avgSecondsPerQ = Math.round(timeSpentSeconds / totalQuestions);

        return {
            correctCount,
            totalQuestions,
            scoreOn20,
            timeSpentSeconds,
            avgSecondsPerQ,
            details
        };
    }, [isFinished, questions, answers, totalQuestions, initialSeconds, secondsRemaining]);

    // Record session when finished
    useEffect(() => {
        if (isFinished && results) {
            recordExamSession({
                examId: exam.id,
                examTitle: exam.title,
                promo: exam.promo,
                subject: exam.subject,
                scoreOn20: results.scoreOn20,
                totalQuestions: results.totalQuestions,
                correctCount: results.correctCount,
                durationSeconds: results.timeSpentSeconds,
                timePerQuestionAvg: results.avgSecondsPerQ,
                mode: 'pressure',
                domainBreakdown: [{ domain: exam.domain || 'Informatique', scorePct: (results.correctCount / totalQuestions) * 100 }]
            });
        }
    }, [isFinished]);

    const isTimerCritical = secondsRemaining <= 120;
    const isTimerWarning = secondsRemaining <= 300 && !isTimerCritical;

    return (
        <div className="space-y-6">
            {/* Top Exam Header Bar */}
            <div className="card-editorial p-5 rounded-3xl bg-surface-card border-border shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center font-bold shadow-sm">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-serif text-base font-normal text-text-primary">
                                Mode Examen Blanc sous Pression
                            </h3>
                            <span className="text-[10px] font-mono font-bold bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full uppercase">
                                Chrono Strict
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                            Conditions réelles d&apos;examen • Naviguez librement entre les questions avant la fin du chronomètre.
                        </p>
                    </div>
                </div>

                {/* Countdown Timer Display */}
                {!isFinished && (
                    <div
                        className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border font-mono font-bold text-base transition-all ${
                            isTimerCritical
                                ? 'bg-red-500/20 text-red-500 border-red-500 animate-pulse shadow-lg shadow-red-500/20'
                                : isTimerWarning
                                ? 'bg-amber-500/15 text-amber-500 border-amber-500/40'
                                : 'bg-surface text-accent-yellow border-accent-yellow/40'
                        }`}
                    >
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>{formatTime(secondsRemaining)}</span>
                    </div>
                )}
            </div>

            {/* In-Progress Question Player */}
            {!isFinished ? (
                <div className="space-y-6">
                    {/* Progression Header & Interactive Question Chips */}
                    <div className="p-4 rounded-2xl bg-surface border border-border/80 space-y-3">
                        <div className="flex items-center justify-between gap-3 text-xs font-mono text-text-secondary">
                            <span className="font-bold text-text-primary">
                                Question {currentIndex + 1} sur {totalQuestions}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-accent-yellow font-bold">
                                    {answeredQuestionsCount} / {totalQuestions} répondue(s)
                                </span>
                                {answeredQuestionsCount === totalQuestions && (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-bold border border-emerald-500/30">
                                        ✓ Toutes complétées
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Interactive Clickable Question Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {questions.map((q, idx) => {
                                const isAnswered = isQuestionAnswered(q);
                                const isCurrent = idx === currentIndex;

                                return (
                                    <button
                                        key={q.id || idx}
                                        type="button"
                                        onClick={() => handleJumpToQuestion(idx)}
                                        className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                                            isCurrent
                                                ? 'bg-red-500 text-white ring-2 ring-red-400/80 shadow-md shadow-red-500/20 scale-105'
                                                : isAnswered
                                                ? 'bg-accent-yellow text-black hover:bg-accent-yellow/90 shadow-xs'
                                                : 'bg-surface-card border border-border/80 text-text-secondary hover:border-accent-yellow hover:text-text-primary'
                                        }`}
                                        title={`Aller à la question ${idx + 1} (${isAnswered ? 'Répondue' : 'En attente'})`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Question Card */}
                    <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border space-y-6 shadow-xl relative">
                        <div className="flex items-center justify-between pb-3 border-b border-border/60">
                            <div className="flex items-center gap-2.5">
                                <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs">
                                    Q{currentQ.number || currentIndex + 1}
                                </span>
                                {currentQ.sectionTitle && (
                                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 font-semibold">
                                        {currentQ.sectionTitle}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-mono text-text-muted">
                                {currentQ.typeLabel || 'Question'}
                            </span>
                        </div>

                        {/* Prompt & Code */}
                        <div className="space-y-4">
                            <p className="text-base sm:text-lg font-serif font-normal text-text-primary leading-relaxed">
                                {currentQ.prompt}
                            </p>

                            {/* Math Formula Image if present */}
                            {(currentQ.formulaImageUrl || (currentQ.promptImageUrl && currentQ.hasPromptFormula)) && (
                                <div className="inline-flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-border shadow-xs">
                                    <span className="text-[10px] font-mono font-bold text-text-muted">Formule :</span>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={currentQ.formulaImageUrl || currentQ.promptImageUrl}
                                        alt="Formule de l'énoncé"
                                        className="max-h-12 w-auto object-contain dark:invert rounded"
                                    />
                                </div>
                            )}

                            {currentQ.codeSnippet && (
                                <CodeBlock
                                    code={currentQ.codeSnippet}
                                    language={currentQ.codeLanguage || 'typescript'}
                                />
                            )}
                        </div>

                        {/* Choices / Input Area */}
                        {!isShortAnswer && !isMatching && currentQ.choices && (
                            <div className="space-y-3 pt-2">
                                {currentQ.choices.map((choice) => {
                                    const isSelected = currentAnswer.choices.includes(choice.id);

                                    return (
                                        <button
                                            key={choice.id}
                                            type="button"
                                            onClick={() => handleToggleChoice(choice.id)}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                                                isSelected
                                                    ? 'bg-accent-yellow/15 border-accent-yellow text-text-primary font-bold shadow-xs'
                                                    : 'bg-surface border-border/70 hover:border-accent-yellow/50 text-text-secondary'
                                            }`}
                                        >
                                            <div
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                                                    isSelected
                                                        ? 'bg-accent-yellow text-black'
                                                        : 'bg-surface-highlight text-text-muted border border-border'
                                                }`}
                                            >
                                                {isSelected ? (isMultiple ? '✓' : '●') : choice.id}
                                            </div>
                                            <span className="flex-1 leading-relaxed text-sm">
                                                {choice.text}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Short Answer Input */}
                        {isShortAnswer && (
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-mono uppercase text-text-muted">
                                    Votre réponse :
                                </label>
                                <input
                                    type="text"
                                    value={currentAnswer.typed}
                                    onChange={(e) => handleSetTyped(e.target.value)}
                                    placeholder="Saisissez votre réponse ici..."
                                    className="w-full h-12 rounded-2xl bg-surface border border-border px-4 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
                                />
                            </div>
                        )}

                        {/* Matching pairs */}
                        {isMatching && currentQ.matchingPairs && (
                            <div className="space-y-3 pt-2">
                                {currentQ.matchingPairs.map((pair) => (
                                    <div
                                        key={pair.id}
                                        className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                        <div className="flex items-start gap-2.5 font-semibold text-xs sm:text-sm text-text-primary">
                                            <span className="px-2 py-0.5 rounded bg-surface-highlight font-mono text-xs">
                                                {pair.id}
                                            </span>
                                            <span>{pair.leftItem}</span>
                                        </div>

                                        <select
                                            value={currentAnswer.matching[pair.id] || ''}
                                            onChange={(e) => handleSetMatching(pair.id, e.target.value)}
                                            className="h-10 bg-surface-card border border-border rounded-xl px-3 text-xs font-mono font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                                        >
                                            <option value="" disabled>Associer à...</option>
                                            {Array.from(new Set(currentQ.matchingPairs!.map(p => p.rightExpected))).map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Flexible Navigation Bar (Previous / Next / Finish) */}
                        <div className="pt-5 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <Button
                                size="default"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="font-semibold text-xs sm:text-sm w-full sm:w-auto cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Question précédente
                            </Button>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                {currentIndex < totalQuestions - 1 ? (
                                    <Button
                                        size="default"
                                        variant="premium"
                                        onClick={handleNext}
                                        className="font-bold text-xs sm:text-sm px-6 w-full sm:w-auto shadow-md shadow-accent-yellow/20 cursor-pointer"
                                    >
                                        <span>Question suivante</span>
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="default"
                                        variant="premium"
                                        onClick={handleFinishExam}
                                        className="font-bold text-xs sm:text-sm px-6 w-full sm:w-auto shadow-md shadow-accent-yellow/20 cursor-pointer bg-red-600 hover:bg-red-500 text-white border-red-500"
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        Terminer et Rendre l&apos;épreuve
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : results ? (
                /* ================= STEP 3: FINAL DIAGNOSTIC REPORT ================= */
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    {/* Final Score Showcase Card */}
                    <div className="card-editorial p-8 sm:p-10 rounded-3xl bg-surface-card border-2 border-accent-yellow/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

                        <div className="space-y-2 relative z-10 max-w-md mx-auto">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-yellow bg-accent-yellow/10 px-3 py-1 rounded-full border border-accent-yellow/20">
                                Bilan Officiel de l&apos;Épreuve
                            </span>

                            <div className="flex items-baseline justify-center gap-2 pt-2">
                                <span className="text-6xl sm:text-7xl font-serif font-bold text-text-primary tracking-tight">
                                    {results.scoreOn20}
                                </span>
                                <span className="text-2xl font-serif text-text-muted">/ 20</span>
                            </div>

                            <p className="text-sm font-semibold text-text-primary">
                                {results.scoreOn20 >= 15
                                    ? '🎉 Félicitations ! Grade A acquis avec mention.'
                                    : results.scoreOn20 >= 12
                                    ? '👍 Bon travail ! Épreuve validée (Grade B).'
                                    : results.scoreOn20 >= 10
                                    ? '⚠️ Juste au seuil de validation (Grade C). Consolidation requise.'
                                    : '🚨 Non validé (Grade F). Révisions approfondies indispensables.'}
                            </p>
                        </div>

                        {/* Metric Highlights */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 relative z-10">
                            <div className="p-3.5 rounded-2xl bg-surface border border-border/80 text-center">
                                <span className="text-[10px] font-mono uppercase text-text-muted block">Questions Réussies</span>
                                <span className="text-lg font-bold text-emerald-500 font-mono">
                                    {results.correctCount} / {results.totalQuestions}
                                </span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-surface border border-border/80 text-center">
                                <span className="text-[10px] font-mono uppercase text-text-muted block">Temps Total</span>
                                <span className="text-lg font-bold text-accent-yellow font-mono">
                                    {formatTime(results.timeSpentSeconds)}
                                </span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-surface border border-border/80 text-center">
                                <span className="text-[10px] font-mono uppercase text-text-muted block">Cadence Moyenne</span>
                                <span className="text-lg font-bold text-text-primary font-mono">
                                    {results.avgSecondsPerQ}s / quest.
                                </span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-surface border border-border/80 text-center">
                                <span className="text-[10px] font-mono uppercase text-text-muted block">Diagnostic Radar</span>
                                <span className="text-lg font-bold text-accent-orange font-mono">
                                    Mis à jour
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 relative z-10">
                            <Link href="/dashboard/diagnostic">
                                <Button size="lg" variant="premium" className="font-bold text-xs sm:text-sm">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Voir mon Radar &amp; Prédiction de note
                                </Button>
                            </Link>
                            {onExit && (
                                <Button size="lg" variant="outline" onClick={onExit} className="text-xs sm:text-sm">
                                    Quitter le mode pression
                                </Button>
                            )}
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    setSecondsRemaining(initialSeconds);
                                    setCurrentIndex(0);
                                    setAnswers({});
                                    setIsFinished(false);
                                    setTimeExpired(false);
                                }}
                                className="text-xs sm:text-sm"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Recommencer sous pression
                            </Button>
                        </div>
                    </div>

                    {/* Detailed Per-Question Breakdown */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-serif text-lg font-normal text-text-primary">
                                Corrigé Détaillé &amp; Explications du Coach IA
                            </h4>
                            <span className="text-xs text-text-muted font-mono">
                                {results.correctCount} / {totalQuestions} validées
                            </span>
                        </div>

                        <div className="space-y-4">
                            {results.details.map((item, idx) => {
                                const q = item.question;
                                const isCorrect = item.isCorrect;

                                return (
                                    <div
                                        key={q.id || idx}
                                        className={`p-6 rounded-3xl border transition-all space-y-4 ${
                                            isCorrect
                                                ? 'bg-surface-card border-emerald-500/30'
                                                : 'bg-surface-card border-red-500/40 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded-lg bg-surface-highlight font-mono font-bold text-xs border border-border">
                                                    Q{q.number || idx + 1}
                                                </span>
                                                <span
                                                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                                        isCorrect
                                                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-red-500/15 text-red-600 dark:text-red-400'
                                                    }`}
                                                >
                                                    {isCorrect ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1 pt)
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" /> Incorrect (0 pt)
                                                        </>
                                                    )}
                                                </span>
                                            </div>

                                            {/* Coach IA Trigger Button */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setSelectedCoachQuestion(q)}
                                                className="border-accent-yellow/50 hover:bg-accent-yellow/10 text-xs font-bold text-text-primary"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent-yellow" />
                                                Coach IA : Expliquer
                                            </Button>
                                        </div>

                                        <p className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed">
                                            {q.prompt}
                                        </p>

                                        {/* Your Answer Recap */}
                                        <div className="p-3 rounded-xl bg-surface border border-border/70 text-xs flex items-center justify-between gap-2">
                                            <span className="text-text-muted font-mono text-[10px] uppercase">Votre réponse :</span>
                                            <span className={`font-mono font-bold ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {item.formattedStudentAnswer}
                                            </span>
                                        </div>

                                        {q.explanation && (
                                            <div className="p-3.5 rounded-2xl bg-surface text-xs text-text-secondary leading-relaxed border border-border/60">
                                                <strong className="text-text-primary block mb-0.5">
                                                    Correction officielle :
                                                </strong>
                                                {q.explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Coach IA Modal */}
            {selectedCoachQuestion && (
                <AICoachModal
                    isOpen={Boolean(selectedCoachQuestion)}
                    onClose={() => setSelectedCoachQuestion(null)}
                    question={selectedCoachQuestion}
                    studentAnswerText={
                        results?.details.find(d => d.question.id === selectedCoachQuestion.id)?.formattedStudentAnswer || ''
                    }
                    isCorrect={
                        results?.details.find(d => d.question.id === selectedCoachQuestion.id)?.isCorrect ?? false
                    }
                />
            )}
        </div>
    );
}
