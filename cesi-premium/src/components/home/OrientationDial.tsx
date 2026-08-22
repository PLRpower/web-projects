'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    BookOpen,
    Layers,
    FileText
} from 'lucide-react';
import Link from 'next/link';

type PromoYear = 'A1' | 'A2' | 'A3' | 'A4' | 'A5';
type SpecialtyKey = 'info' | 'btp' | 'embarque' | 'generaliste';

interface PromoOption {
    id: PromoYear;
    label: string;
    sublabel: string;
}

interface SpecialtyOption {
    id: SpecialtyKey;
    label: string;
    icon: string;
}

interface TrackData {
    title: string;
    cycle: string;
    annalesCount: string;
    prositsCount: string;
    livrablesCount: string;
    description: string;
    topProsits: string[];
    topCCTLExams: string[];
    typicalLivrable: string;
}

const PROMO_OPTIONS: PromoOption[] = [
    { id: 'A1', label: 'A1', sublabel: 'Prépa 1' },
    { id: 'A2', label: 'A2', sublabel: 'Prépa 2' },
    { id: 'A3', label: 'A3', sublabel: 'Bac+3' },
    { id: 'A4', label: 'A4', sublabel: 'Bac+4' },
    { id: 'A5', label: 'A5', sublabel: 'Bac+5' }
];

const SPECIALTY_OPTIONS: SpecialtyOption[] = [
    { id: 'info', label: 'Informatique', icon: '💻' },
    { id: 'btp', label: 'BTP', icon: '🏗️' },
    { id: 'embarque', label: 'Systèmes Embarqués', icon: '🤖' },
    { id: 'generaliste', label: 'Généraliste', icon: '⚙️' }
];

const A1_TRONC_COMMUN_DATA: TrackData = {
    title: "A1 • Cycle Préparatoire Intégré",
    cycle: "Cycle Préparatoire Intégré (1ère année)",
    annalesCount: "380+ CCTL",
    prositsCount: "210+ Prosits",
    livrablesCount: "40+ Livrables",
    description: "Socle scientifique et méthodologique commun : mathématiques fondamentales, algorithmique en C/Python, électrocinétique et mécanique générale.",
    topProsits: [
        "Prosit A1 • Circuit RLC & Régime transitoire",
        "Prosit A1 • Algorithme de tri en langage C",
        "Prosit A1 • Équilibre statique & Torseurs",
        "Prosit A1 • Optimisation cycle thermique"
    ],
    topCCTLExams: ["CCTL A1 • Calcul Différentiel & Intégrales", "CCTL A1 • Initiation Algorithmique & C", "CCTL A1 • Théorèmes de Thévenin & Norton"],
    typicalLivrable: "Dossier Pluridisciplinaire & Mini-Projet Informatique"
};

