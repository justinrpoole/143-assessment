# Data Dictionary — AssessmentOutputV1

Every field in the scoring pipeline output, its type, source phase, valid range, and meaning.

## Pipeline Phases

| Phase | Module | What It Does |
|-------|--------|-------------|
| A | `item-scoring.ts` | Raw responses → ScoredItem (normalized_0_4, capacity_0_4, eclipse_0_4) |
| B | `reflection.ts` | Reflection responses → depth scores (0–3) |
| C | `subfacet-scoring.ts`, `ray-scoring.ts`, `tool-scoring.ts` | Scored items → Subfacet → Ray → Tool composites |
| D | `indices.ts`, `gating.ts` | Ray composites → EER, BRI, LSI, PPD, Gate Mode |
| E | `validity.ts`, `confidence.ts` | Validity flags → confidence band |
| F | `top-two.ts`, `bottom-ray.ts` | Net energy ranking → Top Two + Bottom Ray + routing |
| G | `edge-cases.ts`, `exec-tags.ts`, `archetype.ts` | Edge cases + exec signals + archetype match |
| Output | `pipeline.ts` (assembly) | All sections merged → AssessmentOutputV1 |

## Section 1: assessment_run

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `run_id` | string | Input | — | Unique assessment run identifier |
| `instrument_version` | string | Output | "v1.0" | Assessment instrument version |
| `tier` | `'QUICK_43' \| 'FULL_143'` | Input | — | 43-item quick or 143-item full |
| `created_at` | string (ISO-8601) | Output | — | Timestamp of output generation |
| `context_mix` | `'WORK' \| 'LIFE' \| 'GENERAL' \| 'MIXED'` | Phase C | — | Work, life, or both item contexts |

## Section 2: data_quality

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `confidence_band` | `'LOW' \| 'MODERATE' \| 'HIGH'` | Phase E | — | Overall result confidence |
| `validity_flags` | `ValidityFlagEnum[]` | Phase E | 0–9 flags | Detected concerns: IMPRESSION_MANAGEMENT, SOCIAL_DESIRABILITY, INCONSISTENCY, SPEEDING, STRAIGHTLINING, ATTENTION, INFREQUENCY, LOW_REFLECTION_DEPTH, MISSINGNESS |
| `quality_notes` | string? | Output | — | Human-readable validity summary |
| `validation_plan` | object? | Output | — | Populated if confidence_band = LOW; includes why, recommended_next_step, timing |

## Section 3: rays

**Type:** `Record<string, RayOutput>` — one entry per ray (R1–R9)

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `ray_id` | string | Phase C | R1–R9 | Ray identifier |
| `ray_name` | string | Phase C | — | Full name (e.g., "Ray of Intention") |
| `score` | number | Phase C | 0–100 | Shine score (shine_0_4 * 25) |
| `access_score` | number? | Phase C | 0–100 | Access under pressure |
| `eclipse_score` | number? | Phase C | 0–100 | Eclipse/distortion measure |
| `net_energy` | number? | Phase C | 0–100 | (Shine100 - Eclipse100 + 100) / 2 |
| `eclipse_modifier` | `'AMPLIFIED' \| 'MUTED' \| 'NONE'` | Output | — | Eclipse relationship to shine |
| `subfacets` | Record<string, SubfacetOutput> | Phase C | 4 per ray | Detailed subfacet scores |

### SubfacetOutput

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `subfacet_id` | string | R{n}{a-d} | e.g., R1a, R1b |
| `label` | string | — | Subfacet name |
| `score` | number | 0–100 | Shine 0–100 |
| `polarity_mix` | { shine: 0–100, eclipse: 0–100 } | — | Shine/eclipse balance |
| `signal_tags` | string[] | — | Linked executive signal codes |

## Section 4: eclipse

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `level` | `'LOW' \| 'MODERATE' \| 'ELEVATED' \| 'HIGH'` | Phase D | — | System eclipse level from LSI/EER/BRI |
| `dimensions` | Record | Output | — | Placeholder for detailed load dimensions |
| `derived_metrics.recovery_access` | number | Phase D | 0–100 | (1 - LSI/4) * 100; inverse of load |
| `derived_metrics.load_pressure` | number | Phase D | 0–100 | LSI scaled to 0–100 |
| `derived_metrics.eer` | number? | Phase D | ~0.5–2.0 | Energy Efficiency Ratio; >1.0 = positive flow |
| `derived_metrics.bri` | number | Phase D | 0–9 | Count of rays where Eclipse > Shine |
| `derived_metrics.performance_presence_delta` | number? | Phase D | 0 or 1 | R4/R5/R9 high but R3 low access |
| `gating.mode` | `'STABILIZE' \| 'BUILD_RANGE' \| 'STRETCH'` | Phase D | — | Coaching gate |
| `gating.reason` | string | Output | — | Why this gate was assigned |

