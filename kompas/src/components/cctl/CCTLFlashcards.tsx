'use client';

import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    RotateCw,
    Shuffle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { CCTLQuestion } from '@/types/cctl';
import { Button } from '@/components/ui/button';
import { CodeBlock } from './CodeBlock';

interface CCTLFlashcardsProps {
    questions: CCTLQuestion[];
}

export function CCTLFlashcards({ questions }: CCTLFlashcardsProps) {
    const [deck, setDeck] = useState<CCTLQuestion[]>(questions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownQuestions, setKnownQuestions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setDeck(questions);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [questions]);

    if (!deck || deck.length === 0) {
        return (
            <div className="glass p-12 text-center rounded-2xl border border-border/80 text-text-secondary">
                Aucune question disponible pour le mode Flashcards.
            </div>
        );
    }

    const currentQuestion = deck[currentIndex];
    const expectedChoices = currentQuestion.choices.filter(c => c.isExpected);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < deck.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleShuffle = () => {
        const shuffled = [...deck].sort(() => Math.random() - 0.5);
        setDeck(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const handleMarkKnown = (known: boolean) => {
        setKnownQuestions(prev => ({
            ...prev,
            [currentQuestion.id]: known
        }));
        if (currentIndex < deck.length - 1) {
            handleNext();
        }
    };

    const progressPercentage = Math.round(((currentIndex + 1) / deck.length) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header controls & progress */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="font-syne font-bold text-lg text-text-primary">
                        Carte {currentIndex + 1} <span className="text-text-secondary font-normal text-sm">/ {deck.length}</span>
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleShuffle}
                        className="border-border/60 text-xs h-8"
                    >
                        <Shuffle className="w-3.5 h-3.5 mr-1.5" /> Mélanger
                    </Button>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 w-44">
                    <div className="flex-1 h-2 bg-surface-highlight rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent-yellow transition-all duration-300 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-text-secondary">{progressPercentage}%</span>
                </div>
            </div>

            {/* Flashcard 3D container */}
            <div
                onClick={handleFlip}
                className="perspective-1000 w-full min-h-[380px] cursor-pointer select-none group"
            >
                <div
                    className={`relative w-full h-full min-h-[380px] transition-transform duration-500 preserve-3d ${
                        isFlipped ? 'rotate-y-180' : ''
                    }`}
                >
                    {/* RECTO (Front Face) */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl glass border border-border/80 hover:border-accent-yellow/40 transition-all duration-300 shadow-xl p-8 flex flex-col justify-between">
                        {/* Card Top Banner */}
                        <div className="flex items-center justify-between pb-4 border-b border-border/40">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-highlight text-text-secondary border border-border/70">
                                {currentQuestion.type === 'multiple_choice'
                                    ? 'Réponse à choix multiples'
                                    : currentQuestion.type === 'single_choice'
                                    ? 'Réponse à choix unique'
                                    : currentQuestion.typeLabel}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary group-hover:text-accent-yellow transition-colors">
                                <RotateCw className="w-3.5 h-3.5 animate-spin-hover" />
                                <span>Cliquez pour voir la réponse</span>
                            </div>
                        </div>

                        {/* Card Main Body */}
                        <div className="py-6 flex-1 flex flex-col justify-center space-y-4">
                            <span className="text-xs uppercase tracking-wider text-text-secondary font-bold">
                                Question {currentQuestion.number}
                            </span>
                            <p className="text-lg sm:text-xl font-bold font-syne text-text-primary leading-relaxed">
                                {currentQuestion.prompt}
                            </p>
                            {currentQuestion.codeSnippet && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <CodeBlock
                                        code={currentQuestion.codeSnippet}
                                        language={currentQuestion.codeLanguage || 'javascript'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Card Footer */}
                        <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs text-text-secondary">
                            <span>Espace pour retourner</span>
                            <span className="italic">Astuce : Utilisez les flèches pour naviguer</span>
                        </div>
                    </div>

                        {/* VERSO (Back Face) */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl glass border-2 border-emerald-500 dark:border-emerald-500/50 shadow-xl p-8 flex flex-col justify-between overflow-y-auto">
                            {/* Card Top Banner */}
                            <div className="flex items-center justify-between pb-4 border-b border-border/40">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-500/40 shadow-xs">
                                    Solution &amp; Correction
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-accent-yellow font-semibold">
                                    <RotateCw className="w-3.5 h-3.5" />
                                    <span>Cliquez pour voir la question</span>
                                </div>
                            </div>

                            {/* Card Main Body */}
                            <div className="py-4 flex-1 flex flex-col justify-center space-y-4">
                                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <span>
                                        {expectedChoices.length > 1
                                            ? 'Réponses correctes attendues :'
                                            : 'Réponse officielle attendue :'}
                                    </span>
                                </div>

                                {expectedChoices.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {expectedChoices.map((choice) => (
                                            <div
                                                key={choice.id}
                                                className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 dark:bg-emerald-500/15 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 flex items-start gap-3 shadow-xs"
                                            >
                                                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                                                    {choice.id}
                                                </span>
                                                <p className="text-sm sm:text-base font-bold leading-relaxed">{choice.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : currentQuestion.matchingPairs && currentQuestion.matchingPairs.length > 0 ? (
                                    <div className="space-y-2">
                                        {currentQuestion.matchingPairs.map((pair) => (
                                            <div
                                                key={pair.id}
                                                className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                                            >
                                                <span className="font-mono font-semibold text-text-primary">{pair.id}. {pair.leftItem}</span>
                                                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 font-mono font-semibold">{pair.rightExpected}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 dark:bg-emerald-500/15 dark:border-emerald-400 space-y-1 shadow-xs">
                                        <p className="text-base sm:text-lg font-bold font-mono text-emerald-800 dark:text-emerald-300">
                                            {currentQuestion.choices?.find(c => c.isExpected)?.text || currentQuestion.fillBlanks?.[0]?.expectedText || 'Réponse enregistrée'}
                                        </p>
                                    </div>
                                )}

                                {currentQuestion.explanation && (
                                    <div className="p-3 rounded-xl bg-surface/80 border border-border text-xs text-text-secondary leading-relaxed">
                                        <strong className="text-text-primary block mb-0.5">💡 Explication :</strong>
                                        {currentQuestion.explanation}
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-secondary">
                                <span className="text-emerald-800 dark:text-emerald-400 font-bold">Réponse vérifiée</span>
                                <span className="italic">Appuyez sur Suivante pour continuer</span>
                            </div>
                        </div>
                </div>
            </div>

            {/* Bottom Navigation & Mastery Buttons */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="border-border/60"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Précédente
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkKnown(false)}
                        className="text-xs text-text-primary hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300"
                    >
                        <XCircle className="w-4 h-4 mr-1.5 text-red-600 dark:text-red-400" /> À revoir
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkKnown(true)}
                        className="text-xs text-text-primary hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300"
                    >
                        <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Maîtrisé
                    </Button>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === deck.length - 1}
                    className="border-border/60"
                >
                    Suivante <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
