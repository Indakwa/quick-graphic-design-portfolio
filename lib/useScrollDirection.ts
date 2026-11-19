'use client';

import { useEffect, useState } from 'react';

/** Scroll direction plus a "scrolled past N px" flag. rAF-throttled. */
export function useScrollDirection(scrolledAt = 24, threshold = 6) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [scrolled, setScrolled] = useState(false);
  const [nearTop, setNearTop] = useState(true);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > threshold) {
        setDirection(y > last ? 'down' : 'up');
        last = y;
      }
      setScrolled(y > scrolledAt);
      setNearTop(y < 120);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolledAt, threshold]);

  return { direction, scrolled, nearTop };
}
