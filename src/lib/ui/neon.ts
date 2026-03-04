/**
 * Neon Utility Module — graduated opacity ramp system for the 80s cosmic design.
 *
 * Extracts the archetype page's glow/border/tint pattern into reusable functions
 * that work with ANY hex color (ray colors, archetype neon_colors, or global tokens).
 *
 * Opacity ramp reference (hex alpha suffixes):
 *   08 = ~3%   subtle bg tint (content blocks)
 *   12 = ~7%   badge backgrounds, hover tint
 *   15 = ~8%   resting borders
 *   18 = ~9%   soft shadow glow
 *   20 = ~12%  outer halo layer
 *   25 = ~15%  text-shadow glow
 *   30 = ~19%  medium border
 *   40 = ~25%  hover borders, inner halo
 *   60 = ~37%  active/selected borders
 *   80 = ~50%  strong accent (focus rings)
 */

/* ── Named neon palette (matches tokens.css) ──────────── */

export const NEON = {
  cyan: 'var(--neon-cyan)',
  pink: 'var(--neon-pink)',
  lime: 'var(--neon-lime)',
  violet: 'var(--neon-violet)',
  amber: 'var(--neon-amber)',
  gold: 'var(--gold-primary)',
} as const;

export type NeonColorName = keyof typeof NEON;

/** Page-context → neon accent color mapping */
export const PAGE_NEON: Record<string, string> = {
  assessment: NEON.cyan,
  preview: NEON.cyan,
  challenge: NEON.amber,
  '143': NEON.amber,
  pricing: NEON.lime,
  framework: NEON.violet,
  methodology: NEON.violet,
  archetypes: NEON.pink,
  portal: NEON.gold,
  homepage: NEON.cyan,
};

/* ── Core neon functions ──────────────────────────────── */

/** Multi-layer box shadow glow (hover cards, CTA buttons) */
function alpha(color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

export function neonGlow(color: string, intensity: 'soft' | 'medium' | 'strong' = 'medium'): string {
  switch (intensity) {
    case 'soft':
      return `0 0 16px ${alpha(color, 15)}, 0 0 4px ${alpha(color, 10)}`;
    case 'medium':
      return `0 0 24px ${alpha(color, 18)}, 0 0 48px ${alpha(color, 10)}`;
    case 'strong':
      return `0 0 32px ${alpha(color, 25)}, 0 0 64px ${alpha(color, 15)}, 0 0 120px ${alpha(color, 8)}`;
  }
}

/** Border with neon color at graduated opacity */
export function neonBorder(color: string, state: 'rest' | 'hover' | 'active' | 'focus' = 'rest'): string {
  const opacity: Record<string, number> = {
    rest: 15,
    hover: 40,
    active: 60,
    focus: 80,
  };
  return `1px solid ${alpha(color, opacity[state])}`;
}

/** Background tint fill */
export function neonTint(color: string, level: 'subtle' | 'medium' | 'strong' = 'subtle'): string {
  const opacity: Record<string, number> = {
    subtle: 8,
    medium: 12,
    strong: 20,
  };
  return alpha(color, opacity[level]);
}

/** Text shadow glow for headings */
export function neonText(color: string): string {
  return `0 0 12px ${alpha(color, 30)}, 0 0 30px ${alpha(color, 15)}`;
}

/** Multi-layer halo (hero backgrounds, large feature sections) */
export function neonHalo(color: string): string {
  return `0 0 60px ${alpha(color, 20)}, 0 0 120px ${alpha(color, 10)}`;
}

/* ── Composite style objects ──────────────────────────── */

/** Returns a complete style object for a neon-accented card */
export function neonCardStyle(color: string, isHovered = false) {
  return {
    background: neonTint(color, isHovered ? 'medium' : 'subtle'),
    border: neonBorder(color, isHovered ? 'hover' : 'rest'),
    transition: 'all 0.3s ease',
  };
}

/** Returns style object for a neon-accented CTA button */
export function neonButtonStyle(color: string, isHovered = false) {
  return {
    border: neonBorder(color, isHovered ? 'hover' : 'rest'),
    transition: 'border-color 0.3s ease',
  };
}

/** Returns style object for neon heading text */
export function neonHeadingStyle(color: string) {
  return {
    textShadow: neonText(color),
  };
}

/** Badge/tag style (archetype labels, ray badges) */
export function neonBadgeStyle(color: string) {
  return {
    background: alpha(color, 12),
    color,
    border: `1px solid ${alpha(color, 25)}`,
  };
}

/** Full ramp object for a given neon color — all opacity tiers */
export function neonRamp(color: string) {
  return {
    bgTint: alpha(color, 8),
    badgeBg: alpha(color, 12),
    restBorder: alpha(color, 15),
    softGlow: alpha(color, 18),
    outerHalo: alpha(color, 20),
    textGlow: alpha(color, 25),
    mediumBorder: alpha(color, 30),
    hoverBorder: alpha(color, 40),
    activeBorder: alpha(color, 60),
    focusRing: alpha(color, 80),
    full: color,
  };
}
