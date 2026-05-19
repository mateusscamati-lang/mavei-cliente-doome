/* ============================================================
   sw.js — Service Worker DOOME
   Estratégia:
     - cache-first pra assets estáticos (fonts, css, js, imagens)
     - network-first com fallback pra HTML (atualiza sem cache forçado)
     - precache shell mínimo na install
   ============================================================ */

const CACHE_VERSION = 'doome-v1';
const STATIC_CACHE = 'doome-static-' + CACHE_VERSION;
const RUNTIME_CACHE = 'doome-runtime-' + CACHE_VERSION;

// Shell mínimo — só os essenciais. Resto vai pro runtime cache sob demanda.
const PRECACHE_URLS = [
  '/',
  '/styles.css',
  '/main.js',
  '/lightbox.css',
  '/lightbox.js',
  '/projetos-data.js',
  '/fonts/fonts.css',
  '/fonts/montserrat-400-latin.woff2',
  '/fonts/montserrat-400-latin-ext.woff2',
  '/assets/image-15.webp',
];

// Install: precacheia o shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Adiciona um por vez, ignorando erros (não trava install se algum recurso falhar)
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[sw] precache falhou para', url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Helpers
function isStaticAsset(url) {
  return (
    /\.(woff2?|css|js|webp|jpe?g|png|svg|ico|gif|avif)$/i.test(url.pathname) ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/assets/')
  );
}

function isHTML(req) {
  return req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
}

// Fetch handler
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Só GET; deixa POST/etc passar direto pra rede
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Só lida com mesma origem; deixa cross-origin (ex: WhatsApp, Maps embed) passar
  if (url.origin !== self.location.origin) return;

  // Não cachear /blog/ navigation (MAVEI atualiza conteúdo)
  // Apenas network-first com fallback pro cache
  if (url.pathname.startsWith('/blog')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // HTML: network-first (pra pegar updates rápido)
  if (isHTML(req)) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Assets estáticos: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Fallback: tenta rede, falha = cache
  event.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const response = await fetch(req);
    if (response.ok && response.status < 400) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, response.clone());
    }
    return response;
  } catch (err) {
    // Sem rede + sem cache = devolve 504
    return new Response('Offline', { status: 504, statusText: 'Offline' });
  }
}

async function networkFirst(req) {
  try {
    const response = await fetch(req);
    if (response.ok && response.status < 400) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(req);
    if (cached) return cached;
    // Última saída: tenta servir a home offline
    if (isHTML(req)) {
      const fallback = await caches.match('/');
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 504, statusText: 'Offline' });
  }
}
