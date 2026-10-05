# Design Brief

## Brand feeling

**Dark, warm, editorial and food-first.** An evening restaurant you would book for
a birthday or a Friday dinner — modern Sri Lankan, cooked over fire. Near-black
charcoal canvas, warm off-white text, an ember/terracotta primary and a saffron
accent. Full-bleed food photography, bold display headings, dotted-leader menu
typography, hairline rules, minimal shadows. It must feel clearly different from the
salon (cream/rose) and bakery (crumb-orange) concepts — see `DECISIONS.md` D-R02 and
D-R11.

Demo brand (placeholder, invented — see `DECISIONS.md` D-R10):

| Field        | Value                                        |
| ------------ | -------------------------------------------- |
| Name         | **Spice & Ember**                            |
| Tagline (EN) | Sri Lankan soul, cooked over fire.           |
| Location     | 18 Galle Face Terrace, Colombo 03, Sri Lanka |
| WhatsApp     | +94 74 343 0033 (Zuvo demo number)           |
| Hours        | Tue–Sun 11:30–23:00; Monday closed           |
| Currency     | LKR (Rs.)                                    |

## Theme tokens

Edit `src/styles/theme.css` to rebrand; `global.css` maps tokens to Tailwind.

| Token                | Value     | Use                           |
| -------------------- | --------- | ----------------------------- |
| `--c-bg`             | `#141110` | Warm near-black page canvas   |
| `--c-surface`        | `#1E1A17` | Cards / raised panels         |
| `--c-surface-alt`    | `#241F1B` | Subtle section background     |
| `--c-text`           | `#F5EFE8` | Primary text (warm off-white) |
| `--c-text-muted`     | `#B8A99C` | Secondary text                |
| `--c-primary`        | `#E2542C` | Ember/terracotta — buttons    |
| `--c-primary-strong` | `#C13F1C` | Primary hover                 |
| `--c-on-primary`     | `#FFFFFF` | Text on primary               |
| `--c-accent`         | `#E0A32E` | Saffron — badges, eyebrows    |
| `--c-border`         | `#332B26` | Hairline borders              |
| `--c-success`        | `#4E9A63` | Available / veg               |
| `--c-danger`         | `#C94F4F` | Sold out / error              |
| `--c-focus`          | `#F2B84B` | Focus ring                    |

- Radius: `--radius-sm 6px`, `--radius-md 12px`, `--radius-lg 20px`.
- Shadow: one soft `--shadow-soft` for raised cards only; default to hairlines and
  image contrast.
- Type: `font-heading` **Bricolage Grotesque** (bold editorial display), `font-body`
  **Inter** (body/UI). Both stacks append Noto Sans Sinhala and Noto Sans Tamil.
- Scale: hero `text-5xl sm:text-7xl` (display), section headings `text-3xl sm:text-4xl`,
  body `text-base`, menu prices `text-base tabular-nums`, meta `text-sm`.
- Utilities: `bg-bg bg-surface text-text text-text-muted border-border bg-primary
text-primary bg-accent`. Classes: `.eyebrow .btn-primary .btn-secondary .card`
  and `.price-leader` (dish name · dotted rule · price).
- Dark theme is the default and only shipping theme. Presets may live in
  `src/styles/themes/*.css` with a `data-theme` attribute for clone variety.

## Pages

| Page      | Route      | Job                                                          |
| --------- | ---------- | ------------------------------------------------------------ |
| Home      | `/`        | Pitch in 30 seconds: food, mood, proof, primary Reserve CTA. |
| Menu      | `/menu`    | Full menu by category with prices, dietary/spice cues.       |
| Reserve   | `/reserve` | Party size + date + time + occasion → WhatsApp request.      |
| Gallery   | `/gallery` | Food and space photos; the decisive trust signal.            |
| About     | `/about`   | Story, kitchen philosophy, sourcing.                         |
| Visit     | `/visit`   | Address, hours, map, parking, ordering apps, contacts.       |
| Not found | `/404`     | Friendly recovery with links to Menu/Reserve.                |

Legal pages are deferred (see `AGENTS.md` §8). `robots.txt` is generated.

## Home section order

1. **Ember hero** — full-bleed dark food image, brand, tagline, primary CTA
   (Reserve a table), secondary (View the menu).
