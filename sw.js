/* MiNutriApp · Service Worker
   Reglas GAP: cachés SOLO con prefijo "minutri-", alcance "./" (solo /mi-nutri-app/),
   versión tomada de version.js (único lugar). Nunca toca cachés de otras apps del dominio. */
importScripts('./version.js');
const VERSION = 'minutri-v' + self.MINUTRI_VERSION;   // p. ej. "minutri-v1.2.0"
const PREFIX = 'minutri-';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './version.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './vendor/babel.min.js',
  './vendor/lucide.min.js',
  './vendor/tailwind.min.css'
];

self.addEventListener('install', (event) => {
  // cache: 'no-store' evita la caché HTTP de 10 min de GitHub Pages al descargar la versión nueva
  event.waitUntil(caches.open(VERSION).then((cache) =>
    Promise.all(ASSETS.map((url) => fetch(new Request(url, { cache: 'no-store' })).then((res) => {
      if (!res.ok) throw new Error('No se pudo descargar ' + url);
      return cache.put(url, res);
    })))
  ));
  // No se llama a skipWaiting aquí: la versión nueva espera a que el usuario toque "Actualizar".
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'GET_VERSION' && event.ports[0]) event.ports[0].postMessage(VERSION);
});

const inScope = (url) => url.startsWith(self.registration.scope);

/* Página (HTML): red primero sin caché HTTP, con respaldo en caché si no hay internet o tarda >4 s */
async function networkFirst(request) {
  const cache = await caches.open(VERSION);
  try {
    const res = await Promise.race([
      fetch(request, { cache: 'no-store' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))
    ]);
    if (res && res.ok) cache.put('./index.html', res.clone());
    return res;
  } catch (e) {
    return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
  }
}
/* Librerías, íconos y demás: caché primero (funcionan 100 % sin internet) */
async function cacheFirst(request) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok) cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !inScope(req.url)) return;   // nada fuera de /mi-nutri-app/
  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  event.respondWith(isPage ? networkFirst(req) : cacheFirst(req));
});
