# Drift Changelog

Append-only. Each BRALPH run adds an entry. Never overwrite previous entries.

---

## 2026-02-23 14:00 — Baseline 2026-02-23_1400

Summary: First BRALPH audit. Established initial baseline for 50 page routes and 53 API routes.

Findings:
- 7 public pages missing MarketingNav (BLOCKER)
- 2 banned-word violations in metadata descriptions
- 51 drift-scan canon violations across 26 files
- 1 smoke test failure (/toolkit 307)
- Missing sitemap.ts
- 2 security script findings
- 10 page structure issues from qa:pages

Fixes Applied:
- None (first run — documenting current state)

Tests: 2/8 QA scripts PASS, 1 SKIP, 5 FAIL
Status: RED — 7 blockers, 11 majors remain

---

## 2026-02-23 15:30 — Patch Pass 1

Summary: Fixed all 7 blockers + 6 majors. Added MarketingNav to 8 public pages, PortalTabBar to 9 auth pages, fixed 2 banned-word metadata descriptions.

Fixes Applied:
- QA-001–007: Added MarketingNav to /justin, /how-it-works, /enterprise, /archetypes, /outcomes, /143, /sample-report, /coach
- QA-008–009: Replaced "behind" in metadata for /justin and /about
- QA-016: Wrapped /reports in PageShell with PortalTabBar
- QA-017: Added MarketingNav to /coach
- QA-018: Resolved via QA-002 fix
- QA-022: Extended PortalTabBar to growth, morning, micro-joy, energy, weekly, reflect, plan, account

Verification:
- qa:tone PASS (0 banned-word violations)
- tsc --noEmit PASS (0 type errors)

Remaining: 0 blockers, 5 majors (drift-scan deferred, smoke test, sitemap, 2 page structure, security scripts), 3 minors
Status: YELLOW — blockers cleared, majors remain

---

## 2026-02-23 17:00 — Deep Page Map Audit (Pass 2)

Summary: Complete audit of all 50 pages. Read every page.tsx AND every client component they import. Fetched 10 live site pages to verify actual rendering. Found 4 new issues including 2 MarketingNav placement bugs and 2 navigation gap patterns.

Findings:
- /organizations and /resources had MarketingNav inside inner content div (constrained to 1200px instead of full-width)
- /assessment/setup has no navigation at all — user trapped in flow
- 13 portal pages have no top nav on desktop (PortalTabBar is mobile-bottom only)
- Root cause: layout.tsx only renders SiteFooter — no global header. Every page manually imports nav.
- Live site at Vercel still shows pre-patch state (local changes not deployed)

Fixes Applied:
- QA-023: Moved MarketingNav above content div in /organizations
- QA-024: Moved MarketingNav above content div in /resources

Verification:
- All 50 page.tsx files read and categorized
- 11 client components audited for internal headers
- 10 live site pages fetched and compared to source

Remaining: 0 blockers, 7 majors, 3 minors
Status: YELLOW — no blockers, structural architecture issue identified (no global nav)

---

## 2026-02-23 18:00 — Route Group Layout Restructure (Pass 3)

Summary: Eliminated the root cause of all navigation inconsistencies. Restructured the entire app into Next.js route groups with centralized layout files. No page can "forget" its nav — it is inherited from the group layout.

Architecture Changes:
- Created `(marketing)/layout.tsx` — provides `<main className="cosmic-page-bg"><MarketingNav />{children}</main>`
- Created `(portal)/layout.tsx` — provides `<PageShell after={<PortalTabBar />}>{children}</PageShell>`
- Created `(flow)/` group — no layout (each flow page controls its own wrapper)
- Moved 25 marketing pages into `(marketing)/` group
- Moved 13 portal pages into `(portal)/` group
- Moved 3 flow pages (welcome, preview, quiz) into `(flow)/` group
- Kept /assessment (with sub-routes) at root — conditional nav behavior requires manual handling
- Kept redirects (/, /dashboard) and internal tools (admin, spec-center, preview-cosmic) at root

Pages Modified (41 total):
- 25 marketing pages: removed per-page MarketingNav import + `<main>` wrapper
- 13 portal pages: removed per-page PageShell/PortalTabBar import + wrapper
- /assessment: fixed MarketingNav placement (was inside content div)
- /assessment/setup: added MarketingNav (was completely navless — QA-025 fixed)
- /archetypes: converted `<main>` to `<div>` preserving custom min-h-screen + bg-deep styles

Verification:
- tsc --noEmit PASS (0 type errors)
- next build PASS (all 50 routes compile, all URLs preserved)
- Route group parenthesized names are transparent to URL structure

Remaining: 0 blockers, 5 majors (drift-scan, smoke test, sitemap, SPINE tokens, security), 3 minors
Status: YELLOW — navigation architecture resolved, remaining issues are content/config
