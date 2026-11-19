'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { nav, site, ui } from '@/lib/content';
import { dur, ease } from '@/lib/motion';
import { useScrollDirection } from '@/lib/useScrollDirection';
import { MobileMenu } from './MobileMenu';
import { StatusPill } from './StatusPill';

/** Watches every `[data-nav]` element and reports which one is mid-viewport. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.getAttribute('data-nav') || null);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const { direction, scrolled, nearTop } = useScrollDirection(24);
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const hidden = direction === 'down' && !nearTop && !menuOpen && !focusWithin;

  return (
    <>
      <motion.header
        className="sticky top-0 z-50"
        initial={false}
        animate={{ y: hidden && !reduce ? '-100%' : '0%', opacity: hidden && reduce ? 0 : 1 }}
        transition={{ duration: dur.fast, ease }}
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
        }}
      >
        <div
          className={`backdrop-blur-[12px] transition-[border-color,background-color] duration-300 ${
            menuOpen ? 'bg-bg' : 'bg-bg/80'
          } border-b ${scrolled && !menuOpen ? 'border-line' : 'border-transparent'}`}
        >
          <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between">
            <a href="#top" className="text-base font-semibold tracking-[-0.01em]">
              {site.name}
            </a>

            <div className="hidden items-center gap-8 md:flex">
              <ul className="flex items-center gap-7">
                {nav.links.map((l) => {
                  const isActive = active === l.id;
                  return (
                    <li key={l.id}>
                      <a
                        href={`#${l.id}`}
                        aria-current={isActive ? 'true' : undefined}
                        className="group/nav relative py-2 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:text-ink aria-[current]:text-ink"
                      >
                        {l.label}
                        <span
                          aria-hidden
                          className={`absolute bottom-1 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ease-quint ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                          }`}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
              {site.available && <StatusPill />}
            </div>

            <button
              ref={toggleRef}
              type="button"
              className="-mr-3 min-h-11 px-3 text-[0.9375rem] font-medium md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? ui.menuClose : ui.menuOpen}
            </button>
          </nav>
        </div>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }}
        onNavigate={() => setMenuOpen(false)}
      />
    </>
  );
}