const CURRICULUM_DATA: Record<SpecialtyKey, Record<Exclude<PromoYear, 'A1'>, TrackData>> = {
    info: {
        A2: {
            title: "A2 • Cycle Préparatoire Intégré",
            cycle: "Cycle Préparatoire Intégré (2ème Année)",
            annalesCount: "310+ CCTL",
            prositsCount: "160+ Prosits",
            livrablesCount: "35+ Livrables",
            description: "Structure de données complexes, POO en Java/C++, bases de données relationnelles SQL et algorithmes de graphes.",
            topProsits: [
                "Prosit A2 • Système de gestion POO en Java",
                "Prosit A2 • Modélisation base SQL relationnelle",
                "Prosit A2 • Plus court chemin & Dijkstra",
                "Prosit A2 • Arbre binaire de recherche (BST)"
            ],
            topCCTLExams: ["CCTL A2 • Structures de Données & POO", "CCTL A2 • Requêtage SQL & Transactions", "CCTL A2 • Arbres Binaires & Graphes"],
            typicalLivrable: "Application Logicielle MVC avec base SQLite"
        },
        A3: {
            title: "A3 • Cycle Ingénieur",
            cycle: "Cycle Ingénieur (Bac+3)",
            annalesCount: "480+ CCTL",
            prositsCount: "220+ Prosits",
            livrablesCount: "65+ Livrables",
            description: "Développement fullstack moderne, architectures logicielles découplées, frameworks (React, Spring Boot, .NET) et APIs REST.",
            topProsits: [
                "Prosit A3 • Architecture Microservices Kafka",
                "Prosit A3 • Application Web React 19 & Next.js",
                "Prosit A3 • Sécurisation API REST OAuth2/JWT",
                "Prosit A3 • Cache distribué & Redis"
            ],
            topCCTLExams: ["CCTL A3 • Architecture Web & TypeScript", "CCTL A3 • Design Patterns & UML", "CCTL A3 • API REST & Spring Boot"],
            typicalLivrable: "Dossier de Projet Logiciel & Pipeline CI/CD"
        },
        A4: {
            title: "A4 • Cycle Ingénieur",
            cycle: "Cycle Ingénieur (Bac+4)",
            annalesCount: "540+ CCTL",
            prositsCount: "240+ Prosits",
            livrablesCount: "75+ Livrables",
            description: "Infrastructures Cloud AWS/Azure, conteneurisation Kubernetes, sécurité applicative, ingestion Big Data et intégration IA.",
            topProsits: [
                "Prosit A4 • Cluster Kubernetes sur AWS EKS",
                "Prosit A4 • Pipeline CI/CD avec GitLab CI",
                "Prosit A4 • Modèle Deep Learning & Anomalies",
                "Prosit A4 • Pipeline Big Data Apache Spark"
            ],
            topCCTLExams: ["CCTL A4 • Ingénierie des Données & IA", "CCTL A4 • Cloud Computing & Docker", "CCTL A4 • Cybersécurité & Authentification"],
            typicalLivrable: "Architecture Cloud Haute Disponibilité & Déploiement K8s"
        },
        A5: {
            title: "A5 • Cycle Ingénieur",
            cycle: "Diplôme d'Ingénieur (Bac+5)",
            annalesCount: "380+ CCTL",
            prositsCount: "150+ Prosits",
            livrablesCount: "50+ Livrables",
            description: "Gouvernance des systèmes d'information, cybersécurité avancée (pentesting, ISO 27001), urbanisation du SI et audit.",
            topProsits: [
                "Prosit A5 • Pentesting applicatif OWASP",
                "Prosit A5 • Architecture RAG & LLM Entreprise",
                "Prosit A5 • Gouvernance SI & Norme ISO 27001",
                "Prosit A5 • Plan de Reprise d'Activité (PRA)"
            ],
            topCCTLExams: ["CCTL A5 • Sécurité des SI & Cryptographie", "CCTL A5 • Urbanisation SI & SOA", "CCTL A5 • IA Générative & RAG"],
            typicalLivrable: "Thèse Professionnelle & Mémoire d'Ingénieur"
        }
    },
    btp: {
        A2: {
            title: "A2 • Cycle Ingénieur",
            cycle: "Cycle Préparatoire Intégré (2ème Année)",
            annalesCount: "200+ CCTL",
            prositsCount: "110+ Prosits",
            livrablesCount: "30+ Livrables",
            description: "Hydrostatique, dynamique des fluides incompressibles, mécanique des sols d'initiation et contraintes de structure.",
            topProsits: [
                "Prosit A2 • Réseau d'adduction d'eau",
                "Prosit A2 • Cisaillement & Sols géotechniques",
                "Prosit A2 • Poutre en flexion simple",
                "Prosit A2 • Relevé topographique & Plan"
            ],
            topCCTLExams: ["CCTL A2 • Hydrostatique & Écoulements", "CCTL A2 • Caractérisation des Sols", "CCTL A2 • Torsion & Flexion Simple"],
            typicalLivrable: "Rapport de Reconnaissance des Sols & Dimensionnement Hydraulique"
        },
        A3: {
            title: "A3 • Cycle Ingénieur",
            cycle: "Cycle Ingénieur (Bac+3)",
            annalesCount: "320+ CCTL",
            prositsCount: "190+ Prosits",
            livrablesCount: "45+ Livrables",
            description: "Calcul de résistance des matériaux (RDM), dimensionnement des structures en béton armé (Eurocodes 2) et maquette numérique BIM.",
            topProsits: [
                "Prosit A3 • Dalle en béton armé (Eurocodes 2)",
                "Prosit A3 • Maquette collaborative BIM Revit",
                "Prosit A3 • Descente de charges & Semelles",
                "Prosit A3 • Résistance des matériaux & Flexion"
            ],
            topCCTLExams: ["CCTL A3 • Calcul des Structures & RDM", "CCTL A3 • Béton Armé & Fondations", "CCTL A3 • Modélisation Revit & BIM"],
            typicalLivrable: "Note de Calcul d'Ouvrage & Maquette BIM"
        },
        A4: {
            title: "A4 • Cycle Ingénieur",
            cycle: "Cycle Ingénieur (Bac+4)",
            annalesCount: "370+ CCTL",
            prositsCount: "210+ Prosits",
            livrablesCount: "55+ Livrables",
            description: "Construction métallique (Eurocodes 3), dynamique des structures, fondations profondes, soutènements et thermique du bâtiment RE2020.",
            topProsits: [
                "Prosit A4 • Portique charpente métallique (EC3)",
                "Prosit A4 • Fondations profondes sur pieux",
                "Prosit A4 • Analyse parasismique (Eurocodes 8)",
                "Prosit A4 • Bilan thermique RE2020 bâtiment"
            ],
            topCCTLExams: ["CCTL A4 • Dimensionnement Béton & Fondations", "CCTL A4 • Charpente Métallique & Bois", "CCTL A4 • Calcul Parasismique EC8"],
            typicalLivrable: "Dossier de Dimensionnement Parasismique de Bâtiment"
        },
        A5: {
            title: "A5 • Cycle Ingénieur",
            cycle: "Cycle Ingénieur (Bac+5)",
            annalesCount: "280+ CCTL",
            prositsCount: "140+ Prosits",
            livrablesCount: "40+ Livrables",
            description: "Conduite de chantiers d'envergure, droit des marchés publics/privés, économie de la construction et transition environnementale.",
            topProsits: [
                "Prosit A5 • Planification 4D grand chantier",
                "Prosit A5 • Dossier DCE & Marchés travaux",
                "Prosit A5 • Réhabilitation énergétique tertiaire",
                "Prosit A5 • Management de la sécurité QSE"
            ],
            topCCTLExams: ["CCTL A5 • Gestion & Droit des Marchés", "CCTL A5 • Conduite de Travaux & Sécurité", "CCTL A5 • Réhabilitation & Rénovation Énergétique"],
            typicalLivrable: "Dossier d'Appel d'Offres & Planification Gros-Œuvre"
        }
    },
    embarque: {
        A2: {
            title: "A2 • Cycle Ingénieur",
            cycle: "Cycle Préparatoire Intégré (2ème Année)",
            annalesCount: "220+ CCTL",
            prositsCount: "120+ Prosits",
            livrablesCount: "25+ Livrables",
            description: "Portes logiques, logique séquentielle, transformée de Fourier, filtrage analogique/numérique et programmation assembleur/C.",
            topProsits: [
                "Prosit A2 • Machine d'états synchrone",
                "Prosit A2 • Filtre numérique Butterworth audio",
                "Prosit A2 • Programmation timer AVR",
                "Prosit A2 • Conditionnement capteur piézo"
            ],
            topCCTLExams: ["CCTL A2 • Bascules & Compteurs Logiques", "CCTL A2 • Filtres Actifs & Passifs", "CCTL A2 • Programmation Bas Niveau AVR"],
            typicalLivrable: "Système d'Acquisition de Données & Filtrage Numérique"
        },
        A3: {
            title: "A3 • Cycle Ingénieur",
            cycle: "Cycle Ingénieur (Bac+3)",
            annalesCount: "290+ CCTL",
            prositsCount: "150+ Prosits",
            livrablesCount: "40+ Livrables",
            description: "Programmation C bas niveau (MISRA C), microcontrôleurs ARM Cortex-M (STM32), bus de communication industriels et électronique de puissance.",
            topProsits: [
                "Prosit A3 • Drivers STM32 en C (HAL/LL)",
                "Prosit A3 • Communication bus CAN 2.0B",
                "Prosit A3 • Hacheur Buck & Découpage",
                "Prosit A3 • Interruptions NVIC Cortex-M"
            ],
            topCCTLExams: ["CCTL A3 • Architecture Microcontrôleurs STM32", "CCTL A3 • Bus CAN & Protocoles Série", "CCTL A3 • Électronique Analogique & Capteurs"],
            typicalLivrable: "Rapport de Prototypage Électronique & Carte STM32"
        },
        A4: {
            title: "A4 • Systèmes Temps Réel (RTOS) & FPGA",
            cycle: "Cycle Ingénieur Systèmes Embarqués (Bac+4)",
            annalesCount: "340+ CCTL",
            prositsCount: "180+ Prosits",
            livrablesCount: "50+ Livrables",
            description: "Systèmes d'exploitation temps réel FreeRTOS, synthèse matérielle VHDL sur FPGA Xilinx, Linux embarqué (Yocto) et conception de circuits imprimés.",
            topProsits: [
                "Prosit A4 • Ordonnancement RTOS (FreeRTOS)",
                "Prosit A4 • Contrôleur SPI VHDL sur FPGA",
                "Prosit A4 • Linux embarqué Yocto Project",
                "Prosit A4 • Routage PCB multi-couches"
            ],
            topCCTLExams: ["CCTL A4 • Systèmes Temps Réel & Sémaphores", "CCTL A4 • Synthèse VHDL & Machines d'États", "CCTL A4 • Linux Embarqué & Drivers"],
            typicalLivrable: "Noyau Temps Réel Multi-tâches & Carte PCB Routée"
        },
        A5: {
            title: "A5 • Protocoles IoT & Cybersécurité Matérielle",
            cycle: "Diplôme d'Ingénieur Systèmes Embarqués (Bac+5)",
            annalesCount: "240+ CCTL",
            prositsCount: "120+ Prosits",
            livrablesCount: "35+ Livrables",
            description: "Réseaux sans fil basse consommation (LoRaWAN, BLE, Zigbee), sécurisation des firmwares (Secure Boot, TPM) et Edge AI (TinyML).",
            topProsits: [
                "Prosit A5 • Réseau de capteurs LoRaWAN",
                "Prosit A5 • Secure Boot & Chiffrement AES",
                "Prosit A5 • Inférence TinyML sur MCU",
                "Prosit A5 • Sûreté AMDEC / ISO 26262"
            ],
            topCCTLExams: ["CCTL A5 • Protocoles Réseaux Sans Fil IoT", "CCTL A5 • Sécurité des Firmwares & Chiffrement", "CCTL A5 • Architecture Edge Computing"],
            typicalLivrable: "Dispositif Connecté IoT Industriel avec Firmware Sécurisé"
        }
    },
    generaliste: {
        A2: {
            title: "A2 • Électromagnétisme & Modélisation Physique",
            cycle: "Cycle Préparatoire Intégré (2ème Année)",
            annalesCount: "330+ CCTL",
            prositsCount: "170+ Prosits",
            livrablesCount: "35+ Livrables",
            description: "Électromagnétisme (équations de Maxwell), ondes électromagnétiques, mécanique des solides, chimie des solutions et algorithmique numérique.",
            topProsits: [
                "Prosit A2 • Onde électromagnétique en guide",
                "Prosit A2 • Équilibrage dynamique de rotor",
                "Prosit A2 • Modélisation cycle frigorifique",
                "Prosit A2 • Résolution EDO numérique Python"
            ],
            topCCTLExams: ["CCTL A2 • Électromagnétisme & Ondes", "CCTL A2 • Cinématique & Dynamique des Solides", "CCTL A2 • Résolution Numérique Python"],
            typicalLivrable: "Modélisation Numérique d'un Phénomène Physique Multiphysique"
        },
        A3: {
            title: "A3 • Sciences des Matériaux & Automatique",
            cycle: "Cycle Ingénieur Généraliste (Bac+3)",
            annalesCount: "420+ CCTL",
            prositsCount: "210+ Prosits",
            livrablesCount: "55+ Livrables",
            description: "Comportement des matériaux, diagrammes d'équilibre, automatique continue linéaire (Laplace, Bode), mécanique des milieux continus et gestion industrielle.",
            topProsits: [
                "Prosit A3 • Diagrammes phase & Aciers",
                "Prosit A3 • Asservissement moteur CC (Bode)",
                "Prosit A3 • Optimisation des flux & MRP2",
                "Prosit A3 • Tenseur contraintes & Von Mises"
            ],
            topCCTLExams: ["CCTL A3 • Sciences des Matériaux & Thermo", "CCTL A3 • Automatique & Transformée de Laplace", "CCTL A3 • Gestion de Production & ERP"],
            typicalLivrable: "Rapport de Dimensionnement Mécanique & Régulation Système"
        },
        A4: {
            title: "A4 • Régulation Système & Lean Six Sigma",
            cycle: "Cycle Ingénieur Généraliste (Bac+4)",
            annalesCount: "480+ CCTL",
            prositsCount: "230+ Prosits",
            livrablesCount: "65+ Livrables",
            description: "Régulation numérique PID, modélisation multiphysique sous Simulink, démarche Lean Six Sigma (DMAIC) et management de la qualité.",
            topProsits: [
                "Prosit A4 • Régulateur numérique PID",
                "Prosit A4 • Amélioration Lean (DMAIC)",
                "Prosit A4 • Simulation multiphysique",
                "Prosit A4 • Réseau hydraulique de pompage"
            ],
            topCCTLExams: ["CCTL A4 • Analyse Système & Régulation PID", "CCTL A4 • Lean Management & 5S/Kaizen", "CCTL A4 • Mécanique des Fluides & Pompes"],
            typicalLivrable: "Rapport d'Audit Industriel & Plan d'Amélioration Continue"
        },
        A5: {
            title: "A5 • Performance Industrielle & Usine 4.0",
            cycle: "Diplôme d'Ingénieur Généraliste (Bac+5)",
            annalesCount: "350+ CCTL",
            prositsCount: "160+ Prosits",
            livrablesCount: "45+ Livrables",
            description: "Pilotage de la performance globale, décarbonation des procédés industriels, supply chain 4.0, transformation digitale et direction d'usines.",
            topProsits: [
                "Prosit A5 • Système MES pour Usine 4.0",
                "Prosit A5 • Cartographie des flux (VSM)",
                "Prosit A5 • Bilan carbone & Décarbonation",
                "Prosit A5 • Conduite du changement agile"
            ],
            topCCTLExams: ["CCTL A5 • Pilotage de la Performance Industrielle", "CCTL A5 • Optimisation Supply Chain & Flux", "CCTL A5 • Audit Énergétique & Décarbonation"],
            typicalLivrable: "Projet de Fin d'Études (PFE) & Schéma Directeur Industriel"
        }
    }
};

