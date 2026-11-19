'use client';

import { useCallback, useEffect, useRef } from 'react';
import { projects } from '@/lib/content';
import { useHashModal } from '@/lib/useHashModal';
import { Contact } from './Contact';
import { CursorLabel } from './CursorLabel';
import { ExperimentsGrid } from './ExperimentsGrid';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Nav } from './Nav';
import { NobodyAsked } from './NobodyAsked';
import { ProjectModal } from './ProjectModal';
import { ProjectSplit } from './ProjectSplit';
import { ProjectStacked } from './ProjectStacked';
import { WhyMe } from './WhyMe';
import { ui } from '@/lib/content';

const slugs = projects.map((p) => p.slug);
const bySlug = (s: string) => projects.find((p) => p.slug === s)!;

/** First visible CTA for a project (there can be a mobile and a desktop copy). */
function visibleCta(slug: string) {
  return (
    Array.from(document.querySelectorAll<HTMLElement>(`[data-cta="${slug}"]`)).find(
      (el) => el.offsetParent !== null,
    ) ?? null
  );
}

export function Portfolio() {
  const { slug, open, close } = useHashModal(slugs);
  const returnFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  const handleOpen = useCallback(
    (s: string, trigger?: HTMLElement | null) => {
      returnFocus.current = trigger ?? visibleCta(s);
      open(s);
    },
    [open],
  );

  // Return focus to whatever opened the modal (or the project's CTA after a deep link).
  useEffect(() => {
    if (slug) {
      if (!wasOpen.current && !returnFocus.current) returnFocus.current = visibleCta(slug);
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [slug]);

  return (
    <>
      <a
        href="#main"
        className="t-label fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-4 py-3 text-bg focus:translate-y-0"
      >
        {ui.skipToContent}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <div id="work" data-nav="work">
          <ProjectSplit project={bySlug('pm-kenya')} onOpen={handleOpen} />
          <ProjectStacked project={bySlug('bigfoot-tees')} onOpen={handleOpen} />
        </div>
        <NobodyAsked project={bySlug('nobody-asked')} onOpen={handleOpen} />
        <ExperimentsGrid />
        <WhyMe />
        <Contact />
      </main>
      <Footer />
      <ProjectModal slug={slug} onClose={close} onNavigate={open} />
      <CursorLabel />
    </>
  );
}
