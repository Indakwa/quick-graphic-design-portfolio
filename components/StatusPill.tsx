import { site } from '@/lib/content';

export function StatusPill() {
  return (
    <span className="t-caption inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-muted">
      <span aria-hidden className="size-1.5 rounded-full bg-[#7E9A82]" />
      {site.availableLabel} · {site.city}
    </span>
  );
}
