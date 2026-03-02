---
name: visual-integrator
description: >
  Visual asset integration engine for Next.js apps. Takes images and videos from
  any source (Weavy.ai, Replicate, stock photos, screenshots, custom artwork) and
  integrates them into production-ready Next.js/React components with optimization,
  Framer Motion animations, responsive layouts, and brand-consistent styling.
  Handles the entire pipeline: ingest → optimize → componentize → animate → deploy.
  Triggers on: add images to my app, integrate visuals, add flair to my site,
  make my app look better, visual polish, hero section, image gallery, animation,
  parallax, visual upgrade, add photos to website, integrate Weavy images,
  make it look professional, visual overhaul, add motion to my app.
  Also use when the user has generated images externally and wants them wired into
  their codebase, or when they want to upgrade existing pages with richer visuals
  and motion design.
---

# /visual-integrator — Visual Asset Integration Engine

**From raw images to production-ready, animated, brand-consistent UI.**

Your `/creative` engine generates the assets. Your `/app-developer` engineers the
architecture. This skill is the bridge — it takes visual assets from anywhere and
wires them into your Next.js apps as optimized, animated, responsive components
that match your cosmic design system.

Read `./brand/` per `_system/brand-memory.md`

Follow all output formatting rules from `_system/output-format.md`

**Reads:** `voice-profile.md`, `positioning.md`, `creative-kit.md`, `stack.md`

**Writes:** `./visual-assets/`, `assets.md` (append), `learnings.md` (append)

---

## When This Skill Fires

This skill is the right choice when the user:
- Has images from Weavy.ai, Replicate, or any external source and wants them in their app
- Wants to add visual flair, animations, or motion to existing pages
- Needs a hero section, image gallery, testimonial card, or visual component built
- Wants their app to feel more polished and professional visually
- Says anything about making their site "look better" or "adding images"
- Has generated creative assets and needs the last-mile integration

This skill is NOT the right choice when the user:
- Needs images generated (route to `/creative` first, then come back here)
- Needs app architecture or data model work (route to `/app-developer`)
- Needs copy written for the page (route to `/direct-response-copy`)

The natural workflow is: `/creative` → `/visual-integrator` → done.
Or: user brings images from Weavy.ai → `/visual-integrator` → done.

---

## Target Stack (2026 Bleeding-Edge)

Both of Justin's apps share this stack. Every component this skill produces
targets these technologies:

```
Framework:    Next.js 16 (App Router, PPR, use cache, template.tsx)
Language:     TypeScript 5
UI:           React 19 (use() hook, ref as prop, Server Components), Tailwind CSS 4 (@theme), Radix UI
Animation:    Motion v12+ (import from "motion/react", NOT "framer-motion")
CSS:          Tailwind v4 @theme directive, OKLCH colors, @starting-style, container queries
Design theme: Cosmic/space — gold (#F8D011), purple (#60058D), deep backgrounds
Font:         Geist (Google Fonts)
Hosting:      Vercel
Images:       next/image (AVIF + WebP, blurDataURL, priority/lazy)
```

**CRITICAL CODE RULES (enforce in every component):**
1. `import { motion } from 'motion/react'` — NEVER `framer-motion` (deprecated name)
2. `ref` is a regular prop in React 19 — NEVER use `forwardRef`
3. Tailwind v4 uses `@theme` in CSS — NO `tailwind.config.js`
4. Colors in OKLCH where possible — perceptually uniform
5. Use `@starting-style` for simple mount animations that don't need JS
6. Use Server Components for static image layouts — send zero JS
7. Use `use cache` directive for cached data fetching (replaces `unstable_cache`)
8. Use `preload()` from `react-dom` for critical above-fold images
9. `next.config.ts` must include `formats: ['image/avif', 'image/webp']`

This matters because every output from this skill must be copy-paste ready for
this exact stack. No jQuery. No vanilla CSS files. No class components.
Everything is TypeScript, Tailwind utility classes, and Motion variants.

---

## Three Modes

### Mode 1: Asset Ingest & Optimize

