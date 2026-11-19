import { ImageResponse } from 'next/og';
import { site } from '@/lib/content';

export const dynamic = 'force-static';
export const alt = `${site.name} — ${site.role}, ${site.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generated 1200×630 share image (WhatsApp / LinkedIn previews).
 * The right-hand block is a placeholder — once you have a strong work image,
 * replace this file with a static `app/opengraph-image.jpg` (same size).
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F4F2EE',
          padding: 56,
          gap: 40,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 2, color: '#67655F', textTransform: 'uppercase' }}>
            {site.heroLabel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', color: '#141414' }}>
            {site.nameLines.map((l) => (
              <div key={l} style={{ fontSize: 104, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>
                {l}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 26, color: '#3A3A38', maxWidth: 520, lineHeight: 1.4 }}>
            {site.disciplines.join(' · ')}
          </div>
        </div>
        <div style={{ width: 420, height: '100%', borderRadius: 8, background: '#D9D3C7', display: 'flex' }} />
      </div>
    ),
    size,
  );
}
