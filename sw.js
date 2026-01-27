// TimeTracker simple offline cache (GitHub Pages friendly)
const CACHE = 'timetracker-v1';
const ASSETS = [
  './',
  './index.html',
  './app.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // network-first for html to avoid stale deploys
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(req).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return resp;
    }).catch(() => cached))
  );
});
