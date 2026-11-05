import { defineConfig } from '@adonisjs/static';

const staticServerConfig = defineConfig({
    enabled: true,
    etag: true,
    lastModified: true,
    dotFiles: 'ignore',
    headers: (filePath) => {
        // Vite hashed assets (/assets/...) - cache 1 year immutable
        if (filePath.includes('/assets/') || filePath.includes('\\assets\\')) {
            return {
                'Cache-Control': 'public, max-age=31536000, immutable',
                'CDN-Cache-Control': 'max-age=31536000',
            };
        }
        // Static assets (logos, icons, fonts)
        if (/\.(svg|png|jpg|jpeg|webp|ico|woff2?|webmanifest)$/i.test(filePath)) {
            return {
                'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
                'CDN-Cache-Control': 'max-age=604800',
            };
        }
        return {
            'Cache-Control': 'public, max-age=3600',
        };
    },
});

export default staticServerConfig;