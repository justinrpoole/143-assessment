// 143 Leadership Assessment — Core Types
// Conforms to OUTPUT_SCHEMA_V1.md + STEP5B item bank model

// ═══════════════════════════════════════════
// ITEM BANK TYPES (from STEP5B Excel)
// ═══════════════════════════════════════════

// Shared across ray, tool, eclipse, and validity items
export type Domain = 'Ray' | 'Tool' | 'Eclipse' | 'Validity';
export type ItemType = 'Behavior7d' | 'Behavior30d' | 'Scenario' | 'Indirect' | 'InconsistencyPair_A' | 'InconsistencyPair_B';
export type Context = 'Work' | 'Life' | 'Both';
export type Polarity = 'Normal' | 'Reverse';
export type PressureMode = 'Baseline' | 'UnderPressure';
export type EclipseSensitivity = 'Low' | 'Medium' | 'High';
export type ResponseFormat = 'Frequency_0_4' | 'ForcedChoice_A_D';
export type CoachingUse = 'TopTwoPower' | 'BottomRayTraining' | 'EclipseSnapshot' | 'ValidityCheck' | string;

// The base item shape shared by Ray, Tool, Eclipse, and Validity items
export interface BaseItem {
  Item_ID: string;
  Domain: Domain;
  Ray_Number: number | null;  // null for Tool/Eclipse/Validity
  Ray_Name: string | null;
  Subfacet_Code: string;       // e.g., R1a, T001, E001, VAL_SD
  Subfacet_Name: string;
  Item_Type: ItemType;
  Context: Context;
  Polarity: Polarity;
  Pressure_Mode: PressureMode;
  Eclipse_Sensitivity: EclipseSensitivity;
  Executive_Tag_Link: string | null;  // comma-separated M-codes
  Mechanism_Link: string | null;
  Coaching_Use: string | null;
  Notes: string | null;
  Item_Text: string;
  Response_Scale: string;       // display label
  Option_A?: string | null;
  Option_B?: string | null;
  Option_C?: string | null;
  Option_D?: string | null;
  Keyed_Option?: string | null; // for scenarios: A, B, C, or D
  Construct_Def_Plain?: string | null;
  Construct_Def_Exec?: string | null;
  Time_Window: string | null;
  Response_Format: ResponseFormat;
  Friction_Rating: number;
  Pressure_Distortion_Tag: string | null;
  Time_Window_Source?: string | null;
}

// Ray items (720 in full bank)
export interface RayItem extends BaseItem {
  Domain: 'Ray';
  Ray_Number: number;   // 1-9
  Ray_Name: string;     // Intention, Joy, Presence, etc.
}

// Tool items (300 in full bank)
export interface ToolItem extends BaseItem {
  Domain: 'Tool';
}

// Eclipse items (40 in full bank)
export interface EclipseItem extends BaseItem {
  Domain: 'Eclipse';
}

// Validity items (102 in full bank) — has extra Pair_ID field
export interface ValidityItem extends BaseItem {
  Domain: 'Validity';
  Pair_ID?: string | null;  // for inconsistency pairs
}

// Reflection prompts (60 in full bank) — different shape
export interface ReflectionPrompt {
  Prompt_ID: string;
  Domain: 'Reflection';
  Ray_Number: number;
  Ray_Name: string;
  Subfacet_Code: string;
  Context: Context;
  Executive_Tag_Link: string | null;
  Mechanism_Link: string | null;
  Prompt_Text: string;
  Anchor_0: string;  // rubric level 0 description
  Anchor_1: string;  // rubric level 1 description
  Anchor_2: string;  // rubric level 2 description
  Anchor_3: string;  // rubric level 3 description
  Notes: string | null;
  Time_Window: string | null;
  Response_Format: string;
  Friction_Rating: number;
  Pressure_Distortion_Tag: string | null;
}

// Union type for any assessment item (Ray, Tool, Eclipse, or Validity)
export type AssessmentItem = RayItem | ToolItem | EclipseItem | ValidityItem;

// ═══════════════════════════════════════════
// RESPONSE TYPES
// ═══════════════════════════════════════════

export interface ItemResponse {
  item_id: string;
  value: number | string | null; // number for Likert (0-4), string for scenario key or reflection text
  timestamp: number; // ms since epoch
}

export interface ResponsePacket {
  run_id: string;
  tier: 'QUICK_43' | 'FULL_143';
  start_ts: string; // ISO-8601
  end_ts: string;   // ISO-8601
  responses: Record<string, ItemResponse>;
  reflection_responses?: Record<string, string>; // prompt_id -> text
}

