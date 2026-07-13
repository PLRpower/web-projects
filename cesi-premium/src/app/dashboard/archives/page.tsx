'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select'; // Assuming I can adapt or just use native select or styled div
// Actually let's use standard inputs for filters

const mockCCTLs = [
    { id: 1, title: 'Développement Web - React', year: '2025', domain: 'Informatique', promo: 'A3', downloads: 120 },
    { id: 2, title: 'Analyse de Données - SQL', year: '2024', domain: 'Data', promo: 'A3', downloads: 85 },
    { id: 3, title: 'Management de Projet', year: '2025', domain: 'Généraliste', promo: 'A4', downloads: 200 },
    { id: 4, title: 'Architecture Réseau', year: '2023', domain: 'Réseau', promo: 'A3', downloads: 54 },
    { id: 5, title: 'Mathématiques Appliquées', year: '2024', domain: 'Science', promo: 'A2', downloads: 90 },
    { id: 6, title: 'Droit du Travail', year: '2025', domain: 'Juridique', promo: 'A4', downloads: 110 },
];

export default function ArchivesPage() {
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState("Tous");

    const filteredCCTLs = mockCCTLs.filter(cctl => {
        const matchesSearch = cctl.title.toLowerCase().includes(search.toLowerCase());
        const matchesYear = selectedYear === "Tous" || cctl.year === selectedYear;
        return matchesSearch && matchesYear;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-syne">Archives CCTL</h1>
                    <p className="text-text-secondary">Explorez la base de données de sujets.</p>
                </div>
                {/* Actions */}
                <Button variant="outline" className="border-border/50 hover:bg-surface-highlight text-text-secondary hover:text-text-primary">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres avancés
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un sujet, un module..."
                        className="w-full bg-surface-highlight/50 border border-border/50 rounded-lg pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 transition-all placeholder:text-text-secondary/50"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="bg-surface-highlight/50 border border-border/50 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[150px]"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="Tous">Toutes les années</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
                <select className="bg-surface-highlight/50 border border-border/50 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-yellow/50 cursor-pointer min-w-[150px]">
                    <option value="Tous">Tous les domaines</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Généraliste">Généraliste</option>
                    <option value="BTP">BTP</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCCTLs.map((cctl) => (
                    <div key={cctl.id} className="glass group rounded-2xl border border-border hover:border-accent-yellow/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-full bg-surface-highlight text-xs font-bold text-accent-yellow border border-border/50">
                                    {cctl.promo}
                                </span>
                                <span className="text-text-secondary text-xs font-medium bg-surface-highlight/50 px-2 py-1 rounded">
                                    {cctl.year}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 group-hover:text-accent-yellow transition-colors">{cctl.title}</h3>
                            <p className="text-text-secondary text-sm">{cctl.domain}</p>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-surface-highlight/30 border-t border-border/50 flex gap-2">
                            <Button className="flex-1 bg-surface hover:bg-surface-highlight text-text-primary border border-border">
                                <Eye className="w-4 h-4 mr-2" />
                                Aperçu
                            </Button>
                            <Button className="flex-1 bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow hover:text-black border border-accent-yellow/20 transition-all duration-300 group/btn">
                                <Download className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                                {cctl.downloads}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCCTLs.length === 0 && (
                <div className="text-center py-20 text-text-secondary">
                    Aucun résultat trouvé pour votre recherche.
                </div>
            )}
        </div>
    );
}
