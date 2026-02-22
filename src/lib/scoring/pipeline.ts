// 07H §14: Main Scoring Pipeline
// The single entry point that orchestrates all scoring modules.
// Converts raw responses → full AssessmentOutputV1.

import type {
  BaseItem, ReflectionPrompt, ScoredItem, ResponsePacket,
  AssessmentOutputV1, RayComposite, ArchetypeBlock,
  ConfidenceBand, GateMode, EclipseLevel, EclipseModifier,
  ValidityFlagEnum, ActingStatus, ReportLanguageMode,
  ContextMix, RayOutput, SubfacetOutput, MoveRouting,
} from '../types';
import { RAY_NAMES, RAY_VERBS, TOOL_NAMES } from '../types';

import { scoreItem } from './item-scoring';
import { computeSubfacetComposites } from './subfacet-scoring';
import { computeRayComposites } from './ray-scoring';
import { computeToolComposites } from './tool-scoring';
import { computeIndices } from './indices';
import { computeGate, computePPD } from './gating';
import { selectTopTwo } from './top-two';
import { selectBottomRay } from './bottom-ray';
import { computeReflectionIndices } from './reflection';
import { computeAllValidity } from './validity';
import { computeConfidenceBand } from './confidence';
import { detectEdgeCases, determineProfileFlag } from './edge-cases';
import { computeExecTags, type ExecTagMapRow } from './exec-tags';
import { matchArchetype } from './archetype';
import { ECLIPSE_DISTORTIONS, TOOL_MAPPING_FOR_RAY, FALLBACK_TOOLS } from './constants';

// ═══════════════════════════════════════════
// ITEM BANKS — shape of data passed to pipeline
// ═══════════════════════════════════════════

export interface ItemBanks {
  rayItems: BaseItem[];
  toolItems: BaseItem[];
  eclipseItems: BaseItem[];
  validityItems: BaseItem[];
  reflectionPrompts: ReflectionPrompt[];
  execTagMap: ExecTagMapRow[];
  archetypeBlocks: ArchetypeBlock[];
}

// ═══════════════════════════════════════════
// HELPER: Determine eclipse level from indices
// ═══════════════════════════════════════════

function eclipseLevel(lsi04: number | null, eer: number | null, bri: number): EclipseLevel {
  // Use LSI as primary, with EER/BRI as modifiers
  if (lsi04 === null) return 'MODERATE'; // default when no data

  if (lsi04 >= 3.0 || (eer !== null && eer < 0.8) || bri >= 6) return 'HIGH';
  if (lsi04 >= 2.0 || (eer !== null && eer < 1.0) || bri >= 3) return 'ELEVATED';
  if (lsi04 >= 1.0) return 'MODERATE';
  return 'LOW';
}

function eclipseModifierForRay(ray: RayComposite): EclipseModifier {
  if (ray.shine_0_4 === null || ray.eclipse_0_4 === null) return 'NONE';
  const diff = ray.eclipse_0_4 - ray.shine_0_4;
  if (diff > 0.8) return 'AMPLIFIED';
  if (diff < -0.8) return 'MUTED';
  return 'NONE';
}

function actingStatus(ppd: string, gate: GateMode): ActingStatus {
  if (ppd === 'Elevated') return 'FLAGGED';
  if (gate === 'STABILIZE') return 'WATCH';
  return 'CLEAR';
}

function reportLanguageMode(confidence: ConfidenceBand, acting: ActingStatus): ReportLanguageMode {
  if (confidence === 'LOW') return 'VALIDATION_REQUIRED';
  if (acting === 'FLAGGED' || acting === 'WATCH') return 'DIRECTIONAL';
  return 'STANDARD';
}

function contextMix(rayItems: BaseItem[], responses: Record<string, { value: unknown }>): ContextMix {
  let workCount = 0;
  let lifeCount = 0;
  for (const item of rayItems) {
    if (responses[item.Item_ID]) {
      if (item.Context === 'Work') workCount++;
      else if (item.Context === 'Life') lifeCount++;
      else { workCount++; lifeCount++; }
    }
  }
  if (workCount > 0 && lifeCount > 0) return 'MIXED';
  if (workCount > 0) return 'WORK';
  if (lifeCount > 0) return 'LIFE';
  return 'GENERAL';
}