// ═══════════════════════════════════════════
// SCORED ITEM
// ═══════════════════════════════════════════

export interface ScoredItem {
  item_id: string;
  raw_value: number | string | null;
  normalized_0_4: number | null;
  capacity_0_4: number | null;    // Shine or Access depending on pressure mode
  eclipse_0_4: number | null;     // only for UnderPressure+Reverse items
  chosen_option: string | null;   // for scenarios
  applied_option_score: number | null;
  missing_flag: boolean;
  scoring_bucket: 'shine' | 'access' | 'eclipse' | 'validity' | null;
}

// ═══════════════════════════════════════════
// SUBFACET + RAY COMPOSITES (scoring pipeline)
// ═══════════════════════════════════════════

export interface SubfacetComposite {
  subfacet_code: string;
  subfacet_name: string;
  ray_number: number | null;
  shine_0_4: number | null;      // mean of Baseline items
  access_0_4: number | null;     // mean of UnderPressure+Normal items
  eclipse_0_4: number | null;    // mean of UnderPressure+Reverse items (raw, NOT reversed)
  item_count: number;
  coverage: number;              // fraction of items answered (0-1)
  usable: boolean;               // coverage >= 0.40
  high_confidence: boolean;      // coverage >= 0.60
}

export interface RayComposite {
  ray_id: string;                // R1-R9
  ray_name: string;
  ray_number: number;
  shine_0_4: number | null;
  access_0_4: number | null;
  eclipse_0_4: number | null;
  shine_0_100: number | null;
  access_0_100: number | null;
  eclipse_0_100: number | null;
  net_energy_0_100: number | null;  // (shine100 - eclipse100 + 100) / 2
  subfacet_count: number;        // how many usable subfacets (need ≥3)
  partial_ray: boolean;          // true if exactly 3 subfacets
  phase: 'Reconnect' | 'Radiate' | 'Become';
}

export interface ToolComposite {
  tool_code: string;             // T001-T012
  tool_name: string;
  usage_0_4: number | null;
  access_0_4: number | null;
  distortion_0_4: number | null;
  item_count: number;
  coverage: number;
}

// ═══════════════════════════════════════════
// INDICES (from 07E)
// ═══════════════════════════════════════════

export interface AssessmentIndices {
  eer: number | null;            // Energy Efficiency Ratio: (TotalShine+5)/(TotalEclipse+5)
  bri: number;                   // Burnout Risk Index: count of rays where Eclipse > Shine
  lsi_0_4: number | null;        // Load Snapshot Index (0-4)
  lsi_0_100: number | null;      // Load Snapshot Index (0-100)
  ppd_flag: boolean;             // Performance vs Presence Delta elevated
}

// ═══════════════════════════════════════════
// EDGE CASES (from 07G)
// ═══════════════════════════════════════════

export type EdgeCaseCode =
  | 'EXPENSIVE_STRENGTH'
  | 'TRUTH_DETECTOR_SUPPRESSED'
  | 'PERFECT_SELF_REPORT'
  | 'CONTRADICTORY_RESPONSES'
  | 'FLAT_PROFILE'
  | 'MISSING_REFLECTION'
  | 'PARTIAL_COMPLETION'
  | 'EXTREME_POLARIZATION'
  | 'HIGH_LOAD_INTERFERENCE'
  | 'UNRESOLVED_AMBIGUITY';

export type ProfileFlag = 'STANDARD' | 'UNDIFFERENTIATED' | 'PARTIAL';

export interface EdgeCaseResult {
  code: EdgeCaseCode;
  detected: boolean;
  restriction: string;
  required_next_evidence: string;
}

// ═══════════════════════════════════════════
// VALIDITY (from 07F)
// ═══════════════════════════════════════════

export interface ValidityResult {
  social_desirability_0_4: number | null;
  sd_elevated: boolean;          // >=3.2
  sd_extreme: boolean;           // >=3.6
  inconsistency_pairs_flagged: number;
  inconsistency_mean_diff: number;
  inconsistency_flag: boolean;
  speeding_flag: boolean;
  duration_seconds: number;
  straightline_longest_run: number;
  straightline_flag: boolean;
  attention_missed: number;
  attention_flag: boolean;
  infrequency_flagged: number;
  infrequency_flag: boolean;
  reflection_depth_avg: number | null;  // 0-3
  reflection_strong: boolean;    // >=2.0
  reflection_thin: boolean;     // 1.0-1.99
  reflection_missing: boolean;  // <1.0
  coverage: number;              // fraction of all items answered
  coverage_flag: boolean;        // coverage < 0.60 or >2 rays NA
}

