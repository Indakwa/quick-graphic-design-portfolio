'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Media } from '@/lib/content';
import { projects, ui } from '@/lib/content';
import { Contact } from './Contact';
import { CursorLabel } from './CursorLabel';
import { ExperimentsGrid } from './ExperimentsGrid';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Lightbox, type LightboxState } from './Lightbox';
import { Nav } from './Nav';
import { NobodyAsked } from './NobodyAsked';
import { ProjectSplit } from './ProjectSplit';
import { ProjectStacked } from './ProjectStacked';
import { WhyMe } from './WhyMe';

const bySlug = (s: string) => projects.find((p) => p.slug === s)!;

/**
 * Lightbox state, synced with history so the browser / phone back button
 * closes it instead of leaving the page.
 */
function useLightbox() {
  const [state, setState] = useState<LightboxState>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onPop = () => setState(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Return focus to the image that was clicked.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (state) wasOpen.current = true;
    else if (wasOpen.current) {
      wasOpen.current = false;
      trigger.current?.focus({ preventScroll: true });
    }
  }, [state]);

  const open = useCallback((items: Media[], index: number, title: string, el: HTMLElement) => {
    trigger.current = el;
    window.history.pushState({ lightbox: true }, '');
    setState({ items, index, title });
  }, []);

  const close = useCallback(() => {
    if ((window.history.state as { lightbox?: boolean } | null)?.lightbox) window.history.back();
    else setState(null);
  }, []);

  const setIndex = useCallback((index: number) => setState((s) => (s ? { ...s, index } : s)), []);

  return { state, open, close, setIndex };
}

export function Portfolio() {
  const lightbox = useLightbox();

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
          <ProjectSplit project={bySlug('pm-kenya')} onView={lightbox.open} />
          <ProjectStacked project={bySlug('bigfoot-tees')} onView={lightbox.open} />
        </div>
        <NobodyAsked project={bySlug('nobody-asked')} onView={lightbox.open} />
        <ExperimentsGrid onView={lightbox.open} />
        <WhyMe />
        <Contact />
      </main>
      <Footer />
      <Lightbox state={lightbox.state} onClose={lightbox.close} onIndex={lightbox.setIndex} />
      <CursorLabel />
    </>
  );
}
