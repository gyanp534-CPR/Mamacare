/**
 * MamaCare — Service Worker (sw.js)
 * Offline caching + background sync + Web Push
 * Version: v11.0
 */

const CACHE_NAME = 'mamacare-v11.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/app-improvements.js',
  '/app-push.js',
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
  '/mcAppIcons/android/mipmap-xxxhdpi/icon.png',
  '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/512.png',
  '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
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
  const icon  = data.icon  || '/mcAppIcons/android/mipmap-xxxhdpi/icon.png';
  const tag   = data.tag   || 'mamacare-default';
  const url   = data.url   || '/';
  const type  = data.type  || 'general';

  // Type-specific actions
  const actionsByType = {
    medicine:    [{ action: 'taken',   title: '✅ Taken' }, { action: 'snooze', title: '⏰ 30 min' }],
    water:       [{ action: 'logged',  title: '💧 Logged' }, { action: 'open', title: 'Open App' }],
    kick:        [{ action: 'open',    title: '👶 Track Now' }, { action: 'dismiss', title: 'Dismiss' }],
    appointment: [{ action: 'open',    title: '📅 View' }, { action: 'dismiss', title: 'Dismiss' }],
    default:     [{ action: 'open',    title: 'Open App' }, { action: 'dismiss', title: 'Dismiss' }],
  };
  const actions = actionsByType[type] || actionsByType.default;

  e.waitUntil(
    self.registration.showNotification(title, {
      body, icon, tag,
      badge: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
      data: { url, type, originalData: data },
      vibrate: [200, 100, 200],
      requireInteraction: type === 'medicine',
      actions,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const notifData = e.notification.data || {};
  const type = notifData.type;

  // Handle snooze for medicine
  if (e.action === 'snooze' && type === 'medicine') {
    const orig = notifData.originalData || {};
    setTimeout(() => {
      self.registration.showNotification(orig.title || 'MamaCare 💊', {
        body: orig.body || 'Medicine reminder (snoozed)',
        icon: orig.icon || '/mcAppIcons/android/mipmap-xxxhdpi/icon.png',
        tag: (orig.tag || 'med') + '-snooze',
        badge: '/mcAppIcons/Assets.xcassets/AppIcon.appiconset/_/180.png',
        data: notifData,
        vibrate: [200, 100, 200],
        actions: [{ action: 'taken', title: '✅ Taken' }, { action: 'dismiss', title: 'Dismiss' }],
      });
    }, 30 * 60 * 1000); // 30 minutes
    return;
  }

  const url = notifData.url || '/';
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

// ── IndexedDB helpers ──
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('mamacare-offline', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function getQueuedItems() {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readonly');
    const req = tx.objectStore('queue').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function removeQueuedItem(id) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('queue', 'readwrite');
    tx.objectStore('queue').delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function syncPendingLogs() {
  let items;
  try { items = await getQueuedItems(); } catch(e) { return; }
  if (!items || !items.length) return;

  for (const item of items) {
    try {
      const res = await fetch(item.url, {
        method: item.method || 'POST',
        headers: { 'Content-Type': 'application/json', ...item.headers },
        body: JSON.stringify(item.body),
      });
      if (res.ok) {
        await removeQueuedItem(item.id);
        // Notify app that sync happened
        const clients = await self.clients.matchAll();
        clients.forEach(c => c.postMessage({ type: 'SYNC_COMPLETE', table: item.table }));
      }
    } catch(e) {
      // Still offline — leave in queue
    }
  }
}
