import { TrendingUp, Clock, CheckCircle, BookOpen } from 'lucide-react';


function StatCard({ title, value, subtitle, icon: Icon, trend }: any) {
    return (
        <div className="glass p-6 rounded-2xl border border-border shadow-lg hover:shadow-accent-yellow/5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface-highlight rounded-xl group-hover:bg-accent-yellow/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent-yellow" />
                </div>
                {trend && (
                    <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        +{trend}%
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
                <div className="text-3xl font-bold font-syne mb-1">{value}</div>
                <p className="text-xs text-text-secondary/70">{subtitle}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold font-syne mb-2">Tableau de bord</h1>
                <p className="text-text-secondary">Bienvenue sur votre espace de réussite.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="CCTLs Validés"
                    value="12"
                    subtitle="Depuis le début de l'année"
                    icon={CheckCircle}
                    trend="8"
                />
                <StatCard
                    title="Temps de révision"
                    value="24h"
                    subtitle="Cette semaine"
                    icon={Clock}
                    trend="12"
                />
                <StatCard
                    title="Moyenne Sim."
                    value="15.5"
                    subtitle="Sur vos 5 derniers tests"
                    icon={TrendingUp}
                    trend="2"
                />
                <StatCard
                    title="Sujets Couverts"
                    value="85%"
                    subtitle="Du programme A3"
                    icon={BookOpen}
                />
            </div>

            {/* Recent Activity / Next Up */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main section: Recommended CCTLs */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold">Recommandé pour vous</h2>
                    <div className="glass p-6 rounded-2xl border border-border">
                        <p className="text-text-secondary text-center py-10">
                            Vos recommandations personnalisées apparaîtront ici après votre premier test.
                        </p>
                    </div>
                </div>

                {/* Sidebar: Progress */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold">Progression par Domaine</h2>
                    <div className="glass p-6 rounded-2xl border border-border space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Développement Web</span>
                                <span className="font-bold text-accent-yellow">75%</span>
                            </div>
                            <div className="h-2 bg-surface-highlight rounded-full overflow-hidden">
                                <div className="h-full bg-accent-yellow w-3/4 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Base de données</span>
                                <span className="font-bold text-blue-400">40%</span>
                            </div>
                            <div className="h-2 bg-surface-highlight rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 w-2/5 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Réseau</span>
                                <span className="font-bold text-green-400">90%</span>
                            </div>
                            <div className="h-2 bg-surface-highlight rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 w-[90%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
