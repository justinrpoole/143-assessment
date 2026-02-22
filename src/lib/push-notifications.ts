/**
 * Push notification utilities for 143 Leadership PWA.
 *
 * Handles service worker registration, push subscription management,
 * and server-side subscription storage.
 */

const SW_PATH = '/sw.js';
const LS_KEY = '143_push_enabled';

/** Check if push notifications are supported in this browser. */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/** Get the current notification permission state. */
export function getPermissionState(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/** Register the service worker if not already registered. */
async function ensureServiceWorker(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (existing) return existing;
  return navigator.serviceWorker.register(SW_PATH, { scope: '/' });
}

/** Convert a base64 VAPID key to Uint8Array for push subscription. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribe to push notifications.
 * Requests permission, registers the service worker, creates a push
 * subscription, and sends it to the server.
 *
 * Returns true if subscription succeeded, false otherwise.
 */
export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const registration = await ensureServiceWorker();

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // Get VAPID public key from server
    const configRes = await fetch('/api/notifications/vapid-key');
    if (!configRes.ok) return false;
    const { publicKey } = (await configRes.json()) as { publicKey: string };
    if (!publicKey) return false;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    // Create new subscription if needed
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
    }

    // Send subscription to server
    const res = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    });

    if (res.ok) {
      try { localStorage.setItem(LS_KEY, 'true'); } catch { /* silent */ }
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Unsubscribe from push notifications.
 * Removes the push subscription from the browser and notifies the server.
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
    if (!registration) return true;

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      try { localStorage.setItem(LS_KEY, 'false'); } catch { /* silent */ }
      return true;
    }

    // Notify server before unsubscribing
    const endpoint = subscription.endpoint;
    await fetch('/api/notifications/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    }).catch(() => { /* best-effort */ });

    await subscription.unsubscribe();
    try { localStorage.setItem(LS_KEY, 'false'); } catch { /* silent */ }
    return true;
  } catch {
    return false;
  }
}

/** Check if the user has an active push subscription. */
export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration(SW_PATH);
    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch {
    return false;
  }
}

/** Quick check via localStorage (avoids async SW query). */
export function isEnabledLocally(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(LS_KEY) === 'true';
  } catch {
    return false;
  }
}
