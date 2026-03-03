'use client';

import { useState, useEffect } from 'react';

interface Props {
  bottomRayId: string | null;
  bottomRayName: string | null;
  eclipseLevel?: 'low' | 'medium' | 'high' | null;
  onLogRep?: () => void;
}

interface ToolRec {
  emoji: string;
  name: string;
  essence: string;
  time: string;
  science: string;
}

// Tool recommendations matched to each Ray's training focus
// Science: the tool that most directly trains the depleted capacity
const RAY_TO_TOOLS: Record<string, ToolRec[]> = {
  R1: [
    { emoji: '🗺️', name: 'If/Then Planning', essence: 'Pre-decide your next move before pressure hits.', time: '5 min', science: 'Gollwitzer (1999): implementation intentions double follow-through under stress.' },
    { emoji: '🧠', name: 'RAS Reset', essence: 'Name 3 things you want to notice today. Direct your filter.', time: '30 sec', science: 'Priming your RAS trains your brain to notice intention signals, not just noise.' },
  ],
  R2: [
    { emoji: '🧠', name: 'RAS Reset', essence: 'Name 3 things you want to notice today.', time: '30 sec', science: 'Priming your RAS trains your brain to notice opportunities, not just threats.' },
    { emoji: '🎯', name: 'Watch Me', essence: 'Tell your brain what to lock onto. Re-select the signal.', time: '30 sec', science: 'Deliberate attention redirect trains the brain toward what matters.' },
  ],
  R3: [
    { emoji: '🌬️', name: 'Presence Pause', essence: 'Feet on floor. One breath. Three things you can see/hear/feel.', time: '10–30 sec', science: 'Jha (2013): interoception training improves sustained attention and emotional regulation.' },
    { emoji: '⏱️', name: '90-Second Window', essence: 'The activation wave lasts 90 seconds. Ride it without reacting.', time: '90 sec', science: 'The cortisol spike peaks and drops within 90 seconds when you do not add fuel.' },
  ],
  R4: [
    { emoji: '🚀', name: 'Go First', essence: 'Do the first rep before you feel ready.', time: '1 min', science: 'Prefrontal cortex activates through action — not through waiting to feel confident.' },
    { emoji: '🗺️', name: 'If/Then Planning', essence: 'Pre-commit your response to the next hard moment.', time: '5 min', science: 'Implementation intentions activate automatic behavioral pathways under pressure.' },
  ],
  R5: [
    { emoji: '🔁', name: 'Reflection Loop', essence: 'What worked? Where did I drift? Smallest change tomorrow?', time: '3 min', science: 'Metacognition (Flavell): reflection converts experience into usable insight.' },
    { emoji: '🗺️', name: 'If/Then Planning', essence: 'Pre-decide your alignment move for tomorrow.', time: '5 min', science: 'Gollwitzer: when purpose meets friction, implementation intentions keep you on track.' },
  ],
  R6: [
    { emoji: '👁️', name: 'Witness', essence: 'See what is real. Do not manipulate the answer.', time: '5 min', science: 'Observing without narrative reduces confirmation bias and restores clarity.' },
    { emoji: '🔁', name: 'Reflection Loop', essence: 'What was true today? Where did I perform instead of show up?', time: '3 min', science: 'Honest self-reflection builds the muscle of authenticity over time.' },
  ],
  R7: [
    { emoji: '💬', name: 'Question Loop', essence: 'One real question. Listen to understand, not to respond.', time: '3–10 min', science: 'Edmondson (1999): curiosity builds psychological safety and trust.' },
    { emoji: '🚀', name: 'Go First', essence: 'Reach out first. Connection starts with one move.', time: '1 min', science: 'Initiating contact builds relational trust faster than waiting to be invited.' },
  ],
  R8: [
    { emoji: '🎯', name: 'Watch Me', essence: 'Tell your brain what to lock onto next. Re-select the signal.', time: '30–60 sec', science: 'Deliberate attention redirect trains the brain toward possibility, not threat.' },
    { emoji: '🧠', name: 'RAS Reset', essence: 'Name 3 possibilities you want your brain to scan for.', time: '30 sec', science: 'The RAS filters 11 million bits/second. You choose the filter.' },
  ],
  R9: [
    { emoji: '⚡', name: '143 Challenge', essence: 'Hand over heart. "I love you." 143 = I love you. Reprogram your threat filter with self-directed compassion.', time: '3 min', science: 'RAS reprogramming: self-compassion lowers cortisol, self-criticism spikes it. A regulated nervous system sustains high standards.' },
    { emoji: '🚀', name: 'Go First', essence: 'Be the person who moves first. Your system is ready.', time: '1 min', science: 'Leading first trains the nervous system to trust its own capacity.' },
  ],
};

