/**
 * Energy Star Chart — Sample data for preview mode.
 * Extracted from SampleReportClient so both can share the same constants.
 */

import type {
  EclipseOutput,
  RayOutput,
  LightSignatureOutput,
  AssessmentIndices,
} from '@/lib/types';

/* ── Ray scores ── */

export const SAMPLE_RAYS: Record<string, RayOutput> = {
  R1: {
    ray_id: 'R1', ray_name: 'Intention', score: 72, net_energy: 72,
    access_score: 65, eclipse_score: 28, eclipse_modifier: 'NONE',
    subfacets: {
      R1a: { subfacet_id: 'R1a', label: 'Daily Intentionality', score: 78, polarity_mix: { shine: 78, eclipse: 22 }, signal_tags: [] },
      R1b: { subfacet_id: 'R1b', label: 'Time/Attention Architecture', score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R1c: { subfacet_id: 'R1c', label: 'Boundary Clarity', score: 70, polarity_mix: { shine: 70, eclipse: 30 }, signal_tags: [] },
      R1d: { subfacet_id: 'R1d', label: 'Pre-Decision Practice', score: 74, polarity_mix: { shine: 74, eclipse: 26 }, signal_tags: [] },
    },
  },
  R2: {
    ray_id: 'R2', ray_name: 'Joy', score: 45, net_energy: 45,
    access_score: 38, eclipse_score: 58, eclipse_modifier: 'NONE',
    subfacets: {
      R2a: { subfacet_id: 'R2a', label: 'Joy Access', score: 42, polarity_mix: { shine: 42, eclipse: 58 }, signal_tags: [] },
      R2b: { subfacet_id: 'R2b', label: 'Gratitude Practice', score: 50, polarity_mix: { shine: 50, eclipse: 50 }, signal_tags: [] },
      R2c: { subfacet_id: 'R2c', label: 'Reinforcement Behavior', score: 38, polarity_mix: { shine: 38, eclipse: 62 }, signal_tags: [] },
      R2d: { subfacet_id: 'R2d', label: 'Recovery Integration', score: 48, polarity_mix: { shine: 48, eclipse: 52 }, signal_tags: [] },
    },
  },
  R3: {
    ray_id: 'R3', ray_name: 'Presence', score: 68, net_energy: 68,
    access_score: 60, eclipse_score: 32, eclipse_modifier: 'NONE',
    subfacets: {
      R3a: { subfacet_id: 'R3a', label: 'Attention Stability', score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
      R3b: { subfacet_id: 'R3b', label: 'Cognitive Flexibility', score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R3c: { subfacet_id: 'R3c', label: 'Body Signal Awareness', score: 62, polarity_mix: { shine: 62, eclipse: 38 }, signal_tags: [] },
      R3d: { subfacet_id: 'R3d', label: 'Emotional Regulation', score: 70, polarity_mix: { shine: 70, eclipse: 30 }, signal_tags: [] },
    },
  },
  R4: {
    ray_id: 'R4', ray_name: 'Power', score: 85, net_energy: 85,
    access_score: 80, eclipse_score: 15, eclipse_modifier: 'NONE',
    subfacets: {
      R4a: { subfacet_id: 'R4a', label: 'Agency/Action Orientation', score: 88, polarity_mix: { shine: 88, eclipse: 12 }, signal_tags: [] },
      R4b: { subfacet_id: 'R4b', label: 'Boundary Enforcement', score: 82, polarity_mix: { shine: 82, eclipse: 18 }, signal_tags: [] },
      R4c: { subfacet_id: 'R4c', label: 'Conflict Engagement', score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R4d: { subfacet_id: 'R4d', label: 'Power Under Pressure', score: 90, polarity_mix: { shine: 90, eclipse: 10 }, signal_tags: [] },
    },
  },
  R5: {
    ray_id: 'R5', ray_name: 'Purpose', score: 91, net_energy: 91,
    access_score: 88, eclipse_score: 9, eclipse_modifier: 'NONE',
    subfacets: {
      R5a: { subfacet_id: 'R5a', label: 'Purpose Clarity', score: 94, polarity_mix: { shine: 94, eclipse: 6 }, signal_tags: [] },
      R5b: { subfacet_id: 'R5b', label: 'Values Alignment', score: 90, polarity_mix: { shine: 90, eclipse: 10 }, signal_tags: [] },
      R5c: { subfacet_id: 'R5c', label: 'Meaningful Contribution', score: 88, polarity_mix: { shine: 88, eclipse: 12 }, signal_tags: [] },
      R5d: { subfacet_id: 'R5d', label: 'Long-Range Thinking', score: 92, polarity_mix: { shine: 92, eclipse: 8 }, signal_tags: [] },
    },
  },
  R6: {
    ray_id: 'R6', ray_name: 'Authenticity', score: 63, net_energy: 63,
    access_score: 55, eclipse_score: 42, eclipse_modifier: 'AMPLIFIED',
    subfacets: {
      R6a: { subfacet_id: 'R6a', label: 'Self-Disclosure', score: 58, polarity_mix: { shine: 58, eclipse: 42 }, signal_tags: [] },
      R6b: { subfacet_id: 'R6b', label: 'Congruence', score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R6c: { subfacet_id: 'R6c', label: 'Vulnerability Tolerance', score: 55, polarity_mix: { shine: 55, eclipse: 45 }, signal_tags: [] },
      R6d: { subfacet_id: 'R6d', label: 'Identity Integration', score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
    },
  },
  R7: {
    ray_id: 'R7', ray_name: 'Connection', score: 78, net_energy: 78,
    access_score: 72, eclipse_score: 22, eclipse_modifier: 'NONE',
    subfacets: {
      R7a: { subfacet_id: 'R7a', label: 'Relational Safety Creation', score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R7b: { subfacet_id: 'R7b', label: 'Empathic Accuracy', score: 75, polarity_mix: { shine: 75, eclipse: 25 }, signal_tags: [] },
      R7c: { subfacet_id: 'R7c', label: 'Repair Initiation', score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
      R7d: { subfacet_id: 'R7d', label: 'Trust Building', score: 84, polarity_mix: { shine: 84, eclipse: 16 }, signal_tags: [] },
    },
  },
  R8: {
    ray_id: 'R8', ray_name: 'Possibility', score: 56, net_energy: 56,
    access_score: 48, eclipse_score: 46, eclipse_modifier: 'NONE',
    subfacets: {
      R8a: { subfacet_id: 'R8a', label: 'Cognitive Openness', score: 60, polarity_mix: { shine: 60, eclipse: 40 }, signal_tags: [] },
      R8b: { subfacet_id: 'R8b', label: 'Divergent Thinking', score: 52, polarity_mix: { shine: 52, eclipse: 48 }, signal_tags: [] },
      R8c: { subfacet_id: 'R8c', label: 'Adaptive Flexibility', score: 50, polarity_mix: { shine: 50, eclipse: 50 }, signal_tags: [] },
      R8d: { subfacet_id: 'R8d', label: 'Creative Problem-Solving', score: 62, polarity_mix: { shine: 62, eclipse: 38 }, signal_tags: [] },
    },
  },
  R9: {
    ray_id: 'R9', ray_name: 'Be The Light', score: 82, net_energy: 82,
    access_score: 78, eclipse_score: 18, eclipse_modifier: 'NONE',
    subfacets: {
      R9a: { subfacet_id: 'R9a', label: 'Behavioral Modeling', score: 85, polarity_mix: { shine: 85, eclipse: 15 }, signal_tags: [] },
      R9b: { subfacet_id: 'R9b', label: 'Standard Setting', score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R9c: { subfacet_id: 'R9c', label: 'Generative Impact', score: 78, polarity_mix: { shine: 78, eclipse: 22 }, signal_tags: [] },
      R9d: { subfacet_id: 'R9d', label: 'Legacy Orientation', score: 84, polarity_mix: { shine: 84, eclipse: 16 }, signal_tags: [] },
    },
  },
};

export const SAMPLE_TOP_TWO = ['R5', 'R4'];
export const SAMPLE_BOTTOM_RAY = 'R2';

/* ── Eclipse ── */

export const SAMPLE_ECLIPSE: EclipseOutput = {
  level: 'MODERATE',
  dimensions: {
    emotional_load: { score: 2.1, note: 'Moderate emotional processing demand' },
    cognitive_load: { score: 1.8, note: 'Normal cognitive strain' },
    relational_load: { score: 1.5, note: 'Low relational friction' },
  },
  derived_metrics: {
    recovery_access: 68,
    load_pressure: 42,
    eer: 1.4,
    bri: 2,
    performance_presence_delta: 12,
  },
  gating: {
    mode: 'BUILD_RANGE',
    reason: 'You have room to build — stay intentional about load.',
  },
};

/* ── Light Signature ── */

export const SAMPLE_LIGHT_SIGNATURE: LightSignatureOutput = {
  archetype: {
    name: 'Driven Leader',
    pair_code: 'R5-R4',
    essence: 'You lead with mission clarity and decisive action.',
    work_expression: 'Sets direction quickly, drives results, holds the team to a clear standard.',
    life_expression: 'Lives with intentionality. When you commit, the people around you feel it.',
    strengths: 'Strategic clarity, follow-through under pressure, natural authority.',
    stress_distortion: 'Under load, your drive can narrow your view.',
    coaching_logic: 'Joy is your growth edge — your system rations it when resources get tight.',
    starting_tools: 'Presence Pause, Joy Micro-Rep, Recovery Window',
    micro_reps: 'One moment of genuine pleasure before your next decision.',
    reflection_prompts: 'When did I last feel genuinely energized — not productive, energized?',
  },
  top_two: [
    { ray_id: 'R5', ray_name: 'Purpose', why_resourced: 'Clear mission alignment.', under_load_distortion: 'Can become rigidity.' },
    { ray_id: 'R4', ray_name: 'Power', why_resourced: 'Agency and boundary enforcement.', under_load_distortion: 'Can override emotional signals.' },
  ],
  just_in_ray: {
    ray_id: 'R2',
    ray_name: 'Joy',
    why_this_is_next: 'Your system runs on discipline, not vitality.',
    work_rep: 'Notice one thing that genuinely makes you smile before your next meeting.',
    life_rep: 'Tonight, do one thing purely because it feels good.',
    move_score: 45,
    routing: 'STANDARD',
  },
  bottom_ray_selection_basis: [
    'Lowest net energy score across all 9 rays (45/100)',
    'Highest eclipse-to-access ratio (58/38)',
  ],
};

/* ── Indices ── */

export const SAMPLE_INDICES: AssessmentIndices = {
  eer: 1.4,
  bri: 2,
  lsi_0_4: 1.7,
  lsi_0_100: 42,
  ppd_flag: true,
};

/* ── Helpers ── */

/** Ray display order for the 8 orbiting suns (R1-R8). R9 is the central sun. */
export const ORBIT_RAYS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'] as const;

/** Phase groupings for the outer ring labels */
export const PHASE_MAP: Record<string, string> = {
  R1: 'RECONNECT', R2: 'RECONNECT', R3: 'RECONNECT',
  R4: 'RADIATE', R5: 'RADIATE', R6: 'RADIATE',
  R7: 'BECOME', R8: 'BECOME',
};