Use when the user has raw images/videos and needs them prepared for production.

**What it does:**
1. Takes source images (from Weavy.ai exports, Replicate output, uploads, URLs)
2. Organizes them into the project's asset structure
3. Generates optimized versions (WebP conversion, responsive sizes, blur placeholders)
4. Creates a Next.js-ready asset manifest with all paths and metadata
5. Produces the `next/image` configuration needed in `next.config.ts`

**Process:**

```
Step 1: Receive assets
  Ask: "Where are the images?"
  Options:
    a) Local files (path on disk)
    b) URLs (Weavy.ai share links, Replicate output URLs)
    c) Already in the project's public/ directory
    d) "I'll generate them now" → route to /creative, return here after

Step 2: Catalog what we have
  For each asset, record:
    - Original filename and dimensions
    - Intended use (hero, product, background, icon, avatar, etc.)
    - Target page or component
    - Alt text (generate if not provided — accessibility matters)

Step 3: Optimize
  Using sharp (already in Next.js ecosystem):
    - Convert to AVIF (primary, ~50% smaller) + WebP (fallback) + original (safety)
    - next.config.ts must have: formats: ['image/avif', 'image/webp']
    - Generate responsive variants: 640w, 768w, 1024w, 1280w, 1920w
    - Generate blur placeholder (tiny 10px base64 for blurDataURL)
    - Strip EXIF metadata (privacy + file size)
    - Compress: AVIF quality 65 for photos, WebP quality 80, quality 90 for graphics
    - Use preload() from react-dom for above-fold hero images

Step 4: Organize
  Save to project structure:
    public/
    ├── images/
    │   ├── hero/
    │   ├── product/
    │   ├── backgrounds/
    │   ├── avatars/
    │   └── icons/
    └── videos/
        ├── hero/
        └── background/

Step 5: Generate manifest
  Create ./visual-assets/asset-manifest.json:
  {
    "assets": [
      {
        "id": "hero-cosmic-burst",
        "original": "/images/hero/cosmic-burst.png",
        "webp": "/images/hero/cosmic-burst.webp",
        "blurDataURL": "data:image/jpeg;base64,...",
        "width": 1920,
        "height": 1080,
        "alt": "Cosmic burst of golden light rays",
        "sizes": [640, 768, 1024, 1280, 1920],
        "use": "hero",
        "page": "/dashboard"
      }
    ]
  }
```

**Output:** Optimized assets in `public/`, manifest in `./visual-assets/`,
`next.config.ts` image configuration.

---

### Mode 2: Component Builder

Use when the user needs visual components built — hero sections, galleries,
cards, backgrounds, testimonial displays, feature showcases.

**What it does:**
1. Takes the asset manifest (or raw images) and a component request
2. Builds production-ready React/TypeScript components
3. Applies the cosmic design system (gold, purple, deep backgrounds)
4. Adds Framer Motion animations appropriate to the component type
5. Ensures responsive behavior across all breakpoints
6. Exports copy-paste-ready code

**Component Library — What We Can Build:**

Read `references/COMPONENT_PATTERNS.md` for the full pattern library.
Below is the routing logic:

```
USER WANTS                              → BUILD
──────────────────────────────────────────────────
"hero section" / "landing hero"         → Cinematic Hero
"image gallery" / "portfolio"           → Masonry Gallery
"product showcase" / "feature grid"     → Feature Showcase
"testimonial" / "social proof"          → Testimonial Carousel
"background" / "ambient" / "texture"    → Animated Background
"card" / "tile" / "preview"             → Visual Card Grid
"before/after" / "comparison"           → Split Comparison
"parallax" / "scroll effect"            → Parallax Section
"avatar" / "profile" / "team"           → Avatar Display
"logo wall" / "partner" / "trust"       → Logo Marquee
"stats" / "counter" / "numbers"         → Animated Stats
"timeline" / "journey" / "progress"     → Visual Timeline
"pricing" / "plan" / "tier"             → Pricing Cards (visual)
```

**Process for each component:**

