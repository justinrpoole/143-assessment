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
        style={{ borderColor: 'rgba(74, 222, 128, 0.3)', boxShadow: '0 0 20px rgba(74, 222, 128, 0.08)' }}
      >
        <p className="text-sm font-semibold" style={{ color: '#4ADE80' }}>
          &#x2713; You&rsquo;re in.
        </p>
        <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
          We&rsquo;ll send you a link to your free assessment when you&rsquo;re ready.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card mx-auto mt-6 max-w-[480px] p-5 sm:p-6 text-center">
      <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
        Not ready yet? Get your free assessment link by email.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="flex-1 rounded-lg border bg-transparent px-3 py-2.5 text-sm outline-none transition-all focus:border-[#F8D011] focus:ring-2 focus:ring-[rgba(248,208,17,0.15)]"
          style={{
            borderColor: 'rgba(148, 80, 200, 0.3)',
            color: 'var(--text-on-dark, #FFFEF5)',
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
        <p className="mt-2 text-xs" style={{ color: '#EF4444' }}>
          Something went wrong. Try again.
        </p>
      )}
      <p className="mt-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
        No spam. One email. Unsubscribe anytime.
      </p>
    </div>
  );
}