2. **Signature dishes** — 3–4 hero dishes with images and prices.
3. **Specials strip** — today's/chef's specials, driven by the Sheet `special` flag.
   Each card links to the Menu's **Specials** section (`/menu#specials`). On desktop
   the strip has prev/next scroll arrows; on mobile it scrolls by swipe.
4. **Our story** — short split section with a kitchen image, linking to `/about`.
5. **Menu teaser** — category chips and a "See full menu" link.
6. **Testimonials** — 2–4 short quotes.
7. **Visit** — hours, address, map, directions, ordering apps.
8. **CTA band** — "Reserve a table on WhatsApp".

The reservation picker lives on `/reserve`, linked from the header, hero, specials,
sticky bar and CTA band — not repeated on the home page.

## Mobile-first rules

Most traffic arrives on phones from social apps, often on 3G.

- Design and test at **375px first**, then scale up.
- Tap targets ≥ 44px; primary actions bottom-reachable.
- There is **no sticky/floating CTA** on mobile. The header **Reserve** button is the
  single primary action; it shows the short label "Reserve" below `sm` and the full
  "Reserve a table" at `sm`+ so it never wraps on a 360px screen.
- Images are pre-sized, lazy-loaded below the fold, and served with explicit
  `width`/`height` to avoid layout shift. The hero uses `heroImageMobile` below
  `sm`.
- The header stays a single row on desktop and uses a horizontally scrollable nav
  row on mobile (no hamburger). The sticky category tabs on `/menu` park directly
  beneath the header via the `--header-h` CSS variable.
- No horizontal scroll; no more than one visual accent competing with the CTA.
- Dark surfaces on small screens: keep body text at WCAG AA contrast (off-white on
  charcoal, verify the ember-on-charcoal button contrast).

## Component inventory

| Component                                                    | Notes                                                                              |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `Header`                                                     | Logo, primary nav, Reserve CTA, language switcher.                                 |
| `Footer`                                                     | Brand, full nav, socials, hours, ordering links, copyright.                        |
| `LangSwitcher`                                               | Hidden when only one locale is enabled.                                            |
| `Seo`                                                        | Title/description/canonical/OG/JSON-LD helpers.                                    |
| `hero/EmberHero`                                             | Full-bleed dark hero (single `ember` variant).                                     |
| `menu/CategoryTabs`                                          | Sticky category jump links.                                                        |
| `menu/MenuList`                                              | Category-grouped editorial list.                                                   |
| `menu/MenuItem`                                              | Name, description, dotted leader, price, badges, sold-out.                         |
| `menu/DietaryBadges`                                         | Veg marker (and any future dietary tags).                                          |
| `menu/SpiceMeter`                                            | 0–3 chilli pips, accessible label.                                                 |
| `menu/SpecialsStrip`                                         | Sheet-driven `special: true` dishes.                                               |
| `menu/SignatureDishes`                                       | Featured dishes for home.                                                          |
| `reserve/ReservationForm`                                    | Party stepper (1–8), date, time, occasion, name/phone/notes, larger-group enquiry. |
| `gallery/GalleryMasonry`                                     | Asymmetric responsive image grid with lightbox-free design.                        |
| `visit/ContactLinks`, `visit/MapEmbed`, `visit/OpeningHours` | Visit page blocks.                                                                 |
| `visit/OrderingLinks`                                        | Third-party delivery links as self-hosted logo badges (hidden when list is empty). |
| `pages/*`                                                    | Compose each route from the above.                                                 |

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page.
- All images have localized alt text; decorative images are `alt=""`.
- Reservation controls are real form controls with labels; party/spice state is
  announced; keyboard operable and usable without JS.
- Contrast targets WCAG AA: off-white on charcoal, white on ember (verify in the
  final palette), veg/saffron badges against dark surfaces.
- `lang` set per locale; focus visible on all interactive elements.
- Badges never rely on colour alone: veg and spice include text/icon + accessible
  name.

## Image shot list & Canva prompts

All demo imagery is generated with **Canva AI (Magic Media)** from the prompts
below, exported at the listed aspect ratio, converted to **WebP**, and committed
(see `DECISIONS.md` D-R13). Keep a warm, low-key, "ember and candlelight" look
across every image so the set feels shot in one sitting. No text, logos or
watermarks in generated images.

