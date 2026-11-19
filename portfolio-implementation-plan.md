# Portfolio Site — Implementation Plan

> **For Claude Code.** Build a single-page, image-led graphic design portfolio. The inspiration images attached with this plan show the **layout structure only**: split text and image panels, bento mosaics, poster collages and tile grids. **Do not copy their branding** (no red, no script fonts, no stock photos). The site is a quiet off-white and off-black frame so the work does the talking.

---

## 1. Goals

1. **The work is the hero.** Large imagery, generous whitespace, very little UI chrome.
2. **Answer three questions in one scroll:** the portfolio, the piece "nobody asked for", and "why I'm the baddest". Visitors should never need to leave the homepage.
3. **Quick to judge.** A reviewer on a phone (opened from WhatsApp or Instagram) should understand the designer in about 60 seconds.
4. **Calm, considered motion.** Subtle reveals and hovers only. Nothing flashy.
5. **Easy to swap content.** All copy and images live in one data file. Images start as coloured placeholder blocks with a written description of the ideal photo.

---

## 2. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Static export (`output: 'export'`) is fine; no server needed |
| Styling | **Tailwind CSS** | Design tokens defined as CSS variables, mapped into Tailwind theme |
| Motion | **Motion** (`motion/react`, formerly Framer Motion) | Scroll reveals, modal transitions, layout animations |
| Font | **DM Sans** via `next/font/google` | Weights 400, 500, 600, 700 + italic 400. Variable font if available |
| Images | `next/image` (unoptimized if static export) | Lazy load everything below the fold; AVIF/WebP |
| Deploy | Vercel | |

No component library. Keep dependencies minimal.

---

## 3. Design tokens

### 3.1 Colour

The platform uses only these neutrals. The work brings the colour.

```css
:root {
  --bg:          #F4F2EE; /* off-white, page background */
  --surface:     #ECE9E4; /* slightly deeper off-white, panels and cards */
  --ink:         #141414; /* off-black, primary text and dark sections */
  --ink-soft:    #3A3A38; /* body text on light */
  --muted:       #7A7873; /* captions, labels, meta */
  --line:        rgba(20, 20, 20, 0.12); /* hairlines and dividers */
  --bg-inverse:  #141414;
  --ink-inverse: #F4F2EE;
  --muted-inverse: #9C9A95;
}
```

- No accent colour. Interactive emphasis comes from underline, weight and motion, not hue.
- Text contrast must meet WCAG AA (check `--muted` on `--bg` and `--surface`; darken slightly if it fails).
- `::selection` uses `--ink` background and `--bg` text.

### 3.2 Placeholder colours (temporary)

Image slots render as soft, desaturated colour blocks so the layout reads properly before real images arrive. Rotate through these:

```ts
export const placeholderTones = [
  '#D9D3C7', // sand
  '#C9CFC4', // sage
  '#CBC6CF', // lilac grey
  '#D4C4B8', // clay
  '#C2CAD0', // slate
  '#DCD6CB', // linen
  '#BFC4B6', // moss
  '#D0C9C0', // stone
];
```

### 3.3 Typography (DM Sans only)

Use fluid sizes with `clamp()`. Tighten tracking on large sizes and loosen it on small uppercase labels.

| Token | Size (clamp) | Weight | Tracking | Line-height | Use |
|---|---|---|---|---|---|
| `display` | `clamp(3.5rem, 11vw, 11rem)` | 600 | -0.045em | 0.9 | Hero name, "Why I'm the baddest" |
| `h1` | `clamp(2.75rem, 7vw, 6.5rem)` | 600 | -0.04em | 0.95 | Project titles |
| `h2` | `clamp(1.75rem, 3.5vw, 3rem)` | 500 | -0.03em | 1.05 | Section headings, modal titles |
| `h3` | `clamp(1.25rem, 2vw, 1.625rem)` | 500 | -0.02em | 1.2 | Sub-headings |
| `body-lg` | `clamp(1.0625rem, 1.3vw, 1.25rem)` | 400 | -0.01em | 1.5 | Intro and project descriptions |
| `body` | `1rem` | 400 | 0 | 1.6 | General text |
| `label` | `0.75rem` | 500 | 0.08em, UPPERCASE | 1.2 | Tags, project numbers, meta |
| `caption` | `0.8125rem` | 400 | 0 | 1.4 | Image captions |

