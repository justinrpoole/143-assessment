# CLAUDE.md — 143 Leadership Assessment App

## Project Overview

Next.js 16 App Router application for the 143 Leadership Assessment — a 9-ray, 36-subfacet capacity-based leadership measurement system. Cosmic/deep-space aesthetic with glass morphism UI. Deployed on Vercel with Supabase backend.

## About Me

- I'm learning to code — explain concepts clearly when they come up
- Prefer simple, readable code over clever or compact solutions
- I learn best from examples with comments explaining the "why"
- If there are multiple approaches, mention the tradeoffs so I can learn

## Architecture

- **Framework:** Next.js 16 App Router with `src/app/` directory
- **Styling:** CSS custom properties (`tokens.css`) + Tailwind utilities + inline `style` props
- **Auth:** Cookie-based magic-link login, middleware-gated routes
- **Database:** Supabase (21 tables, no ORM — raw REST calls)
- **Payments:** Stripe (with `BETA_FREE_MODE=true` bypass)
- **Animations:** Framer Motion with `useReducedMotion` respect
- **Import alias:** `@/*` maps to `./src/*` — never use relative `../` across feature boundaries

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | `PascalCase.tsx` | `SolarCoreScore.tsx`, `RetroFrame.tsx` |
| Lib modules | `kebab-case.ts` | `user-state.ts`, `magic-link.ts` |
| Pages | `page.tsx` in route folder | `src/app/upgrade-your-os/page.tsx` |
| API routes | `route.ts` in `api/[domain]/[action]/` | `src/app/api/auth/login/request/route.ts` |
| Content files | `snake_case.v1.ts` | `page_copy.v1.ts` |
| Scripts | `kebab-case.mjs` in `scripts/` | `scripts/qa/qa-tone.mjs` |

## Component Patterns

### Server vs Client Components
- Default to Server Components (no directive needed)
- Add `'use client'` only when hooks, browser APIs, or Framer Motion are used
- Pages use `export const dynamic = "force-dynamic"` when reading cookies

### Wrapping Pattern
- Scroll-triggered sections: wrap in `<FadeInSection>`
- Chart/instrument cards: wrap in `<RetroFrame label="SYS-XX NAME" accent="#color">`
- Both honor `useReducedMotion` — never skip this

### Styling Rules
- Complex/dynamic values: inline `style` with CSS custom properties (`var(--token-name)`)
- Layout/spacing: Tailwind utility classes via `className`
- Button variants: CSS classes (`btn-primary`, `btn-secondary`, `btn-watch`, `btn-ghost`)
- **Never hardcode brand hex values** — use tokens from `tokens.css`
- Inline style warnings from ESLint are expected and ignored (codebase convention)

### Key Brand Tokens
```
--color-ray-purple: #60058D
--color-sun-gold: #F8D011
--bg-deep: #1A0A2E (cosmic background)
--text-on-dark, --text-on-dark-secondary, --text-on-dark-muted
```

## API Route Pattern

```ts
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { field?: string };
    // validate -> process -> respond
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[domain:action] context", error);
    return NextResponse.json(
      { error: "snake_case_code", message: "Human-readable message." },
      { status: 500 }
    );
  }
}
```

## Auth Pattern

- `getUserStateFromRequest()` reads the `user_state` cookie (async, Server Components only)
- User states: `"public" | "free_email" | "paid_43" | "sub_active" | "sub_canceled" | "past_due"`
- Middleware gates: `/portal`, `/morning`, `/micro-joy`, `/account`, `/assessment/:path*`, `/results`, `/reports`, `/growth`
- Unauthenticated requests redirect to `/login?source_route=<path>`

## Banned Words and Phrases

These must NEVER appear in user-facing copy. The `qa:tone` script enforces this:

### Banned Phrases
`behind`, `sleep debt`, `take a breath`, `synergy`, `leverage`, `world-class`, `game-changer`, `cutting-edge`, `next-level`, `crush it`, `kill it`, `alpha`, `man up`, `hustle`, `grind`, `broken`, `guru`, `bandwidth`, `deep dive`, `circle back`, `unpack`