```
Step 1: Understand the context
  - Which page does this go on?
  - What's above and below it? (visual flow matters)
  - What's the primary action or message?
  - Mobile-first or desktop-first priority?

Step 2: Select the pattern
  Route to the right component pattern from the table above.
  Read the relevant section of references/COMPONENT_PATTERNS.md.

Step 3: Apply the design system
  Every component gets the cosmic theme baked in via Tailwind v4 @theme:

  **IMPORTANT: Use Tailwind v4 @theme token classes, not raw hex values.**
  The theme is defined in globals.css using @theme directive with OKLCH colors.

  Theme classes (Tailwind v4):
    text-gold, bg-gold, border-gold          (primary accent, CTAs, highlights)
    text-purple, bg-purple                    (secondary, headers, gradients)
    bg-deep-bg, text-deep-bg                  (page backgrounds)
    bg-card-bg                                (card/section backgrounds)
    text-star-white                           (text on dark backgrounds)
    bg-nebula                                 (gradient midpoint)
    text-text-muted                           (secondary text)
    shadow-glow-gold, shadow-glow-purple      (glow effects)
    font-geist                                (primary font)

  Gradients:
    cosmic-glow:  from-purple via-nebula to-deep-bg
    gold-accent:  from-gold to-gold-dark
    card-glass:   bg-white/5 backdrop-blur-sm border border-white/10

  CSS entry animations (no JS needed):
    cosmic-fade-in:   opacity 0→1 + translateY 24→0
    cosmic-scale-in:  opacity 0→1 + scale 0.92→1

Step 4: Add animation
  Read references/ANIMATION_PATTERNS.md for the full motion system.
  **Import from `motion/react` (NOT `framer-motion`).**

  Decision tree — JS vs CSS animation:
  - Simple mount fade → CSS `@starting-style` (zero JS)
  - Server Component → CSS `cosmic-fade-in` class (zero JS)
  - Scroll-triggered → `motion/react` whileInView
  - Hover/interaction → `motion/react` whileHover/whileTap
  - Complex sequence → `useAnimate` hook (imperative)
  - Scroll-linked parallax → `useScroll` + `useTransform`
  - Background ambient → `motion/react` animate + Infinity

  Lighter bundle option: `motion/react-mini` (~30% smaller) for simple
  fade/scale/stagger. Only use full `motion/react` when you need scroll,
  drag, layout, or useAnimate.

  The golden rule of animation: if the user notices the animation more
  than the content, it's too much. Motion should feel like breathing —
  natural, rhythmic, barely conscious.

Step 5: Build the component
  Output a complete TypeScript file:
    - Import from `motion/react` (NOT `framer-motion`)
    - `ref` as regular prop (React 19 — no forwardRef)
    - TypeScript interface for props
    - Tailwind v4 @theme classes (text-gold, bg-deep-bg, etc.)
    - Motion variants defined OUTSIDE the component (performance)
    - Consider: Server Component for static layouts (no 'use client')
    - Consider: `use cache` for data-fetched image lists
    - Accessibility: alt text, aria-labels, keyboard navigation, reduced motion
    - Performance: AVIF/WebP, lazy loading, priority for above-fold, preload()

Step 6: Write integration instructions
  Show exactly where to place the component, how to import it,
  and any next.config.ts changes needed.
```

**Output:** Component files in `./visual-assets/components/`, integration guide,
updated asset manifest.

---

### Mode 3: Visual Overhaul

Use when the user wants a full-page or multi-page visual upgrade — not just
one component but a coordinated visual transformation.

**What it does:**
1. Audits the current page(s) for visual opportunities
2. Proposes a visual upgrade plan (component by component)
3. Builds all components in the right order
4. Provides a complete integration guide with page-level code

**Process:**

