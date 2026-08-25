'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    MapPin,
    Cpu,
    Target,
    ArrowRight,
    ArrowLeft,
    Check,
    Sparkles,
    ShieldCheck,
    User,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { Logo } from '@/components/Logo';

const PROMOS = [
    { id: 'A1', label: 'Promo A1', desc: 'Prépa Intégrée 1 (Bac+1)', badge: 'Bac+1' },
    { id: 'A2', label: 'Promo A2', desc: 'Prépa Intégrée 2 (Bac+2)', badge: 'Bac+2' },
    { id: 'A3', label: 'Promo A3', desc: 'Cycle Ingénieur 1ère Année (Bac+3)', badge: 'Bac+3' },
    { id: 'A4', label: 'Promo A4', desc: 'Cycle Ingénieur 2ème Année (Bac+4)', badge: 'Bac+4' },
    { id: 'A5', label: 'Promo A5', desc: 'Cycle Ingénieur 3ème Année (Bac+5)', badge: 'Bac+5' },
];

const SPECIALTIES = [
    {
        id: 'Informatique & Numérique (FISE)',
        label: '💻 Informatique & Numérique (FISE)',
        subtitle: 'Formation sous statut étudiant • Web, DevOps, Cloud, Data, Cybersécurité'
    },
    {
        id: 'Informatique & Numérique (FISA)',
        label: '⚡ Informatique & Numérique (FISA)',
        subtitle: 'Formation en Apprentissage • Entreprise & Projets industriels'
    },
    {
        id: 'BTP & Génie Civil',
        label: '🏗️ BTP & Génie Civil',
        subtitle: 'BIM, Éco-construction, Conduite de travaux, Infrastructures durables'
    },
    {
        id: 'Systèmes Embarqués & Robotique',
        label: '🤖 Systèmes Embarqués & Robotique',
        subtitle: 'IoT, Microcontrôleurs, Traitement du signal, Automatique'
    },
    {
        id: 'Généraliste & Industrie du Futur',
        label: '⚙️ Généraliste & Industrie du Futur',
        subtitle: 'Management industriel, Supply Chain, Lean 4.0, Mécanique'
    },
];

const CAMPUSES = [
    'Rouen', 'Paris-Nanterre', 'Lyon', 'Bordeaux', 'Toulouse', 'Lille',
    'Strasbourg', 'Nantes', 'Montpellier', 'Nice', 'Aix-en-Provence',
    'Brest', 'Nancy', 'Reims', 'Châteauroux', 'Orléans', 'Pau',
    'Angoulême', 'Saint-Nazaire', 'Caen', 'Dijon', 'Le Mans', 'Arras', 'Grenoble'
];