### Glossary Violations (wrong terminology)
Never use: `client`, `coachee`, `participant`, `homework`, `exercise(s)`, `course`, `class(es)`, `lesson(s)`

### Negative Framing (never tell users they're behind)
Never use: `you're behind`, `falling behind`, `you are late`, `you're late`, `too late`, `you should`

### Required OS Markers
Marketing pages must include: `upgrade your os` or `internal operating system`

## Brand Voice Rules

- **Capacity-based, not trait-based** — scores represent trainable capacities, not fixed traits
- **No-shame reporting** — no deficit framing, no comparison rankings
- **Eclipse = temporary coverage, not damage** — "your capacity isn't gone, it's eclipsed"
- **Reps, not habits** — we use "rep" language, not "habit" or "routine"
- **Coaching voice:** Direct, warm, specific. Justin Ray's voice — like a friend who's been through it
- **Never clinical** — avoid therapy-speak, diagnostic language, or pathologizing

## Build & QA Commands

```bash
npm run build          # Production build (runs sync:specs first)
npm run dev            # Development server
npm run lint           # ESLint
npm run qa:tone        # Check banned words/phrases in copy
npm run qa:content     # Content lint
npm run qa:smoke       # Smoke tests
npm run qa:all         # Run everything
npx tsc --noEmit       # TypeScript check (ignore '/' route type error — pre-existing)
```

## Pre-existing Known Issues

- `'/'` route type error in `.next/dev/types/validator.ts` — always present, not ours, ignore it
- `web-push` module warning in build — non-blocking, uses try/catch dynamic import
- CSS inline style warnings from ESLint — expected, codebase convention

## PR Review Checklist

When reviewing PRs, check for:

1. **Banned words** — run `npm run qa:tone` or check against the list above
2. **Missing `'use client'`** — any component using hooks needs it
3. **Missing `useReducedMotion`** — all animated components must respect it
4. **Hardcoded colors** — should use CSS custom properties from `tokens.css`
5. **Auth bypass** — no route should expose user data without middleware gate
6. **Relative imports** — should use `@/` alias, never `../` across boundaries
7. **Error shape** — API errors must use `{ error: "code", message: "string" }` format
8. **No-shame language** — copy must never use deficit framing or shame language
9. **FadeInSection wrapping** — new visible sections should be wrapped
10. **RetroFrame for instruments** — charts/readouts should use RetroFrame

## Component Directory

```
src/components/
  cosmic/      → 30 cosmic visualization components (SolarCoreScore, EclipseMeter, etc.)
  results/     → 27 report section components (ExecutiveSignals, CoachingBrief, etc.)
  retention/   → 17 daily practice components (DailyLoopClient, StreakFire, etc.)
  ui/          → 10 shared UI components (RetroFrame, FadeInSection, Toast, etc.)
  marketing/   → 5 marketing components (EmailGate, StickyCtaBar, etc.)
  assessment/  → Assessment runner, setup, sample report, dimming detector
  billing/     → Stripe checkout and upgrade components
```

## Data Model Quick Reference

- **9 Rays:** R1 Intention, R2 Joy, R3 Presence, R4 Power, R5 Purpose, R6 Authenticity, R7 Connection, R8 Possibility, R9 Be The Light
- **3 Phases:** Reconnect (R1-R3), Radiate (R4-R6), Become (R7-R9)
- **36 Subfacets:** 4 per ray (e.g., R1a Daily Intentionality, R1b Time/Attention Architecture)
- **24 Executive Signals:** M001-M024, derived from ray + tool composites
- **Eclipse System:** emotional_load, cognitive_load, relational_load (adapted from Maslach burnout model)
- **Key Indices:** EER (energy efficiency), BRI (burnout risk 0-9), LSI (load snapshot), PPD (performance-presence delta)
