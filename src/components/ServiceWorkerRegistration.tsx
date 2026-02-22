'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker on mount.
 * This enables push notifications for users who have opted in.
 * The SW itself is lightweight — no caching strategy, just push handling.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Service worker registration failed — not critical
      });
    }
  }, []);

  return null;
}
