// Scoring Engine — Public API
// Canonical runtime scorer is pipeline.ts (called by /api/runs/[runId]/complete).
// score-assessment.mjs is retained only for loadCanonicalContent (HTML report rendering).

/** @deprecated Use scoreAssessment from './pipeline' instead. */
export {
  scoreAssessment as legacyScoreAssessment,
  loadCanonicalContent as loadCanonicalScoringContent,
} from './score-assessment.mjs';
export {
  scoreAssessment,
  type ItemBanks,
} from './pipeline';
export { scoreItem, bucketOf } from './item-scoring';
export { computeSubfacetComposites } from './subfacet-scoring';
export { computeRayComposites } from './ray-scoring';
export { computeToolComposites } from './tool-scoring';
export { computeIndices, computeEER, computeBRI, computeLSI } from './indices';
export { computeGate, computePPD } from './gating';
export { selectTopTwo, type TopTwoResult } from './top-two';
export { selectBottomRay, determineRouting, type BottomRayResult } from './bottom-ray';
export { scoreReflection, computeReflectionIndices, type ReflectionIndices } from './reflection';
export { computeAllValidity } from './validity';
export { computeConfidenceBand } from './confidence';
export { detectEdgeCases, determineProfileFlag } from './edge-cases';
export { computeExecTags, type ExecTagMapRow } from './exec-tags';
export { matchArchetype } from './archetype';