- Keep body copy to a **max width of 60ch**.
- Use tabular numerals (`font-variant-numeric: tabular-nums`) for project numbers and the clock.

### 3.4 Spacing, grid, radius

- **Base unit:** 8px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200.
- **Section spacing:** `clamp(6rem, 14vw, 12.5rem)` top and bottom. Be generous with whitespace.
- **Page padding (gutter):** `clamp(1.25rem, 4vw, 3rem)`.
- **Grid:** 12 columns desktop, 6 tablet, 4 mobile. Column gap `clamp(0.75rem, 1.5vw, 1.5rem)`.
- **Max content width:** 1680px, centred. Full-bleed images may break out to the viewport edge.
- **Radius:** `6px` on image tiles and panels, `999px` on pills. Keep it subtle, never bubbly.
- **Image gap inside mosaics:** 8–12px. Tight gaps read as a deliberate collage, as in the inspo.

### 3.5 Breakpoints

`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Design mobile first.

---

## 4. Information architecture

One page plus modals. No other routes.

```
/                      Home (single scroll)
/#pm-kenya             Opens the PM Kenya modal
/#bigfoot-tees         Opens the Bigfoot Tees modal
/#nobody-asked         Opens the Swahili posters modal
/#experiments          Opens the experiments modal (optional)
```

### Page order

1. **Nav** (sticky)
2. **Hero**: name, role, location, one-liner, large lead image
3. **Project 01, PM Kenya**: split layout (inspo image 1)
4. **Project 02, Bigfoot Tees**: image row on top, text below (inspo image 2)
5. **Nobody asked, Swahili posters**: title left, poster collage right (inspo image 4)
6. **Experiments**: 4×2 tile grid with title and description underneath (inspo image 3)
7. **Why I'm the baddest**: large statement on an off-black section
8. **Contact + footer**

---

## 5. Section specs

Every image slot is a `<MediaSlot>` (see §7). Copy below is **dummy** and lives in `content.ts`.

### 5.1 Nav

- Sticky, height 64px, `--bg` at 80% opacity with `backdrop-filter: blur(12px)`, and a hairline bottom border that appears only after scrolling 24px.
- **Left:** wordmark `[Your Name]` (DM Sans 600, 16px).
- **Right (desktop):** `Work`, `Nobody asked`, `Why me`, `Contact` as anchor links, plus a small status pill: `● Available · Nairobi` (green-grey dot, `--muted` text).
- **Mobile:** wordmark on the left and a `Menu` text button on the right. It opens a full-screen off-white overlay with large stacked links (`h2` size) that stagger in.
- **Behaviour:** hide when scrolling down and show when scrolling up (translateY, 300ms). Underline the link for the section currently in view (IntersectionObserver).
- Smooth anchor scrolling with `scroll-margin-top: 80px` on sections.

### 5.2 Hero

```
[label]  Graphic Designer — Nairobi, Kenya

[display] Your Name
          Here.

[body-lg, max 40ch]  I design posters, merch, banners and screens
                     that people actually want to wear, share and show up for.

[label row]  Posters · Merch · Event · Digital        [↓ Scroll]

