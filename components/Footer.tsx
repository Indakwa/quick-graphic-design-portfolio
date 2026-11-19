import { site, ui } from '@/lib/content';
import { LocalTime } from './LocalTime';

export function Footer() {
  return (
    <footer className="container-page">
      <div className="t-caption flex flex-col gap-3 border-t border-line py-8 text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {site.copyrightYear} {site.name}
        </p>
        <p>{site.location}</p>
        <p>
          <LocalTime />
        </p>
        <a href="#top" className="group/top inline-flex min-h-11 items-center gap-1.5 text-ink sm:min-h-0">
          {ui.backToTop}
          <span aria-hidden className="inline-block transition-transform duration-500 ease-quint group-hover/top:-translate-y-0.5">
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
