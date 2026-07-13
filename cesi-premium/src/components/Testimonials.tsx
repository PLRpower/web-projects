'use client';

import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "Thomas D.",
        role: "A3 Informatique - Lyon",
        content: "CESI Premium m'a littéralement sauvé pour mon CCTL de Java. J'ai pu m'entraîner sur les sujets de l'année dernière et j'ai eu 18/20 !",
        rating: 5
    },
    {
        name: "Sarah L.",
        role: "A4 Généraliste - Paris",
        content: "L'outil de génération de résumé est incroyable. Je gagne un temps fou sur mes fiches de révision. L'interface est super fluide.",
        rating: 5
    },
    {
        name: "Lucas M.",
        role: "A2 BTP - Bordeaux",
        content: "Enfin une plateforme centrale pour retrouver les annales. Fini les recherches interminables sur Discord ou les Drive chelous.",
        rating: 4
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 relative">
            {/* Background decoration */}
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-yellow/10 mix-blend-multiply dark:mix-blend-screen dark:bg-accent-yellow/10 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Ils ont validé <span className="text-accent-yellow">grâce à nous</span></h2>
                    <p className="text-text-secondary">Rejoignez la communauté des étudiants qui excellent.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glass p-8 rounded-2xl border border-border hover:border-accent-yellow/30 transition-colors">
                            <div className="flex gap-1 mb-4 text-accent-yellow">
                                {[...Array(5)].map((_, starIndex) => (
                                    <Star
                                        key={starIndex}
                                        size={16}
                                        fill={starIndex < t.rating ? "currentColor" : "none"}
                                        className={starIndex < t.rating ? "" : "opacity-30"}
                                    />
                                ))}
                            </div>
                            <p className="text-text-secondary mb-6 italic leading-relaxed">"{t.content}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface-highlight flex items-center justify-center font-bold text-accent-yellow border border-border">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-text-primary">{t.name}</div>
                                    <div className="text-xs text-text-secondary">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
