'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Media } from '@/lib/content';
import { ui } from '@/lib/content';
import { dur, ease, reducedDur } from '@/lib/motion';
import { MediaSlot } from './MediaSlot';

export type LightboxState = { items: Media[]; index: number; title?: string } | null;

function ratioNumber(m: Media) {
  if (m.kind === 'image') return m.width / m.height;
  const [w, h] = m.ratio.split('/').map(Number);
  return w / h;
}

export function describe(m: Media) {
  return m.kind === 'placeholder' ? m.description : m.alt;
}

/**
 * Clean, controlled larger view of one image. Arrows / swipe step through the
 * images of the same section. Esc, ✕, backdrop click or the back button close it.
 */
export function Lightbox({
  state,
  onClose,
  onIndex,
}: {
  state: LightboxState;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  return <AnimatePresence>{state && <View key="lightbox" state={state} onClose={onClose} onIndex={onIndex} />}</AnimatePresence>;
}

function View({
  state,
  onClose,
  onIndex,
}: {
  state: NonNullable<LightboxState>;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { items, index, title } = state;
  const media = items[index];
  const many = items.length > 1;
  const go = (d: number) => onIndex((index + d + items.length) % items.length);

  const latest = useRef({ onClose, go });
  latest.current = { onClose, go };

  // Scroll lock with scrollbar compensation, initial focus.
  useEffect(() => {
    const { body, documentElement } = document;
    const sbw = window.innerWidth - documentElement.clientWidth;
    const prev = [body.style.overflow, body.style.paddingRight];
    body.style.overflow = 'hidden';
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      [body.style.overflow, body.style.paddingRight] = prev;
    };
  }, []);

  // Keyboard: Esc, ←/→, and keep Tab inside the viewer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const l = latest.current;
      if (e.key === 'Escape') l.onClose();
      else if (e.key === 'ArrowLeft') l.go(-1);
      else if (e.key === 'ArrowRight') l.go(1);
      else if (e.key === 'Tab' && ref.current) {
        const els = Array.from(ref.current.querySelectorAll<HTMLElement>('button'));
        const first = els[0];
        const last = els[els.length - 1];
        if (!ref.current.contains(document.activeElement)) {
          e.preventDefault();
          first?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const r = ratioNumber(media);
  // Fit inside the viewport while keeping the image's own shape.
  const width = `min(100%, calc((100dvh - 11rem) * ${r}))`;

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${ui.lightbox.label}: ${title}` : ui.lightbox.label}
      className="fixed inset-0 z-[70] flex flex-col bg-bg/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? reducedDur : dur.fast, ease }}
    >
      {/* Top bar */}
      <div className="container-page flex h-16 shrink-0 items-center justify-between">
        <p className="t-label tabular text-muted">
          {title}
          {many && (
            <span className="ml-3">
              {index + 1} / {items.length}
            </span>
          )}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={ui.lightbox.close}
          className="-mr-2 grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-ink"
        >
          <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Image area — clicking the empty space around the image closes */}
      <div className="container-page relative flex min-h-0 flex-1 items-center justify-center" onClick={onClose}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            style={{ width }}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? reducedDur : 0.35, ease }}
            drag={many && !reduce ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -500) go(1);
              else if (info.offset.x > 80 || info.velocity.x > 500) go(-1);
            }}
            className="touch-pan-y"
          >
            <MediaSlot media={media} reveal="none" sizes="92vw" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="container-page flex min-h-24 shrink-0 items-center justify-between gap-6 py-4">
        {/* Placeholders already show their description inside the box. */}
        <p className="t-caption max-w-[60ch] text-ink-soft">{media.kind === 'placeholder' ? '' : describe(media)}</p>
        {many && (
          <div className="flex shrink-0 gap-2">
            <ArrowButton label={ui.lightbox.prev} onClick={() => go(-1)} dir="left" />
            <ArrowButton label={ui.lightbox.next} onClick={() => go(1)} dir="right" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ArrowButton({ label, onClick, dir }: { label: string; onClick: () => void; dir: 'left' | 'right' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-ink"
    >
      <span aria-hidden>{dir === 'left' ? '←' : '→'}</span>
    </button>
  );
}
