'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import archetypeBlocks from '@/data/archetype_blocks.json';
import archetypePublic from '@/data/archetype_public.json';
import ShareableSignatureCard from '@/components/marketing/ShareableSignatureCard';

/**
 * 9 quick scenario questions — one per ray.
 * Each has 4 response options scored 1-4 (low to high on that ray's capacity).
 */
const QUIZ_QUESTIONS: {
  rayId: string;
  rayName: string;
  scenario: string;
  options: { label: string; score: number }[];
}[] = [
  {
    rayId: 'R1',
    rayName: 'Intention',
    scenario: 'You wake up to a packed calendar. What do you do first?',
    options: [
      { label: 'Jump into the first thing and figure it out as I go', score: 1 },
      { label: 'Scan the day and hope for the best', score: 2 },
      { label: 'Pick the 2-3 things that actually matter and protect those', score: 3 },
      { label: 'Set a clear intention for the day before I open anything', score: 4 },
    ],
  },
  {
    rayId: 'R2',
    rayName: 'Joy',
    scenario: 'Something good happens at work — a win, a compliment, a breakthrough. What is your typical response?',
    options: [
      { label: 'I barely notice — already thinking about the next problem', score: 1 },
      { label: 'I acknowledge it internally but move on quickly', score: 2 },
      { label: 'I pause and let it land for a moment', score: 3 },
      { label: 'I name it, feel it, and often share it with someone', score: 4 },
    ],
  },
  {
    rayId: 'R3',
    rayName: 'Presence',
    scenario: 'You are in a conversation and your mind starts drifting to your to-do list. What happens?',
    options: [
      { label: 'I usually do not notice until the conversation is over', score: 1 },
      { label: 'I notice but keep half-listening', score: 2 },
      { label: 'I catch myself and refocus most of the time', score: 3 },
      { label: 'I have a practice — a breath, a reset — that brings me back', score: 4 },
    ],
  },
  {
    rayId: 'R4',
    rayName: 'Power',
    scenario: 'A decision needs to be made and no one is stepping up. How do you respond?',
    options: [
      { label: 'I wait for someone else to decide', score: 1 },
      { label: 'I weigh the options but struggle to commit', score: 2 },
      { label: 'I make the call when I have enough information', score: 3 },
      { label: 'I name it, make the call, and own the outcome either way', score: 4 },
    ],
  },
  {
    rayId: 'R5',
    rayName: 'Purpose',
    scenario: 'When someone asks you why you do what you do, what comes up?',
    options: [
      { label: 'I am not sure — I have not thought about it much lately', score: 1 },
      { label: 'I have a general sense but it is hard to put into words', score: 2 },
      { label: 'I can connect most of my work to something that matters to me', score: 3 },
      { label: 'I have a clear answer and it shapes what I say yes and no to', score: 4 },
    ],
  },
  {
    rayId: 'R6',
    rayName: 'Authenticity',
    scenario: 'You disagree with a popular opinion in a room full of colleagues. What do you do?',
    options: [
      { label: 'Stay quiet and keep the peace', score: 1 },
      { label: 'Hint at my view but soften it to avoid friction', score: 2 },
      { label: 'Share my perspective when it feels safe enough', score: 3 },
      { label: 'Say what I actually think — respectfully, but honestly', score: 4 },
    ],
  },
  {
    rayId: 'R7',
    rayName: 'Connection',
    scenario: 'A teammate seems off. Not performing badly — just quieter than usual. What do you do?',
    options: [
      { label: 'I probably would not notice', score: 1 },
      { label: 'I notice but figure it is not my place', score: 2 },
      { label: 'I check in casually — "How are you doing?"', score: 3 },
      { label: 'I name what I see and create space for a real answer', score: 4 },
    ],
  },
  {
    rayId: 'R8',
    rayName: 'Possibility',
    scenario: 'A project is not working. The current approach is safe but stale. What is your instinct?',
    options: [
      { label: 'Stick with what we know — at least it is predictable', score: 1 },
      { label: 'Wish someone would suggest something different', score: 2 },
      { label: 'Suggest one new idea and see how people react', score: 3 },
      { label: 'Propose a fresh approach and volunteer to prototype it', score: 4 },
    ],
  },
  {
    rayId: 'R9',
    rayName: 'Be The Light',
    scenario: 'You see a younger colleague struggling with something you have already figured out. What do you do?',
    options: [
      { label: 'Focus on my own work — they will figure it out', score: 1 },
      { label: 'Drop a hint or share a resource without making it a big thing', score: 2 },
      { label: 'Offer to help when the timing feels right', score: 3 },
      { label: 'Seek them out, share what I learned, and ask what they need', score: 4 },
    ],
  },
];

interface ArchetypeResult {
  name: string;
  essence: string;
  topRays: [string, string];
  topRayNames: [string, string];
  tagline: string;
  neonColor: string;
  identityCode: string;
}

