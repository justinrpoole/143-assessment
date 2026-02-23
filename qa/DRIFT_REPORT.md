# Drift Report

Generated: 2026-02-23
Baseline: 2026-02-23_1400 vs **none (first run)**

## Summary

First BRALPH run — no previous baseline exists for comparison. This report establishes the initial truth snapshot.

All findings are documented in [QA_ISSUES.md](./QA_ISSUES.md).

## Baseline Established

| Category | Count | Notes |
|----------|-------|-------|
| Page routes | 50 | All discovered from src/app/ directory |
| API routes | 53 | Including 3 dynamic segments |
| Pages with MarketingNav | 19 | Public/marketing pages |
| Pages with PortalTabBar | 4 | portal, results, reps, toolkit |
| Pages with PageShell only | 8 | growth, account, micro-joy, energy, plan, weekly, reflect, morning |
| Pages with NO nav | 9 | 7 public pages (BLOCKERS) + 2 redirects |
| Admin/preview/flow pages | 7 | Intentionally no nav |
| Nav items (canonical) | 6 | Assessment, Archetypes, Framework, 143 Challenge, For Organizations, About |

## QA Script Results

| Script | Status | Details |
|--------|--------|---------|
| qa:env | SKIP | Non-CI environment; 6 required vars missing (expected in dev) |
| qa:tone | FAIL | 2 banned-word hits ("behind") |
| qa:pages | FAIL | 10 structural issues |
| qa:drift-scan | FAIL | 51 canon violations across 26 files |
| qa:events | PASS | 82 canonical, 66 emitted, 0 unknown |
| qa:security | FAIL | 2 service key findings in scripts |
| qa:content | PASS | 143 questions, 9 rays, 36 pairs clean |
| qa:smoke | FAIL | 1 route failure (/toolkit → 307) |

## Next Drift Comparison

The next BRALPH run will compare against this baseline (2026-02-23_1400) to detect:
- Route additions/removals
- Nav structure changes
- Content hash changes
- Layout usage changes
