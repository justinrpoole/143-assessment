// Standardized Framer Motion animation variants for 143 Leadership
export const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};
export const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
export const SCALE_IN = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
};
export const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
export const SLIDE_LEFT = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};
