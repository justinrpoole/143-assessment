# QA Issues — 143 Leadership Assessment App

Generated: 2026-02-23
Baseline: 2026-02-23_1400 (first run)
Last updated: 2026-02-23 (post-route-group-restructure)

## Summary

| Severity  | Open  | Fixed  | Total  |
|-----------|-------|--------|--------|
| Blocker   | 0     | 7      | 7      |
| Major     | 5     | 12     | 17     |
| Minor     | 3     | 1      | 4      |
| **Total** | **8** | **20** | **28** |

---

## Blockers

| ID | Route | Type | Description | Location | Proposed Fix | Status |
|----|-------|------|-------------|----------|-------------|--------|
| QA-001 | /justin | layout | Public marketing page missing MarketingNav | `src/app/justin/page.tsx` | Add `<MarketingNav />` after `<main>` opening tag | **Fixed** |
| QA-002 | /how-it-works | layout | Public marketing page missing MarketingNav | `src/app/how-it-works/page.tsx` | Add `<MarketingNav />` after `<main>` opening tag | **Fixed** |
| QA-003 | /enterprise | layout | Public marketing page missing MarketingNav | `src/app/enterprise/page.tsx` | Wrapped in `<main>` with `<MarketingNav />` | **Fixed** |
| QA-004 | /archetypes | layout | Public marketing page missing MarketingNav — linked from nav | `src/app/archetypes/page.tsx` | Add `<MarketingNav />` before ArchetypeLibraryClient | **Fixed** |
| QA-005 | /outcomes | layout | Public marketing page missing MarketingNav | `src/app/outcomes/page.tsx` | Add `<MarketingNav />` after `<main>` opening tag | **Fixed** |
| QA-006 | /143 | layout | Public page (challenge variant) missing MarketingNav | `src/app/143/page.tsx` | Add `<MarketingNav />` after `<main>` opening tag | **Fixed** |
| QA-007 | /sample-report | layout | Conversion-critical page missing MarketingNav | `src/app/sample-report/page.tsx` | Add `<MarketingNav />` before report content | **Fixed** |

---

## Majors

| ID | Route | Type | Description | Location | Proposed Fix | Status |
|----|-------|------|-------------|----------|-------------|--------|
| QA-008 | /justin | tone | Metadata description contained banned word "behind" | `src/app/justin/page.tsx:11` | Rewritten: "the builder of the 143 Leadership framework" | **Fixed** |
| QA-009 | /about | tone | Metadata description contained banned word "behind" | `src/app/about/page.tsx:11` | Rewritten: "The 20-year journey that built the 143 Leadership framework" | **Fixed** |
| QA-010 | multiple | content | qa:drift-scan found 51 canon violations across 26 files — banned phrases including "failure", "broken", "alpha", "kill it", "you never", "personality test/type", "weakness" | `scripts/qa/qa-drift-scan.mjs` output | Run `npm run qa:drift-scan` for full list; address each file | Open (deferred) |
| QA-011 | /toolkit | route | Smoke test failure — returns 307 redirect to login instead of expected 200 | `src/middleware.ts` | Align smoke test expectation with middleware reality | Open |
| QA-012 | global | seo | No sitemap.ts or sitemap.xml | Missing file | Create `src/app/sitemap.ts` | Open |
| QA-013 | /upgrade-your-os | content | qa:pages reports missing centralized copy import — 7 SPINE tokens + questionBand | `src/app/upgrade-your-os/page.tsx` | Wire PAGE_COPY_V1 spine tokens | Open |
| QA-014 | /sample-report | content | qa:pages reports missing renderReportHtml function | `src/app/sample-report/page.tsx` | Update qa:pages expectation if architecture changed | Open |
| QA-015 | scripts | security | 2 scripts use Supabase service role keys without JWT guard | `scripts/` directory | Document as dev-only scripts excluded from production | Open |
| QA-016 | /reports | layout | Authenticated page missing PortalTabBar | `src/app/reports/page.tsx` | Wrapped in `<PageShell after={<PortalTabBar />}>` | **Fixed** |
| QA-017 | /coach | layout | Public page missing MarketingNav | `src/app/coach/page.tsx` | Wrapped in `<main>` with `<MarketingNav />` | **Fixed** |
| QA-018 | global | seo | Footer links include "How It Works" but page had no nav | `how-it-works/page.tsx` | Fixed via QA-002 | **Fixed** |

---

## Minors

| ID | Route | Type | Description | Location | Proposed Fix | Status |
|----|-------|------|-------------|----------|-------------|--------|
| QA-019 | global | perf | No dynamic imports for large cosmic components (800-1400 LOC) | `src/components/cosmic/` | Consider `next/dynamic` for below-fold components | Open |
| QA-020 | global | a11y | Color contrast unverified for brand gold on cosmic background | `tokens.css` | Run WCAG AA contrast check | Open |
| QA-021 | global | analytics | 16 canonical events not emitted — may be planned for future | `qa:events` output | Review against current scope | Open |
| QA-022 | auth pages | layout | 8 auth tool pages now have PortalTabBar | Multiple `src/app/*/page.tsx` | PortalTabBar added to all auth pages | **Fixed** |

---

## Issues Added — Deep Page Map Audit (2026-02-23 Pass 2)

### Majors

| ID       | Route           | Type   | Description                                                                                             | Location                            | Proposed Fix                                                          | Status     |
|----------|-----------------|--------|---------------------------------------------------------------------------------------------------------|-------------------------------------|-----------------------------------------------------------------------|------------|
| QA-023   | /organizations  | layout | MarketingNav was placed inside inner `<div class="mx-auto max-w-6xl">` — constrained to 1200px box     | `src/app/organizations/page.tsx`    | Moved MarketingNav above the content div to be direct child of `<main>` | **Fixed**  |
| QA-024   | /resources      | layout | MarketingNav was placed inside inner `<div class="mx-auto max-w-6xl">` — constrained to 1200px box     | `src/app/resources/page.tsx`        | Moved MarketingNav above the content div to be direct child of `<main>` | **Fixed**  |
| QA-025   | /assessment/setup | layout | No navigation at all — user entering assessment flow has no way to navigate back | `src/app/assessment/setup/page.tsx` | Added MarketingNav to page | **Fixed** |
| QA-026   | 13 portal pages | layout | Portal pages have PortalTabBar (mobile bottom only) but NO top navigation on desktop — no logo, no links | Multiple `src/app/(portal)/*/page.tsx` | Add a portal top bar or lightweight header for desktop | Open |
| QA-027   | /assessment | layout | MarketingNav was inside inner content div (constrained width) in overview mode | `src/app/assessment/page.tsx` | Moved MarketingNav above content div | **Fixed** |

---

## Route Group Restructure (2026-02-23 Pass 3)

### Architecture Fix

Root cause of all navigation inconsistencies has been resolved. The app now uses Next.js route group layouts:

- `(marketing)/layout.tsx` — provides MarketingNav to all 25 marketing pages automatically
- `(portal)/layout.tsx` — provides PageShell + PortalTabBar to all 13 portal pages automatically
- `(flow)/` — 3 flow pages (welcome, preview, quiz) with no shared nav (intentional)
- Root level — /assessment (conditional nav), redirects, and internal tools

No page can "forget" its nav. New pages added to a group inherit the correct layout automatically.

Files moved: 41 page directories. Files edited: 41 pages (stripped per-page nav). New files: 2 layout files.
Build verification: tsc PASS, next build PASS, all 50 routes preserved.
