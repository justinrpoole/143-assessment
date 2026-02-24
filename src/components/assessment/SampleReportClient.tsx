"use client";

import { useMemo } from "react";
import Link from "next/link";

import dynamic from "next/dynamic";
import LightSignature from "@/components/results/LightSignature";
import SubfacetHeatmap from "@/components/results/SubfacetHeatmap";
import SystemHealthGauges from "@/components/results/SystemHealthGauges";
import EclipseSnapshot from "@/components/results/EclipseSnapshot";
import ExecutiveSignals from "@/components/results/ExecutiveSignals";
import OutcomeTagCards from "@/components/results/OutcomeTagCards";
import EdgeCaseAlerts from "@/components/results/EdgeCaseAlerts";
import BottomRay from "@/components/results/BottomRay";
import PPDConditional from "@/components/results/PPDConditional";
import ToolReadiness from "@/components/results/ToolReadiness";
import CoachingQuestions from "@/components/results/CoachingQuestions";
import ConfidenceBandSection from "@/components/results/ConfidenceBandSection";
import ValidityForensics from "@/components/results/ValidityForensics";
import PsychometricSummary from "@/components/results/PsychometricSummary";
import ReportShareCard from "@/components/results/ReportShareCard";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { MetricTooltip } from "@/components/ui/MetricTooltip";
import type {
  EclipseOutput,
  RayOutput,
  LightSignatureOutput,
  ExecutiveSignal,
  OutcomeTag,
  EdgeCaseResult,
  ActingVsCapacityOutput,
  RecommendationsOutput,
  DataQualityOutput,
  AssessmentIndices,
} from "@/lib/types";

const SolarCoreScore = dynamic(() => import("@/components/cosmic/SolarCoreScore"), { ssr: false });
const EclipseMeter = dynamic(() => import("@/components/cosmic/EclipseMeter"), { ssr: false });
const MoonToSunSlider = dynamic(() => import("@/components/cosmic/MoonToSunSlider"), { ssr: false });
const MagneticFieldRing = dynamic(() => import("@/components/cosmic/MagneticFieldRing"), { ssr: false });
const BlackHoleFlags = dynamic(() => import("@/components/cosmic/BlackHoleFlags"), { ssr: false });
const OrbitMap = dynamic(() => import("@/components/cosmic/OrbitMap"), { ssr: false });
const PlanetaryAlignment = dynamic(() => import("@/components/cosmic/PlanetaryAlignment"), { ssr: false });
const SolarFlareJournal = dynamic(() => import("@/components/cosmic/SolarFlareJournal"), { ssr: false });
const ConstellationProgress = dynamic(() => import("@/components/cosmic/ConstellationProgress"), { ssr: false });

