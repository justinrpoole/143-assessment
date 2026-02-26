export interface MetricDefinition {
  id: string;
  label: string;
  shortDescription: string;
  longDescription: string;
  scale: string;
  interpretation: string;
}

export const RAY_METRICS: MetricDefinition[] = [
  {
    id: "R1",
    label: "Ray of Intention",
    shortDescription: "Proactively setting clear direction each day",
    longDescription:
      "Measures your ability to proactively set clear direction and top priorities before reactive demands take over. High scores indicate you begin each day with a plan, not a reaction.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you consistently set direction before the day sets it for you. Lower scores suggest reactive patterns are running the show.",
  },
  {
    id: "R2",
    label: "Ray of Joy",
    shortDescription: "Accessing micro-joy independent of conditions",
    longDescription:
      "Measures your capacity to access joy that is not dependent on external conditions. This is not happiness — it is the ability to find micro-moments of lightness even when things are hard.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean joy is available to you regardless of circumstances. Lower scores suggest your experience of joy is conditional on things going well.",
  },
  {
    id: "R3",
    label: "Ray of Presence",
    shortDescription: "Staying with task or person without fragmenting",
    longDescription:
      "Measures your ability to stay fully with a task or person without mental fragmentation. Not mindfulness as a concept — presence as a measurable capacity to hold attention.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you can sustain undivided attention. Lower scores indicate your attention is frequently split across multiple demands.",
  },
  {
    id: "R4",
    label: "Ray of Power",
    shortDescription: "Identifying fear without fusing with it",
    longDescription:
      "Measures your ability to identify fear, set boundaries, and take action without the fear controlling the outcome. Power is not force — it is the gap between stimulus and response.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you can feel fear and still lead. Lower scores suggest fear may be driving decisions more than you realize.",
  },
  {
    id: "R5",
    label: "Ray of Purpose",
    shortDescription: "Naming what matters and acting on it",
    longDescription:
      "Measures your clarity about what matters most and your willingness to act on it. Purpose is not a mission statement — it is the daily practice of aligning actions with values.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean your actions are aligned with your stated values. Lower scores indicate a gap between what you say matters and what you actually do.",
  },
  {
    id: "R6",
    label: "Ray of Authenticity",
    shortDescription: "Same self across all contexts",
    longDescription:
      "Measures the consistency of your self-expression across work, home, social, and private contexts. Authenticity is not oversharing — it is not performing a different version of yourself in each room.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you show up consistently everywhere. Lower scores suggest you are running different operating systems for different audiences.",
  },
  {
    id: "R7",
    label: "Ray of Connection",
    shortDescription: "Reading cues and responding well",
    longDescription:
      "Measures your ability to read emotional and social cues in others and respond appropriately. Connection is not people-pleasing — it is accurate attunement paired with genuine response.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you notice what others need and respond authentically. Lower scores suggest you may miss cues or default to habitual responses.",
  },
  {
    id: "R8",
    label: "Ray of Possibility",
    shortDescription: "Flexible stance toward new information",
    longDescription:
      "Measures your openness to new information, perspectives, and options even when they challenge your current position. Possibility is not naivety — it is strategic flexibility.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you can hold your position lightly and integrate new data. Lower scores suggest rigidity may be limiting your options.",
  },
  {
    id: "R9",
    label: "Be The Light",

    shortDescription: "Visible regulation and elevated standards",
    longDescription:
      "Measures your capacity to visibly regulate yourself and maintain elevated standards that others can see and follow. This is not performing — it is being the standard you want to see.",
    scale: "0–4 (Never → Almost Always)",
    interpretation:
      "Higher scores mean you are the visible standard in the room. Lower scores suggest your internal standards are not consistently visible to others.",
  },
];

export const COMPOSITE_METRICS: MetricDefinition[] = [
  {
    id: "eclipse_percentage",
    label: "Eclipse Percentage",
    shortDescription: "How much of your capacity is temporarily covered",
    longDescription:
      "Your Eclipse Percentage measures the gap between your potential capacity and your current access to it. It is not a verdict — it is a temporary state caused by sustained stress, overuse of compensating strengths, or neglect of specific capacities. Everyone has some eclipse. What matters is knowing where it is.",
    scale: "0–100%",
    interpretation:
      "Lower percentages mean more of your capacity is accessible. Higher percentages indicate more temporary coverage. Above 60% suggests significant capacity is hidden under stress patterns.",
  },
  {
    id: "light_signature",
    label: "Light Signature",
    shortDescription: "Your two Power Sources working together",
    longDescription:
      "Your Light Signature is the unique combination of your two strongest Rays. There are 36 possible combinations, each with a distinct archetype name. This is not a personality type — it is your current operating pattern, and it can change as you train different capacities.",
    scale: "36 archetype combinations",
    interpretation:
      "Your Light Signature shows where your leadership naturally gravitates. It also reveals which capacity might be doing extra work to compensate for an eclipsed Ray.",
  },
  {
    id: "energy_ratio",
    label: "Energy Ratio",
    shortDescription: "How much capacity you are accessing vs. burning",
    longDescription:
      "The Energy Ratio compares your total accessed capacity against the energy you are expending to compensate for eclipsed areas. A healthy ratio means your strongest Rays are supporting you, not covering for depleted ones.",
    scale: "Ratio value",
    interpretation:
      "Higher ratios indicate efficient capacity use. Lower ratios suggest you are spending energy compensating rather than leading from strength.",
  },
  {
    id: "rise_path",
    label: "Rise Path",
    shortDescription: "Your priority capacity to train first",
    longDescription:
      "Your Rise Path identifies the single Ray that, if trained, would create the most improvement across your entire system. It is usually your lowest-scoring Ray or the one most compensated for by a stronger Ray.",
    scale: "One of 9 Rays",
    interpretation:
      "This is your highest-impact training target. Start here, and the improvements cascade into other Rays.",
  },
];

