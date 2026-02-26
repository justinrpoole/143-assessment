'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';
import { humanizeError } from '@/lib/ui/error-messages';

// ---------------------------------------------------------------------------
// Tool catalog — 13 core tools from the OS protocol stack
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    key: '90_second_window',
    name: '90-Second Window',
    emoji: '⏱️',
    essence: 'Ride the chemical wave instead of reacting inside it.',
    science: 'Gives your prefrontal cortex time to come back online before you respond.',
    rasHook: 'Your RAS learns that pausing is a power move, not a limitation.',
    time: '90 sec',
    category: 'reset',
  },
  {
    key: 'presence_pause',
    name: 'Presence Pause',
    emoji: '🌬️',
    essence: 'Feet on floor. One breath. Three things you can see/hear/feel.',
    science: 'Interoception anchor — interrupts the Default Mode Network in 10–30 seconds.',
    rasHook: 'Trains your brain to notice the present before defaulting to the narrative.',
    time: '10–30 sec',
    category: 'reset',
  },
  {
    key: 'watch_me',
    name: 'Watch Me',
    emoji: '🎯',
    essence: 'Tell your brain what to lock onto next. Re-select the signal.',
    science: 'Deliberate attention redirect — stops the loudest stimulus from running the show.',
    rasHook: 'Every Watch Me rep trains your RAS to prioritise signal over noise.',
    time: '30–60 sec',
    category: 'action',
  },
  {
    key: 'go_first',
    name: 'Go First',
    emoji: '🚀',
    essence: 'Do the first rep before you feel ready. Start is the skill.',
    science: 'Execution begins with initiation — not confidence. Prefrontal cortex primed by action.',
    rasHook: 'Your brain stops waiting for readiness when you prove readiness isn\'t required.',
    time: '1 min',
    category: 'action',
  },
  {
    key: 'i_rise',
    name: 'I Rise',
    emoji: '☀️',
    essence: 'Name the drift. Own it. Return to your standard.',
    science: 'Affect labeling (Lieberman) + self-distancing (Kross) — reduces amygdala reactivity fast.',
    rasHook: 'Naming the pattern creates a gap. In that gap, you choose differently.',
    time: '60–120 sec',
    category: 'reset',
  },
  {
    key: 'reflection_loop',
    name: 'Reflection Loop',
    emoji: '🔁',
    essence: 'What worked? Where did I drift? Smallest change tomorrow?',
    science: 'Metacognition (Flavell) — reflection is compounding. Stops you repeating the same week.',
    rasHook: 'Your RAS starts scanning for patterns automatically once you make reflection habitual.',
    time: '3–10 min',
    category: 'reflect',
  },
  {
    key: 'if_then_planning',
    name: 'If/Then Planning',
    emoji: '🗺️',
    essence: 'If [situation], then I will [action]. Pre-decide under calm.',
    science: 'Implementation intentions (Gollwitzer) — reduces decision fatigue by 50%+ under stress.',
    rasHook: 'Pre-loaded plans bypass the amygdala. Your brain executes the plan before panic arrives.',
    time: '5 min',
    category: 'plan',
  },
  {
    key: 'boundary_of_light',
    name: 'Boundary of Light',
    emoji: '🛡️',
    essence: 'Name it. State it clean. Hold it. Protect your energy.',
    science: 'Boundaries reduce energy borrowing — they are a performance strategy, not selfishness.',
    rasHook: 'Boundaries tell your RAS where your energy belongs. Less leak, more light.',
    time: 'Ongoing',
    category: 'protect',
  },
  {
    key: 'ras_reset',
    name: 'RAS Reset',
    emoji: '🧠',
    essence: 'Name 3 things you want to notice today. Prime your attention.',
    science: 'Reticular Activating System priming — your brain finds what you tell it to look for.',
    rasHook: 'The core move. Everything else builds on this. Tell your RAS what matters.',
    time: '30 sec',
    category: 'plan',
  },
  {
    key: 'question_loop',
    name: 'Question Loop',
    emoji: '💬',
    essence: 'One real question. Listen to understand. Ask the next one.',
    science: 'Questions reduce threat rigidity — curiosity shifts the nervous system from defend to explore.',
    rasHook: 'Questions rewire your RAS from "prove and defend" to "discover and connect".',
    time: '3–10 min',
    category: 'connect',
  },
  {
    key: 'witness',
    name: 'Witness',
    emoji: '👁️',
    essence: 'Witness what is real. Do not manipulate the answer.',
    science: 'Cognitive debiasing — separates observation from narrative, reduces confirmation bias.',
    rasHook: 'Witnessing trains the RAS to see what is, not what it expects to see.',
    time: '5 min',
    category: 'reflect',
  },
  {
    key: '143_challenge',
    name: '143 Challenge',
    emoji: '⚡',
    essence: 'Hand over heart. "I love you." 143 = I love you. Reprogram your threat filter with self-directed compassion.',
    science: 'RAS reprogramming: self-compassion lowers cortisol, self-criticism spikes it. Prediction error rewires the model.',
    rasHook: '143 gives your RAS new search instructions. Rehearse compassion, find alignment instead of threat.',
    time: '3 min',
    category: 'practice',
  },
  {
    key: 'let_them',
    name: 'Let Them / Let Me',
    emoji: '🕊️',
    essence: 'Let them choose. Let me choose my response. Release what I cannot control.',
    science: 'Autonomy (SDT — Deci & Ryan) — releasing control reduces cortisol and restores agency.',
    rasHook: 'Letting go rewires the RAS to scan for what you can control, not what you can\'t.',
    time: '30 sec',
    category: 'release',
  },
] as const;

