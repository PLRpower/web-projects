'use client';

import { BatchCCTLImporter } from '@/components/cctl/BatchCCTLImporter';

export default function DashboardImportCCTLPage() {
    return (
        <BatchCCTLImporter
            backHref="/dashboard/cctl"
            backLabel="Retour aux CCTLs"
            showThemeToggle={false}
            customTitle="Import & Ingestion CCTL par Lot"
            customSubtitle="Importez et validez plusieurs sujets d'évaluation CCTL en quelques secondes. Les questions sont indexées directement dans votre espace."
        />
    );
}