export const ECLIPSE_DIMENSION_METRICS: MetricDefinition[] = [
  {
    id: "emotional_load",
    label: "Emotional Load",
    shortDescription: "Weight carried in the feeling system",
    longDescription:
      "Measures the emotional weight your system is currently processing. This includes unresolved stress, suppressed feelings, empathy fatigue, and the cumulative cost of holding space for others without replenishing your own reserves.",
    scale: "0–100",
    interpretation:
      "Lower scores mean your emotional system has capacity. Higher scores indicate your feeling system is working overtime — you may be absorbing more than you realize.",
  },
  {
    id: "cognitive_load",
    label: "Cognitive Load",
    shortDescription: "Mental capacity under current demand",
    longDescription:
      "Measures how much of your mental capacity is consumed by current demands. High cognitive load manifests as difficulty prioritizing, decision fatigue, reduced creative thinking, and trouble holding multiple threads simultaneously.",
    scale: "0–100",
    interpretation:
      "Lower scores indicate clear mental capacity. Higher scores suggest your thinking system is saturated — decisions feel harder than they should, and you may be defaulting to habits rather than choosing.",
  },
  {
    id: "relational_load",
    label: "Relational Load",
    shortDescription: "Energy consumed by interpersonal dynamics",
    longDescription:
      "Measures the energy you are expending to navigate relationships, manage expectations, and maintain social performance. This includes the cost of conflict avoidance, people-pleasing, and carrying relational responsibility asymmetrically.",
    scale: "0–100",
    interpretation:
      "Lower scores mean your relational exchanges are mostly reciprocal. Higher scores suggest you are spending disproportionate energy maintaining relationships — giving more than you receive.",
  },
];

export const DERIVED_INDEX_METRICS: MetricDefinition[] = [
  {
    id: "recovery_access",
    label: "Recovery Access",
    shortDescription: "Available energy for growth and rebuilding",
    longDescription:
      "Recovery Access measures how much energy your system has available to recover, rebuild, and do growth work. It is the inverse of total system load — when load is high, recovery access drops. This is not about willpower; it is about the physiological and psychological resources available to you right now.",
    scale: "0–100%",
    interpretation:
      "Above 60% means you have meaningful capacity for new challenges and skill-building. Between 30–60% suggests selective growth is possible but requires strategic energy management. Below 30% indicates your system needs stabilization before expansion.",
  },
  {
    id: "load_pressure",
    label: "Load Pressure",
    shortDescription: "Total weight across all dimensions",
    longDescription:
      "Load Pressure aggregates the weight your system is carrying across emotional, cognitive, and relational dimensions. It is not a deficit — it is a measure of demand. High load pressure in high-performers is common and often invisible because output remains high even as internal costs accumulate.",
    scale: "0–100%",
    interpretation:
      "Below 40% is sustainable. Between 40–70% is elevated — you can function but recovery is slower. Above 70% is a signal that your system is compensating and needs attention before expansion work begins.",
  },
  {
    id: "eer",
    label: "Energy Efficiency Ratio",
    shortDescription: "Capacity accessed relative to energy spent",
    longDescription:
      "The Energy Efficiency Ratio (EER) compares your total accessed capacity (Shine) against total eclipse load. Formula: (TotalShine + 5) / (TotalEclipse + 5). A ratio above 1.0 means you are accessing more than you are burning. Below 1.0 means eclipse load exceeds available capacity — your system is in deficit.",
    scale: "Ratio (typically 0.5–3.0)",
    interpretation:
      "Above 1.5 is healthy — you are leading from strength. Between 1.0–1.5 is functional but watch for drift. Below 1.0 indicates your system is depleting — stabilization is the priority before growth work.",
  },
  {
    id: "bri",
    label: "Burnout Risk Index",
    shortDescription: "Count of rays where eclipse exceeds capacity",
    longDescription:
      "The Burnout Risk Index (BRI) counts how many of your nine Rays have eclipse scores exceeding their capacity scores. Each ray in deficit is a signal that the demand on that capacity exceeds your current access to it. Three or more rays in deficit is an elevated risk signal.",
    scale: "0–9 (count of deficit rays)",
    interpretation:
      "0–2 is normal range — most people have some eclipse. 3–4 is elevated — multiple capacities are running on fumes. 5+ is high risk — your system is compensating broadly and recovery should be the priority.",
  },
  {
    id: "ppd",
    label: "Performance-Presence Delta",
    shortDescription: "Gap between visible output and internal resource",
    longDescription:
      "The Performance-Presence Delta (PPD) flags when your visible output Rays (Power, Purpose, Authenticity) score significantly higher than your grounding Rays (Joy, Presence, Connection). This pattern means you are performing well but your internal resource base is thinner than it appears. Research on compensatory effort shows this is the most common path to burnout in high-performers.",
    scale: "CLEAR / WATCH / FLAGGED",
    interpretation:
      "CLEAR means output and grounding are balanced. WATCH means a small gap is forming — monitor it. FLAGGED means the gap is significant — your performance is borrowing against recovery.",
  },
  {
    id: "gravitational_stability",
    label: "Gravitational Stability",
    shortDescription: "Your overall system stability across all nine Rays",
    longDescription:
      "Gravitational Stability is the composite measure of your entire leadership operating system — how stable, resourced, and balanced you are across all nine capacities. Like a star's gravitational field, your stability determines what you can sustain, what you attract, and how you respond under pressure. It is the average net energy across all Rays.",
    scale: "0–100",
    interpretation:
      "Above 70 indicates a well-resourced system. Between 50–70 is functional with specific areas to develop. Below 50 suggests significant eclipse is limiting access to your full capacity — targeted training will create the most improvement.",
  },
];

