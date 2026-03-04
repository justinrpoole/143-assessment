'use client';

import { useState, useCallback } from 'react';
import MiniAssessmentPreview from './MiniAssessmentPreview';
import LightCheckResultPanel from './LightCheckResultPanel';
import { useLightCheckAnalytics } from '@/hooks/useLightCheckAnalytics';

export default function LightCheckOrchestrator() {
  const { startPreview, completePreview } = useLightCheckAnalytics();
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, number> | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFirstAnswer = useCallback(() => {
    startPreview();
  }, [startPreview]);

  const handleComplete = useCallback(
    (answers: Record<string, number>) => {
      setCompletedAnswers(answers);
      completePreview();
    },
    [completePreview],
  );

  async function unlockCheck() {
    setSubmitting(true);
    try {
      const response = await fetch('/api/email/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, tag: 'free-stability-check' }),
      });
      if (!response.ok) throw new Error('capture_failed');
      setGateOpen(true);
    } catch {
      // stay gated; user can retry
    } finally {
      setSubmitting(false);
    }
  }

  if (!gateOpen) {
    return (
      <section className="glass-card p-6 sm:p-8 max-w-[720px] mx-auto space-y-4 card-border-gold-soft">
        <p className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--gold-primary)' }}>Start free stability check</p>
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-body)' }}>
          Enter your name and email to unlock your 3-question check.
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--gold-primary) 25%, transparent)', background: 'color-mix(in srgb, var(--ink-950) 30%, transparent)', color: 'var(--text-body)' }} />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: 'color-mix(in srgb, var(--gold-primary) 25%, transparent)', background: 'color-mix(in srgb, var(--ink-950) 30%, transparent)', color: 'var(--text-body)' }} />
        </div>
        <button type="button" onClick={() => void unlockCheck()} disabled={submitting || !name.trim() || !email.trim()} className="rounded-xl px-5 py-3 text-sm font-bold" style={{ background: 'var(--gold-primary)', color: 'var(--ink-950)', opacity: submitting ? 0.8 : 1 }}>
          {submitting ? 'Unlocking…' : 'Unlock Free Stability Check'}
        </button>
      </section>
    );
  }

  return (
    <>
      <MiniAssessmentPreview mode="light-check" onFirstAnswer={handleFirstAnswer} onComplete={handleComplete} />
      <LightCheckResultPanel answers={completedAnswers ?? {}} visible={completedAnswers !== null} />
    </>
  );
}
