'use client';

import type { RecommendationsOutput } from '@/lib/types';
import ThirtyDayCalendar from './ThirtyDayCalendar';

interface Props {
  recommendations: RecommendationsOutput;
  whatNotToDo: string[];
  /** Bottom ray name for calendar training label */
  rayName?: string;
  /** Run ID for calendar persistence */
  runId?: string;
}

export default function ThirtyDayPlan({ recommendations, whatNotToDo, rayName, runId }: Props) {
  const plan = recommendations.thirty_day_plan;
  const focus = recommendations.weekly_focus;

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>Your 30-Day Path</h3>
      <p className="text-sm" style={{ color: 'var(--text-on-dark-secondary)' }}>
        Install the tools, then build. Consistency beats intensity.
      </p>

      <div className="glass-card p-6 space-y-5">
        {/* Weekly Focus */}
        {focus.focus_rep && (
          <div className="border-l-4 border-[#F8D011] pl-4">
            <p className="text-xs text-[#F8D011] uppercase tracking-wide mb-1">Weekly Focus</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>{focus.focus_rep}</p>
            {focus.minimum_effective_dose && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-on-dark-muted)' }}>
                Minimum effective dose: {focus.minimum_effective_dose}
              </p>
            )}
          </div>
        )}

        {/* 30-Day Calendar Tracker */}
        {plan && (
          <ThirtyDayCalendar
            week1={plan.week_1}
            weeks24={plan.weeks_2_4}
            rayName={rayName}
            runId={runId}
          />
        )}

        {/* What Not To Do Yet */}
        {whatNotToDo.length > 0 && (
          <div className="border-t pt-4" style={{ borderColor: 'var(--surface-border)' }}>
            <p className="text-xs uppercase tracking-wide mb-2 font-medium" style={{ color: 'var(--text-on-dark-muted)' }}>
              What Not To Do Yet
            </p>
            <ul className="space-y-1.5">
              {whatNotToDo.map((item, i) => (
                <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  <span className="text-red-400">&#10005;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
