# Complete Page Map — 143 Leadership Assessment App

Generated: 2026-02-23 (Deep Page Map Audit)

## Root Cause

`src/app/layout.tsx` only renders `<SiteFooter>`. There is **no global header or nav**. Every page must manually import its own navigation component. This is why pages get missed, placed incorrectly, or end up with inconsistent headers.

## Navigation Patterns

| Pattern | Component | Where It Appears | Description |
|---------|-----------|-----------------|-------------|
| A | `MarketingNav` | Public/marketing pages | Sticky top bar (z-50): gold sun logo, 6 nav links, "Take the Assessment" CTA, mobile hamburger |
| B | `PortalTabBar` | Auth/portal pages | Fixed bottom tab bar (z-40, mobile only): Home, Report, Reps, Tools. **No top nav.** |
| C | None | Flow/tool pages | No navigation — user must use browser back button |

---

## Pattern A — MarketingNav Pages (28 routes)

All should have MarketingNav as direct child of `<main>` (not nested inside content divs).

| Route | Status | Notes |
|-------|--------|-------|
| `/upgrade-your-os` | OK | Main landing page. Also has StickyCtaBar at bottom. |
| `/about` | OK | |
| `/assessment` | Conditional | MarketingNav shown in overview mode only. When `run_id` present (active assessment), NO nav — just AssessmentRunnerClient with sticky progress bar. |
| `/assessment/instructions` | OK | |
| `/archetypes` | OK | Fixed in Pass 1 (was missing) |
| `/143-challenge` | OK | |
| `/143` | OK | Fixed in Pass 1 (was missing) |
| `/coaches` | OK | |
| `/cohorts` | OK | |
| `/corporate` | OK | |
| `/coach` | OK | Fixed in Pass 1 (was missing). CoachWorkspaceClient has semantic `<header>` inside but it is a page section title, not nav. |
| `/enterprise` | OK | Fixed in Pass 1 (was missing). EnterpriseSalesPage has no internal nav. |
| `/faq` | OK | |
| `/framework` | OK | |
| `/glossary` | OK | GlossaryClient is a search widget, no internal nav. |
| `/how-it-works` | OK | Fixed in Pass 1 (was missing) |
| `/justin` | OK | Fixed in Pass 1 (was missing) |
| `/login` | OK | MagicLinkFormClient is a form, no internal nav. |
| `/organizations` | Fixed Pass 2 | Was inside inner `<div>` — moved to direct child of `<main>` |
| `/os-coaching` | OK | CoachingApplicationForm is a form, no internal nav. |
| `/outcomes` | OK | Fixed in Pass 1 (was missing) |
| `/pricing` | OK | |
| `/privacy` | OK | |
| `/resources` | Fixed Pass 2 | Was inside inner `<div>` — moved to direct child of `<main>` |
| `/sample-report` | OK | Fixed in Pass 1 (was missing) |
| `/terms` | OK | |
| `/upgrade` | OK | |

---

## Pattern B — PortalTabBar Pages (13 routes)

All use `<PageShell after={<PortalTabBar />}>`. PortalTabBar is mobile-bottom-only (md:hidden). On desktop, these pages have **no visible navigation** except the global footer.

| Route | Status | Notes |
|-------|--------|-------|
| `/portal` | OK | PortalDashboard has welcome card with SignOut button (not sticky, not nav). |
| `/results` | OK | ResultsClient has no internal nav. |
| `/reps` | OK | |
| `/toolkit` | OK | |
| `/account` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/energy` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/growth` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/micro-joy` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/morning` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/plan` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/reflect` | OK | Fixed in Pass 1 (PortalTabBar added) |
| `/reports` | OK | Fixed in Pass 1 (wrapped in PageShell with PortalTabBar). Has inline `<header>` card (page section title). |
| `/weekly` | OK | Fixed in Pass 1 (PortalTabBar added) |

**Open issue (QA-026):** Desktop users have no top navigation on any portal page. Recommended: add a lightweight portal header with logo + sign-out for desktop.

---

## Pattern C — No Navigation (9 routes)

