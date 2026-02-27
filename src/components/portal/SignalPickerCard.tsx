'use client';

import {
  DEFAULT_GO_FIRST_PROMPTS,
  DEFAULT_WATCH_ME_PROMPTS,
  GO_FIRST_PROMPTS_BY_RAY,
  WATCH_ME_PROMPTS_BY_RAY,
} from '@/lib/retention/rep-prompts';

interface Props {
  bottomRayId?: string | null;
  bottomRayName?: string | null;
  onOpenWatchMe: (target: string, move: string) => void;
  onOpenGoFirst: (action: string) => void;
}

export default function SignalPickerCard({
  bottomRayId,
  bottomRayName,
  onOpenWatchMe,
  onOpenGoFirst,
}: Props) {
  const watchPrompts = bottomRayId && WATCH_ME_PROMPTS_BY_RAY[bottomRayId]
    ? WATCH_ME_PROMPTS_BY_RAY[bottomRayId]
    : DEFAULT_WATCH_ME_PROMPTS;

  const goFirstPrompts = bottomRayId && GO_FIRST_PROMPTS_BY_RAY[bottomRayId]
    ? GO_FIRST_PROMPTS_BY_RAY[bottomRayId]
    : DEFAULT_GO_FIRST_PROMPTS;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
            Signal Picker
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-on-dark-secondary)' }}>
            {bottomRayName ? `Training: ${bottomRayName}` : 'Pick one. Start small.'}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-widest rounded-full px-2 py-1" style={{ color: 'var(--brand-gold)', background: 'rgba(248, 208, 17, 0.12)' }}>
          2 minutes
        </span>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
            Watch Me
          </p>
          <div className="grid gap-2">
            {watchPrompts.map((prompt) => (
              <button
                key={`watch-${prompt.label}`}
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
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
            Go First
          </p>
          <div className="grid gap-2">
            {goFirstPrompts.map((prompt) => (
              <button
                key={`go-first-${prompt.label}`}
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
        Pick one and move. You can log the rep right after.
      </p>
    </div>
  );
}
