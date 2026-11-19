'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ease } from '@/lib/motion';

/**
 * A small ink pill that follows the cursor over any element with
 * `data-cursor="View"`. Fine pointers only; off under reduced motion.
 * The real cursor is never hidden.
 */
export function CursorLabel() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const visible = useRef(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 450, damping: 40, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(mq.matches && !reduce);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) {
      setLabel(null);
      return;
    }
    const check = (target: EventTarget | null) => {
      const el = target instanceof Element ? target.closest('[data-cursor]') : null;
      const next = el ? el.getAttribute('data-cursor') : null;
      visible.current = next !== null;
      setLabel(next);
    };
    const onMove = (e: PointerEvent) => {
      if (!visible.current) {
        // Jump into place rather than sliding in from the last position.
        sx.jump(e.clientX);
        sy.jump(e.clientY);
      }
      x.set(e.clientX);
      y.set(e.clientY);
      check(e.target);
    };
    const onScroll = () => check(document.elementFromPoint(x.get(), y.get()));
    const onLeave = () => {
      visible.current = false;
      setLabel(null);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, x, y, sx, sy]);

  if (!enabled) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[80]" style={{ x: sx, y: sy }}>
      <motion.div
        initial={false}
        animate={{ scale: label ? 1 : 0.4, opacity: label ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        className="t-label translate-x-4 translate-y-4 rounded-full bg-ink px-3.5 py-2 text-bg"
      >
        {label ?? ''}
      </motion.div>
    </motion.div>
  );
}
