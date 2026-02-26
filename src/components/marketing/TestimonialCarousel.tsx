'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  /** Auto-advance interval in ms (default 4000) */
  interval?: number;
}

/**
 * TestimonialCarousel — Horizontal auto-advancing carousel with dot indicators.
 * Pauses on hover. Wraps around infinitely.
 */
export default function TestimonialCarousel({
  testimonials,
  interval = 4000,
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = testimonials.length;

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(advance, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, interval, advance, total]);

  if (total === 0) return null;

  const t = testimonials[current];

  return (
    <div
      className="testimonial-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Testimonials"
      aria-roledescription="carousel"
    >
      <div className="testimonial-carousel__slide" key={current}>
        <blockquote className="testimonial-carousel__quote">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <cite className="testimonial-carousel__cite">
          {t.name}{t.role ? ` — ${t.role}` : ''}
        </cite>
      </div>

      {total > 1 && (
        <div className="testimonial-carousel__dots" role="tablist" aria-label="Slide indicators">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonial-carousel__dot ${i === current ? 'testimonial-carousel__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
