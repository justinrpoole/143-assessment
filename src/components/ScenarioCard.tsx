'use client';

import { useReducedMotion } from 'framer-motion';
import { haptic } from '@/lib/haptics';

interface ScenarioOption {
  key: string;
  label: string;
}

interface ScenarioCardProps {
  itemId: string;
  options: ScenarioOption[];
  selectedKey: string | null;
  onChange: (itemId: string, key: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function ScenarioCard({ itemId, options, selectedKey, onChange }: ScenarioCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt, idx) => {
        const isSelected = selectedKey === opt.key;
        const letter = OPTION_LETTERS[idx] ?? opt.key.toUpperCase();

        return (
          <button
            key={opt.key}
            onClick={() => {
              onChange(itemId, opt.key);
              haptic('light');
            }}
            className={`group relative w-full text-left transition-all glass-card glass-card--interactive ${isSelected ? 'glass-card--glow' : ''}`}
            style={{
              padding: '14px 16px',
              background: isSelected
                ? 'color-mix(in srgb, var(--gold-primary) 12%, transparent)'
                : 'color-mix(in srgb, var(--violet-650) 25%, transparent)',
              borderColor: isSelected
                ? 'var(--brand-gold)'
                : 'color-mix(in srgb, var(--stroke-400) 25%, transparent)',
              transform: isSelected && !prefersReduced ? 'scale(1.02)' : 'scale(1)',
              transitionDuration: prefersReduced ? '0ms' : '200ms',
            }}
            aria-pressed={isSelected}
          >
            {/* Letter badge */}
            <div className="flex items-start gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors"
                style={{
                  background: isSelected
                    ? 'var(--brand-gold)'
                    : 'color-mix(in srgb, var(--stroke-400) 30%, transparent)',
                  color: isSelected
                    ? 'var(--ink-950)'
                    : 'color-mix(in srgb, var(--text-body) 70%, transparent)',
                  transitionDuration: prefersReduced ? '0ms' : '200ms',
                }}
              >
                {letter}
              </span>
              <span
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-on-dark, color-mix(in srgb, var(--text-body) 92%, transparent))' }}
              >
                {opt.label}
              </span>
            </div>

            {/* Selected checkmark */}
            {isSelected && (
              <div
                className="absolute top-2.5 right-3"
                style={{ color: 'var(--brand-gold)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
