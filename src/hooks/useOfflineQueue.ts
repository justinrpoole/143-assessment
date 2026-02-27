'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body: string;
  timestamp: number;
}

const STORAGE_KEY = '143_offline_queue';

function readQueue(): QueuedRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedRequest[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedRequest[]) {
  try {
    if (queue.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  } catch {
    // localStorage full or unavailable — silently degrade
  }
}

/**
 * useOfflineQueue — Queues failed API writes to localStorage,
 * flushes automatically on reconnect.
 *
 * Research: Offline resilience prevents data loss and builds trust.
 * Every mature mobile app (Calm, Noom, Headspace) queues offline
 * writes. Users who lose data once rarely come back.
 *
 * Usage:
 *   const { enqueue, pending, isOnline } = useOfflineQueue();
 *
 *   // In your save handler:
 *   const res = await fetch(url, opts);
 *   if (!res.ok && !navigator.onLine) {
 *     enqueue(url, 'POST', body);
 *   }
 */
export function useOfflineQueue() {
  const [pending, setPending] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const flushing = useRef(false);

  // Sync pending count from localStorage on mount
  useEffect(() => {
    setPending(readQueue().length);
  }, []);

  // Flush queue when coming back online
  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;

    const queue = readQueue();
    const remaining: QueuedRequest[] = [];

    for (const req of queue) {
      try {
        const res = await fetch(req.url, {
          method: req.method,
          headers: { 'Content-Type': 'application/json' },
          body: req.body,
        });
        if (!res.ok) {
          remaining.push(req); // Keep for retry
        }
      } catch {
        remaining.push(req); // Network still failing
      }
    }

    writeQueue(remaining);
    setPending(remaining.length);
    flushing.current = false;
  }, []);

  // Listen for online/offline events
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      void flush();
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Flush on mount if online and queue has items
    if (navigator.onLine && readQueue().length > 0) {
      void flush();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flush]);

  const enqueue = useCallback(
    (url: string, method: string, body: unknown) => {
      const queue = readQueue();
      queue.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url,
        method,
        body: JSON.stringify(body),
        timestamp: Date.now(),
      });
      writeQueue(queue);
      setPending(queue.length);
    },
    [],
  );

  return { enqueue, pending, isOnline, flush };
}
