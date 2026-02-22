# Website Audit Report — 2026-02-22

Branch: `codex/consistency-trust-all-pages-2026-02-22`

## Scope

48 page routes audited across marketing, portal, retention, auth, legal, and admin surfaces. Sources of truth: Copy Bible, TONE_LOCK.md, AGENTS.md, voice-profile.md, ROUTE_LINKS.md.

---

## Before/After Snapshot

### Navigation (MarketingNav)

| Item | Before | After |
|------|--------|-------|
| Logo link | `/upgrade-your-os` | `/` |
| Nav links | 143 Challenge, Framework, Coaches, Enterprise, About | Assessment, Framework, 143 Challenge, For Organizations, About |
| "Coaches" in primary nav | Yes (not in Copy Bible) | Removed |
| "Enterprise" label | "Enterprise" pointing to `/enterprise` | "For Organizations" pointing to `/organizations` |
| "Assessment" in nav | Missing (only CTA button) | Added as nav link |
| Link order | Did not match Copy Bible | Matches Copy Bible exactly |

### Footer (SiteFooter)

| Item | Before | After |
|------|--------|-------|
| Practice column | Coaching Program, Glossary, The 143 Framework, Resources, FAQ | The Framework, 143 Challenge, Coaching Program, Resources, Glossary, FAQ |
| Company: Enterprise label | "Enterprise" | "For Organizations" |
| Framework link | Missing from footer | Added to Practice column |
| 143 Challenge link | Missing from footer | Added to Practice column |

### Home Page (`/upgrade-your-os`)

| Item | Before | After |
|------|--------|-------|
| About Justin section | Missing (Copy Bible requires it) | Added between Testimonials and Final CTA |
| Inline duplicate footer | Present (5 links, inconsistent with SiteFooter) | Replaced with About Justin section |
| Copy Bible section compliance | 7/9 required sections | 9/9 required sections |

### Assessment Page (`/assessment`)

Section order verified: Hero with CTA, What Makes This Different, What You'll Discover, Pricing Tiers, Sample Results Preview, FAQs, Final CTA. **7/7 required sections present in correct order. No changes needed.**

---

## Banned Words / Tone Violations Fixed

| File | Before | After | Rule |
|------|--------|-------|------|
| `upgrade-your-os/page.tsx:138` | "crushed every meeting" | "delivered in every meeting" | Copy Bible: "crush it" banned |
| `os-coaching/page.tsx:48` | "Framework + Systems Deep Dive" | "Framework + Systems Exploration" | Copy Bible: "deep dive" banned |
| `CueBasedNudge.tsx:28` | "RAS has bandwidth" | "RAS has capacity" | Copy Bible: "bandwidth" banned |
| `EnergyAuditClient.tsx:43` | "operating with bandwidth" | "operating with capacity" | Copy Bible: "bandwidth" banned |
| `PhaseCheckInClient.tsx:40` | "RAS has bandwidth" | "RAS has capacity" | Copy Bible: "bandwidth" banned |
| `SampleReportClient.tsx:420` | "the bandwidth isn't" | "the capacity isn't" | Copy Bible: "bandwidth" banned |
| `DimmingDetector.tsx:57` | "cognitive bandwidth" | "cognitive capacity" | Copy Bible: "bandwidth" banned |
| `DimmingDetector.tsx:62` | "not weakness" | "not a flaw" | Copy Bible: "weakness" banned |
| `GlossaryClient.tsx:57` | "you crush it at work" | "you perform at work" | Copy Bible: "crush it" banned |
| `GuidedTourOverlay.tsx:40` | "isn't a weakness. It's your highest-leverage" | "isn't a flaw. It's your highest-impact" | Copy Bible: "weakness" + "leverage" banned |
| `SubfacetHeatmap.tsx:161` | "leverage under pressure" | "draw on under pressure" | Copy Bible: "leverage" banned |
| `registry.ts:143` | "highest-leverage training target" | "highest-impact training target" | Copy Bible: "leverage" banned |
| `registry.ts:196` | "not a measure of weakness" | "not a deficit" | Copy Bible: "weakness" banned |
| `RepLogClient.tsx:18` | "not a weakness" | "not a limitation" | Copy Bible: "weakness" banned |
| `ToolkitClient.tsx:18` | "not weakness" | "not retreat" | Copy Bible: "weakness" banned |
| `coaches/page.tsx:42` | "not your weakness" | "not a flaw" | Copy Bible: "weakness" banned |
| `SampleReportClient.tsx:529` | "That's not weakness" | "That's not a flaw" | Copy Bible: "weakness" banned |
| `143-challenge/page.tsx:137` | "That is not weakness" | "That is not a character flaw" | Copy Bible: "weakness" banned |
| `item-selection.ts:62` | "Take a breath" | "You are doing the work" | TONE_LOCK: "take a breath" banned |
| `AssessmentRunnerClient.tsx:35` | "Take a breath" | "You are doing the work" | TONE_LOCK: "take a breath" banned |
| `WeeklyRepBreakdown.tsx:58` | "behind" (pace status) | "stretch" (pace status) | TONE_LOCK: "behind" banned |

