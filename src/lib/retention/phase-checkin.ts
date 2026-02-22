/**
 * Phase Check-In: daily 30-second state scan.
 *
 * Three questions detect current operating phase.
 * Science: interoceptive awareness (Lisa Feldman Barrett) —
 * naming your state is the first regulation move.
 */

// ── Questions ────────────────────────────────────────────────────────────────

export interface CheckInOption {
  label: string;
  score: number;
}

export interface CheckInQuestion {
  id: string;
  prompt: string;
  options: CheckInOption[];
}

export const PHASE_CHECKIN_QUESTIONS: CheckInQuestion[] = [
  {
    id: "body_signal",
    prompt: "How does your body feel right now?",
    options: [
      { label: "Settled. I have room.", score: 3 },
      { label: "Some tension. I can manage it.", score: 2 },
      { label: "Tight, foggy, or restless.", score: 1 },
      { label: "Exhausted or numb.", score: 0 },
    ],
  },
  {
    id: "energy_state",
    prompt: "Where is your energy?",
    options: [
      { label: "Clear and available.", score: 3 },
      { label: "Running, but I\u2019m borrowing from somewhere.", score: 2 },
      { label: "Pushing through without much fuel.", score: 1 },
      { label: "Empty or shut down.", score: 0 },
    ],
  },
  {
    id: "connection_access",
    prompt: "How connected do you feel to what matters today?",
    options: [
      { label: "Connected and clear.", score: 3 },
      { label: "I know what matters but feel pulled.", score: 2 },
      { label: "Hard to access right now.", score: 1 },
      { label: "Flat or distant.", score: 0 },
    ],
  },
];

// ── Phase Detection ──────────────────────────────────────────────────────────

export type DetectedPhase =
  | "orbit"
  | "gravity_shift"
  | "eclipse_onset"
  | "full_eclipse";

export function detectPhase(totalScore: number): DetectedPhase {
  if (totalScore >= 7) return "orbit";
  if (totalScore >= 5) return "gravity_shift";
  if (totalScore >= 3) return "eclipse_onset";
  return "full_eclipse";
}

// ── Phase Guidance ───────────────────────────────────────────────────────────

export interface PhaseGuidance {
  label: string;
  message: string;
  repFocus: string;
  color: string;
  bgColor: string;
}

export const PHASE_GUIDANCE: Record<DetectedPhase, PhaseGuidance> = {
  orbit: {
    label: "Orbit",
    message:
      "Your system is clear. Full range available. This is where training deepens.",
    repFocus:
      "Stretch into your Bottom Ray today. Try a new tool. Push the edge.",
    color: "#22C55E",
    bgColor: "#F0FDF4",
  },
  gravity_shift: {
    label: "Gravity Shift",
    message:
      "Some load showing up. Your range is narrowing. Steady the base before you stretch.",
    repFocus:
      "Anchor with your Top Ray strengths. One clear rep. Keep it grounded.",
    color: "#EAB308",
    bgColor: "#FEFCE8",
  },
  eclipse_onset: {
    label: "Eclipse Onset",
    message:
      "Your system is carrying load. Ground first. One small, specific action.",
    repFocus:
      "Presence Pause or 90-Second Window. Nothing to solve. Just ground.",
    color: "#F97316",
    bgColor: "#FFF7ED",
  },
  full_eclipse: {
    label: "Full Eclipse",
    message:
      "Recovery first. Your capacity is compressed right now. One grounding action is enough.",
    repFocus: "Feet on the floor. One breath. That counts.",
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
};
