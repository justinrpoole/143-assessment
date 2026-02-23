'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface PhotosphereDepthProps {
  /** Depth reached 0-100 (surface to core) */
  depth: number;
}

const LAYERS = [
  { name: 'Photosphere', desc: 'Surface habits — the self others see', color: '#F5E6CC', innerColor: '#F4C430', thickness: 0.12 },
  { name: 'Chromosphere', desc: 'Emotional awareness', color: '#E8A317', innerColor: '#D4770B', thickness: 0.18 },
  { name: 'Convection Zone', desc: 'Pattern recognition, behavioral understanding', color: '#D4770B', innerColor: '#C0392B', thickness: 0.28 },
  { name: 'Core', desc: 'Authentic self — the source of all energy', color: '#F4C430', innerColor: '#FFFFFF', thickness: 0.15 },
];

/**
 * Photosphere Depth Rings (#26) — Self-Awareness Layers
 *
 * Sun cross-section with four concentric layers. A bracket indicator
 * shows depth reached. Uncut portion shows only the outer photosphere.
 * v3 branded: gold sphere on purple, warm layer transitions.
 */
export default function PhotosphereDepth({ depth }: PhotosphereDepthProps) {
  const reducedMotion = useReducedMotion();
  const W = 500;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2;
  const sunR = 160;

  // Calculate which layer the depth indicator reaches
  const depthNorm = depth / 100; // 0 = surface, 1 = core
  const layerThresholds = [0, 0.12, 0.30, 0.58, 1.0]; // cumulative thresholds
  const depthLayer = layerThresholds.findIndex((_, i) => depthNorm < (layerThresholds[i + 1] ?? 1.01));

  // Cut-away angle (quarter of the sphere)
  const cutAngleStart = -Math.PI * 0.45;
  const cutAngleEnd = Math.PI * 0.05;

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Photosphere Depth
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Self-awareness depth — ${depth}%, ${LAYERS[Math.min(depthLayer, 3)]?.name ?? 'Surface'} level`}>
        <defs>
          <clipPath id="pd-cutaway">
            {/* Everything except the cut-away quarter */}
            <path d={`
              M ${cx} ${cy}
              L ${cx + Math.cos(cutAngleEnd) * (sunR + 20)} ${cy + Math.sin(cutAngleEnd) * (sunR + 20)}
              A ${sunR + 20} ${sunR + 20} 0 1 1 ${cx + Math.cos(cutAngleStart) * (sunR + 20)} ${cy + Math.sin(cutAngleStart) * (sunR + 20)}
              Z
            `} />
          </clipPath>
          <clipPath id="pd-cut-section">
            {/* Just the cut-away quarter */}
            <path d={`
              M ${cx} ${cy}
              L ${cx + Math.cos(cutAngleStart) * (sunR + 20)} ${cy + Math.sin(cutAngleStart) * (sunR + 20)}
              A ${sunR + 20} ${sunR + 20} 0 0 1 ${cx + Math.cos(cutAngleEnd) * (sunR + 20)} ${cy + Math.sin(cutAngleEnd) * (sunR + 20)}
              Z
            `} />
          </clipPath>
          <filter id="pd-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="var(--cosmic-svg-bg)" />

        {/* Uncut portion — shows only photosphere (outer layer) */}
        <g clipPath="url(#pd-cutaway)">
          <circle cx={cx} cy={cy} r={sunR} fill={LAYERS[0].color} opacity={0.7} />
          {/* Granulation texture */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const dist = sunR * 0.5 + (i % 3) * sunR * 0.15;
            return (
              <circle
                key={i}
                cx={cx + Math.cos(angle) * dist}
                cy={cy + Math.sin(angle) * dist}
                r={8 + (i % 4) * 3}
                fill="#F4C430"
                opacity={0.12}
              />
            );
          })}
        </g>

        {/* Cut-away section — shows all layers */}
        <g clipPath="url(#pd-cut-section)">
          {/* Layer 1: Photosphere (outermost) */}
          <circle cx={cx} cy={cy} r={sunR} fill={LAYERS[0].color} opacity={0.5} />

          {/* Layer 2: Chromosphere */}
          <circle cx={cx} cy={cy} r={sunR * 0.82} fill={LAYERS[1].color} opacity={0.6} />

          {/* Layer 3: Convection Zone */}
          <circle cx={cx} cy={cy} r={sunR * 0.62} fill={LAYERS[2].color} opacity={0.65} />
          {/* Convection cell patterns */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const dist = sunR * 0.45;
            return (
              <circle
                key={i}
                cx={cx + Math.cos(angle) * dist}
                cy={cy + Math.sin(angle) * dist}
                r={sunR * 0.08}
                fill="#C0392B"
                opacity={0.15}
              />
            );
          })}

          {/* Layer 4: Core */}
          <motion.circle
            cx={cx}
            cy={cy}
            r={sunR * 0.25}
            fill="#F4C430"
            opacity={0.9}
            filter="url(#pd-glow)"
            initial={false}
            animate={
              !reducedMotion
                ? { opacity: [0.8, 1, 0.8] }
                : undefined
            }
            transition={!reducedMotion ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
          />
          <circle cx={cx} cy={cy} r={sunR * 0.12} fill="#FFFFFF" opacity={0.6} />

          {/* Layer divider lines */}
          {[sunR, sunR * 0.82, sunR * 0.62, sunR * 0.25].map((r, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={0.5}
              strokeOpacity={0.15}
            />
          ))}
        </g>

        {/* Depth indicator bracket on the cut face */}
        {(() => {
          const bracketAngle = cutAngleStart + 0.15;
          const outerR = sunR;
          const innerR = sunR * (1 - depthNorm * 0.75);
          const bx1 = cx + Math.cos(bracketAngle) * outerR;
          const by1 = cy + Math.sin(bracketAngle) * outerR;
          const bx2 = cx + Math.cos(bracketAngle) * innerR;
          const by2 = cy + Math.sin(bracketAngle) * innerR;

          return (
            <g>
              <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.6} />
              {/* Bracket caps */}
              <line x1={bx1 - 4} y1={by1} x2={bx1 + 4} y2={by1} stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.6} />
              <line x1={bx2 - 4} y1={by2} x2={bx2 + 4} y2={by2} stroke="#FFFFFF" strokeWidth={2} strokeOpacity={0.6} />
            </g>
          );
        })()}

        {/* Layer labels along the cut edge */}
        {LAYERS.map((layer, i) => {
          const labelAngle = cutAngleEnd + 0.12;
          const labelR = sunR * (1 - [0.06, 0.2, 0.42, 0.62][i]);
          const lx = cx + Math.cos(labelAngle) * labelR + 10;
          const ly = cy + Math.sin(labelAngle) * labelR;
          return (
            <g key={layer.name}>
              <line
                x1={cx + Math.cos(labelAngle) * labelR}
                y1={ly}
                x2={lx}
                y2={ly}
                stroke="#FFFFFF"
                strokeWidth={0.5}
                strokeOpacity={0.2}
              />
              <text x={lx + 4} y={ly + 3} fill="#FFFFFF" fontSize="8" fontWeight="500" opacity={depthLayer >= i ? 0.7 : 0.25}>
                {layer.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Depth readout */}
      <div className="mt-3 flex items-center justify-between">
        <span style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11 }}>
          {LAYERS[Math.min(depthLayer, 3)]?.desc}
        </span>
        <span style={{ color: '#F4C430', fontSize: 13, fontWeight: 700 }}>{depth}%</span>
      </div>
    </div>
  );
}