// ═══════════════════════════════════════════
// BOTTOM RAY SELECTION (from 07D)
// ═══════════════════════════════════════════

export interface BottomRayCandidate {
  ray_id: string;
  ray_name: string;
  net_energy: number;
  move_score: number;     // 0.45*Access + 0.35*ToolReadiness + 0.20*Reflection
  access_0_4: number;
  tool_readiness: number;
  reflection_scaled: number;
}

export type MoveRouting = 'STRETCH' | 'STANDARD' | 'STABILIZE_MICRO' | 'STABILIZE_RETEST';

// ═══════════════════════════════════════════
// ARCHETYPE (from STEP4B)
// ═══════════════════════════════════════════

export interface ArchetypeBlock {
  index: number;
  name: string;
  pair_code: string;       // e.g., "R1-R2"
  ray_a: string;
  ray_b: string;
  essence: string;
  work_expression: string;
  life_expression: string;
  strengths: string;
  stress_distortion: string;
  ppd_risk: string;
  coaching_logic: string;
  starting_tools: string;
  bottom_ray_focus: string;
  micro_reps: string;
  reflection_prompts: string;
  exec_signals: string;
}

// ═══════════════════════════════════════════
// ARCHETYPE PUBLIC (marketing-facing, no R-codes or mechanics)
// ═══════════════════════════════════════════

export interface ArchetypePublic {
  index: number;
  name: string;
  tagline: string;
  vibe: string;
  identity_code: string;
  the_question: string;
  people_say: string;
  you_might_be_this_if: string[];
  at_your_best: string;
  what_youre_afraid_of: string;
  when_your_signal_goes_dark: string;
  in_the_wild: string;
  your_counter_signal: string;
  the_line: string;
  first_rep: string;
  famous_signal: string;
  soundtrack: string;
  neon_color: string;
  rays: string[];  // Display names only, e.g. ["Intention", "Joy"]
}

// ═══════════════════════════════════════════
// EXECUTIVE METADATA (from STEP4C)
// ═══════════════════════════════════════════

export interface ExecSignalDefinition {
  signal_id: string;       // M001-M024
  signal_name: string;
  definition: string;
  why_executives_care: string;
  predictors: string;      // comma-separated ray/tool refs
  modifiers: string;       // eclipse/validity modifiers
  training_focus: Array<{
    level: 'Low' | 'Medium' | 'High';
    recommended_focus: string;
    tools_first: string;
    ray_second: string;
  }>;
}

// ═══════════════════════════════════════════
// OUTPUT_SCHEMA_V1 TYPES
// (These are the report output contract)
// ═══════════════════════════════════════════

export type ConfidenceBand = 'LOW' | 'MODERATE' | 'HIGH';
export type EclipseLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
export type EclipseModifier = 'AMPLIFIED' | 'MUTED' | 'NONE';
export type GateMode = 'STABILIZE' | 'BUILD_RANGE' | 'STRETCH';
export type ActingStatus = 'CLEAR' | 'WATCH' | 'FLAGGED';
export type ReportLanguageMode = 'STANDARD' | 'DIRECTIONAL' | 'VALIDATION_REQUIRED';
export type ToneMode = 'JUSTIN_RAY_DIRECT' | 'EXECUTIVE_SAFE';
export type PriorityMode = 'TOOLS_FIRST' | 'TOOLS_AND_REPS' | 'REPS_ONLY';
export type ValidityFlagEnum = 'IMPRESSION_MANAGEMENT' | 'SOCIAL_DESIRABILITY' | 'INCONSISTENCY' | 'SPEEDING' | 'STRAIGHTLINING' | 'ATTENTION' | 'INFREQUENCY' | 'LOW_REFLECTION_DEPTH' | 'MISSINGNESS';
export type NextStep = 'RETAKE' | 'MINI_INTERVIEW' | 'COACH_DEBRIEF';
export type ContextMix = 'WORK' | 'LIFE' | 'GENERAL' | 'MIXED';

export interface SubfacetOutput {
  subfacet_id: string;
  label: string;
  score: number;
  polarity_mix: { shine: number; eclipse: number };
  signal_tags: string[];
}

