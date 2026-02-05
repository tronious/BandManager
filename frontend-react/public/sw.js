/*
  Legacy PWA cleanup.

  The previous Vue build used vite-plugin-pwa which registers a Service Worker at /sw.js.
  If a visitor still has that SW installed, it can serve a stale (Vue) app shell on normal refresh.

  This SW is a kill-switch: it unregisters itself, clears caches, and asks clients to reload.
*/

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.registration.unregister()
      } catch {}

      try {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      } catch {}

      try {
        await self.clients.claim()
        const windows = await self.clients.matchAll({ type: 'window' })
        for (const client of windows) {
          try {
            client.navigate(client.url)
          } catch {}
        }
      } catch {}
    })()
  )
})

self.addEventListener('fetch', () => {
  // Intentionally empty.
})
