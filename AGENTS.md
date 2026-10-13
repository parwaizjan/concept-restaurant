# AGENTS.md

This file is the entry point for any AI agent or developer working in this
repository. Read it fully before making changes. It explains what this repository
is, what it is for, and the rules that must be preserved when it is cloned.

## 1. What this repo is

`concept-restaurant` is **a reusable reference/template website for small
restaurants in Sri Lanka**. It is a _concept_ that is pitched to real restaurant
owners. It is not a single restaurant's production site.

The business model is:

1. A prospective restaurant owner is shown the live demo.
2. If they like it, **this repo is cloned (it is a GitHub Template Repository)** and
   rebranded into that restaurant's real website.
3. Downtime between showing the demo and going live should be as close to zero as
   possible. Cloning + rebranding must be a quick, mechanical, repeatable process.

Because of this, the repository is optimized for **fast turnaround and low ongoing
cost**, not for one-off bespoke work.

- Demo site: `https://demo-restaurant.zuvo.lk`
- Hosting: Cloudflare Workers, custom domain via `*.zuvo.lk`
- Source: private GitHub repo (`parwaizjan/concept-restaurant`)
- Catalogue: listed on `express.zuvo.lk` (see `docs/EXPRESS-HANDOFF.md`)
- Target market: Sri Lankan restaurants (and the same structure reuses for cafés)
- Languages: **English first**, with first-class Sinhala (`si`) and Tamil (`ta`)
  structure already in place (see rule §3.6)

This is the fourth entry in the Zuvo Web Studio Express concept series, after
`concept-laundry-shop`, `concept-bakery` and `concept-salon`. It ports
`concept-salon`'s structure (see `docs/DECISIONS.md` D-R01) but must look and feel
**clearly distinct** from the salon and bakery demos (D-R02).

## 2. The one feature that sells this concept

**Table reservation requests via WhatsApp, with party size, a preferred date and a
preferred time.**

The visitor browses the menu, taps "Reserve a table", picks a party size (1–8), a
preferred date and one preferred time, optionally notes an occasion, and taps a
button that opens WhatsApp with a fully formed reservation request prefilled,
addressed to the restaurant. There is **no payment gateway, no backend, no calendar
sync, no contact form, no email**. The restaurant confirms the actual table in chat.

Parties larger than 8 cannot be submitted through the form; instead the page offers
a "message us on WhatsApp" enquiry button (see `docs/RESERVATION-FLOW.md`).

Everything else is presentation around this core flow. If a proposed change does
not serve "browse the menu → request a table → send on WhatsApp", question whether
it belongs.

## 3. Non-negotiable rules

These are product and business constraints. Do not violate them without explicit
human instruction recorded in this file.

1. **Zero running cost.** No paid services, no servers, no databases that cost
   money. The owner must be able to run the site on free tiers indefinitely.
2. **Static output only.** Astro renders to static HTML. No SSR, no server routes
   that require a running Worker at request time (Cloudflare's static asset serving
   is fine). This keeps hosting free and fast.
3. **WhatsApp-only reservations and enquiries.** No contact forms, no email
   endpoints, no checkout, no calendar integration. Requests are "enquiries only":
   the party size/date/time shown are a wish list and the owner confirms
   availability in chat.
4. **Owner must be able to update the menu and prices for free, with minimal tech
   skill.** The chosen mechanism is a Google Sheet (see `docs/CONTENT-AND-MENU.md`).
   Do not introduce a login/admin panel/CMS that adds cost or complexity for the
   owner. The owner does **not** add new menu categories or dishes themselves; new
   dishes and photos are sent to the developer.
5. **No indexing by default.** The concept/demo must not appear in search results.
   Cloning a real restaurant turns indexing on in **three** places together: set
   `indexable: true` in `src/data/site.ts`, **delete the `X-Robots-Tag: noindex`
   line from `public/_headers`**, and set `siteUrl` to the real domain. Missing any
   of the three keeps the site out of search results. See "Turning on indexing" in
   `docs/CUSTOMIZATION.md`. Never ship a demo with indexing on, and never ship a
   paid restaurant clone with indexing off.
