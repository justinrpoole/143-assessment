'use client';

import { useState, useEffect } from 'react';

const COOKIE_KEY = '143_email_captured';

function hasCapturedEmail(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes(COOKIE_KEY);
}

function setCapturedCookie() {
  document.cookie = `${COOKIE_KEY}=1; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
}

export default function EmailGate({ children }: { children: React.ReactNode }) {
  const [gated, setGated] = useState(true);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasCapturedEmail()) {
      setGated(false);
      return;
    }
    const timer = setTimeout(() => setCanSkip(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!gated) return <>{children}</>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError("That email doesn't look right — double check it.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'sample_report_gate' }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'capture_failed');
      }
      setCapturedCookie();
      setGated(false);
    } catch {
      // If API fails, still let them through — don't block content for infra issues
      setCapturedCookie();
      setGated(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="glass-card p-6 sm:p-8 my-8 text-center">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
        Your Report Is Ready
      </p>
      <h2 className="mt-3 text-xl font-semibold" style={{ color: 'var(--text-on-dark, #FFFEF5)' }}>
        See the full cosmic visualizations.
      </h2>
      <p className="mt-2 max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
        Enter your email and your sample report opens instantly. We will send
        one follow-up with your results — nothing else unless you ask.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Your email address"
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'var(--surface-glass, rgba(255,255,255,0.06))',
            border: '1px solid var(--surface-border, rgba(255,255,255,0.10))',
            color: 'var(--text-on-dark, #FFFEF5)',
          }}
          disabled={submitting}
        />
        <button type="submit" className="btn-primary shrink-0 w-full sm:w-auto" disabled={submitting}>
          {submitting ? 'Opening...' : 'Show My Report'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-rose-400">{error}</p>
      )}
      {canSkip && (
        <button
          type="button"
          onClick={() => { setCapturedCookie(); setGated(false); }}
          className="mt-4 text-xs transition-colors"
          style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.4))' }}
        >
          Skip for now
        </button>
      )}
    </section>
  );
}
