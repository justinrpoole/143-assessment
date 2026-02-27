'use client';

import { useState } from 'react';

interface Props {
  onLogged?: () => void;
}

export default function RepReceiptCard({ onLogged }: Props) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function logReceipt() {
    if (status === 'saving') return;
    setStatus('saving');
    try {
      const res = await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: 'evidence_receipt',
          trigger_type: 'ad_hoc',
          duration_seconds: 20,
          quality: 2,
          reflection_note: 'Receipt: I did it.',
        }),
      });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      setStatus('saved');
      onLogged?.();
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="glass-card p-5 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
        One-tap receipt
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Did a rep, a boundary, a start? Tap once and log it.
      </p>
      <button
        type="button"
        onClick={logReceipt}
        className="btn-primary w-full"
        disabled={status === 'saving'}
      >
        {status === 'saving'
          ? 'Logging...'
          : status === 'saved'
            ? 'Saved'
            : 'I did it'}
      </button>
      {status === 'error' && (
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          Could not log this one. Try again.
        </p>
      )}
      <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
        No details needed. Just a receipt.
      </p>
    </div>
  );
}
