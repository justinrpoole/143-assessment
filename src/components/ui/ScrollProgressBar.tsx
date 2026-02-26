'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollProgressBar — Thin gold bar fixed to top of viewport.
 * Fills left-to-right as user scrolls down the page.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}
