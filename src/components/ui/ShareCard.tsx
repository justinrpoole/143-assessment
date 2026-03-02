'use client';

/**
 * ShareCard — 1080×1080 Light Signature card for social sharing.
 * Renders as a DOM element (not canvas) so html2canvas can capture it.
 * Star field is pure CSS — no canvas, no deps beyond Framer Motion.
 */

import { useRef } from 'react';

export interface ShareCardProps {
  /** Archetype name, e.g. "Nova Architect" */
  signatureName: string;
  /** Top two ray names, e.g. ["Intention", "Joy"] */
  topRays: [string, string] | string[];
  /** Optional essence line shown below the name */
  essence?: string;
}

/** Stars rendered at fixed positions for a predictable, printable layout */
const STARS: Array<{ x: number; y: number; r: number; opacity: number }> = [
  { x: 80, y: 60, r: 1.5, opacity: 0.8 },
  { x: 200, y: 120, r: 1, opacity: 0.5 },
  { x: 340, y: 40, r: 2, opacity: 0.7 },
  { x: 500, y: 90, r: 1.2, opacity: 0.6 },
  { x: 680, y: 55, r: 1.8, opacity: 0.9 },
  { x: 820, y: 130, r: 1, opacity: 0.4 },
  { x: 950, y: 70, r: 1.5, opacity: 0.7 },
  { x: 1020, y: 30, r: 1, opacity: 0.5 },
  { x: 150, y: 200, r: 1, opacity: 0.4 },
  { x: 420, y: 180, r: 1.2, opacity: 0.6 },
  { x: 600, y: 220, r: 1.5, opacity: 0.5 },
  { x: 780, y: 190, r: 1, opacity: 0.7 },
  { x: 900, y: 240, r: 2, opacity: 0.6 },
  { x: 60, y: 350, r: 1, opacity: 0.5 },
  { x: 240, y: 300, r: 1.5, opacity: 0.8 },
  { x: 470, y: 370, r: 1, opacity: 0.4 },
  { x: 700, y: 330, r: 1.2, opacity: 0.6 },
  { x: 860, y: 380, r: 1, opacity: 0.5 },
  { x: 1010, y: 310, r: 1.8, opacity: 0.7 },
  { x: 130, y: 500, r: 1.2, opacity: 0.6 },
  { x: 310, y: 460, r: 1, opacity: 0.5 },
  { x: 550, y: 520, r: 1.5, opacity: 0.8 },
  { x: 740, y: 480, r: 1, opacity: 0.4 },
  { x: 940, y: 510, r: 2, opacity: 0.6 },
  { x: 70, y: 650, r: 1, opacity: 0.5 },
  { x: 280, y: 700, r: 1.5, opacity: 0.7 },
  { x: 480, y: 660, r: 1, opacity: 0.4 },
  { x: 630, y: 720, r: 1.2, opacity: 0.6 },
  { x: 800, y: 670, r: 1, opacity: 0.5 },
  { x: 990, y: 640, r: 1.8, opacity: 0.8 },
  { x: 160, y: 820, r: 1, opacity: 0.5 },
  { x: 390, y: 800, r: 1.5, opacity: 0.6 },
  { x: 580, y: 850, r: 1, opacity: 0.4 },
  { x: 760, y: 830, r: 1.2, opacity: 0.7 },
  { x: 920, y: 790, r: 1, opacity: 0.5 },
  { x: 50, y: 960, r: 1.5, opacity: 0.6 },
  { x: 250, y: 940, r: 1, opacity: 0.4 },
  { x: 450, y: 990, r: 2, opacity: 0.7 },
  { x: 660, y: 970, r: 1, opacity: 0.5 },
  { x: 870, y: 950, r: 1.5, opacity: 0.8 },
];

/**
 * The visual share card. Render this inside ShareCardDownload
 * or directly on the page to preview. The card is designed for
 * 1080×1080 but rendered at 50% scale for on-screen display.
 */
