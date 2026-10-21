/* global self, caches, fetch, URL */

const CACHE_NAME = 'air-string-mediapipe-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('air-string-mediapipe-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      )),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || !url.pathname.includes('/mediapipe/')) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request)
      if (cached) return cached
      const response = await fetch(event.request)
      if (response.ok) await cache.put(event.request, response.clone())
      return response
    }),
  )
})
