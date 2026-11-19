'use client';

import type { Project } from '@/lib/content';
import { MediaSlot } from './MediaSlot';
import { RevealGroup, RevealItem } from './Reveal';
import { SplitTextReveal } from './SplitTextReveal';
import { ViewTile, type OnView } from './ViewTile';

/** Slight size variation so the collage reads as curated, not a strict grid. */
const posterStyle = [
  'lg:w-[88%] lg:ml-auto', // 1
  'translate-y-6 lg:translate-y-12', // 2 — right column staggers down
  '', // 3
  'translate-y-6 lg:translate-y-12 lg:w-[90%]', // 4
];

/** Inspo 4: title + paragraph on the left, a staggered 2×2 poster collage on the right. */
export function NobodyAsked({ project, onView }: { project: Project; onView: OnView }) {
  const headingId = `${project.slug}-title`;
  const posters = project.cover.slice(0, 4);

  return (
    <section id="play" data-nav="play" aria-labelledby={headingId} className="bg-surface section-y">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-grid">
        <RevealGroup className="lg:col-span-4 lg:pr-6">
          <div className="lg:sticky lg:top-28">
            <RevealItem>
              <p className="t-label tabular text-muted">
                {project.number} — {project.label}
              </p>
            </RevealItem>
            <SplitTextReveal
              as="h2"
              id={headingId}
              lines={project.title.split(', ').map((s, i, a) => (i < a.length - 1 ? `${s},` : s))}
              className="t-h1 mt-6"
            />
            <RevealItem>
              <p className="t-body-lg mt-8 max-w-[60ch] text-ink-soft">{project.summary}</p>
            </RevealItem>
            {project.meta && (
              <RevealItem>
                <p className="t-label mt-6 text-muted">{project.meta}</p>
              </RevealItem>
            )}
          </div>
        </RevealGroup>

        <div className="grid grid-cols-2 items-start gap-2 pb-6 md:gap-3 lg:col-span-8 lg:pb-12">
          {posters.map((m, i) => (
            <ViewTile
              key={i}
              items={posters}
              index={i}
              title={project.title}
              onView={onView}
              className={posterStyle[i]}
            >
              <MediaSlot media={m} delay={(i % 2) * 0.08} sizes="(min-width: 1024px) 30vw, 50vw" />
            </ViewTile>
          ))}
        </div>
      </div>
    </section>
  );
}
