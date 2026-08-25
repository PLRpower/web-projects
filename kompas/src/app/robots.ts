import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kompas-cesi.fr';

    return {
        rules: {
            userAgent: '*',
            allow: [
                '/',
                '/cctl',
                '/prosits',
                '/livrables',
                '/dashboard/pricing',
                '/terms',
                '/privacy',
                '/login',
                '/register',
            ],
            disallow: [
                '/api/',
                '/dashboard/cctl/*',
                '/dashboard/settings',
                '/dashboard/profile',
                '/auth/*',
                '/_next/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
