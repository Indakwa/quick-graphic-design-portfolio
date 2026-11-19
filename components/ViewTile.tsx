'use client';

import type { ReactNode } from 'react';
import type { Media } from '@/lib/content';
import { ui } from '@/lib/content';
import { describe } from './Lightbox';

export type OnView = (items: Media[], index: number, title: string, trigger: HTMLElement) => void;

/** Wraps an image so clicking it opens the lightbox on that image. */
export function ViewTile({
  items,
  index,
  title,
  onView,
  className = '',
  children,
}: {
  items: Media[];
  index: number;
  title: string;
  onView: OnView;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onView(items, index, title, e.currentTarget)}
      aria-label={ui.lightbox.open(describe(items[index]))}
      data-cursor={ui.cursorView}
      className={`block w-full cursor-zoom-in rounded-tile text-left ${className}`}
    >
      {children}
    </button>
  );
}
