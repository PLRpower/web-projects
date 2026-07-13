'use client';

import { motion } from 'framer-motion';
import { FileCheck, BrainCircuit, Users, FolderOpen, FileText, Wand2 } from 'lucide-react';

const features = [
    {
        icon: <FileCheck className="w-8 h-8 text-accent-yellow" />,
        title: "CCTL corrigés",
        description: "Accédez aux CCTL des années précédentes pour réviser facilement."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-accent-orange" />,
        title: "QCM automatiques",
        description: "Faites des entraînements grâce à des QCM générés pour vous."
    },
    {
        icon: <Users className="w-8 h-8 text-blue-400" />,
        title: "Partage de fichiers",
        description: "Entraidez-vous grâce à des canaux spécialement créés pour votre promo."
    },
    {
        icon: <FolderOpen className="w-8 h-8 text-purple-400" />,
        title: "Accès aux Prosits",
        description: "Accédez aux prosits complétés pour chaque bloc."
    },
    {
        icon: <FileText className="w-8 h-8 text-emerald-400" />,
        title: "Livrables complétés",
        description: "Découvrez les livrables rendus des années précédentes."
    },
    {
        icon: <Wand2 className="w-8 h-8 text-pink-400" />,
        title: "Création de Prosit",
        description: "Créez votre Prosit automatiquement avec votre fichier."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Découvrez une panoplie de <br /><span className="text-accent-yellow">fonctionnalités pour vos études</span></h2>
                    <p className="text-text-secondary">Tout ce dont vous avez besoin pour exceller au CESI.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-2xl hover:bg-surface-highlight/10 dark:hover:bg-white/5 transition-colors group cursor-default border border-white/5"
                        >
                            <div className="bg-surface-highlight dark:bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
