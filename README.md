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
| Modal ⇄ URL hash logic | `lib/useHashModal.ts` |
| Share image, favicon, robots, sitemap | `app/opengraph-image.tsx`, `app/icon.tsx`, `app/robots.ts`, `app/sitemap.ts` |

Projects open as modals at `/#pm-kenya`, `/#bigfoot-tees` and `/#nobody-asked`. Those links can be shared directly, and the back button closes the modal.

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
3. Keep the **same aspect ratio** as the placeholder (the `width`/`height` of an image set its ratio). The homepage mosaic tiles crop to fit, so any image works there, but matching the ratio gives the best crop.
4. **Export sizes:** full-width images at 2400px on the long edge, mosaic tiles at 1600px, experiment tiles at 1200×1200. Use JPG at 80% quality (or AVIF) in sRGB. Keep the hero image under 250KB. Keep videos under 3MB (H.264 MP4, plus WebM if you can) and give each a poster frame.
5. Replace every `[bracket]` value in `content.ts`: name, email, social handles, numbers, years and the closing idea. Also update:
   - `site.url`, which is used for share previews and the sitemap.
   - `site.initials`, which is used for the favicon.
   - `whyMe.stats[].value`. These are dummy numbers so the count-up can be previewed.
6. Add your CV as `public/cv.pdf`.
7. **Share image:** `app/opengraph-image.tsx` generates a 1200×630 card with your name. Once you have a strong work image, delete that file and add `app/opengraph-image.jpg` at 1200×630.

Image slots in the modal galleries follow a repeating **full / 2-up / full / 3-up** rhythm, so their order in `gallery` matters. `process` thumbnails show in a small strip below the gallery.

## Notes

- `--muted` was darkened from `#7A7873` to `#67655F` so captions pass WCAG AA on both off-white backgrounds.
- Reduced motion is respected: reveals become short opacity fades, and the count-up, cursor label and drag-to-close are turned off.