export interface RayOutput {
  ray_id: string;
  ray_name: string;
  score: number;           // 0-100 (shine)
  access_score?: number;   // 0-100
  eclipse_score?: number;  // 0-100
  net_energy?: number;     // 0-100
  percentile?: number;
  eclipse_modifier: EclipseModifier;
  subfacets: Record<string, SubfacetOutput>;
}

export interface EclipseOutput {
  level: EclipseLevel;
  dimensions: Record<string, { score: number; note?: string }>;
  derived_metrics: {
    recovery_access: number;
    load_pressure: number;
    eer?: number;
    bri?: number;
    performance_presence_delta?: number;
  };
  gating: {
    mode: GateMode;
    reason: string;
  };
}

export interface LightSignatureOutput {
  archetype?: {
    name: string;
    pair_code: string;
    essence: string;
    work_expression?: string;
    life_expression?: string;
    strengths?: string;
    stress_distortion?: string;
    coaching_logic?: string;
    starting_tools?: string;
    micro_reps?: string;
    reflection_prompts?: string;
  };
  top_two: Array<{
    ray_id: string;
    ray_name: string;
    why_resourced: string;
    under_load_distortion: string;
  }>;
  just_in_ray: {
    ray_id: string;
    ray_name: string;
    why_this_is_next: string;
    work_rep: string;
    life_rep: string;
    move_score?: number;
    routing?: MoveRouting;
  };
  bottom_ray_selection_basis: string[];
}

export interface ActingVsCapacityOutput {
  status: ActingStatus;
  indicators: Array<{
    indicator_id: string;
    label: string;
    level: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
    evidence: string[];
  }>;
  report_language_mode: ReportLanguageMode;
  next_step: string;
}

export interface ExecutiveSignal {
  signal_id: string;
  label: string;
  level: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  confidence_band: ConfidenceBand;
  drivers: string[];
  moderators: { eclipse?: string; validity?: string };
  tools_first: string[];
  reps: string[];
}

export interface ExecutiveOutput {
  structure_version: string;
  light_signature_summary?: {
    top_two_resourced: string;
    top_two_under_load: string;
  };
  just_in_summary?: {
    training_target: string;
    work_rep: string;
    life_rep: string;
  };
  eclipse_note?: string;
  signals: ExecutiveSignal[];
}

export interface OutcomeTag {
  tag_id: string;
  label: string;
  confidence: ConfidenceBand;
  evidence: string[];
}

export interface RecommendationsOutput {
  priority_mode: PriorityMode;
  tools: Array<{
    tool_id: string;
    label: string;
    why_now: string;
    steps: string[];
    time_cost_minutes: number;
  }>;
  weekly_focus: {
    just_in_ray_id?: string;
    focus_rep?: string;
    minimum_effective_dose?: string;
  };
  thirty_day_plan?: {
    week_1: string;
    weeks_2_4: string;
  };
  coaching_questions?: string[];
  what_not_to_do_yet: string[];
}

export interface DataQualityOutput {
  confidence_band: ConfidenceBand;
  validity_flags: ValidityFlagEnum[];
  quality_notes?: string;
  validation_plan?: {
    why: string;
    recommended_next_step: NextStep;
    timing: string;
  };
}

export interface CopyMode {
  tone_mode: ToneMode;
  language_constraints: string[];
  no_shame_flags: boolean;
}

// ─── The Full Output (OUTPUT_SCHEMA_V1) ───
export interface AssessmentOutputV1 {
  assessment_run: {
    run_id: string;
    instrument_version: string;
    tier: 'QUICK_43' | 'FULL_143';
    created_at: string;
    context_mix: ContextMix;
  };
  data_quality: DataQualityOutput;
  rays: Record<string, RayOutput>;
  eclipse: EclipseOutput;
  light_signature: LightSignatureOutput;
  acting_vs_capacity: ActingVsCapacityOutput;
  executive_output: ExecutiveOutput;
  outcome_tags: { applied: OutcomeTag[] };
  recommendations: RecommendationsOutput;
  copy_mode: CopyMode;
  // New: edge cases and indices for internal tracking
  edge_cases?: EdgeCaseResult[];
  indices?: AssessmentIndices;
  profile_flag?: ProfileFlag;
}

// ═══════════════════════════════════════════
// RAY METADATA CONSTANTS
// ═══════════════════════════════════════════

