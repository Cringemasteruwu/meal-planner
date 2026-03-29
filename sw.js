const CACHE = 'mealplanner-v2';
const URL = './index.html';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add(URL)));
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
  if (!e.request.url.includes('index.html')) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(URL).then(cached => {
        const fresh = fetch(URL).then(res => {
          cache.put(URL, res.clone());
          return res;
        });
        return cached || fresh;
      })
    )
  );
});
