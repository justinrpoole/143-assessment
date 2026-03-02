# Animation Patterns — Visual Integrator

**Motion v12+ patterns for the cosmic design system.**

Every animation in this file uses `motion/react` (NOT `framer-motion` — rebranded in v12),
respects `useReducedMotion()`, and targets the Next.js 16 + React 19 + Tailwind CSS 4 stack.
These are production patterns — optimized for performance, accessibility, and the cosmic aesthetic.

**CRITICAL IMPORT:** Always use `import { motion } from 'motion/react'`, never from `framer-motion`.
The `framer-motion` package name still works but is deprecated. Use `motion/react` for all new code.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Core Variants Library](#core-variants-library)
3. [Entry Animations](#entry-animations)
4. [Scroll-Triggered Animations](#scroll-triggered-animations)
5. [useAnimate — Imperative Animations](#useanimate--imperative-animations)
6. [Hover & Interaction](#hover--interaction)
7. [Page Transitions (template.tsx)](#page-transitions-templatetsx)
8. [Ambient & Background Motion](#ambient--background-motion)
9. [Micro-Interactions](#micro-interactions)
10. [CSS-Only Animations (@starting-style)](#css-only-animations-starting-style)
11. [Performance Rules](#performance-rules)
12. [Accessibility](#accessibility)
13. [Bundle Optimization](#bundle-optimization)

---

## Philosophy

Animation in the cosmic design system serves three purposes:

1. **Guide attention.** Motion draws the eye to what matters — a CTA appearing,
   a section entering view, a state change completing. If everything moves,
   nothing stands out.

2. **Create atmosphere.** The cosmic theme is about depth, space, and light.
   Subtle floating particles, gentle parallax, and soft glow effects create
   the feeling of being in a living universe without demanding attention.

3. **Communicate state.** Loading, success, error, transition — motion tells
   the user what happened without requiring them to read text.

**The golden rule:** If the user notices the animation more than the content,
it is too much. Motion should feel like breathing — natural, rhythmic,
barely conscious.

**Timing philosophy:** Cosmic animations feel deliberate but not slow.
Entry animations: 0.4-0.6s. Hover responses: 0.2-0.3s.
Background ambient: 3-8s cycles. Never instant, never sluggish.

**Decision: Motion vs CSS?**
- Use `motion/react` when: scroll-linked, gesture-driven, staggered, spring physics, layout animations
- Use CSS `@starting-style` when: simple mount/unmount fades, basic scale-in, no JS needed
- Use Tailwind `transition-*` when: hover/focus state transitions (already handled by Tailwind)

---

## Core Variants Library

Define variants once, use everywhere. These live in a shared file:

```typescript
// lib/motion-variants.ts

import type { Variants } from 'motion/react';

// ─── ENTRY ──────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

// ─── STAGGER CONTAINERS ──────────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// ─── HOVER ──────────────────────────────────────────

export const hoverLift = {
  y: -6,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverScale = {
  scale: 1.03,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverGlow = {
  boxShadow: '0 0 30px rgba(248, 208, 17, 0.3)',
  transition: { duration: 0.3 },
};

export const hoverGlowPurple = {
  boxShadow: '0 0 30px rgba(96, 5, 141, 0.3)',
  transition: { duration: 0.3 },
};

// ─── TAP ──────────────────────────────────────────

export const tapScale = { scale: 0.97 };

// ─── AMBIENT ──────────────────────────────────────

export const float: Variants = {
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const pulse: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const orbit: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};
```

---

## Entry Animations

**When elements first appear on the page or enter the viewport.**

### Staggered children (most common pattern)

The bread and butter of the cosmic system. Parent container staggers
its children's entry for a cascading reveal effect.

```tsx
import { motion } from 'motion/react';
import { staggerContainer, fadeInUp } from '@/lib/motion-variants';

<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-80px' }}
>
  <motion.h2 variants={fadeInUp}>Title</motion.h2>
  <motion.p variants={fadeInUp}>Description</motion.p>
  <motion.div variants={fadeInUp}>
    {/* Cards, images, etc. */}
  </motion.div>
</motion.div>
```

### Custom delay per element

When you need precise control over entry timing:

```tsx
const fadeInCustom = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  }),
};

<motion.h1 variants={fadeInCustom} custom={0} />
<motion.p variants={fadeInCustom} custom={0.15} />
<motion.button variants={fadeInCustom} custom={0.3} />
```

---

## Scroll-Triggered Animations

### Basic reveal on scroll

```tsx
import { motion } from 'motion/react';

<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  {/* Section content */}
</motion.section>
```

### Scroll-linked progress (parallax, progress bars)

```tsx
import { useScroll, useTransform } from 'motion/react';

function ScrollProgress() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      Content that fades in and parallaxes
    </motion.div>
  );
}
```

### Hardware-accelerated scroll (Motion v12 ScrollTimeline)

Motion v12+ can use the native ScrollTimeline API for scroll-linked animations
that run entirely on the compositor thread — zero JS on scroll:

```tsx
import { motion, useScroll, useTransform } from 'motion/react';

function PerformantParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // These transforms are hardware-accelerated in Motion v12+
  // when the browser supports ScrollTimeline API
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <div ref={ref} className="relative h-[80vh] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        {/* Background content — animates on GPU, not main thread */}
      </motion.div>
    </div>
  );
}
```

---

## useAnimate — Imperative Animations

**Motion v12's `useAnimate` hook** gives you imperative control over animations.
Use it for complex sequences, chained animations, or when you need to trigger
animations from event handlers rather than declaratively.

### Basic imperative animation

```tsx
'use client';

import { useAnimate } from 'motion/react';

function SuccessAnimation() {
  const [scope, animate] = useAnimate();

  async function handleSuccess() {
    // Chain animations imperatively
    await animate(scope.current, { scale: 1.1 }, { duration: 0.15 });
    await animate(scope.current, { scale: 1 }, { type: 'spring', stiffness: 300 });
    await animate(
      scope.current,
      { boxShadow: '0 0 40px rgba(248, 208, 17, 0.5)' },
      { duration: 0.3 }
    );
    await animate(
      scope.current,
      { boxShadow: '0 0 20px rgba(248, 208, 17, 0.2)' },
      { duration: 0.5 }
    );
  }

  return (
    <div ref={scope} onClick={handleSuccess} className="rounded-2xl bg-card-bg p-8">
      Click for success animation
    </div>
  );
}
```

### Sequenced entry with useAnimate

```tsx
'use client';

import { useAnimate, stagger } from 'motion/react';
import { useEffect } from 'react';

function StaggeredHero() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Animate children with precise stagger timing
    animate(
      'h1, p, a', // CSS selector within scope
      { opacity: [0, 1], y: [30, 0] },
      { delay: stagger(0.15), duration: 0.6, ease: 'easeOut' }
    );
  }, [animate]);

  return (
    <div ref={scope}>
      <h1 className="text-5xl font-bold text-star-white" style={{ opacity: 0 }}>
        Headline
      </h1>
      <p className="mt-4 text-text-muted" style={{ opacity: 0 }}>
        Subheadline
      </p>
      <a href="#" className="mt-8 inline-block" style={{ opacity: 0 }}>
        CTA
      </a>
    </div>
  );
}
```

### When to use useAnimate vs variants

| Scenario | Use |
|----------|-----|
| Scroll entry reveal | `variants` + `whileInView` |
| Hover/tap feedback | `whileHover` / `whileTap` |
| Complex chained sequence | `useAnimate` |
| Event-triggered animation | `useAnimate` |
| Stagger with CSS selectors | `useAnimate` + `stagger()` |
| Simple mount animation | CSS `@starting-style` |

---

## Hover & Interaction

### Card hover (lift + glow)

The standard hover for any card in the cosmic system:

```tsx
import { motion } from 'motion/react';

<motion.div
  className="rounded-2xl border border-white/10 bg-white/5 p-6"
  whileHover={{
    y: -6,
    boxShadow: '0 0 30px rgba(248, 208, 17, 0.2)',
    borderColor: 'rgba(248, 208, 17, 0.3)',
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>
  Card content
</motion.div>
```

### Image hover (zoom + overlay)

```tsx
<motion.div className="group overflow-hidden rounded-xl">
  <Image
    className="transition-transform duration-500 group-hover:scale-110"
  />
  <motion.div
    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 1 }}
  />
</motion.div>
```

### Button hover (scale + glow intensify)

```tsx
<motion.button
  className="rounded-full bg-gradient-to-r from-gold to-gold-dark px-8 py-4 font-semibold text-deep-bg shadow-glow-gold"
  whileHover={{
    scale: 1.05,
    boxShadow: '0 0 40px rgba(248, 208, 17, 0.5)',
  }}
  whileTap={{ scale: 0.97 }}
>
  CTA Text
</motion.button>
```

---

## Page Transitions (template.tsx)

**Next.js 16 App Router** supports `template.tsx` which re-mounts on every
navigation — perfect for page transitions with AnimatePresence.

Unlike `layout.tsx` (which persists across navigations), `template.tsx`
creates a fresh instance for each page, enabling exit/enter animations.

```tsx
// app/template.tsx — wraps all pages with transition animation

'use client';

import { motion } from 'motion/react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
```

**Why `template.tsx` instead of AnimatePresence in layout?**
- `template.tsx` re-mounts on navigation — no need to track pathname
- No `usePathname()` hook needed (simpler, works with Server Components above)
- Exit animations are handled by the browser's View Transitions API (experimental)
  or by adding `AnimatePresence` at the layout level if exit animations are needed

### Full exit + enter with AnimatePresence

If you need exit animations (content fading out before new page fades in):

```tsx
// app/layout.tsx (client wrapper)

'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Ambient & Background Motion

### Floating elements

Small decorative elements that drift slowly — cosmic dust, light orbs,
geometric shapes. These create atmosphere without demanding attention.

```tsx
import { motion } from 'motion/react';

<motion.div
  className="absolute h-2 w-2 rounded-full bg-gold/20 blur-sm"
  animate={{
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    opacity: [0.2, 0.5, 0.2],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: 'easeInOut',
    delay: Math.random() * 4, // stagger start
  }}
/>
```

### Gradient mesh animation

Slow-moving gradient blobs behind content for a living feel:

```tsx
<motion.div
  className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-purple/20 blur-[100px]"
  animate={{
    x: [0, 100, 0],
    y: [0, 50, 0],
    scale: [1, 1.2, 1],
  }}
  transition={{
    duration: 15,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
/>
```

---

## Micro-Interactions

### Success checkmark

```tsx
import { motion } from 'motion/react';

const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

<motion.svg viewBox="0 0 24 24" className="h-6 w-6">
  <motion.path
    d="M5 13l4 4L19 7"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="text-gold"
    variants={checkVariants}
    initial="hidden"
    animate="visible"
  />
</motion.svg>
```

### Loading pulse (cosmic gold)

```tsx
<motion.div
  className="h-3 w-3 rounded-full bg-gold"
  animate={{
    scale: [1, 1.5, 1],
    opacity: [1, 0.5, 1],
    boxShadow: [
      '0 0 0 0 rgba(248, 208, 17, 0.4)',
      '0 0 0 10px rgba(248, 208, 17, 0)',
      '0 0 0 0 rgba(248, 208, 17, 0.4)',
    ],
  }}
  transition={{ duration: 1.5, repeat: Infinity }}
/>
```

### Number counter (for stats/metrics)

```tsx
import { useMotionValue, useSpring, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  // Subscribe to spring updates and render
  // ...
}
```

---

## CSS-Only Animations (@starting-style)

**Tailwind CSS 4 + modern CSS** supports `@starting-style` for entry animations
that require zero JavaScript. Use these when Motion isn't needed.

### When to use @starting-style instead of Motion

- Simple fade-in on mount (no scroll trigger needed)
- Elements rendered by Server Components (no 'use client')
- Performance-critical paths where you want zero JS animation overhead
- Dialog/popover entry animations

### Cosmic fade-in (defined in globals.css @theme)

```css
/* Already in globals.css */
.cosmic-fade-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  @starting-style {
    opacity: 0;
    transform: translateY(24px);
  }
}
```

Usage in a Server Component (no 'use client' needed):

```tsx
// No 'use client' — pure Server Component with CSS animation
export function StaticCard({ title }: { title: string }) {
  return (
    <div className="cosmic-fade-in rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-star-white">{title}</h3>
    </div>
  );
}
```

### Animatable custom properties with @property

For smooth glow transitions that CSS can interpolate:

```css
/* In globals.css */
@property --glow-opacity {
  syntax: "<number>";
  inherits: false;
  initial-value: 0.3;
}

.cosmic-card {
  --glow-opacity: 0.3;
  box-shadow: 0 0 30px oklch(0.85 0.17 90 / var(--glow-opacity));
  transition: --glow-opacity 0.3s ease;

  &:hover {
    --glow-opacity: 0.6;
  }
}
```

---

## Performance Rules

1. **Import from `motion/react`** — the new package name since v12.
   `framer-motion` still works but is deprecated.

2. **Define variants outside components.** Variants objects recreated on every
   render cause unnecessary work. Define them at module scope or in the
   shared `motion-variants.ts` file.

3. **Use `viewport={{ once: true }}` for scroll animations.** Without `once`,
   elements re-animate every time they enter the viewport. This is almost
   never what you want and tanks performance on scroll-heavy pages.

4. **Prefer `transform` properties.** `x`, `y`, `scale`, `rotate`, and `opacity`
   are GPU-accelerated. `width`, `height`, `top`, `left`, `padding`, `margin`
   cause layout recalculation. Stick to transforms.

5. **Limit simultaneous animations.** On mobile, more than ~15 simultaneous
   Motion animations cause jank. Use stagger to spread the load, and
   make sure below-fold elements aren't animating when above-fold elements
   are still entering.

6. **Use `layout` prop sparingly.** `layout` animations are powerful but
   expensive. Only use them for elements that genuinely change position/size
   in response to state changes (like reordering a list).

7. **No animation on first paint.** Hero section aside, avoid animating
   elements that are visible on initial load. Users see a flash of unstyled
   content followed by animation — it feels broken, not polished.

8. **Prefer CSS for simple transitions.** Hover states, focus rings, color changes —
   use Tailwind's `transition-*` utilities. Only reach for Motion when you need
   spring physics, scroll-linking, layout animations, or complex sequences.

9. **Use `@starting-style` for mount animations in Server Components.**
   If a component doesn't need `'use client'`, use CSS-only animations
   to avoid sending Motion to the client for that component.

---

## Accessibility

### Always respect reduced motion

```tsx
import { useReducedMotion } from 'motion/react';

function MyComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="visible"
      // When reduced motion is on, elements appear instantly
    />
  );
}
```

### Focus states must be visible

Animated elements that are interactive need a clear focus ring:

```tsx
className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-deep-bg"
```

### Pause ambient animations on focus

Screen readers and keyboard users are distracted by continuous motion.
Pause ambient animations when the section receives focus:

```tsx
const [isPaused, setIsPaused] = useState(false);

<div
  onFocus={() => setIsPaused(true)}
  onBlur={() => setIsPaused(false)}
>
  <motion.div
    animate={isPaused ? {} : { y: [-8, 8, -8] }}
  />
</div>
```

---

## Bundle Optimization

### motion/react-mini — lighter alternative

For components that only need basic animations (no layout, no drag, no gestures),
use the mini bundle to save ~30% bundle size:

```tsx
// Instead of: import { motion } from 'motion/react'
import { motion } from 'motion/react-mini';

// Supports: animate, initial, exit, variants, whileInView
// Does NOT support: layout, drag, useMotionValue, useScroll
```

**Use `motion/react-mini` for:**
- Simple fade-in/out components
- Staggered entry animations
- Basic hover/tap feedback
- Components that don't use scroll or drag

**Use full `motion/react` for:**
- Scroll-linked animations (`useScroll`, `useTransform`)
- Drag interactions
- Layout animations
- Complex gesture handling
- `useAnimate` imperative API

### Tree-shaking tips

Motion v12+ is fully tree-shakeable. Only import what you use:

```tsx
// Good — tree-shakeable
import { motion, useScroll, useTransform } from 'motion/react';

// Also good — named imports
import { AnimatePresence } from 'motion/react';
```