| Route | Type | Risk | Notes |
|-------|------|------|-------|
| `/` | Redirect | None | Immediately redirects to `/upgrade-your-os` |
| `/dashboard` | Redirect | None | Redirects to `/login` or `/portal` |
| `/assessment/setup` | Flow page | **High** | User has no escape. No back link, no nav. QA-025 open. |
| `/welcome` | Onboarding flow | Medium | Step indicator dots but no exit. Intentional onboarding flow. |
| `/preview` | Light Check flow | Medium | PreviewSnapshotClient drives the experience. No escape nav. |
| `/quiz` | Archetype quiz | Low | Has "143 Leadership" text link to `/` (minimal escape). ArchetypeQuizClient renders its own branded header (text-only, no SVG logo). |
| `/preview-cosmic` | Dev tool | None | Custom inline sticky header. Dev/internal only. |
| `/spec-center` | QA tool | None | Key-gated. Internal only. |
| `/spec-center/report-preview` | QA tool | None | Key-gated. Internal only. |
| `/admin/audit` | Admin tool | None | Admin-only. Redirects non-admins. |

---

## Client Components With Internal Headers

These components render their own header-like elements. None conflict with MarketingNav but are worth knowing about:

| Component | What It Renders | Sticky? | Conflict Risk |
|-----------|----------------|---------|---------------|
| `AssessmentRunnerClient` | Progress bar with completion count + mode toggle | Yes (`sticky top-0 z-40`) | None — only shown when MarketingNav is hidden (active assessment state) |
| `CoachWorkspaceClient` | Semantic `<header>` with title "Coach Workspace" | No | None — page section title, not navigation |
| `ArchetypeQuizClient` | "143 Leadership" text link + progress bar | No | Low — different branding than MarketingNav (text-only, no SVG sun) |
| `PortalDashboard` | Welcome card with SignOut button | No | None — content card, not navigation |

---

## Page Connection Map

### Marketing Funnel Flow

```
/upgrade-your-os (landing)
  ├── /assessment (overview) → /assessment/setup → AssessmentRunnerClient
  ├── /preview (Light Check free flow)
  ├── /archetypes → /quiz (archetype quiz)
  ├── /framework
  ├── /143-challenge → /143 (toolkit delivery)
  ├── /organizations → /corporate
  ├── /about → /justin
  ├── /coaches (10-week program)
  ├── /cohorts (group programs)
  ├── /os-coaching (coaching application)
  ├── /sample-report
  ├── /how-it-works
  ├── /pricing → /upgrade (checkout)
  └── /login → /welcome (onboarding) → /portal
```

### Portal Flow (Authenticated)

```
/portal (dashboard)
  ├── /results (assessment results)
  ├── /reports (full report)
  ├── /reps (rep tracking)
  ├── /toolkit (tools library)
  ├── /morning (morning routine)
  ├── /reflect (evening reflection)
  ├── /energy (energy audit)
  ├── /growth (growth summary)
  ├── /micro-joy (micro-joy practice)
  ├── /plan (if/then plans)
  ├── /weekly (weekly review)
  └── /account (billing/settings)
```

### Nav Links in MarketingNav

```
Assessment → /assessment
Archetypes → /archetypes
Framework  → /framework
143 Challenge → /143-challenge
For Organizations → /organizations
About → /about
[CTA] Take the Assessment → /assessment
[Auth] Sign In → /login | My Portal → /portal
```

### PortalTabBar Tabs

```
Home → /portal
Report → /results
Reps → /reps
Tools → /toolkit
```

---

## Recommended Structural Fix

Create Next.js route group layouts to eliminate per-page nav management:

```
src/app/
├── (marketing)/          ← layout.tsx adds MarketingNav
│   ├── upgrade-your-os/
│   ├── about/
│   ├── assessment/       ← needs special handling for active state
│   ├── archetypes/
│   └── ... (all 28 marketing pages)
├── (portal)/             ← layout.tsx adds portal header + PortalTabBar
│   ├── portal/
│   ├── results/
│   ├── reps/
│   └── ... (all 13 portal pages)
├── (flow)/               ← layout.tsx: minimal or no nav (intentional)
│   ├── welcome/
│   ├── preview/
│   ├── quiz/
│   └── assessment/setup/
└── (internal)/           ← layout.tsx: no nav (dev/admin tools)
    ├── admin/
    ├── spec-center/
    └── preview-cosmic/
```

This ensures no page can "forget" its nav — it is inherited from the group layout.
