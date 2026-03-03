'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  isPushSupported,
  getPermissionState,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribed,
} from '@/lib/push-notifications';

type ToggleState = 'loading' | 'unsupported' | 'denied' | 'on' | 'off';

export default function NotificationToggle() {
  const [state, setState] = useState<ToggleState>('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) {
      setState('unsupported');
      return;
    }

    const perm = getPermissionState();
    if (perm === 'denied') {
      setState('denied');
      return;
    }

    // Check actual subscription status
    void isSubscribed().then((sub) => {
      setState(sub ? 'on' : 'off');
    });
  }, []);

  const toggle = useCallback(async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (state === 'on') {
        const ok = await unsubscribeFromPush();
        if (ok) setState('off');
      } else {
        const ok = await subscribeToPush();
        if (ok) {
          setState('on');
        } else {
          // Check if permission was denied
          const perm = getPermissionState();
          if (perm === 'denied') {
            setState('denied');
          }
        }
      }
    } finally {
      setBusy(false);
    }
  }, [state, busy]);

  // Don't render if not supported
  if (state === 'loading' || state === 'unsupported') return null;

  return (
    <div
      className="glass-card p-4 flex items-center justify-between gap-3"
      style={{ borderColor: state === 'on' ? 'color-mix(in srgb, var(--gold-primary) 25%, transparent)' : undefined }}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
          Daily reminders
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
          {state === 'denied'
            ? 'Notifications blocked — enable in browser settings'
            : state === 'on'
              ? 'You\'ll get a daily nudge to practice'
              : 'Get a gentle nudge to practice each day'}
        </p>
      </div>

      <button
        onClick={() => void toggle()}
        disabled={busy || state === 'denied'}
        className="relative shrink-0 rounded-full transition-colors duration-200"
        style={{
          width: 44,
          height: 24,
          background: state === 'on'
            ? 'color-mix(in srgb, var(--gold-primary) 50%, transparent)'
            : state === 'denied'
              ? 'color-mix(in srgb, var(--text-body) 8%, transparent)'
              : 'color-mix(in srgb, var(--text-body) 15%, transparent)',
          opacity: busy ? 0.6 : 1,
          cursor: state === 'denied' ? 'not-allowed' : 'pointer',
        }}
        role="switch"
        aria-checked={state === 'on'}
        aria-label="Toggle daily reminders"
      >
        <span
          className="absolute top-0.5 rounded-full transition-transform duration-200"
          style={{
            width: 20,
            height: 20,
            background: state === 'on' ? 'var(--gold-primary)' : 'color-mix(in srgb, var(--text-body) 50%, transparent)',
            transform: state === 'on' ? 'translateX(22px)' : 'translateX(2px)',
            boxShadow: state === 'on' ? '0 0 8px color-mix(in srgb, var(--gold-primary) 40%, transparent)' : 'none',
          }}
        />
      </button>
    </div>
  );
}
