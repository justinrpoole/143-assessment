---
name: ralph-loop
description: Feature-by-feature execution loop that reads tasks from prd.md (or similar specs), implements one feature at a time, logs progress to progress.txt, and optionally enforces per-feature tests/lint with retry-on-failure. Use for requests mentioning Ralph loop, Ralph Wiggum, feature-by-feature PRD execution, or progress-tracked implementation.
---

# Ralph Loop

## Overview

Run a disciplined feature-by-feature build loop driven by a PRD-style task list, with a persistent progress log and an optional strict mode that requires tests and lint to pass before moving on.

## Workflow

1. Locate the task source.
- Prefer `prd.md` in the repo root.
- If missing, search for common spec names (`PRD.md`, `requirements.md`, `spec.md`, `design.md`).
- If still missing or ambiguous, ask the user to point to the correct file.

1. Select the loop mode.
- **Standard mode**: implement each feature and log progress.
- **Strict mode (Ralph Wiggum)**: implement feature, write/update tests, run lint and tests, and only mark complete when they pass.
- Trigger strict mode when the user mentions “Ralph Wiggum,” “strict,” “tests,” “lint,” or explicitly asks for test-first/quality gates.

1. Initialize progress log.
- Default to `progress.txt` in the repo root unless the user specifies another file.
- If the file already exists, append to it and keep prior history intact.

1. Extract the feature list.
- Parse headings, checklists, or numbered lists in the PRD/spec.
- Normalize into a single ordered list of features with short, action-oriented names.
- Add the list to `progress.txt` with status markers.

1. Execute the feature loop (repeat for each feature).
- Restate the acceptance criteria in one line.
- Implement the feature.
- Update `progress.txt` with status transitions: `TODO -> DOING -> DONE`.
- In strict mode, write/update tests, run lint/tests, and if anything fails, mark the feature as `REVISIT`, fix, and re-run until it passes.
- Only move to the next feature after the current one is complete in the chosen mode.

1. Close out.
- Add a short summary block to `progress.txt` listing completed features and any remaining `REVISIT` items.

## Progress Log Format

Use a compact, append-friendly format:

```
[YYYY-MM-DD] Feature list
- [TODO] <feature 1>
- [TODO] <feature 2>

[YYYY-MM-DD] Feature: <feature 1>
Status: DOING
Notes: <short note or blockers>

[YYYY-MM-DD] Feature: <feature 1>
Status: DONE
Notes: <test/lint results or key changes>
```

## Strict Mode (Ralph Wiggum)

- Write or update tests for each feature before marking it `DONE`.
- Run lint and tests per feature. Use the repo’s existing commands where possible (`package.json` scripts, `Makefile`, `pyproject.toml`, `go test`, `cargo test`, etc.).
- If commands are unclear, ask the user to confirm the lint/test commands before proceeding.
- If tests or lint fail, record the failure in `progress.txt`, fix the feature, and re-run until green.

## Notes

- Do not recommend or rely on the “Claude Code Ralph” plugin for serious work, especially for beginners. If the user asks about it, warn that it is not recommended.
