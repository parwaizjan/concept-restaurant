/**
 * THE per-restaurant configuration.
 *
 * Every restaurant-specific value lives here. A clone only needs to edit this
 * file, `src/styles/theme.css`, the content collections and `public/`. Components
 * must never contain restaurant-specific literals.
 */

export type Locale = "en" | "si" | "ta";

export type LocalizedText = {
  en: string;
  si?: string;
  ta?: string;
};

export type OpeningHour = {
  /** 0 = Sunday … 6 = Saturday */
  day: number;
  /** 24h "HH:MM". Leave `open` empty to mark the day closed. */
  open: string;
  close: string;
};

export type OrderingApp = {
  name: string;
  url: string;
  /** Optional self-hosted logo (see `public/images/order/`). */
  logo?: string;
};

const tagline: LocalizedText = {
  en: "Sri Lankan soul, cooked over fire.",
};

const address: LocalizedText = {
  en: "18 Galle Face Terrace, Colombo 03, Sri Lanka",
};

export const site = {
  // Identity
  name: "Spice & Ember",
  tagline,
  logo: "/logo.svg",
  ogImage: "/og.jpg",
  heroImage: "/images/hero.webp",
  heroImageMobile: "/images/hero-mobile.webp",

  // Contact
  whatsappNumber: "94743430033", // digits only, country code, no "+"
  phone: "+94 74 343 0033",
  email: "", // display only; reservations go to WhatsApp
  address,
  mapEmbedUrl:
    "https://www.google.com/maps?q=Galle%20Face%20Terrace%2C%20Colombo%2003%2C%20Sri%20Lanka&output=embed",
  mapLink:
    "https://maps.google.com/?q=Galle+Face+Terrace,+Colombo+03,+Sri+Lanka",

  // Opening hours (0 = Sunday … 6 = Saturday). Lunch and dinner run as one range.
  hours: [
    { day: 0, open: "11:30", close: "23:00" },
    { day: 1, open: "", close: "" }, // Monday — closed
    { day: 2, open: "11:30", close: "23:00" },
    { day: 3, open: "11:30", close: "23:00" },
    { day: 4, open: "11:30", close: "23:00" },
    { day: 5, open: "11:30", close: "23:00" },
    { day: 6, open: "11:30", close: "23:00" },
  ] as OpeningHour[],

  // Socials (empty string hides the link)
  socials: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },

  // i18n — English ships first; add "si"/"ta" when translations exist.
  defaultLocale: "en" as Locale,
  locales: ["en"] as Locale[],

  // Reservation preferences
  reservation: {
    /** Earliest selectable preferred day, relative to today. */
    minLeadDays: 0,
    /** Latest selectable preferred day, relative to today. */
    maxLeadDays: 90,
    /** Parties larger than this use the WhatsApp enquiry button instead. */
    maxPartySize: 8,
    /** Preferred times offered as chips (24h "HH:MM"). */
    slots: [
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ],
    /** Occasion keys; labels live in `src/i18n/ui.ts`. */
    occasions: ["none", "birthday", "anniversary", "business", "celebration"],
  },

  // Menu data source.
  //  - "runtime": the demo fetches the public Sheet in the browser (instant edits).
  //  - "build":   clones fetch the Sheet during the build (static, event-driven rebuild).
  // Leave `sheetId` empty to run entirely from the content collections.
  menu: {
    mode: "runtime" as "runtime" | "build",
    sheetId: "",
    sheetTab: "Menu",
    refreshMinutes: 5,
  },

  // Third-party ordering/delivery apps. Empty list hides the block. The demo
  // ships placeholder links so owners can see the feature (see DECISIONS.md D-R07).
  ordering: {
    apps: [
      {
        name: "PickMe Food",
        url: "#",
        logo: "/images/order/pickme-food.svg",
      },
      {
        name: "Uber Eats",
        url: "#",
        logo: "/images/order/uber-eats.svg",
      },
    ] as OrderingApp[],
  },

  // SEO — false for the concept demo, true for a real restaurant clone.
  indexable: false,
  siteUrl: "https://demo-restaurant.zuvo.lk",
  currency: { code: "LKR", symbol: "Rs." },
  heroVariant: "ember" as "ember",
};

export type Site = typeof site;
