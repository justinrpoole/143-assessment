'use client';

import { useRef, useCallback } from 'react';
import { rayHex } from '@/lib/ui/ray-colors';

interface ShareableSignatureCardProps {
  /** Archetype name, e.g. "Strategic Optimist" */
  name: string;
  /** Tagline, e.g. "You see the path AND the light at the end of it." */
  tagline: string;
  /** Two ray names, e.g. ["Intention", "Joy"] */
  rays: [string, string];
  /** Neon accent color from archetype data */
  neonColor?: string;
  /** Identity code, e.g. "CLARITY. WARMTH. MOTION." */
  identityCode?: string;
  /** Optional className override */
  className?: string;
}

/**
 * ShareableSignatureCard — A beautiful, social-media-optimized card
 * designed to be screenshotted and shared on Instagram Stories, LinkedIn, etc.
 *
 * Sized for Instagram Story format (portrait) in the UI,
 * with a "Share" button that copies the card as an image.
 */
export default function ShareableSignatureCard({
  name,
  tagline,
  rays,
  neonColor = '#F8D011',
  identityCode,
  className = '',
}: ShareableSignatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const ray1Hex = rayHex(rays[0]);
  const ray2Hex = rayHex(rays[1]);

  const handleShare = useCallback(async () => {
    const el = cardRef.current;
    if (!el) return;

    try {
      // Dynamic import to avoid bundling html2canvas for non-sharers
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(el, {
        backgroundColor: '#1E0E35',
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'light-signature.png', { type: 'image/png' })] })) {
          await navigator.share({
            title: `My Light Signature: ${name}`,
            text: tagline,
            files: [new File([blob], 'light-signature.png', { type: 'image/png' })],
          });
        } else {
          // Fallback: download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `light-signature-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch {
      // Fallback: copy text
      await navigator.clipboard?.writeText(
        `My Light Signature: ${name}\n${tagline}\n\n143leadership.com`,
      );
    }
  }, [name, tagline]);

  return (
    <div className={`mx-auto max-w-sm ${className}`}>
      {/* Card — designed for screenshot/sharing */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: `linear-gradient(135deg, #1E0E35 0%, #120825 50%, #1E0E35 100%)`,
          border: `1px solid ${neonColor}30`,
          aspectRatio: '9 / 16',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Background constellation pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 360 640"
          fill="none"
          aria-hidden="true"
        >
          {/* Outer ring */}
          <circle
            cx="180"
            cy="320"
            r="200"
            stroke={`${neonColor}10`}
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="320"
            r="140"
            stroke={`${neonColor}08`}
            strokeWidth="1"
          />
          <circle
            cx="180"
            cy="320"
            r="80"
            stroke={`${neonColor}06`}
            strokeWidth="1"
          />

          {/* Cross lines */}
          <line x1="180" y1="100" x2="180" y2="540" stroke={`${neonColor}06`} strokeWidth="0.5" />
          <line x1="40" y1="320" x2="320" y2="540" stroke={`${neonColor}06`} strokeWidth="0.5" />

          {/* Star dots */}
          {[
            [90, 180], [270, 180], [140, 420], [220, 220],
            [60, 300], [300, 340], [180, 150], [180, 490],
            [120, 260], [240, 380], [80, 440], [280, 200],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 3 === 0 ? 2 : 1}
              fill={`${neonColor}${i % 3 === 0 ? '30' : '15'}`}
            />
          ))}

          {/* Gradient orbs */}
          <defs>
            <radialGradient id="orb1" cx="30%" cy="25%">
              <stop offset="0%" stopColor={`${ray1Hex}15`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="orb2" cx="70%" cy="75%">
              <stop offset="0%" stopColor={`${ray2Hex}12`} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="360" height="640" fill="url(#orb1)" />
          <rect width="360" height="640" fill="url(#orb2)" />
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Small brand mark */}
          <p
            className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            143 Leadership
          </p>

          {/* Rays label */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: ray1Hex }}
            >
              {rays[0]}
            </span>
            <span
              className="text-[11px]"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              +
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: ray2Hex }}
            >
              {rays[1]}
            </span>
          </div>

          {/* Divider */}
          <div
            className="mx-auto mt-4 h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${neonColor}40, transparent)`,
            }}
          />

          {/* Archetype name */}
          <h2
            className="mt-6 text-3xl font-bold leading-tight sm:text-4xl"
            style={{
              color: '#F8D011',
              fontFamily: 'var(--font-cosmic-display)',
              textShadow: `0 0 32px ${neonColor}30`,
            }}
          >
            {name}
          </h2>

          {/* Tagline */}
          <p
            className="mx-auto mt-4 max-w-[260px] text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            {tagline}
          </p>

          {/* Identity code */}
          {identityCode && (
            <p
              className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: `${neonColor}80` }}
            >
              {identityCode}
            </p>
          )}

          {/* Ray color bar */}
          <div className="mx-auto mt-8 flex w-32 overflow-hidden rounded-full" style={{ height: 3 }}>
            <div className="flex-1" style={{ background: ray1Hex }} />
            <div className="flex-1" style={{ background: ray2Hex }} />
          </div>

          {/* URL */}
          <p
            className="mt-10 text-[9px] tracking-widest"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            143leadership.com/archetypes
          </p>
        </div>
      </div>

      {/* Share button — outside the card so it doesn't get captured */}
      <button
        onClick={handleShare}
        className="btn-secondary mx-auto mt-4 flex items-center gap-2 px-5 py-2.5 text-sm"
        style={{ borderColor: `${neonColor}40`, color: neonColor }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Share My Light Signature
      </button>
    </div>
  );
}
