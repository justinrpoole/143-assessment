'use client';

import { useState } from 'react';
import { rayHex } from '@/lib/ui/ray-colors';

const REFRAME_STEPS = [
  {
    id: 'name',
    label: 'Name It',
    prompt: 'What is the thought or signal pulling at you right now?',
    hint: 'Write it exactly as it sounds in your head. No editing.',
    color: '#A78BFA',
  },
  {
    id: 'eclipse_check',
    label: 'Eclipse Check',
    prompt: 'Is this a real signal — or is eclipse talking?',
    hint: 'Eclipse narrows your attention. When you are under load, your brain scans for threat, not truth. Does this thought reflect what is actually happening, or what exhaustion is predicting?',
    color: 'var(--brand-gold, #F8D011)',
  },
  {
    id: 'capacity',
    label: 'Find the Capacity',
    prompt: 'What capacity would you use if you were not under load?',
    hint: 'If your light were fully online right now — Presence, Power, Authenticity, any Ray — which one would handle this? Name it.',
    color: '#4ade80',
  },
  {
    id: 'one_rep',
    label: 'One Rep',
    prompt: 'What is the smallest action that would prove that capacity is still available?',
    hint: 'Not the big move. The smallest one. A pause, a boundary, a question, a choice. That is the rep.',
    color: '#F8D011',
  },
] as const;

/**
 * Fear Reframe Tool — Interactive Eclipse-model reframe
 *
 * Walks the user through a 4-step process:
 * 1. Name the thought (affect labeling)
 * 2. Eclipse check (is this real or eclipse talking?)
 * 3. Find the capacity (which Ray would handle this?)
 * 4. One rep (smallest action to prove capacity is available)
 *
 * Grounded in the 143 Eclipse model: fear is not a character flaw,
 * it is a temporary coverage state that narrows attention.
 */
export default function FearReframe() {
  const [step, setStep] = useState(-1);
  const [texts, setTexts] = useState(['', '', '', '']);
  const [done, setDone] = useState(false);

  function handleNext() {
    if (!texts[step]?.trim()) return;
    if (step < REFRAME_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  // ── COMPLETED ──
  if (done) {
    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R4') }}>
            Reframe Complete
          </p>
          <button
            type="button"
            onClick={() => { setStep(-1); setTexts(['', '', '', '']); setDone(false); }}
            className="text-xs hover:underline"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            Start over
          </button>
        </div>

        <div className="space-y-3">
          {REFRAME_STEPS.map((rs, i) => (
            <div key={rs.id} className="flex gap-3 items-start">
              <div
                className="mt-1.5 w-1 h-full rounded-full flex-shrink-0"
                style={{ background: rs.color, minHeight: 20 }}
              />
              <div>
                <p className="text-xs font-medium" style={{ color: rs.color }}>{rs.label}</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{texts[i]}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(248, 208, 17, 0.06)', border: '1px solid rgba(248, 208, 17, 0.12)' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
            You named it. You checked it. You found the capacity. Now you have one rep.
            That is the eclipse losing grip — not through force, but through attention.
          </p>
        </div>
      </div>
    );
  }

  // ── STEP FLOW ──
  if (step >= 0 && step < REFRAME_STEPS.length) {
    const rs = REFRAME_STEPS[step];

    return (
      <div className="glass-card p-5 space-y-4">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            {step + 1} of {REFRAME_STEPS.length}
          </p>
          <div className="flex gap-1">
            {REFRAME_STEPS.map((s, i) => (
              <div
                key={s.id}
                className="h-1.5 w-6 rounded-full transition-colors duration-300"
                style={{ backgroundColor: i <= step ? rs.color : 'rgba(255,255,255,0.12)' }}
              />
            ))}
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: rs.color }}>
          {rs.label}
        </p>
        <p className="text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          {rs.prompt}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>
          {rs.hint}
        </p>

        <textarea
          aria-label={rs.prompt}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-on-dark)',
          }}
          rows={3}
          placeholder="Write it here..."
          value={texts[step]}
          onChange={(e) => {
            const updated = [...texts];
            updated[step] = e.target.value;
            setTexts(updated);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleNext();
            }
          }}
          autoFocus
        />

        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-xs"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!texts[step]?.trim()}
            className="btn-primary text-sm py-2 px-5"
          >
            {step < REFRAME_STEPS.length - 1 ? 'Next' : 'Complete'}
          </button>
        </div>
      </div>
    );
  }

  // ── INITIAL ──
  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl" style={{ opacity: 0.8 }}>◑</span>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Fear Reframe</p>
            <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>2 min</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            When a thought is loud, name it, check if eclipse is talking, find the capacity
            that would handle it, and take one rep. Four steps. Two minutes.
          </p>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="btn-primary text-sm py-2 px-5 mt-1"
          >
            Start Reframe
          </button>
        </div>
      </div>
    </div>
  );
}
