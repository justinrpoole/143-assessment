'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LiquidFillButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * LiquidFillButton — Secondary CTA with gold liquid fill rising from bottom on hover.
 * Text transitions from gold to dark on fill. Prefetches route on hover.
 */
export default function LiquidFillButton({
  href,
  className = '',
  children,
}: LiquidFillButtonProps) {
  const router = useRouter();
  const prefetched = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (!prefetched.current && href.startsWith('/')) {
      router.prefetch(href);
      prefetched.current = true;
    }
  }, [href, router]);

  return (
    <Link
      href={href}
      className={`btn-liquid-fill ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </Link>
  );
}
