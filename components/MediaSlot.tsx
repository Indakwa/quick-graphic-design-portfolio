'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Media } from '@/lib/content';
import { ui } from '@/lib/content';
import { dur, ease, reducedDur } from '@/lib/motion';

type Reveal = 'view' | 'hero' | 'none';

type Props = {
  media: Media;
  /** Fill the parent box instead of reserving the media's own aspect ratio. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  reveal?: Reveal;
  delay?: number;
  /** Hide the written description on placeholders (e.g. when a caption overlay shows it). */
  hideDescription?: boolean;
  className?: string;
  /** Extra inline styles for the outer box. */
  style?: React.CSSProperties;
};

function ratioOf(media: Media) {
  if (media.kind === 'image') return `${media.width}/${media.height}`;
  return media.ratio;
}

const clipFrom = {
  view: 'inset(8% 8% 8% 8% round 6px)',
  hero: 'inset(100% 0% 0% 0% round 6px)',
};
const clipTo = 'inset(0% 0% 0% 0% round 6px)';

export function MediaSlot({
  media,
  fill = false,
  sizes = '100vw',
  priority = false,
  reveal = 'view',
  delay = 0,
  hideDescription = false,
  className = '',
  style,
}: Props) {
  const reduce = useReducedMotion();

  const boxStyle: React.CSSProperties = fill ? { ...style } : { aspectRatio: ratioOf(media), ...style };

  // Reveal animation props for the outer (clip) and inner (scale) layers.
  let outer: Record<string, unknown> = {};
  let inner: Record<string, unknown> = {};
  if (reveal !== 'none') {
    const trigger =
      reveal === 'hero'
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once: true, amount: 0.15 } };
    if (reduce) {
      outer = {
        initial: 'hidden',
        ...trigger,
        variants: {
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: reducedDur, delay } },
        },
      };
    } else {
      const d = dur.reveal;
      outer = {
        initial: 'hidden',
        ...trigger,
        variants: {
          hidden: { clipPath: clipFrom[reveal] },
          show: { clipPath: clipTo, transition: { duration: d, ease, delay } },
        },
      };
      inner = {
        variants: {
          hidden: { scale: reveal === 'hero' ? 1.06 : 1.08 },
          show: { scale: 1, transition: { duration: d, ease, delay } },
        },
      };
    }
  }

  return (
    <motion.div
      {...outer}
      inherit={false}
      className={`group/media relative w-full overflow-hidden rounded-tile ${fill ? 'h-full' : ''} ${className}`}
      style={boxStyle}
    >
      <motion.div {...inner} className="absolute inset-0">
        <div className="absolute inset-0 transition-transform duration-700 ease-quint group-hover/media:scale-[1.03]">
          <MediaContent media={media} sizes={sizes} priority={priority} hideDescription={hideDescription} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function MediaContent({
  media,
  sizes,
  priority,
  hideDescription,
}: {
  media: Media;
  sizes: string;
  priority: boolean;
  hideDescription: boolean;
}) {
  if (media.kind === 'image') {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={media.blurDataURL ? 'blur' : 'empty'}
        blurDataURL={media.blurDataURL}
        className="object-cover"
        style={{ backgroundColor: 'var(--surface)' }}
      />
    );
  }

  if (media.kind === 'video') return <LoopVideo media={media} />;

  return (
    <div
      className="@container absolute inset-0 flex flex-col justify-end p-4 sm:p-5"
      style={{ backgroundColor: media.tone, boxShadow: 'inset 0 0 0 1px var(--line)' }}
      role="img"
      aria-label={media.description}
    >
      <span className="t-label text-ink-soft">{media.video ? ui.videoLabel : ui.imageLabel}</span>
      {!hideDescription && (
        <span className="t-caption mt-1.5 hidden max-w-[32ch] text-ink-soft @[11rem]:block">
          {media.description}
        </span>
      )}
    </div>
  );
}

/** Muted looping video that pauses off-screen and under reduced motion. */
function LoopVideo({ media }: { media: Extract<Media, { kind: 'video' }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={media.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={media.alt}
    >
      {media.webm && <source src={media.webm} type="video/webm" />}
      <source src={media.src} type="video/mp4" />
    </video>
  );
}
