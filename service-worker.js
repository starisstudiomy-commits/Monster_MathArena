// Monster MathArena - Service Worker
// Cache-first + runtime caching: precache "app shell" (HTML/manifest/splash/icons),
// lepas tu setiap asset (monster/effect/enemy PNG dll.) di-cache automatik bila
// pertama kali di-fetch semasa main. Selepas itu, semua boleh dimuatkan offline.
const CACHE_NAME = 'mma-cache-v6';
const CORE_ASSETS = [
  './monster-math-arena-claude.html',
  './manifest.json',
  './assets/splashscreen.png',
  './assets/logo_matharena.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/music/home.mp3',
  './assets/music/battle.mp3',
  './assets/music/boss.mp3',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Cuma cache same-origin (assets/HTML sendiri) - elak isu opaque-response utk font CDN luar
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