```
Step 1: Audit current state
  - Read the existing page code (user provides path or URL)
  - Identify: what images exist, what animations exist, what's missing
  - Score the page on:
    Visual impact (1-10): Does it stop the scroll?
    Motion design (1-10): Does it feel alive?
    Brand consistency (1-10): Does it match the cosmic theme?
    Performance (1-10): Are images optimized? Lazy loaded?
    Responsiveness (1-10): Does it work on all screens?

Step 2: Propose the upgrade plan
  Present a prioritized list of visual upgrades:
    Priority 1: Hero section (biggest visual impact, first thing seen)
    Priority 2: Image optimization (performance + quality)
    Priority 3: Scroll animations (makes the page feel alive)
    Priority 4: Interactive elements (hover states, micro-interactions)
    Priority 5: Background textures and ambient effects
    Priority 6: Page transitions

  Each item gets: description, visual impact score, effort estimate,
  which assets are needed.

Step 3: Execute (with user approval)
  Build components in priority order.
  After each component, show a code preview and ask: continue or adjust?

Step 4: Deliver integration guide
  A single document showing:
    - All new files created
    - All existing files that need edits
    - The exact import statements and JSX to add
    - Any package installations needed
    - Vercel deployment notes
```

**Output:** Complete component set, page-level integration guide,
before/after comparison document.

---

## The Optimization Script

For Mode 1 (Asset Ingest), this skill generates a Node.js script using `sharp`
that handles all image optimization in one pass. The script lives at
`./visual-assets/scripts/optimize-images.ts` and can be re-run whenever
new images are added.

```typescript
// This is the template — the skill generates a version customized
// to the user's actual assets and directory structure.

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface AssetConfig {
  source: string;
  dest: string;
  sizes: number[];
  quality: { avif: number; webp: number };
  format: 'avif-webp' | 'webp' | 'all';
}

async function optimizeAsset(config: AssetConfig) {
  const { source, dest, sizes, quality, format } = config;
  const image = sharp(source);
  const metadata = await image.metadata();

  // Generate blur placeholder
  const blurBuffer = await image
    .resize(10, 10, { fit: 'inside' })
    .jpeg({ quality: 20 })
    .toBuffer();
  const blurDataURL = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;

  // Generate responsive sizes in AVIF (primary) + WebP (fallback)
  for (const width of sizes) {
    if (metadata.width && width > metadata.width) continue;

    const outputPath = path.join(dest, `${path.parse(source).name}-${width}w`);

    // AVIF — ~50% smaller than WebP, supported by all modern browsers
    if (format === 'avif-webp' || format === 'all') {
      await image
        .resize(width)
        .avif({ quality: quality.avif }) // 65 for photos, 80 for graphics
        .toFile(`${outputPath}.avif`);
    }

    // WebP — universal fallback
    await image
      .resize(width)
      .webp({ quality: quality.webp }) // 80 for photos, 90 for graphics
      .toFile(`${outputPath}.webp`);

    // Original format backup
    if (format === 'all') {
      await image
        .resize(width)
        .toFile(`${outputPath}${path.extname(source)}`);
    }
  }

  return { blurDataURL, width: metadata.width, height: metadata.height };
}
```

The skill generates the full script customized to the user's actual project
structure and asset list.

---

## How This Skill Connects to the Ecosystem

### Receiving from /creative

When `/creative` generates assets via Replicate, it saves them to
`creative-output/`. This skill picks them up from there:

```yaml
# Handoff from /creative
source: creative-output/product-photos/hero/
target: public/images/hero/
optimize: true
components_needed: ["cinematic-hero", "product-showcase"]
```

### Receiving from external tools (Weavy.ai, etc.)

When the user brings images from Weavy.ai or any other tool:

```
1. User drops files or provides URLs
2. /visual-integrator ingests them (Mode 1)
3. /visual-integrator builds components (Mode 2)
4. Assets registered in ./brand/assets.md
```

### Handing off to /content-atomizer

After visual components are built, the images and component screenshots
can feed into `/content-atomizer` for social distribution.

### Handing off to /bralph

After integration, `/bralph` can run visual regression tests to verify
the components render correctly across viewports.

---

## Reference Files

