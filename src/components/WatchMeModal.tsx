'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  onClose: () => void;
  onRepLogged?: () => void;
}

type Step = 'setup' | 'countdown' | 'confirm' | 'receipt';

export default function WatchMeModal({ onClose, onRepLogged }: Props) {
  const [step, setStep] = useState<Step>('setup');
  const [target, setTarget] = useState('');
  const [nextMove, setNextMove] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [logging, setLogging] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (step === 'countdown') {
      startTimeRef.current = Date.now();
      setCountdown(5);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current!);
            setStep('confirm');
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  async function logRep() {
    setLogging(true);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000) + 5;
    try {
      await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: 'watch_me',
          trigger_type: 'watch_me',
          duration_seconds: Math.max(elapsed, 5),
          quality: 2,
          reflection_note: [
            target ? `Target: ${target}` : null,
            nextMove ? `Move: ${nextMove}` : null,
          ]
            .filter(Boolean)
            .join(' | ') || null,
        }),
      });
      onRepLogged?.();
    } finally {
      setLogging(false);
      setStep('receipt');
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--surface-border)',
    color: 'var(--text-on-dark)',
  } as const;

  return (
    <div
      className="glass-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && step === 'setup') onClose();
      }}
    >
      <div className="glass-modal-panel max-w-md w-full mx-4 overflow-hidden" role="dialog" aria-modal="true" aria-label="Watch Me — attention redirect">

        {/* Header */}
        <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, var(--cosmic-deepest) 0%, var(--cosmic-purple-gradient) 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-gold font-semibold">
                Attention redirect
              </p>
              <h2 className="text-2xl font-bold mt-1" style={{ color: 'var(--text-on-dark)' }}>Watch me.</h2>
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
            You stop getting run by the loudest stimulus. Re-select the signal.
          </p>
        </div>

        <div className="p-6">

          {/* Setup */}
          {step === 'setup' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="watchme-target" className="block text-xs font-semibold text-brand-gold uppercase tracking-wide">
                  What are you locking onto? (optional)
                </label>
                <input
                  id="watchme-target"
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="a priority, a person, an outcome..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  style={inputStyle}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="watchme-move" className="block text-xs font-semibold text-brand-gold uppercase tracking-wide">
                  One small step toward it
                </label>
                <input
                  id="watchme-move"
                  type="text"
                  value={nextMove}
                  onChange={(e) => setNextMove(e.target.value)}
                  placeholder="Write it in one sentence..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  style={inputStyle}
                />
              </div>

              <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                If I start drifting, then I say &ldquo;Watch me&rdquo; and do the next small step.
              </p>

              <button
                onClick={() => setStep('countdown')}
                className="btn-primary w-full"
              >
                Start — 5 seconds
              </button>
            </div>
          )}

          {/* Countdown */}
          {step === 'countdown' && (
            <div className="text-center space-y-6 py-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 border-brand-gold"
                style={{
                  background: `conic-gradient(#F8D011 ${((5 - countdown) / 5) * 360}deg, rgba(255,255,255,0.06) 0deg)`,
                }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
                  <span className="text-3xl font-bold text-brand-gold">{countdown}</span>
                </div>
              </div>
              <p className="text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                One breath. One anchor. One move.
              </p>
              {target && (
                <p className="text-sm" style={{ color: 'var(--cosmic-purple-light)' }}>
                  Locking onto: <strong>{target}</strong>
                </p>
              )}
            </div>
          )}

          {/* Confirm */}
          {step === 'confirm' && (
            <div className="space-y-5 text-center">
              <div className="text-4xl">&#x1F3AF;</div>
              <div className="space-y-2">
                <p className="text-lg font-bold" style={{ color: 'var(--text-on-dark)' }}>
                  Did you redirect?
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {nextMove
                    ? `Your move was: "${nextMove}"`
                    : 'You chose your signal. Did you take one step toward it?'}
                </p>
              </div>
              <div className="text-xs italic rounded-xl p-3" style={{ background: 'rgba(248, 208, 17, 0.08)', color: 'var(--cosmic-purple-light)' }}>
                Reinforce the rep, not the outcome: &ldquo;I returned. That&apos;s the win.&rdquo;
              </div>
              <button
                onClick={logRep}
                disabled={logging}
                className="btn-primary w-full"
              >
                {logging ? 'Logging...' : 'I moved. Log this rep.'}
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
              <div className="text-4xl">&#x2705;</div>
              <p className="text-lg font-bold" style={{ color: 'var(--text-on-dark)' }}>Logged.</p>
              <p className="text-sm" style={{ color: 'var(--cosmic-purple-light)' }}>
                You showed up. That&apos;s the proof.
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
