const V = new URL(self.location.href).searchParams.get('v') || '0';
const C = 'ct-' + V, S = ['./', 'index.html', 'manifest.json'];

self.addEventListener('install', e => e.waitUntil(caches.open(C).then(c => c.addAll(S)).then(() => self.skipWaiting())));

self.addEventListener('activate', e => e.waitUntil((async () => {
  const old = (await caches.keys()).filter(k => k !== C);
  await Promise.all(old.map(k => caches.delete(k)));
  await self.clients.claim();
  if (old.length) (await self.clients.matchAll({ type: 'window' })).forEach(c => c.navigate(c.url));
})()));

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
