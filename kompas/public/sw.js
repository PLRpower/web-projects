// Kompas CESI Service Worker for Offline Flashcards and PWA
const CACHE_NAME = 'kompas-pwa-v2';
const STATIC_ASSETS = [
    '/',
    '/manifest.webmanifest',
    '/img/favicon.png',
    '/img/logo-dark.png',
    '/img/logo-light.png',
    '/dashboard/flashcards',
    '/dashboard/cctl'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('Pre-caching assets skipped in dev:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Ignore non-GET or cross-origin requests
    if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
        return;
    }

    // Ignore API calls that require live server
    if (request.url.includes('/api/stripe') || request.url.includes('/api/auth')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((networkResponse) => {
                // If valid response, clone and cache static assets or flashcard pages
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Fallback to cache if network fails (Offline mode for bus/train)
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (request.mode === 'navigate') {
                        return caches.match('/dashboard/flashcards');
                    }
                    return new Response('Hors-Ligne', { status: 503, statusText: 'Offline' });
                });
            })
    );
});
