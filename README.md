# Tetheric Systems

The website of Tetheric Systems Private Limited — the company behind SeerFlow and Auctra. AI, automation and robotics.

## Brand system

Everything is drawn from the official logo:

- **Logo** — `lib/brand.ts` holds the traced TETHERIC wordmark, the three-bar monogram and the lockup text. `components/brand/logo.tsx` renders the `Wordmark`, full `Lockup` and `BrandMark`; the favicon, Apple icon and Open Graph image use the same geometry.
- **Colour** — navy ink `#111D29`, a blue → cyan accent (`#0A4FA0 → #20D2EE`) and white. Tokens live in `app/base.css`.
- **Type** — Saira (extended, squared display), Montserrat (text and wide-tracked labels) and IBM Plex Mono (record codes), loaded with `next/font`.

## Pages

- `/` — product family home: intro loader, realtime 3D monogram (Babylon.js), pinned logo sequence, products, principles and journal
- `/about`, `/philosophy` — company and beliefs
- `/blog`, `/blog/[slug]` — the journal: built-in essays in `lib/blog.ts` plus articles published from the studio
- `/records/seerflow`, `/records/auctra`, `/methodology`, `/security` — public product records and standards

`/evidence` and `/records/foundry` redirect to `/about` and `/records/auctra`.

## Journal Studio (`/admin`)

A password-protected editor for the journal. Write an article, drop in a cover photo and inline pictures, preview it exactly as it will appear, then press **Publish** — `/blog`, the article page, the homepage journal and the sitemap refresh immediately. Drafts, unpublish and delete are supported; ⌘S saves a draft.

Production needs two environment variables on the Vercel project:

- `BLOB_READ_WRITE_TOKEN` — added automatically when a Vercel Blob store is connected to the project. Articles are stored as JSON under `cms/posts/`, photos under `journal/`.
- `ADMIN_PASSWORD` — the studio sign-in password. Changing it signs everyone out. `ADMIN_SESSION_SECRET` is optional and overrides the cookie signing key.

With `npm run dev` and no `ADMIN_PASSWORD`, the studio opens without signing in and saves to the git-ignored `.data/` folder, so you can try it locally.

## Motion

GSAP (ScrollTrigger, SplitText, DrawSVG) drives scroll choreography, Lenis smooths scrolling, Framer Motion (`motion`) handles pointer interactions and layout transitions, and anime.js runs the signal field and lockup drawing. Declarative hooks — `data-split`, `data-reveal`, `data-fill`, `data-count`, `data-horizontal`, `data-scramble` — are wired in `components/motion/site-motion.tsx`. Everything respects `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm test
npm run build
```

## Deployment

Configured for Vercel. Production domain: `tethericsystems.com`.
