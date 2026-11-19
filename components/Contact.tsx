'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { contact, site, ui } from '@/lib/content';
import { dur, ease } from '@/lib/motion';
import { RevealGroup, RevealItem } from './Reveal';
import { SplitTextReveal } from './SplitTextReveal';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / insecure contexts.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

export function Contact() {
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (await copyText(site.email)) {
      setToast(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 2200);
    }
  };

  return (
    <section id="contact" data-nav="contact" aria-labelledby="contact-title" className="container-page section-y">
      <SplitTextReveal as="h2" id="contact-title" lines={[contact.heading]} className="t-h2 max-w-[22ch]" />

      <RevealGroup className="mt-10 md:mt-14">
        <RevealItem className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <a
            href={`mailto:${site.email}`}
            className="group/email relative inline-block text-[clamp(1.5rem,7vw,6.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]"
          >
            {site.email}
            <span aria-hidden className="absolute -bottom-1 left-0 h-[0.05em] min-h-[2px] w-full bg-line" />
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-[0.05em] min-h-[2px] w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-quint group-hover/email:scale-x-100 group-focus-visible/email:scale-x-100"
            />
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="t-label mb-1 min-h-11 rounded-full border border-line px-5 transition-colors hover:border-ink"
          >
            {ui.copy}
          </button>
        </RevealItem>

        <RevealItem>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 md:mt-16">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group/social t-body-lg inline-flex min-h-11 items-center gap-1.5 font-medium"
                >
                  {s.label}
                  <span
                    aria-hidden
                    className="inline-block text-muted transition-transform duration-500 ease-quint group-hover/social:-translate-y-0.5 group-hover/social:translate-x-0.5 group-hover/social:text-ink group-focus-visible/social:-translate-y-0.5 group-focus-visible/social:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </RevealItem>
      </RevealGroup>

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center">
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: dur.fast, ease }}
              className="t-caption rounded-full bg-ink px-5 py-3 text-bg"
            >
              {ui.copied}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
