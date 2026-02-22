/**
 * Motion system for 143 Leadership.
 *
 * Provides shared animation variants, timing constants, and hooks
 * for the cosmic design system.
 *
 * Components:
 *   - PageTransition   → Wrap page content for mount animation
 *   - FadeInSection    → Scroll-triggered fade + slide
 *   - StaggerContainer → Staggered children reveal
 *   - ScoreNumber      → Animated count-up number
 *
 * Hooks:
 *   - useCountUp       → Animate a number from 0 to target
 *
 * Variants (Framer Motion):
 *   - fadeIn, fadeInUp, fadeInDown, fadeInScale
 *   - staggerContainer(), staggerItem, staggerItemScale
 *   - pageTransition
 *   - modalBackdrop, modalPanel
 *   - slideUp, slideRight
 *   - cardHover, cardTap
 *
 * CSS classes (in cosmic.css):
 *   - .glass-card--interactive  → lift + glow on hover
 *   - .cosmic-shimmer           → loading shimmer
 *   - .gold-divider-animated    → draw-in gold line
 *   - .score-reveal             → glow on score appearance
 *   - .progress-bar-animated    → fill from 0
 *   - .cosmic-skeleton          → skeleton loading card
 */

export {
  COSMIC_EASE,
  COSMIC_SPRING,
  COSMIC_SPRING_SOFT,
  TIMING,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInScale,
  staggerContainer,
  staggerItem,
  staggerItemScale,
  pageTransition,
  scoreReveal,
  cardHover,
  cardTap,
  modalBackdrop,
  modalPanel,
  slideUp,
  slideRight,
} from "./variants";

export { useCountUp } from "./use-count-up";
