'use client';

import { useState } from 'react';

/**
 * EmailCaptureBanner — Lightweight inline email capture that hooks
 * into the existing /api/email-capture endpoint.
 * Appears after the mini-assessment preview for visitors who engage
 * but aren't ready to start the full flow.
 */
export default function EmailCaptureBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage_mini_assessment' }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="glass-card mx-auto mt-6 max-w-[480px] p-5 sm:p-6 text-center"
        style={{ borderColor: 'var(--surface-border)', boxShadow: '0 0 20px var(--surface-border)' }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--text-body)' }}>
          &#x2713; You&rsquo;re in.
        </p>
        <p className="mt-1 text-xs" style={{ color: 'color-mix(in srgb, var(--text-body) 60%, transparent)' }}>
          We&rsquo;ll send you a link to your free assessment when you&rsquo;re ready.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card mx-auto mt-6 max-w-[480px] p-5 sm:p-6 text-center">
      <p className="text-sm font-semibold" style={{ color: 'var(--text-body)' }}>
        Not ready yet? Get your free assessment link by email.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="flex-1 rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-[var(--text-body)] focus:ring-2 focus:ring-[color-mix(in srgb, var(--gold-primary) 25%, transparent)]"
          style={{
            borderColor: 'color-mix(in srgb, var(--stroke-400) 30%, transparent)',
            color: 'var(--text-body)',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary whitespace-nowrap text-sm"
        >
          {status === 'loading' ? 'Sending...' : 'Send Link'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-2 text-xs" style={{ color: 'var(--text-body)' }}>
          Something went wrong. Try again.
        </p>
      )}
      <p className="mt-2 text-xs" style={{ color: 'color-mix(in srgb, var(--text-body) 50%, transparent)' }}>
        No spam. One email. Unsubscribe anytime.
      </p>
    </div>
  );
}
