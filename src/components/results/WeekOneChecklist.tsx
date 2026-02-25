'use client';

import { useState } from 'react';
import type { LightSignatureOutput } from '@/lib/types';

interface Props {
  lightSignature: LightSignatureOutput;
}

interface CheckItem {
  day: string;
  label: string;
  detail: string;
}

/**
 * Dynamic Week 1 checklist built from the user's archetype data.
 * Uses starting_tools, micro_reps, and reflection_prompts to create
 * a day-by-day installation plan. Designed to feel achievable, not
 * overwhelming. Each item is a checkbox the user can tap.
 */
export default function WeekOneChecklist({ lightSignature }: Props) {
  const { archetype, just_in_ray } = lightSignature;
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (!archetype) return null;

  // Parse archetype fields into checklist items
  const startingTools = parseMarkdownList(archetype.starting_tools);
  const microReps = parseMarkdownList(archetype.micro_reps);
  const reflectionPrompts = parseMarkdownList(archetype.reflection_prompts);
  const bottomRayName = just_in_ray?.ray_name ?? 'your Rise Path ray';

  const items: CheckItem[] = [
    // Day 1-2: Install the first tool
    {
      day: 'Day 1',
      label: 'Read your Light Signature',
      detail: `You are a ${archetype.name}. Read the "At Work" and "In Life" sections. Notice what resonates.`,
    },
    {
      day: 'Day 2',
      label: 'Install your first tool',
      detail: startingTools[0] ?? 'Pick the tool that matches your biggest current friction point.',
    },
    // Day 3-4: First reps
    {
      day: 'Day 3',
      label: 'Run your first micro-rep',
      detail: microReps[0] ?? 'Complete one rep — any rep. The point is motion, not perfection.',
    },
    {
      day: 'Day 4',
      label: `Try a ${bottomRayName} rep`,
      detail: just_in_ray?.work_rep ?? microReps[1] ?? 'One rep targeting your Rise Path ray.',
    },
    // Day 5-6: Reflection
    {
      day: 'Day 5',
      label: 'Run a reflection loop',
      detail: reflectionPrompts[0] ?? 'Two minutes: what happened, what I did, what I will try next.',
    },
    {
      day: 'Day 6',
      label: 'Log one receipt',
      detail: 'Write down one moment where you used a tool or noticed a capacity in action. That is a REP.',
    },
    // Day 7: Review
    {
      day: 'Day 7',
      label: 'Week 1 review',
      detail: 'Look back at the week. What rep was easiest? That tells you where your system is ready. Do more of that.',
    },
  ];

  const progress = checked.size;
  const total = items.length;

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Week 1 Installation Plan
        </p>
        <h2
          className="mt-2 text-lg font-semibold"
          style={{ color: 'var(--text-on-dark)' }}
        >
          Seven days. Seven reps. One new default.
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          This plan is built from your {archetype.name} signature. Each day adds one rep — small on purpose.
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--surface-glass)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(progress / total) * 100}%`,
              background: 'var(--brand-gold, #F8D011)',
            }}
          />
        </div>
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: 'var(--text-on-dark-muted)' }}
        >
          {progress}/{total}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="w-full text-left glass-card p-4 flex items-start gap-3 transition-opacity"
            style={{ opacity: checked.has(i) ? 0.6 : 1 }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs"
              style={{
                borderColor: checked.has(i) ? 'var(--brand-gold, #F8D011)' : 'var(--surface-border)',
                background: checked.has(i) ? 'rgba(248, 208, 17, 0.15)' : 'transparent',
                color: checked.has(i) ? 'var(--brand-gold, #F8D011)' : 'transparent',
              }}
            >
              {checked.has(i) ? '✓' : ''}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--brand-gold, #F8D011)' }}
                >
                  {item.day}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{
                    color: 'var(--text-on-dark)',
                    textDecoration: checked.has(i) ? 'line-through' : 'none',
                  }}
                >
                  {item.label}
                </span>
              </div>
              <p
                className="mt-0.5 text-xs leading-relaxed"
                style={{ color: 'var(--text-on-dark-muted)' }}
              >
                {item.detail}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Parse markdown-style list items (- item) into plain strings */
function parseMarkdownList(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}
