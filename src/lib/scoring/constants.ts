// Scoring Engine Constants
// All thresholds, maps, and locked values from the spec

// ═══════════════════════════════════════════
// LIKERT ANCHORS
// ═══════════════════════════════════════════
export const LIKERT_ANCHORS: Record<string, number> = {
  'Never': 0,
  'Rarely': 1,
  'Sometimes': 2,
  'Often': 3,
  'Almost always': 4,
};

// ═══════════════════════════════════════════
// USABILITY THRESHOLDS
// ═══════════════════════════════════════════

// A subfacet bucket is "usable" if answered items >= max(MIN_ITEMS_FOR_BUCKET, USABLE_FRACTION * total)
// Per-bucket minimums account for item distribution:
//   Shine (Baseline): ~14 items per subfacet → min 6
//   Access (UnderPressure + Normal): ~4 items per subfacet → min 2
//   Eclipse (UnderPressure + Reverse): ~2 items per subfacet → min 1
export const SUBFACET_MIN_ITEMS_SHINE = 6;
export const SUBFACET_MIN_ITEMS_ACCESS = 2;
export const SUBFACET_MIN_ITEMS_ECLIPSE = 1;
// Keep old constant for backward compatibility in any code that references it
export const SUBFACET_MIN_ITEMS = 6;
export const SUBFACET_USABLE_FRACTION = 0.40;
export const SUBFACET_HIGH_CONFIDENCE_FRACTION = 0.60;

// Tool composites use a lower floor since fewer items per tool
export const TOOL_MIN_ITEMS = 3;
export const TOOL_USABLE_FRACTION = 0.40;

// Ray requires >= 3 usable subfacets out of 4
export const RAY_MIN_SUBFACETS = 3;

// ═══════════════════════════════════════════
// MOVE SCORE WEIGHTS (from constitution)
// ═══════════════════════════════════════════
export const MOVE_WEIGHTS = {
  access: 0.45,
  toolReadiness: 0.35,
  reflection: 0.20,
};

// MoveScore threshold for "low readiness" — triggers Phase 1 fallback
export const MOVE_LOW_THRESHOLD = 3.0;

// ═══════════════════════════════════════════
// MOVE ROUTING BANDS
// ═══════════════════════════════════════════
export const MOVE_STRETCH_THRESHOLD = 3.4;
export const MOVE_STANDARD_THRESHOLD = 3.0;
export const MOVE_STABILIZE_MICRO_THRESHOLD = 2.4;

// ═══════════════════════════════════════════
// VALIDITY THRESHOLDS
// ═══════════════════════════════════════════
export const SD_ELEVATED = 3.2;
export const SD_EXTREME = 3.6;
export const INCONSISTENCY_PAIR_FLAG_DIFF = 3;   // flag a pair if |diff| >= 3
export const INCONSISTENCY_FLAG_PAIRS = 2;       // flag overall if >= 2 pairs flagged
export const INCONSISTENCY_CAUTION_MEAN = 1.5;
export const INCONSISTENCY_LOW_MEAN = 2.0;       // for confidence downgrade
export const ATTENTION_FLAG_MISSES = 2;
export const INFREQUENCY_HIGH_SCORE = 3;         // Often=3, Almost always=4
export const INFREQUENCY_FLAG_HITS = 2;
export const SPEED_HARD_FLOOR_SECONDS = 360;     // 6 minutes
export const SPEED_CAUTION_FRACTION = 0.45;      // caution if < 45% of pilot median
export const SPEED_FLAG_FRACTION = 0.25;         // flag if < 25% of pilot median
export const STRAIGHTLINE_CAUTION = 12;
export const STRAIGHTLINE_FLAG = 18;
export const STRAIGHTLINE_LOW_VARIANCE = 0.35;
export const MISSINGNESS_NA_RAYS = 3;
export const MISSINGNESS_LOW_COVERAGE_SUBFACETS = 6;