6. **English first, translation-ready from day one.** The content model, UI string
   catalog and locale routing must all support `si` and `ta` even while only `en`
   is enabled. When translations are needed, enabling a locale should be a config
   change plus translated strings/content — never a structural change. Do not
   hardcode English copy into components. See `docs/ARCHITECTURE.md` §i18n.
7. **All restaurant-specific values live in one place.** Brand name, logo, colors,
   WhatsApp number, address, map, hours, socials, locales, Sheet ID and feature
   flags live in `src/data/site.ts` and the content collections. Components must not
   contain restaurant-specific literals.
8. **Low JavaScript.** The reservation form is small vanilla TS (no framework). Do
   not add a client framework (React/Vue/Svelte) unless a feature genuinely requires
   it and it is documented as a deliberate decision.
9. **Mobile-first.** Most visitors arrive on phones from Facebook/Instagram/WhatsApp
   links. Test every change at mobile widths first. Large tap targets; fast on 3G.
10. **Accessibility and SEO hygiene** (when indexable): semantic HTML, alt text,
    language attributes, per-page meta, accessible form controls. Accessibility
    always, regardless of indexability.
11. **Visually distinct from the other concepts.** The layout, section order, menu
    presentation and palette must not be a copy of `concept-salon` or
    `concept-bakery`. Reuse the architecture and toolchain; do not reuse the skin.
    See `docs/DESIGN-BRIEF.md`.

## 4. Toolchain (locked)

Porting `concept-salon`'s structure onto the same current Astro 7 toolchain. Full
rationale in `docs/DECISIONS.md`.

| Concern   | Choice                                                                       |
| --------- | ---------------------------------------------------------------------------- |
| Framework | Astro 7.3.x (`output: 'static'`)                                             |
| Styling   | Tailwind CSS v4.3.x via `@tailwindcss/vite`                                  |
| Adapter   | `@astrojs/cloudflare` 14.3.x (`session: false`, build-time `compile` images) |
| Fonts     | Fontsource variable, self-hosted                                             |
| Content   | Astro Content Collections (`src/content/*`)                                  |
| SEO       | `@astrojs/sitemap` + per-page meta                                           |
| Runtime   | Cloudflare Workers                                                           |
| Toolchain | Node 22, pnpm 12, TypeScript 6 (not 7 — see `astro check`)                   |

## 5. Where to change what

| You want to change...                                | Edit this                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Restaurant name, tagline, logo, colors, fonts        | `src/data/site.ts`, `src/styles/theme.css`, `public/logo.svg`                                   |
| WhatsApp number, phone, address, map, hours, socials | `src/data/site.ts`                                                                              |
| Delivery-app links and logos (PickMe/Uber Eats)      | `src/data/site.ts` (`ordering.apps`), `public/images/order/`                                    |
| Indexing on/off, sitemap, robots                     | `src/data/site.ts` (`indexable`), `src/pages/robots.txt.ts`, `public/_headers` (`X-Robots-Tag`) |
| Enabled languages / default language                 | `src/data/site.ts`, `astro.config.mjs`                                                          |
| Menu categories, dishes, prices (source of truth)    | `src/content/menu/`, `src/content/categories/`, `src/assets/`                                   |
| Live prices / sold-out / specials (owner)            | Google Sheet (documented in `docs/CONTENT-AND-MENU.md`)                                         |
| UI labels, buttons, nav, reservation message copy    | `src/i18n/ui.ts` (all enabled languages)                                                        |
| Sample ribbon / demo source tag                      | `src/components/DemoRibbon.astro`, `src/data/site.ts` (`demo.sourceTag`)                        |
| Testimonials                                         | `src/data/testimonials.ts`                                                                      |
| Hero layout / section order                          | `src/components/hero/`, `src/pages/index.astro`, `src/components/pages/HomePage.astro`          |
| Reservation message format / date-time formatting    | `src/lib/reservation.ts`, `src/lib/whatsapp.ts`                                                 |
| Party-size cap, lead time, time slots                | `src/data/site.ts` (`reservation`)                                                              |
| Deployment / domain / worker name                    | `wrangler.jsonc`, `docs/DEPLOYMENT.md`                                                          |

