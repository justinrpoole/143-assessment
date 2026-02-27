/**
 * Ray Color System — maps all 9 rays to their brand colors.
 * Uses the same "Opacity Ramp" pattern as the archetypes page:
 * a single accent color applied at graduated opacity tiers to create
 * bg tints, badges, borders, glow shadows, and hover states.
 */

export interface RayColor {
  token: string;
  hex: string;
  label: string;
}

/** All 9 rays with CSS custom property names and hex fallbacks */
export const RAY_COLORS: Record<string, RayColor> = {
  R1: { token: '--ray-intention', hex: '#60A5FA', label: 'Intention' },
  R2: { token: '--ray-joy', hex: '#F4C430', label: 'Joy' },
  R3: { token: '--ray-presence', hex: '#8E44AD', label: 'Presence' },
  R4: { token: '--ray-power', hex: '#C0392B', label: 'Power' },
  R5: { token: '--ray-purpose', hex: '#D4770B', label: 'Purpose' },
  R6: { token: '--ray-authenticity', hex: '#2ECC71', label: 'Authenticity' },
  R7: { token: '--ray-connection', hex: '#E74C8B', label: 'Connection' },
  R8: { token: '--ray-possibility', hex: '#1ABC9C', label: 'Possibility' },
  R9: { token: '--ray-btl', hex: '#F8D011', label: 'Be The Light' },
};

/** Lookup by ray name (case-insensitive) */
const NAME_TO_ID: Record<string, string> = {};
for (const [id, { label }] of Object.entries(RAY_COLORS)) {
  NAME_TO_ID[label.toLowerCase()] = id;
}

/** Resolve a ray identifier (R1-R9 or name) to its RayColor entry */
export function resolveRay(rayIdOrName: string): RayColor {
  const upper = rayIdOrName.toUpperCase();
  if (RAY_COLORS[upper]) return RAY_COLORS[upper];
  const id = NAME_TO_ID[rayIdOrName.toLowerCase()];
  return id ? RAY_COLORS[id] : RAY_COLORS.R9; // fallback to Be The Light (gold)
}

/**
 * Opacity Ramp — returns a hex color with appended alpha suffix.
 * Mirrors the archetype page pattern:
 *   08 = 3% bg tint (content blocks)
 *   12 = 7% badge backgrounds
 *   15 = 8% resting borders
 *   25 = 15% text-shadow glow
 *   40 = 25% hover borders
 *   60 = 37% active/selected borders
 */
export function rayColorAtOpacity(
  rayIdOrName: string,
  opacityHex: string,
): string {
  return `${resolveRay(rayIdOrName).hex}${opacityHex}`;
}

/** CSS variable reference for inline styles */
export function rayVar(rayIdOrName: string): string {
  return `var(${resolveRay(rayIdOrName).token})`;
}

/** Get the raw hex value (for SVG fills, canvas, etc.) */
export function rayHex(rayIdOrName: string): string {
  return resolveRay(rayIdOrName).hex;
}

/** Pre-built opacity ramp for a given ray — all 6 tiers */
export function rayRamp(rayIdOrName: string) {
  const hex = resolveRay(rayIdOrName).hex;
  return {
    bgTint: `${hex}08`,
    badgeBg: `${hex}12`,
    border: `${hex}15`,
    glow: `${hex}25`,
    hoverBorder: `${hex}40`,
    activeBorder: `${hex}60`,
    full: hex,
  };
}

/** All 9 ray keys in order */
export const RAY_KEYS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'] as const;

/** Cycle through the 9 ray keys for a given index (wraps around) */
export function cycleRay(index: number): string {
  return RAY_KEYS[((index % 9) + 9) % 9];
}
