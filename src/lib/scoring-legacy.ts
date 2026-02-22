// 143 Leadership Assessment — Scoring Engine
// Implements 07A-07H pseudocode from the Assessment OS spec

import {
  RegistryItem, ItemResponse, ScoredItem, ResponsePacket,
  AssessmentOutputV1, ConfidenceBand, EclipseLevel, GateMode,
  ActingStatus, ReportLanguageMode, RayOutput,
  EclipseModifier, RAY_NAMES, RAY_VERBS,
} from './types';

// ═══════════════════════════════════════════════
// 07A: Raw Item → Scored Item
// ═══════════════════════════════════════════════

function normalizeLikert(raw: number, reverseScored: boolean): number {
  // 1-7 Likert → 0-4 scale
  // Per 07H: normalized_0_4 = (raw - 1) * (4/6)
  const val = reverseScored ? (8 - raw) : raw;
  return (val - 1) * (4 / 6);
}

function scoreItem(item: RegistryItem, response: ItemResponse | undefined): ScoredItem {
  const isMissing = !response || response.value === null || response.value === undefined;
  const result: ScoredItem = {
    item_id: item.item_id,
    raw_value: response?.value ?? null,
    normalized_0_4: null,
    capacity_0_4: null,
    eclipse_0_4: null,
    chosen_option: null,
    applied_option_score: null,
    missing_flag: isMissing,
    scoring_bucket: null,
  };

  if (!response || response.value === null || response.value === undefined) {
    return result;
  }

  if (item.item_type === 'LIKERT' || item.item_type === 'INCONSISTENCY_PAIR') {
    const raw = Number(response.value);
    if (isNaN(raw) || raw < 1 || raw > 7) return result;

    const norm = normalizeLikert(raw, item.reverse_scored);
    result.normalized_0_4 = norm;

    if (item.polarity === 'ECLIPSE') {
      // Eclipse items: higher = more eclipse (constraint)
      result.eclipse_0_4 = norm;
      result.capacity_0_4 = 4 - norm; // inverse for capacity
    } else {
      result.capacity_0_4 = norm;
      result.eclipse_0_4 = null;
    }
  } else if (item.item_type === 'SCENARIO' && item.scenario_options) {
    const chosen = String(response.value);
    const option = item.scenario_options.find(o => o.key === chosen);
    if (option) {
      const score04 = option.score * (4 / 4); // scores are 1-4, normalize to 0-4
      result.normalized_0_4 = score04;
      if (item.polarity === 'ECLIPSE') {
        result.eclipse_0_4 = 4 - score04;
        result.capacity_0_4 = score04;
      } else {
        result.capacity_0_4 = score04;
      }
    }
  } else if (item.item_type === 'REFLECTION') {
    // Reflection scored separately (0-3 rubric, placeholder)
    result.normalized_0_4 = null;
  }

  return result;
}

// ═══════════════════════════════════════════════
// 07B: Subfacet → Ray Computation
// ═══════════════════════════════════════════════

function computeRayScores(
  items: RegistryItem[],
  scoredItems: Record<string, ScoredItem>
): Record<string, { shine_0_4: number | null; eclipse_0_4: number | null; net_energy_0_100: number | null }> {
  const rays: Record<string, number[]> = {};
  const eclipseScores: Record<string, number[]> = {};

  // Group by ray_id, only R1-R9
  for (const item of items) {
    const rayId = item.ray_id;
    if (!rayId.startsWith('R')) continue;

    const scored = scoredItems[item.item_id];
    if (!scored) continue;

    if (!rays[rayId]) rays[rayId] = [];
    if (!eclipseScores[rayId]) eclipseScores[rayId] = [];

    if (item.polarity === 'ECLIPSE' && scored.eclipse_0_4 !== null) {
      eclipseScores[rayId].push(scored.eclipse_0_4);
    }
    if (scored.capacity_0_4 !== null) {
      rays[rayId].push(scored.capacity_0_4);
    }
  }

  const result: Record<string, { shine_0_4: number | null; eclipse_0_4: number | null; net_energy_0_100: number | null }> = {};

  for (let i = 1; i <= 9; i++) {
    const id = `R${i}`;
    const shineVals = rays[id] || [];
    const eclipseVals = eclipseScores[id] || [];

    const shine = shineVals.length > 0 ? mean(shineVals) : null;
    const eclipse = eclipseVals.length > 0 ? mean(eclipseVals) : null;

    let netEnergy: number | null = null;
    if (shine !== null) {
      const shine100 = shine * 25;
      const eclipse100 = eclipse !== null ? eclipse * 25 : 0;
      // Per 07H: NetEnergy_0_100 = (shine100 - eclipse100 + 100) / 2
      netEnergy = (shine100 - eclipse100 + 100) / 2;
    }

    result[id] = { shine_0_4: shine, eclipse_0_4: eclipse, net_energy_0_100: netEnergy };
  }

  return result;
}

