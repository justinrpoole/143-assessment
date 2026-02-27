'use client';

import { useState, useEffect, useRef } from 'react';
import { DEFAULT_GO_FIRST_PROMPTS, GO_FIRST_PROMPTS_BY_RAY } from '@/lib/retention/rep-prompts';

interface Props {
  onClose: () => void;
  onRepLogged?: () => void;
  bottomRayId?: string | null;
  bottomRayName?: string | null;
  initialAction?: string | null;
}

type Step = 'setup' | 'go' | 'receipt';

export default function GoFirstModal({
  onClose,
  onRepLogged,
  bottomRayId,
  bottomRayName,
  initialAction,
}: Props) {
  const [step, setStep] = useState<Step>('setup');
  const [smallestAction, setSmallestAction] = useState('');
  const [logging, setLogging] = useState(false);
  const [startedAt] = useState(Date.now());
  const [countdown, setCountdown] = useState(60);
  const prefilledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  async function logRep() {
    setLogging(true);
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    try {
      await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: 'go_first',
          trigger_type: 'go_first',
          duration_seconds: Math.max(elapsed, 10),
          quality: 2,
          reflection_note: smallestAction
            ? `First move: ${smallestAction}`
            : null,
        }),
      });
      onRepLogged?.();
    } finally {
      setLogging(false);
      setStep('receipt');
    }
  }

  useEffect(() => {
    if (prefilledRef.current) return;
    if (initialAction) {
      setSmallestAction(initialAction);
      prefilledRef.current = true;
    }
  }, [initialAction]);

  useEffect(() => {
    if (step === 'go') {
      setCountdown(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step]);

  const quickPrompts = bottomRayId && GO_FIRST_PROMPTS_BY_RAY[bottomRayId]
    ? GO_FIRST_PROMPTS_BY_RAY[bottomRayId]
    : DEFAULT_GO_FIRST_PROMPTS;

  return (
    <div
      className="glass-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && step === 'setup') onClose();
      }}
    >
      <div className="glass-modal-panel max-w-md w-full mx-4 overflow-hidden" role="dialog" aria-modal="true" aria-label="Go First — action activation">

        {/* Header */}
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, var(--cosmic-deepest) 0%, var(--cosmic-purple-gradient) 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
                Action activation
              </p>
              <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-on-dark)' }}>Go first.</h2>
            </div>
            {step === 'setup' && (
              <button
                onClick={onClose}
                className="hover:text-white text-2xl leading-none"
                style={{ color: 'var(--text-on-dark-muted)' }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
            You do the first rep before you feel ready. Starting is the skill.
          </p>
        </div>

        <div className="p-6">

          {/* Setup */}
          {step === 'setup' && (
            <div className="space-y-5">
              {bottomRayName && (
                <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                  Training: {bottomRayName}
                </div>
              )}

              <div className="rounded-xl p-4 space-y-1" style={{ background: 'rgba(248, 208, 17, 0.08)' }}>
                <p className="text-xs font-semibold text-brand-gold uppercase tracking-wide">
                  The science
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Execution begins with initiation — not confidence. Your prefrontal cortex activates
                  through action. Waiting to feel ready is the trap.
                </p>
              </div>

              <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
                  Quick prompts
                </p>
                <div className="grid gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => setSmallestAction(prompt.action)}
                      className="text-left rounded-lg px-3 py-2 transition-all hover:scale-[1.01]"
                      style={{ border: '1px solid var(--surface-border)', background: 'rgba(2, 2, 2, 0.35)', color: 'var(--text-on-dark)' }}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                        {prompt.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        {prompt.action}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
                  Tap one to fill the field below.
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="go-first-action" className="block text-xs font-semibold text-brand-gold uppercase tracking-wide">
                  What&apos;s your smallest possible next action?
                </label>
                <p className="text-xs mb-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                  30–120 seconds. One thing. Name it, then do it.
                </p>
                <input
                  id="go-first-action"
                  type="text"
                  value={smallestAction}
                  onChange={(e) => setSmallestAction(e.target.value)}
                  placeholder="Open the doc / send the message / make the call..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-on-dark)',
                  }}
                  autoFocus
                />
              </div>

              <button
                onClick={() => setStep('go')}
                className="btn-primary w-full text-lg py-3"
              >
                Go now
              </button>
            </div>
          )}

          {/* Go */}
          {step === 'go' && (
            <div className="text-center space-y-6 py-2">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-brand-gold"
                style={{
                  background: `conic-gradient(#F8D011 ${((60 - countdown) / 60) * 360}deg, rgba(255,255,255,0.06) 0deg)`,
                }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
                  <span className="text-2xl font-bold text-brand-gold">{countdown}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
                  Do it right now.
                </p>
                {smallestAction && (
                  <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(248, 208, 17, 0.10)' }}>
                    <p className="text-sm font-medium text-brand-gold">
                      &ldquo;{smallestAction}&rdquo;
                    </p>
                  </div>
                )}
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  Immediately. Then come back and confirm.
                </p>
              </div>
              <p className="text-xs italic" style={{ color: 'var(--cosmic-purple-light)' }}>
                &ldquo;Starting is power.&rdquo;
              </p>
              <button
                onClick={logRep}
                disabled={logging}
                className="btn-primary w-full"
              >
                {logging ? 'Logging...' : 'I started. Log this rep.'}
              </button>
              <button
                onClick={onClose}
                className="text-xs hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-on-dark-muted)' }}
              >
                Skip logging
              </button>
            </div>
          )}

          {/* Receipt */}
          {step === 'receipt' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">&#x1F680;</div>
              <p className="text-lg font-bold" style={{ color: 'var(--text-on-dark)' }}>Logged.</p>
              <p className="text-sm" style={{ color: 'var(--cosmic-purple-light)' }}>
                You went first. That&apos;s the hardest part — and you already did it.
              </p>
              <button onClick={onClose} className="btn-primary w-full">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
