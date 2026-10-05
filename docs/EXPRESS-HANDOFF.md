# Express hand-off — listing `demo-restaurant.zuvo.lk`

This document is for the agent/developer who maintains
`~/Projects/zuvo-studio-express` (**express.zuvo.lk**). It lists the exact changes
needed to list the new restaurant demo. The `concept-restaurant` repo must **not**
edit the express repo; apply these there.

The restaurant category page, offer and add-ons already exist in express
(`restaurant` is in `src/data/categories.ts` with baseline Rs. 44,500 / renewal
Rs. 18,000 and `demoSlug: 'restaurant'`). Only the demo is `coming-soon`. Flipping
it to `live` is the core change.

## 1. `src/data/demos.ts` — flip the restaurant demo to live

Replace the existing `restaurant` entry:

```ts
  {
    slug: 'restaurant',
    category: 'Restaurant',
    tagline: 'Menu, photos and reservations without the back-and-forth.',
    url: '',
    screenshot: '',
    features: ['Menu', 'Gallery', 'Reservations'],
    status: 'coming-soon',
    order: 4,
  },
```

with:

```ts
  {
    slug: 'restaurant',
    category: 'Restaurant',
    tagline: 'Menu, photos and reservations without the back-and-forth.',
    url: 'https://demo-restaurant.zuvo.lk',
    screenshot: '/demos/restaurant.webp',
    features: [
      'Menu with prices',
      'Gallery',
      'Daily specials',
      'WhatsApp table reservations',
    ],
    status: 'live',
    order: 4,
  },
```

`CategoryCard.astro` and `DemoPreview.astro` read `getDemo(category.demoSlug)`, so
this single edit makes the home card and `/websites/restaurant/` show the live demo,
screenshot and link. No page/code changes are needed.

## 2. `public/demos/restaurant.webp` — add the screenshot

- Capture the live demo and save to `public/demos/restaurant.webp`.
- Match the existing screenshots: **1280×960 (4:3)**, WebP. `laundry.webp`,
  `bakery.webp` and `salon.webp` are all 1280×960.
- Capture the mobile/home view (a phone-width screenshot scaled to 4:3 is what the
  other demos use).

## 3. `docs/demos.md` — update the registry

In the **Registry** table, change the restaurant row:

```md
| Restaurant | `restaurant` | Rs. 44,500 | Rs. 18,000 | https://demo-restaurant.zuvo.lk | `/websites/restaurant/` | **Live** |
```

In **Live demos**, add a restaurant line, e.g.:

```md
- **Restaurant** ("Spice & Ember") — menu with prices, gallery, daily specials,
  WhatsApp table reservations, EN (SI/TA ready).
```

## 4. `docs/product.md` — category catalogue table

Change the Restaurant row's Demo column from `Planned` to
`` `demo-restaurant.zuvo.lk` ✅ ``.

## 5. `docs/strategy.md` — target categories table

Change the Restaurant row's Demo column from `Planned` to
`` `demo-restaurant.zuvo.lk` ✅ ``.

## 6. `docs/roadmap.md` — phase 7 progress

In **Phase 7 — Growth**, update:

```md
- [~] Build the remaining category demos — **laundry ✅, bakery ✅, salon ✅,
  restaurant ✅**; café, spa outstanding.
```

## 7. `docs/decisions.md` — optional note

If desired, add a decision entry recording that the fourth demo
(`concept-restaurant`) shipped, that it was built dark/editorial to stay visually
distinct from salon and bakery, and that reservations (not online ordering) are the
baseline restaurant feature (ordering stays a paid add-on). No decision is strictly
required for listing.

## Notes / possible follow-ups

- **Positioning copy:** the category page copy already matches the demo feature set
  (menu, gallery, reservation/enquiry button, location). The demo also ships daily
  specials and testimonials; if you want those reflected in the category page's
  `categoryIncludes`/FAQ, update `src/data/categories.ts` (optional). Do not imply
  online ordering is included — it is an add-on.
- **Languages:** express markets Sinhala/Tamil as paid add-ons. The demo ships
  English-only with translation structure in place, which matches that position.
- **Screenshot for the hub** must be captured after the demo is deployed and
  polished; do not advertise the category (or publish conflicting copy) before the
  demo is live.

## What is already in express (no change needed)

- `restaurant` category entry, page route `/websites/restaurant/`, baseline/renewal
  prices, includes, add-ons, FAQs, SEO meta.
- Category grid card rendering from `demos.ts`.

Handoff verified against express as of 2026-10-05 (commit state at time of writing).