function collectValidityFlags(
  sdElevated: boolean,
  sdExtreme: boolean,
  inconsistencyFlag: boolean,
  speedingFlag: boolean,
  straightlineFlag: boolean,
  attentionFlag: boolean,
  infrequencyFlag: boolean,
  reflectionMissing: boolean,
  coverageFlag: boolean,
): ValidityFlagEnum[] {
  const flags: ValidityFlagEnum[] = [];
  if (sdExtreme) flags.push('SOCIAL_DESIRABILITY');
  else if (sdElevated) flags.push('IMPRESSION_MANAGEMENT');
  if (inconsistencyFlag) flags.push('INCONSISTENCY');
  if (speedingFlag) flags.push('SPEEDING');
  if (straightlineFlag) flags.push('STRAIGHTLINING');
  if (attentionFlag) flags.push('ATTENTION');
  if (infrequencyFlag) flags.push('INFREQUENCY');
  if (reflectionMissing) flags.push('LOW_REFLECTION_DEPTH');
  if (coverageFlag) flags.push('MISSINGNESS');
  return flags;
}

// ═══════════════════════════════════════════
// MAIN PIPELINE
// ═══════════════════════════════════════════

/**
 * Score an entire assessment from raw responses to full output.
 *
 * This is the single entry point for the scoring engine.
 * Follows the exact order from 07H §14:
 *   A) Score items → B) Reflections → C) Subfacets/Rays/Tools →
 *   D) Indices/Gates → E) Validity/Confidence → F) Top Two/Bottom →
 *   G) Executive tags → Output assembly
 */