[MediaSlot: full-width, 16:9 desktop / 4:5 mobile]
```

- Name in `display` size, left-aligned, possibly broken across two lines.
- The lead image below it is full content width (or full bleed) with a 6px radius.
- **MediaSlot `hero-lead`:** *"Wide hero shot from the PM Kenya event: the roll-up banner in frame, attendees wearing the event tees, warm natural light, real people mid-conversation. Shows poster, merch and banner in a single photo."*
- **Motion on load:** the name lines rise in with a mask (overflow hidden, translateY 100% → 0, 900ms, staggered 80ms). The label and intro fade up afterwards. The image clip-reveals from bottom to top (`clip-path: inset(100% 0 0 0)` → `inset(0)`, 1100ms) while scaling 1.06 → 1.

### 5.3 Project 01: PM Kenya (inspo image 1 layout)

**Desktop:** 12-column grid. The **text panel takes columns 1–5** on a `--surface` card. The **mosaic takes columns 6–12** as a bento of 5 tiles.

```
┌──────────────────┬──────────┬──────────┐
│ 01               │    A     │    C     │
│                  │  (tall)  │          │
│ PM Kenya         │          ├──────────┤
│ Community Event  │          │    D     │
│                  ├──────────┤          │
│ desc…            │    B     ├──────────┤
│ tags             │          │    E     │
│ [View project →] │          │          │
└──────────────────┴──────────┴──────────┘
```

- The text panel is the same height as the mosaic. Content sits at the top (number, title) and bottom (description, tags, CTA), using `justify-between`.
- **Copy (dummy):**
  - Label: `01 — Community event`
  - Title: `PM Kenya`
  - Body: *"Event identity for Product Managers Kenya: posters, tees and a roll-up banner, all built from one visual system and delivered in a single sprint."*
  - Tags: `POSTER` `MERCH` `BANNER` `DIGITAL`
  - CTA: `View project →`
- **MediaSlots:**
  - **A (tall, 3:4):** *"Main event poster shot straight-on, printed and pinned to a textured wall, or as a clean flat digital render. This is the hero of the project."*
  - **B (4:3):** *"Candid waist-up photo of an attendee wearing the PM Kenya tee at the event, print clearly visible, with the crowd softly blurred behind."*
  - **C (1:1):** *"Roll-up banner standing at the venue entrance with people walking past for scale."*
  - **D (4:5):** *"Phone mockup or in-hand shot showing the Instagram poster or story version of the event artwork."*
  - **E (16:9):** *"Macro close-up of the tee print texture or a poster type detail, showing craft and finish."*
- **Mobile:** the text panel stacks first (number, title, body, tags), followed by a 2-column mosaic with A spanning two rows. The CTA becomes a full-width button below.

### 5.4 Project 02: Bigfoot Tees (inspo image 2 layout)

**Desktop:** a row of 3 images on top, with a `--surface` text band underneath. The images sit above the text panel.

```
┌──────────┬──────────┬──────────┐
│    A     │    B     │    C     │  ← equal height, 4:5 each
└──────────┴──────────┴──────────┘
┌────────────────────────────────┐
│ 02                             │
│ Bigfoot Tees      desc… (right)│
│                   tags   CTA   │
└────────────────────────────────┘
```

- **Copy (dummy):**
  - Label: `02 — Own business`
  - Title: `Bigfoot Tees`
  - Body: *"A custom tee side business I ran: briefs from real customers, turned into designs they paid for and actually wore. [X] tees, [Y] clients, plenty of repeat orders."*
  - Tags: `MERCH` `SOLD` (render `SOLD` as an inverted pill, ink background with light text, so it stands out)
  - CTA: `View project →`
- **MediaSlots:**
  - **A (4:5):** *"A customer wearing a Bigfoot custom tee outdoors in Nairobi, street setting, natural light, full or three-quarter body."*
  - **B (4:5):** *"Flat-lay of 4–6 different custom tees on a neutral surface, shot from above, showing range."*
  - **C (4:5):** *"Close-up of print texture, a neck label or a Bigfoot tag on folded tees."*
- **Mobile:** the image row becomes a horizontal scroll-snap carousel (peek the next card at 85% width), with the text band below.

### 5.5 Nobody asked: Swahili posters (inspo image 4 layout)

**Desktop:** the **left side (columns 1–4)** holds the label, a large title and a short paragraph. The **right side (columns 5–12)** is a **2×2 poster collage** with slightly varied sizes and offsets, so it reads as curated rather than a strict grid. Optionally, give the whole section a `--surface` background.

- **Copy (dummy):**
  - Label: `03 — Nobody asked`
  - Title: `Swahili, for fun.`
  - Body: *"A self-initiated series of typographic posters built around everyday Swahili and Sheng phrases. No client, no brief, just me playing with words I grew up with."*
  - Meta line: `Personal series · 2024–2025 · [N] posters`
  - CTA: `See the full series →`
- **MediaSlots (all 3:4 posters):**
  - **P1:** *"Bold black-and-white type poster, one phrase set large, high contrast."*
  - **P2:** *"A colourful poster from the series, showing the most playful one."*
  - **P3:** *"A poster with hand-lettered or experimental type."*
  - **P4:** *"The poster you're proudest of, ideally shot printed on a wall or held up."*
- **Layout detail:** on desktop, offset the right column of posters by `translateY(48px)` for a staggered rhythm.
- **Mobile:** title block first, then a 2-column grid (keep the stagger at a smaller offset).

### 5.6 Experiments (inspo image 3 layout)

**Desktop:** a 4×2 grid of square tiles, with a bottom row underneath: a **large title on the left** and a **short description on the right**, mirroring the inspo.

- **Copy (dummy):**
  - Title: `Experiments`
  - Body (right, max 40ch): *"Quick tests, side collections and new tools I'm playing with: motion, AI-assisted roughs, illustration and type studies."*
- **8 tiles (1:1).** Each tile has a hidden caption that fades in on hover (bottom-left, `caption` style, on a subtle gradient).
  - *T1: "Launch poster for [Product], version A of the matching pair."*
  - *T2: "Launch poster for [Product], version B."*
  - *T3: "Animated poster loop (muted autoplay MP4) — motion test."*
  - *T4: "Illustration piece from a personal collection."*
  - *T5: "AI-assisted rough next to the hand-finished final, side by side."*
  - *T6: "Type study or custom lettering."*
  - *T7: "Character or sticker illustration."*
  - *T8: "Matchday-style sports poster concept, which bridges toward the sports brand."*
- Tiles can hold an image **or** a muted looping video (`<video muted loop playsInline autoPlay>`, poster frame, pause when off-screen).
- **Mobile:** 2-column grid.

### 5.7 Why I'm the baddest

A full-bleed **off-black section** (`--bg-inverse`), which is the only dark moment on the page.

```
[label, muted-inverse]  04 — Why me

