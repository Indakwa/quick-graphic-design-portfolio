/**
 * ALL copy and media for the site lives here.
 * Nothing user-facing is hard-coded in components.
 *
 * Anything in [square brackets] is dummy content that needs a real value.
 * See README.md → "Swapping in real content".
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Media =
  | {
      kind: 'image';
      src: string;
      alt: string;
      width: number;
      height: number;
      /** Optional tiny base64 image for a blur-up placeholder. */
      blurDataURL?: string;
    }
  | {
      kind: 'video';
      src: string; // H.264 MP4
      webm?: string; // optional WebM fallback
      poster: string;
      alt: string;
      ratio: string; // e.g. '1/1'
    }
  | {
      kind: 'placeholder';
      tone: string;
      description: string;
      ratio: string; // e.g. '3/4'
      /** Recommended export size in px (width × height), shown on the placeholder. */
      size: [number, number];
      /** Short code shown on the placeholder so it can be matched to the README table, e.g. 'PMK-A'. */
      slot?: string;
      /** Shows "VIDEO" instead of "IMAGE" on the placeholder. */
      video?: boolean;
    };

export type Tag = 'POSTER' | 'MERCH' | 'BANNER' | 'DIGITAL' | 'SOLD' | 'CONCEPT';

export type Project = {
  slug: string;
  number: string;
  label: string;
  title: string;
  summary: string;
  tags: Tag[];
  year: string;
  role: string;
  client?: string;
  /** Optional extra line under the summary (used by "Nobody asked"). */
  meta?: string;
  cta: string;
  brief: string;
  wrongIdea: string;
  result: string;
  roleDetail: string;
  /** Media shown in the homepage layout. */
  cover: Media[];
  /** Media shown in the modal. Laid out in a repeating 1 / 2 / 1 / 3 rhythm. */
  gallery: Media[];
  process?: Media[];
};

/* ------------------------------------------------------------------ */
/*  Placeholder helpers (temporary)                                    */
/* ------------------------------------------------------------------ */

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

/**
 * Export size (width × height, px) for each slot shape. Roughly 2× the
 * largest size the slot is shown at, so images stay sharp on retina screens.
 */
const exportSizes: Record<string, [number, number]> = {
  '16/9': [2400, 1350],
  '3/2': [1500, 1000],
  '4/3': [1600, 1200],
  '1/1': [1200, 1200],
  '4/5': [1200, 1500],
  '3/4': [1200, 1600],
  '2/3': [1200, 1800],
};

export function exportSize(ratio: string): [number, number] {
  if (exportSizes[ratio]) return exportSizes[ratio];
  const [w, h] = ratio.split('/').map(Number);
  return w >= h ? [1600, Math.round((1600 * h) / w)] : [Math.round((1600 * w) / h), 1600];
}

let toneIndex = 0;
/** Placeholder media block. Tones rotate automatically. */
function ph(ratio: string, description: string, opts: { video?: boolean; slot?: string } = {}): Media {
  const tone = placeholderTones[toneIndex++ % placeholderTones.length];
  return { kind: 'placeholder', tone, description, ratio, size: exportSize(ratio), ...opts };
}

/* ------------------------------------------------------------------ */
/*  Site                                                               */
/* ------------------------------------------------------------------ */

