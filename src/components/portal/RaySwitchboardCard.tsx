'use client';

import { useState } from 'react';
import { RAY_NAMES, RAY_SHORT_NAMES } from '@/lib/types';
import { rayRamp } from '@/lib/ui/ray-colors';
import {
  DEFAULT_GO_FIRST_PROMPTS,
  DEFAULT_WATCH_ME_PROMPTS,
  GO_FIRST_PROMPTS_BY_RAY,
  WATCH_ME_PROMPTS_BY_RAY,
} from '@/lib/retention/rep-prompts';

const RAY_ORDER = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'] as const;

interface Props {
  bottomRayId?: string | null;
  topRayIds?: string[];
  onOpenWatchMe: (target: string, move: string) => void;
  onOpenGoFirst: (action: string) => void;
}

export default function RaySwitchboardCard({
  bottomRayId,
  topRayIds,
  onOpenWatchMe,
  onOpenGoFirst,
}: Props) {
  const [selectedRay, setSelectedRay] = useState<string>(() => bottomRayId ?? topRayIds?.[0] ?? 'R1');

  const watchPrompts = WATCH_ME_PROMPTS_BY_RAY[selectedRay] ?? DEFAULT_WATCH_ME_PROMPTS;
  const goFirstPrompts = GO_FIRST_PROMPTS_BY_RAY[selectedRay] ?? DEFAULT_GO_FIRST_PROMPTS;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
            Ray Switchboard
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
            Tap a ray to pull a quick rep.
          </p>
        </div>
        <span
          className="text-[10px] uppercase tracking-widest rounded-full px-2 py-1"
          style={{ color: 'var(--brand-gold)', background: 'rgba(248, 208, 17, 0.12)' }}
        >
          1 minute
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {RAY_ORDER.map((rayId) => {
          const ramp = rayRamp(rayId);
          const isSelected = selectedRay === rayId;
          const isTraining = bottomRayId === rayId;
          const isTop = topRayIds?.includes(rayId) ?? false;
          const label = RAY_SHORT_NAMES[rayId] ?? RAY_NAMES[rayId] ?? rayId;
          return (
            <button
              key={rayId}
              type="button"
              onClick={() => setSelectedRay(rayId)}
              className="rounded-lg px-2.5 py-2 text-left transition-all hover:scale-[1.01]"
              style={{
                background: isSelected ? ramp.badgeBg : 'rgba(2, 2, 2, 0.35)',
                border: `1px solid ${isSelected ? ramp.hoverBorder : 'var(--surface-border)'}`,
                color: ramp.full,
                boxShadow: isTraining
                  ? '0 0 0 1px rgba(248, 208, 17, 0.6), 0 0 10px rgba(248, 208, 17, 0.25)'
                  : isTop
                    ? '0 0 0 1px rgba(96, 5, 141, 0.5)'
                    : 'none',
              }}
            >
              <p className="text-[10px] uppercase tracking-widest" style={{ color: isSelected ? ramp.full : 'var(--text-on-dark-muted)' }}>
                {rayId}
              </p>
              <p className="text-xs font-semibold" style={{ color: isSelected ? ramp.full : 'var(--text-on-dark)' }}>
                {label}
              </p>
              {isTraining && (
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'var(--brand-gold)' }}>
                  Training
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
            Watch Me
          </p>
          <div className="grid gap-2">
            {watchPrompts.slice(0, 2).map((prompt) => (
              <button
                key={`watch-${selectedRay}-${prompt.label}`}
                type="button"
                onClick={() => onOpenWatchMe(prompt.target, prompt.move)}
                className="text-left rounded-lg px-3 py-2 transition-all hover:scale-[1.01]"
                style={{ border: '1px solid var(--surface-border)', background: 'rgba(2, 2, 2, 0.35)', color: 'var(--text-on-dark)' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                  {prompt.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {prompt.target}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
            Go First
          </p>
          <div className="grid gap-2">
            {goFirstPrompts.slice(0, 2).map((prompt) => (
              <button
                key={`go-first-${selectedRay}-${prompt.label}`}
                type="button"
                onClick={() => onOpenGoFirst(prompt.action)}
                className="text-left rounded-lg px-3 py-2 transition-all hover:scale-[1.01]"
                style={{ border: '1px solid var(--surface-border)', background: 'rgba(2, 2, 2, 0.35)', color: 'var(--text-on-dark)' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                  {prompt.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {prompt.action}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
        Your top rays stay lit. Your training ray gets the glow.
      </p>
    </div>
  );
}
