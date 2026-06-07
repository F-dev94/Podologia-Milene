const CACHE_NAME = 'podologia-cache-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/images/Milena1.jpeg',
  '/images/Milena2.jpeg'
];

// Instala o service worker e força ativação imediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Limpa caches antigos quando o novo service worker assume controle
self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia de requisição inteligente para evitar cache-lock
self.addEventListener('fetch', (event) => {
  // Para páginas e rotas de API: Network First
  if (event.request.mode === 'navigate' || event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Apenas salva em cache se for uma resposta bem sucedida
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Para imagens, arquivos estáticos e fontes: Cache First com fallback de rede
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request).then((netResponse) => {
            if (netResponse.status === 200) {
              const responseClone = netResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return netResponse;
          });
        })
    );
  }
});
