const CACHE_NAME = "noteflow-v3";
const APP_SHELL = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/manifest.webmanifest",
  "/icons/noteflow.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/index.html")));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const fresh = fetch(request).then(response => {
        if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const noteId = event.notification.data?.noteId;

    const url = noteId
        ? `/?noteId=${noteId}`
        : "/";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then((clientList) => {

            for (const client of clientList) {
                if ("focus" in client) {
                    client.focus();

                    if (noteId && "navigate" in client) {
                        return client.navigate(url);
                    }

                    return client;
                }
            }

            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener("push", event => {
  let data = {
    title: "NoteFlow",
    body: "You have a reminder."
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error("Invalid push data:", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "NoteFlow",
      {
        body: data.body || "You have a reminder.",
        icon: "/icons/noteflow.svg",
        badge: "/icons/noteflow.svg",
        tag: data.tag || "noteflow-reminder",
        data: {
          noteId: data.noteId || null
        }
      }
    )
  );
});