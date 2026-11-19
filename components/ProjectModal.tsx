'use client';

import { AnimatePresence, motion, useDragControls, useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Media, Project } from '@/lib/content';
import { projects, ui } from '@/lib/content';
import { dur, ease, reducedDur } from '@/lib/motion';
import { MediaSlot } from './MediaSlot';
import { TagList } from './Tag';

type Props = {
  slug: string | null;
  onClose: () => void;
  onNavigate: (slug: string) => void;
};

export function ProjectModal({ slug, onClose, onNavigate }: Props) {
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  return (
    <AnimatePresence>
      {project && <Sheet key="sheet" project={project} onClose={onClose} onNavigate={onNavigate} />}
    </AnimatePresence>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"]), video[controls]';

function Sheet({ project, onClose, onNavigate }: { project: Project; onClose: () => void; onNavigate: (s: string) => void }) {
  const reduce = useReducedMotion();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  // Keep latest callbacks without re-binding listeners.
  const handlers = useRef({ onClose, onNavigate, prev, next });
  handlers.current = { onClose, onNavigate, prev, next };

  // Scroll lock with scrollbar compensation.
  useEffect(() => {
    const { body, documentElement } = document;
    const sbw = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, []);

  // Esc, ←/→ and focus trap.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const h = handlers.current;
      if (e.key === 'Escape') {
        e.preventDefault();
        h.onClose();
      } else if (e.key === 'ArrowLeft' && !e.altKey) {
        h.onNavigate(h.prev.slug);
      } else if (e.key === 'ArrowRight' && !e.altKey) {
        h.onNavigate(h.next.slug);
      } else if (e.key === 'Tab') {
        const items = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null || el === document.activeElement,
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        if (!sheet.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // New project → back to the top of the sheet.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  const sheetMotion = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: reducedDur },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { duration: 0.5, ease },
      };

  const titleId = 'modal-title';

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[rgba(20,20,20,0.4)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? reducedDur : dur.fast }}
        onClick={onClose}
      />

      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 flex h-[100dvh] flex-col overflow-hidden bg-bg md:h-[94vh] md:rounded-t-[12px]"
        {...sheetMotion}
        drag={reduce ? false : 'y'}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose();
        }}
      >
        {/* Drag handle (mobile) */}
        <div
          className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3 md:hidden"
          onPointerDown={(e) => dragControls.start(e)}
          aria-hidden
          title={ui.modal.dragHint}
        >
          <span className="h-1 w-10 rounded-full bg-ink/25" />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={ui.modal.close}
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-line bg-bg/90 backdrop-blur transition-colors hover:border-ink md:right-5 md:top-5"
        >
          <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" initial={true}>
            <ModalContent
              key={project.slug}
              project={project}
              prev={prev}
              next={next}
              onNavigate={onNavigate}
              titleId={titleId}
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function chunkGallery(items: Media[]) {
  // Repeating rhythm: full, 2-up, full, 3-up.
  const pattern = [1, 2, 1, 3];
  const rows: Media[][] = [];
  let i = 0;
  let p = 0;
  while (i < items.length) {
    const n = pattern[p % pattern.length];
    rows.push(items.slice(i, i + n));
    i += n;
    p++;
  }
  return rows;
}

const rowClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-3',
};
const rowSizes: Record<number, string> = {
  1: '(min-width: 1280px) 1200px, 100vw',
  2: '(min-width: 640px) 50vw, 100vw',
  3: '33vw',
};

function ModalContent({
  project,
  prev,
  next,
  onNavigate,
  titleId,
}: {
  project: Project;
  prev: Project;
  next: Project;
  onNavigate: (s: string) => void;
  titleId: string;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: reduce ? 0 : 0.35 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: reducedDur } } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: dur.base, ease } } };

  const rows = chunkGallery(project.gallery);
  const meta = [
    { k: ui.modal.role, v: project.role },
    { k: ui.modal.year, v: project.year },
    ...(project.client ? [{ k: ui.modal.client, v: project.client }] : []),
  ];
  const story = [
    { k: ui.modal.brief, v: project.brief },
    { k: ui.modal.wrongIdea, v: project.wrongIdea },
    { k: ui.modal.result, v: project.result },
  ];

  return (
    <motion.article
      initial="hidden"
      animate="show"
      exit="exit"
      variants={container}
      className="mx-auto max-w-[1280px] px-[var(--gutter)] pb-16 pt-10 md:pt-16"
    >
      <motion.header variants={item} className="pr-14">
        <p className="t-label tabular text-muted">
          {project.number} — {project.label} · {project.year}
        </p>
        <h2 id={titleId} className="t-h1 mt-5">
          {project.title}
        </h2>
        <TagList tags={project.tags} className="mt-6" />
        <dl className="t-caption mt-8 flex flex-wrap gap-x-10 gap-y-3">
          {meta.map((m) => (
            <div key={m.k} className="flex gap-2">
              <dt className="text-muted">{m.k} —</dt>
              <dd className="text-ink">{m.v}</dd>
            </div>
          ))}
        </dl>
      </motion.header>

      <motion.div variants={item} className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-3 md:gap-grid">
        {story.map((s) => (
          <div key={s.k}>
            <h3 className="t-label text-muted">{s.k}</h3>
            <p className="t-body-lg mt-3 max-w-[40ch] text-ink-soft">{s.v}</p>
          </div>
        ))}
      </motion.div>

      <div className="mt-14 flex flex-col gap-2 md:mt-20 md:gap-3">
        {rows.map((row, r) => (
          <motion.div key={r} variants={item} className={`grid gap-2 md:gap-3 ${rowClass[row.length]}`}>
            {row.map((m, i) => (
              <MediaSlot key={i} media={m} delay={i * 0.08} sizes={rowSizes[row.length]} />
            ))}
          </motion.div>
        ))}
      </div>

      {project.process && project.process.length > 0 && (
        <motion.div variants={item} className="mt-14 md:mt-20">
          <h3 className="t-label text-muted">{ui.modal.process}</h3>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {project.process.map((m, i) => (
              <MediaSlot key={i} media={m} delay={i * 0.05} sizes="(min-width: 768px) 16vw, 33vw" />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="mt-14 md:mt-20">
        <h3 className="t-label text-muted">{ui.modal.myRole}</h3>
        <p className="t-body-lg mt-3 max-w-[60ch] text-ink-soft">{project.roleDetail}</p>
      </motion.div>

      <motion.nav
        variants={item}
        aria-label="Projects"
        className="mt-14 flex items-start justify-between gap-6 border-t border-line pt-8 md:mt-20"
      >
        <PagerButton dir="prev" label={ui.modal.prev} title={prev.title} onClick={() => onNavigate(prev.slug)} />
        <PagerButton dir="next" label={ui.modal.next} title={next.title} onClick={() => onNavigate(next.slug)} />
      </motion.nav>
    </motion.article>
  );
}

function PagerButton({
  dir,
  label,
  title,
  onClick,
}: {
  dir: 'prev' | 'next';
  label: string;
  title: string;
  onClick: () => void;
}) {
  const isNext = dir === 'next';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/pager flex min-h-11 flex-col gap-1 ${isNext ? 'items-end text-right' : 'items-start text-left'}`}
    >
      <span className="t-label inline-flex items-center gap-2 text-muted">
        {!isNext && (
          <span aria-hidden className="inline-block transition-transform duration-500 ease-quint group-hover/pager:-translate-x-1">
            ←
          </span>
        )}
        {label}
        {isNext && (
          <span aria-hidden className="inline-block transition-transform duration-500 ease-quint group-hover/pager:translate-x-1">
            →
          </span>
        )}
      </span>
      <span className="t-h3">{title}</span>
    </button>
  );
}
