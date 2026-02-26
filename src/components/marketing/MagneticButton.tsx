'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

interface MagneticButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * MagneticButton — A CTA button that subtly follows the cursor on hover,
 * creating a magnetic pull effect. The movement is gentle (max 4px)
 * so it feels alive without being distracting.
 */
export default function MagneticButton({ href, className, children }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState('translate(0, 0)');

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.08; // Max ~4px movement
    const dy = (e.clientY - cy) * 0.08;

    setTransform(`translate(${dx}px, ${dy}px)`);
  };

  const handleMouseLeave = () => {
    setTransform('translate(0, 0)');
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </Link>
  );
}
