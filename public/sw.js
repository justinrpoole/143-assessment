// 143 Leadership — Service Worker for Push Notifications
// This file must be in /public to be served at the root scope.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push events
self.addEventListener('push', (event) => {
  const fallback = {
    title: '143 Leadership',
    body: 'Your daily light practice is waiting.',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: '143-daily',
    data: { url: '/portal' },
  };

  let payload = fallback;
  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...fallback, ...parsed };
    } catch {
      payload.body = event.data.text() || fallback.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icon.svg',
      badge: payload.badge || '/icon.svg',
      tag: payload.tag || '143-daily',
      data: payload.data || { url: '/portal' },
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Later' },
      ],
    }),
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/portal';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(targetUrl);
    }),
  );
});
