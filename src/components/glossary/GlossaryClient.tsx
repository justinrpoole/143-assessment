"use client";

import { useState, useMemo } from "react";
import { getMetricsByCategory, type MetricDefinition } from "@/lib/metrics/registry";

/* ── Framework terms not captured in the metric registry ── */

const FRAMEWORK_TERMS: Array<{ term: string; definition: string; category?: string }> = [
  // ── Core Concepts ──
  {
    term: "Ray",
    category: "Core Concepts",
    definition:
      "One of 9 trainable leadership capacities measured by the assessment. Rays are not personality traits — they are behavioral ranges that can be built through deliberate practice.",
  },
  {
    term: "Eclipse",
    category: "Core Concepts",
    definition:
      "A temporary state where sustained stress or compensating patterns cover a capacity. Eclipse does not mean absence — it means the capacity exists but is currently inaccessible. Every eclipse has a path out.",
  },
  {
    term: "143",
    category: "Core Concepts",
    definition:
      'The number of questions in the full assessment. Also a reference to "I Love You" (1 letter, 4 letters, 3 letters) — the foundational ethos of the leadership model.',
  },
  {
    term: "RAS (Reticular Activating System)",
    category: "Core Concepts",
    definition:
      "The neural filter that determines what you notice. REPs train your RAS to scan for capacity and possibility instead of threat and deficit. This is the neurological mechanism powering the 143 practice model. Based on Moruzzi & Magoun (1949).",
  },
  {
    term: "REP",
    category: "Core Concepts",
    definition:
      "Recognition + Encouragement toward Practice regardless of outcome. A REP is any moment where you notice a capacity in action (or its absence) and respond with practice instead of judgment.",
  },
  {
    term: "Be The Light Framework",
    category: "Core Concepts",
    definition:
      "The 3-phase methodology underlying the assessment. Phase 1 (Intention, Joy, Presence): Reconnect — Emotional intelligence with yourself. Phase 2 (Power, Purpose, Authenticity): Radiate — Alignment with purpose. Phase 3 (Connection, Possibility, Be The Light): Become — Emotional intelligence with others.",
  },
  // ── The 9 Rays ──
  {
    term: "Ray of Intention (R1)",
    category: "The 9 Rays",
    definition:
      "Deliberate direction-setting. The capacity to choose where attention goes before reactive patterns decide for you. Grounded in Gollwitzer's implementation intentions research — when you pre-decide your response, follow-through increases significantly.",
  },
  {
    term: "Ray of Joy (R2)",
    category: "The 9 Rays",
    definition:
      "Capacity for genuine positive emotion independent of external conditions. Not forced optimism — the ability to access micro-joy as fuel. Draws on Fredrickson's broaden-and-build theory: positive emotion expands attention and builds resilience.",
  },
  {
    term: "Ray of Presence (R3)",
    category: "The 9 Rays",
    definition:
      "Attentional stability and nervous system regulation. The ability to stay grounded when things move fast. Based on Jha's attention science — attention is depletable and trainable, like a muscle.",
  },
  {
    term: "Ray of Power (R4)",
    category: "The 9 Rays",
    definition:
      "Consistent action despite fear. Not the absence of fear — the trained relationship with it. Each time you act while fear is present, the fear signal weakens. Grounded in behavioral activation research (Martell et al.).",
  },
  {
    term: "Ray of Purpose (R5)",
    category: "The 9 Rays",
    definition:
      "Alignment between values and behavior. When your calendar matches what matters, effort becomes sustainable and decisions simplify. Linked to Deci & Ryan's self-determination theory — autonomy and purpose drive intrinsic motivation.",
  },
  {
    term: "Ray of Authenticity (R6)",
    category: "The 9 Rays",
    definition:
      "Congruence across contexts — being the same person in every room. Not unfiltered expression, but the capacity to show up without performing a version of yourself that costs energy to maintain.",
  },
  {
    term: "Ray of Connection (R7)",
    category: "The 9 Rays",
    definition:
      "Relational trust and empathy. The capacity to build genuine rapport and hold space for others. Linked to Edmondson's psychological safety research — trust enables both candor and learning.",
  },
  {
    term: "Ray of Possibility (R8)",
    category: "The 9 Rays",
    definition:
      "Openness to change and creative problem-solving. The ability to see doors where others see walls. Requires a regulated nervous system — threat narrows attention, safety expands it.",
  },
  {
    term: "Ray of Be The Light (R9)",
    category: "The 9 Rays",
    definition:
      "The capacity to hold space for others and lead from service. Not self-sacrifice — the overflow that happens when your own capacities are resourced. The highest developmental phase in the framework.",
  },
  // ── Scoring Terms ──
  {
    term: "Shine",
    category: "Scoring",
    definition:
      "Your baseline capacity accessed without stress — the default level of a Ray under normal conditions. Scored 0-100. High Shine means the Ray is naturally available to you.",
  },
  {
    term: "Access Score",
    category: "Scoring",
    definition:
      "Your capacity under pressure — how much of a Ray remains available when things are hard. Scored 0-100. The gap between Shine and Access reveals how stress affects each capacity.",
  },
  {
    term: "Eclipse Score",
    category: "Scoring",
    definition:
      "A measure of current system load or distortion on a specific Ray. Scored 0-100. High Eclipse does not mean deficit — it means the capacity is temporarily covered by stress or compensating patterns.",
  },
  {
    term: "Net Energy",
    category: "Scoring",
    definition:
      "A composite measure combining Shine and Eclipse: (Shine - Eclipse + 100) / 2. Scores above 50 indicate more capacity than load. Net Energy determines your top two Rays and your Rise Path.",
  },
  {
    term: "Confidence Band",
    category: "Scoring",
    definition:
      "HIGH, MODERATE, or LOW — a transparency signal indicating how much weight to place on your results. Calculated from response consistency, completion rate, timing, and reflection depth. Not a judgment — a data quality indicator.",
  },
  // ── Assessment Output ──
  {
    term: "Light Signature Archetype",
    category: "Assessment Output",
    definition:
      "The named pattern created by your top two Rays working together. Examples include Strategic Optimist (Intention + Joy), Decisive Director (Intention + Power), Relational Light (Connection + Be The Light), and Visionary Servant (Possibility + Be The Light). There are 36 possible archetypes.",
  },
  {
    term: "Eclipse Snapshot",
    category: "Assessment Output",
    definition:
      "A visual map of which capacities are currently eclipsed and by how much. Not a permanent diagnosis — a point-in-time photograph of your operating system under recent conditions.",
  },
  {
    term: "Rise Path",
    category: "Assessment Output",
    definition:
      "Your recommended development focus — the Ray with the highest growth potential right now. Determined by your bottom Ray's access score, tool readiness, and reflection depth. Includes a routing recommendation: Stretch, Standard, or Stabilize.",
  },
  {
    term: "Gravitational Stability Report",
    category: "Assessment Output",
    definition:
      "The full assessment output including your 9 Ray scores, Light Signature, Eclipse Snapshot, Energy Ratio, and Rise Path. Named for the gravitational stability of light — your leadership capacities are always present, sometimes just temporarily covered.",
  },
  {
    term: "Performance-Presence Delta (PPD)",
    category: "Assessment Output",
    definition:
      "A flag that detects when output Rays (Power, Purpose, Authenticity) score significantly higher than grounding Rays (Joy, Presence, Connection). Based on Hockey's compensatory effort research — visible performance can mask accumulating internal costs.",
  },
  // ── System Metrics ──
  {
    term: "Energy Efficiency Ratio (EER)",
    category: "System Metrics",
    definition:
      "A ratio measuring overall energy balance: (Total Shine + 5) / (Total Eclipse + 5). Values above 1.0 indicate positive energy flow — you are generating more capacity than you are spending. Below 1.0 means system load exceeds available capacity.",
  },
  {
    term: "Burnout Risk Index (BRI)",
    category: "System Metrics",
    definition:
      "A count of how many of your 9 Rays have Eclipse scores exceeding their Shine scores (0-9). Three or more Rays in deficit is an elevated risk signal. Based on Maslach's burnout research.",
  },
  {
    term: "Load Pressure (LSI)",
    category: "System Metrics",
    definition:
      "A measure of overall system load across all Eclipse dimensions, scaled 0-100. High load pressure reduces Recovery Access — the resources available for growth work.",
  },
  {
    term: "Recovery Access",
    category: "System Metrics",
    definition:
      "How much energy your system has available to recover, rebuild, and do growth work. The inverse of total system load. When load is high, recovery access drops. This is not about willpower — it is about available physiological and psychological resources.",
  },
  // ── Practice Terms ──
  {
    term: "Micro-Rep",
    category: "Practice",
    definition:
      "A 60-second or less practice that trains a specific capacity. Micro-reps are the building blocks of the coaching program — small, frequent, and designed to build neural pathways through repetition. Based on Fogg's Tiny Habits research.",
  },
  {
    term: "Presence Pause",
    category: "Practice",
    definition:
      "A micro-practice for the Ray of Presence. Feet on floor, one breath in, longer breath out, three things you can see, hear, or feel. Two minutes. The foundational reset tool.",
  },
  {
    term: "I Rise Protocol",
    category: "Practice",
    definition:
      "An interrupt-and-reframe tool based on affect labeling (Lieberman et al., 2007). Name the emotion, declare your intention, take the smallest action. Naming the emotion shifts processing from amygdala to prefrontal cortex.",
  },
  {
    term: "If/Then Plan",
    category: "Practice",
    definition:
      "A pre-decided response to a specific trigger: 'If [situation], then I will [action].' Based on Gollwitzer's implementation intentions research. Pre-loaded plans reduce decision fatigue and increase follow-through under stress.",
  },
  {
    term: "Compensating Strength",
    category: "Practice",
    definition:
      "A strong Ray that is doing extra work to cover for an eclipsed Ray. For example, high Ray of Power compensating for low Ray of Presence — you perform at work but come home empty.",
  },
  // ── Coaching System ──
  {
    term: "Gate Mode",
    category: "Coaching",
    definition:
      "The coaching intensity level assigned based on your current system state. STABILIZE: focus on recovery before growth work. BUILD RANGE: expand access in your development Ray. STRETCH: push capacity boundaries. The gate protects you from doing too much too fast.",
  },
  {
    term: "Move Score",
    category: "Coaching",
    definition:
      "A readiness indicator for your Rise Path Ray: 0.45 * Access + 0.35 * Tool Readiness + 0.20 * Reflection Depth. Higher Move Scores indicate readiness for stretch work; lower scores indicate stabilization is the priority.",
  },
];

