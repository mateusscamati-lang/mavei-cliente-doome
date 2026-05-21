/* ============================================================
   sw.js — KILL SWITCH
   O service worker antigo (doome-v1) cacheava CSS desatualizado
   e servia layout quebrado no F5. Esta versao se autodesregistra
   e limpa todos os caches, voltando o site pro fluxo normal sem PWA.
   ============================================================ */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => client.navigate(client.url));
  })());
});
