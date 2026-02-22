'use client';

import type { RecommendationsOutput } from '@/lib/types';

interface Props {
  recommendations: RecommendationsOutput;
}

export default function ToolReadiness({ recommendations }: Props) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Your Starter Tools</h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        {recommendations.priority_mode === 'TOOLS_FIRST'
          ? 'Start here. Stabilize before you stretch. Research on skill acquisition under load (Kahneman, 2011) shows that simpler tools practiced consistently outperform complex interventions attempted under pressure.'
          : 'These tools match where you are right now. Each one is designed to move the needle on a specific ray — not through effort, but through repetition.'}
      </p>

      <div className="space-y-4">
        {recommendations.tools.map((tool) => (
          <div key={tool.tool_id} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold" style={{ color: 'var(--text-on-dark)' }}>{tool.label}</h4>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--surface-glass)', color: 'var(--text-on-dark-secondary)' }}
              >
                ~{tool.time_cost_minutes} min
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-on-dark-secondary)' }}>{tool.why_now}</p>
            <ol className="space-y-1.5">
              {tool.steps.map((step, j) => (
                <li key={j} className="text-sm flex gap-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  <span className="font-bold text-xs mt-0.5" style={{ color: 'var(--brand-gold)' }}>{j + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
