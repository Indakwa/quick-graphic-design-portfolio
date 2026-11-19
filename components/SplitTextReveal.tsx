'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { dur, ease, reducedDur } from '@/lib/motion';

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

/**
 * Masked line reveal for big headings: each line rises from y:100% inside an
 * overflow-hidden mask. Screen readers get the full text once.
 */
export function SplitTextReveal({
  lines,
  as = 'h2',
  id,
  className = '',
  trigger = 'view',
  delay = 0,
  stagger = 0.08,
}: {
  lines: string[];
  as?: keyof typeof tags;
  id?: string;
  className?: string;
  trigger?: 'view' | 'load';
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = tags[as];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const line: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: reducedDur } } }
    : { hidden: { y: '105%' }, show: { y: '0%', transition: { duration: dur.slow, ease } } };

  const triggerProps =
    trigger === 'load'
      ? { animate: 'show' }
      : { whileInView: 'show', viewport: { once: true, amount: 0.3 } };

  return (
    <Tag id={id} className={className} initial="hidden" variants={container} {...triggerProps}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((l, i) => (
        <span key={i} aria-hidden className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <motion.span className="block" variants={line}>
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
