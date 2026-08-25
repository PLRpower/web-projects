'use client';

import { ShieldAlert, LogOut, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSingleSessionEnforcer } from '@/lib/session-enforcer';

export function SingleSessionModal() {
    const { isSessionRevoked, reconnectHere } = useSingleSessionEnforcer();

    if (!isSessionRevoked) return null;

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="card-editorial p-6 sm:p-8 rounded-3xl bg-surface-card border-2 border-red-500/50 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 relative">
                <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center shadow-lg">
                    <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">
                        Protection Anti-Partage
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-text-primary">
                        Session Interrompue
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed">
                        Un autre appareil ou navigateur vient de se connecter à votre compte Kompas avec vos identifiants.
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-border/70 text-left space-y-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-2 font-bold text-text-primary">
                        <Smartphone className="w-4 h-4 text-accent-yellow" />
                        <span>Licence individuelle strictement personnelle</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                        Conformément aux conditions générales d&apos;utilisation, chaque élève-ingénieur doit posséder son propre compte pour que le suivi algorithmique et le classement de promotion restent fiables.
                    </p>
                </div>

                <div className="space-y-2 pt-2">
                    <Button
                        variant="premium"
                        onClick={reconnectHere}
                        className="w-full font-bold text-xs py-5 shadow-lg shadow-accent-yellow/20 cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4 mr-1.5" />
                        Continuer sur cet appareil (Déconnecter l&apos;autre)
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full border-border text-xs text-text-secondary hover:text-text-primary cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 mr-1.5" />
                        Se déconnecter
                    </Button>
                </div>
            </div>
        </div>
    );
}