type ToolKey = typeof TOOLS[number]['key'];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  reset: { label: 'Reset', color: '#2ECC71' },       // aurora-green — recovery
  action: { label: 'Action', color: '#C0392B' },      // ray-power — courage/motion
  reflect: { label: 'Reflect', color: '#8E44AD' },    // ray-presence — attention
  plan: { label: 'Plan', color: '#60A5FA' },          // ray-intention — direction
  protect: { label: 'Protect', color: '#1ABC9C' },    // ray-possibility — boundaries
  connect: { label: 'Connect', color: '#E74C8B' },    // ray-connection — relationship
  practice: { label: 'Practice', color: '#D4770B' },  // ray-purpose — meaning
  release: { label: 'Release', color: '#C39BD3' },    // aurora-pink — letting go
};

const QUALITY_OPTIONS = [
  { value: 1, label: 'I showed up', emoji: '✅', description: 'That counts. Every rep matters.', rasNote: 'Showing up is the micro win. Your RAS registered the effort.' },
  { value: 2, label: 'I was present', emoji: '🌟', description: 'Fully in it. No autopilot.', rasNote: 'Full presence deepens the micro win. This rep built real wiring.' },
  { value: 3, label: 'I noticed a shift', emoji: '💡', description: 'Something moved inside.', rasNote: 'A shift means the micro win landed. Your RAS is recalibrating in real time.' },
] as const;

const DURATION_OPTIONS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: 'Custom', seconds: -1 },
] as const;

const REFLECTION_PROMPTS = [
  'What felt different this time?',
  'What would I tell my future self about this moment?',
  'What did my body notice that my mind missed?',
  'Where did my attention go? Was that where I wanted it?',
  'What one word captures this rep?',
];

// ---------------------------------------------------------------------------
// Full REPS 4-step sequence — Recognition, Encouragement, Performance, Sustainability
// ---------------------------------------------------------------------------
const REPS_STEPS = [
  {
    id: 'recognition',
    letter: 'R',
    label: 'Recognition',
    prompt: 'What pattern, fear, or drift did you notice?',
    hint: 'Name it. The moment you see it, you create a gap between you and it.',
  },
  {
    id: 'encouragement',
    letter: 'E',
    label: 'Encouragement',
    prompt: 'What did you tell yourself to act anyway?',
    hint: 'Not motivation. The real internal dialogue that moved you from stuck to started.',
  },
  {
    id: 'performance',
    letter: 'P',
    label: 'Performance',
    prompt: 'What did you actually do? Name the behavior.',
    hint: 'The specific rep. Speak up. Set a boundary. Show up scared. Say the thing.',
  },
  {
    id: 'sustainability',
    letter: 'S',
    label: 'Sustainability',
    prompt: 'What makes this repeatable tomorrow?',
    hint: 'The trigger, the condition, the plan. "If [X], then I will [this] again."',
  },
] as const;

type RepsMode = 'quick' | 'full';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RepRow {
  id: string;
  tool_name: string;
  quality: number | null;
  duration_seconds: number | null;
  reflection_note: string | null;
  recognition: string | null;
  encouragement: string | null;
  performance: string | null;
  sustainability: string | null;
  logged_at: string;
}