| Reference | File | When to Read |
|-----------|------|-------------|
| Component Patterns | `references/COMPONENT_PATTERNS.md` | Mode 2 — building any visual component. Includes Tailwind v4 @theme config, Server Component patterns, next.config.ts template, preload() usage |
| Animation Patterns | `references/ANIMATION_PATTERNS.md` | Any time motion/animation is involved. Includes useAnimate, motion/react-mini, @starting-style CSS patterns, template.tsx page transitions, ScrollTimeline |

**Version note:** All reference files updated Feb 2026 with:
- Motion v12+ (`motion/react` imports, `useAnimate`, `motion/react-mini`)
- React 19 (`ref` as prop, `use()` hook, Server Components)
- Tailwind CSS 4 (`@theme`, OKLCH, `@starting-style`, container queries)
- Next.js 16 (`use cache`, AVIF, `template.tsx`, PPR)

---

## Quality Gate

Before delivering any visual integration, verify:

### Technical (Next.js 16 + React 19)
- [ ] All images use `next/image` with width, height, and alt
- [ ] `next.config.ts` has `formats: ['image/avif', 'image/webp']`
- [ ] AVIF primary, WebP fallback configured
- [ ] Blur placeholders (blurDataURL) for all above-fold images
- [ ] `preload()` from `react-dom` used for hero/LCP images
- [ ] Priority flag on LCP (Largest Contentful Paint) image
- [ ] Lazy loading on all below-fold images
- [ ] No layout shift (explicit dimensions on every image)
- [ ] `ref` used as regular prop (React 19 — no forwardRef)
- [ ] Static image layouts use Server Components (no 'use client')
- [ ] Data-fetched images use `use cache` directive

### Design System (Tailwind v4)
- [ ] Colors use Tailwind v4 @theme tokens (text-gold, bg-deep-bg, not raw hex)
- [ ] @theme defined in globals.css with OKLCH color space
- [ ] Tailwind utility classes only (no custom CSS files)
- [ ] Responsive at 640, 768, 1024, 1280, 1536px breakpoints
- [ ] Dark-first design (this IS the cosmic theme — no light mode needed)
- [ ] Container queries (`@container`) used where components need container-responsive sizing

### Animation (Motion v12+)
- [ ] Import from `motion/react` (NOT `framer-motion`)
- [ ] `motion/react-mini` used for simple components (smaller bundle)
- [ ] Variants defined outside component (performance)
- [ ] `whileInView` uses `viewport={{ once: true }}` to prevent re-triggering
- [ ] Reduced motion respected: `useReducedMotion()` hook
- [ ] Simple mount animations use CSS `@starting-style` instead of JS
- [ ] `useAnimate` used for complex sequences (not variant chains)
- [ ] No animation on mobile that blocks interaction (keep it subtle)
- [ ] Page transitions use `template.tsx` pattern

### Performance
- [ ] Lighthouse score check: LCP < 2.5s, CLS < 0.1
- [ ] Images lazy-loaded with `loading="lazy"` via next/image
- [ ] No unoptimized images in `public/` without going through the pipeline
- [ ] Bundle size impact noted for any new dependencies
- [ ] Server Components used to minimize client JS bundle
- [ ] PPR (Partial Prerendering) enabled for static + dynamic pages

### Accessibility
- [ ] All images have meaningful alt text (not "image" or "photo")
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Interactive elements have focus states (ring-gold + ring-offset-deep-bg)
- [ ] Color contrast meets WCAG AA on text over images
- [ ] Ambient animations pause on focus (keyboard/screen reader users)

---

## What's Next After Visual Integration

```
WHAT'S NEXT

Your visual assets are integrated and production-ready. Next moves:

→ /bralph              Run visual regression tests to verify
                       components render correctly (~5 min)
→ /content-atomizer    Repurpose the new visuals for social
                       distribution across platforms (~10 min)
→ /app-developer       If the visual upgrade revealed deeper
                       UX or architecture needs (~20 min)
→ /creative            Need more images? Generate them and
                       come back for integration (~10 min)

Or tell me what you are working on and I will route you.
```

---

*This is the last-mile integration skill. Every other skill creates the
strategy, the copy, the architecture, and the raw creative. This skill
makes it real — optimized, animated, on-brand, and live in production.*