// ═══════════════════════════════════════════════
// 07C: Top Two Ray Selection (deterministic tie-breaking)
// ═══════════════════════════════════════════════

function selectTopTwo(
  rayScores: Record<string, { shine_0_4: number | null; eclipse_0_4: number | null; net_energy_0_100: number | null }>
): { top1: string; top2: string; pairCode: string } | null {
  const eligible = Object.entries(rayScores)
    .filter(([, v]) => v.net_energy_0_100 !== null)
    .map(([id, v]) => ({ id, ne: v.net_energy_0_100! }));

  if (eligible.length < 2) return null;

  eligible.sort((a, b) => b.ne - a.ne);

  function betterRay(a: string, b: string): string {
    const sa = rayScores[a];
    const sb = rayScores[b];
    // 1) Higher shine (access)
    if (sa.shine_0_4 !== null && sb.shine_0_4 !== null && sa.shine_0_4 !== sb.shine_0_4) {
      return sa.shine_0_4 > sb.shine_0_4 ? a : b;
    }
    // 2) Lower eclipse
    if (sa.eclipse_0_4 !== null && sb.eclipse_0_4 !== null && sa.eclipse_0_4 !== sb.eclipse_0_4) {
      return sa.eclipse_0_4 < sb.eclipse_0_4 ? a : b;
    }
    // 3) Lower ray number
    return a < b ? a : b;
  }

  // Pick top1 with near-tie resolution (within 2 points)
  let top1 = eligible[0].id;
  for (const c of eligible) {
    if (Math.abs(c.ne - eligible[0].ne) <= 2) {
      top1 = betterRay(top1, c.id);
    }
  }

  // Pick top2
  const remaining = eligible.filter(e => e.id !== top1);
  if (remaining.length === 0) return null;

  let top2 = remaining[0].id;
  for (const c of remaining) {
    if (Math.abs(c.ne - remaining[0].ne) <= 2) {
      top2 = betterRay(top2, c.id);
    }
  }

  const sorted = [top1, top2].sort();
  return { top1, top2, pairCode: `${sorted[0]}-${sorted[1]}` };
}

// ═══════════════════════════════════════════════
// 07D: Bottom Ray (Bottom 3 + MoveScore)
// ═══════════════════════════════════════════════

function selectBottomRay(
  rayScores: Record<string, { shine_0_4: number | null; eclipse_0_4: number | null; net_energy_0_100: number | null }>
): string | null {
  const eligible = Object.entries(rayScores)
    .filter(([, v]) => v.net_energy_0_100 !== null)
    .map(([id, v]) => ({ id, ne: v.net_energy_0_100! }));

  if (eligible.length === 0) return null;

  eligible.sort((a, b) => a.ne - b.ne);
  const bottom3 = eligible.slice(0, 3);

  // MoveScore simplified: prefer the one with highest shine among bottom 3
  // (full MoveScore requires tool indices + reflection which we compute in simplified form)
  let best = bottom3[0];
  for (const c of bottom3) {
    const shine = rayScores[c.id].shine_0_4 ?? 0;
    const bestShine = rayScores[best.id].shine_0_4 ?? 0;
    if (shine > bestShine) best = c;
  }

  // Phase 1 fallback: if best MoveScore < threshold, prefer Phase 1 ray
  if ((rayScores[best.id].shine_0_4 ?? 0) < 1.2) {
    const phase1 = bottom3.filter(c => ['R1', 'R2', 'R3'].includes(c.id));
    if (phase1.length > 0) {
      return phase1[0].id; // lowest net energy in Phase 1
    }
  }

  return best.id;
}