// ---------------------------------------------------------------------------
// Realistic sample data — varied scores that feel like a real person
// ---------------------------------------------------------------------------
const SAMPLE_RAYS: Record<string, RayOutput> = {
  R1: {
    ray_id: "R1", ray_name: "Intention", score: 72, net_energy: 72,
    access_score: 65, eclipse_score: 28, eclipse_modifier: "NONE",
    subfacets: {
      R1a: { subfacet_id: "R1a", label: "Daily Intentionality", score: 78, polarity_mix: { shine: 78, eclipse: 22 }, signal_tags: [] },
      R1b: { subfacet_id: "R1b", label: "Time/Attention Architecture", score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R1c: { subfacet_id: "R1c", label: "Boundary Clarity", score: 70, polarity_mix: { shine: 70, eclipse: 30 }, signal_tags: [] },
      R1d: { subfacet_id: "R1d", label: "Pre-Decision Practice", score: 74, polarity_mix: { shine: 74, eclipse: 26 }, signal_tags: [] },
    },
  },
  R2: {
    ray_id: "R2", ray_name: "Joy", score: 45, net_energy: 45,
    access_score: 38, eclipse_score: 58, eclipse_modifier: "NONE",
    subfacets: {
      R2a: { subfacet_id: "R2a", label: "Joy Access", score: 42, polarity_mix: { shine: 42, eclipse: 58 }, signal_tags: [] },
      R2b: { subfacet_id: "R2b", label: "Gratitude Practice", score: 50, polarity_mix: { shine: 50, eclipse: 50 }, signal_tags: [] },
      R2c: { subfacet_id: "R2c", label: "Reinforcement Behavior", score: 38, polarity_mix: { shine: 38, eclipse: 62 }, signal_tags: [] },
      R2d: { subfacet_id: "R2d", label: "Recovery Integration", score: 48, polarity_mix: { shine: 48, eclipse: 52 }, signal_tags: [] },
    },
  },
  R3: {
    ray_id: "R3", ray_name: "Presence", score: 68, net_energy: 68,
    access_score: 60, eclipse_score: 32, eclipse_modifier: "NONE",
    subfacets: {
      R3a: { subfacet_id: "R3a", label: "Attention Stability", score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
      R3b: { subfacet_id: "R3b", label: "Cognitive Flexibility", score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R3c: { subfacet_id: "R3c", label: "Body Signal Awareness", score: 62, polarity_mix: { shine: 62, eclipse: 38 }, signal_tags: [] },
      R3d: { subfacet_id: "R3d", label: "Emotional Regulation", score: 70, polarity_mix: { shine: 70, eclipse: 30 }, signal_tags: [] },
    },
  },
  R4: {
    ray_id: "R4", ray_name: "Power", score: 85, net_energy: 85,
    access_score: 80, eclipse_score: 15, eclipse_modifier: "NONE",
    subfacets: {
      R4a: { subfacet_id: "R4a", label: "Agency/Action Orientation", score: 88, polarity_mix: { shine: 88, eclipse: 12 }, signal_tags: [] },
      R4b: { subfacet_id: "R4b", label: "Boundary Enforcement", score: 82, polarity_mix: { shine: 82, eclipse: 18 }, signal_tags: [] },
      R4c: { subfacet_id: "R4c", label: "Conflict Engagement", score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R4d: { subfacet_id: "R4d", label: "Power Under Pressure", score: 90, polarity_mix: { shine: 90, eclipse: 10 }, signal_tags: [] },
    },
  },
  R5: {
    ray_id: "R5", ray_name: "Purpose", score: 91, net_energy: 91,
    access_score: 88, eclipse_score: 9, eclipse_modifier: "NONE",
    subfacets: {
      R5a: { subfacet_id: "R5a", label: "Purpose Clarity", score: 94, polarity_mix: { shine: 94, eclipse: 6 }, signal_tags: [] },
      R5b: { subfacet_id: "R5b", label: "Values Alignment", score: 90, polarity_mix: { shine: 90, eclipse: 10 }, signal_tags: [] },
      R5c: { subfacet_id: "R5c", label: "Meaningful Contribution", score: 88, polarity_mix: { shine: 88, eclipse: 12 }, signal_tags: [] },
      R5d: { subfacet_id: "R5d", label: "Long-Range Thinking", score: 92, polarity_mix: { shine: 92, eclipse: 8 }, signal_tags: [] },
    },
  },
  R6: {
    ray_id: "R6", ray_name: "Authenticity", score: 63, net_energy: 63,
    access_score: 55, eclipse_score: 42, eclipse_modifier: "AMPLIFIED",
    subfacets: {
      R6a: { subfacet_id: "R6a", label: "Self-Disclosure", score: 58, polarity_mix: { shine: 58, eclipse: 42 }, signal_tags: [] },
      R6b: { subfacet_id: "R6b", label: "Congruence", score: 65, polarity_mix: { shine: 65, eclipse: 35 }, signal_tags: [] },
      R6c: { subfacet_id: "R6c", label: "Vulnerability Tolerance", score: 55, polarity_mix: { shine: 55, eclipse: 45 }, signal_tags: [] },
      R6d: { subfacet_id: "R6d", label: "Identity Integration", score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
    },
  },
  R7: {
    ray_id: "R7", ray_name: "Connection", score: 78, net_energy: 78,
    access_score: 72, eclipse_score: 22, eclipse_modifier: "NONE",
    subfacets: {
      R7a: { subfacet_id: "R7a", label: "Relational Safety Creation", score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R7b: { subfacet_id: "R7b", label: "Empathic Accuracy", score: 75, polarity_mix: { shine: 75, eclipse: 25 }, signal_tags: [] },
      R7c: { subfacet_id: "R7c", label: "Repair Initiation", score: 72, polarity_mix: { shine: 72, eclipse: 28 }, signal_tags: [] },
      R7d: { subfacet_id: "R7d", label: "Trust Building", score: 84, polarity_mix: { shine: 84, eclipse: 16 }, signal_tags: [] },
    },
  },
  R8: {
    ray_id: "R8", ray_name: "Possibility", score: 56, net_energy: 56,
    access_score: 48, eclipse_score: 46, eclipse_modifier: "NONE",
    subfacets: {
      R8a: { subfacet_id: "R8a", label: "Cognitive Openness", score: 60, polarity_mix: { shine: 60, eclipse: 40 }, signal_tags: [] },
      R8b: { subfacet_id: "R8b", label: "Divergent Thinking", score: 52, polarity_mix: { shine: 52, eclipse: 48 }, signal_tags: [] },
      R8c: { subfacet_id: "R8c", label: "Adaptive Flexibility", score: 50, polarity_mix: { shine: 50, eclipse: 50 }, signal_tags: [] },
      R8d: { subfacet_id: "R8d", label: "Creative Problem-Solving", score: 62, polarity_mix: { shine: 62, eclipse: 38 }, signal_tags: [] },
    },
  },
  R9: {
    ray_id: "R9", ray_name: "Be The Light", score: 82, net_energy: 82,
    access_score: 78, eclipse_score: 18, eclipse_modifier: "NONE",
    subfacets: {
      R9a: { subfacet_id: "R9a", label: "Behavioral Modeling", score: 85, polarity_mix: { shine: 85, eclipse: 15 }, signal_tags: [] },
      R9b: { subfacet_id: "R9b", label: "Standard Setting", score: 80, polarity_mix: { shine: 80, eclipse: 20 }, signal_tags: [] },
      R9c: { subfacet_id: "R9c", label: "Generative Impact", score: 78, polarity_mix: { shine: 78, eclipse: 22 }, signal_tags: [] },
      R9d: { subfacet_id: "R9d", label: "Legacy Orientation", score: 84, polarity_mix: { shine: 84, eclipse: 16 }, signal_tags: [] },
    },
  },
};

const SAMPLE_TOP_TWO = ["R5", "R4"];
const SAMPLE_BOTTOM_RAY = "R2";

const SAMPLE_ECLIPSE: EclipseOutput = {
  level: "MODERATE",
  dimensions: {
    emotional_load: { score: 2.1, note: "Moderate emotional processing demand" },
    cognitive_load: { score: 1.8, note: "Normal cognitive strain" },
    relational_load: { score: 1.5, note: "Low relational friction" },
  },
  derived_metrics: {
    recovery_access: 68,
    load_pressure: 42,
    eer: 1.4,
    bri: 2,
    performance_presence_delta: 12,
  },
  gating: {
    mode: "BUILD_RANGE",
    reason: "You have room to build — stay intentional about load.",
  },
};

const SAMPLE_FLARES = [
  { id: "f1", rayId: "R5", rayName: "Purpose", label: "Purpose — Power Source surge", date: "Jan 24", magnitude: 0.92 },
  { id: "f2", rayId: "R4", rayName: "Power", label: "Power — Power Source surge", date: "Jan 28", magnitude: 0.88 },
  { id: "f3", rayId: "R9", rayName: "Be The Light", label: "Be The Light — Capacity pulse", date: "Feb 2", magnitude: 0.65 },
  { id: "f4", rayId: "R7", rayName: "Connection", label: "Connection — Capacity pulse", date: "Feb 6", magnitude: 0.58 },
  { id: "f5", rayId: "R1", rayName: "Intention", label: "Intention — Capacity pulse", date: "Feb 9", magnitude: 0.52 },
  { id: "f6", rayId: "R3", rayName: "Presence", label: "Presence — Capacity pulse", date: "Feb 12", magnitude: 0.48 },
  { id: "f7", rayId: "R6", rayName: "Authenticity", label: "Authenticity — Capacity pulse", date: "Feb 15", magnitude: 0.40 },
  { id: "f8", rayId: "R8", rayName: "Possibility", label: "Possibility — Growth edge spark", date: "Feb 18", magnitude: 0.28 },
  { id: "f9", rayId: "R2", rayName: "Joy", label: "Joy — Growth edge spark", date: "Feb 21", magnitude: 0.18 },
];

const SAMPLE_LIGHT_SIGNATURE: LightSignatureOutput = {
  archetype: {
    name: "Driven Leader",
    pair_code: "R5-R4",
    essence: "You lead with mission clarity and decisive action. When the moment demands it, you step forward — not because it's easy, but because you know it matters.",
    work_expression: "Sets direction quickly, drives results, holds the team to a clear standard.",
    life_expression: "Lives with intentionality. When you commit, the people around you feel it.",
    strengths: "Strategic clarity, follow-through under pressure, natural authority that doesn't need a title.",
    stress_distortion: "Under load, your drive can narrow your view. You push harder when stepping back would serve better.",
    coaching_logic: "Joy is your growth edge — not because you lack it, but because your system rations it when resources get tight.",
    starting_tools: "Presence Pause, Joy Micro-Rep, Recovery Window",
    micro_reps: "One moment of genuine pleasure before your next decision. That's the rep.",
    reflection_prompts: "When did I last feel genuinely energized — not productive, energized? What would change if I let Joy lead for one hour this week?",
  },
  top_two: [
    { ray_id: "R5", ray_name: "Purpose", why_resourced: "Clear mission alignment and values-driven action. This ray fires automatically under pressure.", under_load_distortion: "Can become rigidity — holding to a plan when conditions have changed." },
    { ray_id: "R4", ray_name: "Power", why_resourced: "Agency and boundary enforcement. You move when others hesitate.", under_load_distortion: "Can override emotional signals from self and others. Pushing through becomes default." },
  ],
  just_in_ray: {
    ray_id: "R2",
    ray_name: "Joy",
    why_this_is_next: "Your system runs on discipline, not vitality. Joy isn't missing — it's rationed. One micro-rep per day shifts the fuel source from willpower to renewable energy.",
    work_rep: "Before your next important meeting, notice one thing that genuinely makes you smile. Not gratitude practice — real pleasure. That's the rep.",
    life_rep: "Tonight, do one thing purely because it feels good — not productive, not useful, just enjoyable. Let yourself feel it for 30 seconds.",
    move_score: 45,
    routing: "STANDARD",
  },
  bottom_ray_selection_basis: [
    "Lowest net energy score across all 9 rays (45/100)",
    "Highest eclipse-to-access ratio (58/38)",
    "Phase 1 (Reconnect) ray — foundational capacity affects downstream performance",
    "Joy subfacets show consistent suppression pattern, not skill deficit",
  ],
};

const SAMPLE_EXECUTIVE_SIGNALS: ExecutiveSignal[] = [
  { signal_id: "M001", label: "Decision Fatigue Under Load", level: "ELEVATED", confidence_band: "HIGH", drivers: ["R3 Presence (68)", "Eclipse emotional_load (2.1)"], moderators: { eclipse: "Emotional load amplifies by end of day" }, tools_first: ["Presence Pause", "Decision Spacing Protocol"], reps: ["Before your 3rd meeting of the day, take one breath and ask: 'Does this need me right now?'"] },
  { signal_id: "M002", label: "Recovery Deficit Pattern", level: "MODERATE", confidence_band: "HIGH", drivers: ["R2 Joy (45)", "Recovery Access (68%)"], moderators: { eclipse: "Output exceeds input — sustainable short-term only" }, tools_first: ["Micro-Joy Protocol", "Recovery Window"], reps: ["After completing a task, take 60 seconds to feel the completion before moving to the next thing."] },
  { signal_id: "M003", label: "Strategic Clarity Index", level: "HIGH", confidence_band: "HIGH", drivers: ["R5 Purpose (91)", "R4 Power (85)"], moderators: {}, tools_first: [], reps: ["This is already your strength. Maintain it by protecting your Purpose-Power axis from eclipse contamination."] },
  { signal_id: "M004", label: "Authenticity Under Pressure", level: "MODERATE", confidence_band: "MODERATE", drivers: ["R6 Authenticity (63)", "Eclipse modifier: AMPLIFIED"], moderators: { eclipse: "Environmental factor amplifying self-censorship", validity: "Moderate confidence — context-dependent" }, tools_first: ["Authenticity Micro-Rep", "Safe Disclosure Practice"], reps: ["In your next 1:1, share one honest reaction you'd normally filter. Start small. One sentence."] },
  { signal_id: "M005", label: "Adaptive Flexibility Gap", level: "ELEVATED", confidence_band: "HIGH", drivers: ["R8 Possibility (56)", "R4 Power (85)"], moderators: { eclipse: "Strong Power ray may override Possibility signals" }, tools_first: ["Alternative Generation Protocol"], reps: ["When you catch yourself pushing harder on Plan A, ask: 'What would I try if this approach didn't exist?'"] },
  { signal_id: "M006", label: "Team Safety Creation", level: "LOW", confidence_band: "HIGH", drivers: ["R7 Connection (78)", "R9 Be The Light (82)"], moderators: {}, tools_first: [], reps: ["Your Connection-BTL axis creates natural safety. People trust you. Keep doing what you're doing."] },
  { signal_id: "M007", label: "Emotional Processing Speed", level: "MODERATE", confidence_band: "MODERATE", drivers: ["R3 Presence (68)", "R2 Joy (45)"], moderators: { eclipse: "Emotional load creates processing queue" }, tools_first: ["Body Signal Check-In"], reps: ["Twice today, pause and ask: 'What am I feeling right now?' Don't fix it. Just name it."] },
  { signal_id: "M008", label: "Influence Without Authority", level: "LOW", confidence_band: "HIGH", drivers: ["R9 Be The Light (82)", "R5 Purpose (91)"], moderators: {}, tools_first: [], reps: ["Your purpose clarity is your influence engine. When you speak from mission, people move."] },
];

const SAMPLE_OUTCOME_TAGS: OutcomeTag[] = [
  { tag_id: "OT-01", label: "High-Drive / Low-Recovery Pattern", confidence: "HIGH", evidence: ["Purpose (91) + Power (85) vs Joy (45)", "EER 1.4 — net positive but narrowing", "Recovery Access 68% — accessible but not utilized"] },
  { tag_id: "OT-02", label: "Phase 2 Dominant Profile", confidence: "HIGH", evidence: ["Radiate phase average (80) exceeds Reconnect (62) and Become (72)", "Output-oriented leadership style", "Strong external execution, under-invested internal foundation"] },
  { tag_id: "OT-03", label: "Authenticity Eclipse Active", confidence: "MODERATE", evidence: ["R6 eclipse modifier: AMPLIFIED", "Vulnerability Tolerance subfacet: 55", "Self-Disclosure subfacet: 58"] },
  { tag_id: "OT-04", label: "Constellation Builder", confidence: "HIGH", evidence: ["25/36 stars lit (69%)", "Purpose and Power clusters near-complete", "Active growth trajectory in Become phase"] },
];

const SAMPLE_EDGE_CASES: EdgeCaseResult[] = [
  { code: "EXPENSIVE_STRENGTH", detected: true, restriction: "Power ray (85) may be compensating for Joy deficit (45). Monitor for burnout pattern.", required_next_evidence: "Retake in 30 days to check if Power sustains without Joy recovery." },
  { code: "HIGH_LOAD_INTERFERENCE", detected: false, restriction: "No interference detected. Eclipse level MODERATE — within scoring tolerance.", required_next_evidence: "N/A" },
  { code: "FLAT_PROFILE", detected: false, restriction: "Profile shows healthy variation (spread: 46 points). Not flat.", required_next_evidence: "N/A" },
];

const SAMPLE_ACTING: ActingVsCapacityOutput = {
  status: "WATCH",
  indicators: [
    { indicator_id: "PPD-01", label: "Performance-Presence Delta", level: "MODERATE", evidence: ["12-point gap between execution quality and felt presence", "Likely operating on autopilot during routine tasks"] },
    { indicator_id: "PPD-02", label: "Social Desirability Offset", level: "LOW", evidence: ["Minimal impression management detected", "Responses show natural variation"] },
  ],
  report_language_mode: "STANDARD",
  next_step: "Continue standard coaching pathway. Monitor PPD on retake — if gap widens, shift to body-based awareness reps.",
};

const SAMPLE_RECOMMENDATIONS: RecommendationsOutput = {
  priority_mode: "TOOLS_AND_REPS",
  tools: [
    { tool_id: "T-01", label: "Presence Pause", why_now: "Your Presence ray (68) has capacity to grow quickly. This tool targets attention stability — your highest-readiness subfacet.", steps: ["Set a phone alarm for 2 PM daily", "When it fires: close eyes, three breaths, name one sensation", "Open eyes. Resume. That's the full rep."], time_cost_minutes: 1 },
    { tool_id: "T-02", label: "Micro-Joy Protocol", why_now: "Joy (45) is your growth edge. This tool builds the neural pathway for pleasure recognition — not happiness, pleasure.", steps: ["Before lunch, notice one thing that feels genuinely good", "Let yourself feel it for 10 seconds — don't analyze it", "That's it. One rep. Repeat tomorrow."], time_cost_minutes: 1 },
    { tool_id: "T-03", label: "Recovery Window", why_now: "Recovery Access at 68% means pathways exist but aren't habitual. This tool makes recovery a scheduled event, not an afterthought.", steps: ["Block 15 minutes on your calendar this week — label it 'Recovery'", "During that window: no phone, no tasks, no optimization", "Walk, sit, breathe, stare at a wall. Whatever your body wants."], time_cost_minutes: 15 },
  ],
  weekly_focus: {
    just_in_ray_id: "R2",
    focus_rep: "One moment of genuine pleasure per day — not gratitude, not productivity, just enjoyment.",
    minimum_effective_dose: "10 seconds of felt pleasure. That's the minimum. More is fine. Less doesn't count.",
  },
  thirty_day_plan: {
    week_1: "Presence Pause daily (1 min). Micro-Joy once per day. No other changes.",
    weeks_2_4: "Add Recovery Window once per week (15 min). Continue daily reps. Notice what shifts without forcing it.",
  },
  coaching_questions: [
    "When was the last time you felt genuinely energized — not productive, energized? What was different about that moment?",
    "If Joy were a person on your team, what would they say you've been ignoring?",
    "What would change in your leadership if you operated at 80% capacity instead of 100% effort?",
    "Where in your week do you have permission to do nothing? If nowhere — why?",
    "Your Power ray fires automatically. What would happen if you let a different ray lead for one day?",
  ],
  what_not_to_do_yet: [
    "Don't overhaul your morning routine — that's a Phase 2 move and you need Phase 1 foundation first.",
    "Don't try to 'fix' your Joy score with gratitude journaling. That's cognitive, not somatic. Your body needs the rep, not your mind.",
    "Don't increase your workload thinking you can 'push through' the eclipse. That's your Power ray talking. Listen to your Joy ray instead.",
  ],
};

const SAMPLE_DATA_QUALITY: DataQualityOutput = {
  confidence_band: "HIGH",
  validity_flags: [],
  quality_notes: "Strong response quality across all validity dimensions. High confidence in scoring accuracy.",
};

const SAMPLE_INDICES: AssessmentIndices = {
  eer: 1.4,
  bri: 2,
  lsi_0_4: 1.7,
  lsi_0_100: 42,
  ppd_flag: true,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function computeOverallScore(rays: Record<string, RayOutput>): number {
  const values = Object.values(rays).map((r) => r.net_energy ?? r.score);
  if (values.length === 0) return 50;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function deriveConstellationStars(rays: Record<string, RayOutput>, topTwo: string[]) {
  const stars: Array<{ id: string; label: string; completed: boolean; major?: boolean }> = [];
  for (const [rayId, ray] of Object.entries(rays)) {
    const isTop = topTwo.includes(rayId);
    for (const [sfId, sf] of Object.entries(ray.subfacets ?? {})) {
      stars.push({
        id: `star-${rayId}-${sfId}`,
        label: sf.label || sfId,
        completed: sf.score >= 60,
        major: isTop && sf.score >= 75,
      });
    }
  }
  return stars;
}

// ---------------------------------------------------------------------------
// Component — mirrors actual ReportClient layout
// ---------------------------------------------------------------------------
export default function SampleReportClient() {
  const overallScore = useMemo(() => computeOverallScore(SAMPLE_RAYS), []);
  const constellationStars = useMemo(() => deriveConstellationStars(SAMPLE_RAYS, SAMPLE_TOP_TWO), []);

  const eclipseLoadPercent = 40; // MODERATE ≈ 40%

  return (
    <div className="space-y-8">

      {/* ── 1. Welcome + Confidence Band ── */}
      <FadeInSection>
        <div className="glass-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            Sample Report — Driven Leader
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
            Not a test you pass. This is a mirror you can use.
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
            Confidence: <strong style={{ color: "var(--text-on-dark)" }}>HIGH</strong> — Strong response quality across all validity dimensions.
          </p>
        </div>
      </FadeInSection>

      {/* ── 2. Moon-to-Sun Slider — Overall Score ── */}
      <FadeInSection delay={0.1}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="overall_score">Overall Stability</MetricTooltip>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Your score mapped from crescent moon (low capacity) to radiant sun (full capacity).
            The indicator shows where your system is operating right now.
          </p>
          <MoonToSunSlider score={overallScore} label="Your gravitational stability today" />
        </div>
      </FadeInSection>

      {/* ── 3. Light Signature — Archetype + Top Two ── */}
      <FadeInSection delay={0.15}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="light_signature">Light Signature</MetricTooltip>
          </h2>
          <LightSignature lightSignature={SAMPLE_LIGHT_SIGNATURE} />
        </div>
      </FadeInSection>

      {/* ── 3b. Micro-celebration ── */}
      <FadeInSection delay={0.2}>
        <div className="glass-card p-5" style={{ borderColor: "rgba(248, 208, 17, 0.15)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm" style={{ color: "var(--brand-gold, #F8D011)" }}>&#9733;</span>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
              Your Light Is Here
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
            Purpose and Power are already resourced. These aren&apos;t aspirations — they&apos;re active strengths your nervous system defaults to under pressure. Build from here.
          </p>
        </div>
      </FadeInSection>

      {/* ── 4. Solar Core Score — Nine-Ray Radial Sunburst ── */}
      <FadeInSection delay={0.1}>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="gravitational_stability">Gravitational Stability — Solar Core</MetricTooltip>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Each ray radiates outward from your core. Longer beams mean stronger capacity.
            Hover any ray for detailed metrics. The eclipse shadow arc shows your current system load.
          </p>
          <SolarCoreScore
            rays={SAMPLE_RAYS}
            topTwo={SAMPLE_TOP_TWO}
            bottomRay={SAMPLE_BOTTOM_RAY}
            loadPercent={eclipseLoadPercent}
          />
        </div>
      </FadeInSection>

      {/* ── 4b. Subfacet Heatmap ── */}
      <FadeInSection>
        <SubfacetHeatmap rays={SAMPLE_RAYS} />
      </FadeInSection>

      {/* ── 5. Eclipse Meter — System Load ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="eclipse_percentage">Eclipse — System Load</MetricTooltip>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            The moon covering the sun shows how much of your range is temporarily eclipsed.
            Expand the metrics below for recovery access and load pressure breakdowns.
          </p>
          <EclipseMeter eclipse={SAMPLE_ECLIPSE} />
        </div>
      </FadeInSection>

      {/* ── 5b. Eclipse Snapshot — Detailed Load Gauge ── */}
      <FadeInSection>
        <EclipseSnapshot eclipse={SAMPLE_ECLIPSE} />
      </FadeInSection>

      {/* ── 5c. Eclipse Coaching Reframe ── */}
      <FadeInSection>
        <div className="glass-card p-5" style={{ borderColor: "var(--surface-border)" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            Coaching Note
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
            Your system is holding steady. That means your capacity for growth work is high right now — the tools will land deeper when your nervous system is not in protection mode.
          </p>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-on-dark-muted)" }}>
            Current mode: <strong style={{ color: "var(--text-on-dark-secondary)" }}>build range</strong> — You have room to build — stay intentional about load.
          </p>
        </div>
      </FadeInSection>

      {/* ── 6. System Health Gauges (EER, BRI, LSI) ── */}
      <FadeInSection>
        <SystemHealthGauges indices={SAMPLE_INDICES} />
      </FadeInSection>

      {/* ── 7. Planetary Alignment — Five-Planet Ray Coherence ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="ray_coherence">Planetary Alignment — Ray Coherence</MetricTooltip>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Five key rays aligned along the solar beam. When coherence exceeds 50%, the beam
            refracts into a spectral streak. Hover each planet for individual ray metrics.
          </p>
          <PlanetaryAlignment rays={SAMPLE_RAYS} />
        </div>
      </FadeInSection>

      {/* ── 8. Magnetic Field Ring — Coherence Dual View ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Magnetic Field — System Coherence
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Side-by-side comparison: low coherence (scattered energy) vs. high coherence (contained field).
            Your actual coherence determines which side glows brighter.
          </p>
          <MagneticFieldRing rays={SAMPLE_RAYS} />
        </div>
      </FadeInSection>

      {/* ── 9. Orbit Map — Personal Solar System ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Orbit Map — Your Solar System
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Inner orbit = power sources. Middle orbit = transitioning rays. Outer orbit = training focus.
            Hover each ray chip for score details.
          </p>
          <OrbitMap rays={SAMPLE_RAYS} topTwo={SAMPLE_TOP_TWO} bottomRay={SAMPLE_BOTTOM_RAY} />
        </div>
      </FadeInSection>

      {/* ── 10. Black Hole Flags — Energy Leak Detection ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Black Hole Flags — Energy Leaks
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Rays with high eclipse scores appear as gravity wells draining energy.
            Tap any black hole for intervention actions: Reframe, Boundary, or Swap Habit.
          </p>
          <BlackHoleFlags rays={SAMPLE_RAYS} eclipse={SAMPLE_ECLIPSE} />
        </div>
      </FadeInSection>

      {/* ── 11. Solar Flare Journal — Breakthrough Timeline ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Solar Flare Journal — Capacity Timeline
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Flare height represents capacity magnitude. Power source rays produce massive solar eruptions.
            Growth-edge rays show early sparks. Each flare is positioned by date along the sun&apos;s surface.
          </p>
          <SolarFlareJournal flares={SAMPLE_FLARES} />
        </div>
      </FadeInSection>

      {/* ── 12. Constellation Progress — Personal Star Map ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Constellation Progress — Your Star Map
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Each star represents a subfacet skill. Gold lit stars are active capacities (score 60+).
            Larger stars mark major breakthroughs in your top two rays. Click any star for details.
          </p>
          <ConstellationProgress
            stars={constellationStars}
            constellationName="Driven Leader"
            dateRange="Last 30 days"
          />
        </div>
      </FadeInSection>

      {/* ── 13. Executive Signals — Leadership Behavioral Signals ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Executive Signals
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            24 behavioral signals derived from your assessment data. These map raw scores to
            real-world leadership behaviors — where you lead naturally and where to build next.
          </p>
          <ExecutiveSignals signals={SAMPLE_EXECUTIVE_SIGNALS} />
        </div>
      </FadeInSection>

      {/* ── 13b. Outcome Patterns ── */}
      <FadeInSection>
        <OutcomeTagCards outcomeTags={SAMPLE_OUTCOME_TAGS} />
      </FadeInSection>

      {/* ── 13c. Edge Case / Pattern Flags ── */}
      <FadeInSection>
        <EdgeCaseAlerts edgeCases={SAMPLE_EDGE_CASES} />
      </FadeInSection>

      {/* ── 14. Rise Path — Bottom Ray / Next Skill ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="rise_path">Rise Path</MetricTooltip>
          </h2>
          <BottomRay justInRay={SAMPLE_LIGHT_SIGNATURE.just_in_ray} selectionBasis={SAMPLE_LIGHT_SIGNATURE.bottom_ray_selection_basis} />
        </div>
      </FadeInSection>

      {/* ── 15. Performance-Presence Delta ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="ppd">Performance–Presence Delta</MetricTooltip>
          </h2>
          <PPDConditional acting={SAMPLE_ACTING} />
        </div>
      </FadeInSection>

      {/* ── 16. Tool Readiness ── */}
      <FadeInSection>
        <ToolReadiness recommendations={SAMPLE_RECOMMENDATIONS} />
      </FadeInSection>

      {/* ── 17. Coaching Questions ── */}
      <FadeInSection>
        <CoachingQuestions questions={SAMPLE_RECOMMENDATIONS.coaching_questions ?? []} runId="sample" />
      </FadeInSection>

      {/* ── 18. Confidence Band Detail ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            <MetricTooltip metricId="confidence_band">Confidence Band</MetricTooltip>
          </h2>
          <ConfidenceBandSection dataQuality={SAMPLE_DATA_QUALITY} />
        </div>
      </FadeInSection>

      {/* ── 18b. Validity Forensics ── */}
      <FadeInSection>
        <ValidityForensics dataQuality={SAMPLE_DATA_QUALITY} />
      </FadeInSection>

      {/* ── 18c. Psychometric Foundation ── */}
      <FadeInSection>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-on-dark)" }}>
            Psychometric Foundation
          </h2>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            Research pillars, measurement model, and construct design behind the 143 Leadership Assessment.
          </p>
          <PsychometricSummary />
        </div>
      </FadeInSection>

      {/* ── 19. Share Card ── */}
      <FadeInSection>
        <ReportShareCard
          lightSignature={SAMPLE_LIGHT_SIGNATURE}
          eclipse={SAMPLE_ECLIPSE}
          overallScore={overallScore}
        />
      </FadeInSection>

      {/* ── 20. Sample Data Notice + CTA ── */}
      <FadeInSection>
        <div className="glass-card p-6 space-y-4" style={{ borderColor: "rgba(248, 208, 17, 0.2)" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--brand-gold, #F8D011)" }}>
            This is sample data
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
            You just saw what a report looks like with sample data. Your real report maps <em>your</em> actual
            patterns — 143 data points across 36 subfacets, with coaching reps built specifically for your
            eclipse signature.
          </p>
          <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
            143 questions &middot; 12 minutes &middot; 36 subfacets &middot; 9 rays &middot; Research-backed
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/assessment" className="btn-primary">
              Discover Your Light Signature
            </Link>
            <Link href="/preview" className="btn-watch">
              Take the Free Stability Check
            </Link>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
