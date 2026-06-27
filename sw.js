// Minimal service worker - makes the app installable and offline-capable
const CACHE="calling-v1";
const ASSETS=["./","./index.html","./manifest.json"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("./index.html")))
  );
});
