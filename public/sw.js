const CACHE_NAME = "codetrace-wasm-cache-v1";

const WASM_URLS = [
  "/sql-wasm.wasm",
  "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.asm.wasm",
  "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.asm.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(WASM_URLS).catch(err => {
        console.warn("Service Worker: Failed to pre-cache some assets", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
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
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Cache WASM files and Pyodide core assets
  if (
    requestUrl.pathname.endsWith(".wasm") ||
    requestUrl.href.includes("cdn.jsdelivr.net/pyodide") ||
    requestUrl.pathname.endsWith("sql-wasm.wasm")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic" && networkResponse.type !== "cors") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  }
});