interface RepsSummary {
  total_count: number;
  count_this_week: number;
  streak_days: number;
  most_practiced_tool: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toolByKey(key: string) {
  return TOOLS.find((t) => t.key === key) ?? null;
}

function qualityGlow(q: number | null) {
  if (q === 3) return 'shadow-[0_0_8px_rgba(248,208,17,0.4)]';
  if (q === 2) return 'shadow-[0_0_8px_rgba(96,5,141,0.4)]';
  return '';
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function randomPrompt(): string {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface RepLogClientProps {
  initialTool?: string | null;
}

export default function RepLogClient({ initialTool }: RepLogClientProps = {}) {
  const shouldAnimate = useCosmicMotion();

  // Form state — Quick Log
  const defaultTool: ToolKey =
    TOOLS.find((t) => t.key === initialTool)?.key ?? 'presence_pause';
  const [toolKey, setToolKey] = useState<ToolKey>(defaultTool);
  const [durationSeconds, setDurationSeconds] = useState<number>(120);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [showCustom, setShowCustom] = useState(false);
  const [quality, setQuality] = useState<number>(1);
  const [reflection, setReflection] = useState('');
  const [reflectionPrompt] = useState(randomPrompt);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Mode toggle
  const [mode, setMode] = useState<RepsMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reps_mode');
      if (saved === 'quick' || saved === 'full') return saved;
    }
    return 'full'; // Default for new users — will switch after data loads
  });

