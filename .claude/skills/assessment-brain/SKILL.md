---
name: assessment-brain
description: >
  Generate 143 Leadership assessment intelligence reports that are state-aware,
  confidence-rated, and tools-first. Use when you need participant reports,
  executive summaries, quick reads, evidence-led interpretations, or an
  "assessment brain" that turns scored assessment data into clear guidance.
  Triggers on: assessment brain, build report, executive summary, quick read,
  interpret scores, report framework, evidence-led assessment, citations in
  assessment reports.
---

# /assessment-brain — 143 Assessment Intelligence Made Easy

Turn scored assessment data into clear, compliant, evidence-led reports.
Do not alter scoring logic. Do not change item registry structures.

Follow all output formatting rules from _system/output-format.md.

## 143 Leadership Source Files (canonical)
Canonical assessment architecture lives at:
`/Users/justinray/Library/Mobile Documents/com~apple~CloudDocs/143 Leadership/143 Assessment Master/`

Read these files before generating any report:
- 02_LIBRARIES/Assessment_Report_Framework.md
- 02_LIBRARIES/Assessment_Intelligence_Engine_MASTER.md
- 02_LIBRARIES/Question_to_Intelligence_Tagging_Map.md
- 07_OBSIDIAN_VAULT/01_AUTHORITY/HOW_RESULTS_ARE_INTERPRETED.md
- 07_OBSIDIAN_VAULT/01_AUTHORITY/WHAT_THEY_GET.md
- 07_OBSIDIAN_VAULT/01_AUTHORITY/WHAT_THIS_ASSESSMENT_IS.md
- STEP16_App_Build_Spec/14A_Glossary_DisplayTerms_v2.md
- STEP16_App_Build_Spec/14E_Report_CopyPack_ToneRepaired_v2.md

## Brand Context
Load Justin Ray voice and brand context:
- ./brand/profiles/justin-ray/voice-profile.md
- ./brand/profiles/justin-ray/positioning.md (if present)
- ./brand/profiles/justin-ray/audience.md (if present)
- ./brand/stack.md (tool availability)
- ./brand/assets.md and ./brand/learnings.md (append-only)

## Inputs
Scored assessment data is required. If missing, route to /assessment-engine.
Expected input:
- ./assessments/{id}-scored.md

## Outputs
Write all reports to ./assessments/:
- ./assessments/{id}-brain-report.md
- ./assessments/{id}-brain-quickread.md
- ./assessments/{id}-brain-executive-summary.md
- ./assessments/{id}-brain-metadata.json

## Evidence and Citations
If any research-backed claim appears in a report:
1) Capture the evidence via /knowledge-vault.
2) Embed citations inline in the report output.
3) Store citation IDs in the metadata JSON.

## Interpretation Order (non-negotiable)
Always interpret in this order:
1) Eclipse (state)
2) Confidence Band
3) Overall Pattern
4) Light Signature (Top Two)
5) Eclipsed Ray (training target)
6) Recommendations

## Glossary Compliance (non-negotiable)
Use display terms from 14A_Glossary_DisplayTerms_v2.md.
Banned in user-facing copy: "load" and any diagnostic language.

## Workflow

### Step 1: Preflight
- Confirm brand is Justin Ray / 143 Leadership.
- Confirm required canonical files exist.
- Confirm ./assessments/{id}-scored.md exists.
- If missing, route to /assessment-engine (score first).

### Step 2: Parse Scored Data
Extract and validate required fields:
- Eclipse band (low/medium/high)
- Confidence band (A-D)
- Top Two Rays
- Eclipsed Ray (training target)
- Shine/Eclipse per Ray
- Usable Range per Ray
- Work/Life discrepancies
- Validity flags and acting risk
- Tool readiness and recommended tools

Validate against schema:
- assessment-brain/schemas/assessment-brain.schema.json

### Step 3: Assemble Reports
Use templates in assessment-brain/templates/:
- brain-report-template.md (participant report)
- brain-quickread-template.md (2-minute version)
- brain-executive-template.md

Include enhancements (v1) from references/brain-enhancements.md.
Gate any v1.1 features when required data is missing.

### Step 4: Evidence Capture
If a report includes research-backed claims:
- Capture sources via /knowledge-vault.
- Embed citations inline.
- Record citation IDs in metadata JSON.

### Step 5: QA and Compliance
Use references/brain-qa-checklist.md:
- Verify interpretation order
- Verify confidence band language
- Verify glossary terms
- Verify no clinical/diagnostic language
- Verify "state-limited" language when Eclipse is high

### Step 6: Save + Register
- Write outputs to ./assessments/
- Append asset rows to ./brand/assets.md

## Output Guidance
Reports must be:
- State-aware
- Confidence-rated
- Tools-first
- Non-clinical, non-shaming
- Evidence-led when research claims appear

## When to Chain Skills
- Missing scored data -> /assessment-engine
- Research needed -> /knowledge-vault
- Report copy polish -> /direct-response-copy
- Delivery sequence -> /email-sequences
