'use client';

import type { ReactNode } from 'react';

/** Arrow nudge + underline-draw on hover/focus. Used for project CTAs. */
export function Cta({
  children,
  onClick,
  slug,
  block = false,
  className = '',
}: {
  children: ReactNode;
  onClick: (el: HTMLElement) => void;
  /** Marks the element so focus can return here when the modal closes. */
  slug?: string;
  /** Full-width outlined button on mobile, inline link on desktop. */
  block?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      data-cta={slug}
      onClick={(e) => onClick(e.currentTarget)}
      className={`group/cta inline-flex min-h-11 items-center gap-2 font-medium ${
        block
          ? 'w-full justify-center rounded-full border border-ink px-6 py-3 lg:w-auto lg:justify-start lg:rounded-none lg:border-0 lg:px-0 lg:py-0'
          : ''
      } ${className}`}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-quint group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100"
        />
      </span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-500 ease-quint group-hover/cta:translate-x-1 group-focus-visible/cta:translate-x-1"
      >
        →
      </span>
    </button>
  );
}
