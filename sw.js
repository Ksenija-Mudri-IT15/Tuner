const CACHE = 'tuner';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'pitch.js', 'tunings.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));

// Network first so updates show up right away, the cache is used when offline
self.addEventListener('fetch', e => e.respondWith(
  fetch(e.request)
    .then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    })
    .catch(() => caches.match(e.request))
));
