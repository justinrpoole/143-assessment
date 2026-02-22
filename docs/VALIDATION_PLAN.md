# Validation Plan

## Alpha (10-20 participants)
- Method: cognitive interviews with guided think-aloud.
- Target: 10-20 users.
- Focus:
  - question clarity and interpretation
  - results resonance and confidence in next step
  - friction in preview -> assessment setup -> assessment transition
- Output: issue log with wording, flow, and comprehension fixes.

## Pilot (100-300 participants)
- Method: live pilot cohort with full production flow.
- Target: 100-300 users.
- Measurement:
  - item-level stats (missingness, distribution, floor/ceiling)
  - internal consistency per ray
  - ray-pair stability and confidence-band coverage
- Output: candidate adjustments list for post-pilot hardening.

## Beta (launch-candidate hardening)
- Method: near-production load with operational monitoring.
- Focus:
  - webhook-truth entitlement transitions
  - report HTML/PDF reliability and storage retrieval
  - share card generation reliability
  - auth + gating correctness by user_state
- Exit criteria:
  - QA suite pass and no unknown events
  - stable funnel progression across staged cohorts

## Test-Retest (2-3 weeks)
- Re-run the same users at 2-3 weeks.
- Evaluate:
  - top-ray stability where behavior is stable
  - expected directional changes when behavior reps increase
  - confidence-band consistency

## Sensitivity to Change
- Tie movement to observed behavior usage:
  - REPs engagement
  - morning module usage
  - micro-joy usage
- Compare change magnitude between active users and low-engagement users.

## Success Metrics by Funnel Routes + Events
- `/143` -> `/preview` -> `/upgrade` -> `/assessment` -> `/results` -> `/growth`
- Event mapping:
  - acquisition: `page_view_143`, `email_captured`
  - preview: `preview_start`, `preview_complete`, `snapshot_preview_rendered`
  - monetization: `upgrade_view`, `checkout_start`, `purchase_complete`
  - assessment: `full_assessment_start`, `full_assessment_complete`
  - results/report: `results_view`, `report_download`
  - retention/growth: `retake_complete`, `growth_view`, `milestone_checkpoint_view`
