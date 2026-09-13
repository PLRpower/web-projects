'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    RotateCw, 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    Layers, 
    ArrowRight,
    Brain,
    FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function FeaturesShowcase() {
    // STATE 1: FLASHCARDS
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardMastery, setCardMastery] = useState<'review' | 'medium' | 'mastered' | null>(null);

    // STATE 2: CCTL SIMULATOR
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // STATE 3: PROSIT GENERATOR
    const [activePrositStep, setActivePrositStep] = useState<number>(0);

    const PROSIT_STEPS = [
        {
            num: "01",
            title: "Mots-Clés",
            content: "• TRS (Taux de Rendement Synthétique) : Indicateur mesurant l'efficacité d'une ligne (Disponibilité × Performance × Qualité).\n• AMDEC Process : Analyse des modes de défaillance, de leurs effets et de leur criticité.\n• Méthode SMED : Démarche Lean visant à réduire les temps de changement de série sous les 10 minutes."
        },
        {
            num: "03",
            title: "Problématique",
            content: "« Comment optimiser la cadence de la ligne d'assemblage automatisée en réduisant les goulots d'étranglement sans compromettre la sécurité des opérateurs ni la capabilité procédé (Cpk > 1.33) ? »"
        },
        {
            num: "07",
            title: "Synthèse",
            content: "### Synthèse Finale Prosit // Génie Industriel & Lean\n✓ Diagnostic : Équilibrage des postes via le diagramme d'Ishikawa et chronométrage MTM.\n✓ Solution retenue : Implémentation du Kanban en flux tiré et maintenance prédictive vibratoire.\n✓ Impact : Gain estimé de +14% sur le TRS global et réduction de 35% des en-cours."
        }
    ];

    return (
        <section className="py-20 sm:py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl space-y-12">
                
                {/* SECTION HEADER - LARGE & SPACIOUS with scroll reveal */}
                <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-border/70"
                >
                    <div className="space-y-3 max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                            Tout ce dont vous avez besoin pour <span className="italic font-normal">valider vos semestres.</span>
                        </h2>
                    </div>

                    <p className="text-sm sm:text-base text-text-secondary max-w-md leading-relaxed">
                        Des outils interactifs conçus sur-mesure pour préparer vos examens CCTL, vos fiches Prosits et réviser en toute autonomie.
                    </p>
                </motion.div>

                {/* 4 LARGE, SPACIOUS INTERACTIVE CARDS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ======================================================== */}
                    {/* 1. SIMULATEUR CCTL (BTP / Génie Civil - 7 cols) */}
                    {/* ======================================================== */}
                    <motion.div 
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-surface-card border border-border shadow-lg flex flex-col justify-between space-y-6 hover:border-accent-yellow/40 transition-colors"
                    >
                        <div className="space-y-5">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                                <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-emerald-500 shadow-xs">
                                    <FileCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-text-primary tracking-tight">
                                        Simulateur d&apos;examens CCTL
                                    </h3>
                                    <p className="text-xs text-text-muted font-normal">Entraînement interactif &amp; corrections détaillées</p>
                                </div>
                            </div>

                            <p className="text-base sm:text-lg text-text-primary font-medium leading-snug">
                                En calcul de structure selon l&apos;Eurocode 2, quelle disposition prévient le risque de rupture par poinçonnement d&apos;une dalle sur poteau ?
                            </p>

                            {/* Large Options */}
                            <div className="space-y-2.5 pt-1">
                                {[
                                    { text: "Augmentation de l'enrobage des aciers inférieurs en travée", isCorrect: false },
                                    { text: "Disposition d'armatures transversales de poinçonnement ou étriers verticaux", isCorrect: true },
                                    { text: "Diminution de la classe de résistance caractéristique fck du béton", isCorrect: false }
                                ].map((opt, idx) => {
                                    const isChosen = selectedOption === idx;
                                    const showStatus = selectedOption !== null;
                                    const isOptionCorrect = opt.isCorrect;
                                    const isOtherOptionLocked = showStatus && !isChosen;

                                    let btnStyles = "bg-transparent border-border text-text-secondary hover:border-accent-yellow hover:text-text-primary cursor-pointer";
                                    if (showStatus) {
                                        if (isOptionCorrect) btnStyles = "bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold";
                                        else if (isChosen) btnStyles = "bg-rose-500/10 border-rose-500 text-rose-800 dark:text-rose-300 font-bold";
                                        else btnStyles = "bg-transparent border-border/40 text-text-secondary cursor-not-allowed";
                                    }

                                    const handleToggle = () => {
                                        if (selectedOption === idx) {
                                            setSelectedOption(null); // Décocher sa réponse
                                        } else if (selectedOption === null) {
                                            setSelectedOption(idx); // Cocher la réponse
                                        }
                                    };

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={isOtherOptionLocked}
                                            onClick={handleToggle}
                                            className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyles} ${isChosen ? 'cursor-pointer' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 rounded-lg bg-transparent border border-border flex items-center justify-center font-mono font-bold text-xs text-text-primary shrink-0">
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span className="font-medium">{opt.text}</span>
                                            </div>
                                            {showStatus && isOptionCorrect && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                                            {showStatus && isChosen && !isOptionCorrect && <XCircle size={18} className="text-rose-500 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {selectedOption !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 rounded-2xl bg-surface/90 border border-border text-xs sm:text-sm text-text-secondary space-y-1 overflow-hidden"
                                    >
                                        <div className="font-mono font-bold text-accent-yellow text-xs">Explication détaillée (Eurocode 2) :</div>
                                        <p className="leading-relaxed">
                                            Le poinçonnement est un cisaillement concentré autour du poteau. L&apos;Eurocode 2 impose la mise en place d&apos;armatures transversales spécifiques (étriers verticaux ou goujons) lorsque la résistance au cisaillement sans armature VRd,c est dépassée.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="pt-4 flex items-center justify-end border-t border-border/50 text-xs sm:text-sm">
                            <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-yellow hover:underline transition-colors group/link">
                                <span>Lancer un CCTL d&apos;entraînement</span>
                                <ArrowRight size={14} className="text-accent-yellow group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* ======================================================== */}
                    {/* 2. FLASHCARDS 3D (Systèmes Embarqués - 5 cols) */}
                    {/* ======================================================== */}
                    <motion.div 
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-surface-card border border-border shadow-lg flex flex-col justify-between space-y-6 hover:border-accent-yellow/40 transition-colors"
                    >
                        <div className="space-y-5">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                                <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent-yellow shadow-xs">
                                    <Brain size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-text-primary tracking-tight">
                                        Flashcards intelligentes
                                    </h3>
                                    <p className="text-xs text-text-muted font-normal">Répétition espacée &amp; mémorisation active</p>
                                </div>
                            </div>

                            {/* Tactile 3D Flip Card - Large & Comfortable */}
                            <div 
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="perspective-1000 w-full min-h-[190px] sm:min-h-[215px] cursor-pointer select-none group"
                            >
                                <div 
                                    className={`relative w-full h-full min-h-[190px] sm:min-h-[215px] transition-transform duration-500 preserve-3d ${
                                        isFlipped ? 'rotate-y-180' : ''
                                    }`}
                                >
                                    {/* FRONT */}
                                    <div className="absolute inset-0 backface-hidden rounded-2xl p-6 bg-accent-yellow text-black flex flex-col justify-between shadow-md">
                                        <div className="flex items-center justify-between text-xs font-mono text-black/80">
                                            <span className="font-bold uppercase tracking-wider">Question</span>
                                            <span className="flex items-center gap-1.5 text-black/75 text-[11px]">
                                                <RotateCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                                <span>Cliquez pour retourner</span>
                                            </span>
                                        </div>
                                        <p className="font-serif text-base sm:text-lg text-black font-medium text-center py-2 leading-relaxed">
                                            « Quel bus différentiel sur 2 fils assure l&apos;immunité électromagnétique dans l&apos;embarqué automobile &amp; aéronautique ? »
                                        </p>
                                        <div />
                                    </div>

                                    {/* BACK */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-6 bg-accent-yellow text-black flex flex-col justify-between shadow-md">
                                        <div className="flex items-center justify-between text-xs font-mono text-black/80">
                                            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                <CheckCircle2 size={13} className="text-black" />
                                                Réponse
                                            </span>
                                            <span className="flex items-center gap-1.5 text-black/75 text-[11px]">
                                                <RotateCw size={12} />
                                                <span>Retourner</span>
                                            </span>
                                        </div>
                                        <div className="text-center space-y-1.5 py-2">
                                            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                                                Bus CAN (ISO 11898)
                                            </div>
                                            <p className="text-xs sm:text-sm text-black/85 font-sans font-medium">
                                                Ligne différentielle (CAN-H / CAN-L) avec arbitrage non destructif bit à bit.
                                            </p>
                                        </div>
                                        <div />
                                    </div>
                                </div>
                            </div>

                            {/* Spaced repetition buttons - 2 buttons matching app system with subtle selection background */}
                            <div className="grid grid-cols-2 gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setCardMastery('review')}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        cardMastery === 'review'
                                            ? 'bg-rose-500/10 border-rose-500 text-rose-500 dark:text-rose-400 font-bold'
                                            : 'bg-transparent border-border text-text-secondary hover:text-rose-500 hover:border-rose-500/50'
                                    }`}
                                >
                                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                    <span>À revoir</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCardMastery('mastered')}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        cardMastery === 'mastered'
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 dark:text-emerald-400 font-bold'
                                            : 'bg-transparent border-border text-text-secondary hover:text-emerald-500 hover:border-emerald-500/50'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Maîtrisé</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end border-t border-border/50 text-xs sm:text-sm">
                            <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-yellow hover:underline transition-colors group/link">
                                <span>Explorer les decks de révision</span>
                                <ArrowRight size={14} className="text-accent-yellow group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* ======================================================== */}
                    {/* 3. CHAT INTER-PROMOS (Informatique - 6 cols) */}
                    {/* ======================================================== */}
                    <motion.div 
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-surface-card border border-border shadow-lg flex flex-col justify-between space-y-6 hover:border-accent-yellow/40 transition-colors"
                    >
                        <div className="space-y-5">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                                <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-blue-500 shadow-xs">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-text-primary tracking-tight">
                                        Chat &amp; entraide étudiante
                                    </h3>
                                    <p className="text-xs text-text-muted font-normal">Discussions promo &amp; partage de corrigés</p>
                                </div>
                            </div>

                            {/* Clean mock chat - Staggered scroll animation for bubbles */}
                            <div className="space-y-3">
                                {/* Message 1: Antoine (Sent by user) */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                    className="p-4 rounded-2xl bg-surface border border-accent-yellow/70 space-y-1.5 max-w-[92%] sm:max-w-[85%] ml-auto shadow-xs"
                                >
                                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-accent-yellow text-black flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                                                A
                                            </div>
                                            <span className="font-semibold text-text-primary text-xs sm:text-sm truncate">Antoine M.</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-text-muted/80 shrink-0">Il y a 12 min</span>
                                    </div>
                                    <p className="text-text-secondary text-xs sm:text-sm leading-relaxed pl-8">
                                        Quelqu&apos;un a les précisions sur le barème de l&apos;exercice 3 du CCTL d&apos;Architecture Distribuée ?
                                    </p>
                                </motion.div>

                                {/* Message 2: Sarah (Received from peer) */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="p-4 rounded-2xl bg-surface border border-border space-y-1.5 max-w-[92%] sm:max-w-[85%] mr-auto"
                                >
                                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-full bg-accent-yellow/20 text-accent-yellow flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
                                                S
                                            </div>
                                            <span className="font-semibold text-text-primary text-xs sm:text-sm truncate">Sarah L.</span>
                                            <span className="text-xs font-mono text-text-muted shrink-0 hidden sm:inline">• Campus Lyon (A3 Info)</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-text-muted/80 shrink-0">Il y a 8 min</span>
                                    </div>
                                    <p className="text-text-secondary text-xs sm:text-sm leading-relaxed pl-8">
                                        Le corrigé complet avec les diagrammes de séquence et le pattern Saga est déjà en ligne sur Kompas 📌
                                    </p>
                                </motion.div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end border-t border-border/50 text-xs sm:text-sm">
                            <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-yellow hover:underline transition-colors group/link">
                                <span>Rejoindre la communauté</span>
                                <ArrowRight size={14} className="text-accent-yellow group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* ======================================================== */}
                    {/* 4. GÉNÉRATEUR PROSIT (Généraliste / Génie Industriel - 6 cols) */}
                    {/* ======================================================== */}
                    <motion.div 
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-surface-card border border-border shadow-lg flex flex-col justify-between space-y-6 hover:border-accent-yellow/40 transition-colors"
                    >
                        <div className="space-y-5">
                            {/* Card Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                                <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent-orange shadow-xs">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-serif font-normal text-text-primary tracking-tight">
                                        Générateur de Prosit
                                    </h3>
                                    <p className="text-xs text-text-muted font-normal">Synthèse structurée avec les 7 étapes des prosits</p>
                                </div>
                            </div>

                            {/* Step selector buttons */}
                            <div className="grid grid-cols-3 gap-2">
                                {PROSIT_STEPS.map((step, idx) => {
                                    const isSelected = activePrositStep === idx;
                                    return (
                                        <button
                                            key={step.num}
                                            type="button"
                                            onClick={() => setActivePrositStep(idx)}
                                            className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs ${
                                                isSelected
                                                    ? 'bg-transparent border-accent-yellow text-accent-yellow font-bold ring-1 ring-accent-yellow/40'
                                                    : 'bg-transparent border-border text-text-secondary hover:text-text-primary hover:border-border/90'
                                            }`}
                                        >
                                            <span className="font-mono font-semibold">{step.num}. </span>
                                            <span className="font-medium">{step.title}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Output preview - Large & readable */}
                            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 space-y-2 relative">
                                <div className="pb-2 border-b border-border/50">
                                    <span className="text-text-primary font-bold font-mono text-xs">
                                        Étape {PROSIT_STEPS[activePrositStep].num} • {PROSIT_STEPS[activePrositStep].title}
                                    </span>
                                </div>
                                <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-text-secondary pt-1">
                                    {PROSIT_STEPS[activePrositStep].content}
                                </pre>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end border-t border-border/50 text-xs sm:text-sm">
                            <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent-yellow hover:underline transition-colors group/link">
                                <span>Créer une fiche Prosit</span>
                                <ArrowRight size={14} className="text-accent-yellow group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
