'use client';

import { type ReactNode } from 'react';

interface RetroFrameProps {
  children: ReactNode;
  /** Label shown in the top-left corner tab */
  label?: string;
  /** Accent color for corner glow and border (CSS color) */
  accent?: string;
  className?: string;
}

/**
 * RetroFrame — Vintage spaceship / 80s cockpit instrument wrapper.
 *
 * Wraps any chart in a CRT-style frame with:
 * - Beveled double-border with neon glow
 * - Corner accents (bracket lights) with status pips
 * - Subtle scanline + grid overlay
 * - Top-left label tab (like an instrument readout)
 * - Inner CRT depth shadow
 * - Bottom status bar with accent glow
 */
export default function RetroFrame({
  children,
  label,
  accent = 'var(--brand-gold, #F4C430)',
  className = '',
}: RetroFrameProps) {
  return (
    <div
      className={`retro-frame relative rounded-lg overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(10, 5, 28, 0.96) 0%, rgba(15, 8, 35, 0.94) 50%, rgba(20, 10, 45, 0.92) 100%)',
        border: `1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
        boxShadow: `
          inset 0 0 40px rgba(0, 0, 0, 0.6),
          inset 0 0 80px rgba(0, 0, 0, 0.2),
          0 0 15px color-mix(in srgb, ${accent} 8%, transparent),
          0 2px 8px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.03)
        `,
      }}
    >
      {/* ── Top edge highlight ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 5%, color-mix(in srgb, ${accent} 35%, transparent) 50%, transparent 95%)` }}
      />

      {/* ── Corner brackets with status pips ── */}
      <svg className="absolute top-0 left-0 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M0 14 L0 2 Q0 0 2 0 L14 0" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
        <circle cx="3" cy="3" r="1.5" fill={accent} opacity="0.6" filter={`drop-shadow(0 0 3px ${accent})`} />
      </svg>
      <svg className="absolute top-0 right-0 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 0 L22 0 Q24 0 24 2 L24 14" fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />
        <circle cx="21" cy="3" r="1.5" fill={accent} opacity="0.6" filter={`drop-shadow(0 0 3px ${accent})`} />
      </svg>
      <svg className="absolute bottom-0 left-0 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M0 10 L0 22 Q0 24 2 24 L14 24" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" />
        <circle cx="3" cy="21" r="1.5" fill={accent} opacity="0.25" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 24 L22 24 Q24 24 24 22 L24 10" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" />
        <circle cx="21" cy="21" r="1.5" fill={accent} opacity="0.25" />
      </svg>

      {/* ── Label tab ── */}
      {label && (
        <div className="absolute top-0 left-7 z-10">
          <div
            className="flex items-center gap-1.5 px-3 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-b-sm"
            style={{
              color: accent,
              background: 'rgba(10, 5, 28, 0.95)',
              borderLeft: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
              borderRight: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
              borderBottom: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
              textShadow: `0 0 8px color-mix(in srgb, ${accent} 50%, transparent)`,
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 4px ${accent}` }}
            />
            {label}
          </div>
        </div>
      )}

      {/* ── Scanline overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.17) 2px, rgba(0, 0, 0, 0.17) 4px)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* ── Subtle grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,246,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,246,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-[2] px-5 pt-6 pb-5">
        {children}
      </div>

      {/* ── Bottom status bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] z-[3]"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            color-mix(in srgb, ${accent} 10%, transparent) 10%,
            color-mix(in srgb, ${accent} 25%, transparent) 50%,
            color-mix(in srgb, ${accent} 10%, transparent) 90%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