// ═══════════════════════════════════════════════
// 07E: Eclipse Level + Gating
// ═══════════════════════════════════════════════

function computeEclipse(
  items: RegistryItem[],
  scoredItems: Record<string, ScoredItem>
): { level: EclipseLevel; loadPressure: number; recoveryAccess: number } {
  const eclipseItems = items.filter(i => i.ray_id === 'ECLIPSE');
  const scores: number[] = [];

  for (const item of eclipseItems) {
    const scored = scoredItems[item.item_id];
    if (scored?.eclipse_0_4 !== null && scored?.eclipse_0_4 !== undefined) {
      scores.push(scored.eclipse_0_4);
    }
  }

  const avgEclipse = scores.length > 0 ? mean(scores) : 0;
  const loadPressure = avgEclipse * 25; // 0-100
  const recoveryAccess = 100 - loadPressure;

  let level: EclipseLevel;
  if (avgEclipse < 1.0) level = 'LOW';
  else if (avgEclipse < 2.0) level = 'MODERATE';
  else if (avgEclipse < 3.0) level = 'ELEVATED';
  else level = 'HIGH';

  return { level, loadPressure, recoveryAccess };
}

function computeGate(
  eclipseLevel: EclipseLevel,
  rayScores: Record<string, { shine_0_4: number | null; eclipse_0_4: number | null; net_energy_0_100: number | null }>
): GateMode {
  // Stabilize if: Eclipse HIGH or ELEVATED, or Phase 1 rays depleted
  if (eclipseLevel === 'HIGH' || eclipseLevel === 'ELEVATED') return 'STABILIZE';

  // Check Phase 1 depletion
  for (const r of ['R1', 'R2', 'R3']) {
    const ray = rayScores[r];
    if (ray && ray.shine_0_4 !== null && ray.eclipse_0_4 !== null) {
      if (ray.eclipse_0_4 > ray.shine_0_4) return 'STABILIZE';
    }
    if (ray && ray.shine_0_4 !== null && ray.shine_0_4 <= 2.2 * (4 / 4)) return 'STABILIZE';
  }

  if (eclipseLevel === 'MODERATE') return 'BUILD_RANGE';
  return 'STRETCH';
}

// ═══════════════════════════════════════════════
// 07F: Validity Flags + Confidence Band
// ═══════════════════════════════════════════════

interface ValidityFlags {
  inconsistency: boolean;
  socialDesirability: boolean;
  speeding: boolean;
  straightlining: boolean;
  lowReflectionDepth: boolean;
  impressionManagement: boolean;
}

