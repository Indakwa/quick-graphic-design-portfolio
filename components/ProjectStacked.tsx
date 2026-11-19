'use client';

import type { Project } from '@/lib/content';
import { ui } from '@/lib/content';
import { Cta } from './Cta';
import { MediaSlot } from './MediaSlot';
import { RevealGroup, RevealItem } from './Reveal';
import { SplitTextReveal } from './SplitTextReveal';
import { TagList } from './Tag';

type OpenFn = (slug: string, trigger?: HTMLElement | null) => void;

/**
 * Inspo 2: a row of 3 images on top, a wide text band below.
 * Mobile: the row becomes a scroll-snap carousel (85% cards, next one peeks).
 */
export function ProjectStacked({ project, onOpen }: { project: Project; onOpen: OpenFn }) {
  const headingId = `${project.slug}-title`;
  const open = (el?: HTMLElement | null) => onOpen(project.slug, el);

  return (
    <section aria-labelledby={headingId} className="container-page section-y !pt-0">
      <div
        className="bleed-x no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0"
        data-cursor={ui.cursorView}
      >
        {project.cover.slice(0, 3).map((m, i) => (
          <div
            key={i}
            className="w-[85%] shrink-0 cursor-pointer snap-start md:w-auto"
            onClick={() => open(null)}
          >
            <MediaSlot media={m} delay={i * 0.08} sizes="(min-width: 768px) 33vw, 85vw" />
          </div>
        ))}
      </div>

      <div className="mt-2 rounded-tile bg-surface p-6 sm:p-8 md:mt-3 lg:p-10">
        <RevealGroup className="grid gap-8 lg:grid-cols-12 lg:gap-grid">
          <div className="lg:col-span-6">
            <RevealItem>
              <p className="t-label tabular text-muted">
                {project.number} — {project.label}
              </p>
            </RevealItem>
            <SplitTextReveal as="h2" id={headingId} lines={[project.title]} className="t-h1 mt-6" />
          </div>
          <div className="flex flex-col justify-end lg:col-span-6">
            <RevealItem>
              <p className="t-body-lg max-w-[60ch] text-ink-soft">{project.summary}</p>
            </RevealItem>
            <RevealItem className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <TagList tags={project.tags} />
              <Cta slug={project.slug} onClick={open} block className="sm:w-auto">
                {project.cta}
              </Cta>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
