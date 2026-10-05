const CACHE_NAME = "iadsder-pwa-v35";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/himnario/manifest.json",
  "/css/styles.css",
  "/js/app.js",
  "/js/i18n.js",
  "/js/pwa.js",
  "/data/ajustes.json",
  "/data/versiculo.json",
  "/data/filiales.json",
  "/data/galeria.json",
  "/data/videos.json",
  "/data/en-vivo.json",
  "/archivos/filiales.html",
  "/img/pwa-192.png",
  "/img/pwa-512.png",
  "/img/whatsapp-icon.svg",
  "/himnario/",
  "/himnario/index.html",
  "/himnario/inicio.html",
  "/himnario/hymn.html",
  "/himnario/favoritos.html",
  "/himnario/mihimnario.html",
  "/himnario/proyeccion.html",
  "/himnario/index.css",
  "/himnario/style.css",
  "/himnario/js/app.js",
  "/himnario/js/hymn.js",
  "/himnario/js/himnos_seccion_1.json",
  "/himnario/js/fondo.js",
  "/himnario/js/versiculo.js",
  "/himnario/js/estilosusuario.js",
  "/.netlify/images?url=/himnario/img/logo1.png&w=320&fm=png",
  "/himnario/img/logo2.png",
  "/himnario/img/logo2.ico",
  "/.netlify/images?url=/himnario/img/portada.png&w=520&fm=png",
  "/himnario/img/infographic_2572455.png",
  "/himnario/icons/share.svg",
  "/himnario/icons/whatsapp.svg",
  "/himnario/icons/telegram.svg",
  "/himnario/icons/gmail.svg",
  "/himnario/icons/copy.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
        return Promise.resolve();
      })))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true })
          .then(cached => cached || caches.match("/offline.html")))
    );
    return;
  }

  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
    return;
  }

  if (url.pathname.startsWith("/data/")) {
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match(request, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