// ═══════════════════════════════════════════
// ECLIPSE / GATING THRESHOLDS
// ═══════════════════════════════════════════
export const EER_DEPLETING = 1.0;
export const EER_BURNOUT_RISK = 0.8;
export const BRI_ELEVATED = 3;
export const LSI_HIGH = 3.0;
export const PRESENCE_ACCESS_LOW = 2.2;
export const PRESENCE_ECLIPSE_HIGH = 2.8;
export const OUTPUT_RAY_HIGH = 3.2;  // for PPD check on R4/R5/R9

// ═══════════════════════════════════════════
// TIE-BREAK: Net Energy "near tie" threshold
// ═══════════════════════════════════════════
export const NET_ENERGY_TIE_THRESHOLD = 2; // points on 0-100 scale

// ═══════════════════════════════════════════
// FLAT PROFILE THRESHOLD (standard deviation)
// ═══════════════════════════════════════════
export const FLAT_PROFILE_SD = 5; // on 0-100 scale

// ═══════════════════════════════════════════
// TOOL → RAY MAPPING (from 07H §11)
// Which two tools are recommended per ray
// ═══════════════════════════════════════════
export const TOOL_MAPPING_FOR_RAY: Record<number, [string, string]> = {
  1: ['T010', 'T001'], // If/Then + Watch Me
  2: ['T004', 'T007'], // REPs + RAS Reset
  3: ['T008', 'T006'], // Presence Pause + 90-Second Window
  4: ['T009', 'T002'], // Boundary of Light + I Rise
  5: ['T010', 'T005'], // If/Then + 143 Challenge
  6: ['T003', 'T002'], // Go First + I Rise
  7: ['T003', 'T011'], // Go First + Question Loop
  8: ['T005', 'T001'], // 143 Challenge + Watch Me
  9: ['T004', 'T012'], // REPs + Witness
};

// Universal fallback tools if ray not in map
export const FALLBACK_TOOLS: [string, string] = ['T008', 'T010'];

// ═══════════════════════════════════════════
// TOOL NAME → CODE MAP (from 07H §0)
// ═══════════════════════════════════════════
export const TOOL_NAME_TO_CODE: Record<string, string> = {
  'Watch Me': 'T001',
  'I Rise': 'T002',
  'Go First': 'T003',
  'REPs': 'T004',
  'REPs (Performance Sustained)': 'T004',
  '143 Challenge': 'T005',
  '90-Second Window': 'T006',
  'RAS Reset': 'T007',
  'Presence Pause': 'T008',
  'Boundary of Light': 'T009',
  'If/Then Planning': 'T010',
  'If/Then': 'T010',
  'Question Loop': 'T011',
  'Witness': 'T012',
  'Witness/Leading the Witness': 'T012',
  'Leading the Witness': 'T012',
};

// ═══════════════════════════════════════════
// ECLIPSE DISTORTIONS (per ray, for report copy)
// ═══════════════════════════════════════════
export const ECLIPSE_DISTORTIONS: Record<string, string> = {
  R1: 'Under pressure, scattered priorities and reactive drift may replace clear direction.',
  R2: 'Under pressure, joy access may narrow — numbness or forced positivity may surface.',
  R3: 'Under pressure, attention may fracture and reactivity may overtake grounding.',
  R4: 'Under pressure, aggression or withdrawal may replace measured power.',
  R5: 'Under pressure, cynicism or meaning-loss may surface — effort feels untethered.',
  R6: 'Under pressure, masking or performative behavior may replace authenticity.',
  R7: 'Under pressure, withdrawal or people-pleasing may replace genuine connection.',
  R8: 'Under pressure, rigidity or overwhelm may replace open exploration.',
  R9: 'Under pressure, overextension or withdrawal from influence may surface.',
};

// Phase 1 rays (Reconnect)
export const PHASE_1_RAYS = [1, 2, 3];