## Section 5: light_signature

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `archetype` | ArchetypeBlock? | Phase G | — | Matched pair archetype (36 possible) |
| `top_two[0..1]` | { ray_id, ray_name, why_resourced, under_load_distortion } | Phase F | — | Highest net energy rays |
| `just_in_ray.ray_id` | string | Phase F | R1–R9 | Bottom ray for development focus |
| `just_in_ray.move_score` | number? | Phase F | 0–1 | 0.45*Access + 0.35*ToolReadiness + 0.20*Reflection |
| `just_in_ray.routing` | `'STRETCH' \| 'STANDARD' \| 'STABILIZE_MICRO' \| 'STABILIZE_RETEST'` | Phase F | — | Coaching routing strategy |

## Section 6: acting_vs_capacity

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `status` | `'CLEAR' \| 'WATCH' \| 'FLAGGED'` | Output | — | CLEAR = ready; WATCH = gated; FLAGGED = PPD |
| `report_language_mode` | `'STANDARD' \| 'DIRECTIONAL' \| 'VALIDATION_REQUIRED'` | Output | — | Report tone selector |

## Section 7: executive_output

| Field | Type | Phase | Range | Description |
|-------|------|-------|-------|-------------|
| `signals` | ExecutiveSignal[] | Phase G | Max 6 | High-impact signals (M001–M024) |
| `light_signature_summary` | object | Output | — | One-line Top Two summary |
| `eclipse_note` | string | Output | — | System eclipse status |

### ExecutiveSignal

| Field | Type | Description |
|-------|------|-------------|
| `signal_id` | string | M001–M024 |
| `label` | string | Signal name |
| `level` | `'LOW' \| 'MODERATE' \| 'ELEVATED' \| 'HIGH'` | Signal strength |
| `drivers` | string[] | Ray/tool codes predicting this signal |
| `tools_first` | string[] | Tool recommendations when gated |
| `reps` | string[] | Ray micro-rep recommendations |

## Section 8: recommendations

| Field | Type | Phase | Description |
|-------|------|-------|-------------|
| `priority_mode` | `'TOOLS_FIRST' \| 'TOOLS_AND_REPS' \| 'REPS_ONLY'` | Output | Based on gate mode |
| `tools[0..1]` | Array<{ tool_id, label, why_now, steps }> | Output | Primary tools for bottom ray |
| `weekly_focus` | { just_in_ray_id, focus_rep, minimum_effective_dose } | Output | This week's focus |
| `thirty_day_plan` | { week_1, weeks_2_4 } | Output | 30-day coaching arc |
| `coaching_questions` | string[]? | Output | Up to 3 reflection prompts |
| `what_not_to_do_yet` | string[] | Output | Contraindications for current gate |

## Section 9: copy_mode

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `tone_mode` | string | 'JUSTIN_RAY_DIRECT' | Voice for all report copy |
| `no_shame_flags` | boolean | true | Enforces no-shame language |
| `language_constraints` | string[] | Fixed | Required language rules |

## Key Scoring Formulas

- **Shine (0–4):** Mean of Baseline items for a subfacet
- **Access (0–4):** Mean of UnderPressure + Normal polarity items
- **Eclipse (0–4):** Mean of UnderPressure + Reverse polarity items (raw, not reversed)
- **Net Energy:** (Shine100 - Eclipse100 + 100) / 2
- **LSI:** Mean of dedicated eclipse items (0–4)
- **EER:** (TotalShine + 5) / (TotalEclipse + 5)
- **BRI:** Count of rays where Eclipse > Shine (0–9)
- **Move Score:** 0.45*Access + 0.35*ToolReadiness + 0.20*Reflection
- **Gate:** STABILIZE if Phase 1 rays (R1–R3) depleted OR system-wide load high; else STRETCH
