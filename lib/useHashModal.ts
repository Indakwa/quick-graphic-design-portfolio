'use client';

import { useCallback, useEffect, useState } from 'react';

type ModalState = { modal?: string } | null;

/**
 * Hash ⇄ modal state.
 * - open() pushes `#slug` so the browser / phone back button closes the modal.
 * - Loading the page with `#slug` opens that modal, and inserts a clean history
 *   entry underneath so "back" closes the modal instead of leaving the site.
 * - prev/next swaps use replaceState so back still closes in one step.
 */
export function useHashModal(slugs: string[]) {
  const [slug, setSlug] = useState<string | null>(null);
  const valid = useCallback((s: string) => slugs.includes(s), [slugs]);

  useEffect(() => {
    const initial = decodeURIComponent(window.location.hash.slice(1));
    if (valid(initial)) {
      const base = window.location.pathname + window.location.search;
      window.history.replaceState(null, '', base);
      window.history.pushState({ modal: initial } satisfies ModalState, '', `#${initial}`);
      setSlug(initial);
    }

    const onPop = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      setSlug(valid(h) ? h : null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [valid]);

  const open = useCallback(
    (next: string) => {
      if (!valid(next)) return;
      const state = window.history.state as ModalState;
      if (state?.modal) {
        window.history.replaceState({ modal: next } satisfies ModalState, '', `#${next}`);
      } else {
        window.history.pushState({ modal: next } satisfies ModalState, '', `#${next}`);
      }
      setSlug(next);
    },
    [valid],
  );

  const close = useCallback(() => {
    const state = window.history.state as ModalState;
    if (state?.modal) {
      // popstate will clear the slug
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setSlug(null);
    }
  }, []);

  return { slug, open, close };
}
