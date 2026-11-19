'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { nav, site } from '@/lib/content';
import { dur, ease, reducedDur } from '@/lib/motion';
import { StatusPill } from './StatusPill';

export function MobileMenu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const reduce = useReducedMotion();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onNavigate();
    // Wait for the scroll lock to lift before scrolling.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      window.history.replaceState(window.history.state, '', `#${id}`);
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-bg pt-16 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? reducedDur : dur.fast, ease }}
        >
          <nav aria-label="Mobile" className="container-page flex flex-1 flex-col justify-between pb-10 pt-10">
            <motion.ul
              className="flex flex-col gap-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
            >
              {nav.links.map((l, i) => (
                <motion.li
                  key={l.id}
                  variants={
                    reduce
                      ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                      : {
                          hidden: { opacity: 0, y: 24 },
                          show: { opacity: 1, y: 0, transition: { duration: dur.base, ease } },
                        }
                  }
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    className="t-h2 block py-1.5 !text-[2.5rem] !font-semibold"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="flex flex-col items-start gap-4">
              {site.available && <StatusPill />}
              <a href={`mailto:${site.email}`} className="t-body-lg underline decoration-line underline-offset-4">
                {site.email}
              </a>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