## 6. Standard workflow

```sh
corepack pnpm install   # install deps
corepack pnpm dev       # local dev server at http://localhost:4321
corepack pnpm build     # static build to dist/
corepack pnpm preview   # preview the built site
corepack pnpm check     # astro check (types + content schema)
corepack pnpm lint      # prettier check
corepack pnpm format    # prettier write
corepack pnpm deploy    # wrangler deploy dist/ to Cloudflare Workers
```

Always run `pnpm check`, `pnpm lint` and `pnpm build` before considering a change
done. There is no test suite yet; if you add one, document it here and in
`README.md`.

## 7. Cloning this repo into a real restaurant site

This repo is the source. A clone must be a fast, mechanical rebrand. The full
checklist lives in `docs/CUSTOMIZATION.md`. Summary:

1. Create a new repo from this template (or copy the files), not a fork with
   history, so the new restaurant starts clean.
2. `pnpm install`.
3. Edit `src/data/site.ts` end to end (name, contacts, colors, locales,
   `indexable`). For a real restaurant set `indexable: true` **and** delete the
   `X-Robots-Tag` line from `public/_headers`, and set `siteUrl` to the real
   domain — all three, or the site stays out of search results.
4. Replace `public/logo.svg`, `public/favicon.svg`, and hero/gallery/dish images.
5. Update content: categories, dishes, page copy, testimonials.
6. Point the menu list at the restaurant's own Google Sheet.
7. `pnpm check && pnpm build`.
8. Deploy with `wrangler deploy`; attach the restaurant's custom domain.
9. Verify: reservation WhatsApp message arrives, `robots.txt` allows indexing and
   no `X-Robots-Tag` header is sent, the language config is correct, hours/map are
   right.

Do not leave placeholder branding, demo phone numbers, or `indexable: false` in a
production clone.

## 8. Open questions / decisions pending

Track unresolved decisions here so agents do not silently pick one:

- **Sheet build trigger.** The event-driven rebuild mechanism for production clones
  (Workers Builds deploy hook vs GitHub Actions `workflow_dispatch`) is not yet
  chosen. See `docs/CONTENT-AND-MENU.md`.
- **Legal pages.** The concept currently does not ship Privacy/Terms pages. Decide
  whether clones need them (especially if Meta Pixel / analytics are enabled).
- **Translations.** Sinhala/Tamil content will be supplied later. Decide whether
  dish names come from the Sheet, the content collections, or both.
- **Screenshot for express.** `public/demos/restaurant.webp` must be captured for
  `express.zuvo.lk` once the demo is live. See `docs/EXPRESS-HANDOFF.md`.
- **Native-speaker review** of Sinhala/Tamil strings before pitching, once enabled.

When you resolve one of these, move the decision into `docs/DECISIONS.md` and leave
a short note here.

## 9. Documentation map

- `README.md` — human-facing overview and quickstart.
- `docs/DECISIONS.md` — every locked decision and its rationale.
- `docs/ARCHITECTURE.md` — stack, folder structure, data flow, i18n, reservation.
- `docs/DESIGN-BRIEF.md` — pages/sections, mobile-first rules, theme tokens,
  component inventory, image shot list + Canva prompts.
- `docs/CONTENT-AND-MENU.md` — menu data, the Google Sheet, translations.
- `docs/RESERVATION-FLOW.md` — the party size + date/time picker + WhatsApp flow.
- `docs/CUSTOMIZATION.md` — step-by-step rebrand/clone checklist.
- `docs/CLIENT-CHECKLIST.md` — client-facing intake list and WhatsApp message; keep
  it free of developer jargon and credentials.
- `docs/DEPLOYMENT.md` — Cloudflare Workers, domain, GitHub, indexing headers.
- `docs/EXPRESS-HANDOFF.md` — what the express.zuvo.lk repo must change to list this
  demo.