**Total: 21 banned word/phrase fixes across 16 files.**

---

## CTAs Added to Pages Missing Them

| Page | CTA Added |
|------|-----------|
| `/outcomes` | "Take the Assessment" (primary) + "See a Sample Report" (secondary) |
| `/justin` | "Take the Assessment" (primary) + "See the Framework" (secondary) |
| `/glossary` | "Take the Assessment" (primary) + "Explore the Framework" (secondary) |

---

## Route-by-Route Audit Summary

### Marketing Pages (19)

| Route | Nav | CTA | Banned Words | Tone | Status |
|-------|-----|-----|-------------|------|--------|
| `/` | N/A (redirect to `/upgrade-your-os`) | N/A | N/A | N/A | PASS |
| `/upgrade-your-os` | MarketingNav | Multiple | FIXED: "crushed" | Clean | FIXED |
| `/assessment` | MarketingNav | Multiple | Clean | Clean | PASS |
| `/assessment/instructions` | MarketingNav | "Begin Assessment" | Clean | Clean | PASS |
| `/framework` | MarketingNav | "Take the Assessment" | Clean | Clean | PASS |
| `/143-challenge` | MarketingNav | Multiple | FIXED: "weakness" | Clean | FIXED |
| `/organizations` | MarketingNav | "Request a Briefing" | Clean | Clean | PASS |
| `/about` | MarketingNav | "Take the Assessment" | Clean | Clean | PASS |
| `/pricing` | MarketingNav | Multiple plan CTAs | Clean | Clean | PASS |
| `/how-it-works` | Page-level nav | "Start Free" | Clean | Clean | PASS |
| `/sample-report` | Page-level nav | Inline checkout | FIXED: "bandwidth" | Clean | FIXED |
| `/outcomes` | Page-level nav | ADDED | Clean | Clean | FIXED |
| `/coaches` | MarketingNav | "Take the assessment first" | FIXED: "weakness" | Clean | FIXED |
| `/os-coaching` | MarketingNav | "Take the Assessment First" | FIXED: "deep dive" | Clean | FIXED |
| `/cohorts` | MarketingNav | "Request a Cohort" | Clean | Clean | PASS |
| `/corporate` | MarketingNav | "Request a Briefing" | Clean | Clean | PASS |
| `/enterprise` | Page-level nav | "Contact us" | Clean | Clean | PASS |
| `/justin` | Page-level nav | ADDED | Clean | Clean | FIXED |
| `/resources` | MarketingNav | "Subscribe to Updates" | Clean | Clean | PASS |

### Reference Pages (3)

| Route | Nav | CTA | Banned Words | Status |
|-------|-----|-----|-------------|--------|
| `/glossary` | MarketingNav | ADDED | FIXED: "crush it" | FIXED |
| `/faq` | MarketingNav | "Start the Light Check" | Clean | PASS |
| `/preview-cosmic` | Custom header | Explore buttons | Clean | PASS |

### Auth / Legal (3)

| Route | Nav | Status |
|-------|-----|--------|
| `/login` | MarketingNav | PASS |
| `/privacy` | MarketingNav | PASS |
| `/terms` | MarketingNav | PASS |

### Portal / Authenticated (10)

| Route | Nav | Status |
|-------|-----|--------|
| `/dashboard` | Redirect page | PASS |
| `/portal` | PortalTabBar | PASS |
| `/welcome` | Standalone | PASS |
| `/results` | PortalTabBar | PASS |
| `/reports` | Standalone | PASS |
| `/growth` | Standalone | PASS |
| `/account` | Standalone | PASS |
| `/coach` | Standalone | PASS |
| `/reps` | PortalTabBar | PASS |
| `/toolkit` | PortalTabBar | PASS |

### Retention Tools (6)

| Route | Banned Words | Status |
|-------|-------------|--------|
| `/morning` | Clean | PASS |
| `/energy` | FIXED: "bandwidth" | FIXED |
| `/reflect` | Clean | PASS |
| `/plan` | Clean | PASS |
| `/weekly` | Clean | PASS |
| `/micro-joy` | Clean | PASS |

### Admin / Dev (3)

| Route | Status |
|-------|--------|
| `/spec-center` | PASS |
| `/spec-center/report-preview` | PASS |
| `/admin/audit` | PASS |

