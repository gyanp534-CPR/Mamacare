/**
 * MamaCare — Service Worker (sw.js)
 * Offline caching + background sync
 * Version: v7.7
 */

const CACHE_NAME = 'mamacare-v8.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/app-improvements.js',
  '/meal-plans-indian.js',
  '/app-baby.js',
  '/app-coach.js',
  '/app-extra.js',
  '/app-features.js',
  '/app-india.js',
  '/app-monetize.js',
  '/app-onboard.js',
  '/app-smart.js',
  '/app-tracker.js',
  '/app-enhancements.js',
  '/style.css',
  '/manifest.json',
  '/icon-192.svg',
];

// Install — cache static shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static, network-first for API
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and Supabase API calls (always fresh)
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('anthropic.com')) return;

  // Static assets — cache first
  if (
    e.request.destination === 'script' ||
    e.request.destination === 'style' ||
    e.request.destination === 'font' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/'
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Network first for everything else
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Push Notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'MamaCare 🌸';
  const body  = data.body  || 'Ek important reminder hai!';
  const icon  = data.icon  || '/icon-192.svg';
  const tag   = data.tag   || 'mamacare-default';
  const url   = data.url   || '/';

  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon, tag,
      badge: '/icon-192.svg',
      data: { url },
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open',    title: 'Open App' },
        { action: 'dismiss', title: 'Dismiss' },
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Background Sync (offline data)
self.addEventListener('sync', e => {
  if (e.tag === 'sync-logs') {
    e.waitUntil(syncPendingLogs());
  }
});

async function syncPendingLogs() {
  // Offline queue stored in IndexedDB — sync when online
  // Handled by app.js when it detects navigator.onLine
  return Promise.resolve();
}
