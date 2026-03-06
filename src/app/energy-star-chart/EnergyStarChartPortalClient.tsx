'use client';

/**
 * Portal Energy Star Chart — fetches real assessment data,
 * renders the full chart with rep logging and coaching tools.
 */

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  SAMPLE_RAYS,
  SAMPLE_ECLIPSE,
  SAMPLE_INDICES,
} from '@/components/cosmic/energy-star-chart-data';
import type { RayOutput, EclipseOutput, AssessmentIndices } from '@/lib/types';

const EnergyStarChart = dynamic(
  () => import('@/components/cosmic/EnergyStarChart'),
  { ssr: false }
);

interface PortalSummary {
  has_completed_run: boolean;
  last_run_id: string | null;
  reps_this_week: number;
  streak_days: number;
  eclipse_level: 'low' | 'medium' | 'high' | null;
}

export default function EnergyStarChartPortalClient() {
  const [rays, setRays] = useState<Record<string, RayOutput>>(SAMPLE_RAYS);
  const [eclipse, setEclipse] = useState<EclipseOutput>(SAMPLE_ECLIPSE);
  const [indices, setIndices] = useState<AssessmentIndices | undefined>(SAMPLE_INDICES);
  const [loading, setLoading] = useState(true);
  const [hasRun, setHasRun] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const summRes = await fetch('/api/portal/summary');
      if (!summRes.ok) return;
      const summary: PortalSummary = await summRes.json();
      setHasRun(summary.has_completed_run);

      if (summary.has_completed_run && summary.last_run_id) {
        const runRes = await fetch(`/api/runs/${summary.last_run_id}/results`);
        if (runRes.ok) {
          const data = await runRes.json();
          const payload = data.results_payload;

          // Extract full ray data from results_payload if available
          if (payload?.rays && typeof payload.rays === 'object') {
            setRays(payload.rays as Record<string, RayOutput>);
          } else if (data.ray_scores) {
            // Fallback: build minimal RayOutput from ray_scores
            const built: Record<string, RayOutput> = {};
            for (const [id, score] of Object.entries(data.ray_scores as Record<string, number>)) {
              built[id] = {
                ray_id: id,
                ray_name: SAMPLE_RAYS[id]?.ray_name ?? id,
                score: score as number,
                net_energy: score as number,
                access_score: score as number,
                eclipse_score: 100 - (score as number),
                eclipse_modifier: 'NONE',
                subfacets: SAMPLE_RAYS[id]?.subfacets ?? {},
              };
            }
            setRays(built);
          }

          // Eclipse data
          if (payload?.eclipse) {
            setEclipse(payload.eclipse as EclipseOutput);
          }

          // Indices
          if (payload?.indices) {
            setIndices(payload.indices as AssessmentIndices);
          }
        }
      }
    } catch (err) {
      console.error('[energy-star-chart] fetch error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 16,
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(242,210,73,0.2)',
          borderTopColor: '#F2D249',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: 11,
          letterSpacing: '0.15em',
          color: 'rgba(242,210,73,0.6)',
          textTransform: 'uppercase',
        }}>
          Initializing Star Chart...
        </p>
      </div>
    );
  }

  return (
    <div>
      <EnergyStarChart
        mode="full"
        rays={rays}
        eclipse={eclipse}
        indices={indices}
        overallScore={rays.R9?.score}
      />

      {/* Coaching tools below the chart */}
      <div style={{
        maxWidth: 600,
        margin: '32px auto 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Rep logging */}
        <a
          href="/portal#log-rep"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            fontFamily: 'Orbitron, monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#0D0520',
            background: 'linear-gradient(135deg, #F2D249 0%, #FFA500 100%)',
            borderRadius: 10,
            textDecoration: 'none',
            boxShadow: '0 0 12px rgba(242,210,73,0.4), 0 0 24px rgba(242,210,73,0.2)',
          }}
        >
          Log a Rep
        </a>

        {/* Watch Me */}
        <a
          href="/portal#watch-me"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            fontFamily: 'Orbitron, monospace',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#F2D249',
            background: 'rgba(242,210,73,0.08)',
            border: '1px solid rgba(242,210,73,0.3)',
            borderRadius: 10,
            textDecoration: 'none',
          }}
        >
          Watch Me — Coaching
        </a>

        {!hasRun && (
          <p style={{
            textAlign: 'center',
            fontFamily: 'Orbitron, monospace',
            fontSize: 10,
            color: 'rgba(242,210,73,0.4)',
            letterSpacing: '0.1em',
          }}>
            Showing sample data. Take the assessment to see your real chart.
          </p>
        )}
      </div>
    </div>
  );
}
