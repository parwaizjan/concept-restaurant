# concept-restaurant

A reusable, translation-ready concept website for small restaurants in Sri Lanka.
Visitors browse the menu, then request a table on **WhatsApp** with party size,
preferred date and preferred time. No payments, no backend, no monthly cost.

This repository is a **concept / template**. It is shown to restaurant owners as a
live demo and then cloned and rebranded into that restaurant's real site. The demo
lives at `https://demo-restaurant.zuvo.lk`, and is catalogued on `zuvo.lk`.

> If you are an AI agent or a developer about to change anything, read
> [`AGENTS.md`](./AGENTS.md) first. It contains the non-negotiable rules.

## Why this exists

Small restaurants in Sri Lanka take bookings through Facebook, Instagram, WhatsApp
and phone calls. They do not have websites, and they do not want a payment gateway,
a commission-taking delivery app or a complex booking system. This concept gives
them a fast, mobile-first page where every reservation request arrives as a normal
WhatsApp chat they already know how to handle.

- **Zero running cost** — static files on Cloudflare's free tier.
- **WhatsApp-only reservations** — no forms, no calendar sync, no checkout.
- **Owner-editable menu/prices** — via a free Google Sheet (see below).
- **Translation-ready** — English ships first; Sinhala/Tamil structure is in place.
- **Fast to clone** — branding and content are centralized so a rebrand is quick.

## Quickstart

```sh
corepack pnpm install   # install deps (pnpm 12)
corepack pnpm dev       # http://localhost:4321
corepack pnpm build     # static output in dist/
corepack pnpm preview   # preview the built site
corepack pnpm check     # astro check (types + content schema)
corepack pnpm lint      # prettier check
corepack pnpm deploy    # wrangler deploy
```

If `pnpm` is installed globally, drop the `corepack` prefix.

## Documentation

| Doc                                                      | What it covers                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| [`AGENTS.md`](./AGENTS.md)                               | Purpose, rules, where to change what, definition of done        |
| [`docs/DECISIONS.md`](./docs/DECISIONS.md)               | Every locked decision and its rationale                         |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)         | Stack, folder structure, data flow, i18n, components            |
| [`docs/DESIGN-BRIEF.md`](./docs/DESIGN-BRIEF.md)         | Pages/sections, mobile-first rules, theme tokens, image prompts |
| [`docs/CONTENT-AND-MENU.md`](./docs/CONTENT-AND-MENU.md) | Menu data, the Google Sheet, translations                       |
| [`docs/RESERVATION-FLOW.md`](./docs/RESERVATION-FLOW.md) | The party size + date/time picker + WhatsApp flow in detail     |
| [`docs/CUSTOMIZATION.md`](./docs/CUSTOMIZATION.md)       | Clone/rebrand checklist for a real restaurant                   |
| [`docs/CLIENT-CHECKLIST.md`](./docs/CLIENT-CHECKLIST.md) | Client-facing intake list and ready-to-send WhatsApp message    |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)             | Cloudflare Workers, domain, GitHub, indexing headers            |
| [`docs/EXPRESS-HANDOFF.md`](./docs/EXPRESS-HANDOFF.md)   | Exact changes the zuvo.lk repo needs to list this demo  |

## Status

Implemented and building clean (`pnpm check` 0 errors, `pnpm lint`, `pnpm build`,
`wrangler deploy --dry-run`). The documentation set was written first (see
`docs/DECISIONS.md` D-R14) and then ported onto a visually distinct dark editorial
restaurant skin.

The demo brand is **Spice & Ember** — a modern Sri Lankan restaurant. English is
enabled; the `si`/`ta` structure is in place but not yet translated. The demo ships
`indexable: false`, an empty `menu.sheetId` (so it runs from the content collections
until a Google Sheet is connected) and `menu.mode: "runtime"`.

- Home, Menu, Reserve, Gallery, About and Visit pages, plus `404` and `robots.txt`.
- Vanilla party-size stepper + preferred date/time + occasion, with a larger-group
  WhatsApp enquiry path (`src/scripts/reservation.ts`).
- Ember theme tokens in `src/styles/theme.css` (plus clay / midnight presets).
- Google Sheet reader shared by the runtime and build-time paths
  (`src/lib/sheet.ts`, `scripts/fetch-menu.ts`).
- Canva AI photography in `src/assets/` (about, dishes, gallery — optimized to WebP
  variants at build) and the hero as pre-sized WebP in `public/images/`.

Remaining implementation detail: the exact event-driven build trigger for clones.
See `docs/CONTENT-AND-MENU.md` and `AGENTS.md` §8.

## The demo brand

| Field        | Value                                            |
| ------------ | ------------------------------------------------ |
| Name         | **Spice & Ember**                                |
| Tagline (EN) | Sri Lankan soul, cooked over fire.               |
| Location     | 18 Galle Face Terrace, Colombo 03, Sri Lanka     |
| WhatsApp     | +94 74 343 0033 (Zuvo demo number)               |
| Hours        | Tue–Sun 11:30–15:00 & 18:00–23:00; Monday closed |
| Currency     | LKR (Rs.)                                        |

Remaining implementation detail: the exact event-driven build trigger for clones.
See `docs/CONTENT-AND-MENU.md` and `AGENTS.md` §8.
