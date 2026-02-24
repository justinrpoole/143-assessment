'use client';

import { useState, useRef, useEffect } from 'react';
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

/* ── Result copy by mode ──────────────────────────────────── */

interface TeaserResult {
  message: string;
  detail: string;
  bridge?: string;
}

function getTeaser(
  answers: Record<string, number>,
  mode: 'teaser' | 'light-check',
): TeaserResult {
  const values = Object.values(answers);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  if (mode === 'teaser') {
    if (avg >= 3) {
      return {
        message: 'Strong signal detected.',
        detail:
          'Your responses suggest active capacity across multiple rays. The full assessment will show you exactly where your light is strongest — and what is temporarily eclipsed.',
      };
    }
    if (avg >= 1.5) {
      return {
        message: 'Interesting pattern.',
        detail:
          'You are showing range — strong in some areas, with room to grow in others. That is where the real insight lives. The full assessment maps all 9 rays and 36 subfacets.',
      };
    }
    return {
      message: 'Honest answers. That is the point.',
      detail:
        'Lower scores are not bad scores — they are training edges. The full assessment will show you exactly which capacity to build first and the specific tool to use.',
    };
  }

  /* light-check mode — coaching debrief voice */
  const bridge =
    'That was 3 questions from 3 of your 9 rays. The full assessment maps all 9 and 36 subfacets — your complete Light Signature, Eclipse Snapshot, and specific tools to restore what is covered.';

  if (avg >= 3) {
    return {
      message: 'Your light is running strong.',
      detail:
        'Your Joy, Purpose, and Possibility responses suggest active capacity across all three phases. This is what it looks like when your operating system is online.',
      bridge,
    };
  }
  if (avg >= 1.5) {
    return {
      message: 'There is a pattern here worth seeing.',
      detail:
        'Strong in some areas, quieter in others. That is not a problem — that is information. The gap between your highest and lowest response is where the real insight lives.',
      bridge,
    };
  }
  return {
    message: 'Honest answers. That is where every upgrade starts.',
    detail:
      'Lower scores are not bad scores. They are training edges — places where capacity is temporarily covered, not gone.',
    bridge,
  };
}

/* ── Component ────────────────────────────────────────────── */

interface MiniAssessmentPreviewProps {
  /** 'teaser' = homepage (links to /preview). 'light-check' = /preview page (links to /upgrade). */
  mode?: 'teaser' | 'light-check';
  /** Fires on the first question answered. */
  onFirstAnswer?: () => void;
  /** Fires when all 3 questions are answered. */
  onComplete?: (answers: Record<string, number>) => void;
}

export default function MiniAssessmentPreview({
  mode = 'teaser',
  onFirstAnswer,
  onComplete,
}: MiniAssessmentPreviewProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const hasFiredFirst = useRef(false);
  const hasFiredComplete = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === PREVIEW_QUESTIONS.length;
  const teaser = allAnswered ? getTeaser(answers, mode) : null;

  const isLightCheck = mode === 'light-check';

  /* Fire callbacks */
  useEffect(() => {
    if (answeredCount >= 1 && !hasFiredFirst.current) {
      hasFiredFirst.current = true;
      onFirstAnswer?.();
    }
  }, [answeredCount, onFirstAnswer]);

  useEffect(() => {
    if (allAnswered && !hasFiredComplete.current) {
      hasFiredComplete.current = true;
      onComplete?.(answers);
    }
  }, [allAnswered, answers, onComplete]);

  /* CTA targets by mode */
  const primaryHref = isLightCheck ? '/upgrade' : '/preview';
  const primaryLabel = isLightCheck ? 'See All 9 Rays — $43' : 'Get Your Full Light Signature';

  return (
    <div className="space-y-6">
      {/* Header — changes by mode */}
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
          {isLightCheck ? 'Light Check' : 'Try It Now'}
        </p>
        <h3 className="text-xl font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          {isLightCheck
            ? '3 questions. See where your light is strongest.'
            : '3 questions. See how it feels.'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
          {isLightCheck
            ? 'Answer from your gut. First instinct, last 30 days. There are no wrong answers — only honest ones.'
            : 'One question from each phase. Answer honestly — first instinct, last 30 days.'}
        </p>
      </div>

      {/* Questions */}
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

      {/* Result panel */}
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

          {/* Bridge line — light-check only */}
          {teaser.bridge && (
            <p
              className="text-sm leading-relaxed max-w-lg mx-auto pt-2"
              style={{ color: 'var(--text-on-dark-secondary)', opacity: 0.85 }}
            >
              {teaser.bridge}
            </p>
          )}

          {/* CTAs */}
          <div className={isLightCheck ? 'flex flex-col sm:flex-row items-center justify-center gap-3 pt-2' : ''}>
            <Link
              href={primaryHref}
              className="btn-primary inline-block px-8 py-3 text-sm font-semibold"
            >
              {primaryLabel}
            </Link>
            {isLightCheck && (
              <Link
                href="/143"
                className="inline-block px-8 py-3 text-sm font-semibold rounded-lg"
                style={{
                  border: '1px solid var(--brand-gold, #F8D011)',
                  color: 'var(--brand-gold, #F8D011)',
                }}
              >
                Start the 143 Challenge — Free
              </Link>
            )}
          </div>

          {!isLightCheck && (
            <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
              143 questions &middot; ~15 minutes &middot; 9 rays &middot; 36 subfacets
            </p>
          )}
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