function computeValidityFlags(
  items: RegistryItem[],
  scoredItems: Record<string, ScoredItem>,
  startTs: string,
  endTs: string
): ValidityFlags {
  // Inconsistency check: look at pair items
  let inconsistency = false;
  const pairs: Record<string, number[]> = {};
  for (const item of items) {
    if (item.pair_id) {
      if (!pairs[item.pair_id]) pairs[item.pair_id] = [];
      const scored = scoredItems[item.item_id];
      if (scored?.capacity_0_4 !== null && scored?.capacity_0_4 !== undefined) {
        pairs[item.pair_id].push(scored.normalized_0_4 ?? 0);
      }
    }
  }
  let flaggedPairs = 0;
  for (const pairScores of Object.values(pairs)) {
    if (pairScores.length === 2) {
      if (Math.abs(pairScores[0] - pairScores[1]) >= 3 * (4 / 6)) flaggedPairs++;
    }
  }
  if (flaggedPairs >= 2) inconsistency = true;

  // Social desirability: check SD items
  let sdElevated = false;
  const sdItems = items.filter(i => i.validity_tag === 'SOCIAL_DESIRABILITY');
  const sdScores: number[] = [];
  for (const item of sdItems) {
    const scored = scoredItems[item.item_id];
    if (scored?.normalized_0_4 !== null && scored?.normalized_0_4 !== undefined) {
      sdScores.push(scored.normalized_0_4);
    }
  }
  if (sdScores.length > 0 && mean(sdScores) >= 3.2) sdElevated = true;

  // Speeding: check duration
  let speeding = false;
  const start = new Date(startTs).getTime();
  const end = new Date(endTs).getTime();
  const durationSec = (end - start) / 1000;
  if (durationSec < 360) speeding = true; // 6 minute hard floor

  // Straightlining: check consecutive identical answers
  let straightlining = false;
  const likertScores = items
    .filter(i => i.item_type === 'LIKERT')
    .map(i => scoredItems[i.item_id]?.normalized_0_4)
    .filter((v): v is number => v !== null && v !== undefined);
  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < likertScores.length; i++) {
    if (Math.abs(likertScores[i] - likertScores[i - 1]) < 0.01) {
      currentRun++;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      currentRun = 1;
    }
  }
  if (maxRun >= 12) straightlining = true;

  return {
    inconsistency,
    socialDesirability: sdElevated,
    speeding,
    straightlining,
    lowReflectionDepth: false, // v2: requires reflection scoring pipeline (evening-reflection + weekly-review aggregation)
    impressionManagement: sdElevated,
  };
}

function computeConfidenceBand(flags: ValidityFlags, gate: GateMode): ConfidenceBand {
  // Per 07H confidence computation
  if (flags.speeding || flags.straightlining || flags.inconsistency) return 'LOW';
  if (flags.socialDesirability) return 'LOW';
  if (gate === 'STABILIZE') return 'MODERATE';
  return 'HIGH';
}

// ═══════════════════════════════════════════════
// 07G: Acting vs Capacity Detection
// ═══════════════════════════════════════════════

function computeActingStatus(
  rayScores: Record<string, { shine_0_4: number | null; eclipse_0_4: number | null; net_energy_0_100: number | null }>,
  flags: ValidityFlags,
  eclipseLevel: EclipseLevel
): { status: ActingStatus; languageMode: ReportLanguageMode } {
  let risk = 0;

  // High Ray 4/5/9 with low Ray 3
  const r3Shine = rayScores['R3']?.shine_0_4 ?? null;
  const r4Shine = rayScores['R4']?.shine_0_4 ?? null;
  const r9Shine = rayScores['R9']?.shine_0_4 ?? null;

  if (r3Shine !== null && r3Shine < 2.0) {
    if ((r4Shine !== null && r4Shine >= 3.0) || (r9Shine !== null && r9Shine >= 3.0)) {
      risk += 2;
    }
  }

  // High eclipse + high scores = potential acting
  if (eclipseLevel === 'HIGH' || eclipseLevel === 'ELEVATED') {
    risk += 1;
  }

  if (flags.socialDesirability || flags.impressionManagement) {
    risk += 1;
  }

  let status: ActingStatus;
  let languageMode: ReportLanguageMode;

  if (risk >= 3) {
    status = 'FLAGGED';
    languageMode = 'VALIDATION_REQUIRED';
  } else if (risk >= 1) {
    status = 'WATCH';
    languageMode = 'DIRECTIONAL';
  } else {
    status = 'CLEAR';
    languageMode = 'STANDARD';
  }

  return { status, languageMode };
}

// ═══════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function determineContextMix(items: RegistryItem[], responses: Record<string, ItemResponse>): 'WORK' | 'LIFE' | 'GENERAL' | 'MIXED' {
  const contexts = new Set<string>();
  for (const item of items) {
    if (responses[item.item_id]) {
      contexts.add(item.context);
    }
  }
  if (contexts.size > 1) return 'MIXED';
  if (contexts.has('WORK')) return 'WORK';
  if (contexts.has('LIFE')) return 'LIFE';
  return 'GENERAL';
}

