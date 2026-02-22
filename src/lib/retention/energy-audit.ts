/**
 * Energy Audit: 8 allostatic load dimensions.
 *
 * Science: Allostatic load model (McEwen & Stellar) —
 * cumulative stress cost is measurable and predictive.
 * Each dimension scored 0-3: none / mild / moderate / high.
 */

export interface EnergyDimension {
  id: string;
  label: string;
  prompt: string;
  levels: string[];
}

export const ENERGY_DIMENSIONS: EnergyDimension[] = [
  {
    id: "sleep_debt",
    label: "Sleep Debt",
    prompt: "How is your sleep this week?",
    levels: ["Rested. Getting what I need.", "Slightly short. Manageable.", "Noticeably low. Feeling it.", "Deeply depleted. Running on fumes."],
  },
  {
    id: "recovery_quality",
    label: "Recovery",
    prompt: "How well are you recovering between demands?",
    levels: ["Good resets. I bounce back.", "Some recovery. Could be more.", "Recovery is thin. I\u2019m running through.", "No recovery. Just output."],
  },
  {
    id: "fog",
    label: "Fog",
    prompt: "How clear is your thinking?",
    levels: ["Sharp and clear.", "Slight haze. Still functional.", "Foggy. Takes more effort.", "Dense. Hard to focus or decide."],
  },
  {
    id: "irritability",
    label: "Irritability",
    prompt: "How reactive are you to small friction?",
    levels: ["Steady. Things roll off.", "Slightly shorter fuse.", "Noticeably reactive. Catching myself.", "Hair trigger. Everything lands heavy."],
  },
  {
    id: "impulsivity",
    label: "Impulsivity",
    prompt: "How much are you acting without thinking?",
    levels: ["Deliberate. I\u2019m choosing.", "Some quick reactions. Mostly aware.", "Moving faster than I should.", "Reacting before I realize it."],
  },
  {
    id: "numbness",
    label: "Numbness",
    prompt: "How connected do you feel to your experience?",
    levels: ["Present and feeling.", "Slightly muted. Still here.", "Going through motions.", "Checked out or flat."],
  },
  {
    id: "somatic_signals",
    label: "Body Signals",
    prompt: "What is your body telling you?",
    levels: ["Quiet. No significant tension.", "Some tightness or discomfort.", "Persistent tension or pain.", "My body is loud and I\u2019m ignoring it."],
  },
  {
    id: "compulsion",
    label: "Compulsion",
    prompt: "Are you reaching for relief patterns?",
    levels: ["Clean choices. Steady.", "Some comfort-seeking. Aware of it.", "Leaning on relief patterns more.", "Running hard on autopilot coping."],
  },
];

export type LoadBand = "low" | "moderate" | "elevated" | "high";

export function computeLoadBand(totalLoad: number): LoadBand {
  if (totalLoad <= 6) return "low";
  if (totalLoad <= 12) return "moderate";
  if (totalLoad <= 18) return "elevated";
  return "high";
}

export interface LoadGuidance {
  label: string;
  message: string;
  action: string;
  color: string;
  bgColor: string;
}

export const LOAD_GUIDANCE: Record<LoadBand, LoadGuidance> = {
  low: {
    label: "Low Load",
    message: "Your system has capacity. This is when training deepens.",
    action: "Stretch. Try a harder rep. Practice your Bottom Ray.",
    color: "#22C55E",
    bgColor: "#F0FDF4",
  },
  moderate: {
    label: "Moderate Load",
    message: "Load is present. Your system is handling it, but watch the trend.",
    action: "Maintain your reps. Protect recovery time. One tool a day.",
    color: "#EAB308",
    bgColor: "#FEFCE8",
  },
  elevated: {
    label: "Elevated Load",
    message: "Your system is borrowing. The cost compounds if you don\u2019t intervene.",
    action: "Reduce where you can. Ground daily. Use Presence Pause before decisions.",
    color: "#F97316",
    bgColor: "#FFF7ED",
  },
  high: {
    label: "High Load",
    message: "Recovery is the priority. Your capacity is compressed.",
    action: "Protect sleep. Drop non-essentials. One grounding action per day is enough.",
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
};

/**
 * Get the Monday of the current ISO week.
 */
export function currentWeekMonday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}
