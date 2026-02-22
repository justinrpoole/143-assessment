"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import SolarCoreScore from "@/components/cosmic/SolarCoreScore";
import EclipseMeter from "@/components/cosmic/EclipseMeter";
import MoonToSunSlider from "@/components/cosmic/MoonToSunSlider";
import MagneticFieldRing from "@/components/cosmic/MagneticFieldRing";
import BlackHoleFlags from "@/components/cosmic/BlackHoleFlags";
import OrbitMap from "@/components/cosmic/OrbitMap";
import PlanetaryAlignment from "@/components/cosmic/PlanetaryAlignment";
import SolarFlareJournal from "@/components/cosmic/SolarFlareJournal";
import ConstellationProgress from "@/components/cosmic/ConstellationProgress";
import EclipseSnapshot from "@/components/results/EclipseSnapshot";
import { FadeInSection } from "@/components/ui/FadeInSection";
import RetroFrame from "@/components/ui/RetroFrame";
import type { EclipseOutput, RayOutput } from "@/lib/types";

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
// Helpers — Status dot + Insight box
// ---------------------------------------------------------------------------
function StatusDot({ level }: { level: "green" | "amber" | "red" }) {
  const colors = { green: "#4ADE80", amber: "#FBBF24", red: "#FB923C" };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
      style={{ background: colors[level], boxShadow: `0 0 6px ${colors[level]}80` }}
    />
  );
}

