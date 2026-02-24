'use client';

import { useCallback, useEffect, useState } from 'react';
import { humanizeError } from '@/lib/ui/error-messages';

type CheckoutMode = 'paid_43' | 'subscription';

interface CheckoutResponse {
  url?: string;
  error?: string;
}

interface InlineCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  /** Where to redirect after successful payment */
  successUrl?: string;
  /** Where to return on cancel */
  cancelUrl?: string;
}

export default function InlineCheckoutModal({
  open,
  onClose,
  successUrl = '/welcome',
  cancelUrl,
}: InlineCheckoutModalProps) {
  const [loading, setLoading] = useState<CheckoutMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const startCheckout = useCallback(async (mode: CheckoutMode) => {
    setLoading(mode);
    setError(null);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          successUrl,
          cancelUrl: cancelUrl ?? window.location.pathname,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as CheckoutResponse;
      if (!response.ok || typeof payload.url !== 'string') {
        setError(payload.error ?? 'checkout_start_failed');
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError('checkout_start_failed');
    } finally {
      setLoading(null);
    }
  }, [successUrl, cancelUrl]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ animation: 'checkoutFadeIn 200ms ease-out' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(2, 2, 2, 0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="relative w-full max-w-md mx-3 rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(96, 5, 141, 0.25) 0%, var(--overlay-heavy) 100%)',
          border: '1px solid rgba(248, 208, 17, 0.2)',
          boxShadow: '0 -8px 40px rgba(248, 208, 17, 0.06), 0 16px 48px rgba(0, 0, 0, 0.6)',
          animation: 'checkoutSlideUp 300ms ease-out',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Unlock your assessment"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-on-dark-muted)' }}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
            Ready for yours?
          </p>
          <h3 className="text-xl font-semibold mt-1" style={{ color: 'var(--text-on-dark)' }}>
            Get your real Light Signature
          </h3>
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            143 questions. 9 rays. 36 subfacets. Your actual data, not a sample.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="px-6 py-4 space-y-3">
          {/* One-time assessment */}
          <button
            onClick={() => void startCheckout('paid_43')}
            disabled={loading !== null}
            className="w-full text-left rounded-xl border p-4 transition-all hover:scale-[1.01]"
            style={{
              background: 'rgba(96, 5, 141, 0.2)',
              borderColor: 'rgba(148, 80, 200, 0.25)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                  Gravitational Stability Report
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Full 143-question run + lifetime report access
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-lg font-bold" style={{ color: 'var(--text-on-dark)' }}>$43</p>
                <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>one-time</p>
              </div>
            </div>
            {loading === 'paid_43' && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
                <span className="text-xs" style={{ color: 'var(--brand-gold)' }}>Opening checkout...</span>
              </div>
            )}
          </button>

          {/* Subscription — highlighted */}
          <button
            onClick={() => void startCheckout('subscription')}
            disabled={loading !== null}
            className="w-full text-left rounded-xl border p-4 transition-all hover:scale-[1.01]"
            style={{
              background: 'rgba(248, 208, 17, 0.08)',
              borderColor: 'rgba(248, 208, 17, 0.3)',
              boxShadow: '0 0 16px rgba(248, 208, 17, 0.06)',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                    Portal Membership
                  </p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(248, 208, 17, 0.15)', color: 'var(--brand-gold)' }}
                  >
                    Best value
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Everything above + unlimited retakes, growth tracking, daily tools
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-lg font-bold" style={{ color: 'var(--brand-gold)' }}>$14.33</p>
                <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>/month</p>
              </div>
            </div>
            {loading === 'subscription' && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
                <span className="text-xs" style={{ color: 'var(--brand-gold)' }}>Opening checkout...</span>
              </div>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="px-6 text-xs text-rose-400" role="alert">
            {humanizeError(error)}
          </p>
        )}

        {/* Trust line */}
        <div className="px-6 pb-5 pt-1">
          <p className="text-[10px] text-center" style={{ color: 'var(--text-on-dark-muted)' }}>
            Secure checkout via Stripe. Cancel anytime.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes checkoutFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes checkoutSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