  // Full REPS state
  const [repsStep, setRepsStep] = useState(-1); // -1 = not started
  const [repsTexts, setRepsTexts] = useState(['', '', '', '']);
  const [repsToolKey, setRepsToolKey] = useState<ToolKey | null>(null);
  const [repsQuality, setRepsQuality] = useState<number>(1);
  const repsInputRef = useRef<HTMLTextAreaElement>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<RepRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showScience, setShowScience] = useState(false);

  // Data
  const [history, setHistory] = useState<RepRow[]>([]);
  const [summary, setSummary] = useState<RepsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [repsRes, summaryRes] = await Promise.all([
        fetch('/api/reps?limit=20'),
        fetch('/api/reps/summary'),
      ]);
      if (repsRes.ok) {
        const d = await repsRes.json() as { reps: RepRow[] };
        setHistory(d.reps ?? []);
      }
      if (summaryRes.ok) {
        const s = await summaryRes.json() as RepsSummary;
        setSummary(s);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Auto-switch experienced users to Quick Log if no saved preference
  useEffect(() => {
    if (summary && typeof window !== 'undefined') {
      const saved = localStorage.getItem('reps_mode');
      if (!saved && summary.total_count >= 5) {
        setMode('quick');
      }
    }
  }, [summary]);

  // Focus textarea when Full REPS step changes
  useEffect(() => {
    if (repsStep >= 0) repsInputRef.current?.focus();
  }, [repsStep]);

  function handleModeChange(newMode: RepsMode) {
    setMode(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reps_mode', newMode);
    }
    // Reset Full REPS state when switching
    setRepsStep(-1);
    setRepsTexts(['', '', '', '']);
    setRepsToolKey(null);
    setRepsQuality(1);
    setError(null);
  }

  async function handleFullRepsSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: repsToolKey ?? 'full_reps',
          trigger_type: 'full_reps',
          quality: repsQuality,
          recognition: repsTexts[0].trim() || null,
          encouragement: repsTexts[1].trim() || null,
          performance: repsTexts[2].trim() || null,
          sustainability: repsTexts[3].trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? 'Could not log this rep.');
        return;
      }
      const d = await res.json() as { rep: RepRow };
      setReceipt(d.rep);
      // Reset
      setRepsStep(-1);
      setRepsTexts(['', '', '', '']);
      setRepsToolKey(null);
      setRepsQuality(1);
      await loadData();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const effectiveDuration =
      showCustom && customMinutes
        ? Math.round(parseFloat(customMinutes) * 60)
        : durationSeconds;

    try {
      const res = await fetch('/api/reps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_name: toolKey,
          duration_seconds: effectiveDuration > 0 ? effectiveDuration : null,
          quality,
          reflection_note: reflection.trim() || null,
          trigger_type: 'ad_hoc',
        }),
      });

      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? 'Could not log this rep.');
        return;
      }

      const d = await res.json() as { rep: RepRow };
      setReceipt(d.rep);

      // Reset form
      setReflection('');
      setQuality(1);
      setShowCustom(false);
      setCustomMinutes('');

      // Reload data
      await loadData();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedTool = toolByKey(toolKey);
  const filteredTools = categoryFilter
    ? TOOLS.filter((t) => t.category === categoryFilter)
    : TOOLS;

  const categories = [...new Set(TOOLS.map((t) => t.category))];

  // ---------------------------------------------------------------------------
  // Receipt view — celebration after logging
  // ---------------------------------------------------------------------------
  if (receipt) {
    const tool = toolByKey(receipt.tool_name);
    const qualityOpt = QUALITY_OPTIONS.find((q) => q.value === receipt.quality);
    return (
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldAnimate ? 0.5 : 0 }}
        className="space-y-6 max-w-lg mx-auto"
      >
        <div className="glass-card p-8 text-center space-y-4"
          style={{ borderColor: 'rgba(248, 208, 17, 0.3)', boxShadow: '0 0 40px rgba(248, 208, 17, 0.08)' }}
        >
          <motion.div
            initial={shouldAnimate ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={shouldAnimate ? { type: 'spring', stiffness: 200, delay: 0.2 } : { duration: 0 }}
            className="text-5xl"
          >
            🏅
          </motion.div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Micro Win
          </p>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
            That rep just rewired something.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Your brain expected the old pattern. You did the new thing anyway.
            That gap between expectation and action is a prediction error &mdash; and prediction errors are how identity updates.
          </p>
          {tool && (
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              {tool.emoji} {tool.name}
              {receipt.duration_seconds && receipt.duration_seconds > 0 && (
                <span className="ml-2" style={{ color: 'var(--text-on-dark-muted)' }}>
                  · {receipt.duration_seconds < 60
                    ? `${receipt.duration_seconds}s`
                    : `${Math.round(receipt.duration_seconds / 60)}m`}
                </span>
              )}
            </p>
          )}

          {/* Full REPS responses */}
          {receipt.recognition && (
            <div className="glass-card p-4 space-y-3 text-left" style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}>
              {REPS_STEPS.map((step, i) => {
                const text = [receipt.recognition, receipt.encouragement, receipt.performance, receipt.sustainability][i];
                if (!text) return null;
                return (
                  <div key={step.id}>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                      {step.letter} &mdash; {step.label}
                    </p>
                    <p className="text-sm mt-1 italic" style={{ color: 'var(--text-on-dark-secondary)' }}>
                      &ldquo;{text}&rdquo;
                    </p>
                  </div>
                );
              })}
              <p className="text-xs mt-2 font-medium" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                Your brain expected one thing. You did another. That&apos;s how the model updates.
              </p>
            </div>
          )}

          {/* RAS feedback based on quality */}
          {qualityOpt && !receipt.recognition && (
            <div className="glass-card p-4 mt-4" style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}>
              <p className="text-xs italic" style={{ color: 'var(--text-on-dark-secondary)' }}>
                {qualityOpt.rasNote}
              </p>
            </div>
          )}

          {receipt.reflection_note && (
            <div className="glass-card p-4" style={{ borderColor: 'rgba(248, 208, 17, 0.2)' }}>
              <p className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--brand-gold, #F8D011)' }}>
                Your reflection
              </p>
              <p className="text-sm italic" style={{ color: 'var(--text-on-dark-secondary)' }}>
                &ldquo;{receipt.reflection_note}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setReceipt(null)}
            className="btn-primary flex-1"
          >
            Log another rep
          </button>
          <a href="/portal" className="btn-watch flex-1 text-center">
            Back to portal
          </a>
        </div>

        {/* Streak celebration */}
        {summary && summary.streak_days > 0 && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldAnimate ? 0.6 : 0, duration: shouldAnimate ? undefined : 0 }}
            className="glass-card p-4 text-center"
            style={{ borderColor: 'rgba(248, 208, 17, 0.2)' }}
          >
            <p className="text-lg font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              🔥 {summary.streak_days} day{summary.streak_days !== 1 ? 's' : ''} in a row
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
              {summary.streak_days >= 7
                ? 'Micro wins compound. Your neural pathways are strengthening — the patterns are shifting.'
                : summary.streak_days >= 3
                ? 'Micro wins stacking. Your RAS is starting to expect this practice.'
                : 'First micro wins are the hardest. Every consecutive day compounds the rewiring.'}
            </p>
          </motion.div>
        )}

        {/* Contextual next step */}
        {summary && summary.total_count > 0 && summary.total_count % 10 === 0 && (
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              🎯 {summary.total_count} total reps.{' '}
              <a href="/weekly" className="underline" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                Time for a weekly review?
              </a>
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  // ---------------------------------------------------------------------------
  // Full REPS step flow
  // ---------------------------------------------------------------------------
  if (mode === 'full' && repsStep >= 0 && repsStep < REPS_STEPS.length) {
    const currentStep = REPS_STEPS[repsStep];
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={repsStep}
            initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldAnimate ? { opacity: 0, x: -20 } : undefined}
            transition={{ duration: shouldAnimate ? 0.2 : 0 }}
            className="glass-card p-6 space-y-5"
            style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}
          >
            {/* Progress */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
                Step {repsStep + 1} of {REPS_STEPS.length}
              </p>
              <div className="flex gap-1">
                {REPS_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-6 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: i <= repsStep ? 'var(--brand-gold)' : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Letter + Label */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                {currentStep.letter} &mdash; {currentStep.label}
              </p>
              <p className="text-lg font-semibold mt-2" style={{ color: 'var(--text-on-dark)' }}>
                {currentStep.prompt}
              </p>
              <p className="text-xs italic mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                {currentStep.hint}
              </p>
            </div>

            {/* Textarea */}
            <textarea
              ref={repsInputRef}
              value={repsTexts[repsStep]}
              onChange={(e) => {
                const updated = [...repsTexts];
                updated[repsStep] = e.target.value;
                setRepsTexts(updated);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && repsTexts[repsStep].trim().length > 0) {
                  e.preventDefault();
                  if (repsStep < REPS_STEPS.length - 1) {
                    setRepsStep(repsStep + 1);
                  }
                }
              }}
              placeholder="Write here... (Enter to advance, Shift+Enter for new line)"
              rows={3}
              maxLength={2000}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-on-dark)',
              }}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {repsStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setRepsStep(repsStep - 1)}
                  className="text-xs"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  &larr; Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRepsStep(-1)}
                  className="text-xs"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  Cancel
                </button>
              )}

              {repsStep < REPS_STEPS.length - 1 ? (
                <button
                  type="button"
                  disabled={repsTexts[repsStep].trim().length === 0}
                  onClick={() => setRepsStep(repsStep + 1)}
                  className="btn-primary text-sm py-2 px-6"
                >
                  Next &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  disabled={repsTexts[repsStep].trim().length === 0}
                  onClick={() => setRepsStep(REPS_STEPS.length)} // Move to finalize
                  className="btn-primary text-sm py-2 px-6"
                >
                  Finish &rarr;
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="rounded-lg px-4 py-3" role="alert"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
          >
            <p className="text-sm" style={{ color: '#FCA5A5' }}>{humanizeError(error)}</p>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Full REPS finalize — optional tool + quality + submit
  // ---------------------------------------------------------------------------
  if (mode === 'full' && repsStep >= REPS_STEPS.length) {
    return (
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldAnimate ? undefined : 0 }}
        className="space-y-6 max-w-lg mx-auto"
      >
        <div className="glass-card p-6 space-y-5" style={{ borderColor: 'rgba(248, 208, 17, 0.2)' }}>
          {/* Summary of R-E-P-S */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              Your REPS
            </p>
            {REPS_STEPS.map((step, i) => (
              <div key={step.id}>
                <p className="text-xs font-semibold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                  {step.letter} &mdash; {step.label}
                </p>
                <p className="text-sm italic" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  &ldquo;{repsTexts[i]}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Optional: closest tool */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              Which tool was this closest to?{' '}
              <span style={{ color: 'var(--text-on-dark-muted)' }} className="font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRepsToolKey(null)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: !repsToolKey ? 'var(--brand-gold, #F8D011)' : 'rgba(255,255,255,0.06)',
                  color: !repsToolKey ? '#020202' : 'var(--text-on-dark-muted)',
                  border: `1px solid ${!repsToolKey ? 'var(--brand-gold, #F8D011)' : 'var(--surface-border)'}`,
                }}
              >
                None / General
              </button>
              {TOOLS.map((tool) => {
                const active = repsToolKey === tool.key;
                return (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => setRepsToolKey(active ? null : tool.key)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: active ? 'rgba(96, 5, 141, 0.3)' : 'rgba(255,255,255,0.06)',
                      color: active ? 'var(--text-on-dark)' : 'var(--text-on-dark-muted)',
                      border: `1px solid ${active ? '#60058D' : 'var(--surface-border)'}`,
                    }}
                  >
                    {tool.emoji} {tool.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-on-dark)' }}>
              How was it?
            </label>
            <div className="space-y-2">
              {QUALITY_OPTIONS.map((opt) => {
                const active = repsQuality === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRepsQuality(opt.value)}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                      active ? 'shadow-[0_0_12px_rgba(96,5,141,0.2)]' : ''
                    }`}
                    style={{
                      background: active ? 'rgba(96, 5, 141, 0.2)' : 'rgba(255,255,255,0.03)',
                      borderColor: active ? '#60058D' : 'var(--surface-border)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{opt.emoji}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
                        {opt.label}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                        &mdash; {opt.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setRepsStep(REPS_STEPS.length - 1)}
            className="btn-watch flex-1"
          >
            &larr; Back
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleFullRepsSubmit()}
            className="btn-primary flex-1"
          >
            {submitting ? 'Logging...' : 'Log this rep \u2713'}
          </button>
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3" role="alert"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
          >
            <p className="text-sm" style={{ color: '#FCA5A5' }}>{humanizeError(error)}</p>
          </div>
        )}
      </motion.div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main view
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8 max-w-2xl mx-auto">

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeChange('full')}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: mode === 'full' ? 'var(--brand-gold, #F8D011)' : 'rgba(255,255,255,0.06)',
            color: mode === 'full' ? '#020202' : 'var(--text-on-dark-muted)',
            border: `1px solid ${mode === 'full' ? 'var(--brand-gold, #F8D011)' : 'var(--surface-border)'}`,
          }}
        >
          Full REPS
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('quick')}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: mode === 'quick' ? 'var(--brand-gold, #F8D011)' : 'rgba(255,255,255,0.06)',
            color: mode === 'quick' ? '#020202' : 'var(--text-on-dark-muted)',
            border: `1px solid ${mode === 'quick' ? 'var(--brand-gold, #F8D011)' : 'var(--surface-border)'}`,
          }}
        >
          Quick Log
        </button>
        <p className="text-xs self-center ml-2" style={{ color: 'var(--text-on-dark-muted)' }}>
          {mode === 'full' ? 'Guided 4-step R\u2011E\u2011P\u2011S sequence' : 'Pick a tool and log'}
        </p>
      </div>

      {/* Full REPS start card (when mode is full and step is -1) */}
      {mode === 'full' && (
        <div className="glass-card p-6 space-y-4" style={{ borderColor: 'rgba(248, 208, 17, 0.2)', boxShadow: '0 0 20px rgba(248, 208, 17, 0.06)' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
            Recognition &bull; Encouragement &bull; Performance &bull; Sustainability
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Walk through the full R-E-P-S sequence. Four prompts that turn a moment of courage into a
            wired-in pattern. Your brain expected one thing. You did another. Let&apos;s log that prediction error.
          </p>
          <button
            type="button"
            onClick={() => setRepsStep(0)}
            className="btn-primary"
          >
            Start REPS sequence
          </button>
        </div>
      )}

      {/* RAS science framing — collapsible for repeat users (Quick Log only) */}
      {mode === 'quick' && (
      <div className="glass-card p-5 space-y-3" style={{ borderColor: 'rgba(96, 5, 141, 0.3)' }}>
        <button
          type="button"
          onClick={() => setShowScience((v) => !v)}
          className="w-full flex items-center justify-between text-left"
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            🧠 Why every rep matters
          </p>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${showScience ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <AnimatePresence>
          {showScience && (
            <motion.div
              initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={shouldAnimate ? { height: 0, opacity: 0 } : undefined}
              transition={{ duration: shouldAnimate ? 0.2 : 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                Your brain runs on prediction. It constantly asks: &ldquo;Based on who I think I am&hellip; what usually happens next?&rdquo;
              </p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                When you perform a new behavior — speak up, set a boundary, show up scared, finish the workout, say the thing — you create a <span style={{ color: 'var(--brand-gold, #F8D011)' }} className="font-semibold">prediction error</span>. Your brain expected &ldquo;I can&apos;t.&rdquo; Reality shows &ldquo;You did.&rdquo; That gap rewires your model.
              </p>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                Over time: repetition + success = identity upgrade. Your brain believes what you repeatedly prove.
              </p>
              <p className="text-xs mt-3 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                Science: Reinforcement learning (dopamine prediction error) &bull; Neuroplasticity (synaptic strengthening) &bull; Habit loop reinforcement &bull; RAS filtering &bull; Self-efficacy research (Bandura)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      )}

      {/* Summary stats */}
      {!loading && summary && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
              {summary.count_this_week}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>reps this week</p>
          </div>
          <div className="glass-card p-4 text-center"
            style={summary.streak_days >= 3 ? { borderColor: 'rgba(248, 208, 17, 0.3)' } : {}}
          >
            <p className="text-2xl font-bold" style={{ color: 'var(--brand-gold, #F8D011)' }}>
              {summary.streak_days > 0 ? `🔥 ${summary.streak_days}` : '—'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>day streak</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
              {summary.total_count}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>total reps</p>
          </div>
        </div>
      )}

      {/* Most practiced insight (Quick Log only) */}
      {mode === 'quick' && !loading && summary?.most_practiced_tool && summary.total_count >= 5 && (
        <div className="glass-card p-3 flex items-center gap-3" style={{ borderColor: 'rgba(96, 5, 141, 0.2)' }}>
          <span className="text-lg">{toolByKey(summary.most_practiced_tool)?.emoji ?? '🔧'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              Most practiced tool
            </p>
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-on-dark)' }}>
              {toolByKey(summary.most_practiced_tool)?.name ?? summary.most_practiced_tool}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            Your RAS knows this one
          </p>
        </div>
      )}

      {/* Log form (Quick Log only) */}
      {mode === 'quick' && (
      <form
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-6"
        style={{ borderColor: 'rgba(96, 5, 141, 0.2)' }}
      >
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Log a rep</h2>

        {error && (
          <div className="rounded-lg px-4 py-3" role="alert"
            style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
          >
            <p className="text-sm" style={{ color: '#FCA5A5' }}>{humanizeError(error)}</p>
          </div>
        )}

        {/* Category filter pills */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Which tool did you use?
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => setCategoryFilter(null)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: !categoryFilter ? 'var(--brand-gold, #F8D011)' : 'rgba(255,255,255,0.06)',
                color: !categoryFilter ? '#020202' : 'var(--text-on-dark-muted)',
                border: `1px solid ${!categoryFilter ? 'var(--brand-gold, #F8D011)' : 'var(--surface-border)'}`,
              }}
            >
              All
            </button>
            {categories.map((cat) => {
              const meta = CATEGORY_LABELS[cat];
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(active ? null : cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? `${meta?.color ?? '#60058D'}22` : 'rgba(255,255,255,0.06)',
                    color: active ? meta?.color ?? 'var(--text-on-dark)' : 'var(--text-on-dark-muted)',
                    border: `1px solid ${active ? `${meta?.color ?? '#60058D'}66` : 'var(--surface-border)'}`,
                  }}
                >
                  {meta?.label ?? cat}
                </button>
              );
            })}
          </div>

          {/* Tool select grid */}
          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {filteredTools.map((tool) => {
              const isSelected = toolKey === tool.key;
              const catMeta = CATEGORY_LABELS[tool.category];
              return (
                <button
                  key={tool.key}
                  type="button"
                  onClick={() => setToolKey(tool.key)}
                  className={`text-left rounded-xl border px-4 py-3 transition-all ${
                    isSelected ? 'shadow-[0_0_12px_rgba(96,5,141,0.3)]' : ''
                  }`}
                  style={{
                    background: isSelected ? 'rgba(96, 5, 141, 0.2)' : 'rgba(255,255,255,0.03)',
                    borderColor: isSelected ? '#60058D' : 'var(--surface-border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-on-dark)' }}>
                      {tool.emoji} {tool.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: `${catMeta?.color ?? '#60058D'}22`,
                          color: catMeta?.color ?? 'var(--text-on-dark-muted)',
                        }}
                      >
                        {catMeta?.label ?? tool.category}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                        {tool.time}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
                    {tool.essence}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Science + RAS insight for selected tool */}
          <AnimatePresence mode="wait">
            {selectedTool && (
              <motion.div
                key={selectedTool.key}
                initial={shouldAnimate ? { opacity: 0, y: -4 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldAnimate ? { opacity: 0, y: -4 } : undefined}
                transition={{ duration: shouldAnimate ? 0.15 : 0 }}
                className="glass-card p-3 mt-2 space-y-1"
                style={{ borderColor: 'rgba(96, 5, 141, 0.2)' }}
              >
                <p className="text-xs" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  💡 {selectedTool.science}
                </p>
                <p className="text-xs font-medium" style={{ color: 'var(--brand-gold, #F8D011)' }}>
                  🧠 {selectedTool.rasHook}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            How long?
          </label>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((opt) => {
              const active =
                (opt.seconds === -1 && showCustom) ||
                (opt.seconds !== -1 && !showCustom && durationSeconds === opt.seconds);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    if (opt.seconds === -1) {
                      setShowCustom(true);
                    } else {
                      setShowCustom(false);
                      setDurationSeconds(opt.seconds);
                    }
                  }}
                  className="px-4 py-2 rounded-full text-sm border transition-all"
                  style={{
                    background: active ? '#60058D' : 'transparent',
                    color: active ? '#FFFEF5' : 'var(--text-on-dark-secondary)',
                    borderColor: active ? '#60058D' : 'var(--surface-border)',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {showCustom && (
            <input
              type="number"
              placeholder="Minutes (e.g. 15)"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="mt-2 w-32 rounded-md px-3 py-2 text-sm focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-on-dark)',
              }}
              min="1"
              max="120"
            />
          )}
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            How was it?
          </label>
          <div className="space-y-2">
            {QUALITY_OPTIONS.map((opt) => {
              const active = quality === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setQuality(opt.value)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                    active ? 'shadow-[0_0_12px_rgba(96,5,141,0.2)]' : ''
                  }`}
                  style={{
                    background: active ? 'rgba(96, 5, 141, 0.2)' : 'rgba(255,255,255,0.03)',
                    borderColor: active ? '#60058D' : 'var(--surface-border)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
                      {opt.label}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
                      — {opt.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reflection */}
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold"
            style={{ color: 'var(--text-on-dark)' }}
            htmlFor="reflection"
          >
            What did you notice?{' '}
            <span style={{ color: 'var(--text-on-dark-muted)' }} className="font-normal">(optional)</span>
          </label>
          <p className="text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
            💭 {reflectionPrompt}
          </p>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Even one sentence. You don't have to solve anything. Just say what you noticed."
            rows={3}
            maxLength={2000}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-on-dark)',
            }}
          />
          {reflection.length > 0 && (
            <p className="text-xs text-right" style={{ color: 'var(--text-on-dark-muted)' }}>
              {reflection.length}/2000
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full"
        >
          {submitting ? 'Logging...' : 'Log this rep ✓'}
        </button>

        {/* Gentle encouragement */}
        <p className="text-xs text-center" style={{ color: 'var(--text-on-dark-muted)' }}>
          Every rep is a signal to your brain. You don&apos;t need to be perfect. You need to be consistent.
        </p>
      </form>
      )}

      {/* History */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold, #F8D011)' }}>
          Recent reps
        </h3>

        {loading ? (
          <div className="glass-card p-6 text-center">
            <div className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--surface-border)', borderTopColor: 'var(--brand-gold, #F8D011)' }}
            />
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card p-6 text-center space-y-2">
            <p className="text-2xl">⚡</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
              Nothing logged yet.
            </p>
            <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
              Start with 10 seconds. That counts. Your RAS doesn&apos;t measure duration — it measures intention.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map((rep, idx) => {
              const tool = toolByKey(rep.tool_name);
              return (
                <motion.li
                  key={rep.id}
                  initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldAnimate ? idx * 0.03 : 0, duration: shouldAnimate ? undefined : 0 }}
                  className={`glass-card px-4 py-3 flex items-start gap-3 ${qualityGlow(rep.quality)}`}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{
                      background: rep.quality === 3 ? 'var(--brand-gold)' : rep.quality === 2 ? '#60058D' : 'var(--surface-border)',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-on-dark)' }}>
                        {tool ? `${tool.emoji} ${tool.name}` : rep.tool_name}
                      </p>
                      <p className="text-xs flex-shrink-0" style={{ color: 'var(--text-on-dark-muted)' }}>
                        {formatRelative(rep.logged_at)}
                      </p>
                    </div>
                    {rep.reflection_note && (
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
                        &ldquo;{rep.reflection_note}&rdquo;
                      </p>
                    )}
                    {rep.duration_seconds && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
                        {rep.duration_seconds < 60
                          ? `${rep.duration_seconds}s`
                          : `${Math.round(rep.duration_seconds / 60)}m`}
                      </p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}

        {/* Navigate to more tools */}
        {!loading && history.length > 0 && (
          <div className="flex justify-center gap-3 pt-2">
            <a href="/weekly" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
              Weekly review →
            </a>
            <a href="/energy" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
              Energy audit →
            </a>
            <a href="/toolkit" className="text-xs underline" style={{ color: 'var(--text-on-dark-muted)' }}>
              Full toolkit →
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
