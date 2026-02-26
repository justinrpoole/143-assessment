'use client';

import { useState, useCallback } from 'react';
import { trackEventClient } from '@/lib/events';

interface Props {
  questions: string[];
  runId?: string;
}

interface ReflectionState {
  text: string;
  saved: boolean;
  saving: boolean;
}

export default function CoachingQuestions({ questions, runId }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [reflections, setReflections] = useState<Record<number, ReflectionState>>({});

  const saveReflection = useCallback(async (idx: number) => {
    const ref = reflections[idx];
    if (!ref || !ref.text.trim() || ref.saving) return;

    setReflections((prev) => ({ ...prev, [idx]: { ...prev[idx], saving: true } }));

    try {
      await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[idx],
          reflection: ref.text.trim(),
          run_id: runId ?? null,
          source: 'coaching_question',
        }),
      });

      setReflections((prev) => ({
        ...prev,
        [idx]: { ...prev[idx], saved: true, saving: false },
      }));

      trackEventClient('coaching_question_reflected', {
        question_index: idx,
        run_id: runId ?? null,
      });
    } catch {
      setReflections((prev) => ({
        ...prev,
        [idx]: { ...prev[idx], saving: false },
      }));
    }
  }, [reflections, questions, runId]);

  if (!questions || questions.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Shooting Star Cues
        </p>
        <h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Shooting Star Cues</h3>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Questions that light the next move. The first one is open — start there. No rush. No right answer. Just honest reflection.
        </p>
      </div>

      <div className="space-y-3">
        {questions.slice(0, 5).map((q, i) => {
          const isExpanded = expandedIdx === i;
          const ref = reflections[i];
          const hasSaved = ref?.saved;

          return (
            <div
              key={i}
              className="glass-card overflow-hidden transition-all"
              style={{
                borderColor: hasSaved
                  ? 'rgba(248, 208, 17, 0.25)'
                  : 'rgba(148, 80, 200, 0.2)',
              }}
            >
              {/* Question — always visible, clickable */}
              <button
                type="button"
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className="w-full text-left p-5 flex items-start gap-3"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: hasSaved ? 'rgba(248, 208, 17, 0.2)' : 'rgba(148, 80, 200, 0.3)',
                    color: hasSaved ? 'var(--brand-gold)' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {hasSaved ? '\u2713' : i + 1}
                </span>
                <p className="text-sm italic leading-relaxed flex-1" style={{ color: 'var(--text-on-dark)' }}>
                  &ldquo;{q}&rdquo;
                </p>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="shrink-0 mt-0.5 transition-transform"
                  style={{
                    color: 'var(--text-on-dark-muted)',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Reflection area — expandable */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-3">
                  {hasSaved ? (
                    <div className="rounded-xl p-4" style={{ background: 'rgba(248, 208, 17, 0.08)' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--brand-gold)' }}>
                        Your reflection
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        {ref.text}
                      </p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={ref?.text ?? ''}
                        onChange={(e) =>
                          setReflections((prev) => ({
                            ...prev,
                            [i]: { text: e.target.value, saved: false, saving: false },
                          }))
                        }
                        placeholder="Write what comes up..."
                        rows={3}
                        maxLength={1000}
                        className="w-full rounded-xl border p-4 text-sm leading-relaxed resize-none"
                        style={{
                          background: 'rgba(96, 5, 141, 0.2)',
                          borderColor: 'rgba(148, 80, 200, 0.2)',
                          color: 'var(--text-on-dark)',
                          outline: 'none',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(248, 208, 17, 0.4)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(148, 80, 200, 0.2)'; }}
                      />
                      {ref?.text?.trim() && (
                        <button
                          type="button"
                          onClick={() => void saveReflection(i)}
                          disabled={ref.saving}
                          className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                          style={{
                            background: 'rgba(248, 208, 17, 0.15)',
                            color: 'var(--brand-gold)',
                            border: '1px solid rgba(248, 208, 17, 0.25)',
                          }}
                        >
                          {ref.saving ? 'Saving...' : 'Save reflection'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
