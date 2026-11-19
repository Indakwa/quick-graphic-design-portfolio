import type { Tag as TagType } from '@/lib/content';

/** Uppercase pill. SOLD renders inverted so it stands out. */
export function Tag({ tag }: { tag: TagType }) {
  const inverted = tag === 'SOLD';
  return (
    <li
      className={`t-label inline-flex items-center rounded-full border px-3 py-1.5 ${
        inverted ? 'border-ink bg-ink text-bg' : 'border-line text-ink-soft'
      }`}
    >
      {tag}
    </li>
  );
}

export function TagList({ tags, className = '' }: { tags: TagType[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((t) => (
        <Tag key={t} tag={t} />
      ))}
    </ul>
  );
}
