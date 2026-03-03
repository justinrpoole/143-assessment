# 143 Assessment

[![QA Gates E2E](https://github.com/justinrpoole/143-assessment/actions/workflows/qa-gates-e2e.yml/badge.svg)](https://github.com/justinrpoole/143-assessment/actions/workflows/qa-gates-e2e.yml)

Leadership signal product with gated marketing flows, stability preview, and ray methodology pages.

## Quickstart

```bash
npm ci
npm run dev
```

App: <http://localhost:3000>

## Required Gate Regression Check

Before pushing gate-related changes, run:

```bash
npm run qa:gates-e2e
```

What it verifies:
- **Pre-submit lock state** (protected content is hidden)
- **Post-submit unlock state** (protected content appears only after capture)
- Critical routes: `/challenge`, `/group-coaching`, `/preview`, `/rays/intention`

## Failure Artifacts (for fast debugging)

When `qa:gates-e2e` fails, artifacts are written to:

```text
.qa-artifacts/gates-e2e/
```

Per failing route you get:
- Full-page screenshot (`*.png`)
- Captured HTML (`*.html`)
- Error log (`*.txt`)

CI also uploads these artifacts from the `QA Gates E2E` workflow.

## Other QA Helpers

```bash
npm run qa:capture-fallback
```

Validates email-capture fallback behavior and JSONL persistence under forced fallback conditions (non-production only).
