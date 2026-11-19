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
 * Inspo 1: text panel (cols 1–5) + bento mosaic of 5 tiles (cols 6–12).
 * Mobile: text first, 2-col mosaic (A spans two rows), full-width CTA below.
 */
const tilePlacement = [
  // A — tall
  'row-span-2 lg:col-start-1 lg:row-start-1 lg:row-span-4',
  // B
  'lg:col-start-1 lg:row-start-5 lg:row-span-2',
  // C
  'lg:col-start-2 lg:row-start-1 lg:row-span-2',
  // D
  'lg:col-start-2 lg:row-start-3 lg:row-span-2',
  // E
  'lg:col-start-2 lg:row-start-5 lg:row-span-2',
];

export function ProjectSplit({ project, onOpen }: { project: Project; onOpen: OpenFn }) {
  const headingId = `${project.slug}-title`;
  const open = (el?: HTMLElement | null) => onOpen(project.slug, el);

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
              <SplitTextReveal as="h2" id={headingId} lines={[project.title]} className="t-h1 mt-6" />
            </div>
            <div>
              <RevealItem>
                <p className="t-body-lg max-w-[60ch] text-ink-soft">{project.summary}</p>
              </RevealItem>
              <RevealItem>
                <TagList tags={project.tags} className="mt-6" />
              </RevealItem>
              <RevealItem className="mt-8 hidden lg:block">
                <Cta slug={project.slug} onClick={open} block>
                  {project.cta}
                </Cta>
              </RevealItem>
            </div>
          </RevealGroup>
        </div>

        {/* Bento mosaic */}
        <div
          className="grid auto-rows-[clamp(9rem,40vw,20rem)] grid-cols-2 gap-2 md:gap-3 lg:col-span-7 lg:min-h-[clamp(34rem,48vw,52rem)] lg:auto-rows-auto lg:grid-cols-[1.1fr_1fr] lg:grid-rows-6"
          data-cursor={ui.cursorView}
        >
          {project.cover.slice(0, 5).map((m, i) => (
            <div key={i} className={`relative cursor-pointer ${tilePlacement[i]}`} onClick={() => open(null)}>
              <MediaSlot
                media={m}
                fill
                delay={i * 0.08}
                sizes="(min-width: 1024px) 30vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="lg:hidden">
          <Cta slug={project.slug} onClick={open} block>
            {project.cta}
          </Cta>
        </div>
      </div>
    </section>
  );
}
