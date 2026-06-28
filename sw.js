// DialFlow Service Worker — update banner ke saath
// Naya version aane par customer ko "update" dikhता hai (WhatsApp jaisa)
// Data/templates SAFE rehte hain (woh localStorage me, SW chhuता nahi)

const VERSION = "dialflow-v10";   // <-- naya update karte waqt yeh number badlein (v3->v4)
const RUNTIME = "dialflow-runtime";

self.addEventListener("install", e => {
  // turant install, par control NAHI leta (taaki update bar dikhe)
  self.skipWaiting === undefined ? null : null; // no auto skip
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== RUNTIME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// app se "SKIP_WAITING" aaye -> naya version chालu karo
self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // NETWORK FIRST: naya laao, fail ho to cache (offline)
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copy = resp.clone();
        caches.open(RUNTIME).then(c => c.put(e.request, copy)).catch(()=>{});
        return resp;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