export const RAY_NAMES: Record<string, string> = {
  R1: 'Ray of Intention',
  R2: 'Ray of Joy',
  R3: 'Ray of Presence',
  R4: 'Ray of Power',
  R5: 'Ray of Purpose',
  R6: 'Ray of Authenticity',
  R7: 'Ray of Connection',
  R8: 'Ray of Possibility',
  R9: 'Be The Light',
};

/** Short labels for tight SVG chart labels where space is limited */
export const RAY_SHORT_NAMES: Record<string, string> = {
  R1: 'Intention',
  R2: 'Joy',
  R3: 'Presence',
  R4: 'Power',
  R5: 'Purpose',
  R6: 'Authenticity',
  R7: 'Connection',
  R8: 'Possibility',
  R9: 'Be The Light',
};

export const RAY_VERBS: Record<string, string> = {
  R1: 'Choose',
  R2: 'Expand',
  R3: 'Anchor',
  R4: 'Act',
  R5: 'Align',
  R6: 'Reveal',
  R7: 'Attune',
  R8: 'Explore',
  R9: 'Inspire',
};

// Phase groupings (from 07B)
export const RAY_PHASES: Record<string, 'Reconnect' | 'Radiate' | 'Become'> = {
  R1: 'Reconnect', R2: 'Reconnect', R3: 'Reconnect',
  R4: 'Radiate', R5: 'Radiate', R6: 'Radiate',
  R7: 'Become', R8: 'Become', R9: 'Become',
};

// Subfacet names per ray (4 subfacets each, a-d)
export const SUBFACET_NAMES: Record<string, string> = {
  R1a: 'Daily Intentionality',
  R1b: 'Time/Attention Architecture',
  R1c: 'Boundary Clarity',
  R1d: 'Pre-Decision Practice',
  R2a: 'Joy Access',
  R2b: 'Gratitude Practice',
  R2c: 'Reinforcement Behavior',
  R2d: 'Recovery Integration',
  R3a: 'Attention Stability',
  R3b: 'Cognitive Flexibility',
  R3c: 'Body Signal Awareness',
  R3d: 'Emotional Regulation',
  R4a: 'Agency/Action Orientation',
  R4b: 'Boundary Enforcement',
  R4c: 'Conflict Engagement',
  R4d: 'Power Under Pressure',
  R5a: 'Purpose Clarity',
  R5b: 'Values Alignment',
  R5c: 'Meaningful Contribution',
  R5d: 'Long-Range Thinking',
  R6a: 'Self-Disclosure',
  R6b: 'Congruence',
  R6c: 'Vulnerability Tolerance',
  R6d: 'Identity Integration',
  R7a: 'Relational Safety Creation',
  R7b: 'Empathic Accuracy',
  R7c: 'Repair Initiation',
  R7d: 'Trust Building',
  R8a: 'Cognitive Openness',
  R8b: 'Divergent Thinking',
  R8c: 'Adaptive Flexibility',
  R8d: 'Creative Problem-Solving',
  R9a: 'Behavioral Modeling',
  R9b: 'Standard Setting',
  R9c: 'Generative Impact',
  R9d: 'Legacy Orientation',
};

// Tool names
// Canonical tool-to-code mapping (from 07H §0 and constants.ts TOOL_NAME_TO_CODE)
export const TOOL_NAMES: Record<string, string> = {
  T001: 'Watch Me',
  T002: 'I Rise',
  T003: 'Go First',
  T004: 'REPs',
  T005: '143 Challenge',
  T006: '90-Second Window',
  T007: 'RAS Reset',
  T008: 'Presence Pause',
  T009: 'Boundary of Light',
  T010: 'If/Then Planning',
  T011: 'Question Loop',
  T012: 'Witness',
};

// ─── Legacy type aliases for backward compatibility ───
// (These map old type names used in the current scoring.ts to new types)
export type Tier = 'FULL_143' | 'QUICK_43' | 'BOTH';
export type RayId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'ECLIPSE' | 'VALIDITY';

// Legacy RegistryItem — used by the old scoring engine and assessment page
// This maps to the original 17-item format in item_registry.json
export interface RegistryItem {
  item_id: string;
  version: string;
  tier: Tier;
  ray_id: string;
  ray_name: string;
  subfacet_id: string;
  construct_tag: string;
  context: string;
  item_type: string;
  polarity: string;
  response_format: string;
  reverse_scored: boolean;
  weight: number;
  validity_tag: string | null;
  pair_id: string | null;
  output_hooks: string[];
  prompt_ref: string;
  notes: string;
  scenario_options?: Array<{ key: string; label: string; keyed: boolean; score: number }>;
}
