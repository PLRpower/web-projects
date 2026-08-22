'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileCheck, 
    Wand2, 
    FolderOpen, 
    ArrowRight, 
    CheckCircle2, 
    Terminal, 
    ExternalLink, 
    Sparkles,
    Check
} from 'lucide-react';
import Link from 'next/link';

interface QuizQuestion {
    id: number;
    subject: string;
    level: string;
    question: string;
    codeSnippet?: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        subject: "Web Architecture • React 19",
        level: "CCTL A3 FISA",
        question: "Dans l'App Router de Next.js, quel mot-clé indique qu'une fonction serveur peut être invoquée directement depuis un formulaire client ?",
        codeSnippet: `"use server"; // Server Action directive`,
        options: [
            '"use client"',
            '"use server"',
            'export async default',
            'getServerSideProps()'
        ],
        correctIndex: 1,
        explanation: "La directive 'use server' définit une Server Action pouvant être déclenchée de manière transparente côté client avec gestion automatique du CSRF."
    },
    {
        id: 2,
        subject: "Algorithmique & Graphes",
        level: "CCTL A2 Prépa",
        question: "Quel algorithme permet de trouver le plus court chemin dans un graphe pondéré sans poids négatifs avec une complexité optimale ?",
        options: [
            "Algorithme de Bellman-Ford",
            "Parcours en Profondeur (DFS)",
            "Algorithme de Dijkstra",
            "Algorithme de Floyd-Warshall"
        ],
        correctIndex: 2,
        explanation: "L'algorithme de Dijkstra utilisant une file de priorité (min-heap) s'exécute en O((V + E) log V), idéal pour les graphes aux arêtes positives."
    }
];

interface PrositStep {
    stepNum: string;
    name: string;
    sampleOutput: string;
}

const PROSIT_STEPS: PrositStep[] = [
    {
        stepNum: "01",
        name: "Mots-Clés",
        sampleOutput: "- Microservices : Architecture distribuée à couplage faible.\n- Event-Driven : Modèle basé sur la publication d'événements (Kafka/RabbitMQ)."
    },
    {
        stepNum: "03",
        name: "Problématique",
        sampleOutput: "« Comment concevoir une architecture distribuée résiliente garantissant la cohérence des données sans transactions bloquantes ? »"
    },
    {
        stepNum: "05",
        name: "Plan d'Action",
        sampleOutput: "1. Théo : Benchmark Kafka vs RabbitMQ\n2. Sarah : Pattern Saga vs 2PC (Two-Phase Commit)\n3. Lucas : Circuit Breaker (Resilience4j)"
    },
    {
        stepNum: "07",
        name: "Synthèse",
        sampleOutput: "### Synthèse Finale Prosit // Architecture Distribuée\n- Modèle validé : Saga Chorégraphiée\n- Base de données : Outbox Pattern avec Debezium CDC"
    }
];

const LIVRABLES = [
    {
        title: "Projet • Architecture Cloud & Microservices",
        type: "Dossier Technique",
        promo: "A4 FISA Informatique",
        criteria: ["Architecture logicielle C4", "Sécurité OWASP & JWT", "Infrastructure as Code (Terraform)"],
        summary: "Dossier de projet complet avec schémas d'architecture réseau, choix technologiques justifiés et matrices de flux."
    },
    {
        title: "Projet • Système Embarqué IoT & LoRa",
        type: "Livrable de Fin de Bloc",
        promo: "A3 FISE Généraliste",
        criteria: ["Cahier des charges fonctionnel", "Rapport de tests unitaires", "Diaporama de soutenance"],
        summary: "Code commenté C/C++, schéma de câblage électronique et dossier d'analyse des risques."
    }
];

