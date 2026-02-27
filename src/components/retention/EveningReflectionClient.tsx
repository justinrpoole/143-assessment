'use client';

import { useState, useEffect, useRef } from 'react';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import CelebrationToast from '@/components/ui/CelebrationToast';
import { humanizeError } from '@/lib/ui/error-messages';
import { REFLECTION_SAVED, maybeVariableReward, type CelebrationTrigger } from '@/lib/celebrations/triggers';
import { haptic } from '@/lib/haptics';

const REFLECTION_STEPS = [
  {
    id: 'what_happened',
    label: 'Notice',
    prompt: 'What happened today that mattered?',
    hint: 'One moment. One interaction. One thing that landed.',
  },
  {
    id: 'what_i_did',
    label: 'Own It',
    prompt: 'What did you do about it?',
    hint: 'The rep you ran, the tool you used, the choice you made. Even a pause counts.',
  },
  {
    id: 'what_next',
    label: 'Next',
    prompt: 'What will you try differently tomorrow?',
    hint: 'One small adjustment. Specific enough that you will recognize it when the moment arrives.',
  },
] as const;

/**
 * Optional post-save prompts that deepen the reflection without
 * adding friction to the core 3-step flow. Shown after save completes.
 * Signal/Noise = attentional filter check. RAS Notice = evidence of priming.
 */
const POST_SAVE_PROMPTS = [
  {
    id: 'signal_noise',
    label: 'Signal vs Noise',
    prompt: 'What signal did you follow today? What noise did you let pass?',
  },
  {
    id: 'ras_notice',
    label: 'RAS Notice',
    prompt: 'What did your RAS notice today that it would have missed last month?',
  },
] as const;

const QUALITY_LABELS = ['—', 'Surface', 'Specific', 'Actionable'];

interface ReflectionResponse {
  entry_date: string;
  has_reflection: boolean;
  what_happened: string | null;
  what_i_did: string | null;
  what_next: string | null;
  quality_score: number | null;
  error?: string;
}

export default function EveningReflectionClient() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(-1);
  const [texts, setTexts] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);
  const [savedTexts, setSavedTexts] = useState<string[]>([]);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<CelebrationTrigger | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/evening-reflection');
        if (!res.ok) return;
        const data = (await res.json()) as ReflectionResponse;
        if (canceled) return;
        if (data.has_reflection && data.what_happened && data.what_i_did && data.what_next) {
          setSaved(true);
          setSavedTexts([data.what_happened, data.what_i_did, data.what_next]);
          setQualityScore(data.quality_score);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  useEffect(() => {
    if (step >= 0) inputRef.current?.focus();
  }, [step]);

  async function saveReflection(finalTexts: string[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/evening-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_date: new Date().toISOString().slice(0, 10),
          what_happened: finalTexts[0],
          what_i_did: finalTexts[1],
          what_next: finalTexts[2],
        }),
      });
      const data = (await res.json()) as ReflectionResponse;
      if (!res.ok) {
        setError(data.error ?? 'save_failed');
        return;
      }
      setSaved(true);
      setSavedTexts(finalTexts);
      setQualityScore(data.quality_score ?? null);
      // Celebration
      const trigger = maybeVariableReward() ?? REFLECTION_SAVED;
      setCelebration(trigger);
      if (trigger.haptic) haptic('medium');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save_failed');
    } finally {
      setSaving(false);
    }
  }

  function handleNext() {
    const current = texts[step]?.trim();
    if (!current) return;
    if (step < REFLECTION_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(-1);
      void saveReflection(texts);
    }
  }

  if (loading) {
    return <CosmicSkeleton rows={1} height="h-32" />;
  }

  // ─── COMPLETED ─────────────────────────────────────────────────────────────
  if (saved && savedTexts.length === 3) {
    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Evening Reflection</p>
          <div className="flex items-center gap-2">
            {qualityScore !== null && qualityScore > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(248, 208, 17, 0.15)', color: 'var(--brand-gold)' }}>
                {QUALITY_LABELS[qualityScore] ?? ''}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-medium">Done</span>
          </div>
        </div>

        <div className="space-y-3">
          {REFLECTION_STEPS.map((rs, i) => (
            <div key={rs.id} className="flex gap-3">
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: 'var(--brand-purple)' }} />
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>{rs.label}</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{savedTexts[i]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Post-save deepening prompts */}
        <div className="pt-3 space-y-3" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            Go deeper (optional)
          </p>
          {POST_SAVE_PROMPTS.map((ps) => (
            <div key={ps.id} className="rounded-xl p-3" style={{ background: 'rgba(248, 208, 17, 0.04)', border: '1px solid rgba(248, 208, 17, 0.08)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--brand-gold)' }}>{ps.label}</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{ps.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── STEP FLOW ─────────────────────────────────────────────────────────────
  if (step >= 0 && step < REFLECTION_STEPS.length) {
    const rs = REFLECTION_STEPS[step];

    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            {step + 1} of {REFLECTION_STEPS.length}
          </p>
          <div className="flex gap-1">
            {REFLECTION_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-6 rounded-full transition-colors duration-300"
                style={{ backgroundColor: i <= step ? 'var(--brand-gold)' : 'rgba(255,255,255,0.12)' }}
              />
            ))}
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
          {rs.label}
        </p>
        <p className="text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>{rs.prompt}</p>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>{rs.hint}</p>

        <textarea
          ref={inputRef}
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
        />

        <div className="flex items-center justify-between">
          <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
            Reflection converts experience into learning.
          </p>
          <button
            onClick={handleNext}
            disabled={!texts[step]?.trim() || saving}
            className="btn-primary text-sm py-2 px-5"
          >
            {step < REFLECTION_STEPS.length - 1 ? 'Next' : saving ? 'Saving...' : 'Done'}
          </button>
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 flex items-center justify-between gap-3" role="alert"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
            <p className="text-xs" style={{ color: '#FCA5A5' }}>{humanizeError(error)}</p>
            <button
              type="button"
              onClick={() => void saveReflection(texts)}
              disabled={saving}
              className="btn-primary text-xs py-1.5 px-4 flex-shrink-0"
            >
              {saving ? 'Retrying\u2026' : 'Try Again'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── INITIAL STATE ─────────────────────────────────────────────────────────
  return (
    <>
    <CelebrationToast
      message={celebration?.message ?? ''}
      show={!!celebration}
      duration={celebration?.duration ?? 2500}
      onDone={() => setCelebration(null)}
    />
    <div className="glass-card p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">◐</span>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Evening Reflection</p>
            <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>3 min</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Close the day. Name what happened, what you did about it, and what you will try next.
          </p>
          <button
            onClick={() => setStep(0)}
            className="btn-primary text-sm py-2 px-5 mt-1"
          >
            Reflect
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
