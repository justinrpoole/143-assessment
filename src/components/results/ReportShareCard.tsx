'use client';

import { useState, useRef } from 'react';
import type { LightSignatureOutput, EclipseOutput } from '@/lib/types';
import { RAY_SHORT_NAMES } from '@/lib/types';

interface Props {
  lightSignature: LightSignatureOutput;
  eclipse?: EclipseOutput;
  overallScore: number;
}

/**
 * Shareable Light Signature card with copy-to-clipboard and native share.
 * Renders a cosmic-themed card that summarizes the user's archetype + top rays.
 */
export default function ReportShareCard({ lightSignature, eclipse, overallScore }: Props) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const archetype = lightSignature.archetype;
  const topTwo = lightSignature.top_two ?? [];
  const justInRay = lightSignature.just_in_ray;

  const shareText = [
    `My Light Signature: ${archetype?.name ?? 'The Lightkeeper'}`,
    `Top rays: ${topTwo.map((r) => RAY_SHORT_NAMES[r.ray_id] ?? r.ray_name).join(' + ')}`,
    justInRay ? `Training: ${RAY_SHORT_NAMES[justInRay.ray_id] ?? justInRay.ray_name}` : '',
    `Overall: ${Math.round(overallScore)}%`,
    eclipse ? `Eclipse: ${eclipse.level}` : '',
    '',
    'Discover your leadership light at 143leadership.com',
  ].filter(Boolean).join('\n');

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Light Signature: ${archetype?.name ?? '143 Leadership'}`,
          text: shareText,
          url: 'https://143leadership.com',
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await copyToClipboard();
    }
  }

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        Share Your Light Signature
      </h3>

      {/* Visual card */}
      <div
        ref={cardRef}
        className="panel-gradient-deep card-border-default border rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="border-bottom-surface px-6 py-5 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--brand-gold)' }}>
            143 Leadership &middot; Light Signature
          </p>
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-body)' }}>
            {archetype?.name ?? 'The Lightkeeper'}
          </h3>
          {archetype?.essence && (
            <p className="text-xs mt-1 max-w-xs mx-auto" style={{ color: 'color-mix(in srgb, var(--text-body) 60%, transparent)' }}>
              {archetype.essence}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="surface-violet-tint grid grid-cols-3 text-center py-4 px-4">
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--brand-gold)' }}>{Math.round(overallScore)}%</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--text-body) 40%, transparent)' }}>Overall</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--neon-teal)' }}>
              {topTwo.length > 0 ? RAY_SHORT_NAMES[topTwo[0].ray_id] ?? topTwo[0].ray_name : '—'}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--text-body) 40%, transparent)' }}>Top Ray</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: eclipse?.level === 'HIGH' ? 'var(--ray-power)' : eclipse?.level === 'ELEVATED' ? 'var(--neon-amber)' : 'var(--neon-teal)' }}>
              {eclipse?.level ?? '—'}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'color-mix(in srgb, var(--text-body) 40%, transparent)' }}>Eclipse</p>
          </div>
        </div>

        {/* Ray chips */}
        <div className="px-4 py-3 flex flex-wrap justify-center gap-2">
          {topTwo.map((ray) => (
            <span
              key={ray.ray_id}
              className="chip-surface-gold px-3 py-1 rounded-full text-xs font-medium"
            >
              {RAY_SHORT_NAMES[ray.ray_id] ?? ray.ray_name}
            </span>
          ))}
          {justInRay && (
            <span
              className="chip-surface-body px-3 py-1 rounded-full text-xs font-medium"
            >
              Training: {RAY_SHORT_NAMES[justInRay.ray_id] ?? justInRay.ray_name}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="border-top-stroke-soft px-4 py-2 text-center">
          <p className="text-[9px] tracking-wider" style={{ color: 'color-mix(in srgb, var(--text-body) 30%, transparent)' }}>
            143leadership.com
          </p>
        </div>
      </div>

      {/* Share actions */}
      <div className="flex gap-3">
        <button
          onClick={() => void copyToClipboard()}
          className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          style={{
            background: copied ? 'var(--surface-border)' : 'var(--surface-glass)',
            color: copied ? 'var(--neon-teal)' : 'var(--text-on-dark)',
            border: `1px solid ${copied ? 'var(--surface-border)' : 'var(--surface-border)'}`,
          }}
        >
          {copied ? '\u2713 Copied' : 'Copy Text'}
        </button>

        {'share' in navigator && (
          <button
            onClick={() => void handleNativeShare()}
            className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            style={{
              background: 'color-mix(in srgb, var(--gold-primary) 10%, transparent)',
              color: 'var(--brand-gold)',
              border: '1px solid var(--surface-border)',
            }}
          >
            Share
          </button>
        )}
      </div>
    </section>
  );
}
