'use client';

import { useRef, useCallback } from 'react';
import type {
  AssessmentOutputV1,
  RayOutput,
  ExecutiveSignal,
} from '@/lib/types';
import { RAY_SHORT_NAMES } from '@/lib/types';

interface CoachingBriefProps {
  output: AssessmentOutputV1;
  runId: string;
}

/** Level → display label and color */
const LEVEL_CONFIG = {
  HIGH: { label: 'Strong', color: '#34D399' },
  ELEVATED: { label: 'Building', color: '#F8D011' },
  MODERATE: { label: 'Emerging', color: '#FB923C' },
  LOW: { label: 'Training Edge', color: '#F87171' },
} as const;

/** Sort rays by score descending, return [rayId, RayOutput][] */
function sortedRays(rays: Record<string, RayOutput>): [string, RayOutput][] {
  return Object.entries(rays).sort(([, a], [, b]) => b.score - a.score);
}

/** Get top N executive signals by priority (LOW first = most attention needed) */
function prioritySignals(signals: ExecutiveSignal[], n: number): ExecutiveSignal[] {
  const order = { LOW: 0, MODERATE: 1, ELEVATED: 2, HIGH: 3 };
  return [...signals]
    .sort((a, b) => order[a.level] - order[b.level])
    .slice(0, n);
}

/**
 * Coaching Brief Auto-Generator
 *
 * Generates a printable 1-page coaching summary from assessment data.
 * Includes: light signature, ray scores, eclipse status, priority signals,
 * recommended tools, and coaching questions. Designed for coaches to use
 * in preparation for sessions.
 */
