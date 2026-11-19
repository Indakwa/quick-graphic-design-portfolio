'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { whyMe } from '@/lib/content';
import { ease } from '@/lib/motion';
import { RevealGroup, RevealItem } from './Reveal';
import { SplitTextReveal } from './SplitTextReveal';

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  // Server HTML shows the final value; the client resets to 0 before it scrolls into view.
  const [n, setN] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (reduce || started.current) return;
    if (!inView) {
      setN(0);
      return;
    }
    started.current = true;
    const controls = animate(0, value, {
      duration: 0.8,
      ease,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular">
      {reduce ? value : n}
      {suffix}
    </span>
  );
}

export function WhyMe() {
  return (
    <section id="why-me" data-nav="why-me" aria-labelledby="why-me-title" className="on-dark bg-inverse text-ink-inverse section-y">
      <div className="container-page">
        <RevealGroup>
          <RevealItem>
            <p className="t-label text-muted-inverse">{whyMe.label}</p>
          </RevealItem>
        </RevealGroup>

        <SplitTextReveal
          as="h2"
          id="why-me-title"
          lines={whyMe.statementLines}
          className="t-statement mt-8 max-w-[18ch] md:mt-10"
        />

        <RevealGroup className="mt-12 md:mt-16">
          <RevealItem>
            <p className="t-body-lg max-w-[52ch] text-ink-inverse/80">{whyMe.body}</p>
          </RevealItem>

          <RevealItem>
            <dl className="mt-16 grid grid-cols-1 border-t border-line-inverse sm:grid-cols-3 md:mt-24">
              {whyMe.stats.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col-reverse gap-2 border-line-inverse py-6 sm:py-8 ${
                    i > 0 ? 'border-t sm:border-l sm:border-t-0 sm:pl-8' : ''
                  } ${i < whyMe.stats.length - 1 ? 'sm:pr-8' : ''}`}
                >
                  <dt className="t-body max-w-[18ch] text-muted-inverse">{s.label}</dt>
                  <dd className="t-h1">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </RevealItem>

          <RevealItem>
            <p className="t-h3 mt-16 max-w-[40ch] md:mt-24">{whyMe.closingIdea}</p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