export const SYSTEM_METRICS: MetricDefinition[] = [
  {
    id: "confidence_band",
    label: "Confidence Band",
    shortDescription: "How much weight to place on these results",
    longDescription:
      "The Confidence Band reflects the overall quality and reliability of your assessment data. It is determined by response consistency, engagement patterns, completion rates, and validity checks. HIGH confidence means these results reflect you well. MODERATE means they are directional but some areas may need a second look. LOW means they should be treated as a starting point.",
    scale: "LOW / MODERATE / HIGH",
    interpretation:
      "HIGH: Trust the patterns fully. MODERATE: Trust the direction, hold specific numbers loosely. LOW: Use as orientation — consider retaking when you have more focused time.",
  },
  {
    id: "gating_mode",
    label: "Gating Mode",
    shortDescription: "What your system is ready for right now",
    longDescription:
      "The Gating Mode determines what kind of development work is appropriate for your current state. STABILIZE means your system needs recovery before expansion. BUILD RANGE means you have room to grow with intentional pacing. STRETCH means you are clear for progressive challenge work. The gate is set by your eclipse level, energy ratio, and burnout risk signals.",
    scale: "STABILIZE / BUILD RANGE / STRETCH",
    interpretation:
      "STABILIZE: Focus on foundation tools and micro-reps. BUILD RANGE: Consistent daily practice with moderate challenge. STRETCH: Push into new territory — your system can handle the load.",
  },
  {
    id: "net_energy",
    label: "Net Energy",
    shortDescription: "Effective capacity after eclipse adjustment",
    longDescription:
      "Net Energy is the adjusted score for each Ray after accounting for eclipse effects. It represents your actual accessible capacity — not just your potential, but what you can reliably draw on right now. It factors in both your baseline capacity (Shine) and the temporary coverage from stress patterns (Eclipse).",
    scale: "0–100",
    interpretation:
      "Above 65 means this Ray is well-resourced and accessible. Between 40–65 means it is functional but could benefit from intentional practice. Below 40 means this capacity is significantly eclipsed — your system may be compensating through other Rays.",
  },
  {
    id: "eclipse_modifier",
    label: "Eclipse Modifier",
    shortDescription: "How stress specifically affects each Ray",
    longDescription:
      "The Eclipse Modifier shows whether stress amplifies, mutes, or leaves a Ray unchanged. AMPLIFIED means under pressure this capacity becomes overactive or distorted — you lean on it too hard. MUTED means under pressure this capacity disappears — you lose access when you need it most. NONE means this Ray holds steady under stress.",
    scale: "AMPLIFIED / MUTED / NONE",
    interpretation:
      "AMPLIFIED Rays are doing extra work — they compensate for eclipsed areas but may become distorted. MUTED Rays need targeted micro-reps to rebuild access under pressure. NONE means this Ray is stable — good foundation.",
  },
];

export const ALL_METRICS = [
  ...RAY_METRICS,
  ...COMPOSITE_METRICS,
  ...ECLIPSE_DIMENSION_METRICS,
  ...DERIVED_INDEX_METRICS,
  ...SYSTEM_METRICS,
];

export function getMetricById(id: string): MetricDefinition | undefined {
  return ALL_METRICS.find((m) => m.id === id);
}

/** Return all metrics grouped by category for the glossary page. */
export function getMetricsByCategory(): Array<{
  category: string;
  metrics: MetricDefinition[];
}> {
  return [
    { category: "The 9 Rays", metrics: RAY_METRICS },
    { category: "Composite Metrics", metrics: COMPOSITE_METRICS },
    { category: "Eclipse Dimensions", metrics: ECLIPSE_DIMENSION_METRICS },
    { category: "Derived Indices", metrics: DERIVED_INDEX_METRICS },
    { category: "System Concepts", metrics: SYSTEM_METRICS },
  ];
}
