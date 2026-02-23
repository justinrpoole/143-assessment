# Content Directory — Source of Truth

This directory contains the **display content** used by the 143 Leadership Assessment app.
All files here are canonical. Changes here affect what users see.

## Files

| File | Purpose | Owner | Status |
|------|---------|-------|--------|
| `questions.json` | 143 assessment items (id, text, ray_id, scale, polarity) | `/assessment-engine` | canonical |
| `rays.json` | 9 Ray definitions, micro_wins, coaching_questions | `/assessment-engine` | canonical |
| `ray_pairs.json` | 36 archetype pair content, descriptions, micro_wins | `/assessment-engine` | canonical |
| `results_overview.json` | Report section templates and copy | `/brand-voice` | canonical |
| `marketing_copy_bible.v1.ts` | Marketing copy constants | `/brand-voice` | canonical |
| `page_copy.v1.ts` | Page-level UI copy | `/brand-voice` | canonical |
| `citations.json` | Claim-to-citation ledger (42 claims, 26 researchers, 8 priority gaps) | `/assessment-engine` | canonical |
| `DATA_DICTIONARY.md` | AssessmentOutputV1 field-by-field reference | `/assessment-engine` | canonical |

## Sibling: `src/data/`

Scoring data lives in `src/data/`, NOT here. That directory contains item banks,
exec tag maps, archetype blocks, and reflection prompts consumed by `pipeline.ts`.

| Data File | Purpose |
|-----------|---------|
| `ray_items.json` | Ray-scored item bank (for pipeline) |
| `tool_items.json` | Tool-scored items |
| `eclipse_items.json` | Eclipse-scored items |
| `validity_items.json` | Validity check items |
| `reflection_prompts.json` | Reflection prompt bank |
| `archetype_blocks.json` | 36 archetype scoring blocks |
| `exec_tag_map.json` | 24 executive signal definitions |

## Naming Conventions

- Files: `snake_case.json` or `snake_case.v{N}.ts` for versioned TypeScript modules
- Ray IDs: `R1` through `R9` (always uppercase R + number)
- Question IDs: string format matching `questions.json` `id` field
- Pair IDs: `R{lower}-R{higher}` (e.g., `R1-R3`, sorted numerically)
- Archetype IDs: match `ray_pairs.json` `pair_id` field

## Ingest Rules

1. **Never duplicate** — each artifact type has exactly one file
2. **Content → display, Data → scoring** — if it affects what users see, it goes in `content/`. If it affects how scores compute, it goes in `data/`.
3. **JSON for structured data** — questions, rays, pairs are JSON
4. **TypeScript for copy** — marketing copy and page copy use `.ts` exports for type safety
5. **No status: deprecated files** — if a file is deprecated, delete it. Don't leave deprecated files in this directory.
6. **Version bumps** — when changing the schema of a `.ts` copy module, increment the version suffix (e.g., `v1` → `v2`) and update all imports

## QA Coverage

These files are validated by:
- `npm run qa:content` — structural validation
- `npm run qa:tone` — voice/tone compliance
- `npm run qa:drift-scan` — brand drift detection
- `npm run qa:narrative` — narrative consistency
