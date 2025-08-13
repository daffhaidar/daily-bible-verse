// Service Worker for Daily Bible Verse PWA
// Implements offline-first caching strategy

const CACHE_NAME = "daily-bible-verse-v1";
const STATIC_CACHE_NAME = "daily-bible-verse-static-v1";

// Assets to cache immediately
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/icon-72.svg", "/icon-96.svg", "/icon-128.svg", "/icon-144.svg", "/icon-152.svg", "/icon-192.svg", "/icon-384.svg", "/icon-512.svg"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(cacheFirst(request));
});

// Cache-first strategy with network fallback
async function cacheFirst(request) {
  try {
    // Try to get from cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log("Service Worker: Serving from cache:", request.url);
      return cachedResponse;
    }

    // If not in cache, fetch from network
    console.log("Service Worker: Fetching from network:", request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log("Service Worker: Cached new resource:", request.url);
    }

    return networkResponse;
  } catch (error) {
    console.error("Service Worker: Fetch failed:", error);

    // Return offline fallback for HTML requests
    if (request.headers.get("accept")?.includes("text/html")) {
      const offlinePage = await caches.match("/");
      if (offlinePage) {
        return offlinePage;
      }
    }

    throw error;
  }
}

// Background sync for future enhancements
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered");

  if (event.tag === "verse-sync") {
    event.waitUntil(syncVerseData());
  }
});

// Sync verse data when back online
async function syncVerseData() {
  try {
    console.log("Service Worker: Syncing verse data...");
    // In a real implementation, this would sync with a server
    // For now, we just log that sync would happen
    console.log("Service Worker: Verse data sync completed");
  } catch (error) {
    console.error("Service Worker: Verse data sync failed:", error);
  }
}

// Push notification handling (for future enhancements)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  const options = {
    body: "Ayat harian baru tersedia untuk dedek wulan!",
    icon: "/icon-192.svg",
    badge: "/icon-72.svg",
    tag: "daily-verse",
    requireInteraction: false,
    actions: [
      {
        action: "view",
        title: "Lihat Ayat",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Daily Bible Verse", options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "view" || !event.action) {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handling from main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