| Slot                 | File                                         | Size / ratio | Prompt (Canva Magic Media)                                                                                                                                                                                              |
| -------------------- | -------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero (wide)          | `public/images/hero.webp`                    | 2400×1400    | Moody over-head shot of Sri Lankan dishes on a dark wooden table, candlelight, embers glowing at the edge, warm terracotta and saffron tones, cinematic, shallow depth of field, food photography                       |
| Hero (mobile)        | `public/images/hero-mobile.webp`             | 1200×1600    | Same scene vertical crop: a single clay pot of Sri Lankan curry with rice, dark moody background, warm rim light, steam rising, food photography                                                                        |
| Open Graph           | `public/og.jpg`                              | 1200×630     | Wide dark restaurant table with assorted Sri Lankan dishes, warm ember glow, cinematic, room for a logo top-left                                                                                                        |
| About / story        | `src/assets/about.jpg`                       | 1200×900     | Chef's hands garnishing a Sri Lankan curry with fresh herbs over a dark counter, warm directional light, candid, documentary food photography                                                                           |
| Signature dish 1     | `src/assets/dishes/chicken-cheese-kottu.jpg` | 1200×900     | Sri Lankan chicken cheese kottu on a dark plate, melted cheese, chopped roti, chilli, moody warm light, food photography                                                                                                |
| Signature dish 2     | `src/assets/dishes/lamprais.jpg`             | 1200×900     | Sri Lankan lamprais parcel opened on a banana leaf, mixed rice, curries, dark background, warm light, food photography                                                                                                  |
| Signature dish 3     | `src/assets/dishes/devilled-chicken.jpg`     | 1200×900     | Sri Lankan devilled chicken in a glossy spicy sauce with onions and capsicum, dark bowl, ember-lit, food photography                                                                                                    |
| Signature dish 4     | `src/assets/dishes/bbq-prawns.jpg`           | 1200×900     | Grilled Sri Lankan prawns with chilli and lime on a dark plate, charred edges, warm moody light, food photography                                                                                                       |
| Special — Watalappan | `src/assets/dishes/watalappan.jpg`           | 1200×900     | Sri Lankan watalappan, steamed jaggery and coconut custard in a small dark bowl topped with toasted cashew and a dusting of cardamom, dark moody background, warm candlelight, shallow depth of field, food photography |
| Special — Faluda     | `src/assets/dishes/faluda.jpg`               | 1200×900     | Sri Lankan faluda in a tall glass, swirls of rose syrup in milk, basil seeds and a scoop of ice cream, dark moody background, warm rim light, condensation on the glass, food photography                               |
| Gallery 1            | `src/assets/gallery/interior.jpg`            | 1200×1600    | Warm dark restaurant interior at night, wooden tables, hanging edison bulbs, plants, terracotta accents, inviting, editorial photography                                                                                |
| Gallery 2            | `src/assets/gallery/rice-and-curry.jpg`      | 1200×900     | Sri Lankan rice and curry spread with many small clay dishes, banana leaf, dark table, overhead, warm light, food photography                                                                                           |
| Gallery 3            | `src/assets/gallery/hoppers.jpg`             | 1200×900     | Sri Lankan string hoppers and egg hopper with sambol on a dark plate, warm moody light, food photography                                                                                                                |
| Gallery 4            | `src/assets/gallery/street-cooking.jpg`      | 1200×1600    | Street-food chef cooking kottu on a hot griddle, flames and steam, dark night market mood, cinematic, no faces, food photography                                                                                        |
| Gallery 5            | `src/assets/gallery/desserts.jpg`            | 1200×900     | Sri Lankan watalappan and curd with kithul treacle in small bowls, dark surface, warm light, food photography                                                                                                           |
| Gallery 6            | `src/assets/gallery/dining-friends.jpg`      | 1200×1600    | Table of shared Sri Lankan dishes seen from above, hands reaching in, warm candlelight, celebratory, dark mood, food photography                                                                                        |

Brand marks (`public/logo.svg`, `public/favicon.svg`) are simple wordmark SVGs made
in-repo (ember accent on charcoal), not generated.

Preferred delivery: export JPG from Canva at the listed pixel size. Imported assets
(`src/assets/about.jpg`, `src/assets/dishes/*.jpg`, `src/assets/gallery/*.jpg`) are
optimized to WebP variants by Astro at build time — keep the JPG sources. The two
hero images are served as public CSS backgrounds (no build optimization), so
pre-convert them to WebP: `public/images/hero.webp` and `public/images/hero-mobile.webp`
(quality ~80). `public/og.jpg` stays JPG for social crawlers. Keep each file under
~250 KB.