export default function OrientationDial() {
    const [selectedYear, setSelectedYear] = useState<PromoYear>('A1');
    const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyKey>('info');

    const isA1 = selectedYear === 'A1';
    const isMajeure = selectedYear === 'A3' || selectedYear === 'A4' || selectedYear === 'A5';
    const trackLabel = isMajeure ? 'Majeure' : 'Mineure';
    const cycleName = (selectedYear === 'A1' || selectedYear === 'A2') ? 'Cycle préparatoire intégré' : 'Cycle ingénieur';

    const currentTrack: TrackData = isA1 
        ? A1_TRONC_COMMUN_DATA 
        : CURRICULUM_DATA[selectedSpecialty][selectedYear];

    const currentSpecialtyMeta = SPECIALTY_OPTIONS.find(s => s.id === selectedSpecialty)!;

    return (
        <section className="py-20 sm:py-28 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border/70">
                    <div className="space-y-2 max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-text-primary tracking-tight">
                            Quel est votre <span className="italic font-normal">cursus au CESI ?</span>
                        </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
                        Accédez directement à vos annales de CCTL, fiches Prosits et livrables par niveau d&apos;études.
                    </p>
                </div>

                {/* PROMOTION SELECTORS DIRECTLY ON PAGE */}
                <div className="space-y-3.5">
                    <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3">
                        {PROMO_OPTIONS.map((promo) => {
                            const isSelected = selectedYear === promo.id;
                            return (
                                <button
                                    key={promo.id}
                                    type="button"
                                    onClick={() => setSelectedYear(promo.id)}
                                    className={`py-2.5 px-4 sm:px-5 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 text-sm font-mono ${
                                        isSelected
                                            ? 'bg-surface-card border-accent-yellow text-accent-yellow shadow-md ring-1 ring-accent-yellow/30 font-bold'
                                            : 'bg-surface/70 border-border text-text-secondary hover:text-text-primary hover:border-border/90 hover:bg-surface'
                                    }`}
                                >
                                    <span className="font-bold">{promo.label}</span>
                                    <span className="text-xs text-text-muted font-normal">({promo.sublabel})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mineure (A2) / Majeure (A3 à A5) */}
                    <AnimatePresence>
                        {!isA1 && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.16 }}
                                className="space-y-1.5 pt-1"
                            >
                                <div className="text-base sm:text-lg font-serif font-normal text-text-primary tracking-tight">
                                    Votre {trackLabel} :
                                </div>
                                <div className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3">
                                    {SPECIALTY_OPTIONS.map((specialty) => {
                                        const isSelected = selectedSpecialty === specialty.id;
                                        return (
                                            <button
                                                key={specialty.id}
                                                type="button"
                                                onClick={() => setSelectedSpecialty(specialty.id)}
                                                className={`py-2.5 px-4 sm:px-5 rounded-2xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 text-sm font-medium ${
                                                    isSelected
                                                        ? 'bg-surface-card border-accent-yellow text-accent-yellow shadow-md ring-1 ring-accent-yellow/30 font-bold'
                                                        : 'bg-surface/70 border-border text-text-secondary hover:text-text-primary hover:border-border/90 hover:bg-surface'
                                                }`}
                                            >
                                                <span className="text-base">{specialty.icon}</span>
                                                <span>{specialty.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* TRACK PRESENTATION CARD CONTAINER */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isA1 ? 'A1-tronc-commun' : `${selectedYear}-${selectedSpecialty}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-3xl p-6 sm:p-8 bg-surface-card border border-border shadow-lg"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Left Column: Track Info & Resource Numbers */}
                            <div className="lg:col-span-5 space-y-5 lg:border-r lg:border-border/60 lg:pr-8">
                                <div className="space-y-3">
                                    {/* Badge : Mineure / Majeure ou Tronc Commun */}
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-sm font-semibold text-text-primary shadow-xs">
                                            {!isA1 && <span className="text-base">{currentSpecialtyMeta.icon}</span>}
                                            <span>
                                                {isA1 ? 'Tronc Commun' : `${trackLabel} ${currentSpecialtyMeta.label}`}
                                            </span>
                                        </span>
                                    </div>

                                    {/* Titre simplifié : Année - Cycle */}
                                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-text-primary leading-tight">
                                        {selectedYear} — {cycleName}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                                        {currentTrack.description}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <Link href={`/cctl?q=${encodeURIComponent(selectedYear)}`}>
                                        <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-yellow text-black font-bold text-xs hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                                            <span>Explorer les ressources {selectedYear}</span>
                                            <ArrowRight size={13} />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Top Prosits (1st) & Top CCTLs (2nd) */}
                            <div className="lg:col-span-7 space-y-6">
                                {/* 1. Prosits Disponibles (En premier) */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-surface border border-border/80 text-accent-yellow shadow-2xs">
                                                <Layers size={14} />
                                            </div>
                                            <h4 className="text-base sm:text-lg font-serif font-normal text-text-primary tracking-tight">
                                                Prosits disponibles
                                            </h4>
                                        </div>
                                        <Link 
                                            href={`/prosits?q=${encodeURIComponent(selectedYear)}`}
                                            className="text-xs font-mono font-semibold text-accent-yellow hover:underline flex items-center gap-1"
                                        >
                                            <span>Voir tous les prosits →</span>
                                        </Link>
                                    </div>

                                    <div className="rounded-2xl bg-surface/50 border border-border/70 p-3 sm:p-4 divide-y divide-border/50">
                                        {currentTrack.topProsits.map((prosit, i) => (
                                            <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="font-mono text-[10px] text-text-muted shrink-0">
                                                        {String(i + 1).padStart(2, '0')}.
                                                    </span>
                                                    <span className="text-text-secondary truncate font-normal">
                                                        {prosit}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. CCTL les Plus Consultés (En deuxième) */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-surface border border-border/80 text-accent-yellow shadow-2xs">
                                                <FileText size={14} />
                                            </div>
                                            <h4 className="text-base sm:text-lg font-serif font-normal text-text-primary tracking-tight">
                                                CCTL les plus consultés
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {currentTrack.topCCTLExams.map((exam, i) => (
                                            <Link
                                                key={i}
                                                href={`/cctl?q=${encodeURIComponent(exam.split('•')[1]?.trim() || exam)}`}
                                                className="p-3 rounded-xl bg-transparent border border-border flex items-center justify-between text-xs group hover:border-accent-yellow/70 hover:bg-surface/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                                            >
                                                <span className="font-medium text-text-primary truncate">{exam}</span>
                                                <span className="font-mono text-xs font-bold text-accent-yellow flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2">
                                                    <span>Consulter →</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </section>
    );
}
