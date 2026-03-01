"use client";
/**
 * RayDetailClient — The interactive half of the Ray detail page.
 *
 * Why split? The parent page.tsx is a Server Component (reads cookies, auth,
 * DB). This file handles Framer Motion animations and interactive UI.
 */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { RayOutput, AssessmentOutputV1, SubfacetOutput } from "@/lib/types";

interface Props {
  rayId: string;
  rayName: string;
  rayColor: string;          // hex fallback
  rayData: RayOutput;
  pipelineOutput: AssessmentOutputV1 | null;
  prevHref: string;
  nextHref: string;
  backHref: string;
  prevRayName: string;
  nextRayName: string;
}

// Scores 0-100 → qualitative label
function scoreLabel(score: number): string {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Active";
  if (score >= 30) return "Developing";
  return "Growth Edge";
}

// Sort subfacets to find Shine (highest) and Eclipse (lowest) areas
function classifySubfacets(subfacets: Record<string, SubfacetOutput>) {
  const entries = Object.values(subfacets);
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const shine = sorted.slice(0, Math.ceil(sorted.length / 2));
  const eclipse = sorted.slice(Math.ceil(sorted.length / 2));
  return { shine, eclipse };
}

// Score ring component — shows a circular progress arc in the ray's color
function ScoreRing({ score, color, rayId }: { score: number; color: string; rayId: string }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <motion.circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        {/* Score number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>/ 100</span>
        </div>
      </div>
      <span
        className="text-xs font-semibold px-3 py-1 rounded-full"
        style={{
          background: `${color}22`,
          color,
          border: `1px solid ${color}44`,
        }}
      >
        {scoreLabel(score)}
      </span>
    </div>
  );
}

export default function RayDetailClient({
  rayId,
  rayName,
  rayColor,
  rayData,
  pipelineOutput,
  prevHref,
  nextHref,
  backHref,
  prevRayName,
  nextRayName,
}: Props) {
  const [scienceOpen, setScienceOpen] = useState(false);

  const { shine, eclipse } = classifySubfacets(rayData.subfacets ?? {});

  // Pull tool recommendation from recommendations in pipeline output
  const recommendations = pipelineOutput?.recommendations;
  const toolRec = recommendations?.tools?.[0]
    ? { tool_name: recommendations.tools[0].label, why: recommendations.tools[0].why_now, install_step: recommendations.tools[0].steps?.[0] }
    : null;

  // Eclipse modifier badge
  const eclipseModifier = rayData.eclipse_modifier;
  const showEclipseWarning = eclipseModifier === "MUTED" || eclipseModifier === "HIGH_ECLIPSE";

  return (
    <main className="cosmic-page-bg min-h-screen">
      <div className="mx-auto max-w-[800px] px-5 py-10 sm:px-8 space-y-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
          <Link href="/portal" className="hover:text-white transition-colors">Portal</Link>
          <span>›</span>
          <Link href={backHref} className="hover:text-white transition-colors">Your Results</Link>
          <span>›</span>
          <span style={{ color: rayColor }}>{rayId} {rayName}</span>
        </nav>

        {/* ── Header ── */}
        <motion.section
          className="glass-card p-8 text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="gold-tag inline-block">{rayId}</p>
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-on-dark)" }}>
            Ray of {rayName}
          </h1>

          <div className="flex justify-center pt-2">
            <ScoreRing score={rayData.score} color={rayColor} rayId={rayId} />
          </div>

          {/* Eclipse modifier warning */}
          {showEclipseWarning && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: "rgba(255,100,50,0.15)", color: "#FF8060", border: "1px solid rgba(255,100,50,0.3)" }}
            >
              <span>⚠️</span>
              <span>
                Your Eclipse is modulating this Ray — current load is dimming your access.
                This score reflects capacity, not character.
              </span>
            </div>
          )}
        </motion.section>

        {/* ── Shine Section ── */}
        {shine.length > 0 && (
          <motion.section
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>Your Shine</h2>
              <span className="text-xs ml-auto" style={{ color: "var(--text-on-dark-muted)" }}>What&apos;s resourced</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
              These are the parts of your {rayName} Ray that are working. Draw from these as you grow.
            </p>
            <div className="space-y-3">
              {shine.map((sf) => (
                <div key={sf.subfacet_id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--text-on-dark)" }}>{sf.label}</span>
                      <span style={{ color: rayColor }}>{Math.round(sf.score)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: rayColor, boxShadow: `0 0 8px ${rayColor}66` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sf.score}%` }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Eclipse Section ── */}
        {eclipse.length > 0 && (
          <motion.section
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🌑</span>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>Your Eclipse</h2>
              <span className="text-xs ml-auto" style={{ color: "var(--text-on-dark-muted)" }}>Skills to grow</span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
              These aren&apos;t weaknesses — they&apos;re the next skills to develop. Your top Rays power their growth.
            </p>
            <div className="space-y-3">
              {eclipse.map((sf) => (
                <div key={sf.subfacet_id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: "var(--text-on-dark)" }}>{sf.label}</span>
                      <span style={{ color: "var(--text-on-dark-muted)" }}>{Math.round(sf.score)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "rgba(150,100,200,0.6)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sf.score}%` }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Today's Tool ── */}
        {toolRec && (
          <motion.section
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>Today&apos;s Tool</h2>
            </div>
            <div
              className="p-4 rounded-xl space-y-2"
              style={{
                background: `${rayColor}12`,
                border: `1px solid ${rayColor}33`,
              }}
            >
              <p className="font-semibold" style={{ color: rayColor }}>
                {toolRec.tool_name ?? "Presence Pause"}
              </p>
              <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                {toolRec.why ?? `The recommended starting tool for your ${rayName} Ray.`}
              </p>
              {toolRec.install_step && (
                <p className="text-xs pt-1" style={{ color: "var(--text-on-dark-muted)" }}>
                  How: {toolRec.install_step}
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* ── Micro-Rep ── */}
        <motion.section
          className="glass-card p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ border: `1px solid ${rayColor}44` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="text-lg font-bold" style={{ color: "var(--text-on-dark)" }}>Your Micro-Rep</h2>
            <span
              className="text-xs ml-auto px-2 py-0.5 rounded-full"
              style={{ background: `${rayColor}20`, color: rayColor }}
            >
              &lt; 5 min
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
            One rep for your {rayName} Ray. Do it now — before you close this tab.
          </p>
          <div
            className="p-5 rounded-xl"
            style={{ background: `${rayColor}0f`, border: `1px solid ${rayColor}33` }}
          >
            <p className="text-base font-medium" style={{ color: "var(--text-on-dark)" }}>
              {getMicroRep(rayId)}
            </p>
          </div>
        </motion.section>

        {/* ── Science toggle (collapsible detail) ── */}
        <motion.section
          className="glass-card overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <button
            onClick={() => setScienceOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-on-dark-secondary)" }}>
              What the science says about {rayName}
            </span>
            <span
              className="text-xs transition-transform duration-200"
              style={{
                color: "var(--text-on-dark-muted)",
                transform: scienceOpen ? "rotate(180deg)" : "none",
              }}
            >
              ▼
            </span>
          </button>
          {scienceOpen && (
            <div className="px-6 pb-5 space-y-2">
              <p className="text-sm" style={{ color: "var(--text-on-dark-secondary)" }}>
                {getScienceNote(rayId)}
              </p>
              <p className="text-xs" style={{ color: "var(--text-on-dark-muted)" }}>
                Results are based on your responses across 4 subfacets. Scores represent current capacity,
                not fixed traits. Retake in 30–90 days after consistent reps to track change.
              </p>
            </div>
          )}
        </motion.section>

        {/* ── Navigation: Prev / Next Ray ── */}
        <nav className="flex items-center justify-between gap-4">
          <Link
            href={prevHref}
            className="flex items-center gap-2 glass-card px-5 py-3 text-sm font-medium transition-all hover:scale-105"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            ← {prevRayName}
          </Link>
          <Link
            href={backHref}
            className="text-xs"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            All Results
          </Link>
          <Link
            href={nextHref}
            className="flex items-center gap-2 glass-card px-5 py-3 text-sm font-medium transition-all hover:scale-105"
            style={{ color: "var(--text-on-dark-secondary)" }}
          >
            {nextRayName} →
          </Link>
        </nav>

      </div>
    </main>
  );
}

// ── Per-Ray micro-reps (short, specific, actionable) ──────────────────────────
function getMicroRep(rayId: string): string {
  const reps: Record<string, string> = {
    R1: "Set one intention for the next 2 hours. Write it down or say it out loud: 'In the next 2 hours, I will ___.' One thing. Specific. Done.",
    R2: "Name one thing you genuinely enjoyed in the last 24 hours. Not performed joy — real joy. Say it out loud. Let it land.",
    R3: "Take 3 slow breaths right now. Inhale 4 counts, hold 4, exhale 6. Notice where you are. That's the Presence Pause.",
    R4: "Do one thing you've been putting off — right now, not later. It doesn't have to be big. It just has to be done. Go first.",
    R5: "Finish this sentence: 'The reason this work matters to me is ___.' Don't optimize it. Just complete it honestly.",
    R6: "Name one value you hold that shaped a recent decision. Say it plainly — not what you think sounds good. What's actually true.",
    R7: "Send one message to someone you've been meaning to check in with. One line. No big reason needed. Just the reach.",
    R8: "Name one thing you're curious about right now — not anxious, curious. What would you explore if nothing was at risk?",
    R9: "Who did you light up today without trying? Think of one person. That's your Ray 9 in action. Write their name.",
  };
  return reps[rayId] ?? "Take one intentional action in the next 5 minutes that reflects this Ray's energy.";
}

// ── Per-Ray science notes ─────────────────────────────────────────────────────
function getScienceNote(rayId: string): string {
  const notes: Record<string, string> = {
    R1: "Intention-setting activates the prefrontal cortex and primes the RAS to notice relevant opportunities. Research by Peter Gollwitzer on implementation intentions shows that 'when/then' planning more than doubles follow-through rates.",
    R2: "Positive emotions don't just feel good — Barbara Fredrickson's Broaden-and-Build theory shows they expand cognitive flexibility, creativity, and resilience reserves over time. Joy is infrastructure.",
    R3: "Presence is a trainable skill. Amishi Jha's research shows that 12 minutes of mindfulness practice per day measurably improves attention control under high-pressure conditions. The Presence Pause works via this mechanism.",
    R4: "Agency and self-efficacy (Bandura) predict performance more reliably than raw talent. Power Ray scores reflect your current access to agentic behavior — not personality. Eclipse load is the primary suppressor.",
    R5: "Purpose correlates with sustained effort, resilience under failure, and long-term wellbeing (Damon, McKnight). It works by activating intrinsic motivation pathways — bypassing the hedonic treadmill.",
    R6: "Values-congruent behavior reduces cognitive load and decision fatigue. Authenticity research (Kernis, Goldman) links self-consistency to lower anxiety and higher relational trust over time.",
    R7: "Social connection is one of the strongest predictors of performance and wellbeing across decades of research. Ethan Kross and others show that even brief, genuine contact activates the same neural circuits as secure attachment.",
    R8: "Growth mindset (Dweck) and possibility orientation predict learning rate and recovery from setbacks. High Possibility scores correlate with experimental behavior and tolerance of ambiguity.",
    R9: "Integration across all 9 Rays — Be The Light — reflects neurological coherence: the ability to access multiple behavioral capacities fluidly rather than defaulting to one mode under pressure.",
  };
  return notes[rayId] ?? "Each Ray maps to well-established behavioral science constructs validated across leadership and performance research.";
}
