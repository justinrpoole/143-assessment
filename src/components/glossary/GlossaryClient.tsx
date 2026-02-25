"use client";

import { useState, useMemo } from "react";
import { getMetricsByCategory, type MetricDefinition } from "@/lib/metrics/registry";

/* ── Framework terms not captured in the metric registry ── */

const FRAMEWORK_TERMS: Array<{ term: string; definition: string }> = [
  {
    term: "Ray",
    definition:
      "One of 9 trainable leadership capacities measured by the assessment. Rays are not personality traits — they are behavioral ranges that can be built through deliberate practice.",
  },
  {
    term: "Eclipse",
    definition:
      "A temporary state where sustained stress or compensating patterns cover a capacity. Eclipse does not mean absence — it means the capacity exists but is currently inaccessible. Every eclipse has a path out.",
  },
  {
    term: "Light Signature Archetype",
    definition:
      "The named pattern created by your top two Rays working together. Examples include Strategic Optimist (Intention + Joy), Decisive Director (Intention + Power), Relational Light (Connection + Be The Light), and Visionary Servant (Possibility + Be The Light). There are 36 possible archetypes.",
  },
  {
    term: "Eclipse Snapshot",
    definition:
      "A visual map of which capacities are currently eclipsed and by how much. Not a permanent diagnosis — a point-in-time photograph of your operating system under recent conditions.",
  },
  {
    term: "REP",
    definition:
      "Recognition + Encouragement toward Practice regardless of outcome. A REP is any moment where you notice a capacity in action (or its absence) and respond with practice instead of judgment.",
  },
  {
    term: "RAS (Reticular Activating System)",
    definition:
      "The neural filter that determines what you notice. REPs train your RAS to scan for capacity and possibility instead of threat and deficit. This is the neurological mechanism behind the 143 practice model.",
  },
  {
    term: "Gravitational Stability Report",
    definition:
      "The full assessment output including your 9 Ray scores, Light Signature, Eclipse Snapshot, Energy Ratio, and Rise Path. Named for the gravitational stability of light — your leadership capacities are always present, sometimes just temporarily covered.",
  },
  {
    term: "Be The Light Framework",
    definition:
      "The 3-phase methodology underlying the assessment. Phase 1 (Intention, Joy, Presence): Reconnect — Emotional intelligence with yourself. Phase 2 (Power, Purpose, Authenticity): Radiate — Alignment with purpose. Phase 3 (Connection, Possibility, Be The Light): Become — Emotional intelligence with others.",
  },
  {
    term: "Presence Pause",
    definition:
      "A micro-practice for the Ray of Presence. Feet on floor, one breath in, longer breath out, three things you can see, hear, or feel. Two minutes. The foundational reset tool.",
  },
  {
    term: "Compensating Strength",
    definition:
      "A strong Ray that is doing extra work to cover for an eclipsed Ray. For example, high Ray of Power compensating for low Ray of Presence — you perform at work but come home empty.",
  },
  {
    term: "143",
    definition:
      'The number of questions in the full assessment. Also a reference to "I Love You" (1 letter, 4 letters, 3 letters) — the foundational ethos of the leadership model.',
  },
  {
    term: "Shine",
    definition:
      "Your baseline capacity accessed without stress — the default level of a Ray under normal conditions. High Shine means the Ray is naturally available to you.",
  },
  {
    term: "Access Score",
    definition:
      "Your capacity under pressure — how much of a Ray remains available when things are hard. The gap between Shine and Access reveals how stress affects each capacity.",
  },
  {
    term: "Micro-Rep",
    definition:
      "A 60-second or less practice that trains a specific capacity. Micro-reps are the building blocks of the coaching program — small, frequent, and designed to build neural pathways through repetition.",
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

  const filteredFramework = useMemo(() => {
    if (!search.trim()) return FRAMEWORK_TERMS;
    return FRAMEWORK_TERMS.filter(
      (entry) =>
        matchesSearch(entry.term, search) ||
        matchesSearch(entry.definition, search),
    );
  }, [search]);

  const totalResults =
    filteredCategories.reduce((sum, cat) => sum + cat.metrics.length, 0) +
    filteredFramework.length;

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
          <a
            href="#section-framework-terms"
            className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--surface-border)',
              color: 'var(--text-on-dark-secondary)',
            }}
          >
            Framework Terms
          </a>
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

      {/* Framework Terms */}
      {filteredFramework.length > 0 && (
        <section id="section-framework-terms" className="scroll-mt-16">
          <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
            Framework Terms
          </h2>
          <div className="space-y-3">
            {filteredFramework.map((entry) => (
              <FrameworkCard
                key={entry.term}
                term={entry.term}
                definition={entry.definition}
              />
            ))}
          </div>
        </section>
      )}

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
