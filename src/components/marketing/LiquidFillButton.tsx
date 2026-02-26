'use client';

import Link from 'next/link';

interface LiquidFillButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * LiquidFillButton — Secondary CTA with gold liquid fill rising from bottom on hover.
 * Text transitions from gold to dark on fill.
 */
export default function LiquidFillButton({
  href,
  className = '',
  children,
}: LiquidFillButtonProps) {
  return (
    <Link
      href={href}
      className={`btn-liquid-fill ${className}`}
    >
      {children}
    </Link>
  );
}