export function scoreAssessment(
  packet: ResponsePacket,
  banks: ItemBanks,
  pilotMedianSeconds: number | null = null,
): AssessmentOutputV1 {

  // ─── A) Score all items ───
  const allItems: BaseItem[] = [
    ...banks.rayItems,
    ...banks.toolItems,
    ...banks.eclipseItems,
    ...banks.validityItems,
  ];

  const scoredItems: Record<string, ScoredItem> = {};
  for (const item of allItems) {
    const response = packet.responses[item.Item_ID];
    scoredItems[item.Item_ID] = scoreItem(item, response?.value);
  }

  // ─── B) Reflection indices ───
  const reflectionIndices = computeReflectionIndices(
    banks.reflectionPrompts,
    packet.reflection_responses,
  );

  // ─── C) Subfacets → Rays → Tools ───
  const { composites: subfacetComposites, coverage } = computeSubfacetComposites(
    banks.rayItems, scoredItems,
  );
  const rayComposites = computeRayComposites(subfacetComposites);
  const toolComposites = computeToolComposites(banks.toolItems, scoredItems);

  // ─── D) Indices and gating ───
  const indices = computeIndices(rayComposites, banks.eclipseItems, scoredItems);
  const gate = computeGate(rayComposites, indices.eer, indices.bri, indices.lsi_0_4);
  const { ppd, ppdFlag } = computePPD(rayComposites);
  indices.ppd_flag = ppdFlag;

  // ─── E) Validity and confidence ───
  const validity = computeAllValidity(
    banks.validityItems, scoredItems, rayComposites, coverage,
    packet.start_ts, packet.end_ts, pilotMedianSeconds,
  );

  // Fill in reflection-related validity fields
  validity.reflection_depth_avg = reflectionIndices.reflectionDepthAvg03;
  validity.reflection_strong = reflectionIndices.reflectionDepthAvg03 !== null &&
    reflectionIndices.reflectionDepthAvg03 >= 2.0;
  validity.reflection_thin = reflectionIndices.reflectionDepthAvg03 !== null &&
    reflectionIndices.reflectionDepthAvg03 >= 1.0 && reflectionIndices.reflectionDepthAvg03 < 2.0;
  validity.reflection_missing = reflectionIndices.reflectionDepthAvg03 === null ||
    reflectionIndices.reflectionDepthAvg03 < 1.0;

  const confidence = computeConfidenceBand(validity, gate, reflectionIndices);

  // ─── F) Top Two and Bottom Ray ───
  const topTwo = selectTopTwo(rayComposites);
  const bottomResult = selectBottomRay(rayComposites, toolComposites, reflectionIndices);

  // ─── Edge cases ───
  const edgeCases = detectEdgeCases(
    rayComposites, validity, reflectionIndices, topTwo, gate, indices.eer,
  );
  const profileFlag = determineProfileFlag(topTwo, edgeCases, validity);

  // ─── G) Executive tags ───
  const execSignals = computeExecTags(
    banks.execTagMap, rayComposites, toolComposites,
    gate, confidence, validity.sd_elevated, validity.inconsistency_flag,
  );

  // ─── Archetype matching ───
  const archetype = topTwo ? matchArchetype(topTwo.pairCode, banks.archetypeBlocks) : null;

  // ═══════════════════════════════════════════
  // ASSEMBLE OUTPUT
  // ═══════════════════════════════════════════

  const acting = actingStatus(ppd, gate);
  const langMode = reportLanguageMode(confidence, acting);
  const ctxMix = contextMix(banks.rayItems, packet.responses);

  // Build ray outputs for the report
  const raysOutput: Record<string, RayOutput> = {};
  for (let r = 1; r <= 9; r++) {
    const rayId = `R${r}`;
    const ray = rayComposites[rayId];
    if (!ray) continue;

    // Build subfacet outputs for this ray
    const sfOutputs: Record<string, SubfacetOutput> = {};
    for (const letter of ['a', 'b', 'c', 'd']) {
      const sfCode = `R${r}${letter}`;
      const sf = subfacetComposites[sfCode];
      if (!sf) continue;
      sfOutputs[sfCode] = {
        subfacet_id: sfCode,
        label: sf.subfacet_name,
        score: sf.shine_0_4 !== null ? sf.shine_0_4 * 25 : 0,
        polarity_mix: {
          shine: sf.shine_0_4 !== null ? sf.shine_0_4 * 25 : 0,
          eclipse: sf.eclipse_0_4 !== null ? sf.eclipse_0_4 * 25 : 0,
        },
        signal_tags: [], // populated from exec tag links
      };
    }

    raysOutput[rayId] = {
      ray_id: rayId,
      ray_name: ray.ray_name,
      score: ray.shine_0_100 ?? 0,
      access_score: ray.access_0_100 ?? undefined,
      eclipse_score: ray.eclipse_0_100 ?? undefined,
      net_energy: ray.net_energy_0_100 ?? undefined,
      eclipse_modifier: eclipseModifierForRay(ray),
      subfacets: sfOutputs,
    };
  }

  // Build Top Two descriptions
  const top1Id = topTwo ? `R${topTwo.topRay1}` : 'R1';
  const top2Id = topTwo ? `R${topTwo.topRay2}` : 'R2';
  const top1Name = RAY_NAMES[top1Id] || 'Unknown';
  const top2Name = RAY_NAMES[top2Id] || 'Unknown';
  const top1Verb = RAY_VERBS[top1Id] || '';
  const top2Verb = RAY_VERBS[top2Id] || '';

  // Bottom ray info
  const bottomRayId = bottomResult ? `R${bottomResult.bottomRay}` : 'R3';
  const bottomRayName = RAY_NAMES[bottomRayId] || 'Unknown';
  const bottomRayVerb = RAY_VERBS[bottomRayId] || '';
  const bottomRayMs = bottomResult?.candidates.find((c) => c.ray_id === bottomRayId)?.move_score ?? 0;
  const routing: MoveRouting = bottomResult?.routing ?? 'STABILIZE_RETEST';

  // Eclipse output
  const eclipseLvl = eclipseLevel(indices.lsi_0_4, indices.eer, indices.bri);
  const recoveryAccess = indices.lsi_0_4 !== null ? Math.round((1 - indices.lsi_0_4 / 4) * 100) : 50;
  const loadPressure = indices.lsi_0_100 !== null ? Math.round(indices.lsi_0_100) : 50;

  // Gate description
  let gateReason = '';
  if (gate === 'STABILIZE') {
    gateReason = 'Elevated load and/or reduced recovery access detected. Stabilization tools are prioritized before stretch work.';
  } else {
    gateReason = 'System is clear for progressive development work.';
  }

  // Priority mode
  const priorityMode = gate === 'STABILIZE' ? 'TOOLS_FIRST' as const :
    (routing === 'STRETCH' ? 'REPS_ONLY' as const : 'TOOLS_AND_REPS' as const);

  // Validity flags list
  const validityFlags = collectValidityFlags(
    validity.sd_elevated, validity.sd_extreme,
    validity.inconsistency_flag, validity.speeding_flag,
    validity.straightline_flag, validity.attention_flag,
    validity.infrequency_flag, validity.reflection_missing,
    validity.coverage_flag,
  );

  const output: AssessmentOutputV1 = {
    assessment_run: {
      run_id: packet.run_id,
      instrument_version: 'v1.0',
      tier: packet.tier,
      created_at: new Date().toISOString(),
      context_mix: ctxMix,
    },

    data_quality: {
      confidence_band: confidence,
      validity_flags: validityFlags,
      quality_notes: validityFlags.length > 0
        ? `${validityFlags.length} validity flag(s) detected. ${confidence === 'LOW' ? 'Results are preliminary.' : 'Results should be interpreted with awareness of these indicators.'}`
        : undefined,
      validation_plan: confidence === 'LOW' ? {
        why: 'Multiple validity concerns reduce confidence in current results.',
        recommended_next_step: 'COACH_DEBRIEF',
        timing: 'Within 2 weeks',
      } : undefined,
    },

    rays: raysOutput,

    eclipse: {
      level: eclipseLvl,
      dimensions: {}, // detailed eclipse dimensions deferred to Phase 5
      derived_metrics: {
        recovery_access: recoveryAccess,
        load_pressure: loadPressure,
        eer: indices.eer ?? undefined,
        bri: indices.bri,
        performance_presence_delta: ppdFlag ? 1 : 0,
      },
      gating: {
        mode: gate,
        reason: gateReason,
      },
    },

    light_signature: {
      archetype: archetype ? {
        name: archetype.name,
        pair_code: archetype.pair_code,
        essence: archetype.essence,
        work_expression: archetype.work_expression || undefined,
        life_expression: archetype.life_expression || undefined,
        strengths: archetype.strengths || undefined,
        stress_distortion: archetype.stress_distortion || undefined,
        coaching_logic: archetype.coaching_logic || undefined,
        starting_tools: archetype.starting_tools || undefined,
        micro_reps: archetype.micro_reps || undefined,
        reflection_prompts: archetype.reflection_prompts || undefined,
      } : undefined,
      top_two: [
        {
          ray_id: top1Id,
          ray_name: top1Name,
          why_resourced: `${top1Name} (${top1Verb}) shows the highest net access — this is where your capacity flows most naturally.`,
          under_load_distortion: ECLIPSE_DISTORTIONS[top1Id] || `Under pressure, ${top1Name} may shift.`,
        },
        {
          ray_id: top2Id,
          ray_name: top2Name,
          why_resourced: `${top2Name} (${top2Verb}) is your second power source — it fuels resilience and momentum.`,
          under_load_distortion: ECLIPSE_DISTORTIONS[top2Id] || `Under pressure, ${top2Name} may shift.`,
        },
      ],
      just_in_ray: {
        ray_id: bottomRayId,
        ray_name: bottomRayName,
        why_this_is_next: `${bottomRayName} (${bottomRayVerb}) has the highest growth impact right now — small investments here create meaningful change.`,
        work_rep: archetype?.micro_reps?.split('\n')[0] || `Practice one ${bottomRayName} micro-rep in your next work interaction.`,
        life_rep: archetype?.micro_reps?.split('\n')[1] || `When you notice tension, apply one ${bottomRayName} practice in your personal life.`,
        move_score: bottomRayMs,
        routing,
      },
      bottom_ray_selection_basis: [
        'Lowest net access among eligible rays',
        'Highest movement potential (Movement)',
        bottomResult?.fallback === 'Phase1'
          ? 'Phase 1 priority applied (stabilize foundation first)'
          : 'Standard selection applied',
      ],
    },

    acting_vs_capacity: {
      status: acting,
      indicators: ppdFlag ? [{
        indicator_id: 'PPD',
        label: 'Performance vs Presence Delta',
        level: 'ELEVATED',
        evidence: ['Output rays (R4/R5/R9) show high shine while Presence (R3) shows low access or high eclipse.'],
      }] : [],
      report_language_mode: langMode,
      next_step: acting === 'FLAGGED'
        ? `Monitor with directional language. Prioritize ${bottomRayName} tools.`
        : acting === 'WATCH'
          ? 'System is in stabilization mode. Focus on recovery tools before expansion.'
          : 'System is clear. Proceed with standard development path.',
    },

    executive_output: {
      structure_version: 'v1.0-exec-template',
      light_signature_summary: {
        top_two_resourced: `${top1Name} (${top1Verb}) and ${top2Name} (${top2Verb}) are your primary power sources.`,
        top_two_under_load: ECLIPSE_DISTORTIONS[top1Id] || `Under pressure, ${top1Name} may shift.`,
      },
      just_in_summary: {
        training_target: `${bottomRayName} (${bottomRayVerb})`,
        work_rep: archetype?.micro_reps?.split('\n')[0] || `Practice one ${bottomRayName} micro-rep at work.`,
        life_rep: archetype?.micro_reps?.split('\n')[1] || `Apply one ${bottomRayName} practice in life.`,
      },
      eclipse_note: gate === 'STABILIZE'
        ? 'Your system is conserving energy. Stability comes before expansion.'
        : 'Your system has capacity for progressive development.',
      // OUTPUT_SCHEMA_V1 specifies "array length 6" — take top 6 by level rank
      signals: [...execSignals]
        .sort((a, b) => {
          const rank = { HIGH: 4, ELEVATED: 3, MODERATE: 2, LOW: 1 } as Record<string, number>;
          return (rank[b.level] ?? 0) - (rank[a.level] ?? 0);
        })
        .slice(0, 6),
    },

    outcome_tags: {
      // Outcome tags derived from exec signals — only applied when ≥ 2 drivers support it
      applied: execSignals
        .filter((s) => (s.level === 'HIGH' || s.level === 'ELEVATED') && s.drivers.length >= 2)
        .map((s) => ({
          tag_id: s.signal_id,
          label: s.label,
          confidence,
          evidence: s.drivers,
        })),
    },

    recommendations: {
      priority_mode: priorityMode,
      tools: (() => {
        // Use bottom ray's canonical tools from TOOL_MAPPING_FOR_RAY
        const bottomRayNum = bottomResult ? bottomResult.bottomRay : 3;
        const [toolId1, toolId2] = TOOL_MAPPING_FOR_RAY[bottomRayNum] || FALLBACK_TOOLS;
        const toolName1 = TOOL_NAMES[toolId1] || toolId1;
        const toolName2 = TOOL_NAMES[toolId2] || toolId2;

        // If archetype has starting_tools, use those labels but keep canonical IDs
        const archetypeTools = archetype?.starting_tools?.split('\n').filter(Boolean) || [];

        return [
          {
            tool_id: toolId1,
            label: archetypeTools[0] || toolName1,
            why_now: gate === 'STABILIZE'
              ? `Stabilizes your foundation before expanding ${bottomRayName}.`
              : `Supports ${bottomRayName} development — small reps, real results.`,
            steps: [
              `Try one ${toolName1} rep today — just 2 minutes`,
              'Notice what shifts, even slightly',
              'Build consistency before intensity',
            ],
            time_cost_minutes: 5,
          },
          {
            tool_id: toolId2,
            label: archetypeTools[1] || toolName2,
            why_now: gate === 'STABILIZE'
              ? `Creates safety for ${bottomRayName} to come back online.`
              : `Builds ${bottomRayName} range through intentional practice.`,
            steps: [
              `Start with 1 ${toolName2} rep this week`,
              'Track what you notice — receipts matter',
              'A two-minute rep counts. Keep the chain alive.',
            ],
            time_cost_minutes: 5,
          },
        ];
      })(),
      weekly_focus: {
        just_in_ray_id: bottomRayId,
        focus_rep: archetype?.micro_reps?.split('\n')[0] || `Practice one ${bottomRayName} micro-rep per day.`,
        minimum_effective_dose: '1 intentional rep per day, 5 minutes max',
      },
      thirty_day_plan: {
        week_1: 'Install foundational tools. Focus on awareness and one micro-rep per day.',
        weeks_2_4: `Build ${bottomRayName} capacity through daily reps, powered by your ${top1Name} and ${top2Name} strengths.`,
      },
      coaching_questions: archetype?.reflection_prompts?.split('\n').filter(Boolean).slice(0, 3) || [
        `What does ${bottomRayName} look like when it\'s working well in your life?`,
        `When do you most need ${bottomRayName} at work?`,
        'What would change if this skill improved by just 10%?',
      ],
      what_not_to_do_yet: gate === 'STABILIZE' ? [
        'Avoid stretch goals until load stabilizes',
        'Do not force expansion in depleted rays',
        'Skip performance optimization — focus on recovery',
      ] : [
        'Don\'t try to improve all rays at once',
        'Don\'t skip tool installation in Week 1',
        'Don\'t push intensity before consistency is established',
      ],
    },

    copy_mode: {
      tone_mode: 'JUSTIN_RAY_DIRECT',
      language_constraints: [
        'No shame language',
        'No fixed identity claims',
        'State-aware framing',
        'Agency over prescription',
      ],
      no_shame_flags: true,
    },

    // Internal tracking
    edge_cases: edgeCases,
    indices,
    profile_flag: profileFlag,
  };

  return output;
}
