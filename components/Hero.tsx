'use client';

import { motion, useReducedMotion } from 'motion/react';
import { site, ui } from '@/lib/content';
import { dur, ease, reducedDur } from '@/lib/motion';
import { MediaSlot } from './MediaSlot';
import { SplitTextReveal } from './SplitTextReveal';

export function Hero() {
  const reduce = useReducedMotion();
  const nameDelay = 0.15;
  const afterName = nameDelay + site.nameLines.length * 0.08 + 0.35;

  const fadeUp = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: reducedDur } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: dur.base, ease, delay },
        };

  return (
    <section id="top" data-nav="" aria-labelledby="hero-title" className="container-page pt-[clamp(3rem,8vw,7rem)]">
      <motion.p className="t-label text-muted" {...fadeUp(afterName)}>
        {site.heroLabel}
      </motion.p>

      <SplitTextReveal
        as="h1"
        id="hero-title"
        lines={site.nameLines}
        trigger="load"
        delay={nameDelay}
        className="t-display mt-6 md:mt-8"
      />

      <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
        <motion.p className="t-body-lg max-w-[40ch] text-ink-soft md:col-span-7" {...fadeUp(afterName + 0.08)}>
          {site.intro}
        </motion.p>

        <motion.div
          className="flex items-center md:col-span-5 md:justify-end"
          {...fadeUp(afterName + 0.16)}
        >
          <a href="#work" className="t-label group/scroll inline-flex min-h-11 items-center gap-2 text-ink">
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-quint group-hover/scroll:translate-y-0.5"
            >
              ↓
            </span>
            {ui.scroll}
          </a>
        </motion.div>
      </div>

      <div className="mt-10 aspect-[4/5] md:mt-16 md:aspect-[16/9]">
        <MediaSlot
          media={site.heroMedia}
          fill
          priority
          reveal="hero"
          delay={afterName - 0.1}
          sizes="(min-width: 1680px) 1584px, calc(100vw - 2.5rem)"
        />
      </div>
    </section>
  );
}
