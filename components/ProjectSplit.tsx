'use client';

import type { Project } from '@/lib/content';
import { MediaSlot } from './MediaSlot';
import { RevealGroup, RevealItem } from './Reveal';
import { SplitTextReveal } from './SplitTextReveal';
import { TagList } from './Tag';
import { ViewTile, type OnView } from './ViewTile';

/**
 * Inspo 1: text panel (cols 1–5) + bento mosaic of 3 tiles (cols 6–12).
 *
 * The mosaic has a fixed 7:6 shape split into columns of 4fr / 3fr and two rows,
 * on every screen size, so each tile always has the same shape and nothing is cropped:
 *   A (left, full height)  = 2:3 portrait
 *   B, C (right, stacked)  = 1:1 square
 */
const tilePlacement = [
  'col-start-1 row-start-1 row-span-2', // A
  'col-start-2 row-start-1', // B
  'col-start-2 row-start-2', // C
];

export function ProjectSplit({ project, onView }: { project: Project; onView: OnView }) {
  const headingId = `${project.slug}-title`;
  const tiles = project.cover.slice(0, 3);

  return (
    <section aria-labelledby={headingId} className="container-page section-y">
      <div className="grid grid-cols-1 gap-grid lg:grid-cols-12">
        {/* Text panel */}
        <div className="rounded-tile bg-surface p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <RevealGroup className="flex h-full flex-col justify-between gap-10">
            <div>
              <RevealItem>
                <p className="t-label tabular text-muted">
                  {project.number} — {project.label}
                </p>
              </RevealItem>
              <SplitTextReveal
                as="h2"
                id={headingId}
                lines={[project.title]}
                className="t-h1 mt-6 !text-[clamp(2.5rem,5vw,5rem)]"
              />
            </div>
            <div>
              <RevealItem>
                <p className="t-body-lg max-w-[60ch] text-ink-soft">{project.summary}</p>
              </RevealItem>
              <RevealItem>
                <TagList tags={project.tags} className="mt-6" />
              </RevealItem>
            </div>
          </RevealGroup>
        </div>

        {/* Bento mosaic */}
        <div className="grid aspect-[7/6] grid-cols-[4fr_3fr] grid-rows-2 gap-2 md:gap-3 lg:col-span-7">
          {tiles.map((m, i) => (
            <ViewTile
              key={i}
              items={tiles}
              index={i}
              title={project.title}
              onView={onView}
              className={`relative h-full ${tilePlacement[i]}`}
            >
              <MediaSlot media={m} fill delay={i * 0.08} sizes="(min-width: 1024px) 30vw, 50vw" />
            </ViewTile>
          ))}
        </div>
      </div>
    </section>
  );
}
