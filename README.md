# Portfolio

Single-page graphic design portfolio. Next.js (App Router, static export), Tailwind CSS v4, Motion, DM Sans.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site → out/
npm start        # serve out/ locally
```

Deploy: push to GitHub and import into Vercel (no settings needed), or upload `out/` to any static host.

## Where things live

| What | Where |
|---|---|
| **All copy and media** | `lib/content.ts` |
| Colour, type and spacing tokens | `app/globals.css` |
| Easing / durations | `lib/motion.ts` |
| Sections | `components/` (one file per section) |
| Image lightbox | `components/Lightbox.tsx` |
| Share image, favicon, robots, sitemap | `app/opengraph-image.tsx`, `app/icon.tsx`, `app/robots.ts`, `app/sitemap.ts` |

Clicking any image opens it larger in a lightbox. Arrow keys or swiping step through the other images in the same section, and Esc, ✕ or the back button close it. The full project case-study modal is parked; see [BACKLOG.md](BACKLOG.md).

## Swapping in real content

1. Put images in `public/images/<project-slug>/`.
2. In `lib/content.ts`, replace a placeholder entry such as
   ```ts
   ph('3/4', 'Main event poster shot straight-on…')
   ```
   with
   ```ts
   { kind: 'image', src: '/images/pm-kenya/poster.jpg', alt: 'PM Kenya event poster pinned to a wall', width: 1200, height: 1600 }
   ```
   For a looping video tile, use:
   ```ts
   { kind: 'video', src: '/images/experiments/loop.mp4', webm: '/images/experiments/loop.webm', poster: '/images/experiments/loop.jpg', alt: '…', ratio: '1/1' }
   ```
3. Keep the **same size and shape** as the placeholder. The `width`/`height` of an image set its shape.
4. **Image sizes.** Every placeholder on the site shows a slot code (top-left) and its exact export size, for example **PMK-A · 1200 × 1600 px**. Sizes are always **width × height**. In Illustrator, make the artboard that size in px and export at **1×**; the sizes are already doubled for sharp phone and retina screens. Use sRGB colour.

   | Code | Where it is | Shape | Export size (W × H px) |
   |---|---|---|---|
   | PMK-A | Product Managers Kenya: big tall tile on the left | 2:3 portrait | 1200 × 1800 |
   | PMK-B, PMK-C | Product Managers Kenya: right column, top and bottom | 1:1 square | 1200 × 1200 |
   | BIG-1 to BIG-3 | Bigfoot Tees: row of three | 4:5 portrait | 1200 × 1500 |
   | KK-1 to KK-4 | Karibu Kenya: poster collage | 3:4 portrait | 1200 × 1600 |
   | EXP-1 to EXP-8 | Experiments grid | 1:1 square | 1200 × 1200 |

   Every slot shows the **whole image**, with no cropping, on phones, tablets and desktop. The only exception is the Product Managers Kenya tiles, which lose a few pixels at the edges because of the gaps between tiles; keep a small margin there.

   **Format:** for photos, JPG at about 80% quality. For flat illustration and type, WebP (or PNG) keeps edges crisp. Keep each image under about 500KB. Keep videos under 3MB (H.264 MP4, plus WebM if you can) and give each a poster frame.
5. Replace every `[bracket]` value in `content.ts`: name, email, social handles, numbers, years and the closing idea. Also update:
   - `site.url`, which is used for share previews and the sitemap.
   - `site.initials`, which is used for the favicon.
   - `whyMe.stats[].value`. These are dummy numbers so the count-up can be previewed.
6. Add your CV as `public/cv.pdf`.
7. **Share image:** `app/opengraph-image.tsx` generates a 1200×630 card with your name. Once you have a strong work image, delete that file and add `app/opengraph-image.jpg` at 1200×630.

## Notes

- `--muted` was darkened from `#7A7873` to `#67655F` so captions pass WCAG AA on both off-white backgrounds.
- Reduced motion is respected: reveals become short opacity fades, and the count-up, cursor label and lightbox swipe are turned off.
