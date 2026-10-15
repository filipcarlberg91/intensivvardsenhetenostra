const CACHE_NAME = "iva-ostra-v10";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/iva_pocketguide.png",
  "/kaloritabell_iva_343.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match("/index.html");
        });
      })
  );
});

self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SHOW_ANDROID_NOTIFICATION") {
    const { title, body, tag, data } = event.data;
    event.waitUntil(
      self.registration.showNotification(title || "IVA Östra Larm", {
        body: body || "Klinisk påminnelse",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        vibrate: [250, 100, 250, 100, 400],
        tag: tag || "iva-alarm-" + Date.now(),
        renotify: true,
        requireInteraction: true,
        data: data || {},
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notifData = event.notification.data || {};
  const docId = notifData.docId;
  const category = notifData.category;
  const targetUrl = docId ? `/?docId=${encodeURIComponent(docId)}` : "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          if (client.postMessage) {
            client.postMessage({
              type: "NOTIFICATION_CLICKED",
              docId,
              category,
              reminderId: notifData.reminderId,
            });
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
