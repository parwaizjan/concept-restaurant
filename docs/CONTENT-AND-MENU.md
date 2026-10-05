# Content and menu

How dishes are defined, how the restaurant owner keeps prices, availability and
specials up to date for free, and how translations will be added.

This doc contains **open decisions** (flagged below). Do not silently pick one —
record the decision in `docs/DECISIONS.md` and remove the flag.

## 1. What is static vs what is live

| Data                                    | Source                                         | Who edits | How often                     |
| --------------------------------------- | ---------------------------------------------- | --------- | ----------------------------- |
| Dish name, category, description, photo | Content collections (repo)                     | Developer | Rarely — when a dish is added |
| Dietary (veg) and spice level           | Content collections                            | Developer | Rarely                        |
| Price                                   | Default in content, overridden by Google Sheet | Owner     | Often                         |
| Availability (sold out)                 | Google Sheet                                   | Owner     | Often                         |
| "Special" flag (Specials strip)         | Google Sheet                                   | Owner     | Often                         |
| Categories                              | Content collections                            | Developer | Rarely                        |
| Page copy (about, gallery, visit)       | Content collections                            | Developer | Rarely                        |

Rule of thumb: **the owner edits a spreadsheet; the developer edits the repo.**
The owner does not add new categories or dishes (rule §3.4); new dishes and photos
are sent to the developer.

## 2. Content collections

`src/content/menu/` — one Markdown file per dish:

```yaml
# src/content/menu/chicken-cheese-kottu.md
category: kottu
name:
  en: Chicken Cheese Kottu
  # si / ta added later
description:
  en: Chopped godhamba roti stir-fried with chicken, egg, spices and melted cheese.
price: 1650 # default in LKR; overridden by the Sheet
available: true # default; overridden by the Sheet
veg: false
spice: 2 # 0–3
special: false # overridden by the Sheet
featured: true # shown on the home page
order: 0
```

**The file name (without `.md`) is the dish id** and is what the Sheet must
reference. Keep it stable once live.

**Dish photos:** drop an image named after the dish id into `src/assets/dishes/`
(e.g. `chicken-cheese-kottu.jpg`). It is picked up by `src/data/dish-images.ts` — no
code change needed. Dishes without a matching file fall back to
`public/images/placeholder.svg`. Preferred size: 4:3 landscape, 1200×900, JPG or
PNG.

`src/content/categories/` — one file per category with localized names and sort
order (`starters`, `rice-curry`, `kottu`, `grill`, `vegetarian`, `desserts`,
`drinks`). `src/content/pages/` — about/gallery/visit copy, one file per locale
(`about/en.md`; `si`/`ta` added later).

`src/content.config.ts` defines and validates these schemas so `pnpm check` catches
mistakes. Build-time Sheet data is written to `src/data/menu-live.json` and merged
over these defaults by `src/lib/menu.ts`.

New dishes and photos are added by the **developer** after the owner sends details.

## 3. The owner's editing surface: Google Sheets

The owner maintains a single Google Sheet with live price, availability and
specials. They already understand spreadsheets and it costs nothing.

### Sheet format (tab `Menu`)

| id                   | name (read-only)     | price | available | special | note (optional) |
| -------------------- | -------------------- | ----- | --------- | ------- | --------------- |
| chicken-cheese-kottu | Chicken Cheese Kottu | 1650  | yes       | no      |                 |
| lamprais             | Lamprais             | 2100  | yes       | yes     | Fri–Sun only    |
| bbq-prawns           | BBQ Prawns           | 2450  | no        | no      | sold out today  |

- `id` matches the dish's content file id (the developer sets this when adding the
  dish).
- `price` in LKR, numbers only.
- `available` = `yes` / `no` (or `TRUE` / `FALSE`).
- `special` = `yes` / `no` — drives the home **Specials** strip and the "chef's
  special" tag.
- The owner edits `price`, `available` and `special`, and can add a short `note`.
  They never edit `id` or `name`.

### Decisions

- **Mechanism:** the demo uses **runtime browser fetch**; production clones use an
  **event-driven build** (see below). Both read the same simple sheet format.
- **Ownership:** every Sheet is **owner-owned**. Ideally the restaurant creates a
  dedicated Gmail the owner controls rather than using a personal account; it is
  shared with the developer as an editor, and a last-known-good copy is kept in the
  repo. The concept demo uses a developer-owned Sheet.
- **Access:** the Sheet is link-shared as viewer (prices are not secret). Owners who
  insist on a private Sheet need the optional service-account path noted below.

### Demo: runtime browser fetch

The concept demo fetches the Sheet in the visitor's browser and merges values over
the base content, so price/availability/specials changes appear without a rebuild.

- Endpoint: the **Google Visualization CSV** endpoint
  `…/gviz/tq?tqx=out:csv&sheet=<tab>`, or published CSV. **Verify CORS** from a
  Cloudflare origin with a real fetch before relying on it; the Sheets API v4 with a
  referrer-restricted key is the fallback if a CORS problem appears.
- Cache the successful response in `sessionStorage` for a few minutes to cut
  requests and speed up repeat views.
- **Never guess at CORS** — test it.

### Clones: event-driven build (recommended)

