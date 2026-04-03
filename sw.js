const CACHE = 'bowl-v7';
const ASSETS = ['./index.html', './bowl-mascot.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isAsset = ASSETS.some(a => url.pathname.endsWith(a.replace('./','')));
  if (!isAsset) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      fetch(e.request).then(res => {
        cache.put(e.request, res.clone());
        return res;
      }).catch(() => cache.match(e.request))
    )
  );
});