export const site = {
  name: 'Indakwa Benedict',
  /** Short name shown top-left in the nav. */
  wordmark: 'Indakwa',
  /** Hero name, one entry per line. */
  nameLines: ['Indakwa', 'Benedict.'],
  initials: 'IB',
  role: 'Creative Designer',
  location: 'Nairobi, Kenya',
  city: 'Nairobi',
  heroLabel: 'Creative Designer — Nairobi, Kenya',
  intro: 'I believe good design takes something complicated and makes it look easy.',
  disciplines: ['Posters', 'Merch', 'Event', 'Digital'],
  email: 'hello@yourname.com',
  /** Used for metadata, OG tags and the sitemap. */
  url: 'https://yourname.com',
  /** Shows the "● Available · Nairobi" pill in the nav and mobile menu. */
  available: false,
  availableLabel: 'Available',
  timeZone: 'Africa/Nairobi',
  timeZoneLabel: 'EAT',
  copyrightYear: '2026',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/[handle]' },
    { label: 'Behance', href: 'https://behance.net/[handle]' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/[handle]' },
    { label: 'WhatsApp', href: 'https://wa.me/[2547XXXXXXXX]' },
    { label: 'CV (PDF)', href: '/cv.pdf' },
  ],
  /**
   * Big image under the hero text. Set to null to hide it.
   * To bring it back, replace null with:
   *   ph('16/9', 'Wide hero shot from the PM Kenya event: the roll-up banner in frame, attendees wearing the event tees, warm natural light, real people mid-conversation.')
   * or a real { kind: 'image', … } entry (2400 × 1350 px).
   */
  heroMedia: null as Media | null,
};

export const nav = {
  links: [
    { id: 'work', label: 'Work' },
    { id: 'play', label: 'Nobody asked' },
    { id: 'why-me', label: 'Why me' },
    { id: 'contact', label: 'Contact' },
  ],
};

