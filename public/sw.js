// Minimal service worker (basic offline caching). Full @serwist/next integration pending compatibility verification.
const CACHE_NAME = "ptt-shell-v1";
const SHELL = ["/", "/manifest.webmanifest", "/logo.png", "/icons/icon-192x192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  // Network-first for API
  if (req.url.includes("/api/")) {
    event.respondWith(fetch(req).catch(() => caches.match(req) as Promise<Response>));
    return;
  }
  // Cache-first for app shell & assets
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
      return res;
    }).catch(() => cached as Response))
  );
});
