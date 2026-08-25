import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Kompas | Révisions & Ingénierie CESI',
        short_name: 'Kompas',
        description: 'La plateforme collaborative d\'entraide, d\'annales CCTL, de flashcards hors-ligne et de tuteur IA pour élèves-ingénieurs du CESI.',
        start_url: '/dashboard',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0A0A0B',
        theme_color: '#F59E0B',
        categories: ['education', 'productivity'],
        icons: [
            {
                src: '/img/favicon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/img/favicon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
        shortcuts: [
            {
                name: 'Flashcards Hors-Ligne',
                short_name: 'Flashcards',
                description: 'Révisez vos fiches dans les transports sans réseau',
                url: '/dashboard/flashcards',
                icons: [{ src: '/img/favicon.png', sizes: '96x96' }]
            },
            {
                name: 'CCTL & Annales',
                short_name: 'CCTL',
                description: 'Accédez aux annales d\'examens CESI',
                url: '/dashboard/cctl',
                icons: [{ src: '/img/favicon.png', sizes: '96x96' }]
            }
        ]
    };
}
