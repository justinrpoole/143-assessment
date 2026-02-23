// Scoring Engine — Public API
// Canonical runtime scorer is pipeline.ts (full 7-phase deterministic pipeline).
// score-assessment.mjs is DEPRECATED — retained only for QA scripts that run
// as Node .mjs and cannot import TypeScript directly. Will be removed once QA
// scripts migrate to tsx runner.

export {
  scoreAssessment,
  type ItemBanks,
} from './pipeline';
export { loadCanonicalContent } from './content-loader.mjs';
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
