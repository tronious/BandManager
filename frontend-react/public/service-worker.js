/*
  Legacy PWA cleanup.

  Some setups register a Service Worker at /service-worker.js.
  This file mirrors /sw.js as a kill-switch to remove any previously-installed SW.
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
