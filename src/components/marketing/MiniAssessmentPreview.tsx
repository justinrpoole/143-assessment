'use client';

import { useState } from 'react';
import Link from 'next/link';
import FrequencyScale from '@/components/FrequencyScale';

/**
 * 3 sample questions — one from each phase (Reconnect, Radiate, Become).
 * These are actual assessment prompts, giving a real taste of the experience.
 */
const PREVIEW_QUESTIONS = [
  {
    id: 'preview-r2',
    prompt: 'In the last 30 days, how often did you experience genuine moments of joy at work — not relief, not satisfaction, but actual lightness?',
    ray: 'Joy',
    phase: 'Reconnect',
  },
  {
    id: 'preview-r5',
    prompt: 'When a decision felt hard, how often did you check it against what you actually care about — not what looks right, but what matters to you?',
    ray: 'Purpose',
    phase: 'Radiate',
  },
  {
    id: 'preview-r8',
    prompt: 'How often did you catch yourself imagining a better version of a situation — not wishful thinking, but seeing a path that others hadn\'t noticed yet?',
    ray: 'Possibility',
    phase: 'Become',
  },
];

function getTeaser(answers: Record<string, number>): { message: string; detail: string } {
  const values = Object.values(answers);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  if (avg >= 3) {
    return {
      message: 'Strong signal detected.',
      detail: 'Your responses suggest active capacity across multiple rays. The full assessment will show you exactly where your light is strongest — and what\'s temporarily eclipsed.',
    };
  }
  if (avg >= 1.5) {
    return {
      message: 'Interesting pattern.',
      detail: 'You\'re showing range — strong in some areas, with room to grow in others. That\'s where the real insight lives. The full assessment maps all 9 rays and 36 subfacets.',
    };
  }
  return {
    message: 'Honest answers. That\'s the point.',
    detail: 'Lower scores aren\'t bad scores — they\'re training edges. The full assessment will show you exactly which capacity to build first and the specific tool to use.',
  };
}

export default function MiniAssessmentPreview() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === PREVIEW_QUESTIONS.length;
  const teaser = allAnswered ? getTeaser(answers) : null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
          Try It Now
        </p>
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          3 questions. See how it feels.
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          One question from each phase. Answer honestly — first instinct, last 30 days.
        </p>
      </div>

      <div className="space-y-5">
        {PREVIEW_QUESTIONS.map((q) => (
          <div key={q.id} className="glass-card p-5 space-y-3" style={{ borderColor: 'rgba(148, 80, 200, 0.2)' }}>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(248, 208, 17, 0.12)', color: 'var(--brand-gold)' }}
              >
                {q.phase}
              </span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
                {q.ray}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
              {q.prompt}
            </p>
            <FrequencyScale
              itemId={q.id}
              value={answers[q.id] ?? null}
              onSelect={(id, val) => setAnswers((prev) => ({ ...prev, [id]: val }))}
            />
          </div>
        ))}
      </div>

      {/* Teaser result */}
      {allAnswered && teaser && (
        <div
          className="glass-card p-6 text-center space-y-4"
          style={{
            borderColor: 'rgba(248, 208, 17, 0.3)',
            animation: 'welcomeFadeIn 500ms ease-out',
          }}
        >
          <p className="text-lg font-semibold" style={{ color: 'var(--brand-gold)' }}>
            {teaser.message}
          </p>
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {teaser.detail}
          </p>
          <Link
            href="/upgrade-your-os"
            className="btn-primary inline-block px-8 py-3 text-sm font-semibold"
          >
            Get Your Full Light Signature
          </Link>
          <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
            143 questions &middot; ~15 minutes &middot; 9 rays &middot; 36 subfacets
          </p>
        </div>
      )}

      {/* Progress hint */}
      {!allAnswered && answeredCount > 0 && (
        <p className="text-center text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          {PREVIEW_QUESTIONS.length - answeredCount} more to see your preview...
        </p>
      )}

      <style>{`
        @keyframes welcomeFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