export default function CoachingBrief({ output, runId }: CoachingBriefProps) {
  const briefRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    if (!briefRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = briefRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Coaching Brief — ${output.light_signature?.archetype?.name ?? 'Assessment'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; padding: 24px; max-width: 800px; margin: 0 auto; }
          .brief-header { border-bottom: 2px solid #60058D; padding-bottom: 12px; margin-bottom: 16px; }
          .brief-header h1 { font-size: 20px; color: #60058D; }
          .brief-header p { font-size: 11px; color: #666; margin-top: 4px; }
          .section { margin-bottom: 16px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #60058D; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
          .kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
          .kv { font-size: 12px; }
          .kv .label { color: #888; font-size: 10px; }
          .kv .value { font-weight: 600; }
          .ray-bar { display: flex; align-items: center; gap: 8px; font-size: 11px; margin-bottom: 3px; }
          .ray-bar .name { width: 80px; text-align: right; }
          .ray-bar .bar { height: 8px; border-radius: 4px; }
          .ray-bar .score { width: 30px; font-weight: 600; }
          .signal-row { display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding: 3px 0; border-bottom: 1px solid #f5f5f5; }
          .signal-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
          .tool-item { font-size: 11px; margin-bottom: 4px; }
          .tool-item .why { color: #666; font-size: 10px; }
          .q-item { font-size: 11px; margin-bottom: 6px; padding-left: 12px; border-left: 2px solid #F8D011; }
          .footer { margin-top: 20px; border-top: 1px solid #eee; padding-top: 8px; font-size: 9px; color: #aaa; text-align: center; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 300);
  }, [output.light_signature?.archetype?.name]);

  const rays = output.rays;
  const sorted = sortedRays(rays);
  const lightSig = output.light_signature;
  const eclipse = output.eclipse;
  const execSignals = output.executive_output?.signals ?? [];
  const topSignals = prioritySignals(execSignals, 6);
  const tools = output.recommendations?.tools?.slice(0, 3) ?? [];
  const coachingQs = output.recommendations?.coaching_questions?.slice(0, 3) ?? [];
  const justIn = lightSig?.just_in_ray;
  const overallAvg = Math.round(
    Object.values(rays).reduce((sum, r) => sum + r.score, 0) / Math.max(Object.keys(rays).length, 1)
  );

  const eclipseLevelMap: Record<string, string> = {
    LOW: 'Low — system operating with capacity',
    MODERATE: 'Moderate — some load present',
    ELEVATED: 'Elevated — significant system load',
    HIGH: 'High — system under substantial pressure',
  };

  return (
    <section className="space-y-4">
      {/* Generate button */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-gold, #F8D011)' }}
            >
              For Coaches
            </p>
            <h3
              className="mt-1 text-base font-semibold"
              style={{ color: 'var(--text-on-dark)' }}
            >
              Coaching Brief
            </h3>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              One-page summary for session preparation. Print or save as PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="btn-primary shrink-0 text-sm px-4 py-2"
          >
            Print Brief
          </button>
        </div>
      </div>

      {/* Preview card */}
      <div
        className="glass-card p-5 sm:p-6 space-y-5"
        style={{ fontSize: '13px' }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Brief Preview
        </p>

        {/* Archetype + key stats */}
        <div
          className="rounded-lg p-4"
          style={{
            background: 'rgba(96, 5, 141, 0.15)',
            border: '1px solid rgba(148, 80, 200, 0.2)',
          }}
        >
          <p
            className="text-lg font-bold"
            style={{ color: 'var(--text-on-dark)' }}
          >
            {lightSig?.archetype?.name ?? 'Light Signature'}
          </p>
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--text-on-dark-secondary)' }}
          >
            {lightSig?.archetype?.essence ?? ''}
          </p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--brand-gold)' }}>
                {overallAvg}
              </p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>
                Overall
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--brand-gold)' }}>
                {eclipse?.level ?? '—'}
              </p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>
                Eclipse
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--brand-gold)' }}>
                {output.data_quality?.confidence_band ?? '—'}
              </p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-on-dark-muted)' }}>
                Confidence
              </p>
            </div>
          </div>
        </div>

        {/* Ray scores */}
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--brand-gold)' }}
          >
            Ray Scores
          </p>
          <div className="space-y-1.5">
            {sorted.map(([rayId, ray]) => {
              const isTop = lightSig?.top_two?.some((t) => t.ray_id === rayId);
              const isBottom = justIn?.ray_id === rayId;
              return (
                <div key={rayId} className="flex items-center gap-2">
                  <span
                    className="text-xs w-20 text-right shrink-0"
                    style={{ color: 'var(--text-on-dark-secondary)' }}
                  >
                    {RAY_SHORT_NAMES[rayId] ?? rayId}
                    {isTop ? ' ★' : isBottom ? ' ↑' : ''}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(148, 80, 200, 0.15)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${ray.score}%`,
                        background: isTop
                          ? 'linear-gradient(90deg, #F8D011, #FFE066)'
                          : isBottom
                            ? 'linear-gradient(90deg, #A78BFA, #C4B5FD)'
                            : 'linear-gradient(90deg, #60058D, #9450C8)',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs w-8 font-semibold"
                    style={{ color: 'var(--text-on-dark)' }}
                  >
                    {ray.score}
                  </span>
                </div>
              );
            })}
          </div>
          <p
            className="text-[9px] mt-2"
            style={{ color: 'var(--text-on-dark-muted)' }}
          >
            ★ Power Source &nbsp;&nbsp; ↑ Rise Path (training focus)
          </p>
        </div>

        {/* Priority signals */}
        {topSignals.length > 0 && (
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: 'var(--brand-gold)' }}
            >
              Priority Signals
            </p>
            <div className="space-y-1">
              {topSignals.map((sig) => {
                const cfg = LEVEL_CONFIG[sig.level];
                return (
                  <div
                    key={sig.signal_id}
                    className="flex items-center justify-between gap-2 py-1 border-b"
                    style={{ borderColor: 'rgba(148, 80, 200, 0.1)' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: cfg.color }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: 'var(--text-on-dark)' }}
                      >
                        {sig.label}
                      </span>
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: `${cfg.color}20`, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommended tools */}
        {tools.length > 0 && (
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: 'var(--brand-gold)' }}
            >
              Start Here (Tools)
            </p>
            {tools.map((tool, i) => (
              <div
                key={tool.tool_id}
                className="mb-2 pb-2 border-b"
                style={{ borderColor: 'rgba(148, 80, 200, 0.08)' }}
              >
                <p
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-on-dark)' }}
                >
                  {i + 1}. {tool.label}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: 'var(--text-on-dark-secondary)' }}
                >
                  {tool.why_now}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Coaching questions */}
        {coachingQs.length > 0 && (
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: 'var(--brand-gold)' }}
            >
              Session Starters
            </p>
            {coachingQs.map((q, i) => (
              <p
                key={i}
                className="text-xs mb-2 pl-3 leading-relaxed"
                style={{
                  color: 'var(--text-on-dark-secondary)',
                  borderLeft: '2px solid var(--brand-gold, #F8D011)',
                }}
              >
                {q}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Hidden printable brief (used by handlePrint) */}
      <div ref={briefRef} style={{ display: 'none' }}>
        <div className="brief-header">
          <h1>Coaching Brief — {lightSig?.archetype?.name ?? 'Assessment Results'}</h1>
          <p>
            Run ID: {runId} &nbsp;|&nbsp; Date: {output.assessment_run?.created_at
              ? new Date(output.assessment_run.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            } &nbsp;|&nbsp;
            Tier: {output.assessment_run?.tier ?? 'FULL_143'} &nbsp;|&nbsp;
            Confidence: {output.data_quality?.confidence_band ?? 'MODERATE'}
          </p>
        </div>

        {/* Light Signature */}
        <div className="section">
          <div className="section-title">Light Signature</div>
          <div className="kv-grid">
            <div className="kv">
              <div className="label">Archetype</div>
              <div className="value">{lightSig?.archetype?.name ?? '—'}</div>
            </div>
            <div className="kv">
              <div className="label">Essence</div>
              <div className="value">{lightSig?.archetype?.essence ?? '—'}</div>
            </div>
            <div className="kv">
              <div className="label">Power Sources</div>
              <div className="value">{lightSig?.top_two?.map((t) => t.ray_name).join(' + ') ?? '—'}</div>
            </div>
            <div className="kv">
              <div className="label">Rise Path</div>
              <div className="value">{justIn?.ray_name ?? '—'}</div>
            </div>
            <div className="kv">
              <div className="label">Eclipse Level</div>
              <div className="value">{eclipseLevelMap[eclipse?.level ?? 'LOW'] ?? '—'}</div>
            </div>
            <div className="kv">
              <div className="label">Overall Average</div>
              <div className="value">{overallAvg}/100</div>
            </div>
          </div>
        </div>

        {/* Ray Scores */}
        <div className="section">
          <div className="section-title">Ray Scores</div>
          {sorted.map(([rayId, ray]) => {
            const isTop = lightSig?.top_two?.some((t) => t.ray_id === rayId);
            const isBottom = justIn?.ray_id === rayId;
            const barColor = isTop ? '#F8D011' : isBottom ? '#A78BFA' : '#60058D';
            return (
              <div key={rayId} className="ray-bar">
                <span className="name">
                  {RAY_SHORT_NAMES[rayId] ?? rayId}
                  {isTop ? ' ★' : isBottom ? ' ↑' : ''}
                </span>
                <span className="bar" style={{ width: `${Math.max(ray.score * 3, 6)}px`, background: barColor }} />
                <span className="score">{ray.score}</span>
              </div>
            );
          })}
        </div>

        {/* Priority Signals */}
        {topSignals.length > 0 && (
          <div className="section">
            <div className="section-title">Priority Executive Signals</div>
            {topSignals.map((sig) => {
              const cfg = LEVEL_CONFIG[sig.level];
              return (
                <div key={sig.signal_id} className="signal-row">
                  <span>
                    <span className="signal-dot" style={{ background: cfg.color }} />
                    {sig.label}
                  </span>
                  <span style={{ color: cfg.color, fontWeight: 600, fontSize: '10px' }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div className="section">
            <div className="section-title">Recommended Tools</div>
            {tools.map((tool, i) => (
              <div key={tool.tool_id} className="tool-item">
                <strong>{i + 1}. {tool.label}</strong>
                <div className="why">{tool.why_now}</div>
              </div>
            ))}
          </div>
        )}

        {/* Coaching Questions */}
        {coachingQs.length > 0 && (
          <div className="section">
            <div className="section-title">Session Starters</div>
            {coachingQs.map((q, i) => (
              <div key={i} className="q-item">{q}</div>
            ))}
          </div>
        )}

        {/* Rise Path Detail */}
        {justIn && (
          <div className="section">
            <div className="section-title">Rise Path Focus</div>
            <div className="kv-grid">
              <div className="kv">
                <div className="label">Training Target</div>
                <div className="value">{justIn.ray_name}</div>
              </div>
              <div className="kv">
                <div className="label">Why This Is Next</div>
                <div className="value" style={{ fontSize: '10px' }}>{justIn.why_this_is_next ?? '—'}</div>
              </div>
              <div className="kv">
                <div className="label">Work Rep</div>
                <div className="value" style={{ fontSize: '10px' }}>{justIn.work_rep ?? '—'}</div>
              </div>
              <div className="kv">
                <div className="label">Life Rep</div>
                <div className="value" style={{ fontSize: '10px' }}>{justIn.life_rep ?? '—'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="footer">
          143 Leadership Assessment &nbsp;|&nbsp; Confidential Coaching Document &nbsp;|&nbsp; 143leadership.com
        </div>
      </div>
    </section>
  );
}
