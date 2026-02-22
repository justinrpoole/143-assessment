# Claim-to-Evidence Ledger

Version: `runtime-v1.1.0`
Last Updated: `YYYY-MM-DD`
Canonical Scoring Engine: `/Users/justinray/Downloads/143 Assessment Master/app/src/lib/scoring/score-assessment.mjs`
Canonical Question Bank: `/Users/justinray/Downloads/143 Assessment Master/app/src/content/questions.json` (143 items)
Canonical Monthly Retake Set: `/Users/justinray/Downloads/143 Assessment Master/app/src/lib/scoring/question-set.ts` (43 items)

## Audit Rule
- Every external-facing product claim must map to one runtime artifact and one evidence source.
- If citation confidence is below external-audit grade, claim is marked `LIMITED` until upgraded.

## Claim Matrix
| Claim ID | Public Claim | Runtime Artifact | Evidence Source | Citation Grade | Status |
|---|---|---|---|---|---|
| C-001 | Full assessment uses 143 questions. | `/Users/justinray/Downloads/143 Assessment Master/app/src/content/questions.json` + `/Users/justinray/Downloads/143 Assessment Master/app/scripts/audit/audit-build.mjs` | Build audit count check (`expected=143`) | A (deterministic in code) | ACTIVE |
| C-002 | Monthly retake uses 43 questions. | `/Users/justinray/Downloads/143 Assessment Master/app/src/lib/scoring/question-set.ts` + `/Users/justinray/Downloads/143 Assessment Master/app/src/components/assessment/AssessmentRunnerClient.tsx` | Runtime run-mode selection by `run_number` | A (deterministic in code) | ACTIVE |
| C-003 | Scoring output is deterministic across QA fixtures. | `/Users/justinray/Downloads/143 Assessment Master/app/src/lib/scoring/score-assessment.mjs` + `/Users/justinray/Downloads/143 Assessment Master/app/scripts/qa/qa-parity.mjs` | `qa:score` + `qa:parity` fixtures | A (replayable) | ACTIVE |
| C-004 | Reports resolve from canonical renderer and include required sections. | `/Users/justinray/Downloads/143 Assessment Master/app/src/lib/report/render-report-html.mjs` + `/Users/justinray/Downloads/143 Assessment Master/app/scripts/qa/qa-report.mjs` | Golden snapshot + section assertions | A (golden-locked) | ACTIVE |
| C-005 | PDF report is generated from canonical HTML and delivered by signed URL. | `/Users/justinray/Downloads/143 Assessment Master/app/src/app/api/runs/[runId]/report/pdf/route.ts` + `/Users/justinray/Downloads/143 Assessment Master/app/src/lib/report/render-report-pdf.mjs` | API integration checks + storage path assertions | B (runtime checks, env-dependent) | ACTIVE |
| C-006 | Purchase completion is webhook-truth only (not client return). | `/Users/justinray/Downloads/143 Assessment Master/app/src/app/api/stripe/webhook/route.ts` + `/Users/justinray/Downloads/143 Assessment Master/app/scripts/audit/audit-experience.mjs` | Static audit checks for `purchase_complete` location | A (rule-enforced) | ACTIVE |
| C-007 | Growth tracking compares run deltas over time. | `/Users/justinray/Downloads/143 Assessment Master/app/src/app/api/growth/summary/route.ts` + `/Users/justinray/Downloads/143 Assessment Master/app/src/components/retention/GrowthSummaryClient.tsx` | API + client comparison rendering | B (behavior verified in app runtime) | ACTIVE |
| C-008 | Tone bans enforced in content/page copy. | `/Users/justinray/Downloads/143 Assessment Master/app/scripts/qa/qa-tone.mjs` + `/Users/justinray/Downloads/143 Assessment Master/app/scripts/qa/lint-content.mjs` | QA failures on banned terms | A (automated) | ACTIVE |

## External-Citation Upgrade Backlog
| Backlog ID | Needed for Audit-Grade External Scrutiny | Current Gap | Owner | Target |
|---|---|---|---|---|
| R-001 | Construct-to-literature traceability for each Ray definition | Runtime is defined, but external citation links are not bundled in one machine-readable file | Product + Research | Pre-public launch |
| R-002 | Reliability/validity benchmark set with documented sampling method | QA determinism exists, psychometric benchmark report is not yet in runtime docs | Research lead | Beta milestone |
| R-003 | Claim-level citation IDs in generated reports | Report output currently does not expose citation references | Product + Engineering | Phase 3 |

## Release Gate
- Launch is blocked for any claim marked `LIMITED` if that claim appears in paid conversion pages.
- Launch is blocked if `qa:score`, `qa:parity`, or `qa:report` fails.