[display-ish statement, max ~18ch per line]
I make things people
pay to wear.

[body-lg, 3–4 short lines, max 52ch]
Dummy: I've run a custom tee business, dressed a whole community event,
and I make posters for fun on weekends. Give me a poster, a drop, a banner
and a screen on Monday and you'll have all four, finished properly, by Friday.

[3 proof stats in a row, separated by hairlines]
[X]+          |  4         |  [N]
tees sold     |  formats,  |  self-initiated
              |  one week  |  posters

[closing line, h3]  One idea for you: [specific idea for the brand].
```

- Count the stats up from 0 when they enter the viewport (800ms, eased). Skip this when reduced motion is on.
- The statement uses the same masked line-reveal as the hero.

### 5.8 Contact + footer

- Back on `--bg`. A large heading: `Let's make something people want to wear.`
- The **email** is shown huge (`h1` size) as a link, with an underline that draws in from the left on hover. Add a small `Copy` button beside it that shows a toast: "Email copied".
- A row of links: `Instagram` `Behance` `LinkedIn` `WhatsApp` `CV (PDF)`, each with an arrow that nudges ↗ on hover.
- **Footer row (hairline above):** `© 2026 [Your Name]` · `Nairobi, Kenya` · **live local time** `19:43 EAT` (updates every minute; a nice personal-portfolio detail) · `Back to top ↑`.

---

## 6. Project modal (the detail view)

Clicking any project card or CTA opens a modal. There are no new pages.

### 6.1 Behaviour

- **URL hash sync:** opening a modal sets `#project-slug` with `history.pushState`. Loading the page with a hash opens that modal directly. **The browser or phone back button closes the modal** (listen for `popstate`). This matters, because mobile users will press back.
- **Close methods:** the ✕ button (top-right, always visible, sticky), `Esc`, clicking the backdrop (desktop), and the back button.
- **Focus management:** trap focus inside, focus the ✕ on open, and return focus to the triggering card on close. Use `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing to the title.
- **Scroll lock** on body while open (compensate for scrollbar width to avoid layout shift). The modal scrolls internally.
- **Prev / Next** project buttons at the bottom of the modal (and `←` / `→` keys) swap content without closing.
- Images in the modal are lazy-loaded and only fetched when the modal opens.

### 6.2 Presentation

- **Desktop:** a large sheet that slides up from the bottom, covering ~94% of viewport height with a 12px top radius, over a dimmed backdrop (`rgba(20,20,20,0.4)`).
- **Mobile:** a full-screen sheet that slides up, with a small drag handle at the top. Swipe down to close is optional; implement it if simple with Motion's `drag="y"`.
- **Motion:** sheet `y: 100% → 0`, 500ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Backdrop fades in at 300ms. Content inside fades up with a 60ms stagger after the sheet lands.

### 6.3 Modal content template

```
[label]   01 — Community event · 2025
[h2]      PM Kenya
[tags]    POSTER  MERCH  BANNER  DIGITAL
[meta row: Role — Lead designer | Year — 2025 | Client — Product Managers Kenya]

