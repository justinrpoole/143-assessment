'use client';

/**
 * BetaAccessButton — hero CTA shown on /upgrade when BETA_FREE_MODE=true.
 *
 * Calls /api/auth/beta-login to create a session, then follows the verify_url
 * to set cookies, and finally redirects to /portal.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BetaAccessButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      // Request a magic-link verify URL from the beta-login endpoint.
      const res = await fetch('/api/auth/beta-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass /portal as the post-login destination.
        body: JSON.stringify({ next: '/portal' }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? 'Could not start beta session.');
      }

      const data = (await res.json()) as { verify_url?: string };

      if (!data.verify_url) {
        throw new Error('No verify URL returned from server.');
      }

      // Follow the verify URL — this sets the session cookies and redirects.
      // We navigate the browser there so the auth middleware can run.
      router.push(data.verify_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-block rounded-xl px-8 py-4 text-base font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{
          background: 'var(--brand-gold, #F8D011)',
          color: '#020202',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.03em',
          cursor: loading ? 'wait' : 'pointer',
          border: 'none',
        }}
      >
        {loading ? 'Setting up your access…' : 'Get Full Access — Free During Beta'}
      </button>
      {error && (
        <p className="text-sm" style={{ color: '#E74C3C' }}>
          {error}
        </p>
      )}
    </div>
  );
}