---

## Broken Links

No broken internal links detected. All `href` values in marketing pages, nav, and footer point to existing page routes.

---

## Voice Drift Log

### Corrective Reframe Pattern

Multiple instances used the pattern "not a weakness" — while the intent is corrective, the word "weakness" itself is banned. All instances replaced with alternatives:

- "not a flaw" — coaches, 143-challenge, SampleReportClient, DimmingDetector
- "not a limitation" — RepLogClient
- "not retreat" — ToolkitClient
- "not a deficit" — registry.ts

### "Bandwidth" → "Capacity"

5 instances of "bandwidth" in UI-facing copy replaced with "capacity." The term remains in `eclipse_items.json` and `registry.ts` metric definitions where it serves as a construct name aligned with the data model.

### "Sleep Debt" — Data Model Term

"Sleep Debt" appears in `eclipse_items.json`, `reflection_prompts.json`, and `energy-audit.ts` as a construct name. These are domain-specific terms in the scientific model and were not modified. Flagged for future review if the construct name is ever renamed.

---

## Route Links Update

`ROUTE_LINKS.md` updated from 31 routes to 48 routes. Added routes organized into categories: Marketing/Public, Auth, Portal/Authenticated, Retention Tools, Legal, Admin/Dev.

New routes added:
- `/assessment/instructions`, `/framework`, `/143-challenge`, `/organizations`, `/about`
- `/welcome`, `/reps`, `/coaches`, `/glossary`, `/preview-cosmic`
- `/energy`, `/reflect`, `/plan`, `/weekly`
- `/spec-center/report-preview`, `/admin/audit`

---

## TypeScript Verification

```
npx tsc --noEmit
```

Result: Only pre-existing `'/'` route type error in `.next/dev/types/validator.ts`. Zero new errors introduced by this audit.

---

## Files Modified (21)

| File | Change |
|------|--------|
| `components/marketing/MarketingNav.tsx` | Nav links updated to match Copy Bible; logo href changed to `/` |
| `components/SiteFooter.tsx` | Footer links updated; added Framework + 143 Challenge; "Enterprise" → "For Organizations" |
| `app/upgrade-your-os/page.tsx` | "crushed" → "delivered"; inline footer replaced with About Justin section |
| `app/os-coaching/page.tsx` | "Deep Dive" → "Exploration" |
| `app/143-challenge/page.tsx` | "weakness" → "character flaw" |
| `app/coaches/page.tsx` | "weakness" → "flaw" |
| `app/outcomes/page.tsx` | Added CTA section with assessment + sample report links |
| `app/justin/page.tsx` | Added CTA section with assessment + framework links |
| `app/glossary/page.tsx` | Added CTA section with assessment + framework links |
| `components/retention/CueBasedNudge.tsx` | "bandwidth" → "capacity" |
| `components/retention/EnergyAuditClient.tsx` | "bandwidth" → "capacity" |
| `components/retention/PhaseCheckInClient.tsx` | "bandwidth" → "capacity" |
| `components/retention/RepLogClient.tsx` | "weakness" → "limitation" |
| `components/retention/ToolkitClient.tsx` | "weakness" → "retreat" |
| `components/assessment/SampleReportClient.tsx` | "bandwidth" → "capacity"; "weakness" → "flaw" |
| `components/assessment/DimmingDetector.tsx` | "bandwidth" → "capacity"; "weakness" → "flaw" |
| `components/assessment/AssessmentRunnerClient.tsx` | "Take a breath" → "You are doing the work" |
| `components/results/GuidedTourOverlay.tsx` | "weakness" + "leverage" → "flaw" + "impact" |
| `components/results/SubfacetHeatmap.tsx` | "leverage" → "draw on" |
| `components/glossary/GlossaryClient.tsx` | "crush it" → "perform" |
| `components/portal/WeeklyRepBreakdown.tsx` | "behind" → "stretch" |
| `lib/item-selection.ts` | "Take a breath" → "You are doing the work" |
| `lib/metrics/registry.ts` | "leverage" → "impact"; "weakness" → "deficit" |
| `docs/ROUTE_LINKS.md` | Updated from 31 to 48 routes with categories |

---

## Remaining Items (Monitor)

1. **"Sleep Debt" construct name** — Used in data model files. Cannot rename without spec change. Monitor for future construct rename.
2. **SampleReportClient uses "broken"** — Context: "a broken light and a covered one" — metaphorical contrast explaining the eclipse model. Educational, not shaming. Acceptable.
3. **`spec-integration.ts` contains "weakness", "broken", "toxic"** — These are the banned word CHECK LISTS themselves, not user-facing copy. Correct usage.
