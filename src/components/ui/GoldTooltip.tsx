'use client';

import type { ReactNode } from 'react';

interface GoldTooltipProps {
  /** The term to display inline */
  children: ReactNode;
  /** Tooltip definition text */
  tip: string;
}

/**
 * GoldTooltip — Gold-bordered info tooltip on key terms.
 * Shows a 1-sentence definition on hover/tap.
 */
export default function GoldTooltip({ children, tip }: GoldTooltipProps) {
  return (
    <span className="gold-tooltip" tabIndex={0}>
      {children}
      <span className="gold-tooltip__content" role="tooltip">{tip}</span>
    </span>
  );
}