function InsightBox({ label, children, accent = "var(--brand-gold)" }: { label: string; children: React.ReactNode; accent?: string }) {
  return (
    <div className="mt-3 rounded-lg px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${accent}` }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: accent }}>
        {label}
      </p>
      <div className="text-xs leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

function MetricChip({ label, value, unit = "" }: { label: string; value: string | number; unit?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 mr-2 mb-1 font-mono text-[10px]"
      style={{ background: "rgba(244,196,48,0.08)", color: "var(--text-on-dark)", border: "1px solid rgba(244,196,48,0.12)" }}>
      <span style={{ color: "var(--text-on-dark-secondary)" }}>{label}</span>
      <span className="font-semibold">{value}{unit}</span>
    </span>
  );
}

/** Expandable coaching rep — interactive micro-action */
function CoachingRep({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="mt-2 rounded-lg overflow-hidden transition-all"
      style={{ background: "rgba(244,196,48,0.04)", border: "1px solid rgba(244,196,48,0.08)" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
        style={{ cursor: "pointer" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "#F4C430" }}>
          {open ? "▾" : "▸"} {title}
        </span>
        <span className="font-mono text-[9px]" style={{ color: "var(--text-on-dark-secondary)" }}>
          {open ? "collapse" : "tap to expand"}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 text-xs leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/** Real-life scenario example */
function RealLifeExample({ scenario, children }: { scenario: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-lg px-3 py-2.5" style={{ background: "rgba(139,92,246,0.05)", borderLeft: "2px solid rgba(139,92,246,0.25)" }}>
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: "#8B5CF6" }}>
        Real Life
      </p>
      <p className="text-[11px] italic mb-1" style={{ color: "var(--text-on-dark)" }}>
        &ldquo;{scenario}&rdquo;
      </p>
      <div className="text-xs leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SampleReportClient() {
  const [hoveredRay, setHoveredRay] = useState<string | null>(null);

  const overallScore = useMemo(() => computeOverallScore(SAMPLE_RAYS), []);
  const constellationStars = useMemo(() => deriveConstellationStars(SAMPLE_RAYS, SAMPLE_TOP_TWO), []);

  // Derived insights
  const sortedRays = useMemo(() =>
    Object.values(SAMPLE_RAYS).sort((a, b) => b.score - a.score), []);
  const topRay = sortedRays[0];
  const bottomRay = sortedRays[sortedRays.length - 1];
  const scoreSpread = topRay.score - bottomRay.score;
  const coherence = useMemo(() => {
    const scores = Object.values(SAMPLE_RAYS).map(r => r.score);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, s) => a + (s - mean) ** 2, 0) / scores.length;
    return Math.round(100 - Math.sqrt(variance));
  }, []);

  return (
    <div className="space-y-6">

      {/* ══════════ SECTION A: SYSTEM OVERVIEW ══════════ */}
      <FadeInSection>
        <div className="mb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "var(--brand-gold)", textShadow: "0 0 8px rgba(244,196,48,0.2)" }}>
            Section A — System Overview
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Before we look at the details, let&apos;s see the full picture. How much capacity do you actually have available — and where is it concentrated?
          </p>
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(244,196,48,0.3), transparent)" }} />
        </div>
      </FadeInSection>

      {/* ── 1. Overall Stability ── */}
      <FadeInSection>
        <RetroFrame label="SYS-01 STABILITY" accent="#F4C430">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level={overallScore >= 70 ? "green" : overallScore >= 50 ? "amber" : "red"} />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#F4C430", textShadow: "0 0 6px rgba(244,196,48,0.3)" }}>
              Overall Stability Index
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Your overall light level — how much total capacity you have available across all nine rays right now. Not your potential. Your current launchpad.
          </p>
          <div className="max-w-2xl mx-auto">
            <MoonToSunSlider score={overallScore} label={`Stability: ${Math.round(overallScore)}/100`} />
          </div>
          <InsightBox label="What this means for you" accent="#F4C430">
            <p>
              I know you&apos;re the type of person who shows up — even when the tank isn&apos;t full. At <strong style={{ color: "var(--text-on-dark)" }}>{Math.round(overallScore)}</strong>, your system has real capacity. That&apos;s not a ceiling — it&apos;s your current launchpad.
            </p>
            <p className="mt-1.5">
              Your {topRay.ray_name} ({topRay.score}) is carrying you right now. It fires automatically — you don&apos;t even think about it.
              But {bottomRay.ray_name} at {bottomRay.score}? That&apos;s not broken. It&apos;s eclipsed.
              {scoreSpread > 35 ? " The 46-point gap means you're leading from one gear. That works — until it doesn't." :
               scoreSpread > 20 ? " You've got range. The work now is closing the gap between what fires on autopilot and what requires conscious effort." :
               " Your consistency is rare. Most people have spikes. You have a platform."}
            </p>
          </InsightBox>
          <CoachingRep title="Your rep today">
            <p>Pick one moment today where you&apos;d normally power through. Instead, pause for one breath and ask: <em style={{ color: "var(--text-on-dark)" }}>&ldquo;What would {bottomRay.ray_name} do here?&rdquo;</em></p>
            <p className="mt-1 font-mono text-[9px]" style={{ color: "#F4C430" }}>Not a habit. A rep. One clean breath. Then next action.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ── 2. Solar Core — Nine-Ray Map ── */}
      <FadeInSection delay={0.1}>
        <RetroFrame label="SYS-02 CORE SCAN" accent="#E8A317">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level="green" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#E8A317", textShadow: "0 0 6px rgba(232,163,23,0.3)" }}>
              Solar Core — Nine-Ray Capacity Map
            </p>
          </div>
          <p className="text-[11px] mb-1" style={{ color: "var(--text-on-dark-secondary)" }}>
            All nine leadership dimensions at a glance. Where you shine, where you&apos;re eclipsed, and where the blind spots hide.
            {hoveredRay && (
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded font-mono" style={{ background: "rgba(248, 208, 17, 0.15)", color: "#F4C430" }}>
                LOCK: {hoveredRay}
              </span>
            )}
          </p>
          <div className="flex flex-wrap mb-2">
            <MetricChip label="Power Sources:" value={`${SAMPLE_RAYS.R5.ray_name}, ${SAMPLE_RAYS.R4.ray_name}`} />
            <MetricChip label="Growth Edge:" value={bottomRay.ray_name} />
            <MetricChip label="Coherence:" value={`${coherence}%`} />
          </div>
          <div className="max-w-md mx-auto">
            <SolarCoreScore
              rays={SAMPLE_RAYS}
              topTwo={SAMPLE_TOP_TWO}
              bottomRay={SAMPLE_BOTTOM_RAY}
              loadPercent={42}
              onRayHovered={(rayId) => setHoveredRay(rayId)}
            />
          </div>
          <InsightBox label="Here's what I see" accent="#E8A317">
            <p>
              Purpose ({SAMPLE_RAYS.R5.score}) and Power ({SAMPLE_RAYS.R4.score}) — that&apos;s your engine. You know what matters and you move. Most people wish they had that combination.
            </p>
            <p className="mt-1.5">
              But here&apos;s the thing: Joy at {SAMPLE_RAYS.R2.score} means you&apos;re running on discipline, not vitality. You&apos;re still performing — probably performing well — but your body is doing the math even when your mind isn&apos;t. That&apos;s not failure. That&apos;s physiology.
            </p>
            <p className="mt-1.5">
              Watch for decisions getting harder after 3 PM. Patience thinning with ambiguity. Defaulting to your Power ray when Presence or Connection would actually serve better.
            </p>
          </InsightBox>
          <RealLifeExample scenario="You're in back-to-back meetings and someone asks a question you'd normally handle easily. But today you snap — or go blank.">
            <p>That&apos;s not you being weak. That&apos;s your Joy ray running on fumes while Power tries to compensate. The capacity is still there — it&apos;s just eclipsed.</p>
          </RealLifeExample>
          <CoachingRep title="Your rep today">
            <p>Before your next meeting, take 10 seconds to notice something that genuinely makes you smile. Not gratitude practice. Not positive thinking. Just <em style={{ color: "var(--text-on-dark)" }}>one real moment of pleasure.</em> That&apos;s a Joy rep.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ══════════ SECTION B: ECLIPSE ANALYSIS ══════════ */}
      <FadeInSection>
        <div className="mb-2 mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#A78BFA", textShadow: "0 0 8px rgba(167,139,250,0.2)" }}>
            Section B — Eclipse Analysis
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Your eclipse isn&apos;t a diagnosis. It&apos;s a weather report. This section shows what&apos;s temporarily covering your capacity — and how much of it you can still access right now.
          </p>
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.3), transparent)" }} />
        </div>
      </FadeInSection>

      {/* ── 3. Eclipse Meter ── */}
      <FadeInSection>
        <RetroFrame label="SYS-03 ECLIPSE" accent="#A78BFA">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level="amber" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#A78BFA", textShadow: "0 0 6px rgba(167,139,250,0.3)" }}>
              Eclipse Meter — System Load
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            How much of your sun is currently covered. Not damage — temporary coverage. Your capacity is still there. It&apos;s just behind the moon right now.
          </p>
          <div className="max-w-xs mx-auto">
            <EclipseMeter eclipse={SAMPLE_ECLIPSE} />
          </div>
          <InsightBox label="This is important" accent="#A78BFA">
            <p>
              <strong style={{ color: "var(--text-on-dark)" }}>Your capacity isn&apos;t gone. It&apos;s eclipsed.</strong> That&apos;s the difference between a broken light and a covered one.
            </p>
            <p className="mt-1.5">
              Right now, about 40% of your sun is covered. Emotional load ({SAMPLE_ECLIPSE.dimensions.emotional_load.score.toFixed(1)}) is doing the most covering — your feeling systems are working harder than your thinking systems.
              Cognitive load ({SAMPLE_ECLIPSE.dimensions.cognitive_load.score.toFixed(1)}) is next. Relational ({SAMPLE_ECLIPSE.dimensions.relational_load.score.toFixed(1)}) is the lightest.
            </p>
            <p className="mt-1.5">
              You handle your day. You show up. But by 3 PM you realize you missed something in a conversation because part of your attention was processing in the background. That&apos;s not distraction. That&apos;s eclipse.
            </p>
          </InsightBox>
          <RealLifeExample scenario="Someone shares something important with you and you catch yourself nodding but not actually hearing the words.">
            <p>Your Presence ray is trying to fire but emotional load is sitting on top of it. The signal is there — the capacity isn&apos;t. One recovery rep can shift that in minutes, not months.</p>
          </RealLifeExample>
        </RetroFrame>
      </FadeInSection>

      {/* ── 4. Eclipse Snapshot ── */}
      <FadeInSection>
        <RetroFrame label="SYS-04 LOAD DETAIL" accent="#A78BFA">
          <div className="flex items-center gap-2 mb-2">
            <StatusDot level="amber" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#A78BFA", textShadow: "0 0 6px rgba(167,139,250,0.3)" }}>
              Eclipse Snapshot — Dimensional Breakdown
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Your load broken into three channels: emotional, cognitive, and relational. Knowing where the weight sits tells you exactly which recovery pathway to use first.
          </p>
          <div className="flex flex-wrap mb-2">
            <MetricChip label="Recovery Access:" value={`${SAMPLE_ECLIPSE.derived_metrics.recovery_access}%`} />
            <MetricChip label="Load Pressure:" value={`${SAMPLE_ECLIPSE.derived_metrics.load_pressure}%`} />
            <MetricChip label="EER:" value={SAMPLE_ECLIPSE.derived_metrics.eer ?? "—"} />
            <MetricChip label="BRI:" value={`${SAMPLE_ECLIPSE.derived_metrics.bri}/4`} />
          </div>
          <EclipseSnapshot eclipse={SAMPLE_ECLIPSE} />
          <InsightBox label="What the numbers actually mean" accent="#A78BFA">
            <p>
              EER of {SAMPLE_ECLIPSE.derived_metrics.eer} — you&apos;re producing more than the load costs you. Your system is net-positive. That&apos;s good news.
            </p>
            <p className="mt-1.5">
              Burnout Risk at {SAMPLE_ECLIPSE.derived_metrics.bri}/4 — manageable, but this is the number to watch. It doesn&apos;t spike overnight. It compounds in the background while you&apos;re busy performing.
            </p>
            <p className="mt-1.5">
              Recovery access at {SAMPLE_ECLIPSE.derived_metrics.recovery_access}% — you still have clear pathways to recharge. The question isn&apos;t whether they exist. It&apos;s whether you use them <em>before</em> load compounds instead of after.
            </p>
            <p className="mt-1.5">
              The 12-point Performance-Presence Delta? That&apos;s the gap between how well you perform and how present you feel while doing it. You&apos;re executing — but part of you isn&apos;t in the room.
            </p>
          </InsightBox>
          <CoachingRep title="Your recovery rep">
            <p>Tonight, before you check your phone after dinner, take 30 seconds with your eyes closed. Not meditation. Just <em style={{ color: "var(--text-on-dark)" }}>stillness.</em> Let your emotional load settle like sediment in a glass. That&apos;s how recovery access goes from 68% to 75% — one rep at a time.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ══════════ SECTION C: CAPACITY ARCHITECTURE ══════════ */}
      <FadeInSection>
        <div className="mb-2 mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#C39BD3", textShadow: "0 0 8px rgba(195,155,211,0.2)" }}>
            Section C — Capacity Architecture
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            This is your internal architecture — how your rays relate to each other, which ones reinforce each other, and where the structural gaps live. Think of it as the blueprint of your leadership operating system.
          </p>
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(195,155,211,0.3), transparent)" }} />
        </div>
      </FadeInSection>

      {/* ── 5. Planetary Alignment ── */}
      <FadeInSection>
        <RetroFrame label="SYS-05 ALIGNMENT" accent="#C39BD3">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level={coherence >= 80 ? "green" : coherence >= 65 ? "amber" : "red"} />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#C39BD3", textShadow: "0 0 6px rgba(195,155,211,0.3)" }}>
              Planetary Alignment — Ray Coherence
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Are your strongest rays pulling in the same direction — or competing? When rays align, they multiply. When they don&apos;t, they cancel each other out under pressure.
          </p>
          <div className="max-w-xl mx-auto">
            <PlanetaryAlignment rays={SAMPLE_RAYS} />
          </div>
          <InsightBox label="Here's the pattern" accent="#C39BD3">
            <p>
              Your Purpose-Power axis (91 + 85) is locked in. When you know what matters, you move. That alignment is rare and powerful.
            </p>
            <p className="mt-1.5">
              But Joy (45) and Possibility (56) are drifting outside the beam. They&apos;re not broken — they&apos;re just not in formation with your drive rays.
            </p>
            <p className="mt-1.5">
              What that looks like in real life: you execute brilliantly on Plan A. But when Plan A hits a wall, you push harder instead of stepping back to see Plan B. That&apos;s not stubbornness — it&apos;s a Possibility gap. Your system doesn&apos;t naturally generate alternatives when it&apos;s under pressure.
            </p>
          </InsightBox>
          <RealLifeExample scenario="You've been pushing the same approach for weeks. Part of you knows there might be a better way, but switching feels like admitting failure.">
            <p>That&apos;s your Power ray protecting your Purpose ray. It&apos;s loyalty, not rigidity. But Possibility needs permission to interrupt the pattern. One rep: ask yourself, <em style={{ color: "var(--text-on-dark)" }}>&ldquo;What would I try if I wasn&apos;t already committed to this approach?&rdquo;</em></p>
          </RealLifeExample>
        </RetroFrame>
      </FadeInSection>

      {/* ── 6. Magnetic Field ── */}
      <FadeInSection>
        <RetroFrame label="SYS-06 MAG FIELD" accent="#60A5FA">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level={coherence >= 75 ? "green" : "amber"} />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#60A5FA", textShadow: "0 0 6px rgba(96,165,250,0.3)" }}>
              Magnetic Field — System Coherence
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            How consistently your rays fire together. Coherent systems recover faster, make better decisions under pressure, and sustain performance longer. Scattered systems burn bright but burn out.
          </p>
          <div className="max-w-xl mx-auto">
            <MagneticFieldRing rays={SAMPLE_RAYS} />
          </div>
          <InsightBox label="Why this matters" accent="#60A5FA">
            <p>
              Coherence at <strong style={{ color: "var(--text-on-dark)" }}>{coherence}%</strong>.
              {coherence >= 75
                ? " Your field is holding shape. Under pressure, your system maintains its pattern instead of fragmenting. That's earned — not given."
                : " Your field has scatter. The 46-point gap between Purpose (91) and Joy (45) creates an uneven signature. Under pressure, your system will default to its strongest rays and abandon the others. That's not a flaw — it's triage."}
            </p>
            <p className="mt-1.5">
              Here&apos;s where it gets interesting. Your three phases tell different stories:
            </p>
            <p className="mt-1">
              <strong style={{ color: "var(--text-on-dark)" }}>Reconnect</strong> (Intention, Joy, Presence) averages {Math.round((SAMPLE_RAYS.R1.score + SAMPLE_RAYS.R2.score + SAMPLE_RAYS.R3.score) / 3)} — your foundation.{" "}
              <strong style={{ color: "var(--text-on-dark)" }}>Radiate</strong> (Power, Purpose, Authenticity) averages {Math.round((SAMPLE_RAYS.R4.score + SAMPLE_RAYS.R5.score + SAMPLE_RAYS.R6.score) / 3)} — your engine.{" "}
              <strong style={{ color: "var(--text-on-dark)" }}>Become</strong> (Connection, Possibility, Be The Light) averages {Math.round((SAMPLE_RAYS.R7.score + SAMPLE_RAYS.R8.score + SAMPLE_RAYS.R9.score) / 3)} — your legacy.
            </p>
            <p className="mt-1.5">
              You radiate harder than you reconnect. That means you&apos;re outputting more than you&apos;re recovering. Your engine is strong — your fuel line needs attention.
            </p>
          </InsightBox>
        </RetroFrame>
      </FadeInSection>

      {/* ── 7. Orbit Map ── */}
      <FadeInSection>
        <RetroFrame label="SYS-07 ORBIT MAP" accent="#F4C430">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level="green" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#F4C430", textShadow: "0 0 6px rgba(244,196,48,0.3)" }}>
              Orbit Map — Your Solar System
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Your personal solar system. Inner orbit rays fire automatically. Outer orbit rays need deliberate attention. You lead from whatever&apos;s closest to your sun.
          </p>
          <div className="max-w-sm mx-auto">
            <OrbitMap rays={SAMPLE_RAYS} topTwo={SAMPLE_TOP_TWO} bottomRay={SAMPLE_BOTTOM_RAY} />
          </div>
          <InsightBox label="Your solar system" accent="#F4C430">
            <p>
              <strong style={{ color: "var(--text-on-dark)" }}>Inner orbit — your power sources.</strong> Purpose and Power sit closest to your core. They fire without thinking. When the pressure comes, these are the rays that answer the phone.
            </p>
            <p className="mt-1.5">
              <strong style={{ color: "var(--text-on-dark)" }}>Middle orbit — accessible but not automatic.</strong> Be The Light, Connection, Intention, Presence. You can reach these — but they require a conscious decision. Under stress, they don&apos;t volunteer.
            </p>
            <p className="mt-1.5">
              <strong style={{ color: "var(--text-on-dark)" }}>Outer orbit — your growth edge.</strong> Authenticity, Possibility, Joy. These go dark first when load increases. They&apos;re not missing — they&apos;re just the farthest from your fire right now. Every rep pulls them closer.
            </p>
          </InsightBox>
          <CoachingRep title="Orbit-shifting rep">
            <p>Pick one outer-orbit ray this week. Just one. Give it <em style={{ color: "var(--text-on-dark)" }}>one conscious moment per day.</em> Not an hour. Not a journal session. One moment where you let that ray lead instead of your power sources. That&apos;s how orbits shift — not through force, but through attention.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ══════════ SECTION D: RISK & RECOVERY ══════════ */}
      <FadeInSection>
        <div className="mb-2 mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#FB923C", textShadow: "0 0 8px rgba(251,146,60,0.2)" }}>
            Section D — Risk &amp; Recovery
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Every system has gravity wells — places where energy leaks quietly. This isn&apos;t about what&apos;s wrong with you. It&apos;s about where your system needs conscious attention before small drains compound into real drag.
          </p>
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(251,146,60,0.3), transparent)" }} />
        </div>
      </FadeInSection>

      {/* ── 8. Black Hole Flags ── */}
      <FadeInSection>
        <RetroFrame label="SYS-08 BLACK HOLE" accent="#FB923C">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level="amber" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#FB923C", textShadow: "0 0 6px rgba(251,146,60,0.3)" }}>
              Black Hole Flags — Energy Leaks
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Where your energy leaks live. One unmanaged gravity well pulls down everything around it. These aren&apos;t weaknesses — they&apos;re drains that need conscious attention before they compound.
          </p>
          <div className="max-w-xl mx-auto">
            <BlackHoleFlags rays={SAMPLE_RAYS} eclipse={SAMPLE_ECLIPSE} />
          </div>
          <InsightBox label="Where energy leaks" accent="#FB923C">
            <p>
              Joy (eclipse: {SAMPLE_RAYS.R2.eclipse_score}) is your primary gravity well. When Joy dims, you stop recharging and start pushing through. Your body knows the difference even when your mind doesn&apos;t.
            </p>
            <p className="mt-1.5">
              Here&apos;s what happens next: that Joy drain pulls on Presence and Authenticity, which sit nearby in your architecture. It&apos;s not one leak — it&apos;s a cascade. One dimmed ray dims its neighbors.
            </p>
            <p className="mt-1.5">
              Authenticity (eclipse: {SAMPLE_RAYS.R6.eclipse_score}, modifier: <strong style={{ color: "#FB923C" }}>AMPLIFIED</strong>) is the one to watch. That amplifier means something in your current environment is making it harder to show up as yourself. Not your fault — but your responsibility to notice.
            </p>
          </InsightBox>
          <RealLifeExample scenario="You hold back in a meeting because saying what you really think feels too risky right now. Not because you're afraid — because you're tired.">
            <p>That&apos;s the Authenticity eclipse in action. When emotional load is high, self-disclosure is the first thing your system rations. It takes energy to be vulnerable. When energy is scarce, your system protects.</p>
          </RealLifeExample>
          <CoachingRep title="Leak repair rep">
            <p>This week, notice one moment where you&apos;re pushing through instead of pausing. Don&apos;t fix it. Just <em style={{ color: "var(--text-on-dark)" }}>notice it.</em> Say to yourself: <em style={{ color: "#F4C430" }}>&ldquo;That&apos;s my eclipse, not my identity.&rdquo;</em> Awareness is the first rep. Everything else builds from there.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ══════════ SECTION E: GROWTH TRAJECTORY ══════════ */}
      <FadeInSection>
        <div className="mb-2 mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#F59E0B", textShadow: "0 0 8px rgba(245,158,11,0.2)" }}>
            Section E — Growth Trajectory
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Where are you headed? This section tracks your energy surges over time and maps the skills you&apos;ve already activated. Your personal constellation — the leader you&apos;re becoming, one star at a time.
          </p>
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.3), transparent)" }} />
        </div>
      </FadeInSection>

      {/* ── 9. Solar Flare Journal ── */}
      <FadeInSection>
        <RetroFrame label="SYS-09 FLARE LOG" accent="#F59E0B">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level="green" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#F59E0B", textShadow: "0 0 6px rgba(245,158,11,0.3)" }}>
              Solar Flare Journal — Capacity Timeline
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Your energy surges across time. When did you fire above baseline? Which rays are actively growing — and which are going quiet? The timeline tells the story your scores can&apos;t.
          </p>
          <div className="max-w-xl mx-auto">
            <SolarFlareJournal flares={SAMPLE_FLARES} />
          </div>
          <InsightBox label="The trend that matters" accent="#F59E0B">
            <p>
              Purpose (0.92) and Power (0.88) erupt hard. That&apos;s your fire. When you&apos;re locked in, you burn bright.
            </p>
            <p className="mt-1.5">
              But look at the timeline. Energy starts strong in late January and decays through February. Each flare is smaller than the last. That&apos;s not a bad month — that&apos;s a system spending faster than it recovers.
            </p>
            <p className="mt-1.5">
              Joy (0.18) and Possibility (0.28) barely spark. They&apos;re not erupting — they&apos;re smoldering. Your system is generating from reserves, not renewable capacity. That works for sprints. Not for the long game.
            </p>
          </InsightBox>
          <RealLifeExample scenario="You crush a big project in January but by mid-February you're running on fumes and can't figure out why nothing feels as exciting.">
            <p>That&apos;s the flare decay pattern. You didn&apos;t lose your drive — you spent your surge without refueling. The next burst is available. It just needs a recovery cycle first.</p>
          </RealLifeExample>
          <CoachingRep title="Refuel rep">
            <p>After your next win — big or small — take <em style={{ color: "var(--text-on-dark)" }}>60 seconds to actually feel it.</em> Not move to the next thing. Not check the list. Feel the completion. That&apos;s how you turn a surge into renewable energy instead of a one-time flare.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ── 10. Constellation Progress ── */}
      <FadeInSection>
        <RetroFrame label="SYS-10 STAR MAP" accent="#818CF8">
          <div className="flex items-center gap-2 mb-1">
            <StatusDot level={constellationStars.filter(s => s.completed).length > 24 ? "green" : "amber"} />
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#818CF8", textShadow: "0 0 6px rgba(129,140,248,0.3)" }}>
              Constellation Progress — Your Star Map
            </p>
          </div>
          <p className="text-[11px] mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Every lit star is a micro-capability you can access under pressure. More stars means a wider range of leadership responses. This is your personal mythology — the constellation you&apos;re building, one rep at a time.
          </p>
          <div className="flex flex-wrap mb-2">
            <MetricChip label="Stars Lit:" value={`${constellationStars.filter(s => s.completed).length}/36`} />
            <MetricChip label="Major:" value={constellationStars.filter(s => s.major).length} />
          </div>
          <div className="max-w-sm mx-auto">
            <ConstellationProgress
              stars={constellationStars}
              constellationName="Driven Leader"
              dateRange="Last 30 days"
            />
          </div>
          <InsightBox label="Your personal mythology" accent="#818CF8">
            <p>
              {constellationStars.filter(s => s.completed).length} of 36 stars lit. That&apos;s {Math.round(constellationStars.filter(s => s.completed).length / 36 * 100)}% of your constellation active. Every lit star is a micro-capability you can access under pressure.
            </p>
            <p className="mt-1.5">
              Your Purpose and Power clusters are bright — almost fully illuminated. When people look at you as a leader, that&apos;s the constellation they see: clarity and action.
            </p>
            <p className="mt-1.5">
              Joy&apos;s region has only {Object.values(SAMPLE_RAYS.R2.subfacets ?? {}).filter(sf => sf.score >= 60).length} of 4 stars lit. That&apos;s your dark patch. Not permanently dark — just waiting for the reps that light them up.
            </p>
            <p className="mt-1.5">
              The &ldquo;Driven Leader&rdquo; archetype is yours. You lead through mission and movement. Your constellation would shine even brighter with more recovery stars activated — and every star you light expands the range of responses available to you as a leader.
            </p>
          </InsightBox>
          <CoachingRep title="Star-lighting rep">
            <p>Pick one unlit star this week — one specific subfacet where you scored below 60. Give it <em style={{ color: "var(--text-on-dark)" }}>one intentional rep per day.</em> Not a project. Not a goal. One moment where you practice that specific micro-capability. Stars light one rep at a time.</p>
          </CoachingRep>
        </RetroFrame>
      </FadeInSection>

      {/* ══════════ SECTION F: SUMMARY & NEXT STEPS ══════════ */}
      <FadeInSection>
        <div className="mb-2 mt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#F4C430", textShadow: "0 0 8px rgba(244,196,48,0.2)" }}>
            Section F — Your Path Forward
          </p>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-on-dark-secondary)" }}>
            Here&apos;s the truth: knowing your pattern is the first rep. Everything that follows — every small shift, every conscious moment, every time you choose a different ray — builds from this awareness.
          </p>
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(244,196,48,0.3), transparent)" }} />
        </div>
      </FadeInSection>

      <FadeInSection>
        <RetroFrame label="SUMMARY" accent="#F4C430">
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "#F4C430", textShadow: "0 0 6px rgba(244,196,48,0.3)" }}>
              Report Summary
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="rounded-lg py-2 px-3" style={{ background: "rgba(244,196,48,0.06)", border: "1px solid rgba(244,196,48,0.1)" }}>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>{Math.round(overallScore)}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-on-dark-secondary)" }}>Stability</p>
              </div>
              <div className="rounded-lg py-2 px-3" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.1)" }}>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>{SAMPLE_ECLIPSE.level}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-on-dark-secondary)" }}>Eclipse</p>
              </div>
              <div className="rounded-lg py-2 px-3" style={{ background: "rgba(195,155,211,0.06)", border: "1px solid rgba(195,155,211,0.1)" }}>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>{coherence}%</p>
                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-on-dark-secondary)" }}>Coherence</p>
              </div>
              <div className="rounded-lg py-2 px-3" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.1)" }}>
                <p className="font-mono text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>{constellationStars.filter(s => s.completed).length}/36</p>
                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--text-on-dark-secondary)" }}>Stars Lit</p>
              </div>
            </div>
            <InsightBox label="The bottom line" accent="#F4C430">
              <p>
                You are a <strong style={{ color: "var(--text-on-dark)" }}>Driven Leader</strong>. Purpose-Power engine strong. System running at solid capacity with moderate eclipse coverage.
              </p>
              <p className="mt-1.5">
                Here&apos;s the truth: you don&apos;t need more motivation. You need more recovery. Your Joy and Possibility rays are running thin — not because you&apos;re failing at them, but because your system has been prioritizing output over input.
              </p>
              <p className="mt-1.5">
                The risk? Sustained output without refueling creates a slow eclipse. It doesn&apos;t crash overnight. It compounds in the background while you&apos;re busy being excellent.
              </p>
              <p className="mt-1.5">
                The opportunity? Small. Tiny, even. One Joy rep per day. One Possibility moment per week. That&apos;s enough to shift the trajectory and light up the 30% of your constellation that&apos;s waiting.
              </p>
              <p className="mt-2" style={{ color: "#F4C430" }}>
                This is sample data. Your real report maps <em>your</em> actual patterns — 143 data points across 36 subfacets, with coaching reps built specifically for your eclipse signature.
              </p>
            </InsightBox>
          </div>
        </RetroFrame>
      </FadeInSection>

      {/* ── CTA ── */}
      <FadeInSection>
        <RetroFrame label="COMMAND" accent="#F4C430">
          <div className="text-center py-4">
            <p className="text-sm mb-2 leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              You just saw what a report looks like with sample data.
            </p>
            <p className="text-sm mb-1 leading-relaxed" style={{ color: "var(--text-on-dark)" }}>
              Imagine seeing <em>your</em> actual eclipse signature. <em>Your</em> real power sources.
              <br />The specific reps that would shift <em>your</em> trajectory.
            </p>
            <p className="font-mono text-[11px] mt-3 mb-5" style={{ color: "var(--text-on-dark-secondary)" }}>
              143 questions &middot; 12 minutes &middot; 36 subfacets &middot; 9 rays &middot; Research-backed
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/assessment/setup" className="btn-primary">
                Discover Your Light Signature
              </Link>
              <Link href="/preview-cosmic" className="btn-watch">
                View All 28 Instruments
              </Link>
            </div>
            <p className="font-mono text-[9px] mt-4" style={{ color: "var(--text-on-dark-secondary)" }}>
              One clean breath. Then next action.
            </p>
          </div>
        </RetroFrame>
      </FadeInSection>
    </div>
  );
}