export function ShareCard({ signatureName, topRays, essence }: ShareCardProps) {
  const ray1 = topRays[0] ?? '';
  const ray2 = topRays[1] ?? '';

  return (
    /* Outer wrapper — scales the 1080px card to fit the screen preview */
    <div style={{ width: '100%', maxWidth: 540, margin: '0 auto' }}>
      {/*
        * data-share-card marks this element for html2canvas capture.
        * Width is 1080px at natural size; we use transform: scale(0.5) to
        * preview it without blowing up the layout.
        */}
      <div
        data-share-card
        style={{
          width: 1080,
          height: 1080,
          transformOrigin: 'top left',
          transform: 'scale(0.5)',
          // The container below receives the scale — we need a height shim
          // in the outer wrapper (handled via the aspect-ratio wrapper below)
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 40,
          // Deep space gradient: navy → indigo → deep purple
          background: 'linear-gradient(145deg, #070B24 0%, #0E1030 30%, #130830 60%, #1a0535 100%)',
          fontFamily: "'Avenir Next', 'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {/* ── Star field (SVG overlay) ── */}
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1080 1080"
        >
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" opacity={s.opacity} />
          ))}
          {/* Subtle nebula glow at centre */}
          <radialGradient id="nebula" cx="50%" cy="42%" r="45%">
            <stop offset="0%" stopColor="#6B21A8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6B21A8" stopOpacity="0" />
          </radialGradient>
          <ellipse cx="540" cy="450" rx="480" ry="360" fill="url(#nebula)" />
        </svg>

        {/* ── Radial glow behind the name ── */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(248,208,17,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Layout content ── */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 60px',
          textAlign: 'center',
          gap: 0,
        }}>
          {/* TOP: 143 Leadership logo text */}
          <p style={{
            fontSize: 26,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#F8D011',
            fontWeight: 700,
            marginBottom: 56,
            opacity: 0.9,
          }}>
            143 Leadership
          </p>

          {/* LABEL: Your Light Signature */}
          <p style={{
            fontSize: 22,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(248,208,17,0.75)',
            fontWeight: 500,
            marginBottom: 28,
          }}>
            Your Light Signature
          </p>

          {/* HERO: Archetype name */}
          <h1 style={{
            fontSize: signatureName.length > 18 ? 76 : 96,
            fontWeight: 800,
            color: '#FFFEF5',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 40,
            textShadow: '0 0 60px rgba(248,208,17,0.20), 0 0 120px rgba(248,208,17,0.10)',
          }}>
            {signatureName}
          </h1>

          {/* RAYS: Top two ray names */}
          {(ray1 || ray2) && (
            <div style={{ display: 'flex', gap: 24, marginBottom: 36 }}>
              {[ray1, ray2].filter(Boolean).map((ray) => (
                <span
                  key={ray}
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#F8D011',
                    padding: '8px 24px',
                    borderRadius: 40,
                    border: '1px solid rgba(248,208,17,0.35)',
                    background: 'rgba(248,208,17,0.08)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {ray}
                </span>
              ))}
            </div>
          )}

          {/* ESSENCE line (optional) */}
          {essence && (
            <p style={{
              fontSize: 22,
              color: 'rgba(255,254,245,0.6)',
              maxWidth: 700,
              lineHeight: 1.5,
              fontStyle: 'italic',
              marginBottom: 0,
            }}>
              {essence}
            </p>
          )}

          {/* Spacer to push footer down */}
          <div style={{ flex: 1 }} />

          {/* Divider */}
          <div style={{
            width: 120,
            height: 1,
            background: 'rgba(248,208,17,0.3)',
            marginBottom: 32,
          }} />

          {/* FOOTER */}
          <p style={{
            fontSize: 20,
            color: 'rgba(248,208,17,0.65)',
            letterSpacing: '0.1em',
            fontWeight: 500,
          }}>
            143leadership.com&nbsp;&nbsp;|&nbsp;&nbsp;Be The Light
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper that provides the correct height shim for the scaled card.
 * The card is 1080px wide, scaled to 0.5 → 540px displayed width,
 * so we need a 540px-tall container to avoid collapsing.
 */
export function ShareCardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: 540, height: 540, position: 'relative', overflow: 'hidden' }}>
      {children}
    </div>
  );
}

/**
 * Hook-style ref getter for the share card element.
 * Used by the download handler.
 */
export function useShareCardRef() {
  return useRef<HTMLDivElement>(null);
}
