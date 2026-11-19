import { ImageResponse } from 'next/og';
import { site } from '@/lib/content';

export const dynamic = 'force-static';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Monogram favicon: off-black on off-white. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F4F2EE',
          color: '#141414',
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1.5,
          borderRadius: 12,
        }}
      >
        {site.initials}
      </div>
    ),
    size,
  );
}
