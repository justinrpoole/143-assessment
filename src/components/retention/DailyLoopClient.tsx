'use client';

import { useState, useEffect, useRef } from 'react';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import CelebrationToast from '@/components/ui/CelebrationToast';
import { humanizeError } from '@/lib/ui/error-messages';
import { DAILY_LOOP_SAVED, FIRST_LOOP_EVER, maybeVariableReward, type CelebrationTrigger } from '@/lib/celebrations/triggers';
import { haptic } from '@/lib/haptics';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';

const LOOP_STEPS = [
  {
    id: 'name_it',
    label: 'Name It',
    prompt: "What\u2019s pulling at your attention right now?",
    hint: 'Name the signal. One sentence. That\u2019s all it takes to reduce the charge.',
    science: 'Affect labeling reduces amygdala reactivity.',
    color: '#A78BFA',
  },
  {
    id: 'ground_it',
    label: 'Ground It',
    prompt: "What\u2019s one thing that\u2019s steady right now?",
    hint: 'Shift your attention to what\u2019s working. It doesn\u2019t have to be big.',
    science: 'Gratitude shifts attentional bias toward available resources.',
    color: '#F8D011',
  },
  {
    id: 'move',
    label: 'Move',
    prompt: "What\u2019s the one clear action you\u2019re choosing today?",
    hint: 'Specific and small. Something you can finish.',
    science: 'Implementation intentions double follow-through rates.',
    color: '#2ecc71',
  },
] as const;

interface LoopApiResponse {
  entry_date: string;
  has_loop: boolean;
  name_it: string | null;
  ground_it: string | null;
  move_action: string | null;
  error?: string;
}

export default function DailyLoopClient() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(-1);
  const [texts, setTexts] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);
  const [savedTexts, setSavedTexts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<CelebrationTrigger | null>(null);
  const isFirstLoop = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { enqueue, isOnline } = useOfflineQueue();

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/daily-loop');
        if (!res.ok) return;
        const data = (await res.json()) as LoopApiResponse;
        if (canceled) return;
        if (data.has_loop && data.name_it && data.ground_it && data.move_action) {
          setSaved(true);
          setSavedTexts([data.name_it, data.ground_it, data.move_action]);
          isFirstLoop.current = false;
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  useEffect(() => {
    if (step >= 0) {
      inputRef.current?.focus();
    }
  }, [step]);

  async function saveLoop(finalTexts: string[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/daily-loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_date: new Date().toISOString().slice(0, 10),
          name_it: finalTexts[0],
          ground_it: finalTexts[1],
          move_action: finalTexts[2],
        }),
      });
      const data = (await res.json()) as LoopApiResponse;
      if (!res.ok) {
        setError(data.error ?? 'save_failed');
        return;
      }
      setSaved(true);
      setSavedTexts(finalTexts);
      // Celebration
      const trigger = isFirstLoop.current ? FIRST_LOOP_EVER : (maybeVariableReward() ?? DAILY_LOOP_SAVED);
      setCelebration(trigger);
      if (trigger.haptic) haptic('medium');
      isFirstLoop.current = false;
    } catch (err) {
      // Queue for offline retry if network is down
      if (!navigator.onLine) {
        enqueue('/api/daily-loop', 'POST', {
          entry_date: new Date().toISOString().slice(0, 10),
          name_it: finalTexts[0],
          ground_it: finalTexts[1],
          move_action: finalTexts[2],
        });
        setSaved(true);
        setSavedTexts(finalTexts);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'save_failed');
      }
    } finally {
      setSaving(false);
    }
  }

  function handleNext() {
    const current = texts[step]?.trim();
    if (!current) return;

    if (step < LOOP_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(-1);
      void saveLoop(texts);
    }
  }

  if (loading) {
    return <CosmicSkeleton rows={1} height="h-32" />;
  }

  // ─── COMPLETED STATE ───────────────────────────────────────────────────────
  if (saved && savedTexts.length === 3) {
    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>Today&apos;s Loop</p>
          <span className="gold-tag text-xs">Complete</span>
        </div>

        <div className="gold-rule my-3" />

        <div className="space-y-3">
          {LOOP_STEPS.map((loopStep, i) => (
            <div key={loopStep.id} className="flex gap-3">
              <div
                className="w-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: loopStep.color }}
              />
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>{loopStep.label}</p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>{savedTexts[i]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── STEP FLOW ─────────────────────────────────────────────────────────────
  if (step >= 0 && step < LOOP_STEPS.length) {
    const currentStep = LOOP_STEPS[step];

    return (
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            Step {step + 1} of {LOOP_STEPS.length}
          </p>
          <div className="flex gap-1">
            {LOOP_STEPS.map((s, i) => (
              <div
                key={s.id}
                className="h-1.5 w-6 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: i <= step ? currentStep.color : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        </div>

        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: currentStep.color }}
        >
          {currentStep.label}
        </p>

        <p className="text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          {currentStep.prompt}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-muted)' }}>{currentStep.hint}</p>

        <textarea
          ref={inputRef}
          aria-label={currentStep.prompt}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-on-dark)',
          }}
          rows={2}
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
          <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>{currentStep.science}</p>
          <button
            onClick={handleNext}
            disabled={!texts[step]?.trim() || saving}
            className="btn-primary text-sm py-2 px-5"
          >
            {step < LOOP_STEPS.length - 1 ? 'Next' : saving ? 'Saving...' : 'Done'}
          </button>
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 flex items-center justify-between gap-3" role="alert"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
          >
            <p className="text-xs" style={{ color: '#FCA5A5' }}>{humanizeError(error)}</p>
            <button
              type="button"
              onClick={() => void saveLoop(texts)}
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
    <div className="glass-card glass-card--interactive p-5">
      <div className="flex items-start gap-3">
        <span className="neon-tag text-xs font-bold">DAILY</span>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Daily Loop</p>
            <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>3 min</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Name what&apos;s pulling. Anchor to what&apos;s steady. Choose your one clear action.
          </p>
          <button
            onClick={() => setStep(0)}
            className="btn-primary text-sm py-2 px-5 mt-1"
          >
            Start your loop
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