// Grounding tools for high load states
const GROUNDING_TOOLS: ToolRec[] = [
  { emoji: '🌬️', name: 'Presence Pause', essence: 'Feet on floor. One breath in. Longer breath out. That is it.', time: '30 sec', science: 'Interoception training is the fastest path to self-regulation under load.' },
  { emoji: '⏱️', name: '90-Second Window', essence: 'The activation wave lasts 90 seconds. Ride it. Do not respond yet.', time: '90 sec', science: 'The cortisol spike peaks and drops within 90 seconds when you do not fuel it.' },
];

const DEFAULT_TOOL: ToolRec = {
  emoji: '🌬️',
  name: 'Presence Pause',
  essence: 'Feet on floor. One breath. Three things you can see/hear/feel.',
  time: '10–30 sec',
  science: 'Jha (2013): interoception training improves sustained attention and emotional regulation.',
};

type DetectedPhase = 'orbit' | 'gravity_shift' | 'eclipse_onset' | 'full_eclipse';

function daySeed(): number {
  const d = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < d.length; i++) {
    hash = (hash * 31 + d.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function selectTool(
  bottomRayId: string | null,
  eclipseLevel: string | null | undefined,
  phase: DetectedPhase | null,
): { tool: ToolRec; context: string } {
  // High load states → grounding only
  if (phase === 'full_eclipse' || eclipseLevel === 'high') {
    const idx = daySeed() % GROUNDING_TOOLS.length;
    return {
      tool: GROUNDING_TOOLS[idx] ?? DEFAULT_TOOL,
      context: 'Recovery first. Grounding tool selected.',
    };
  }

  if (phase === 'eclipse_onset') {
    return {
      tool: GROUNDING_TOOLS[0] ?? DEFAULT_TOOL,
      context: 'Load is high. Ground before you stretch.',
    };
  }

  // Normal states — select from Bottom Ray tools with daily variety
  const tools = bottomRayId ? RAY_TO_TOOLS[bottomRayId] : null;
  if (tools && tools.length > 0) {
    const idx = daySeed() % tools.length;
    const tool = tools[idx] ?? DEFAULT_TOOL;
    const context = phase === 'gravity_shift'
      ? 'Steady the base. This rep stabilizes your training focus.'
      : 'Full range available. This rep trains your growth edge.';
    return { tool, context };
  }

  return { tool: DEFAULT_TOOL, context: 'Start here.' };
}

export default function TodaysRep({ bottomRayId, bottomRayName, eclipseLevel, onLogRep }: Props) {
  const [phase, setPhase] = useState<DetectedPhase | null>(null);

  useEffect(() => {
    let canceled = false;
    async function loadPhase() {
      try {
        const res = await fetch('/api/phase-checkin');
        if (!res.ok) return;
        const data = (await res.json()) as { has_checkin: boolean; detected_phase: string | null };
        if (!canceled && data.has_checkin && data.detected_phase) {
          setPhase(data.detected_phase as DetectedPhase);
        }
      } catch {
        // Phase data is supplementary
      }
    }
    void loadPhase();
    return () => { canceled = true; };
  }, []);

  const { tool, context } = selectTool(bottomRayId, eclipseLevel, phase);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4" style={{ background: 'linear-gradient(to right, var(--cosmic-purple-gradient), var(--cosmic-purple-vivid))' }}>
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-on-dark-secondary)' }}>
          Today&apos;s rep
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-muted)' }}>
          {bottomRayName
            ? `Training: ${bottomRayName}`
            : 'Start with this'}
          {phase ? ` · ${context}` : ''}
        </p>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{tool.emoji}</span>
          <div className="flex-1">
            <p className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>{tool.name}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>{tool.essence}</p>
          </div>
          <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: 'var(--text-on-dark-muted)' }}>{tool.time}</span>
        </div>

        <p className="text-xs italic rounded-lg px-3 py-2 leading-relaxed" style={{ color: 'var(--gold-primary)', background: 'color-mix(in srgb, var(--gold-primary) 10%, transparent)' }}>
          {tool.science}
        </p>

        <button
          onClick={onLogRep}
          className="btn-primary w-full"
        >
          Run this rep →
        </button>
      </div>
    </div>
  );
}
