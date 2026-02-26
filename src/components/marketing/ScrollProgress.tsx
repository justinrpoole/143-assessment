'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollProgress — A thin gold progress bar at the very top of the viewport
 * that fills as the user scrolls down the page.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(1, scrollTop / docHeight));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[2px]"
      style={{
        width: `${progress * 100}%`,
        background: 'linear-gradient(to right, #60058D, #F8D011)',
        transition: 'width 100ms linear',
        boxShadow: progress > 0 ? '0 0 8px rgba(248, 208, 17, 0.4)' : 'none',
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}