export default function KompasBento() {
    const [quizIdx, setQuizIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    const [activePrositStep, setActivePrositStep] = useState(0);
    const [activeLivrableIdx, setActiveLivrableIdx] = useState(0);

    const currentQuiz = QUIZ_QUESTIONS[quizIdx];
    const currentLivrable = LIVRABLES[activeLivrableIdx];

    const handleSelectAnswer = (idx: number) => {
        if (hasAnswered) return;
        setSelectedOption(idx);
        setHasAnswered(true);
    };

    const handleNextQuiz = () => {
        setSelectedOption(null);
        setHasAnswered(false);
        setQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
    };

    return (
        <section id="modules" className="py-16 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 pb-6 border-b border-border/70">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                            Les CCTL, les Prosits <br />
                            <span className="italic font-normal">et les livrables de projet.</span>
                        </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
                        Toutes les ressources pour préparer vos examens et soutenances du CESI.
                    </p>
                </div>

                {/* PILIER 1: TERMINAL CCTL */}
                <div className="mb-8">
                    <div className="rounded-3xl p-6 sm:p-8 bg-surface-card border border-border shadow-lg relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-surface border border-border text-accent-yellow">
                                    <Terminal size={18} />
                                </div>
                                <h3 className="font-serif text-xl font-normal text-text-primary">
                                    Simulateur d&apos;examens CCTL
                                </h3>
                            </div>

                            <Link
                                href="/cctl"
                                className="text-xs font-bold text-accent-yellow hover:underline inline-flex items-center gap-1.5"
                            >
                                <span>Voir toutes les 2 540 annales</span>
                                <ExternalLink size={13} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-6 space-y-3">
                                <div className="text-xs font-mono text-text-muted">
                                    <span className="text-text-primary font-semibold">{currentQuiz.level}</span>
                                    <span> • </span>
                                    <span>{currentQuiz.subject}</span>
                                </div>

                                <p className="font-serif text-lg sm:text-xl text-text-primary leading-snug">
                                    {currentQuiz.question}
                                </p>

                                {currentQuiz.codeSnippet && (
                                    <div className="p-3 rounded-xl bg-surface border border-border font-mono text-xs text-text-secondary overflow-x-auto">
                                        <code>{currentQuiz.codeSnippet}</code>
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-6 space-y-2">
                                {currentQuiz.options.map((option, idx) => {
                                    const isSelected = selectedOption === idx;
                                    const isCorrect = idx === currentQuiz.correctIndex;
                                    
                                    let btnStyle = "bg-surface hover:bg-surface-highlight border-border text-text-primary";
                                    if (hasAnswered) {
                                        if (isCorrect) {
                                            btnStyle = "bg-accent-yellow/10 border-accent-yellow text-text-primary font-bold";
                                        } else if (isSelected && !isCorrect) {
                                            btnStyle = "opacity-40 border-border bg-surface";
                                        } else {
                                            btnStyle = "opacity-30 border-border/40 bg-surface";
                                        }
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelectAnswer(idx)}
                                            disabled={hasAnswered}
                                            className={`w-full p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                        >
                                            <span>{option}</span>
                                            {hasAnswered && isCorrect && (
                                                <CheckCircle2 size={16} className="text-accent-yellow shrink-0 ml-2" />
                                            )}
                                        </button>
                                    );
                                })}

                                <AnimatePresence>
                                    {hasAnswered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3.5 rounded-xl border border-accent-yellow/30 bg-accent-yellow/5 text-text-primary text-xs leading-relaxed mt-2"
                                        >
                                            <div className="font-bold text-xs mb-1 text-accent-yellow">
                                                Explication :
                                            </div>
                                            <div>{currentQuiz.explanation}</div>

                                            <button
                                                onClick={handleNextQuiz}
                                                className="mt-2.5 px-3 py-1.5 rounded-lg bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span>Question suivante</span>
                                                <ArrowRight size={12} />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PILIERS 2 & 3: PROSITS & LIVRABLES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* PROSITS */}
                    <div className="rounded-3xl p-6 sm:p-7 bg-surface-card border border-border shadow-md flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-surface border border-border text-accent-yellow">
                                        <Wand2 size={16} />
                                    </div>
                                    <h3 className="font-serif text-lg font-normal text-text-primary">
                                        Prosits en 7 Étapes
                                    </h3>
                                </div>
                            </div>

                            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                                Problématiques rédigées, hypothèses et plans d&apos;action.
                            </p>

                            {/* Prosit Steps Selector */}
                            <div className="grid grid-cols-4 gap-1.5 mb-3">
                                {PROSIT_STEPS.map((step, idx) => {
                                    const isActive = activePrositStep === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActivePrositStep(idx)}
                                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-surface border-accent-yellow text-accent-yellow font-bold shadow-xs'
                                                    : 'bg-surface border-border text-text-secondary hover:bg-surface-highlight'
                                            }`}
                                        >
                                            <div className="text-[11px] font-medium truncate">
                                                {step.name}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Markdown Preview Sheet */}
                            <div className="font-mono text-xs text-text-primary whitespace-pre-line leading-relaxed bg-surface p-3 rounded-xl border border-border">
                                {PROSIT_STEPS[activePrositStep].sampleOutput}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-border/60">
                            <Link href="/prosits">
                                <button className="w-full py-2.5 rounded-xl bg-surface border border-border text-text-primary font-bold text-xs hover:border-accent-yellow transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Explorer les Prosits</span>
                                    <ArrowRight size={13} />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* LIVRABLES */}
                    <div className="rounded-3xl p-6 sm:p-7 bg-surface-card border border-border shadow-md flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-surface border border-border text-accent-yellow">
                                        <FolderOpen size={16} />
                                    </div>
                                    <h3 className="font-serif text-lg font-normal text-text-primary">
                                        Livrables de Projet Validés
                                    </h3>
                                </div>
                            </div>

                            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                                Dossiers d&apos;architecture, cahiers des charges et diaporamas de soutenance.
                            </p>

                            {/* Project Switcher Tabs */}
                            <div className="grid grid-cols-2 gap-1.5 mb-3">
                                {LIVRABLES.map((liv, idx) => {
                                    const isActive = activeLivrableIdx === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveLivrableIdx(idx)}
                                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-surface border-accent-yellow text-accent-yellow font-bold shadow-xs'
                                                    : 'bg-surface border-border text-text-secondary hover:bg-surface-highlight'
                                            }`}
                                        >
                                            <div className="text-[11px] font-medium truncate">
                                                {liv.promo}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Livrable Preview Box */}
                            <div className="p-3 rounded-xl bg-surface border border-border space-y-2">
                                <div className="font-serif text-sm font-bold text-text-primary">
                                    {currentLivrable.title}
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    {currentLivrable.summary}
                                </p>
                                <div className="space-y-1 pt-1 border-t border-border/50">
                                    {currentLivrable.criteria.map((c, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-primary">
                                            <Check size={12} className="text-accent-yellow shrink-0" />
                                            <span className="truncate">{c}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-border/60">
                            <Link href="/livrables">
                                <button className="w-full py-2.5 rounded-xl bg-surface border border-border text-text-primary font-bold text-xs hover:border-accent-yellow transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Consulter les livrables</span>
                                    <ArrowRight size={13} />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
