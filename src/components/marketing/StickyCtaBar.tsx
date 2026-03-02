'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel placed at hero bottom — bar appears when this scrolls out of view */}
      <div ref={sentinelRef} className="h-0 w-0" aria-hidden="true" />

      {visible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t"
          style={{
            background: 'rgba(2, 2, 2, 0.94)',
            WebkitBackdropFilter: 'blur(20px)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(248, 208, 17, 0.12)',
            animation: 'stickyBarSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3.5">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              Discover your leadership signal — free, 5 minutes
            </p>
            <Link
              href="/preview"
              className="shrink-0 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide no-underline transition-all hover:brightness-110"
              style={{
                background: 'var(--brand-gold, #F8D011)',
                color: 'var(--brand-black, #020202)',
                boxShadow: '0 0 12px rgba(248, 208, 17, 0.2)',
              }}
            >
              Start Free
            </Link>
          </div>
          <style>{`
            @keyframes stickyBarSlideUp {
              0% { transform: translateY(100%); opacity: 0; }
              70% { transform: translateY(-4px); opacity: 1; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