──────────── hairline ────────────

[3 columns desktop / stacked mobile]
THE BRIEF          THE WRONG IDEA            THE RESULT
1–2 lines          1–2 lines                 1–2 lines

[Gallery]
- 1 full-width image (16:9)
- 2-up row (4:5 + 4:5)
- 1 full-width image or video
- 3-up detail row (1:1 ×3)
- optional: "Process" strip of small thumbnails (rejected directions)

[My role — short paragraph, max 60ch]

──────────── hairline ────────────
[← Previous project]                  [Next project →]
```

**Dummy modal copy, PM Kenya:**
- Brief: *"Give a growing PM community an event identity that feels like a movement, not a corporate meetup."*
- The wrong idea: *"Treated it like a streetwear drop instead of a conference: louder type, merch-first thinking."*
- Result: *"Posters, tees and banner delivered in one sprint. Attendees wore the tees long after the event."*

**Dummy modal copy, Bigfoot Tees:**
- Brief: *"Customers came with rough ideas: a nickname, an inside joke, a team. They wanted a tee they'd actually wear."*
- The wrong idea: *"Pushed every customer one step bolder than what they asked for."*
- Result: *"[X] tees sold, [Y] clients, repeat orders from word of mouth."*

**Dummy modal copy, Swahili posters:**
- Brief: *"None. Self-initiated."*
- The wrong idea: *"Taking everyday Swahili and Sheng as seriously as a luxury brand takes its logo."*
- Result: *"[N] posters, shared by [X] people, and a few requests to buy prints."*

Modal gallery MediaSlots must also have descriptions. Write 4–8 per project in `content.ts`, following the same tone as §5 (for example, *"Side-by-side: the safe first draft vs the final pushed version"*).

---

## 7. Components

```
components/
  Nav.tsx
  MobileMenu.tsx
  Hero.tsx
  ProjectSplit.tsx        // inspo 1: text panel + bento mosaic
  ProjectStacked.tsx      // inspo 2: image row + text band
  NobodyAsked.tsx         // inspo 4: title left + staggered posters
  ExperimentsGrid.tsx     // inspo 3: 4×2 tiles + title/description row
  WhyMe.tsx
  Contact.tsx
  Footer.tsx
  ProjectModal.tsx
  MediaSlot.tsx           // image | video | placeholder
  Tag.tsx
  Reveal.tsx              // scroll-reveal wrapper
  SplitTextReveal.tsx     // masked line reveal for big headings
  CursorLabel.tsx         // "View" pill that follows the cursor over project media (desktop only)
  LocalTime.tsx