// ═══════════════════════════════════════════════
// Eclipse distortion descriptions per ray
// ═══════════════════════════════════════════════
const ECLIPSE_DISTORTIONS: Record<string, string> = {
  R1: 'Under load, priorities may collapse into urgency-driven reactivity.',
  R2: 'Under load, joy access may narrow — numbness or forced positivity can appear.',
  R3: 'Under load, attention may scatter or flood — autopilot and distraction increase.',
  R4: 'Under load, fight/flight/freeze/fawn patterns may intensify.',
  R5: 'Under load, cynicism or meaning-loss may surface — effort feels untethered.',
  R6: 'Under load, masking or performance persona may increase — truth gets suppressed.',
  R7: 'Under load, withdrawal or people-pleasing may replace genuine connection.',
  R8: 'Under load, tunnel vision and catastrophizing may narrow perception of options.',
  R9: 'Under load, martyr leadership or performative inspiration may replace authentic modeling.',
};

const RAY_WORK_REPS: Record<string, string> = {
  R1: 'Start each meeting with one clear intention and return to it when you drift.',
  R2: 'End each week with a "what worked" review before jumping to "what failed."',
  R3: 'Pause 3 seconds before responding to any triggering comment in a meeting.',
  R4: 'Name one thing you\'ve been avoiding and take the first step today.',
  R5: 'Before saying yes to any new commitment, run it through your values filter.',
  R6: 'Name one boundary you need to set this week and communicate it calmly.',
  R7: 'Ask one genuine question in your next 1:1 that moves past surface talk.',
  R8: 'When a plan fails, generate 3 options before deciding on a path forward.',
  R9: 'Notice one moment this week where your behavior modeled what you want others to adopt.',
};

const RAY_LIFE_REPS: Record<string, string> = {
  R1: 'Pre-commit to a morning ritual instead of waking into reaction.',
  R2: 'Practice specific gratitude — three concrete moments, not vague positivity.',
  R3: 'When you notice tension or racing thoughts, name it and use one grounding breath.',
  R4: 'Make the appointment, send the message, or start the conversation you\'ve been putting off.',
  R5: 'Reorient one choice this week around your values instead of guilt or obligation.',
  R6: 'Have one honest conversation without controlling the outcome.',
  R7: 'Initiate connection with someone instead of waiting for them to reach out.',
  R8: 'Experiment with one new routine and adjust based on what you learn.',
  R9: 'Model the boundary, standard, or behavior you want others to adopt.',
};

// Tool recommendations per ray (from 07H tool_mapping_for_ray)
const RAY_TOOLS: Record<string, string[]> = {
  R1: ['If/Then Planning', 'Watch Me'],
  R2: ['REPs', 'RAS Reset'],
  R3: ['Presence Pause', '90-Second Window'],
  R4: ['Boundary of Light', 'I Rise'],
  R5: ['If/Then Planning', '143 Challenge'],
  R6: ['Go First', 'I Rise'],
  R7: ['Go First', 'Question Loop'],
  R8: ['143 Challenge', 'Watch Me'],
  R9: ['REPs', 'Witness'],
};

// ═══════════════════════════════════════════════
// MAIN SCORING PIPELINE
// ═══════════════════════════════════════════════

