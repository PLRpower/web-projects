'use client';

import { BatchCCTLImporter } from '@/components/cctl/BatchCCTLImporter';

export default function PublicCCTLDepositPage() {
    return (
        <BatchCCTLImporter
            backHref="/cctl"
            backLabel="Retour aux CCTLs"
            showThemeToggle={true}
            customTitle="Déposer des Sujets de CCTL"
            customSubtitle="Déposez un ou plusieurs sujets de CCTL en PDF. Notre moteur IA extrait automatiquement les questions, syntaxe le code et anonymise les données."
        />
    );
}
