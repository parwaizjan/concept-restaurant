# Decision Log

Append-only. Each entry: ID, date, decision, rationale, alternatives considered.

Context: `concept-restaurant` is the fourth entry in the Zuvo Web Studio Express
concept series (after `concept-laundry-shop`, `concept-bakery` and
`concept-salon`). It is built to be cloned and rebranded quickly for paying
restaurant clients. See `AGENTS.md` for the rules.

---

## D-R01 — Base: port `concept-salon`'s structure

- **Date:** 2026-10-05
- **Decision:** Build `concept-restaurant` from the structure and patterns of
  `concept-salon`: Astro Content Collections for menu/categories/page copy, a
  `src/data/site.ts` single source of truth, `src/i18n/ui.ts` UI catalog, a Google
  Sheet pipeline for owner-editable prices, and the same multi-page shape
  (home / menu / reserve / gallery / about / visit).
- **Rationale:** Salon is the newest sibling and already ships the Sheet reader,
  gallery, visit/map, i18n and date-time picker scaffolding on the current Astro 7
  toolchain. Its domain maps cleanly onto a restaurant (services≈menu,
  appointment≈table reservation). Reuse keeps turnaround fast.
- **Alternatives:** `concept-bakery` (same shape but older Astro 5 / npm —
  rejected: diverges from the locked toolchain); `concept-laundry-shop` (single-page
  - JSON catalogs — rejected: a restaurant needs a dedicated menu page and a
    reservation picker); building fresh (rejected: no reuse benefit).

## D-R02 — Visually distinct from salon and bakery

- **Date:** 2026-10-05
- **Decision:** The restaurant concept deliberately diverges in skin and layout:
  a **dark, warm, editorial** design (charcoal canvas, ember/terracotta primary,
  saffron accent), a cinematic full-bleed hero, an editorial **dotted-leader menu**,
  an asymmetric gallery, and a dedicated `/reserve` page carrying the party/date/time
  picker. Section order and component composition differ from salon/bakery.
- **Rationale:** User direction: the Express catalogue will look repetitive if every
  concept reuses the same layout. Reuse the architecture, not the skin.
- **Alternatives:** reuse salon's cream/rose skin (rejected by rule §3.11 and user
  direction); a light restaurant palette (rejected: less food-forward, less
  distinct from bakery).

## D-R03 — Toolchain: latest Astro 7 stack on pnpm

- **Date:** 2026-10-05
- **Decision:** Pin the current Astro 7 line: **Astro 7.3.5**, **Tailwind CSS
  4.3.3** via `@tailwindcss/vite` 4.3.3, **`@astrojs/cloudflare` 14.3.3**,
  **`@astrojs/sitemap` 3.7.4**, **`@astrojs/check` 0.9.10**, **TypeScript ^6.0.3**,
  **Node 22**, **pnpm 12.5.1**. `wrangler` pinned to one exact recent release that
  satisfies pnpm 12's 24h `minimumReleaseAge` gate.
- **Rationale:** Matches the sibling Astro 7 projects so the concepts share one
  mental model and one dependency surface.
- **TypeScript exception:** the registry's latest is TypeScript 7, but `astro check`
  still relies on the TypeScript 6 programmatic API. Pin `^6.0.3` until `astro check`
  supports TS 7.
- **Alternatives:** bakery's Astro 5 / npm (rejected); TypeScript 7 (blocked).

## D-R04 — Adapter and static output

- **Date:** 2026-10-05
- **Decision:** Use `@astrojs/cloudflare` with `output: 'static'`,
  `session: false` and `imageService: 'compile'`. All routes are prerendered; no
  on-demand/SSR code ships.
- **Rationale:** The current official Cloudflare integration; `session: false`
  avoids a KV namespace and `compile` optimizes imported content images at build
  time without the Cloudflare Images binding. Keeps hosting free.
- **Alternatives:** adapter-less static `dist/` (works, but diverges from the Astro
  7 siblings); SSR (rejected: breaks the zero-cost/static rule).

## D-R05 — Core feature set

- **Date:** 2026-10-05
- **Decision:** The demo showcases: **menu with prices**, **photo gallery**,
  **WhatsApp table reservation request**, **daily/signature specials**, **location
  and directions**, and **testimonials**. Chef profiles are **out** of the baseline
  (paid add-on on express, like stylist profiles for salons).
- **Rationale:** Exactly matches the restaurant offer already published in
  `zuvo-studio-express/src/data/categories.ts` (menu, gallery, reservation/enquiry
  button, location). No feature here contradicts what is sold.