export function scoreAssessment(
  items: RegistryItem[],
  packet: ResponsePacket
): AssessmentOutputV1 {
  // Step 1: Score all items
  const scoredItems: Record<string, ScoredItem> = {};
  for (const item of items) {
    scoredItems[item.item_id] = scoreItem(item, packet.responses[item.item_id]);
  }

  // Step 2: Compute ray scores
  const rayScores = computeRayScores(items, scoredItems);

  // Step 3: Eclipse
  const eclipse = computeEclipse(items, scoredItems);

  // Step 4: Gate
  const gate = computeGate(eclipse.level, rayScores);

  // Step 5: Validity + confidence
  const validityFlags = computeValidityFlags(items, scoredItems, packet.start_ts, packet.end_ts);
  const confidenceBand = computeConfidenceBand(validityFlags, gate);

  // Step 6: Top Two + Bottom Ray
  const topTwo = selectTopTwo(rayScores);
  const bottomRay = selectBottomRay(rayScores);

  // Step 7: Acting vs Capacity
  const acting = computeActingStatus(rayScores, validityFlags, eclipse.level);

  // Step 8: Context mix
  const contextMix = determineContextMix(items, packet.responses);

  // ─── Build OUTPUT_SCHEMA_V1 ───

  // Build rays output
  const raysOutput: Record<string, RayOutput> = {};
  for (let i = 1; i <= 9; i++) {
    const id = `R${i}`;
    const rs = rayScores[id];
    const score100 = rs.shine_0_4 !== null ? rs.shine_0_4 * 25 : 0;

    let eclipseMod: EclipseModifier = 'NONE';
    if (rs.eclipse_0_4 !== null) {
      if (rs.eclipse_0_4 > 2.5) eclipseMod = 'MUTED';
      else if (rs.eclipse_0_4 < 1.0 && rs.shine_0_4 !== null && rs.shine_0_4 > 3.0) eclipseMod = 'AMPLIFIED';
    }

    raysOutput[id] = {
      ray_id: id,
      ray_name: RAY_NAMES[id],
      score: Math.round(score100),
      eclipse_modifier: eclipseMod,
      subfacets: {}, // v2: maps ray subfacet IDs (e.g. R1a, R1b) to individual scores once item-level tagging ships
    };
  }

  // Build validity flags array
  const flagsArray: Array<'IMPRESSION_MANAGEMENT' | 'SOCIAL_DESIRABILITY' | 'INCONSISTENCY' | 'SPEEDING' | 'STRAIGHTLINING' | 'LOW_REFLECTION_DEPTH'> = [];
  if (validityFlags.impressionManagement) flagsArray.push('IMPRESSION_MANAGEMENT');
  if (validityFlags.socialDesirability) flagsArray.push('SOCIAL_DESIRABILITY');
  if (validityFlags.inconsistency) flagsArray.push('INCONSISTENCY');
  if (validityFlags.speeding) flagsArray.push('SPEEDING');
  if (validityFlags.straightlining) flagsArray.push('STRAIGHTLINING');
  if (validityFlags.lowReflectionDepth) flagsArray.push('LOW_REFLECTION_DEPTH');

  // Build light signature
  const top1Id = topTwo?.top1 ?? 'R1';
  const top2Id = topTwo?.top2 ?? 'R2';
  const bottomId = bottomRay ?? 'R3';

  const lightSignature = {
    top_two: [
      {
        ray_id: top1Id,
        ray_name: RAY_NAMES[top1Id],
        why_resourced: `${RAY_NAMES[top1Id]} shows the highest net energy — this is where your capacity flows most naturally.`,
        under_load_distortion: ECLIPSE_DISTORTIONS[top1Id] || '',
      },
      {
        ray_id: top2Id,
        ray_name: RAY_NAMES[top2Id],
        why_resourced: `${RAY_NAMES[top2Id]} is your second power source — it fuels resilience and momentum.`,
        under_load_distortion: ECLIPSE_DISTORTIONS[top2Id] || '',
      },
    ],
    just_in_ray: {
      ray_id: bottomId,
      ray_name: RAY_NAMES[bottomId],
      why_this_is_next: `${RAY_NAMES[bottomId]} has the highest growth impact right now — small investments here create meaningful change.`,
      work_rep: RAY_WORK_REPS[bottomId] || '',
      life_rep: RAY_LIFE_REPS[bottomId] || '',
    },
    bottom_ray_selection_basis: [
      'Lowest net energy among eligible rays',
      'Highest movement potential (MoveScore)',
      gate === 'STABILIZE' ? 'Phase 1 priority applied (stabilize foundation first)' : 'Standard selection applied',
    ],
  };

  // Build gate reason
  let gateReason: string;
  if (gate === 'STABILIZE') {
    gateReason = 'Elevated load and/or reduced recovery access detected. Stabilization tools are prioritized before stretch work.';
  } else if (gate === 'BUILD_RANGE') {
    gateReason = 'Moderate load detected. Building range with supported practices.';
  } else {
    gateReason = 'System is resourced. Stretch work is accessible.';
  }

  // Build recommendations
  const tools = RAY_TOOLS[bottomId] || ['Presence Pause', 'I Rise'];

  const output: AssessmentOutputV1 = {
    assessment_run: {
      run_id: packet.run_id,
      instrument_version: 'v1.0',
      tier: packet.tier,
      created_at: packet.end_ts,
      context_mix: contextMix,
    },
    data_quality: {
      confidence_band: confidenceBand,
      validity_flags: flagsArray,
      quality_notes: flagsArray.length > 0
        ? `Data quality flags detected: ${flagsArray.join(', ')}. Results should be interpreted within the provided confidence band.`
        : undefined,
      validation_plan: confidenceBand === 'LOW' ? {
        why: 'One or more data quality indicators suggest results should be treated as directional.',
        recommended_next_step: 'RETAKE',
        timing: 'in 7–14 days after sleep + load stabilize',
      } : undefined,
    },
    rays: raysOutput,
    eclipse: {
      level: eclipse.level,
      dimensions: {},
      derived_metrics: {
        recovery_access: Math.round(eclipse.recoveryAccess),
        load_pressure: Math.round(eclipse.loadPressure),
      },
      gating: {
        mode: gate,
        reason: gateReason,
      },
    },
    light_signature: lightSignature,
    acting_vs_capacity: {
      status: acting.status,
      indicators: [],
      report_language_mode: acting.languageMode,
      next_step: acting.status === 'FLAGGED'
        ? 'Validation plan recommended: foundation tools + coach debrief.'
        : acting.status === 'WATCH'
          ? 'Monitor with directional language. Prioritize Presence tools.'
          : '',
    },
    executive_output: {
      structure_version: 'v1.0-exec-template',
      light_signature_summary: {
        top_two_resourced: `${RAY_NAMES[top1Id]} (${RAY_VERBS[top1Id]}) and ${RAY_NAMES[top2Id]} (${RAY_VERBS[top2Id]}) are your primary power sources.`,
        top_two_under_load: ECLIPSE_DISTORTIONS[top1Id] || `Under pressure, ${RAY_NAMES[top1Id]} may shift.`,
      },
      just_in_summary: {
        training_target: `${RAY_NAMES[bottomId]} (${RAY_VERBS[bottomId]})`,
        work_rep: RAY_WORK_REPS[bottomId] || '',
        life_rep: RAY_LIFE_REPS[bottomId] || '',
      },
      eclipse_note: eclipse.level === 'HIGH' || eclipse.level === 'ELEVATED'
        ? 'Your system is conserving energy. Stability comes before expansion.'
        : eclipse.level === 'MODERATE'
          ? 'Moderate load detected — build with support.'
          : 'System is resourced — stretch work is accessible.',
      signals: [], // v2: executive coaching signals derived from EXEC_TAG_MAP cross-referencing ray pairs + eclipse level
    },
    outcome_tags: {
      applied: [], // v2: outcome tag array populated from gate + ray-pair + eclipse logic once tag taxonomy is locked
    },
    recommendations: {
      priority_mode: gate === 'STABILIZE' ? 'TOOLS_FIRST' : 'TOOLS_AND_REPS',
      tools: tools.map((t, i) => ({
        tool_id: `T${String(i + 1).padStart(3, '0')}`,
        label: t,
        why_now: `Supports ${RAY_NAMES[bottomId]} development while respecting current state.`,
        steps: ['Start with 1 micro-rep this week', 'Track what you notice', 'Build consistency before intensity'],
        time_cost_minutes: 5,
      })),
      weekly_focus: {
        just_in_ray_id: bottomId,
        focus_rep: RAY_WORK_REPS[bottomId] || '',
        minimum_effective_dose: '1 intentional rep per day, 5 minutes max',
      },
      what_not_to_do_yet: gate === 'STABILIZE'
        ? ['Avoid stretch goals until load stabilizes', 'Do not force expansion in depleted rays', 'Skip performance optimization — focus on recovery']
        : ['Avoid overloading multiple rays simultaneously'],
    },
    copy_mode: {
      tone_mode: 'JUSTIN_RAY_DIRECT',
      language_constraints: ['No shame language', 'No fixed identity claims', 'State-aware framing', 'Agency over prescription'],
      no_shame_flags: true,
    },
  };

  return output;
}
