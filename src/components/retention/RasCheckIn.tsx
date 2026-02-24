'use client';

import { useState, useEffect } from 'react';

const RAY_PROMPTS = [
  { id: 'R1', name: 'Intention', prompt: 'I want my attention to find moments where I am clear about what matters most.' },
  { id: 'R2', name: 'Joy', prompt: 'I want my attention to find moments where my energy comes from something real — not pressure.' },
  { id: 'R3', name: 'Presence', prompt: 'I want my attention to find moments where I am settled and regulated — not just performing calm.' },
  { id: 'R4', name: 'Power', prompt: 'I want my attention to find moments where I act before I feel ready — and trust myself after.' },
  { id: 'R5', name: 'Purpose', prompt: 'I want my attention to find moments where my calendar matches my values.' },
  { id: 'R6', name: 'Authenticity', prompt: 'I want my attention to find moments where I am the same person in every room.' },
  { id: 'R7', name: 'Connection', prompt: 'I want my attention to find moments where people feel safe enough to be honest around me.' },
  { id: 'R8', name: 'Possibility', prompt: 'I want my attention to find moments where I see options instead of walls.' },
  { id: 'R9', name: 'Be The Light', prompt: 'I want my attention to find moments where my presence lowers the noise in a room.' },
] as const;

const STORAGE_KEY = '143_ras_checkin';

interface SavedCheckIn {
  rayId: string;
  customFocus: string;
  date: string;
}

/**
 * RAS Check-In: "What do I want my attention to find today?"
 * Extends the morning flow by letting users set a specific
 * attentional focus tied to their 9 Rays. Stores in localStorage
 * (same pattern as RasPrimeCard) — one per day.
 */
export default function RasCheckIn({ bottomRayId }: { bottomRayId?: string }) {
  const [selectedRay, setSelectedRay] = useState<string>(bottomRayId ?? 'R1');
  const [customFocus, setCustomFocus] = useState('');
  const [isSet, setIsSet] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedCheckIn;
      if (saved.date === today) {
        queueMicrotask(() => {
          setSelectedRay(saved.rayId);
          setCustomFocus(saved.customFocus);
          setIsSet(true);
        });
      }
    } catch { /* ignore */ }
  }, [today]);

  function handleSet() {
    const data: SavedCheckIn = { rayId: selectedRay, customFocus, date: today };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIsSet(true);
  }

  const activePrompt = RAY_PROMPTS.find((r) => r.id === selectedRay);

  if (isSet) {
    return (
      <div className="glass-card p-5 space-y-3" style={{ borderColor: 'rgba(248, 208, 17, 0.15)' }}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            RAS Focus Set
          </p>
          <button
            type="button"
            onClick={() => setIsSet(false)}
            className="text-xs hover:underline"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Change
          </button>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
          {customFocus || activePrompt?.prompt}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          Your RAS is scanning for <span style={{ color: 'var(--brand-gold)' }}>{activePrompt?.name}</span> today. You will notice it.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          RAS Check-In
        </p>
        <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          What do I want my attention to find today?
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          Pick a capacity. Your RAS will start scanning for evidence of it throughout the day.
        </p>
      </div>

      {/* Ray selector */}
      <div className="flex flex-wrap gap-2">
        {RAY_PROMPTS.map((ray) => (
          <button
            key={ray.id}
            type="button"
            onClick={() => setSelectedRay(ray.id)}
            className="rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: selectedRay === ray.id ? 'rgba(248, 208, 17, 0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${selectedRay === ray.id ? 'rgba(248, 208, 17, 0.4)' : 'var(--surface-border)'}`,
              color: selectedRay === ray.id ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)',
            }}
          >
            {ray.name}
            {ray.id === bottomRayId && (
              <span className="ml-1 text-[10px] opacity-60">Rise</span>
            )}
          </button>
        ))}
      </div>

      {/* Generated prompt */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(248, 208, 17, 0.06)', border: '1px solid rgba(248, 208, 17, 0.12)' }}
      >
        <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          &ldquo;{activePrompt?.prompt}&rdquo;
        </p>
      </div>

      {/* Custom override */}
      <div>
        <label className="block text-xs" style={{ color: 'var(--text-on-dark-muted)' }} htmlFor="ras_custom_focus">
          Or write your own focus:
        </label>
        <input
          id="ras_custom_focus"
          type="text"
          className="mt-1 w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-on-dark)',
          }}
          value={customFocus}
          onChange={(e) => setCustomFocus(e.target.value)}
          placeholder="I want my attention to find..."
        />
      </div>

      <button
        type="button"
        className="btn-primary w-full"
        onClick={handleSet}
      >
        Set today&apos;s RAS focus
      </button>
    </div>
  );
}
