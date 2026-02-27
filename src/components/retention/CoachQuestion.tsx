'use client';

import { useState, useMemo } from 'react';
import { rayHex } from '@/lib/ui/ray-colors';

/**
 * Coaching questions per Ray, drawn from ray_pairs.json and
 * the 143 coaching methodology. 3 questions per Ray, rotated
 * daily using a date-based seed. Designed for 30 seconds of
 * reflection, not journaling.
 */
const RAY_QUESTIONS: Record<string, string[]> = {
  R1: [
    'What is the one thing that matters most today — and does your calendar reflect it?',
    'Where did I let a reactive demand override a proactive choice?',
    'If I could only complete one task today, which one moves me forward?',
  ],
  R2: [
    'What moment today gave me energy — not from achievement, but from something quieter?',
    'When was the last time I created joy on purpose instead of waiting for it?',
    'What would I do differently today if I knew pressure was not required?',
  ],
  R3: [
    'When did I notice my body was braced today — and what did I do about it?',
    'Was I present in the conversation that mattered most, or was I rehearsing my next point?',
    'What would this moment look like if I were regulated, not just performing calm?',
  ],
  R4: [
    'Where did I act before I felt ready today — and what happened?',
    'What am I avoiding that I know I need to do?',
    'Where is my confidence consistent, and where does it disappear?',
  ],
  R5: [
    'Does my calendar this week match what I say matters most?',
    'What gap exists between what I value and where I spend my time?',
    'If someone watched my day, would they know what I stand for?',
  ],
  R6: [
    'Was I the same person in every room today?',
    'Where did I edit myself to fit, and what did that cost?',
    'What would I say if I knew the relationship could handle the truth?',
  ],
  R7: [
    'Did someone feel safe enough to be honest with me today?',
    'Where did I listen to respond instead of listening to understand?',
    'What would change if the people around me felt my stability, not my stress?',
  ],
  R8: [
    'Where did I see a wall today — and was there an option I missed?',
    'What assumption am I holding that might not be true?',
    'If I let go of the way it has always been done, what opens up?',
  ],
  R9: [
    'Did my presence lower the noise in a room today, or add to it?',
    'What standard did I hold that made it easier for someone else to hold theirs?',
    'Where did I model what I want to see, instead of just saying it?',
  ],
};

const RAY_NAMES: Record<string, string> = {
  R1: 'Intention', R2: 'Joy', R3: 'Presence', R4: 'Power', R5: 'Purpose',
  R6: 'Authenticity', R7: 'Connection', R8: 'Possibility', R9: 'Be The Light',
};

function getDailyQuestion(rayId: string): { question: string; rayName: string } {
  const questions = RAY_QUESTIONS[rayId] ?? RAY_QUESTIONS.R1;
  const rayName = RAY_NAMES[rayId] ?? 'Intention';
  // Date-seeded rotation: same question all day, changes daily
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % questions.length;
  return { question: questions[index], rayName };
}

interface Props {
  /** The Ray to pull the question from (defaults to R1 if not provided) */
  rayId?: string;
  /** If provided, shows the user's bottom ray as context */
  bottomRayId?: string;
}

export default function CoachQuestion({ rayId, bottomRayId }: Props) {
  const effectiveRayId = rayId ?? bottomRayId ?? 'R1';
  const { question, rayName } = useMemo(() => getDailyQuestion(effectiveRayId), [effectiveRayId]);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rayHex('R7') }}>
          Coach Question
        </p>
        <span
          className="text-[10px] rounded-full px-2 py-0.5 font-medium"
          style={{ background: 'rgba(248, 208, 17, 0.12)', color: 'var(--brand-gold)' }}
        >
          {rayName}
        </span>
      </div>

      <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
        {question}
      </p>

      <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
        Sit with this for 30 seconds. You do not need to write anything — just notice what comes up.
      </p>

      {expanded && (
        <div className="space-y-2 pt-2" style={{ borderTop: '1px solid var(--surface-border)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
            All 9 Rays
          </p>
          {Object.entries(RAY_NAMES).map(([id, name]) => {
            const q = getDailyQuestion(id);
            return (
              <div key={id} className="flex gap-2 items-start">
                <span className="text-xs font-bold shrink-0 w-[80px]" style={{ color: id === effectiveRayId ? 'var(--brand-gold)' : 'var(--text-on-dark-muted)' }}>
                  {name}
                </span>
                <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {q.question}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs hover:underline"
        style={{ color: 'var(--text-on-dark-muted)' }}
      >
        {expanded ? 'Show less' : 'See all 9 questions'}
      </button>
    </div>
  );
}
