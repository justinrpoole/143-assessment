'use client';

import { useMemo, useState } from 'react';

type RasPrimeState = {
  items: string[];
  updatedAt: string;
  noticed?: string;
  noticedAt?: string;
};

const STORAGE_KEY = 'ras_prime_v1';

function loadPrime(): RasPrimeState | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RasPrimeState;
    if (!Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePrime(state: RasPrimeState) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface RasPrimeCardProps {
  variant?: 'full' | 'compact';
}

export function RasPrimeCard({ variant = 'full' }: RasPrimeCardProps) {
  const [items, setItems] = useState<string[]>(() => {
    const existing = loadPrime();
    if (existing?.items?.length) {
      return [
        existing.items[0] ?? '',
        existing.items[1] ?? '',
        existing.items[2] ?? '',
      ];
    }
    return ['', '', ''];
  });
  const [noticed, setNoticed] = useState<string>(() => {
    const existing = loadPrime();
    return existing?.noticed ?? '';
  });
  const [savedAt, setSavedAt] = useState<string | null>(() => {
    const existing = loadPrime();
    return existing?.updatedAt ?? null;
  });
  const [noticeSaved, setNoticeSaved] = useState<boolean>(() => {
    const existing = loadPrime();
    return Boolean(existing?.noticed);
  });

  const canSave = useMemo(
    () => items.some((value) => value.trim().length > 0),
    [items],
  );

  function handleItemChange(index: number, value: string) {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSave() {
    const now = new Date().toISOString();
    const nextState: RasPrimeState = {
      items: items.map((value) => value.trim()).slice(0, 3),
      updatedAt: now,
      noticed: noticeSaved ? noticed.trim() : undefined,
      noticedAt: noticeSaved ? now : undefined,
    };
    savePrime(nextState);
    setSavedAt(now);
  }

  function handleNoticeSave() {
    if (!noticed.trim()) {
      setNoticeSaved(false);
      return;
    }
    const now = new Date().toISOString();
    const nextState: RasPrimeState = {
      items: items.map((value) => value.trim()).slice(0, 3),
      updatedAt: savedAt ?? now,
      noticed: noticed.trim(),
      noticedAt: now,
    };
    savePrime(nextState);
    setNoticeSaved(true);
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          RAS Prime
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Name three signals you want your attention to notice today. Your filter follows your focus.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((value, index) => (
          <label key={`ras-${index}`} className="space-y-1 text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Signal {index + 1}
            <input
              value={value}
              onChange={(event) => handleItemChange(index, event.target.value)}
              placeholder="What you want to notice"
              className="mt-1 w-full rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={!canSave}
        >
          Save prime
        </button>
        {savedAt ? (
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Saved {new Date(savedAt).toLocaleDateString()}
          </p>
        ) : (
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            No prime saved yet
          </p>
        )}
      </div>

      {variant === 'full' ? (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Noticed
          </p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Log one signal you caught today. That locks the rep.
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              value={noticed}
              onChange={(event) => setNoticed(event.target.value)}
              placeholder="I noticed..."
              className="w-full flex-1 rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
              style={{
                background: 'var(--surface-glass, rgba(255,255,255,0.06))',
                border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
                color: 'var(--text-on-dark, #FFFEF5)',
              }}
            />
            <button type="button" className="btn-watch" onClick={handleNoticeSave}>
              Log it
            </button>
          </div>
          {noticeSaved ? (
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              Logged.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
