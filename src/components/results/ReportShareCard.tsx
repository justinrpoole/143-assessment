'use client';

import { useState, useRef, useCallback } from 'react';
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

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [shareText]);

  const handleNativeShare = useCallback(async () => {
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
      void handleCopy();
    }
  }, [archetype?.name, shareText, handleCopy]);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-on-dark)' }}>
        Share Your Light Signature
      </h3>

      {/* Visual card */}
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0B0212 0%, #1A0732 50%, #0F0A1E 100%)',
          border: '1px solid rgba(248, 208, 17, 0.2)',
          boxShadow: '0 0 30px rgba(96, 5, 141, 0.3)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 text-center" style={{ borderBottom: '1px solid rgba(148, 80, 200, 0.2)' }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#F8D011' }}>
            143 Leadership &middot; Light Signature
          </p>
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#FFFEF5' }}>
            {archetype?.name ?? 'The Lightkeeper'}
          </h3>
          {archetype?.essence && (
            <p className="text-xs mt-1 max-w-xs mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {archetype.essence}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 text-center py-4 px-4" style={{ background: 'rgba(96, 5, 141, 0.15)' }}>
          <div>
            <p className="text-lg font-bold" style={{ color: '#F8D011' }}>{Math.round(overallScore)}%</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Overall</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: '#34D399' }}>
              {topTwo.length > 0 ? RAY_SHORT_NAMES[topTwo[0].ray_id] ?? topTwo[0].ray_name : '—'}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Top Ray</p>
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: eclipse?.level === 'HIGH' ? '#F87171' : eclipse?.level === 'ELEVATED' ? '#FB923C' : '#34D399' }}>
              {eclipse?.level ?? '—'}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Eclipse</p>
          </div>
        </div>

        {/* Ray chips */}
        <div className="px-4 py-3 flex flex-wrap justify-center gap-2">
          {topTwo.map((ray) => (
            <span
              key={ray.ray_id}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255, 207, 0, 0.1)',
                color: '#F8D011',
                border: '1px solid rgba(255, 207, 0, 0.2)',
              }}
            >
              {RAY_SHORT_NAMES[ray.ray_id] ?? ray.ray_name}
            </span>
          ))}
          {justInRay && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(148, 80, 200, 0.15)',
                color: '#B794E6',
                border: '1px solid rgba(148, 80, 200, 0.2)',
              }}
            >
              Training: {RAY_SHORT_NAMES[justInRay.ray_id] ?? justInRay.ray_name}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 text-center" style={{ borderTop: '1px solid rgba(148, 80, 200, 0.15)' }}>
          <p className="text-[9px] tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            143leadership.com
          </p>
        </div>
      </div>

      {/* Share actions */}
      <div className="flex gap-3">
        <button
          onClick={() => void handleCopy()}
          className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
          style={{
            background: copied ? 'rgba(52, 211, 153, 0.15)' : 'var(--surface-glass)',
            color: copied ? '#34D399' : 'var(--text-on-dark)',
            border: `1px solid ${copied ? 'rgba(52, 211, 153, 0.3)' : 'var(--surface-border)'}`,
          }}
        >
          {copied ? '\u2713 Copied' : 'Copy Text'}
        </button>

        {'share' in navigator && (
          <button
            onClick={() => void handleNativeShare()}
            className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            style={{
              background: 'rgba(248, 208, 17, 0.1)',
              color: '#F8D011',
              border: '1px solid rgba(248, 208, 17, 0.2)',
            }}
          >
            Share
          </button>
        )}
      </div>
    </section>
  );
}
