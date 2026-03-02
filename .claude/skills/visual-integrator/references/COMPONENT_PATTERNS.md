# Component Patterns — Visual Integrator

**Production-ready React/TypeScript component patterns for the cosmic design system.**

Every pattern below targets: Next.js 16 (App Router), React 19, Tailwind CSS 4 (`@theme`),
Motion v12+ (`motion/react`), and the cosmic theme. Each pattern includes the complete
TypeScript component, animation variants, and responsive behavior.

**Stack requirements (2026 bleeding-edge):**
- Import motion from `motion/react` (NOT `framer-motion` — rebranded as of Motion v12)
- React 19: `ref` is a regular prop (no `forwardRef` needed), use `use()` hook for promises
- Tailwind CSS 4: CSS-first config via `@theme`, OKLCH color space, `@starting-style`, container queries
- Next.js 16: `use cache` directive, AVIF image support, `template.tsx` for page transitions, PPR

---

## Table of Contents

1. [Tailwind v4 Theme Configuration](#0-tailwind-v4-theme-configuration)
2. [Design System Constants](#design-system-constants)
3. [Cinematic Hero](#1-cinematic-hero)
4. [Masonry Gallery](#2-masonry-gallery)
5. [Feature Showcase](#3-feature-showcase)
6. [Testimonial Carousel](#4-testimonial-carousel)
7. [Animated Background](#5-animated-background)
8. [Visual Card Grid](#6-visual-card-grid)
9. [Split Comparison](#7-split-comparison)
10. [Parallax Section](#8-parallax-section)
11. [Logo Marquee](#9-logo-marquee)
12. [Animated Stats](#10-animated-stats)
13. [Visual Timeline](#11-visual-timeline)
14. [Avatar Display](#12-avatar-display)

---

## 0. Tailwind v4 Theme Configuration

**CRITICAL: Tailwind CSS 4 uses CSS-first configuration. No more `tailwind.config.js`.**

All theme tokens are defined in your global CSS file using the `@theme` directive.
This gives you native CSS custom properties that work everywhere — in Tailwind classes,
in arbitrary values, and in plain CSS.

```css
/* app/globals.css — Tailwind v4 cosmic theme */

@import "tailwindcss";

@theme {
  /* ─── COSMIC COLOR PALETTE (OKLCH for perceptual uniformity) ─── */
  --color-gold: oklch(0.85 0.17 90);            /* #F8D011 equivalent */
  --color-gold-dark: oklch(0.75 0.15 90);       /* #D4A800 equivalent */
  --color-gold-glow: oklch(0.85 0.17 90 / 0.3); /* gold at 30% for shadows */
  --color-purple: oklch(0.35 0.25 310);          /* #60058D equivalent */
  --color-purple-light: oklch(0.50 0.22 310);    /* #8B2FC9 equivalent */
  --color-purple-glow: oklch(0.35 0.25 310 / 0.3);
  --color-deep-bg: oklch(0.10 0.02 280);         /* #0A0A1A equivalent */
  --color-card-bg: oklch(0.14 0.04 280);          /* #111127 equivalent */
  --color-nebula: oklch(0.18 0.06 290);           /* #1A1040 equivalent */
  --color-star-white: oklch(0.96 0.01 280);       /* #F0F0FF equivalent */
  --color-text-muted: oklch(0.68 0.04 280);       /* #9898B8 equivalent */

  /* ─── FONT ─── */
  --font-geist: "Geist", "Geist Variable", system-ui, sans-serif;

  /* ─── ANIMATIONS (for @starting-style and CSS transitions) ─── */
  --animate-float: float 6s ease-in-out infinite;
  --animate-pulse-glow: pulse-glow 3s ease-in-out infinite;
  --animate-shimmer: shimmer 3s linear infinite;

  /* ─── SHADOWS ─── */
  --shadow-glow-gold: 0 0 30px var(--color-gold-glow);
  --shadow-glow-purple: 0 0 30px var(--color-purple-glow);
  --shadow-glow-gold-intense: 0 0 50px oklch(0.85 0.17 90 / 0.5);
}

/* ─── CSS KEYFRAMES (referenced by --animate-* tokens) ─── */
@keyframes float {
  0%, 100% { transform: translateY(-8px); }
  50% { transform: translateY(8px); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* ─── @property for animatable custom properties ─── */
@property --glow-opacity {
  syntax: "<number>";
  inherits: false;
  initial-value: 0.3;
}

@property --glow-spread {
  syntax: "<length>";
  inherits: false;
  initial-value: 30px;
}

/* ─── ENTRY ANIMATIONS via @starting-style ─── */
/* Use these for simple reveal animations that don't need JS */
.cosmic-fade-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;

  @starting-style {
    opacity: 0;
    transform: translateY(24px);
  }
}

.cosmic-scale-in {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;

  @starting-style {
    opacity: 0;
    transform: scale(0.92);
  }
}
```

**Usage in components:**
- Tailwind classes: `bg-gold`, `text-star-white`, `shadow-glow-gold`, `font-geist`
- Arbitrary values: `bg-[var(--color-nebula)]`, `shadow-[var(--shadow-glow-purple)]`
- CSS entry: Add `cosmic-fade-in` class for no-JS fade-in on mount

---

## Design System Constants

TypeScript tokens for use in component logic (shadows, runtime values):

```typescript
// lib/design-tokens.ts

export const cosmic = {
  colors: {
    gold: '#F8D011',
    goldDark: '#D4A800',
    purple: '#60058D',
    purpleLight: '#8B2FC9',
    deepBg: '#0A0A1A',
    cardBg: '#111127',
    nebula: '#1A1040',
    starWhite: '#F0F0FF',
    textMuted: '#9898B8',
  },
  // OKLCH equivalents for runtime use (canvas, SVG, etc.)
  oklch: {
    gold: 'oklch(0.85 0.17 90)',
    purple: 'oklch(0.35 0.25 310)',
    deepBg: 'oklch(0.10 0.02 280)',
    starWhite: 'oklch(0.96 0.01 280)',
  },
  shadows: {
    glowGold: '0 0 30px rgba(248, 208, 17, 0.3)',
    glowPurple: '0 0 30px rgba(96, 5, 141, 0.3)',
    glowGoldIntense: '0 0 50px rgba(248, 208, 17, 0.5)',
    glowGoldSubtle: '0 0 15px rgba(248, 208, 17, 0.15)',
  },
} as const;
```

---

## 1. Cinematic Hero

**Use when:** Landing pages, app entry points, any page that needs a strong
first impression. This is the most impactful component.

**Visual concept:** Full-bleed background image with gradient overlay, large
headline, subtle floating particles, and a CTA that pulses with gold glow.

```typescript
// components/visual/CinematicHero.tsx

'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

interface CinematicHeroProps {
  backgroundImage: string;
  blurDataURL?: string;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaHref?: string;
  overlay?: 'dark' | 'purple' | 'gold';
  // React 19: ref is a regular prop, no forwardRef needed
  ref?: React.Ref<HTMLElement>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export function CinematicHero({
  backgroundImage,
  blurDataURL,
  headline,
  subheadline,
  ctaText,
  ctaHref = '#',
  overlay = 'dark',
  ref,
}: CinematicHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const overlayClass = {
    dark: 'bg-gradient-to-b from-black/60 via-deep-bg/80 to-deep-bg',
    purple: 'bg-gradient-to-b from-purple/40 via-nebula/70 to-deep-bg',
    gold: 'bg-gradient-to-b from-gold/10 via-deep-bg/80 to-deep-bg',
  }[overlay];

  return (
    <section ref={ref} className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image — priority + AVIF via next.config.ts */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="object-cover"
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        sizes="100vw"
      />

      {/* Gradient Overlay — uses Tailwind v4 theme colors */}
      <div className={`absolute inset-0 ${overlayClass}`} />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="max-w-4xl font-geist text-5xl font-bold tracking-tight text-star-white md:text-7xl"
          variants={fadeInUp}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate="visible"
          custom={0}
        >
          {headline}
        </motion.h1>

        {subheadline && (
          <motion.p
            className="mt-6 max-w-2xl text-lg text-text-muted md:text-xl"
            variants={fadeInUp}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            custom={1}
          >
            {subheadline}
          </motion.p>
        )}

        {ctaText && (
          <motion.a
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-8 py-4 font-semibold text-deep-bg shadow-glow-gold transition-shadow hover:shadow-glow-gold-intense"
            variants={fadeInUp}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate="visible"
            custom={2}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {ctaText}
          </motion.a>
        )}
      </div>
    </section>
  );
}
```

**What changed (v2 → v3):**
- Import from `motion/react` (not `framer-motion`)
- `ref` as regular prop (React 19 — no `forwardRef` wrapper)
- Tailwind v4 theme classes: `text-star-white`, `bg-deep-bg`, `shadow-glow-gold`, `font-geist`
- AVIF support via `next.config.ts` `formats: ['image/avif', 'image/webp']`

**Customization points:**
- `overlay` controls the gradient feel — dark for drama, purple for brand, gold for warmth
- Background image should be at least 1920px wide
- For video backgrounds, swap `Image` for a `<video>` tag with `autoPlay muted loop playsInline`

---

## 2. Masonry Gallery

**Use when:** Portfolio displays, image showcases, product grids where you want
visual variety rather than uniform cards.

```typescript
// components/visual/MasonryGallery.tsx

'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

interface GalleryItem {
  src: string;
  alt: string;
  blurDataURL?: string;
  width: number;
  height: number;
  caption?: string;
}

interface MasonryGalleryProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
  ref?: React.Ref<HTMLDivElement>;
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function MasonryGallery({ items, columns = 3, ref }: MasonryGalleryProps) {
  const columnClass = {
    2: 'columns-1 sm:columns-2',
    3: 'columns-1 sm:columns-2 lg:columns-3',
    4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4',
  }[columns];

  return (
    <div ref={ref} className={`${columnClass} gap-4 space-y-4`}>
      {items.map((item, i) => (
        <motion.div
          key={item.src}
          className="group relative break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/5"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          whileHover={{ y: -4 }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            className="w-full transition-transform duration-500 group-hover:scale-105"
            placeholder={item.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={item.blurDataURL}
            loading={i < 6 ? 'eager' : 'lazy'}
          />
          {item.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-sm text-star-white">{item.caption}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 3. Feature Showcase

**Use when:** Displaying product features, app capabilities, or service offerings
with accompanying images. Supports grid and alternating layouts.

```typescript
// components/visual/FeatureShowcase.tsx

'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

interface Feature {
  image: string;
  blurDataURL?: string;
  title: string;
  description: string;
  badge?: string;
}

interface FeatureShowcaseProps {
  features: Feature[];
  layout?: 'grid' | 'alternating';
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeatureShowcase({
  features,
  layout = 'grid',
}: FeatureShowcaseProps) {
  if (layout === 'alternating') {
    return (
      <div className="space-y-24">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className={`flex flex-col items-center gap-12 lg:flex-row ${
              i % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex-1">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-glow-purple">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={600}
                  height={400}
                  className="w-full object-cover"
                  placeholder={feature.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={feature.blurDataURL}
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              {feature.badge && (
                <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                  {feature.badge}
                </span>
              )}
              <h3 className="text-3xl font-bold text-star-white">
                {feature.title}
              </h3>
              <p className="text-lg leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Grid layout
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {features.map((feature) => (
        <motion.div
          key={feature.title}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
          variants={fadeInUp}
          whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
          <div className="overflow-hidden">
            <Image
              src={feature.image}
              alt={feature.title}
              width={400}
              height={300}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
              placeholder={feature.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={feature.blurDataURL}
            />
          </div>
          <div className="p-6">
            {feature.badge && (
              <span className="mb-3 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                {feature.badge}
              </span>
            )}
            <h3 className="text-xl font-bold text-star-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-text-muted">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 4. Testimonial Carousel

**Use when:** Social proof sections, user testimonials, review displays.

```typescript
// components/visual/TestimonialCarousel.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  // Proper auto-advance with useEffect (not setTimeout in render)
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, advance]);

  const testimonial = testimonials[current];

  return (
    <div className="relative mx-auto max-w-3xl py-16 text-center">
      {/* Gold quote mark */}
      <div className="mb-8 font-serif text-6xl text-gold/30">&ldquo;</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <blockquote className="text-xl leading-relaxed text-star-white md:text-2xl">
            {testimonial.quote}
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            {testimonial.avatar && (
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={48}
                height={48}
                className="rounded-full border-2 border-gold/30"
              />
            )}
            <div className="text-left">
              <p className="font-semibold text-star-white">{testimonial.name}</p>
              <p className="text-sm text-text-muted">{testimonial.title}</p>
            </div>
          </div>

          {testimonial.rating && (
            <div className="mt-4 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < testimonial.rating!
                      ? 'text-gold'
                      : 'text-white/20'
                  }
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="mt-8 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current
                ? 'w-8 bg-gold'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

**What changed (v2 → v3):**
- Fixed: auto-advance now uses `useEffect` + `useCallback` (not setTimeout in render body)
- Import from `motion/react`
- Tailwind v4 theme classes throughout

---

## 5. Animated Background

**Use when:** Adding depth and atmosphere to sections. Subtle cosmic particles,
gradient meshes, or star fields that make the page feel alive.

```typescript
// components/visual/CosmicBackground.tsx

'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { cosmic } from '@/lib/design-tokens';

interface CosmicBackgroundProps {
  variant?: 'stars' | 'nebula' | 'particles';
  intensity?: 'subtle' | 'medium' | 'dramatic';
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export function CosmicBackground({
  variant = 'stars',
  intensity = 'subtle',
  children,
  ref,
}: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const particleCount = {
    subtle: 40,
    medium: 80,
    dramatic: 150,
  }[intensity];

  useEffect(() => {
    if (shouldReduceMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize with ResizeObserver (modern pattern)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    });
    resizeObserver.observe(canvas.parentElement!);

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.pulse += 0.02;
        if (p.y < -10) p.y = canvas.height + 10;

        const glow = p.opacity + Math.sin(p.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          variant === 'nebula'
            ? `rgba(96, 5, 141, ${glow})`
            : `rgba(248, 208, 17, ${glow * 0.6})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [shouldReduceMotion, particleCount, variant]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

**What changed (v2 → v3):**
- `ResizeObserver` for proper canvas sizing (replaces `offsetWidth`/`offsetHeight`)
- HiDPI support with `devicePixelRatio` scaling
- Cleanup properly disconnects ResizeObserver
- `ref` as regular prop (React 19)

---

## 6. Visual Card Grid

**Use when:** Displaying collections of items with images — products, articles,
team members, resources. The workhorse layout component.

Uses **container queries** (Tailwind v4) for truly responsive cards that
adapt to their container width, not just the viewport.

```typescript
// components/visual/VisualCardGrid.tsx

'use client';

import Image from 'next/image';
import { motion } from 'motion/react';

interface CardItem {
  image: string;
  blurDataURL?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  href?: string;
}

interface VisualCardGridProps {
  items: CardItem[];
  columns?: 2 | 3 | 4;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function VisualCardGrid({
  items,
  columns = 3,
  aspectRatio = 'video',
}: VisualCardGridProps) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  const ratioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  return (
    <motion.div
      className={`@container grid ${gridClass} gap-6`}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {items.map((item) => {
        const Wrapper = item.href ? motion.a : motion.div;
        return (
          <Wrapper
            key={item.title}
            href={item.href}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            variants={cardVariant}
            whileHover={{
              y: -6,
              boxShadow: '0 0 30px rgba(248, 208, 17, 0.15)',
            }}
          >
            <div className={`relative ${ratioClass} overflow-hidden`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                placeholder={item.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={item.blurDataURL}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {item.tag && (
                <span className="absolute left-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-xs font-bold text-deep-bg">
                  {item.tag}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-star-white transition-colors group-hover:text-gold">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
              )}
            </div>
          </Wrapper>
        );
      })}
    </motion.div>
  );
}
```

**What changed (v2 → v3):**
- `@container` class on parent enables container queries
- Tailwind v4 theme color classes throughout
- Import from `motion/react`

---

## 7. Split Comparison

**Use when:** Before/after views, comparing two approaches, showing transformation.

```typescript
// components/visual/SplitComparison.tsx

'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

interface SplitComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  width: number;
  height: number;
}

export function SplitComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  width,
  height,
}: SplitComparisonProps) {
  const [splitPosition, setSplitPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(5, Math.min(95, x)));
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-col-resize select-none overflow-hidden rounded-2xl border border-white/10"
      style={{ aspectRatio: `${width}/${height}` }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* After (full width, behind) */}
      <Image src={afterImage} alt={afterLabel} fill className="object-cover" />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${splitPosition}%` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          className="object-cover"
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gold shadow-[0_0_10px_rgba(248,208,17,0.5)]"
        style={{ left: `${splitPosition}%` }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-deep-bg p-2">
          <span className="text-xs text-gold">⟨ ⟩</span>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-star-white">
        {beforeLabel}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-star-white">
        {afterLabel}
      </span>
    </motion.div>
  );
}
```

---

## 8. Parallax Section

**Use when:** Creating depth between content sections. Background moves at a
different speed than foreground.

```typescript
// components/visual/ParallaxSection.tsx

'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

interface ParallaxSectionProps {
  backgroundImage: string;
  blurDataURL?: string;
  speed?: number; // 0.1 (subtle) to 0.5 (dramatic)
  height?: string;
  overlay?: boolean;
  children: React.ReactNode;
}

export function ParallaxSection({
  backgroundImage,
  blurDataURL,
  speed = 0.3,
  height = '60vh',
  overlay = true,
  children,
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [`-${speed * 100}%`, `${speed * 100}%`]
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height }}
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="scale-125 object-cover"
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
        />
      </motion.div>

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-deep-bg/60 via-nebula/40 to-deep-bg/60" />
      )}

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        {children}
      </div>
    </section>
  );
}
```

---

## 9. Logo Marquee

**Use when:** Partner logos, trust badges, client logos, technology stack display.

```typescript
// components/visual/LogoMarquee.tsx

'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

interface Logo {
  src: string;
  alt: string;
  width?: number;
}

interface LogoMarqueeProps {
  logos: Logo[];
  speed?: number;
  direction?: 'left' | 'right';
}

export function LogoMarquee({
  logos,
  speed = 30,
  direction = 'left',
}: LogoMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const doubled = [...logos, ...logos]; // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden py-8">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-deep-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-deep-bg to-transparent" />

      <motion.div
        className="flex items-center gap-16"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: direction === 'left'
                  ? [0, -50 * logos.length]
                  : [-50 * logos.length, 0],
              }
        }
        transition={{
          x: { repeat: Infinity, repeatType: 'loop', duration: speed, ease: 'linear' },
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="flex-shrink-0 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
```

---

## 10. Animated Stats

**Use when:** Displaying metrics, KPIs, social proof numbers, or any countable achievement.

```typescript
// components/visual/AnimatedStats.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface AnimatedStatsProps {
  stats: Stat[];
}

function CountUp({ value, suffix = '', prefix = '' }: Omit<Stat, 'label'>) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function AnimatedStats({ stats }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-4xl font-bold text-gold md:text-5xl">
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
            />
          </div>
          <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 11. Visual Timeline

**Use when:** Showing a journey, process steps, history, or progression with images.

Pattern follows the same structure — a vertical timeline with alternating
image/text blocks, connected by a gold line with glowing dot indicators.
Gold dots for completed steps, purple for current, muted for future.
Images appear on alternating sides on desktop, stacked on mobile.

Key classes: `before:absolute before:left-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gold before:to-purple`

---

## 12. Avatar Display

**Use when:** Team pages, user profiles, community members, speaker lineups.

Circular images with gold ring borders, hover scale effect, name/title below.
Group display uses overlapping style (`-ml-3 first:ml-0`) with `ring-2 ring-deep-bg`
for clean overlap edges. Motion stagger on scroll entry.

---

## Server Component Patterns (React 19 + Next.js 16)

For **static image layouts** that don't need interactivity, use Server Components
to eliminate client-side JavaScript entirely:

```typescript
// components/visual/StaticImageGrid.tsx
// NOTE: No 'use client' — this is a Server Component

import Image from 'next/image';
import { use } from 'react';

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

// Server-side data fetching with use cache (Next.js 16)
async function getImages(): Promise<ImageData[]> {
  'use cache';
  // Fetch from CMS, database, or local manifest
  const res = await fetch('https://api.example.com/images');
  return res.json();
}

export default function StaticImageGrid() {
  // React 19 use() hook — unwrap the promise directly
  const images = use(getImages());

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => (
        <div
          key={img.src}
          className="cosmic-fade-in overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            className="w-full object-cover"
            placeholder={img.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={img.blurDataURL}
          />
        </div>
      ))}
    </div>
  );
}
```

**When to use Server Components for visuals:**
- Static galleries, portfolios, or image grids with no user interaction
- Pages where reducing JS bundle is critical for performance
- Data-fetched image lists from CMS or API
- Any layout where `whileHover`, `whileInView`, or state changes aren't needed

**When to keep Client Components:**
- Interactive animations (hover, scroll-triggered, draggable)
- State-driven UI (carousels, comparisons, counters)
- Anything using Motion hooks (`useScroll`, `useReducedMotion`, etc.)

---

## Image Prefetching (React 19 + Next.js 16)

For critical images that need to load fast, use React 19's `preload()`:

```typescript
// In a Server Component or layout
import { preload } from 'react-dom';

export default function HeroLayout({ children }: { children: React.ReactNode }) {
  // Preload the hero image before the component tree renders
  preload('/images/hero/cosmic-burst.webp', {
    as: 'image',
    type: 'image/webp',
  });

  return <>{children}</>;
}
```

---

## Next.js 16 Configuration

Required `next.config.ts` for the visual integrator:

```typescript
// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smaller), WebP fallback
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.weavy.ai' },
      { protocol: 'https', hostname: 'replicate.delivery' },
      { protocol: 'https', hostname: '**.replicate.com' },
    ],
    // Device sizes for responsive srcset
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Partial Prerendering — static shell + dynamic islands
    ppr: true,
  },
};

export default nextConfig;
```

---

## Integration Checklist

After building any component:

1. Place the file in the project's `components/visual/` directory
2. Add necessary types to `types/visual.ts` if shared across components
3. Update `next.config.ts` with image domains and AVIF format support
4. Import from `motion/react` (NOT `framer-motion`) in all client components
5. Use `ref` as a regular prop (React 19 — no `forwardRef` wrapper)
6. Use Tailwind v4 `@theme` color tokens (`text-star-white`, `bg-gold`, etc.)
7. Consider Server Components for static image layouts (no `'use client'`)
8. Use `preload()` from `react-dom` for above-fold hero images
9. Import into the target page and pass props
10. Test at all breakpoints: 640, 768, 1024, 1280, 1536px
11. Verify Lighthouse: LCP < 2.5s, CLS < 0.1
12. Check with `prefers-reduced-motion: reduce` in browser dev tools
