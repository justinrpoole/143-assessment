# Improvement Recommendations

Generated: 2026-02-23
Baseline: 2026-02-23_1400

Strategic improvements organized by theme. These are NOT blockers — they are recommendations for raising the quality bar after current issues are resolved.

---

## 1. Consistency — Centralize Navigation in Layout

| Field | Value |
|-------|-------|
| **Description** | Move MarketingNav into a route group layout (e.g., `(marketing)/layout.tsx`) instead of per-page imports. This eliminates the root cause of QA-001 through QA-007 — new pages cannot forget to add nav because it comes from the layout. Similarly, create an `(app)/layout.tsx` with PortalTabBar for authenticated pages. |
| **Impact** | High — prevents entire category of future drift |
| **Effort** | M — requires creating 2 route group directories and moving 50 page files |
| **Risk** | Medium — large structural change, test thoroughly |
| **Dependencies** | Fix all current nav-missing blockers first |
| **Order** | 1 |

## 2. SEO — Add Sitemap and Structured Data

| Field | Value |
|-------|-------|
| **Description** | Create `src/app/sitemap.ts` exporting all public routes with lastModified dates. Add JSON-LD structured data for Organization, Product (assessment), and FAQ pages. |
| **Impact** | High — directly affects search engine indexing and rich results |
| **Effort** | S — one file for sitemap, small additions per page for JSON-LD |
| **Risk** | Low |
| **Dependencies** | None |
| **Order** | 2 |

## 3. UX Clarity — Unified Navigation for Authenticated Pages

| Field | Value |
|-------|-------|
| **Description** | Currently only 4 of 12 authenticated pages have PortalTabBar. Users on /morning, /micro-joy, /growth, /energy, /weekly, /reflect, /plan, /account have no tab navigation to other sections. Consider extending PortalTabBar to all auth pages or adding a sidebar/breadcrumb pattern. |
| **Impact** | High — users currently get stuck on tool pages with no easy way back to portal |
| **Effort** | S — add `after={<PortalTabBar />}` to PageShell usage in 8 files |
| **Risk** | Low |
| **Dependencies** | None |
| **Order** | 3 |

## 4. Maintainability — Single Nav Config Drives All Components

| Field | Value |
|-------|-------|
| **Description** | MarketingNav has its own `NAV_LINKS` array, SiteFooter has its own link arrays, and PortalTabBar has its own links. Create a single `src/lib/nav/nav-config.ts` that all three consume. Changes to navigation should require editing one file only. |
| **Impact** | Medium — prevents nav/footer link drift |
| **Effort** | S — extract arrays to shared config, update 3 imports |
| **Risk** | Low |
| **Dependencies** | None |
| **Order** | 4 |

## 5. Speed — Lazy Load Cosmic Visualizations

| Field | Value |
|-------|-------|
| **Description** | Components like SolarCoreScore (898 LOC), EclipseMeter (803 LOC), RepLogClient (1,359 LOC) are large client-side bundles. Use `next/dynamic` with `ssr: false` for below-fold cosmic components on /results and /reports pages. |
| **Impact** | Medium — reduces initial bundle size for report pages |
| **Effort** | S — wrap imports in `dynamic()` calls |
| **Risk** | Low — components already client-side |
| **Dependencies** | None |
| **Order** | 5 |

## 6. Accessibility — Color Contrast Audit

| Field | Value |
|-------|-------|
| **Description** | Verify WCAG AA compliance for all text color + background combinations. Key pairs to check: brand gold (#F8D011) on deep purple (#1A0A2E), muted text (rgba(255,255,255,0.5)) on deep purple, secondary text (rgba(255,255,255,0.75)) on glass-card surfaces. |
| **Impact** | Medium — legal compliance and usability |
| **Effort** | S — run contrast checker, adjust tokens if needed |
| **Risk** | Low |
| **Dependencies** | None |
| **Order** | 6 |

## 7. Testing — Expand Playwright Smoke Suite

| Field | Value |
|-------|-------|
| **Description** | Current Playwright tests cover e2e journey and visual lead engine. Add smoke tests for: (1) every public page returns 200, (2) MarketingNav renders on all public pages, (3) SiteFooter renders on all pages, (4) PortalTabBar renders on auth pages. These tests prevent nav drift from returning. |
| **Impact** | High — prevents regression of current blockers |
| **Effort** | M — write ~4 test files with page iteration |
| **Risk** | Low |
| **Dependencies** | Fix current blockers first so tests pass on creation |
| **Order** | 7 |

## 8. Trust — Canon Drift Prevention Gate

| Field | Value |
|-------|-------|
| **Description** | Add `qa:drift-scan` as a pre-commit hook or CI gate. The 51 violations found this run suggest drift accumulates between audits. A gate that fails on banned phrases prevents new violations from entering the codebase. |
| **Impact** | High — prevents tone/canon violations at the source |
| **Effort** | S — add to .husky/pre-commit or CI pipeline |
| **Risk** | Low — already a working script |
| **Dependencies** | Fix current 51 violations first |
| **Order** | 8 |