function matchesSearch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function MetricCard({ metric }: { metric: MetricDefinition }) {
  return (
    <div
      id={`metric-${metric.id}`}
      className="glass-card scroll-mt-24 p-4"
    >
      <div className="flex items-baseline gap-2">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          {metric.label}
        </h3>
        <span className="ml-auto text-[10px]" style={{ color: 'var(--text-on-dark-muted)' }}>
          {metric.scale}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        {metric.longDescription}
      </p>
      <p className="mt-2 text-xs italic" style={{ color: 'var(--text-on-dark-muted)' }}>
        {metric.interpretation}
      </p>
    </div>
  );
}

function FrameworkCard({ term, definition }: { term: string; definition: string }) {
  return (
    <div
      id={`term-${term.replace(/\s+/g, "-").toLowerCase()}`}
      className="glass-card scroll-mt-24 p-4"
    >
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>{term}</h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
        {definition}
      </p>
    </div>
  );
}

export function GlossaryClient() {
  const [search, setSearch] = useState("");
  const categories = useMemo(() => getMetricsByCategory(), []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        metrics: cat.metrics.filter(
          (m) =>
            matchesSearch(m.label, search) ||
            matchesSearch(m.shortDescription, search) ||
            matchesSearch(m.longDescription, search) ||
            matchesSearch(m.id, search),
        ),
      }))
      .filter((cat) => cat.metrics.length > 0);
  }, [categories, search]);

  const frameworkCategories = useMemo(() => {
    const grouped = new Map<string, typeof FRAMEWORK_TERMS>();
    for (const entry of FRAMEWORK_TERMS) {
      const cat = entry.category ?? 'Framework Terms';
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(entry);
    }
    return Array.from(grouped.entries()).map(([category, terms]) => ({ category, terms }));
  }, []);

  const filteredFrameworkCategories = useMemo(() => {
    if (!search.trim()) return frameworkCategories;
    return frameworkCategories
      .map((cat) => ({
        ...cat,
        terms: cat.terms.filter(
          (entry) =>
            matchesSearch(entry.term, search) ||
            matchesSearch(entry.definition, search),
        ),
      }))
      .filter((cat) => cat.terms.length > 0);
  }, [frameworkCategories, search]);

  const totalResults =
    filteredCategories.reduce((sum, cat) => sum + cat.metrics.length, 0) +
    filteredFrameworkCategories.reduce((sum, cat) => sum + cat.terms.length, 0);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: 'var(--text-on-dark-muted)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search glossary terms"
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          style={{
            background: 'var(--surface-glass)',
            border: '1px solid var(--surface-border)',
            color: 'var(--text-on-dark)',
          }}
        />
        {search && (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
            {totalResults} result{totalResults !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Quick jump links */}
      {!search && (
        <nav className="flex flex-wrap gap-2" aria-label="Jump to section">
          {categories.map((cat) => (
            <a
              key={cat.category}
              href={`#section-${cat.category.replace(/\s+/g, "-").toLowerCase()}`}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: 'var(--surface-glass)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-on-dark-secondary)',
              }}
            >
              {cat.category}
            </a>
          ))}
          {frameworkCategories.map((fcat) => (
            <a
              key={fcat.category}
              href={`#section-${fcat.category.replace(/\s+/g, "-").toLowerCase()}`}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                background: 'var(--surface-glass)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-on-dark-secondary)',
              }}
            >
              {fcat.category}
            </a>
          ))}
        </nav>
      )}

      {/* Metric Categories */}
      {filteredCategories.map((cat) => (
        <section
          key={cat.category}
          id={`section-${cat.category.replace(/\s+/g, "-").toLowerCase()}`}
          className="scroll-mt-16"
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            {cat.category}
          </h2>
          <div className="space-y-3">
            {cat.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>
      ))}

      {/* Framework Terms — grouped by category */}
      {filteredFrameworkCategories.map((fcat) => (
        <section
          key={fcat.category}
          id={`section-${fcat.category.replace(/\s+/g, "-").toLowerCase()}`}
          className="scroll-mt-16"
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            {fcat.category}
          </h2>
          <div className="space-y-3">
            {fcat.terms.map((entry) => (
              <FrameworkCard
                key={entry.term}
                term={entry.term}
                definition={entry.definition}
              />
            ))}
          </div>
        </section>
      ))}

      {/* No results */}
      {search && totalResults === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
            No terms match &ldquo;{search}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-3 text-sm font-medium text-brand-gold underline underline-offset-2"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
