'use client';

import { experiments } from '@/lib/content';
import { MediaSlot } from './MediaSlot';
import { RevealGroup, RevealItem } from './Reveal';
import { SplitTextReveal } from './SplitTextReveal';

/**
 * Inspo 3: 4×2 square tiles, then a big title bottom-left and description bottom-right.
 * Captions fade in on hover / focus and are always visible on touch devices.
 */
export function ExperimentsGrid() {
  return (
    <section id="experiments" data-nav="work" aria-labelledby="experiments-title" className="container-page section-y">
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {experiments.tiles.map((t, i) => (
          <li key={i}>
            <figure tabIndex={0} className="group/tile relative rounded-tile">
              <MediaSlot media={t.media} hideDescription delay={(i % 4) * 0.08} sizes="(min-width: 768px) 25vw, 50vw" />
              <figcaption className="t-caption pointer-events-none absolute inset-x-0 bottom-0 rounded-b-tile bg-gradient-to-t from-ink/55 to-transparent px-3 pb-3 pt-10 text-ink-inverse opacity-0 transition-opacity duration-500 ease-quint group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100 [@media(hover:none)]:opacity-100">
                {t.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <RevealGroup className="mt-10 grid gap-6 md:mt-16 md:grid-cols-12 md:items-end md:gap-grid">
        <SplitTextReveal as="h2" id="experiments-title" lines={[experiments.title]} className="t-h1 md:col-span-7" />
        <RevealItem className="md:col-span-5 md:justify-self-end">
          <p className="t-body-lg max-w-[40ch] text-ink-soft">{experiments.body}</p>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
