'use client';

import { motion } from 'framer-motion';

const stats = [
    { value: "2,500+", label: "CCTL Archivés" },
    { value: "48h", label: "Temps moyen économisé / mois" },
    { value: "98%", label: "Taux de réussite" },
    { value: "26", label: "Campus couverts" },
];

export default function Stats() {
    return (
        <section className="py-20 border-y border-border bg-surface-highlight/10 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary/60 mb-2 font-syne">
                                {stat.value}
                            </div>
                            <div className="text-text-secondary text-sm md:text-base font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