/** Small UI strings. */
export const ui = {
  skipToContent: 'Skip to content',
  menuOpen: 'Menu',
  menuClose: 'Close',
  scroll: 'Scroll',
  cursorView: 'View',
  imageLabel: 'Image',
  videoLabel: 'Video',
  modal: {
    close: 'Close project',
    brief: 'The brief',
    wrongIdea: 'The wrong idea',
    result: 'The result',
    myRole: 'My role',
    process: 'Process — rejected directions',
    role: 'Role',
    year: 'Year',
    client: 'Client',
    prev: 'Previous project',
    next: 'Next project',
    dragHint: 'Drag down to close',
  },
  lightbox: {
    label: 'Image viewer',
    close: 'Close image',
    prev: 'Previous image',
    next: 'Next image',
    open: (desc: string) => `View larger: ${desc}`,
  },
  copy: 'Copy',
  copied: 'Email copied',
  backToTop: 'Back to top',
  openProject: (title: string) => `Open ${title} project`,
};

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: 'pm-kenya',
    number: '01',
    label: 'Community event',
    title: 'Product Managers Kenya',
    summary:
      'Event identity for Product Managers Kenya: posters, tees and a roll-up banner, all built from one visual system and delivered in a single sprint.',
    tags: ['POSTER', 'MERCH', 'BANNER', 'DIGITAL'],
    year: '2025',
    role: 'Lead designer',
    client: 'Product Managers Kenya',
    cta: 'View project',
    brief:
      'Give a growing PM community an event identity that feels like a movement, not a corporate meetup.',
    wrongIdea:
      'Treated it like a streetwear drop instead of a conference: louder type, merch-first thinking.',
    result:
      'Posters, tees and banner delivered in one sprint. Attendees wore the tees long after the event.',
    roleDetail:
      'I led the identity end to end: concept, type system, poster series, tee graphics and the roll-up banner, then prepared every file for print and social. [Add who you worked with and anything you’d do differently.]',
    cover: [
      ph('2/3', 'Main event poster shot straight-on, printed and pinned to a textured wall, or as a clean flat digital render. This is the hero of the project.', { slot: 'PMK-A' }),
      ph('1/1', 'Candid photo of an attendee wearing the PM Kenya tee at the event, print clearly visible, with the crowd softly blurred behind.', { slot: 'PMK-B' }),
      ph('1/1', 'Roll-up banner standing at the venue entrance with people walking past for scale.', { slot: 'PMK-C' }),
    ],
    gallery: [
      ph('16/9', 'The full system laid out flat: poster, tee, banner and social tiles side by side, so the shared visual language is obvious at a glance.'),
      ph('4/5', 'Main poster as a clean digital render, full colour, no mockup.'),
      ph('4/5', 'The same poster printed and pinned up at the venue, shot at an angle in real light.'),
      ph('16/9', 'Wide crowd shot at the event with several attendees wearing the tee: proof it was actually worn.'),
      ph('1/1', 'Detail: the type lockup on the poster, cropped tight.'),
      ph('1/1', 'Detail: tee print on fabric, close enough to see the ink.'),
      ph('1/1', 'Detail: the roll-up banner base with the event date and venue.'),
    ],
    process: [
      ph('4/5', 'Rejected direction 1: the safe, corporate-conference first draft.'),
      ph('4/5', 'Rejected direction 2: a version with too many colours.'),
      ph('4/5', 'Side-by-side: the safe first draft vs the final pushed version.'),
      ph('4/5', 'Early thumbnail sketches or type explorations.'),
    ],
  },
  {
    slug: 'bigfoot-tees',
    number: '02',
    label: 'Own business',
    title: 'Bigfoot Tees',
    summary:
      'A custom tee side business I ran: briefs from real customers, turned into designs they paid for and actually wore. [X] tees, [Y] clients, plenty of repeat orders.',
    tags: ['MERCH', 'SOLD'],
    year: '[2023–2025]',
    role: 'Founder & designer',
    cta: 'View project',
    brief:
      'Customers came with rough ideas: a nickname, an inside joke, a team. They wanted a tee they’d actually wear.',
    wrongIdea: 'Pushed every customer one step bolder than what they asked for.',
    result: '[X] tees sold, [Y] clients, repeat orders from word of mouth.',
    roleDetail:
      'Everything: taking briefs over WhatsApp, designing, sourcing blanks, working with the printer, pricing, delivery and the Instagram page. [Add a line about the best-selling design or a favourite client story.]',
    cover: [
      ph('4/5', 'A customer wearing a Bigfoot custom tee outdoors in Nairobi, street setting, natural light, full or three-quarter body.', { slot: 'BIG-1' }),
      ph('4/5', 'Flat-lay of 4–6 different custom tees on a neutral surface, shot from above, showing range.', { slot: 'BIG-2' }),
      ph('4/5', 'Close-up of print texture, a neck label or a Bigfoot tag on folded tees.', { slot: 'BIG-3' }),
    ],
    gallery: [
      ph('16/9', 'A group of customers wearing their custom tees together: a team, a friend group or a family event.'),
      ph('4/5', 'Customer brief screenshot (WhatsApp message, anonymised) next to…'),
      ph('4/5', '…the finished tee design that came out of it.'),
      ph('16/9', 'Wide flat-lay of the full range of designs, arranged in a neat grid.'),
      ph('1/1', 'Detail: the Bigfoot neck label or swing tag.'),
      ph('1/1', 'Detail: packaging or the delivery bag with the tee folded inside.'),
      ph('1/1', 'Detail: the Bigfoot Instagram grid on a phone.'),
    ],
    process: [
      ph('4/5', 'Side-by-side: what the customer asked for vs the bolder version they chose.'),
      ph('4/5', 'Print test or misprint you learned from.'),
      ph('4/5', 'Sketchbook page with rough tee ideas.'),
    ],
  },
  {
    slug: 'nobody-asked',
    number: '03',
    label: 'Nobody asked',
    title: 'Karibu Kenya',
    summary:
      'A self-initiated series of relatable, everyday Kenyan phrases with bold cartoon illustrations.',
    meta: 'Personal series · 2024–2025 · [N] posters',
    tags: ['POSTER', 'CONCEPT'],
    year: '2024–2025',
    role: 'Self-initiated',
    cta: 'See the full series',
    brief: 'None. Self-initiated.',
    wrongIdea:
      'Taking everyday Swahili and Sheng as seriously as a luxury brand takes its logo.',
    result: '[N] posters, shared by [X] people, and a few requests to buy prints.',
    roleDetail:
      'A weekend habit: pick a phrase, set it, push it until it feels like it belongs on a wall. [Add your favourite phrase and what it means.]',
    cover: [
      ph('3/4', 'Karibu Kenya poster 1.', { slot: 'KK-1' }),
      ph('3/4', 'Karibu Kenya poster 2: the most playful one.', { slot: 'KK-2' }),
      ph('3/4', 'Karibu Kenya poster 3.', { slot: 'KK-3' }),
      ph('3/4', 'The poster you’re proudest of, ideally shot printed on a wall or held up.', { slot: 'KK-4' }),
    ],
    gallery: [
      ph('16/9', 'The whole series pinned up together on one wall, shot straight-on.'),
      ph('3/4', 'Poster from the series, flat digital render.'),
      ph('3/4', 'Poster from the series, flat digital render.'),
      ph('16/9', 'Animated version of one poster (muted loop) — or a printed poster held up in a street setting.', { video: true }),
      ph('1/1', 'Detail: letterform close-up from the most experimental poster.'),
      ph('1/1', 'Detail: a phrase and its translation, set small at the bottom of a poster.'),
      ph('1/1', 'Screenshot of a share or repost on Instagram (with permission).'),
    ],
    process: [
      ph('3/4', 'Notebook list of phrases you’ve collected.'),
      ph('3/4', 'Side-by-side: the first rough vs the final poster.'),
      ph('3/4', 'A rejected poster that didn’t make the series.'),
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

export const experiments = {
  title: 'Experiments',
  body: 'Quick tests, side collections and new tools I’m playing with: motion, AI-assisted roughs, illustration and type studies.',
  tiles: [
    { caption: 'Launch poster for [Product], version A of the matching pair.', media: ph('1/1', 'Launch poster for [Product], version A of the matching pair.', { slot: 'EXP-1' }) },
    { caption: 'Launch poster for [Product], version B.', media: ph('1/1', 'Launch poster for [Product], version B.', { slot: 'EXP-2' }) },
    { caption: 'Animated poster loop — motion test.', media: ph('1/1', 'Animated poster loop (muted autoplay MP4) — motion test.', { video: true, slot: 'EXP-3' }) },
    { caption: 'Illustration piece from a personal collection.', media: ph('1/1', 'Illustration piece from a personal collection.', { slot: 'EXP-4' }) },
    { caption: 'AI-assisted rough next to the hand-finished final.', media: ph('1/1', 'AI-assisted rough next to the hand-finished final, side by side.', { slot: 'EXP-5' }) },
    { caption: 'Type study / custom lettering.', media: ph('1/1', 'Type study or custom lettering.', { slot: 'EXP-6' }) },
    { caption: 'Character / sticker illustration.', media: ph('1/1', 'Character or sticker illustration.', { slot: 'EXP-7' }) },
    { caption: 'Matchday-style sports poster concept.', media: ph('1/1', 'Matchday-style sports poster concept, which bridges toward the sports brand.', { slot: 'EXP-8' }) },
  ],
};

export const whyMe = {
  label: '04 — Why me',
  statementLines: ['I make things people', 'pay to wear.'],
  body: 'I’ve run a custom tee business, dressed a whole community event, and I make posters for fun on weekends. Give me a poster, a drop, a banner and a screen on Monday and you’ll have all four, finished properly, by Friday.',
  // Values are dummy numbers so the count-up can be judged. Replace with real ones.
  stats: [
    { value: 150, suffix: '+', label: 'tees sold [X]' },
    { value: 4, suffix: '', label: 'formats, one week' },
    { value: 12, suffix: '', label: 'self-initiated posters [N]' },
  ],
  closingIdea: 'One idea for you: [specific idea for the brand].',
};

export const contact = {
  heading: 'Let’s make something people want to wear.',
};
