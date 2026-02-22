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
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          style={{
            background: 'rgba(2, 2, 2, 0.92)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(248, 208, 17, 0.15)',
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.75))' }}>
              9 trainable capacities. 15 min.
            </p>
            <Link
              href="/preview"
              className="shrink-0 rounded-lg bg-[#F8D011] px-4 py-2 text-xs font-bold tracking-wide text-[#020202] no-underline transition-all hover:brightness-105"
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
