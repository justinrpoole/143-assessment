'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';

const STEPS = [
  { id: 'sunrise', label: 'Welcome' },
  { id: 'timeline', label: 'Your Path' },
  { id: 'intention', label: 'Set Intention' },
] as const;

type StepId = typeof STEPS[number]['id'];

export default function WelcomeFlowClient() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [currentStep, setCurrentStep] = useState<StepId>('sunrise');
  const [intention, setIntention] = useState('');
  const [saving, setSaving] = useState(false);

  const motionDuration = prefersReduced ? '0ms' : '600ms';

  const next = useCallback(() => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1].id);
    }
  }, [currentStep]);

  const handleBegin = useCallback(async () => {
    setSaving(true);
    try {
      if (intention.trim()) {
        await fetch('/api/portal/intention', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ intention: intention.trim() }),
        }).catch(() => {/* non-critical */});
      }
    } finally {
      router.push('/assessment/setup');
    }
  }, [intention, router]);

  const stepIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: i <= stepIdx ? '24px' : '8px',
                background: i <= stepIdx ? 'var(--brand-gold)' : 'rgba(255,255,255,0.15)',
                transitionDuration: motionDuration,
              }}
            />
          </div>
        ))}
      </div>

      {/* Step content */}
      <div
        className="w-full max-w-md space-y-8"
        style={{
          animation: prefersReduced ? 'none' : 'welcomeFadeIn 600ms ease-out',
        }}
      >
        {currentStep === 'sunrise' && (
          <div className="text-center space-y-6">
            {/* Cosmic sunrise glow */}
            <div
              className="mx-auto h-32 w-32 rounded-full"
              style={{
                background: 'radial-gradient(circle, var(--brand-gold) 0%, rgba(248, 208, 17, 0.3) 40%, transparent 70%)',
                animation: prefersReduced ? 'none' : 'sunrisePulse 3s ease-in-out infinite',
              }}
            />
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                Welcome to your OS.
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                You just invested in the most honest leadership assessment on the market.
                Not a personality test. Not a feel-good quiz. A map of what&apos;s actually happening
                inside your operating system — and what to do about it.
              </p>
            </div>
            <button
              type="button"
              onClick={next}
              className="btn-primary px-8 py-3 text-sm font-semibold"
            >
              Show me the path
            </button>
          </div>
        )}

        {currentStep === 'timeline' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center" style={{ color: 'var(--text-on-dark)' }}>
              Here&apos;s what happens next.
            </h2>

            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: '143 Questions. ~15 minutes.',
                  detail: 'Frequency scales and real-world scenarios. No right answers — only honest ones.',
                },
                {
                  step: '2',
                  title: 'Your Light Signature.',
                  detail: '9 rays mapped. 36 subfacets scored. Your top two strengths and your training edge revealed.',
                },
                {
                  step: '3',
                  title: 'Your 30-Day Plan.',
                  detail: 'Daily micro-reps matched to your bottom ray. Tools, coaching questions, and if/then plans — all personalized.',
                },
                {
                  step: '4',
                  title: 'Track. Retake. Grow.',
                  detail: 'Log reps. Watch your streak build. Retake the assessment to measure real change.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="glass-card p-4 flex items-start gap-4"
                  style={{ borderColor: 'rgba(248, 208, 17, 0.15)' }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: 'rgba(248, 208, 17, 0.15)', color: 'var(--brand-gold)' }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={next}
                className="btn-primary px-8 py-3 text-sm font-semibold"
              >
                Set my intention
              </button>
            </div>
          </div>
        )}

        {currentStep === 'intention' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                One question before you begin.
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                What are you hoping to see more clearly about yourself as a leader?
              </p>
            </div>

            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="I want to understand why I..."
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border p-4 text-sm leading-relaxed resize-none transition-colors"
              style={{
                background: 'rgba(96, 5, 141, 0.25)',
                borderColor: intention ? 'rgba(248, 208, 17, 0.3)' : 'rgba(148, 80, 200, 0.25)',
                color: 'var(--text-on-dark)',
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(248, 208, 17, 0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = intention ? 'rgba(248, 208, 17, 0.3)' : 'rgba(148, 80, 200, 0.25)'; }}
            />

            <div className="flex flex-col gap-3 items-center">
              <button
                type="button"
                onClick={() => void handleBegin()}
                disabled={saving}
                className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? 'Setting up...' : 'Begin Assessment'}
              </button>
              {!intention.trim() && (
                <button
                  type="button"
                  onClick={() => void handleBegin()}
                  disabled={saving}
                  className="text-xs transition-colors disabled:opacity-50"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  Skip for now
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sunrisePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
