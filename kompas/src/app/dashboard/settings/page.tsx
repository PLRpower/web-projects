'use client';

import { useState, useEffect } from 'react';
import {
    Shield,
    Sliders,
    Download,
    Check,
    Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    const [savedAlert, setSavedAlert] = useState(false);

    // CCTL Simulation preferences
    const [strictGrading, setStrictGrading] = useState(false); // -0.5 points for wrong answers (CESI negative points mode)
    const [examTimerMinutes, setExamTimerMinutes] = useState(20);
    const [soundEffects, setSoundEffects] = useState(true);
    const [autoShowExplanation, setAutoShowExplanation] = useState(true);

    // Privacy & Anonymity
    const [anonymousUploads, setAnonymousUploads] = useState(true);
    const [hideProfileLeaderboard, setHideProfileLeaderboard] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('kompas_user_settings');
        if (savedSettings) {
            try {
                const s = JSON.parse(savedSettings);
                if (s.strictGrading !== undefined) setStrictGrading(s.strictGrading);
                if (s.examTimerMinutes) setExamTimerMinutes(s.examTimerMinutes);
                if (s.soundEffects !== undefined) setSoundEffects(s.soundEffects);
                if (s.autoShowExplanation !== undefined) setAutoShowExplanation(s.autoShowExplanation);
                if (s.anonymousUploads !== undefined) setAnonymousUploads(s.anonymousUploads);
                if (s.hideProfileLeaderboard !== undefined) setHideProfileLeaderboard(s.hideProfileLeaderboard);
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    const handleSaveSettings = () => {
        const settings = {
            strictGrading,
            examTimerMinutes,
            soundEffects,
            autoShowExplanation,
            anonymousUploads,
            hideProfileLeaderboard
        };
        localStorage.setItem('kompas_user_settings', JSON.stringify(settings));
        setSavedAlert(true);
        setTimeout(() => setSavedAlert(false), 3000);
    };

    const handleExportData = () => {
        const data = {
            appName: 'Kompas | CESI',
            exportDate: new Date().toISOString(),
            profile: JSON.parse(localStorage.getItem('kompas_user_profile') || '{}'),
            settings: {
                strictGrading,
                examTimerMinutes,
                soundEffects
            },
            disclaimer: 'Données exportées conformément au RGPD pour votre usage personnel.'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kompas-data-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 pb-12 max-w-5xl">
            {/* Header */}
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface/60 border-border relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />
                <div className="space-y-1 sm:space-y-2 relative z-10">
                    <h1 className="text-3xl sm:text-5xl font-normal font-serif text-text-primary tracking-tight">
                        Paramètres &amp; <span className="italic font-normal">Préférences</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary font-normal">
                        Personnalisez votre simulateur d&apos;examens CCTL et vos préférences de compte.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        type="button"
                        onClick={handleSaveSettings}
                        className="px-5 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-md shadow-accent-yellow/20 flex items-center gap-2 cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les préférences</span>
                    </button>
                </div>
            </div>

            {/* Success Alert */}
            {savedAlert && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <Check className="w-5 h-5 shrink-0 text-emerald-400" />
                    <span className="text-sm font-semibold">Toutes vos préférences ont été sauvegardées avec succès !</span>
                </div>
            )}

            <div className="space-y-6">
                {/* 1. CCTL Exam Simulator Options */}
                <div className="glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <div className="p-2.5 rounded-xl bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20">
                            <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-syne text-text-primary">Moteur d&apos;Examen & Simulateur CCTL</h2>
                            <p className="text-xs text-text-secondary">Réglez le comportement des entraînements et des QCMs chronométrés.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strict Grading (Points négatifs) */}
                        <div className="p-5 rounded-2xl bg-surface-highlight/30 border border-border/60 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-text-primary block">Barème strict (Points négatifs)</span>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Retire 0.5 point par mauvaise réponse pour simuler les conditions réelles des CCTLs CESI les plus sévères.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    checked={strictGrading}
                                    onChange={(e) => setStrictGrading(e.target.checked)}
                                    className="sr-only peer"
                                    aria-label="Activer le barème strict"
                                />
                                <div className="w-11 h-6 bg-surface-highlight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow" />
                            </label>
                        </div>

                        {/* Sound Effects */}
                        <div className="p-5 rounded-2xl bg-surface-highlight/30 border border-border/60 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-text-primary block">Effets sonores de validation</span>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Joue un retour audio subtil lors de la validation d&apos;une question ou à la fin d&apos;un QCM.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    checked={soundEffects}
                                    onChange={(e) => setSoundEffects(e.target.checked)}
                                    className="sr-only peer"
                                    aria-label="Activer les effets sonores"
                                />
                                <div className="w-11 h-6 bg-surface-highlight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow" />
                            </label>
                        </div>

                        {/* Exam Timer */}
                        <div className="p-5 rounded-2xl bg-surface-highlight/30 border border-border/60 space-y-2">
                            <label htmlFor="exam-timer-select" className="text-sm font-bold text-text-primary block">Durée standard de simulation CCTL</label>
                            <p className="text-xs text-text-secondary">Temps alloué par défaut lors d&apos;un examen blanc complet.</p>
                            <select
                                id="exam-timer-select"
                                value={examTimerMinutes}
                                onChange={(e) => setExamTimerMinutes(Number(e.target.value))}
                                className="w-full bg-surface-highlight border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50"
                            >
                                <option value={10}>10 minutes (Mode Express)</option>
                                <option value={15}>15 minutes (Standard CESI)</option>
                                <option value={20}>20 minutes (Recommandé)</option>
                                <option value={30}>30 minutes (Grand examen)</option>
                                <option value={0}>Illimité (Sans chrono)</option>
                            </select>
                        </div>

                        {/* Auto Show Explanations */}
                        <div className="p-5 rounded-2xl bg-surface-highlight/30 border border-border/60 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-text-primary block">Explication automatique</span>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    Déplie automatiquement la correction détaillée dès qu&apos;une question est soumise.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                                <input
                                    type="checkbox"
                                    checked={autoShowExplanation}
                                    onChange={(e) => setAutoShowExplanation(e.target.checked)}
                                    className="sr-only peer"
                                    aria-label="Activer l'explication automatique"
                                />
                                <div className="w-11 h-6 bg-surface-highlight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* 2. Privacy, Anonymity & Data Export */}
                <div className="glass rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-syne text-text-primary">Confidentialité & Données Personnelles (RGPD)</h2>
                            <p className="text-xs text-text-secondary">Contrôlez vos données et téléchargez votre historique d&apos;apprentissage.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-highlight/20 border border-border/40">
                            <div>
                                <span className="text-sm font-semibold text-text-primary block">Publication anonyme par défaut</span>
                                <span className="text-xs text-text-secondary">Masque automatiquement votre nom lors de l&apos;upload d&apos;un sujet CCTL.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={anonymousUploads}
                                onChange={(e) => setAnonymousUploads(e.target.checked)}
                                className="w-4 h-4 accent-accent-yellow rounded cursor-pointer"
                                aria-label="Activer la publication anonyme par défaut"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-border/40">
                            <div className="space-y-0.5">
                                <span className="text-sm font-bold text-text-primary block">Exporter mes données au format JSON</span>
                                <span className="text-xs text-text-secondary">Téléchargez une copie de vos statistiques et paramètres locaux.</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportData}
                                className="border-border/70"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Exporter (JSON)
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