function computeResult(scores: Record<string, number>): ArchetypeResult {
  // Sort rays by score descending, take top 2
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top1 = sorted[0][0];
  const top2 = sorted[1][0];

  // Pair code: always lower ray number first
  const pair = [top1, top2].sort();
  const pairCode = `${pair[0]}-${pair[1]}`;

  // Find archetype
  const block = (archetypeBlocks as { pair_code: string; name: string; essence: string }[])
    .find((a) => a.pair_code === pairCode);

  const name = block?.name ?? 'Unique Leader';
  const essenceRaw = block?.essence ?? '';
  // Take first paragraph of essence for short reveal
  const essence = essenceRaw.split('\n\n')[0] ?? essenceRaw;

  const rayNameMap: Record<string, string> = {
    R1: 'Intention', R2: 'Joy', R3: 'Presence',
    R4: 'Power', R5: 'Purpose', R6: 'Authenticity',
    R7: 'Connection', R8: 'Possibility', R9: 'Be The Light',
  };

  // Look up public archetype data for shareable card fields
  const pub = (archetypePublic as { name: string; tagline: string; neon_color: string; identity_code: string }[])
    .find((a) => a.name === name);

  return {
    name,
    essence,
    topRays: [top1, top2] as [string, string],
    topRayNames: [rayNameMap[top1] ?? top1, rayNameMap[top2] ?? top2] as [string, string],
    tagline: pub?.tagline ?? essence.slice(0, 80),
    neonColor: pub?.neon_color ?? '#F8D011',
    identityCode: pub?.identity_code ?? '',
  };
}

export default function ArchetypeQuizClient() {
  const [step, setStep] = useState(0); // 0-8 = questions, 9 = result
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ArchetypeResult | null>(null);
  const prefersReduced = useReducedMotion();

  const handleAnswer = useCallback((rayId: string, score: number) => {
    const updated = { ...scores, [rayId]: score };
    setScores(updated);

    if (step < 8) {
      setStep(step + 1);
    } else {
      // All 9 answered — compute result
      const res = computeResult(updated);
      setResult(res);
      setStep(9);
    }
  }, [scores, step]);

  const restart = useCallback(() => {
    setStep(0);
    setScores({});
    setResult(null);
  }, []);

  const question = step < 9 ? QUIZ_QUESTIONS[step] : null;
  const progress = Math.round(((step) / 9) * 100);

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="text-xs uppercase tracking-widest font-semibold no-underline" style={{ color: 'var(--text-on-dark-muted)' }}>
          143 Leadership
        </Link>
        <h1 className="text-2xl font-bold mt-2" style={{ color: 'var(--text-on-dark)' }}>
          Which Light Signature Are You?
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
          9 questions. 2 minutes. Discover your leadership archetype.
        </p>
      </div>

      {/* Progress bar */}
      {step < 9 && (
        <div className="mb-6">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs mt-1.5 text-right" style={{ color: 'var(--text-on-dark-muted)' }}>
            {step + 1} of 9
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Question cards */}
        {question && (
          <motion.div
            key={`q-${step}`}
            initial={prefersReduced ? {} : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 space-y-5"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                {question.rayName}
              </p>
              <p className="text-base font-medium mt-2 leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                {question.scenario}
              </p>
            </div>

            <div className="space-y-2">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(question.rayId, opt.score)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all hover:scale-[1.01]"
                  style={{
                    background: 'var(--surface-glass)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-on-dark)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248, 208, 17, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-border)';
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result */}
        {result && step === 9 && (
          <motion.div
            key="result"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 text-center space-y-4" style={{ borderColor: 'rgba(248, 208, 17, 0.3)' }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
                Your Light Signature
              </p>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--brand-gold)' }}>
                {result.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {result.topRayNames[0]} + {result.topRayNames[1]}
              </p>
            </div>

            <div className="glass-card p-6 space-y-3">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                {result.essence.replace(/\*\*/g, '')}
              </p>
            </div>

            {/* Shareable card */}
            <ShareableSignatureCard
              name={result.name}
              tagline={result.tagline}
              rays={result.topRayNames}
              neonColor={result.neonColor}
              identityCode={result.identityCode}
            />

            {/* Blurred teaser */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="space-y-2 blur-sm select-none" aria-hidden="true">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                  Your Eclipse Pattern
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  Under load, your strengths compress into specific stress patterns. The full assessment maps your eclipse level across all 9 rays and reveals where your energy is leaking.
                </p>
                <p className="text-xs font-bold uppercase tracking-widest mt-3" style={{ color: 'var(--brand-gold)' }}>
                  Your 30-Day Plan
                </p>
                <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  A personalized training plan with daily micro-reps designed for your bottom ray. Each rep takes under 2 minutes and builds the capacity you need most.
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  href="/assessment"
                  className="btn-primary px-6 py-3 text-sm font-bold no-underline"
                >
                  Unlock the full assessment →
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={restart}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  background: 'var(--surface-glass)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-on-dark-secondary)',
                }}
              >
                Retake quiz
              </button>
              <Link
                href="/assessment"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-center no-underline transition-all hover:brightness-110"
                style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
              >
                Take full assessment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
