'use client';

import { useState, useEffect } from 'react';
import {
    Brain,
    Flame,
    Zap,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Sparkles,
    RotateCcw,
    Award,
    Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    getPersonalDailyWorkout,
    recordDailyWorkoutCompletion,
    DailyWorkoutPlan
} from '@/lib/personal-revision-engine';
import { AICoachModal } from '@/components/cctl/AICoachModal';
import { CCTLQuestion } from '@/types/cctl';

export function PersonalizedDailyWorkout() {
    const [workout, setWorkout] = useState<DailyWorkoutPlan | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedChoices, setSelectedChoices] = useState<Record<number, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [coachQuestion, setCoachQuestion] = useState<CCTLQuestion | null>(null);

    useEffect(() => {
        const load = () => {
            setWorkout(getPersonalDailyWorkout());
        };
        load();
        window.addEventListener('kompas_workout_completed', load);
        window.addEventListener('kompas_skills_updated', load);
        return () => {
            window.removeEventListener('kompas_workout_completed', load);
            window.removeEventListener('kompas_skills_updated', load);
        };
    }, []);

    if (!workout) return null;

    const questions = workout.questions;
    const currentQ = questions[currentQIndex];

    const handleSelectChoice = (choiceId: string) => {
        if (isSubmitted) return;
        setSelectedChoices(prev => ({ ...prev, [currentQIndex]: choiceId }));
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            // Finish workout
            setIsSubmitted(true);
            let correct = 0;
            questions.forEach((q, idx) => {
                const choice = selectedChoices[idx];
                const expected = q.choices.find(c => c.isExpected)?.id;
                if (choice === expected) correct++;
            });
            const scorePct = Math.round((correct / questions.length) * 100);
            recordDailyWorkoutCompletion(scorePct);
        }
    };

    const handleRestart = () => {
        setIsPlaying(false);
        setIsSubmitted(false);
        setCurrentQIndex(0);
        setSelectedChoices({});
    };

    return (
        <div className="card-editorial p-6 sm:p-7 rounded-3xl bg-surface-card border-2 border-accent-yellow/40 space-y-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-yellow/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            {/* Header with Streak and Weakness Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-accent-yellow text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                            <Brain className="w-3.5 h-3.5" />
                            <span>Entraînement Quotidien Sur-Mesure</span>
                        </span>
                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            <Flame className="w-3.5 h-3.5 fill-amber-600 dark:fill-amber-400" />
                            <span>{workout.streakDays} jours de streak</span>
                        </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif font-normal text-text-primary">
                        Cerveau Numérique : <span className="italic font-normal">Vos 5 questions du jour</span>
                    </h2>
                    <p className="text-xs text-text-secondary">
                        Généré sur vos points de fragilité :{' '}
                        {workout.targetSkills.map((s, idx) => (
                            <strong key={s.id} className="text-accent-yellow">
                                {s.name} ({s.mastery}%){idx < workout.targetSkills.length - 1 ? ', ' : ''}
                            </strong>
                        ))}
                    </p>
                </div>

                {!isPlaying && !workout.isCompletedToday && (
                    <Button
                        variant="premium"
                        onClick={() => setIsPlaying(true)}
                        className="font-bold text-xs px-6 shadow-md shadow-accent-yellow/20 shrink-0 cursor-pointer"
                    >
                        <Zap className="w-4 h-4 mr-1.5" />
                        Démarrer l&apos;entraînement (5 min)
                    </Button>
                )}
            </div>

            {/* View 1: Not Started / Already Completed */}
            {!isPlaying ? (
                <div className="relative z-10">
                    {workout.isCompletedToday ? (
                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-bold text-sm text-text-primary">
                                        Entraînement du jour complété !
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        Votre streak de <strong>{workout.streakDays} jours</strong> est sécurisé. Rendez-vous demain pour vos 5 prochaines questions adaptatives.
                                    </p>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsPlaying(true);
                                    setIsSubmitted(false);
                                    setCurrentQIndex(0);
                                    setSelectedChoices({});
                                }}
                                className="border-border text-xs text-text-primary shrink-0"
                            >
                                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                Recommencer
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-4 rounded-2xl bg-surface border border-border/70 space-y-1">
                                <span className="text-[10px] font-mono uppercase text-text-muted">DURÉE CONSEILLÉE</span>
                                <p className="font-serif font-bold text-base text-text-primary">5 Minutes Express</p>
                                <p className="text-[11px] text-text-secondary">Idéal entre deux cours ou dans les transports.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-surface border border-border/70 space-y-1">
                                <span className="text-[10px] font-mono uppercase text-text-muted">CIBLAGE IA</span>
                                <p className="font-serif font-bold text-base text-accent-yellow">Répétition Espacée</p>
                                <p className="text-[11px] text-text-secondary">Renforce les notions ratées lors des derniers CCTLs.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-surface border border-border/70 space-y-1">
                                <span className="text-[10px] font-mono uppercase text-text-muted">IMPACT</span>
                                <p className="font-serif font-bold text-base text-emerald-600 dark:text-emerald-400">+15% de précision</p>
                                <p className="text-[11px] text-text-secondary">Sécurise la validation directe des blocs.</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : isSubmitted ? (
                /* View 2: Workout Results Breakdown */
                <div className="space-y-6 animate-in fade-in duration-300 relative z-10">
                    <div className="p-6 rounded-2xl bg-surface border border-accent-yellow/40 text-center space-y-3">
                        <div className="inline-flex p-3 rounded-full bg-accent-yellow text-black font-bold">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-text-primary">
                            Entraînement Quotidien Validé !
                        </h3>
                        <p className="text-xs text-text-secondary max-w-md mx-auto">
                            Vos réponses ont été synchronisées avec votre <strong>Radar de Compétences</strong> et votre position au <strong>Classement Promo</strong>.
                        </p>
                        <div className="pt-2">
                            <Button size="sm" variant="premium" onClick={handleRestart} className="font-bold text-xs">
                                Terminer
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {questions.map((q, idx) => {
                            const userChoice = selectedChoices[idx];
                            const expectedChoice = q.choices.find(c => c.isExpected);
                            const isCorrect = userChoice === expectedChoice?.id;

                            return (
                                <div
                                    key={q.id}
                                    className={`p-4 rounded-2xl border flex items-start justify-between gap-4 text-xs ${
                                        isCorrect
                                            ? 'bg-surface border-emerald-500/30'
                                            : 'bg-surface border-red-500/40'
                                    }`}
                                >
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold px-2 py-0.5 rounded bg-surface-highlight text-text-primary">
                                                Q{idx + 1}
                                            </span>
                                            <span className="font-semibold text-text-primary">
                                                {q.prompt}
                                            </span>
                                        </div>
                                        {q.explanation && (
                                            <p className="text-text-secondary pl-6 text-[11px] leading-relaxed">
                                                💡 {q.explanation}
                                            </p>
                                        )}
                                    </div>

                                    {!isCorrect && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCoachQuestion(q)}
                                            className="border-accent-yellow/40 text-[11px] font-bold text-text-primary shrink-0"
                                        >
                                            <Sparkles className="w-3.5 h-3.5 mr-1 text-accent-yellow" />
                                            Coach IA
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* View 3: Active Question Runner */
                <div className="space-y-5 animate-in fade-in duration-200 relative z-10">
                    <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                        <span>
                            Question {currentQIndex + 1} sur {questions.length}
                        </span>
                        <span className="text-accent-yellow font-bold">
                            {currentQ.typeLabel}
                        </span>
                    </div>

                    <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-border/50">
                        <div
                            className="bg-accent-yellow h-full transition-all duration-300 rounded-full"
                            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    <p className="font-serif font-normal text-base text-text-primary leading-relaxed">
                        {currentQ.prompt}
                    </p>

                    <div className="space-y-2.5 pt-1">
                        {currentQ.choices.map(choice => {
                            const isSelected = selectedChoices[currentQIndex] === choice.id;

                            return (
                                <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => handleSelectChoice(choice.id)}
                                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-xs sm:text-sm cursor-pointer ${
                                        isSelected
                                            ? 'bg-accent-yellow/15 border-accent-yellow text-text-primary font-bold shadow-xs'
                                            : 'bg-surface border-border hover:border-accent-yellow/50 text-text-secondary'
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                                            isSelected
                                                ? 'bg-accent-yellow text-black'
                                                : 'bg-surface-highlight text-text-muted border border-border'
                                        }`}
                                    >
                                        {choice.id}
                                    </div>
                                    <span className="flex-1 leading-relaxed">
                                        {choice.text}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsPlaying(false)}
                            className="text-xs text-text-muted"
                        >
                            Quitter
                        </Button>

                        <Button
                            size="sm"
                            variant="premium"
                            onClick={handleNext}
                            disabled={!selectedChoices[currentQIndex]}
                            className="font-bold text-xs px-6 shadow-md shadow-accent-yellow/20"
                        >
                            {currentQIndex === questions.length - 1 ? 'Valider mes réponses' : 'Suivant'}
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Coach IA Modal */}
            {coachQuestion && (
                <AICoachModal
                    isOpen={Boolean(coachQuestion)}
                    onClose={() => setCoachQuestion(null)}
                    question={coachQuestion}
                    studentAnswerText="Entraînement Quotidien"
                    isCorrect={false}
                />
            )}
        </div>
    );
}
