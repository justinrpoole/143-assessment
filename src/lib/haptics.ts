/**
 * Haptic feedback utility — triggers device vibration on supported hardware.
 * Falls back silently on devices without Vibration API support.
 */

type HapticIntensity = 'light' | 'medium' | 'strong';

const PATTERNS: Record<HapticIntensity, number | number[]> = {
  light: 10,
  medium: 25,
  strong: [30, 50, 30],
};

export function haptic(intensity: HapticIntensity = 'light'): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(PATTERNS[intensity]);
    }
  } catch {
    // Silent — haptics are never critical
  }
}
