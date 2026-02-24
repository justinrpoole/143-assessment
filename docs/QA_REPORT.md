# QA Report — Full Remap + Customer Experience Build

**Date:** 2026-02-23
**Build status:** PASS (`npm run build` and `npx tsc --noEmit` both clean)

---

## Build Verification

- `npx tsc --noEmit` — 0 errors
- `npm run build` — all routes compiled successfully
- New routes confirmed in build output: `/watch-me`, `/go-first`, `/be-the-light`

---

## Redirect Tests

| Source | Expected Destination | Type |
|--------|---------------------|------|
| `/143-challenge` | `/143` | 308 permanent |
| `/justin` | `/about` | 308 permanent |
| `/organizations` | `/corporate` | 308 permanent |
| `/enterprise` | `/corporate` | 308 permanent |
| `/dashboard` | `/portal` | 308 permanent |
| `/preview-cosmic` | `/preview` | 308 permanent |

**Status:** Configured in `next.config.ts`. Verify in browser after deploy.

---

## Signed-Out Tests

| Route | Expected Behavior |
|-------|------------------|
| `/watch-me` | Loads public teaching page with CTAs to `/assessment`, `/143`, `/coaches` |
| `/go-first` | Loads public teaching page with CTAs to `/assessment`, `/143`, `/coaches` |
| `/be-the-light` | Loads public teaching page with CTAs to `/assessment`, `/143`, `/coaches` |
| `/assessment` | Loads landing page without login redirect (ungated) |
| `/assessment/instructions` | Redirects to `/login` (still gated) |
| `/assessment/setup` | Redirects to `/login` (still gated) |

**Status:** Middleware matcher updated. Concept pages are not in matcher (public by default).

---

## Pricing Tests

| Page | Check | Expected |
|------|-------|----------|
| `/pricing` | Report tier name | "Gravitational Stability Report" — $43 |
| `/pricing` | Portal tier name | "Portal Membership" — $14.33/mo |
| `/pricing` | Coaching tier | "10-Week Coaching" — $143/wk ($1,430 total) |
| `/pricing` | Comparison table | 3 columns: Report, Portal, Coaching |
| `/pricing` | Bottom CTA | "Get Your Report — $43" |
| `/upgrade` | Tier names | "Gravitational Stability Report" and "Portal Membership" |
| `/upgrade-your-os` | Tier names | "Gravitational Stability Report" and "Portal Membership" |
| `/coaches` | Pricing | "$143 per week for 10 weeks" in hero and CTA footer |
| `/coaches` | Hero CTA | "Get Your Report First" → `/assessment` |
| Checkout modal | Button labels | "Get Your Report ($43)" and "Portal Membership ($14.33/mo)" |

**Status:** All user-facing strings updated across pricing, upgrade, coaches, checkout client, inline checkout modal, ReportUpsell, Closing, FAQ, and page_copy.v1.ts.

---

## Portal Tests (Signed In)

| Check | Expected |
|-------|----------|
| Priority actions card | "Today" card with 3 actions appears in all 3 dashboard render paths |
| Action 1 | "Capture a moment" → `/reps` |
| Action 2 | "Take a small step" → `/watch-me` |
| Action 3 | "Daily Debrief" → `/reflect` |
| Weekly page title | "Weekly Scan" (not "Weekly Review") |
| Weekly page description | "Your system changes. This is your weekly snapshot." |
| ContextualActions label | "Weekly Scan" (not "Weekly Review") |

---

## Nav + Footer Tests

| Check | Expected |
|-------|----------|
| Desktop nav CTAs | Two CTAs: "Take the Assessment" (outline) + "Start 143" (gold filled) |
| Mobile nav CTAs | Both CTAs stacked vertically |
| Footer Practice column | `/framework`, `/143`, `/watch-me`, `/go-first`, `/be-the-light` |
| Footer Company column | `/about`, `/corporate`, `/faq`, `/privacy`, `/terms` |

---

## Security Tests

| Check | Expected |
|-------|----------|
| `/reports` paywall | `free_email` users redirected to `/upgrade` |
| `/reports` paywall | `paid_43`, `sub_active`, `sub_canceled`, `past_due` users pass through |
| `/archetypes` indexing | `robots: { index: false, follow: false }` in metadata |
| `/quiz` indexing | `robots: { index: false, follow: false }` in metadata |

---

## Files Changed Summary

| Action | File |
|--------|------|
| Create | `docs/BUILD_DECISIONS.md` |
| Create | `docs/QA_REPORT.md` |
| Create | `src/app/watch-me/page.tsx` |
| Create | `src/app/go-first/page.tsx` |
| Create | `src/app/be-the-light/page.tsx` |
| Modify | `next.config.ts` (redirects) |
| Modify | `src/lib/nav/nav-config.ts` (links, dual CTAs, footer) |
| Modify | `src/lib/analytics/taxonomy.ts` (new page view events) |
| Modify | `src/components/marketing/MarketingNav.tsx` (two CTAs) |
| Modify | `src/middleware.ts` (ungate assessment landing) |
| Modify | `src/app/pricing/page.tsx` (renamed tiers, added coaching) |
| Modify | `src/app/upgrade/page.tsx` (renamed tiers) |
| Modify | `src/app/upgrade-your-os/page.tsx` (renamed tiers) |
| Modify | `src/app/coaches/page.tsx` (added pricing) |
| Modify | `src/app/weekly/page.tsx` (Weekly Scan rename) |
| Modify | `src/app/login/page.tsx` (save-your-map messaging) |
| Modify | `src/app/reports/page.tsx` (paywall check) |
| Modify | `src/app/archetypes/page.tsx` (noindex) |
| Modify | `src/app/quiz/page.tsx` (noindex, rename) |
| Modify | `src/app/faq/page.tsx` (renamed tiers) |
| Modify | `src/components/billing/UpgradeCheckoutClient.tsx` (renamed buttons) |
| Modify | `src/components/billing/InlineCheckoutModal.tsx` (renamed labels) |
| Modify | `src/components/results/ReportUpsell.tsx` (renamed tiers) |
| Modify | `src/components/results/Closing.tsx` (renamed tiers) |
| Modify | `src/components/portal/PortalDashboard.tsx` (priority actions) |
| Modify | `src/components/portal/ContextualActions.tsx` (Weekly Scan) |
| Modify | `src/content/page_copy.v1.ts` (renamed tiers) |

---

## Deferred Items

1. **Full loginless assessment flow** — Anonymous sessions for answering questions without auth
2. **Google OAuth** — Supabase Google OAuth provider integration
3. **Stripe coaching checkout** — Wire `STRIPE_PRICE_COACHING_143` when ready (steps documented in BUILD_DECISIONS.md)
4. **Old page directory cleanup** — Delete redirect-source page directories in a separate PR