const OBJECTIVES = [
    { id: 'cctl', label: '🎯 Valider mes CCTL & blocs avec Grade A', desc: 'Accès aux corrigés types et simulateurs chronométrés' },
    { id: 'livrables', label: '📑 Réussir mes livrables & soutenances', desc: 'Templates de DAT, CDC, et grilles de soutenance jury' },
    { id: 'prosits', label: '🚀 Structurer mes fiches Prosits PBL', desc: 'Assistant en 7 étapes et synthèses de cours collaboratives' },
    { id: 'entraide', label: '🤝 Échanger & réviser avec ma promo', desc: 'Communauté d\'entraide inter-campus et partage d\'annales' },
];

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Profile state
    const [name, setName] = useState('Élève-Ingénieur CESI');
    const [email, setEmail] = useState('');
    const [promo, setPromo] = useState('A3');
    const [specialty, setSpecialty] = useState('Informatique & Numérique (FISE)');
    const [campus, setCampus] = useState('Rouen');
    const [objective, setObjective] = useState('cctl');
    const [campusSearch, setCampusSearch] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (user.email) setEmail(user.email);
                const metadataName = user.user_metadata?.name ||
                    (user.user_metadata?.firstname && user.user_metadata?.lastname
                        ? `${user.user_metadata.firstname} ${user.user_metadata.lastname}`
                        : user.email?.split('@')[0] || 'Élève-Ingénieur');
                setName(metadataName);
            }
        };
        fetchUserData();
    }, [supabase]);

    const filteredCampuses = CAMPUSES.filter(c =>
        c.toLowerCase().includes(campusSearch.toLowerCase())
    );

    const handleCompleteOnboarding = async () => {
        setIsSubmitting(true);
        try {
            const profileData = {
                name,
                email,
                campus,
                promo,
                specialty,
                objective,
                subscriptionTier: 'Ultime'
            };

            // 1. Save to local storage for immediate persistence
            localStorage.setItem('kompas_user_profile', JSON.stringify(profileData));

            // 2. Sync to Supabase user metadata if session active
            try {
                await supabase.auth.updateUser({
                    data: {
                        name,
                        campus,
                        promo,
                        specialty,
                        objective,
                        onboarded: true
                    }
                });
            } catch (e) {
                console.warn('Supabase metadata update skipped:', e);
            }

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1200);
        } catch (e) {
            console.error('Error saving profile:', e);
            router.push('/dashboard');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between p-4 sm:p-8">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-millimeter opacity-30 pointer-events-none" />

            {/* Top Navigation */}
            <header className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10 py-2">
                <Link href="/" className="group block">
                    <Logo size={32} showText={true} priority={true} />
                </Link>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-text-secondary bg-surface px-3 py-1 rounded-full border border-border">
                        Étape {currentStep} sur 4
                    </span>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6 relative z-10">
                {/* Left: Questionnaire steps */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Step Indicators */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((step) => (
                            <button
                                key={step}
                                onClick={() => setCurrentStep(step)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    currentStep === step
                                        ? 'w-10 bg-accent-yellow'
                                        : currentStep > step
                                        ? 'w-6 bg-accent-yellow/50'
                                        : 'w-4 bg-border'
                                }`}
                                aria-label={`Aller à l'étape ${step}`}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* STEP 1: PROMO */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-yellow/10 text-accent-yellow flex items-center justify-center border border-accent-yellow/20">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary">
                                        Quelle est votre <span className="italic">Promotion</span> ?
                                    </h1>
                                    <p className="text-xs sm:text-sm text-text-secondary">
                                        Sélectionnez votre année pour que vos CCTL, livrables et coefficients soient automatiquement calibrés.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {PROMOS.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPromo(p.id)}
                                            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                                                promo === p.id
                                                    ? 'bg-accent-yellow/10 border-accent-yellow shadow-md shadow-accent-yellow/10'
                                                    : 'bg-surface border-border hover:border-accent-yellow/40 hover:bg-surface-highlight'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono font-bold text-base text-text-primary">{p.label}</span>
                                                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                                                    promo === p.id ? 'bg-accent-yellow text-black' : 'bg-surface-highlight text-text-secondary border border-border'
                                                }`}>
                                                    {p.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-secondary">{p.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        variant="premium"
                                        onClick={() => setCurrentStep(2)}
                                        className="font-bold text-xs px-6 py-2.5 flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>Suivant : Filière</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: SPECIALTY */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-yellow/10 text-accent-yellow flex items-center justify-center border border-accent-yellow/20">
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary">
                                        Votre <span className="italic">Filière & Spécialité</span>
                                    </h1>
                                    <p className="text-xs sm:text-sm text-text-secondary">
                                        Adapte votre catalogue d&apos;examens CCTL et vos fiches de prosits selon vos modules de cours.
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    {SPECIALTIES.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setSpecialty(s.id)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                                                specialty === s.id
                                                    ? 'bg-accent-yellow/10 border-accent-yellow shadow-md shadow-accent-yellow/10'
                                                    : 'bg-surface border-border hover:border-accent-yellow/40 hover:bg-surface-highlight'
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                <p className="font-bold text-xs sm:text-sm text-text-primary">{s.label}</p>
                                                <p className="text-[11px] text-text-secondary">{s.subtitle}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                specialty === s.id ? 'bg-accent-yellow border-accent-yellow text-black' : 'border-border'
                                            }`}>
                                                {specialty === s.id && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        className="text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Retour</span>
                                    </Button>
                                    <Button
                                        variant="premium"
                                        onClick={() => setCurrentStep(3)}
                                        className="font-bold text-xs px-6 flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>Suivant : Campus</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: CAMPUS */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-yellow/10 text-accent-yellow flex items-center justify-center border border-accent-yellow/20">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary">
                                        Sur quel <span className="italic">Campus CESI</span> étudiez-vous ?
                                    </h1>
                                    <p className="text-xs sm:text-sm text-text-secondary">
                                        Connectez-vous avec les élèves de votre campus et rejoignez les discussions de promotion.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Rechercher votre campus (ex: Rouen, Paris, Lyon...)"
                                        value={campusSearch}
                                        onChange={(e) => setCampusSearch(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-muted"
                                    />

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                                        {filteredCampuses.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setCampus(c)}
                                                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center cursor-pointer ${
                                                    campus === c
                                                        ? 'bg-accent-yellow text-black font-bold border-accent-yellow shadow-xs'
                                                        : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-accent-yellow/40'
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(2)}
                                        className="text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Retour</span>
                                    </Button>
                                    <Button
                                        variant="premium"
                                        onClick={() => setCurrentStep(4)}
                                        className="font-bold text-xs px-6 flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>Suivant : Objectifs</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: AMBITION & FINISH */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step-4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-border shadow-2xl space-y-6"
                            >
                                <div className="space-y-2">
                                    <div className="w-10 h-10 rounded-2xl bg-accent-yellow/10 text-accent-yellow flex items-center justify-center border border-accent-yellow/20">
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary">
                                        Votre <span className="italic">Priorité</span> sur Kompas
                                    </h1>
                                    <p className="text-xs sm:text-sm text-text-secondary">
                                        Personnalisez vos raccourcis sur le tableau de bord pour booster votre productivité.
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    {OBJECTIVES.map((obj) => (
                                        <button
                                            key={obj.id}
                                            type="button"
                                            onClick={() => setObjective(obj.id)}
                                            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                                objective === obj.id
                                                    ? 'bg-accent-yellow/10 border-accent-yellow shadow-md shadow-accent-yellow/10'
                                                    : 'bg-surface border-border hover:border-accent-yellow/40 hover:bg-surface-highlight'
                                            }`}
                                        >
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-xs sm:text-sm text-text-primary">{obj.label}</p>
                                                <p className="text-[11px] text-text-secondary">{obj.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                objective === obj.id ? 'bg-accent-yellow border-accent-yellow text-black' : 'border-border'
                                            }`}>
                                                {objective === obj.id && <Check className="w-3 h-3 stroke-[3]" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep(3)}
                                        className="text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Retour</span>
                                    </Button>
                                    <Button
                                        variant="premium"
                                        onClick={handleCompleteOnboarding}
                                        disabled={isSubmitting || isSuccess}
                                        className="font-bold text-xs px-6 py-2.5 flex items-center gap-2 cursor-pointer"
                                    >
                                        {isSuccess ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Profil Prêt ! Redirection...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                <span>Accéder à mon Dashboard</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Live Interactive CESI Student Card Preview */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="text-center sm:text-left space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-yellow">
                            Aperçu de votre pass étudiant
                        </span>
                        <h3 className="text-lg font-serif font-normal text-text-primary">
                            Carte Kompas | CESI
                        </h3>
                    </div>

                    {/* The Student Pass */}
                    <div className="card-editorial rounded-3xl bg-gradient-to-br from-surface-card via-surface to-surface-card border border-border shadow-2xl p-6 relative overflow-hidden space-y-6">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-yellow/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

                        {/* Top Pass Header */}
                        <div className="flex justify-between items-start relative z-10 border-b border-border/60 pb-4">
                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">ÉLÈVE-INGÉNIEUR</p>
                                <h4 className="text-base font-bold text-text-primary font-syne">{name}</h4>
                                <p className="text-xs text-text-muted font-mono">{email || 'etudiant@viacesi.fr'}</p>
                            </div>
                            <div className="px-2.5 py-1 rounded-full bg-accent-yellow text-black font-mono font-bold text-xs shadow-xs">
                                {promo}
                            </div>
                        </div>

                        {/* Middle Details */}
                        <div className="grid grid-cols-2 gap-3 relative z-10 text-xs">
                            <div className="p-2.5 rounded-xl bg-surface/60 border border-border/50">
                                <span className="text-[10px] text-text-secondary font-mono block">CAMPUS CESI</span>
                                <span className="font-bold text-text-primary">{campus}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface/60 border border-border/50">
                                <span className="text-[10px] text-text-secondary font-mono block">STATUT DU COMPTE</span>
                                <span className="font-bold text-emerald-500 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Actif
                                </span>
                            </div>
                        </div>

                        {/* Specialty full badge */}
                        <div className="p-3 rounded-xl bg-surface-highlight/40 border border-border/60 relative z-10">
                            <span className="text-[10px] text-text-secondary font-mono block">SPÉCIALITÉ &amp; FILIÈRE</span>
                            <span className="font-bold text-xs text-text-primary leading-snug block mt-0.5">
                                {specialty}
                            </span>
                        </div>

                        {/* Bottom Security Footer */}
                        <div className="flex items-center justify-between text-[10px] text-text-muted font-mono pt-2 border-t border-border/40 relative z-10">
                            <span>KOMPAS // CESI SECURE ID</span>
                            <span className="text-accent-yellow font-bold">GRADE A PROMO</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="max-w-6xl w-full mx-auto text-center text-xs text-text-muted py-2 relative z-10">
                CESI École d&apos;Ingénieurs • Plateforme d&apos;excellence académique Kompas
            </footer>
        </div>
    );
}
