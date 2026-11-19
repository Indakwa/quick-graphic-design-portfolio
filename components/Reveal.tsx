'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { dur, ease, reducedDur } from '@/lib/motion';

const viewport = { once: true, amount: 0.15 } as const;

/** Fades + rises its children in as a staggered group when 15% is in view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  onLoad = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  /** Animate on mount instead of on scroll into view. */
  onLoad?: boolean;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const trigger = onLoad ? { animate: 'show' } : { whileInView: 'show', viewport };
  return (
    <motion.div className={className} initial="hidden" variants={variants} {...trigger}>
      {children}
    </motion.div>
  );
}

/** A child of RevealGroup. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const variants: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: reducedDur } } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: dur.base, ease } } };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
