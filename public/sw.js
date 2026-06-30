// Codebrand Service Worker v2.0.0
// SIN cache de larga vida. Estrategia network-first en TODO: online siempre
// sirve contenido fresco desde la red. La cache solo actúa como red de
// seguridad offline y SOLO si la copia tiene menos de 5 minutos.
//
// Motivación: eliminar el contenido obsoleto que servía la estrategia
// cache-first anterior (CSS/JS/fuentes/imágenes quedaban "pegadas").

const CACHE_VERSION = 'codebrand-v2.0.0';
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Vida máxima de CUALQUIER entrada en cache: 5 minutos.
const MAX_AGE = 5 * 60 * 1000;

// Nunca tocar estos patrones (APIs, server actions, pixeles/beacons de tracking).
const NEVER_CACHE = [
  /\/api(\/|$)/,
  /\/_actions(\/|$)/,
  /\/tr\/?(\?|$)/i,
  /\/collect(\?|$)/i,
  /google-analytics\.com\/g\/collect/i,
  /analytics\.google\.com/i,
];

// Install — activar de inmediato, sin precache (nada debe quedar fijo).
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Permite forzar la activación desde la página si hace falta.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate — BORRA todas las caches anteriores (incluida la v1.2.0 cache-first)
// y toma control inmediato de las pestañas abiertas.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith('codebrand-') && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch — network-first con TTL de 5 min para mismo origen y fuentes de Google.
// Terceros y todo lo demás: pasa directo a la red, sin cachear.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (NEVER_CACHE.some((pattern) => pattern.test(url.href))) return;

  const sameOrigin = url.origin === self.location.origin;
  const isGoogleFont =
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  // Cualquier otra cosa (analytics, scripts de terceros, etc.) pasa directo:
  // no se cachea, así nunca queda obsoleta.
  if (!sameOrigin && !isGoogleFont) return;

  event.respondWith(networkFirstWithTTL(request));
});

// Network-first: intenta la red SIEMPRE. Si responde, sirve eso y guarda una
// copia con marca de tiempo. Si la red falla, usa la copia en cache solo si
// tiene menos de 5 minutos; si no, error 503.
async function networkFirstWithTTL(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok && networkResponse.type !== 'opaque') {
      const headers = new Headers(networkResponse.headers);
      headers.set('sw-cached-at', Date.now().toString());
      const timed = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers,
      });
      cache.put(request, timed);
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    if (cached && isFresh(cached)) return cached;

    if (request.mode === 'navigate') {
      const home = await cache.match('/');
      if (home && isFresh(home)) return home;
      return new Response(
        'Sin conexion. Por favor verifica tu internet e intenta de nuevo.',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
      );
    }

    return new Response('Offline', { status: 503 });
  }
}

// ¿La copia en cache tiene menos de 5 minutos?
function isFresh(response) {
  const at = response.headers.get('sw-cached-at');
  if (!at) return false;
  return Date.now() - parseInt(at, 10) < MAX_AGE;
}
