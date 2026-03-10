// Codebrand Service Worker v1.1.0
// Cache-first strategy for static assets, network-first for dynamic content

const CACHE_VERSION = 'codebrand-v1.1.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const THIRD_PARTY_CACHE = `${CACHE_VERSION}-third-party`;

// Max age for third-party scripts: 1 hour (security measure)
const THIRD_PARTY_MAX_AGE = 60 * 60 * 1000;

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/iconcodebrand.svg',
  '/favicon.ico'
];

// Static asset patterns (cache-first)
const STATIC_PATTERNS = [
  /\.(js|css|woff2?|ttf|eot)$/i,
  /\/_astro\//
];

// Image patterns (cache with limit)
const IMAGE_PATTERNS = [
  /\.(png|jpg|jpeg|webp|avif|gif|svg|ico)$/i
];

// Third-party scripts to cache with stale-while-revalidate (1h max)
const THIRD_PARTY_SCRIPTS = [
  /connect\.facebook\.net\/.*\.js$/i,       // fbevents.js
  /connect\.facebook\.net\/.*config/i,       // FB config
  /analytics\.ahrefs\.com\/analytics\.js$/i, // Ahrefs
  /googletagmanager\.com\/gtm\.js/i,         // GTM
  /googletagmanager\.com\/gtag/i,            // gtag
  /lh3\.googleusercontent\.com/i             // Google profile images
];

// Never cache these patterns (API routes, tracking pixels/beacons)
const NEVER_CACHE = [
  /\/api(\/|$)/,               // API routes (with or without trailing slash)
  /\/_actions(\/|$)/,          // Astro server actions
  /\/tr\/?(\?|$)/i,           // Facebook pixel beacon
  /\/collect(\?|$)/i,          // GA collect endpoint
  /google-analytics\.com\/g\/collect/i,
  /analytics\.google\.com/i
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Handle messages from the registration script
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, THIRD_PARTY_CACHE];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('codebrand-') && !currentCaches.includes(name))
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Never cache tracking pixels/beacons
  if (NEVER_CACHE.some(pattern => pattern.test(url.href))) {
    return;
  }

  // Handle third-party scripts with stale-while-revalidate (1h TTL)
  if (THIRD_PARTY_SCRIPTS.some(pattern => pattern.test(url.href))) {
    event.respondWith(staleWhileRevalidateWithTTL(request, THIRD_PARTY_CACHE, THIRD_PARTY_MAX_AGE));
    return;
  }

  // Skip other cross-origin requests except for fonts
  if (url.origin !== self.location.origin &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  // Handle different content types
  if (IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirstWithLimit(request, IMAGE_CACHE, 100));
  } else if (STATIC_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Cache-first with size limit (for images)
async function cacheFirstWithLimit(request, cacheName, maxItems) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);

      // Limit cache size
      const keys = await cache.keys();
      if (keys.length >= maxItems) {
        await cache.delete(keys[0]);
      }

      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Image unavailable', { status: 503 });
  }
}

// Network-first with offline fallback (for navigation)
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return cached home page as fallback
    const fallback = await caches.match('/');
    if (fallback) {
      return fallback;
    }

    return new Response('Offline - Please check your connection', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Stale-while-revalidate (for dynamic content)
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Stale-while-revalidate with TTL (for third-party scripts)
// Returns cached response only if younger than maxAge; always revalidates in background
async function staleWhileRevalidateWithTTL(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Check if cached response is still within TTL
  let cachedIsValid = false;
  if (cachedResponse) {
    const cachedDate = cachedResponse.headers.get('sw-cached-at');
    if (cachedDate) {
      const age = Date.now() - parseInt(cachedDate, 10);
      cachedIsValid = age < maxAge;
    }
  }

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        // Clone and add a timestamp header to track cache age
        const headers = new Headers(networkResponse.headers);
        headers.set('sw-cached-at', Date.now().toString());
        const timedResponse = new Response(networkResponse.clone().body, {
          status: networkResponse.status,
          statusText: networkResponse.statusText,
          headers: headers
        });
        cache.put(request, timedResponse);
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  // Return cached response only if valid; otherwise wait for network
  return (cachedIsValid && cachedResponse) ? cachedResponse : fetchPromise;
}
