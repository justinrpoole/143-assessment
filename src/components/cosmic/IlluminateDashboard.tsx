'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import IlluminateBoard from '@/components/cosmic/IlluminateBoard';
import { rayHex } from '@/lib/ui/ray-colors';
import { RAY_SHORT_NAMES } from '@/lib/types';

const RAY_KEYS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'] as const;

type DashboardPhase = 'ECLIPSE' | 'DAWN' | 'RADIANT';

interface Props {
  scores?: Partial<Record<string, number>>;
  eclipseLevel?: number;
  phase?: DashboardPhase;
  repsToday?: number;
  insight?: string;
  className?: string;
  onWatchMe?: () => void;
  onGoFirst?: () => void;
  onLogRep?: () => void;
}

function clampScore(value: number | undefined): number {
  return Math.max(0, Math.min(100, Number(value ?? 0)));
}

function normalizeScores(scores: Partial<Record<string, number>>): Record<string, number> {
  return RAY_KEYS.reduce<Record<string, number>>((acc, key) => {
    acc[key] = clampScore(scores[key]);
    return acc;
  }, {});
}

export default function IlluminateDashboard({
  scores = {},
  eclipseLevel = 0,
  phase = 'ECLIPSE',
  repsToday = 0,
  insight,
  className,
  onWatchMe,
  onGoFirst,
  onLogRep,
}: Props) {
  const [localScores, setLocalScores] = useState<Record<string, number>>(() => normalizeScores(scores));
  const [reps, setReps] = useState(repsToday);

  useEffect(() => {
    setLocalScores(normalizeScores(scores));
  }, [scores]);

  useEffect(() => {
    setReps(repsToday);
  }, [repsToday]);

  const avgRadiance = useMemo(() => {
    const values = RAY_KEYS.map((key) => localScores[key] ?? 0);
    return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
  }, [localScores]);

  const computedPhase: DashboardPhase = useMemo(() => {
    if (avgRadiance >= 70) return 'RADIANT';
    if (avgRadiance >= 45) return 'DAWN';
    return 'ECLIPSE';
  }, [avgRadiance]);

  const resolvedPhase = phase ?? computedPhase;
  const coreScore = localScores.R9 ?? 0;
  const moonToSunPct = `${Math.round(coreScore)}%`;
  const phaseAccent =
    resolvedPhase === 'RADIANT'
      ? 'var(--neon-yellow)'
      : resolvedPhase === 'DAWN'
        ? 'var(--neon-orange)'
        : 'var(--neon-pink)';

  const dashboardInsight =
    insight ??
    (resolvedPhase === 'RADIANT'
      ? 'All eight rays are feeding the ninth. Keep your reps clean and consistent.'
      : resolvedPhase === 'DAWN'
        ? 'The eclipse is lifting. One focused rep in your lowest ray moves the whole system.'
        : 'Moon to eclipse is active. Rebuild the eight rays first, then the ninth fully illuminates.');

  function handleSlider(rayId: string, value: number) {
    setLocalScores((prev) => ({ ...prev, [rayId]: clampScore(value) }));
  }

  function handleRepLog() {
    setReps((prev) => prev + 1);
    onLogRep?.();
  }

  return (
    <section className={`glass-card p-4 sm:p-6 space-y-6 ${className ?? ''}`} style={{ '--accent': 'var(--neon-cyan)' } as CSSProperties}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="pill" style={{ '--accent': 'var(--neon-yellow)' } as CSSProperties}>
            <span className="dot" /> Illuminate Console
          </p>
          <h2 className="text-2xl font-bold text-header">Light Dashboard</h2>
          <p className="text-sm text-body">
            8 rays build capacity. The 9th ray illuminates when the base is stable.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="glass-card--noGlow rounded-xl px-3 py-2">
            <p className="text-[10px] text-secondary">Radiance</p>
            <p className="text-lg font-semibold text-header">{avgRadiance}%</p>
          </div>
          <div className="glass-card--noGlow rounded-xl px-3 py-2">
            <p className="text-[10px] text-secondary">Eclipse</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--neon-pink)' }}>{Math.round(eclipseLevel)}%</p>
          </div>
          <div className="glass-card--noGlow rounded-xl px-3 py-2">
            <p className="text-[10px] text-secondary">Reps</p>
            <p className="text-lg font-semibold text-body">{reps}</p>
          </div>
        </div>
      </header>

      <div className="glass-card--noGlow rounded-2xl p-4">
        <div className="mb-2 flex items-center justify-between text-[11px] tracking-[0.08em] text-secondary">
          <span>Moon</span>
          <span style={{ color: phaseAccent }}>{resolvedPhase}</span>
          <span>Sun</span>
        </div>
        <div className="flex items-center gap-3">
          <Image src="/images/purple-moon-143.svg" alt="Moon" width={24} height={24} className="icon-moon" />
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-black/35">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: moonToSunPct,
                background:
                  'linear-gradient(90deg, color-mix(in srgb, var(--neon-purple) 80%, transparent), color-mix(in srgb, var(--neon-pink) 85%, transparent), color-mix(in srgb, var(--neon-yellow) 85%, transparent))',
                boxShadow: '0 0 18px color-mix(in srgb, var(--neon-pink) 28%, transparent)',
              }}
            />
          </div>
          <Image src="/images/sun-143.svg" alt="Sun" width={24} height={24} className="icon-sun" />
        </div>
        <p className="mt-2 text-xs text-secondary">Moon → Eclipse → Sun transition tracks R9 capacity ({moonToSunPct}).</p>
      </div>

      <IlluminateBoard title="ILLUMINATE COMMAND BOARD" rayScores={localScores} />

      <section className="glass-card--noGlow rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-header">Capacity Sliders (9 Rays)</h3>
          <span className="text-[11px] text-secondary">Bottom console controls</span>
        </div>
        <div className="space-y-3">
          {RAY_KEYS.map((rayId) => {
            const accent = rayHex(rayId);
            const value = localScores[rayId] ?? 0;
            return (
              <label key={rayId} className="block">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span style={{ color: accent }}>{(RAY_SHORT_NAMES[rayId] ?? rayId).toUpperCase()}</span>
                  <span className="text-body">{Math.round(value)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(event) => handleSlider(rayId, Number(event.target.value))}
                  className="w-full"
                  style={{ accentColor: accent }}
                  aria-label={`${rayId} capacity slider`}
                />
              </label>
            );
          })}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" className="cta" onClick={onWatchMe}>Watch Me</button>
        <button type="button" className="cta" onClick={onGoFirst}>Go First</button>
        <button type="button" className="cta" onClick={handleRepLog}>Log Rep</button>
      </div>

      <div className="glass-card--noGlow rounded-2xl p-4">
        <p className="text-xs text-secondary">Illuminate intent</p>
        <p className="mt-1 text-sm text-body">{dashboardInsight}</p>
      </div>
    </section>
  );
}