lib/
  content.ts              // ALL copy + media definitions
  useHashModal.ts         // hash ⇄ modal state, popstate handling
  useScrollDirection.ts
  useReducedMotion.ts (or Motion's built-in)
app/
  layout.tsx              // DM Sans, metadata, OG
  page.tsx
  globals.css             // tokens
public/
  images/                 // real images go here later
  og.jpg
```

### 7.1 `MediaSlot` (the key component)

```ts
type Media =
  | { kind: 'image'; src: string; alt: string; width: number; height: number }
  | { kind: 'video'; src: string; poster: string; alt: string }
  | { kind: 'placeholder'; tone: string; description: string; ratio: string };
```

**Placeholder rendering:**
- A solid `tone` block at the given `aspect-ratio`, 6px radius.
- Centred or bottom-left inside it: a small `label` reading `IMAGE`, followed by the `description` in `caption` size, `--ink-soft`, max 32ch.
- Add a faint 1px inner border (`--line`) so placeholders feel deliberate.
- Placeholders must still get the same hover and reveal animations as real images, so the motion can be judged before real images exist.

**Real images:** `next/image` with `sizes` set correctly per layout, `placeholder="blur"` (generate blurDataURL or use a dominant colour), and `alt` text required.

### 7.2 Content model (`lib/content.ts`)

```ts
export type Project = {
  slug: string;               // 'pm-kenya'
  number: string;             // '01'
  label: string;              // 'Community event'
  title: string;
  summary: string;
  tags: ('POSTER'|'MERCH'|'BANNER'|'DIGITAL'|'SOLD'|'CONCEPT')[];
  year: string;
  role: string;
  client?: string;
  brief: string;
  wrongIdea: string;
  result: string;
  roleDetail: string;
  cover: Media[];             // the media shown on the homepage layout
  gallery: Media[];           // the media shown in the modal
  process?: Media[];
};

export const site = { name, role, location, intro, email, socials, available: true };
export const projects: Project[] = [ /* pm-kenya, bigfoot-tees, nobody-asked */ ];
export const experiments: Media[] = [ /* 8 tiles */ ];
export const whyMe = { statement, body, stats: [{ value, suffix, label }], closingIdea };
```

Every piece of text and media on the site must come from this file. Nothing is hard-coded in components.

---

## 8. Motion system

The overall feel is slow, smooth and confident. One easing curve is used everywhere.

```ts
export const ease = [0.22, 1, 0.36, 1];   // easeOutQuint-ish
export const dur = { fast: 0.3, base: 0.6, slow: 0.9, reveal: 1.1 };
```

| Element | Animation | Trigger |
|---|---|---|
| Section text | Fade + `y: 24px → 0`, 600ms, 60–80ms stagger between children | In view (15% visible), **once** |
| Big headings | Masked line reveal (each line `y: 100% → 0` inside `overflow: hidden`) | In view, once |
| Image tiles | `clip-path: inset(8% 8% 8% 8% round 6px)` → `inset(0 round 6px)` + scale `1.08 → 1`, 1100ms, staggered 80ms in mosaics | In view, once |
| Image hover (desktop) | Inner image `scale: 1 → 1.03`, 700ms. Card text untouched | Hover |
| Cursor label | A small ink pill reading `View` follows the cursor with spring smoothing over project media | `pointer: fine` only |
| CTA links | Arrow `x: 0 → 4px`; underline draws left → right (`scaleX`, origin left) | Hover / focus |
| Nav | Hide or show on scroll direction; border fades in after 24px | Scroll |
| Stats | Count up | In view, once |
| Modal | See §6.2 | Open / close |

**Rules:**
- **Respect `prefers-reduced-motion`.** Turn off transforms and clip reveals, keep only opacity fades of 200ms or less, and turn off the count-up and cursor label.
- Animate only `transform`, `opacity` and `clip-path`. Never animate layout properties.
- No parallax on text. Optional, very light parallax on the hero image only (max 40px of travel).
- No scroll-jacking. Native scroll. (Lenis smooth scroll is **optional**. If used, keep `lerp` around 0.1 and turn it off when reduced motion is on and on touch devices.)
- Nothing should loop or bounce, apart from video tiles.

---

## 9. UX and accessibility checklist

- [ ] Semantic landmarks: `header`, `nav`, `main`, `section` (each with `aria-labelledby`), `footer`.
- [ ] One `h1` (the name in the hero). Project titles are `h2`.
- [ ] All interactive cards are real `<button>`s or `<a>`s with visible `:focus-visible` rings (2px `--ink` outline, 3px offset).
- [ ] Skip-to-content link.
- [ ] Every image has meaningful `alt`. Decorative ones get `alt=""`.
- [ ] Videos are muted, have no audio, include `playsInline`, and pause when off-screen or under reduced motion.
- [ ] Tap targets are at least 44×44px.
- [ ] Colour contrast is AA throughout (check muted text).
- [ ] The modal is fully keyboard operable, with the focus trap and return described in §6.1.
- [ ] Content stays readable at 200% zoom. No horizontal overflow at 320px width.
- [ ] Hover-only information (experiment captions) is also available on focus and is visible by default on touch devices.

---

## 10. Performance

- Lighthouse targets: **Performance ≥ 90 on mobile**, Accessibility 100, Best Practices 100, SEO 100.
- LCP element is the hero image: `priority`, correct `sizes`, under 250KB AVIF.
- Lazy load everything below the hero. Modal galleries load only when opened.
- Videos are under 3MB each, H.264 MP4 plus a WebM fallback, with a poster frame.
- Use only the DM Sans subsets and weights actually needed (`latin`).
- No layout shift: every MediaSlot reserves its aspect ratio.

---

## 11. SEO and sharing

- `<title>`: `[Your Name] — Graphic Designer, Nairobi`.
- Meta description: one line from the hero intro.
- An OG image of 1200×630, using the off-white background, the name in DM Sans and one strong work image. Recruiters will share the link on WhatsApp, so this preview matters.
- Favicon: a simple monogram in off-black on off-white.
- `robots.txt` and `sitemap.xml`.

---

## 12. Build phases

1. **Foundation.** Next.js, Tailwind, DM Sans, tokens in `globals.css`, base layout, container and grid utilities, `content.ts` with all dummy copy and placeholder media.
   *Done when:* the page renders every section in order with placeholder blocks and correct spacing, on mobile and desktop.
2. **Sections.** Build each section component to match its inspo layout (§5), using placeholders.
   *Done when:* the layouts match the inspo structure at `sm`, `md`, `lg` and `xl`, with no overflow.
3. **Modal.** `ProjectModal` with hash sync, back-button close, focus trap, prev/next and gallery template.
   *Done when:* every behaviour in §6.1 works on desktop and on a mobile device or emulator.
4. **Motion.** Reveal, hover, cursor label, nav and stats animations (§8), plus the reduced-motion path.
   *Done when:* the motion feels calm with no jank at 60fps, and reduced motion is verified.
5. **Polish.** Accessibility checklist (§9), performance pass (§10), SEO and OG (§11), live clock, copy-email toast.
6. **Handover.** Write a short `README.md` covering how to swap content (§13).

---

## 13. Swapping in real content (README section)

1. Put images in `public/images/<project-slug>/`.
2. In `lib/content.ts`, change a media entry from
   `{ kind: 'placeholder', tone, description, ratio }`
   to
   `{ kind: 'image', src: '/images/pm-kenya/hero.jpg', alt: '…', width, height }`.
3. Keep the **same aspect ratio** as the placeholder, or update `ratio`.
4. **Recommended export sizes:** full-width images at 2400px on the long edge, mosaic tiles at 1600px, experiment tiles at 1200×1200. Export as JPG at 80% quality (or AVIF), sRGB colour space.
5. Edit the dummy copy in `content.ts`. Every `[bracket]` placeholder (numbers, names, years) needs real values.

---

## 14. Benchmarks: patterns to borrow

These come from well-regarded studio and personal portfolios (agency case-study sites such as Pentagram, Collins and Koto, plus personal portfolios featured on Awwwards, Siteinspire and Godly):

- **Images first, text after.** Project sections open with media and keep copy to a few lines.
- **Very generous vertical spacing** between projects, so each one feels like its own moment.
- **Numbered projects** (`01`, `02`…) in small uppercase labels, which gives a sense of order without a menu.
- **Neutral frame, colourful work.** The interface stays monochrome.
- **One inverted dark section** used as a punctuation mark (here, "Why me").
- **A huge, clickable email** as the contact moment, with no contact form.
- **Small human details:** live local time, an availability status, a "back to top" link.
- **A cursor label** ("View") over clickable media, instead of extra buttons.
- **Consistent case-study structure** (brief, idea, result) so reviewers can compare projects quickly.

**Avoid:** custom cursors that hide the real cursor, preloaders, scroll-jacking, heavy WebGL, autoplaying audio, and more than one typeface.

---

## 15. Inspo reference notes (layout only)

| Inspo | Structure to copy | Used for |
|---|---|---|
| Image 1, "First Project" | Text panel on the left (number, large title, short body) + bento mosaic of mixed-size images on the right, tight gaps | §5.3 PM Kenya |
| Image 2, "Second Project" | Row of 3 images on top, wide text band below with the title on the left and description on the right, small project number in the corner | §5.4 Bigfoot Tees |
| Image 3, "Illustration" | 4×2 grid of square tiles, large title bottom-left, short description bottom-right | §5.6 Experiments |
| Image 4, "Tipografi" | Large title and paragraph on the left, a collage of 4 posters on the right with varied sizes and offsets | §5.5 Nobody asked |

**Ignore from the inspos:** the red and teal colour schemes, script and display fonts, drop shadows, mockup frames, stock photography. Our version is off-white and off-black, uses DM Sans only, and is cleaner and more spacious.
