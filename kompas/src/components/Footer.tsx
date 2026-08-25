'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Footer() {
    return (
        <footer className="border-t border-border py-12 bg-surface/40 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link href="/" className="group block">
                        <Logo size={28} showText={true} />
                    </Link>
                </div>

                <p className="text-text-secondary text-xs text-center font-normal">
                    © {new Date().getFullYear()} Kompas | CESI. Développé par les étudiants, pour les étudiants.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium">
                    <Link href="/cctl" className="text-text-secondary hover:text-text-primary transition-colors">
                        CCTL
                    </Link>
                    <Link href="/prosits" className="text-text-secondary hover:text-text-primary transition-colors">
                        Prosits
                    </Link>
                    <Link href="/livrables" className="text-text-secondary hover:text-text-primary transition-colors">
                        Livrables
                    </Link>
                    <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
                        Confidentialité
                    </Link>
                    <Link href="/terms" className="text-text-secondary hover:text-text-primary transition-colors">
                        Conditions & Éthique
                    </Link>
                </div>
            </div>
        </footer>
    );
}
