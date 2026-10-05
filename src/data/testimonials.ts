import type { LocalizedText } from "./site";

/**
 * Guest testimonials shown on the home page.
 *
 * These are placeholder, invented quotes. A clone replaces them with the
 * restaurant's real reviews (with permission). Add `si`/`ta` values when
 * translated.
 */
export type Testimonial = {
  quote: LocalizedText;
  author: string;
  detail?: LocalizedText;
};

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "The kottu here is the best in Colombo — smoky, spicy and generous.",
    },
    author: "Dinesh R.",
    detail: { en: "Chicken cheese kottu" },
  },
  {
    quote: {
      en: "We booked a table for my mother's birthday on WhatsApp in a minute. They had it ready when we arrived.",
    },
    author: "Amaya F.",
    detail: { en: "Birthday dinner" },
  },
  {
    quote: {
      en: "Proper Sri Lankan rice and curry, not watered down. The lamprais is worth the trip.",
    },
    author: "Roshan P.",
    detail: { en: "Lamprais" },
  },
  {
    quote: {
      en: "Great food, warm lighting and a team that remembers you. Our regular spot now.",
    },
    author: "Ishara & Nimal",
    detail: { en: "Friday dinner" },
  },
];