- **Alternatives:** online ordering/cart (rejected: express sells this as a paid
  add-on, not baseline); chef profiles (rejected: add-on, more content per clone).

## D-R06 — Reservation flow: WhatsApp + party size + date/time, no calendar

- **Date:** 2026-10-05
- **Decision:** The visitor picks a **party size (1–8)**, a **preferred date** and
  one **preferred time**, optionally an occasion and a note, and taps a WhatsApp
  button. WhatsApp opens with a fully formed reservation request addressed to the
  restaurant. No calendar sync, no availability check, no payment. The owner
  confirms the real table in chat. **Parties larger than 8** cannot be submitted
  through the form; the page shows a prominent "message us on WhatsApp" enquiry
  button instead.
- **Rationale:** Matches how Sri Lankan restaurants already take bookings and keeps
  the site static and free. The party-size cap avoids promising large-table
  availability the owner has not confirmed.
- **Alternatives:** plain "chat on WhatsApp" only (rejected: weaker pitch); real
  table-booking/calendar (deferred, express add-on); no cap (rejected: large parties
  need the owner's judgment).

## D-R07 — Delivery-app links: configurable, shown as placeholders in the demo

- **Date:** 2026-10-05
- **Decision:** `src/data/site.ts` exposes `ordering.apps` — a list of
  `{ name, url }` links to third-party delivery/ordering services (PickMe Food,
  Uber Eats, Foodpanda, …). The demo renders the block with **placeholder dead
  links** (`#`) so prospective owners see the feature exists. A clone fills in the
  restaurant's real links, or empties the list to hide the block.
- **Rationale:** Express markets delivery-app linking as supported. Showing it in
  the demo communicates the capability without building a cart or checkout.
- **Alternatives:** omit delivery links entirely (rejected: hides a supported
  feature); build in-site ordering (rejected: paid add-on, needs a backend).

## D-R08 — Owner edits the menu and prices via a Google Sheet

- **Date:** 2026-10-05
- **Decision:** The dish list and live prices come from a shared, free Google
  Sheet. The demo fetches the public Sheet in the browser at runtime
  (`mode: "runtime"`); production clones fetch during the build and redeploy
  (`mode: "build"`). Leaving `sheetId` empty runs entirely from the content
  collections. The owner edits price, availability and a "special" flag; they do not
  add new categories or dishes.
- **Rationale:** Restaurant prices and specials change often; the owner must update
  them for free with minimal tech skill, and no CMS may be introduced. Same proven
  mechanism as bakery/salon.
- **Alternatives:** agency-managed files only (rejected: slower); a CMS/admin
  (rejected by rule §3.4).

## D-R09 — English first, translation-ready

- **Date:** 2026-10-05
- **Decision:** Ship **English only** in the demo: `locale.enabled: ['en']`. The
  `Locale` type is `'en' | 'si' | 'ta'`, localized fields (`LocalizedText`) exist on
  all content, `src/i18n/ui.ts` is structured for `si`/`ta`, and locale routing is
  configured so enabling a language is a config + content change, never a refactor.
- **Rationale:** User direction: English first, translations later, but easy to add.
  Matches salon/bakery architecture and the express add-on pricing for languages.
- **Alternatives:** trilingual now (rejected: translations not yet available);
  English-only hardcoded (rejected: violates rule §3.6).

## D-R10 — Demo brand is invented: Spice & Ember

- **Date:** 2026-10-05
- **Decision:** The demo uses an invented placeholder restaurant: **Spice & Ember**,
  a modern Sri Lankan restaurant at 18 Galle Face Terrace, Colombo 03, LKR pricing.
  Real clone values replace it via `docs/CUSTOMIZATION.md`.
- **Rationale:** The concept must be pitchable without a real client and must never
  use another business's trademark. "Spice & Ember" reads modern, local and
  food-forward, and fits the ember palette.
- **Alternatives:** use a real restaurant (rejected: permissions/trademark); no
  brand (rejected: weaker demo).

## D-R11 — Design direction: dark warm editorial (charcoal + ember + saffron)

- **Date:** 2026-10-05
- **Decision:** Warm near-black charcoal canvas, warm off-white text, an
  ember/terracotta primary and a saffron secondary. Full-bleed food photography,
  editorial menu typography with dotted price leaders, hairline rules, minimal
  shadows. Bold, modern display type for headings (Bricolage Grotesque) with a clean
  sans body (Inter).
- **Rationale:** User chose option (a): moody and food-first. Distinct from
  laundry-blue, bakery-crumb and salon-rose, and appropriate for an evening
  restaurant pitch.
- **Alternatives:** cream + deep green (rejected: closer to Express/salon family);
  clean modern + single accent (rejected: less distinctive).

## D-R12 — Demo domain, no indexing, private repo

- **Date:** 2026-10-05
- **Decision:** Deploy to **https://demo-restaurant.zuvo.lk** (`workers_dev: false`).
  `indexable: false` plus the `X-Robots-Tag: noindex` header in `public/_headers`
  keep the demo out of search. Worker name `concept-restaurant`; source is a private
  GitHub repo `parwaizjan/concept-restaurant`. Indexing turns on in three places only
  (see rule §3.5 and `docs/CUSTOMIZATION.md`).
- **Rationale:** Demo is a pitch tool shared by link; real clones want SEO. One flag
  plus one header plus `siteUrl` control both.
- **Alternatives:** index the demo (rejected by rule §3.5).

## D-R13 — Imagery: Canva AI-generated placeholders

- **Date:** 2026-10-05
- **Decision:** Demo imagery is generated with **Canva AI** from a fixed prompt set
  (see `docs/DESIGN-BRIEF.md` §"Image shot list & Canva prompts"), exported and
  optimized to WebP with a documented swap checklist. Images are pre-sized and
  served with plain `<img>`.
- **Rationale:** User direction: images will be generated in Canva via prompts.
  Gives a consistent, food-forward, legally safe demo without waiting on client
  photos.
- **Alternatives:** licensed stock (rejected by user direction); wait for client
  photos (rejected: blocks the demo).

## D-R14 — Documentation-first

- **Date:** 2026-10-05
- **Decision:** Write and maintain `AGENTS.md`, `README.md` and `/docs` **before**
  application code, and keep them current as the source of durable context.
- **Rationale:** Preserves decisions across conversations; required by the studio
  workflow and explicitly requested for this concept.
- **Alternatives:** code-first (rejected).

## D-R15 — Page structure (multi-page)

- **Date:** 2026-10-05
- **Decision:** Multi-page site: **Home** (`/`), **Menu** (`/menu`), **Reserve**
  (`/reserve`), **Gallery** (`/gallery`), **About** (`/about`), **Visit** (`/visit`),
  plus `404` and generated `robots.txt`. Privacy/Terms are deferred (see open
  questions).
- **Rationale:** A restaurant menu needs its own page; the reservation picker gets a
  dedicated `/reserve` page with entry points from the header, sticky bar and CTAs.
  Mirrors salon's multi-page shape but with a different hero, menu and reserve
  treatment.
- **Alternatives:** single-page with anchors (rejected: menus are long and benefit
  from a dedicated route and jump nav).

## D-R16 — No analytics in the concept

- **Date:** 2026-10-05
- **Decision:** The concept ships without analytics or pixels. Cloudflare Web
  Analytics and/or Meta Pixel may be added per client later behind config, with a
  privacy page added at the same time.
- **Rationale:** Keep the concept lean and avoid a required consent/privacy surface;
  analytics is not part of the restaurant pitch.
- **Alternatives:** ship Cloudflare Web Analytics now (deferred).

## D-R17 — Sticky reserve bar, no floating button

- **Date:** 2026-10-05
- **Decision:** On mobile, a sticky bottom **"Reserve a table"** bar carries the
  primary action (and a summary once a party size/date are chosen). There is no
  floating action button; every other CTA is an inline button.
- **Rationale:** Mirrors the sibling concepts' sticky bar, keeps the action
  thumb-reachable without competing floating elements.
- **Alternatives:** floating WhatsApp bubble (rejected: overlaps the sticky bar and
  competes with the reservation form).

## D-R18 — Menu presentation: editorial list with dietary and spice cues

- **Date:** 2026-10-05
- **Decision:** The menu renders as a category-grouped editorial list (dish name,
  short description, dotted leader, price) with optional image, **veg/non-veg**
  marker, **spice level (0–3)**, a **"chef's special"** tag and a **sold-out**
  state. A short **Specials** strip on the home page is driven by the Sheet's
  `special` flag. This is deliberately unlike salon's service cards.
- **Rationale:** Distinct visual identity (D-R02) and genuinely useful information
  for diners; both flags are cheap to maintain and come from the content collection.
- **Alternatives:** card grid like salon (rejected: too similar); no dietary/spice
  info (rejected: diners expect it).

## D-R19 — Manual rebrand checklist, no setup CLI

- **Date:** 2026-10-05
- **Decision:** Ship a documented manual rebrand checklist
  (`docs/CUSTOMIZATION.md`) and do **not** add a `pnpm setup` interactive CLI.
- **Rationale:** User direction: laundry's setup script was overkill; salon's manual
  checklist is sufficient and easier to trust.
- **Alternatives:** port `concept-laundry-shop`'s `scripts/setup.mjs` (rejected).

---

## D-R20 — Wrangler pinned to 4.147.0

- **Date:** 2026-10-05
- **Decision:** Pin `wrangler` to **4.147.0** (not 4.145.0 as first drafted in
  D-R03).
- **Rationale:** With no lockfile, `@astrojs/cloudflare@14.3.3` resolves the latest
  `@cloudflare/vite-plugin`, which requires `wrangler@^4.147.0`; 4.145.0 fails
  `astro check`/build at config load. 4.147.0 is the current latest and satisfies
  pnpm 12's `minimumReleaseAge` gate.
- **Alternatives:** pin an older `@cloudflare/vite-plugin` via `overrides` (extra
  pin, no benefit); stay on 4.145.0 (breaks the build).

## D-R21 — Placeholder imagery shipped as SVG; Canva AI rasters pending

- **Date:** 2026-10-05
- **Decision:** Ship branded **SVG placeholders** (hero, about, gallery, dish
  fallback) so the demo builds and reads well before the Canva AI photos exist. The
  OG image is a real 1200×630 JPEG generated from an SVG. The dish/gallery data
  layers already support dropping in real photos (`src/assets/dishes/`,
  `public/images/gallery/`) with no code change.
- **Rationale:** D-R13 chose Canva AI generation, but the images are not generated
  yet; the placeholder set keeps the demo presentable and the pipeline ready.
- **Alternatives:** block the build on generated imagery (rejected); ship no art
  (rejected: weak pitch).

## D-R22 — Canva AI photography delivered

- **Date:** 2026-10-05
- **Decision:** The Canva AI images are wired in. Imported JPG sources live at
  `src/assets/about.jpg`, `src/assets/dishes/*.jpg` and `src/assets/gallery/*.jpg`
  and are optimized to WebP variants by Astro at build. The hero is a public CSS
  background, so it was pre-converted to `public/images/hero.webp` and
  `hero-mobile.webp` (quality ~80); `public/og.jpg` stays JPG for crawlers. The
  replaced SVG placeholders were deleted; the generic `public/images/placeholder.svg`
  dish fallback remains. This supersedes D-R21's placeholder set.
- **Rationale:** Real food photography is the decisive trust signal for the
  restaurant pitch (D-R13); pre-sizing the hero keeps 3G page weight down where no
  build optimization applies.
- **Alternatives:** served the hero JPGs as-is (rejected: ~2.3× the bytes with no
  build optimization); converted every source to WebP by hand (rejected: Astro
  already does this for imported assets).

## D-R23 — No sticky reserve bar; header CTA is the mobile action

- **Date:** 2026-10-05
- **Decision:** Drop the mobile sticky **"Reserve a table"** bar (supersedes
  D-R17). The header **Reserve** CTA is the single primary mobile action; below `sm`
  it shows the short label **Reserve**, at `sm`+ the full **Reserve a table**, so it
  never wraps at 360px.
- **Rationale:** After reviewing mobile screenshots the sticky bar duplicated the
  header CTA and crowded the viewport. Removing it reduces weight and visual noise
  and fixes the cramped header button.
- **Alternatives:** keep the sticky bar (rejected: duplicate CTA); shrink it
  (rejected: still redundant).

## D-R24 — Specials are clickable, backed by a Menu "Specials" section

- **Date:** 2026-10-05
- **Decision:** Home **Today's specials** cards link to a new `/menu#specials`
  section that lists every `special: true` dish; the menu's category tabs gain a
  **Specials** chip that jumps to it. On desktop the strip has prev/next scroll
  arrows; mobile relies on swipe.
- **Rationale:** Cards that look tappable but do nothing hurt trust; a specials area
  gives them a destination and surfaces specials on the menu. Arrows make the
  desktop overflow discoverable (mobile already swipes).
- **Alternatives:** link each card to its category section (rejected: the dish is
  hard to find); no link (rejected: dead cards).

---

## Open questions

Copied from `AGENTS.md` §8 and tracked there:

- Setup CLI vs manual rebrand checklist (resolved: **manual**, see D-R19).
- Whether clones need Privacy/Terms pages.
- Sheet build trigger for production clones.
- Where `si`/`ta` dish names come from once translated.
- Capturing `public/demos/restaurant.webp` for express.
- Native-speaker review of translations before pitching.
- Final Canva AI prompt set before generating imagery.
