'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GoldParticleBurst from '@/components/ui/GoldParticleBurst';

interface NeonGlowButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** Enable magnetic cursor-follow effect (max 4px offset) */
  magnetic?: boolean;
}

/**
 * NeonGlowButton — Primary CTA with layered neon box-shadows.
 * Idle: subtle breathing glow (3s cycle).
 * Hover: intensified glow + lift + route prefetch.
 * Optional magnetic cursor-follow.
 */
export default function NeonGlowButton({
  href,
  className = '',
  children,
  magnetic = true,
}: NeonGlowButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState('translate(0, 0)');
  const router = useRouter();
  const prefetched = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (!prefetched.current && href.startsWith('/')) {
      router.prefetch(href);
      prefetched.current = true;
    }
  }, [href, router]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.08;
    const dy = (e.clientY - cy) * 0.08;
    setTransform(`translate(${dx}px, ${dy}px) translateY(-2px)`);
  };

  const handleMouseLeave = () => {
    setTransform('translate(0, 0)');
  };

  return (
    <GoldParticleBurst>
      <Link
        ref={ref}
        href={href}
        className={`btn-neon-glow ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '16px 36px',
          minHeight: '48px',
          borderRadius: 'var(--radius-xl, 20px)',
          background: 'var(--gold-primary)',
          color: 'var(--ink-950)',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.03em',
          textDecoration: 'none',
          border: 'none',
          cursor: 'pointer',
          overflow: 'visible',
          boxShadow:
            '0 0 10px color-mix(in srgb, var(--gold-primary) 35%, transparent), 0 0 24px color-mix(in srgb, var(--gold-primary) 18%, transparent), 0 0 48px color-mix(in srgb, var(--gold-primary) 10%, transparent), 0 0 14px color-mix(in srgb, var(--neon-cyan) 10%, transparent), 0 0 35px var(--surface-border), inset 0 1px 0 color-mix(in srgb, var(--text-body) 20%, transparent)',
          animation: 'btn-glow-pulse 3s ease-in-out infinite',
        }}
      >
        {children}
      </Link>
    </GoldParticleBurst>
  );
}