Production clones keep the data static so pages stay fast and reliable:

1. Owner edits price/availability/special in the Sheet (or clicks a "Publish"
   custom menu item added by the setup script).
2. A Google Apps Script bound to the Sheet fires on change and calls a build
   trigger.
3. The site rebuilds, fetching the Sheet **at build time**, and redeploys.

- Build trigger: prefer a **GitHub Actions `workflow_dispatch`** (Apps Script POSTs
  to the GitHub API with a fine-grained token stored in Script Properties), which
  runs `pnpm build` + `wrangler deploy`. Verify whether Cloudflare Workers Builds
  exposes an inbound deploy hook; if it does, use that instead.
- Debounce triggers (script lock / a short time window) so a burst of edits causes
  one rebuild, not many.
- A failed trigger or build is safe: the previously deployed static site stays live.

**OPEN IMPLEMENTATION NOTE:** the exact build trigger and the Apps Script trigger
type (`onChange` vs a "Publish" menu) are implementation details to finalize while
building. Neither changes the data format or the ownership model.

### Private-sheet option

A build-time fetch can read a Sheet that is **not** public by sharing it with a
Google service account and putting the key in CI secrets. This adds a Google Cloud
project and key rotation per clone, so it is opt-in, not the default. A runtime
browser fetch can never use a private Sheet.

### Cost

- Google Sheets, publishing to web and Apps Script are **free** for a normal Google
  account. No Google Cloud billing account is required for the publish/CSV route.
- Runtime fetch: the Sheet is read in the visitor's browser, so there is **no server
  and no Cloudflare cost**.
- Build-time fetch: the read happens during CI. GitHub Actions free minutes
  (2,000/month on the free plan) comfortably cover the few rebuilds a restaurant
  produces per day; avoid noisy per-edit rebuilds via debouncing.

### Failure fallback

Both paths must degrade gracefully:

- Render prices/availability/specials from the base content (last known good values
  under version control).
- For runtime fetch, cache the last successful fetch and use it if the network or
  Sheet is unavailable.
- For the event-driven build, the last successful deploy stays live.
- Validate parsed rows; ignore unknown columns; require a known `id`.
- Never block the menu or the WhatsApp button because of a Sheet error — the request
  is an enquiry, so a stale price is not fatal.

## 4. Translations of dish names

**OPEN DECISION:** Where Sinhala/Tamil dish names come from. The concept ships only
`en` (`locale.enabled: ['en']`), so this can be deferred until translations exist.
Options (same as bakery/salon):

- **A. Content collection only** — developer supplies `si`/`ta` names in each dish
  file. The Sheet only carries price/availability/special.
- **B. Sheet carries three name columns** — `name_en`, `name_si`, `name_ta`. Owners
  often cannot comfortably type Sinhala/Tamil, and menu names are more variable than
  service names.
- **C. Hybrid (recommended)** — Sheet carries `name_en` for quick fixes; developer
  fills `si`/`ta` in the dish file.

Regardless of choice, a missing `si`/`ta` value must fall back to `en` rather than
showing an empty string.

## 5. Adding a new dish — workflow

1. Owner sends the developer: name, category, price, description, veg/spice, and a
   photo (WhatsApp is fine).
2. Developer optimizes the photo, adds an image under `src/assets/dishes/`, and adds
   a file under `src/content/menu/` with a default price.
3. Developer adds a row with the same `id` to the restaurant's Google Sheet and tells
   the owner they can now edit its price/availability/special.
4. `pnpm check && pnpm build`, deploy.

## 6. Demo menu list (placeholder)

The demo ships a plausible, invented modern Sri Lankan menu across seven categories.
Prices are indicative LKR placeholders.

| Category       | Dishes (examples)                                                                 |
| -------------- | --------------------------------------------------------------------------------- |
| Starters       | Prawn Vadai, Fish Cutlets, Dhal Vadai, Chicken Rolls                              |
| Rice & Curry   | Chicken Rice & Curry, Fish Ambul Thiyal, Vegetable Rice & Curry, Pork Black Curry |
| Kottu & Roti   | Chicken Cheese Kottu, Vegetable Kottu, Egg Roti, Beef Kottu                       |
| From the Grill | Devilled Chicken, Lamprais, BBQ Prawns, Grilled Seer Fish                         |
| Vegetarian     | Jackfruit Curry, Dhal Curry & Roti, Pol Sambol, Gotukola Sambol                   |
| Desserts       | Watalappan, Curd & Kithul Treacle, Chocolate Biscuit Pudding                      |
| Drinks         | King Coconut, Faluda, Fresh Lime Soda, Ceylon Iced Tea                            |

Featured/signature dishes for the home page: **Chicken Cheese Kottu**, **Lamprais**,
**Devilled Chicken**, **BBQ Prawns**. These four are also the Canva AI dish images
in `docs/DESIGN-BRIEF.md`.

## 7. Currency and formatting

- Currency is LKR (`Rs.`). Format via `src/lib/format.ts`; do not hardcode `Rs.` in
  components.
- Prices are whole rupees; no decimals.
- Veg markers and spice levels are content, not Sheet data, in the baseline.
- The reservation request is an enquiry only; no tax, service charge, discount or
  deposit is calculated or shown.
