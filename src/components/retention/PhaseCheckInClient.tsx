'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import CosmicSkeleton from '@/components/ui/CosmicSkeleton';
import { humanizeError } from '@/lib/ui/error-messages';
import { rayHex } from '@/lib/ui/ray-colors';
import {
  PHASE_CHECKIN_QUESTIONS,
  PHASE_GUIDANCE,
  detectPhase,
  type DetectedPhase,
  type PhaseGuidance,
} from '@/lib/retention/phase-checkin';

interface CheckInResult {
  totalScore: number;
  detectedPhase: DetectedPhase;
  guidance: PhaseGuidance;
}

interface ApiResponse {
  entry_date: string;
  has_checkin: boolean;
  total_score: number | null;
  detected_phase: string | null;
  scores: number[] | null;
  guidance: PhaseGuidance | null;
  error?: string;
}

const PHASE_GLOW: Record<string, string> = {
  orbit: '0 0 20px rgba(34, 197, 94, 0.15)',
  gravity_shift: '0 0 20px rgba(234, 179, 8, 0.15)',
  eclipse_onset: '0 0 20px rgba(249, 115, 22, 0.15)',
  full_eclipse: '0 0 20px rgba(239, 68, 68, 0.15)',
};

const RAS_PHASE_NOTES: Record<string, string> = {
  orbit: 'Your RAS has capacity for growth reps. This is where real rewiring happens.',
  gravity_shift: 'Your RAS is managing increased load. Stay intentional about where you direct attention.',
  eclipse_onset: 'Your RAS is in protection mode. Simplify inputs. Focus on recovery tools.',
  full_eclipse: 'Your RAS is overwhelmed. Recovery is the rep today. Rest rebuilds capacity.',
};

export default function PhaseCheckInClient() {
  useReducedMotion(); // ensures Framer Motion respects prefers-reduced-motion
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCheckin = useCallback(async () => {
    try {
      const res = await fetch('/api/phase-checkin');
      if (!res.ok) return;
      const data = (await res.json()) as ApiResponse;
      if (data.has_checkin && data.detected_phase && data.guidance) {
        setResult({
          totalScore: data.total_score ?? 0,
          detectedPhase: data.detected_phase as DetectedPhase,
          guidance: data.guidance,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCheckin();
  }, [loadCheckin]);

  async function saveCheckin(finalAnswers: number[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/phase-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_date: new Date().toISOString().slice(0, 10),
          answers: finalAnswers,
        }),
      });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok) {
        setError(data.error ?? 'save_failed');
        return;
      }
      if (data.detected_phase && data.guidance) {
        setResult({
          totalScore: data.total_score ?? 0,
          detectedPhase: data.detected_phase as DetectedPhase,
          guidance: data.guidance,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save_failed');
    } finally {
      setSaving(false);
    }
  }

  function handleAnswer(questionIndex: number, score: number) {
    const updated = [...answers];
    updated[questionIndex] = score;
    setAnswers(updated);

    if (questionIndex < PHASE_CHECKIN_QUESTIONS.length - 1) {
      setTimeout(() => setStep(questionIndex + 1), 200);
    } else {
      const totalScore = updated.reduce<number>((sum, s) => sum + (s ?? 0), 0);
      const phase = detectPhase(totalScore);
      const guidance = PHASE_GUIDANCE[phase];
      setResult({ totalScore, detectedPhase: phase, guidance });
      setStep(-1);
      void saveCheckin(updated as number[]);
    }
  }

  if (loading) {
    return <CosmicSkeleton rows={1} height="h-24" />;
  }

  // ─── RESULT STATE ──────────────────────────────────────────────────────────
  if (result) {
    const glow = PHASE_GLOW[result.detectedPhase] ?? '';
    const rasNote = RAS_PHASE_NOTES[result.detectedPhase] ?? '';

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 space-y-3"
        style={{
          borderColor: result.guidance.color + '44',
          boxShadow: glow,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: result.guidance.color }}
            />
            <p className="text-sm font-semibold" style={{ color: result.guidance.color }}>
              {result.guidance.label}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Today&apos;s signal
          </p>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {result.guidance.message}
        </p>

        <div className="glass-card p-3" style={{ borderColor: 'rgba(96, 5, 141, 0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Your rep focus
          </p>
          <p className="text-sm" style={{ color: 'var(--text-on-dark)' }}>
            {result.guidance.repFocus}
          </p>
        </div>

        {/* RAS insight */}
        {rasNote && (
          <div className="flex items-start gap-2 pt-1">
            <span className="text-sm">🧠</span>
            <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
              {rasNote}
            </p>
          </div>
        )}

        <Link
          href="/reps"
          className="text-xs font-medium underline underline-offset-2"
          style={{ color: result.guidance.color }}
        >
          Log this rep →
        </Link>
      </motion.div>
    );
  }

  // ─── QUESTION FLOW ─────────────────────────────────────────────────────────
  if (step >= 0 && step < PHASE_CHECKIN_QUESTIONS.length) {
    const question = PHASE_CHECKIN_QUESTIONS[step];

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="glass-card p-5 space-y-4"
        >
          {/* Progress */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
              {step + 1} of {PHASE_CHECKIN_QUESTIONS.length}
            </p>
            <div className="flex gap-1">
              {PHASE_CHECKIN_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-6 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: i <= step ? '#60058D' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <p className="text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            {question.prompt}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, optIndex) => {
              const isSelected = answers[step] === option.score;
              return (
                <button
                  key={optIndex}
                  type="button"
                  onClick={() => handleAnswer(step, option.score)}
                  disabled={saving}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                    isSelected ? 'shadow-[0_0_12px_rgba(96,5,141,0.3)]' : ''
                  }`}
                  style={{
                    background: isSelected ? 'rgba(96, 5, 141, 0.2)' : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? '#60058D' : 'var(--surface-border)',
                    color: isSelected ? 'var(--text-on-dark)' : 'var(--text-on-dark-secondary)',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="text-xs"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              ← Back
            </button>
          )}

          {error && (
            <div className="rounded-lg px-3 py-2"
              style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
              <p className="text-xs" style={{ color: '#FCA5A5' }} role="alert">{humanizeError(error)}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── INITIAL STATE ─────────────────────────────────────────────────────────
  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">◎</span>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>Read your signal</p>
            <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>30 sec</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Three questions. Name where you are today. Your RAS guidance adjusts from there.
          </p>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="btn-primary text-sm py-2 px-5 mt-1"
          >
            Check in
          </button>
        </div>
      </div>
    </div>
  );
}
