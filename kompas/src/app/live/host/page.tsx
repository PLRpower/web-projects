'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Trophy,
    Users,
    Play,
    RotateCcw,
    Tv,
    QrCode,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    createLiveBattleSession,
    getLiveBattleSession,
    updateSessionStatus,
    LiveBattleSession
} from '@/lib/live-battle-store';
import { CodeBlock } from '@/components/cctl/CodeBlock';
import { QRCodeSVG } from '@/components/live/QRCodeSVG';

const CHOICE_COLORS = [
    { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', symbol: '▲' },
    { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', symbol: '◆' },
    { bg: 'bg-amber-400', text: 'text-black', border: 'border-amber-500', symbol: '●' },
    { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600', symbol: '■' }
];

export default function LiveBattleHostPage() {
    const [session, setSession] = useState<LiveBattleSession | null>(null);
    const [timeLeft, setTimeLeft] = useState(20);
    const [origin, setOrigin] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    // Initialize session on mount
    useEffect(() => {
        const newSession = createLiveBattleSession();
        setSession(newSession);

        // Listen for live events (players joining, answers)
        const handleLiveEvent = () => {
            if (newSession.pin) {
                const refreshed = getLiveBattleSession(newSession.pin);
                if (refreshed) setSession({ ...refreshed });
            }
        };

        window.addEventListener('kompas_live_event', handleLiveEvent);
        return () => window.removeEventListener('kompas_live_event', handleLiveEvent);
    }, []);

    // 20s Countdown timer during question phase
    useEffect(() => {
        if (!session || session.status !== 'question') return;

        setTimeLeft(20);
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    // Automatically transition to reveal
                    handleGoToReveal();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [session?.status, session?.currentQuestionIndex]);

    const handleStartBattle = () => {
        if (!session) return;
        updateSessionStatus(session.pin, 'question', 0);
        setSession(getLiveBattleSession(session.pin));
    };

    const handleGoToReveal = () => {
        if (!session) return;
        updateSessionStatus(session.pin, 'reveal');
        setSession(getLiveBattleSession(session.pin));
    };

    const handleNextQuestion = () => {
        if (!session) return;
        if (session.currentQuestionIndex < session.totalQuestions - 1) {
            updateSessionStatus(session.pin, 'question', session.currentQuestionIndex + 1);
        } else {
            updateSessionStatus(session.pin, 'podium');
        }
        setSession(getLiveBattleSession(session.pin));
    };

    const handleRestartBattle = () => {
        const newSession = createLiveBattleSession();
        setSession(newSession);
    };

    if (!session) return null;

    const playersList = Object.values(session.players);
    const sortedPlayers = [...playersList].sort((a, b) => b.score - a.score);
    const currentQ = session.questions[session.currentQuestionIndex];

    // Count answers for current question
    const answersMap: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    playersList.forEach((p) => {
        const ans = p.answers[session.currentQuestionIndex];
        if (ans && ans.choiceId) {
            answersMap[ans.choiceId] = (answersMap[ans.choiceId] || 0) + 1;
        }
    });

    const joinUrl = `${origin || 'https://kompas.fr'}/live?pin=${session.pin}`;

    return (
        <div className="min-h-screen bg-black text-text-primary flex flex-col justify-between p-4 sm:p-8 select-none">
            {/* Top Bar for Classroom Projector */}
            <header className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-accent-yellow text-black font-bold shadow-md shadow-accent-yellow/20">
                        <Tv className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-serif text-xl sm:text-2xl font-bold text-text-primary">
                                Kompas Live Battle Promo
                            </span>
                            <span className="text-xs font-mono font-bold bg-accent-yellow text-black px-2.5 py-0.5 rounded-full uppercase">
                                Mode Rétroprojecteur
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                            {session.title} • {session.promo}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {session.status !== 'lobby' && (
                        <div className="hidden sm:flex items-center gap-3 p-2 px-3 rounded-2xl bg-surface-card border border-accent-yellow/30">
                            <QRCodeSVG value={joinUrl} size={44} className="p-1 rounded-lg" />
                            <div className="text-left text-xs font-mono">
                                <p className="text-[9px] text-text-muted uppercase">REJOINDRE EN DIRECT</p>
                                <p className="font-bold text-accent-yellow">PIN: {session.pin}</p>
                            </div>
                        </div>
                    )}

                    <div className="text-right">
                        <p className="text-[10px] font-mono uppercase text-text-muted">CODE PIN DU QUIZ</p>
                        <p className="text-3xl font-mono font-black text-accent-yellow tracking-widest">
                            {session.pin}
                        </p>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT BASED ON STATUS */}
            <main className="flex-1 flex flex-col justify-center py-6">
                {/* 1. LOBBY PHASE */}
                {session.status === 'lobby' && (
                    <div className="max-w-4xl mx-auto w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        {/* QR Code & PIN Double Column Hero */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left: Scannable QR Code */}
                            <div className="card-editorial p-6 rounded-3xl bg-surface-card border-2 border-accent-yellow/50 flex flex-col items-center justify-center space-y-4 shadow-2xl">
                                <div className="p-2 rounded-2xl bg-white shadow-2xl">
                                    <QRCodeSVG value={joinUrl} size={210} className="p-1" />
                                </div>
                                <div className="text-center space-y-1">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-black uppercase tracking-wider bg-accent-yellow px-3 py-1 rounded-full shadow-xs">
                                        <QrCode className="w-3.5 h-3.5" />
                                        <span>Scan Caméra Smartphone</span>
                                    </span>
                                    <p className="text-xs text-text-secondary">
                                        Pointez votre appareil photo pour rejoindre directement avec le PIN pré-rempli.
                                    </p>
                                </div>
                            </div>

                            {/* Right: Big PIN & Direct Link */}
                            <div className="space-y-6 text-center md:text-left">
                                <div className="space-y-2">
                                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary leading-tight">
                                        Sortez vos smartphones !
                                    </h2>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        Scannez le QR Code ou rendez-vous sur <strong className="text-accent-yellow underline font-mono">{origin ? `${origin}/live` : 'kompas.fr/live'}</strong> et entrez le code PIN :
                                    </p>
                                </div>

                                <div className="p-6 rounded-3xl bg-surface-card border-2 border-accent-yellow/60 shadow-2xl text-center">
                                    <p className="text-[10px] font-mono uppercase text-text-muted mb-1">CODE PIN OFFICIEL</p>
                                    <span className="text-6xl sm:text-7xl font-mono font-black text-accent-yellow tracking-widest block">
                                        {session.pin}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Connected Players Grid */}
                        <div className="card-editorial p-6 rounded-3xl bg-surface-card border-border space-y-4 shadow-xl">
                            <div className="flex items-center justify-between text-xs font-mono text-text-secondary border-b border-border/50 pb-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-accent-yellow" />
                                    <span>{playersList.length} participant(s) connecté(s)</span>
                                </div>
                                <span className="animate-pulse text-accent-yellow font-bold">
                                    En attente des étudiants...
                                </span>
                            </div>

                            {playersList.length === 0 ? (
                                <p className="text-xs text-text-muted py-8 italic">
                                    En attente des premiers joueurs... Scannez le QR Code ou entrez le PIN <strong>{session.pin}</strong> depuis votre téléphone pour apparaître à l&apos;écran !
                                </p>
                            ) : (
                                <div className="flex flex-wrap items-center justify-center gap-3 py-4 max-h-60 overflow-y-auto">
                                    {playersList.map((player) => (
                                        <div
                                            key={player.id}
                                            className="px-4 py-2 rounded-2xl bg-surface border border-accent-yellow/40 text-text-primary text-sm font-bold flex items-center gap-2 shadow-sm animate-in zoom-in-95 duration-200"
                                        >
                                            <span className="text-lg">{player.avatar}</span>
                                            <span>{player.nickname}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                size="lg"
                                variant="premium"
                                onClick={handleStartBattle}
                                className="font-bold text-base px-10 py-6 shadow-xl shadow-accent-yellow/20 cursor-pointer"
                            >
                                <Play className="w-5 h-5 mr-2 fill-black" />
                                Lancer la Battle CCTL ({playersList.length} joueurs)
                            </Button>
                        </div>
                    </div>
                )}

                {/* 2. QUESTION PHASE */}
                {session.status === 'question' && currentQ && (
                    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-surface-card border border-border text-xs font-mono font-bold text-text-secondary">
                                Question {session.currentQuestionIndex + 1} / {session.totalQuestions} • {currentQ.typeLabel}
                            </span>

                            {/* Circular countdown */}
                            <div
                                className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-mono font-black text-xl transition-all ${
                                    timeLeft <= 5
                                        ? 'border-red-500 text-red-500 animate-ping'
                                        : 'border-accent-yellow text-accent-yellow'
                                }`}
                            >
                                {timeLeft}
                            </div>
                        </div>

                        {/* Question Prompt */}
                        <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-2xl space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary leading-snug">
                                {currentQ.prompt}
                            </h2>

                            {currentQ.codeSnippet && (
                                <CodeBlock
                                    code={currentQ.codeSnippet}
                                    language={currentQ.codeLanguage || 'typescript'}
                                />
                            )}
                        </div>

                        {/* 4 Choices Projection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentQ.choices.map((choice, idx) => {
                                const color = CHOICE_COLORS[idx % CHOICE_COLORS.length];

                                return (
                                    <div
                                        key={choice.id}
                                        className={`p-5 rounded-3xl ${color.bg} ${color.text} shadow-xl flex items-center gap-4 transition-transform`}
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center font-mono font-black text-xl shrink-0">
                                            {color.symbol}
                                        </div>
                                        <span className="font-bold text-base sm:text-lg leading-snug flex-1">
                                            {choice.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. REVEAL PHASE */}
                {session.status === 'reveal' && currentQ && (
                    <div className="max-w-5xl mx-auto w-full space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-2xl space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-text-primary">
                                    Réponses de la salle :
                                </h3>
                                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                                    ✓ Réponse attendue révélée
                                </span>
                            </div>

                            {/* Choices with answer bars */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentQ.choices.map((choice, idx) => {
                                    const color = CHOICE_COLORS[idx % CHOICE_COLORS.length];
                                    const votesCount = answersMap[choice.id] || 0;
                                    const isCorrect = choice.isExpected;

                                    return (
                                        <div
                                            key={choice.id}
                                            className={`p-5 rounded-3xl border-2 transition-all space-y-2 ${
                                                isCorrect
                                                    ? 'bg-emerald-500/15 border-emerald-500 text-text-primary shadow-lg shadow-emerald-500/10'
                                                    : 'bg-surface-card border-border/60 text-text-secondary opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-7 h-7 rounded-xl ${color.bg} ${color.text} flex items-center justify-center font-bold text-xs`}>
                                                        {color.symbol}
                                                    </span>
                                                    <span>{choice.text}</span>
                                                </div>
                                                <span className="font-mono text-xs">
                                                    {votesCount} vote{votesCount > 1 ? 's' : ''} {isCorrect && '✓'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {currentQ.explanation && (
                                <div className="p-4 rounded-2xl bg-surface border border-border/70 text-xs text-text-secondary leading-relaxed">
                                    <strong className="text-text-primary block mb-0.5">
                                        💡 Pourquoi cette réponse :
                                    </strong>
                                    {currentQ.explanation}
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <Button
                                    variant="premium"
                                    size="lg"
                                    onClick={handleNextQuestion}
                                    className="font-bold text-sm px-8"
                                >
                                    {session.currentQuestionIndex < session.totalQuestions - 1
                                        ? 'Question Suivante'
                                        : 'Afficher le Podium Final'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. PODIUM PHASE */}
                {session.status === 'podium' && (
                    <div className="max-w-4xl mx-auto w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-yellow bg-accent-yellow/15 px-3 py-1 rounded-full border border-accent-yellow/30">
                                🏆 Podium Officiel de la Battle
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text-primary">
                                Bravo aux Majors de l&apos;Épreuve !
                            </h2>
                        </div>

                        {/* Top 3 Podium Pillars */}
                        <div className="flex items-end justify-center gap-4 pt-6 max-w-2xl mx-auto">
                            {/* 2nd Place */}
                            {sortedPlayers[1] && (
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <span className="text-2xl">{sortedPlayers[1].avatar}</span>
                                    <p className="font-bold text-sm truncate max-w-[120px]">{sortedPlayers[1].nickname}</p>
                                    <p className="font-mono text-xs text-accent-yellow">{sortedPlayers[1].score} pts</p>
                                    <div className="w-full h-32 rounded-t-3xl bg-gray-400 text-black font-bold flex items-center justify-center text-3xl shadow-xl">
                                        2
                                    </div>
                                </div>
                            )}

                            {/* 1st Place */}
                            {sortedPlayers[0] && (
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <span className="text-3xl animate-bounce">{sortedPlayers[0].avatar}</span>
                                    <p className="font-bold text-base truncate max-w-[140px] text-accent-yellow">{sortedPlayers[0].nickname}</p>
                                    <p className="font-mono text-sm font-bold text-accent-yellow">{sortedPlayers[0].score} pts</p>
                                    <div className="w-full h-44 rounded-t-3xl bg-accent-yellow text-black font-bold flex items-center justify-center text-4xl shadow-2xl shadow-accent-yellow/20">
                                        👑 1
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {sortedPlayers[2] && (
                                <div className="flex-1 flex flex-col items-center space-y-2">
                                    <span className="text-2xl">{sortedPlayers[2].avatar}</span>
                                    <p className="font-bold text-sm truncate max-w-[120px]">{sortedPlayers[2].nickname}</p>
                                    <p className="font-mono text-xs text-accent-yellow">{sortedPlayers[2].score} pts</p>
                                    <div className="w-full h-24 rounded-t-3xl bg-amber-700 text-white font-bold flex items-center justify-center text-2xl shadow-xl">
                                        3
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Viral Conversion Note for the entire classroom */}
                        <div className="card-editorial p-6 rounded-3xl bg-surface-card border-2 border-accent-yellow/50 max-w-xl mx-auto text-center space-y-2 shadow-xl">
                            <p className="font-serif font-bold text-base text-text-primary">
                                💥 Bilan individuel envoyé sur vos smartphones !
                            </p>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Regardez votre écran pour voir le détail de vos erreurs et débloquer les corrigés IA sur votre compte Kompas.
                            </p>
                        </div>

                        <div>
                            <Button variant="outline" onClick={handleRestartBattle} className="text-xs">
                                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                Relancer une nouvelle Battle
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
