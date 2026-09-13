'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    XCircle,
    Gift,
    ShieldAlert,
    Smartphone,
    CheckCircle2,
    Trophy,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    joinLiveBattle,
    submitPlayerAnswer,
    getLiveBattleSession,
    LiveBattleSession,
    LivePlayer
} from '@/lib/live-battle-store';

const PLAYER_CHOICE_BUTTONS = [
    { id: 'A', bg: 'bg-red-500 hover:bg-red-600 active:scale-95', symbol: '▲', colorName: 'Rouge' },
    { id: 'B', bg: 'bg-blue-500 hover:bg-blue-600 active:scale-95', symbol: '◆', colorName: 'Bleu' },
    { id: 'C', bg: 'bg-amber-400 hover:bg-amber-500 active:scale-95 text-black', symbol: '●', colorName: 'Jaune' },
    { id: 'D', bg: 'bg-emerald-500 hover:bg-emerald-600 active:scale-95', symbol: '■', colorName: 'Vert' }
];

function LivePlayerContent() {
    const searchParams = useSearchParams();
    const [pin, setPin] = useState('');
    const [nickname, setNickname] = useState('');
    const [joinedPlayer, setJoinedPlayer] = useState<LivePlayer | null>(null);
    const [session, setSession] = useState<LiveBattleSession | null>(null);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [hasAnsweredCurrentQ, setHasAnsweredCurrentQ] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

    // Auto-fill PIN from QR Code scan (e.g. /live?pin=8421)
    useEffect(() => {
        const queryPin = searchParams.get('pin');
        if (queryPin) {
            setPin(queryPin.trim());
        }
    }, [searchParams]);

    // Listen for live state updates from host screen
    useEffect(() => {
        if (!pin || !joinedPlayer) return;

        const syncState = () => {
            const current = getLiveBattleSession(pin);
            if (current) {
                setSession({ ...current });
                if (current.players[joinedPlayer.id]) {
                    setJoinedPlayer({ ...current.players[joinedPlayer.id] });
                }
            }
        };

        syncState();
        window.addEventListener('kompas_live_event', syncState);
        return () => window.removeEventListener('kompas_live_event', syncState);
    }, [pin, joinedPlayer?.id]);

    // Reset answer selection when new question begins
    useEffect(() => {
        if (session?.status === 'question') {
            setSelectedChoice(null);
            setHasAnsweredCurrentQ(false);
            setQuestionStartTime(Date.now());
        }
    }, [session?.status, session?.currentQuestionIndex]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        setJoinError(null);

        if (!pin.trim() || !nickname.trim()) {
            setJoinError('Veuillez renseigner le code PIN et votre prénom.');
            return;
        }

        const res = joinLiveBattle(pin.trim(), nickname.trim());
        if (!res.success || !res.player) {
            setJoinError(res.error || 'Impossible de rejoindre la session.');
            return;
        }

        setJoinedPlayer(res.player);
        const s = getLiveBattleSession(pin.trim());
        setSession(s);
    };

    const handleAnswer = (choiceId: string) => {
        if (!session || !joinedPlayer || hasAnsweredCurrentQ || session.status !== 'question') return;

        const elapsedMs = Date.now() - questionStartTime;
        setSelectedChoice(choiceId);
        setHasAnsweredCurrentQ(true);

        submitPlayerAnswer(session.pin, joinedPlayer.id, session.currentQuestionIndex, choiceId, elapsedMs);
    };

    // Calculate missed questions for post-battle sales trigger
    const currentQ = session?.questions[session?.currentQuestionIndex || 0];

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between p-4 max-w-lg mx-auto select-none">
            {/* Top Player Header */}
            <header className="py-3 border-b border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-accent-yellow text-black flex items-center justify-center font-bold text-xs">
                        {joinedPlayer?.avatar || '⚡'}
                    </div>
                    <div>
                        <p className="font-bold text-xs text-text-primary">
                            {joinedPlayer?.nickname || 'Kompas Live'}
                        </p>
                        {session && (
                            <p className="text-[10px] font-mono text-text-secondary">
                                PIN : {session.pin}
                            </p>
                        )}
                    </div>
                </div>

                {joinedPlayer && (
                    <div className="text-right">
                        <span className="text-[10px] font-mono uppercase text-text-muted">SCORE</span>
                        <p className="font-mono font-bold text-sm text-accent-yellow">
                            {joinedPlayer.score} pts
                        </p>
                    </div>
                )}
            </header>

            {/* SCREEN 1: JOIN FORM */}
            {!joinedPlayer ? (
                <main className="flex-1 flex flex-col justify-center space-y-6 py-8 animate-in fade-in">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-3 rounded-2xl bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                            <Smartphone className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary">
                            Rejoindre la Live Battle
                        </h1>
                        <p className="text-xs text-text-secondary">
                            Entrez le code PIN affiché sur le rétroprojecteur pour affronter votre classe en direct.
                        </p>
                    </div>

                    <form onSubmit={handleJoin} className="card-editorial p-6 rounded-3xl bg-surface-card border-border space-y-4 shadow-xl">
                        {joinError && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                {joinError}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-text-secondary">
                                Code PIN du Rétroprojecteur
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="ex: 8421"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full text-center text-3xl font-mono font-bold tracking-widest bg-surface border border-border/70 rounded-2xl py-3 text-accent-yellow focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-text-secondary">
                                Votre Prénom / Pseudo
                            </label>
                            <input
                                type="text"
                                placeholder="ex: Paul (A3 Strasbourg)"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full bg-surface border border-border/70 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="premium"
                            size="lg"
                            className="w-full font-bold text-sm shadow-xl shadow-accent-yellow/20 cursor-pointer"
                        >
                            Rejoindre la Partie →
                        </Button>
                    </form>
                </main>
            ) : session?.status === 'lobby' ? (
                /* SCREEN 2: LOBBY WAITING */
                <main className="flex-1 flex flex-col justify-center text-center space-y-6 py-8 animate-in zoom-in-95">
                    <div className="w-20 h-20 rounded-3xl bg-accent-yellow/15 border border-accent-yellow/30 mx-auto flex items-center justify-center text-4xl shadow-xl animate-pulse">
                        {joinedPlayer.avatar}
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-text-primary">
                            Vous êtes dans le Lobby !
                        </h2>
                        <p className="text-xs text-text-secondary max-w-xs mx-auto">
                            Regardez le rétroprojecteur. La partie démarre dès que l&apos;hôte lance le quiz.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface border border-border/70 text-xs font-mono text-text-muted">
                        Session : <strong>{session.title}</strong>
                    </div>
                </main>
            ) : session?.status === 'question' ? (
                /* SCREEN 3: IN-GAME FAST 4-BUTTON TOUCH SCREEN */
                <main className="flex-1 flex flex-col justify-center space-y-4 py-4 animate-in fade-in">
                    <div className="text-center pb-2">
                        <span className="text-xs font-mono text-text-muted uppercase">
                            Question {session.currentQuestionIndex + 1} / {session.totalQuestions}
                        </span>
                        <p className="text-xs font-semibold text-accent-yellow">
                            {hasAnsweredCurrentQ ? '✓ Réponse enregistrée !' : 'Touchez votre réponse :'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 max-h-[440px]">
                        {PLAYER_CHOICE_BUTTONS.map((btn) => {
                            const isSelected = selectedChoice === btn.id;

                            return (
                                <button
                                    key={btn.id}
                                    type="button"
                                    onClick={() => handleAnswer(btn.id)}
                                    disabled={hasAnsweredCurrentQ}
                                    className={`rounded-3xl ${btn.bg} text-white font-bold flex flex-col items-center justify-center p-6 shadow-xl transition-all cursor-pointer ${
                                        isSelected ? 'ring-4 ring-white scale-95 opacity-100' : hasAnsweredCurrentQ ? 'opacity-40' : ''
                                    }`}
                                >
                                    <span className="text-4xl sm:text-5xl font-black mb-1">
                                        {btn.symbol}
                                    </span>
                                    <span className="text-xs uppercase font-mono tracking-wider">
                                        Choix {btn.id}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </main>
            ) : session?.status === 'reveal' ? (
                /* SCREEN 4: ROUND REVEAL FEEDBACK */
                <main className="flex-1 flex flex-col justify-center text-center space-y-5 py-8 animate-in zoom-in-95">
                    {(() => {
                        const ans = joinedPlayer.answers[session.currentQuestionIndex];
                        const isCorrect = ans?.isCorrect;

                        return (
                            <div className="space-y-4">
                                <div
                                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white ${
                                        isCorrect ? 'bg-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-red-500 shadow-xl shadow-red-500/20'
                                    }`}
                                >
                                    {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-2xl font-serif font-bold text-text-primary">
                                        {isCorrect ? 'Bonne réponse !' : 'Aïe, mauvaise réponse...'}
                                    </h3>
                                    <p className="text-xs text-text-secondary">
                                        {isCorrect ? '+850 points de rapidité' : 'Regardez l\'explication sur le rétroprojecteur'}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}
                </main>
            ) : (
                /* SCREEN 5: 💥 POST-BATTLE SALES TRIGGER & FOMO ERROR DIAGNOSTIC */
                <main className="flex-1 flex flex-col justify-center space-y-6 py-6 animate-in zoom-in-95">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-3 rounded-2xl bg-accent-yellow text-black font-bold shadow-md">
                            <Trophy className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-text-primary">
                            Fin de la Live Battle !
                        </h2>
                        <p className="text-xs font-mono text-accent-yellow font-bold">
                            Score final : {joinedPlayer.score} pts
                        </p>
                    </div>

                    {/* Personal Missed Concepts Breakdown (The FOMO Trigger) */}
                    <div className="card-editorial p-5 rounded-3xl bg-surface-card border-2 border-red-500/40 space-y-3 shadow-xl">
                        <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Bilan de vos erreurs en direct</span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Vous avez fait des erreurs sur des concepts clés exigés au prochain CCTL officiel :
                        </p>

                        <div className="space-y-2 pt-1">
                            <div className="p-2.5 rounded-xl bg-surface border border-border/70 text-xs space-y-0.5">
                                <span className="font-mono text-[10px] text-accent-yellow uppercase">LACUNE DÉTECTÉE</span>
                                <p className="font-semibold text-text-primary">Sécurité Web &amp; Headers HTTP (X-Frame / CSP)</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border border-border/70 text-xs space-y-0.5">
                                <span className="font-mono text-[10px] text-accent-yellow uppercase">LACUNE DÉTECTÉE</span>
                                <p className="font-semibold text-text-primary">Transactions SQL &amp; Propriétés ACID (Isolation)</p>
                            </div>
                        </div>
                    </div>

                    {/* The Unbeatable Individual Sales Conversion Box */}
                    <div className="card-editorial p-6 rounded-3xl bg-gradient-to-b from-accent-yellow/20 to-surface-card border-2 border-accent-yellow space-y-4 text-center shadow-2xl">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase bg-accent-yellow text-black px-2.5 py-0.5 rounded-full">
                                OFFRE ÉTUDIANT CESI
                            </span>
                            <h3 className="font-serif font-bold text-lg text-text-primary">
                                Débloquez vos explications pas-à-pas
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Accédez au <strong>Tuteur IA 24/7</strong>, aux <strong>annales CCTL corrigées</strong> et au <strong>Radar de compétences</strong> pour dépasser vos camarades au prochain partiel.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Link href="/pricing" className="block w-full">
                                <Button variant="premium" className="w-full font-bold text-xs py-5 shadow-lg shadow-accent-yellow/20 cursor-pointer">
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                    Débloquer mon compte (4,99€ / mois)
                                </Button>
                            </Link>

                            <Link href="/dashboard/import" className="block w-full">
                                <Button variant="outline" className="w-full border-border text-xs text-text-secondary hover:text-text-primary">
                                    <Gift className="w-4 h-4 mr-1.5 text-accent-yellow" />
                                    Déposer un sujet CCTL (+1 mois offert)
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            )}

            {/* Bottom Footer */}
            <footer className="py-2 text-center text-[10px] text-text-muted border-t border-border/40 font-mono">
                Kompas CESI • Plateforme collaborative d&apos;ingénierie
            </footer>
        </div>
    );
}

export default function LivePlayerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-text-muted">Chargement de la session Live...</div>}>
            <LivePlayerContent />
        </Suspense>
    );
}
