/**
 * All user-facing UI strings.
 *
 * English ships complete. `si` and `ta` are intentionally empty until translated;
 * missing values fall back to English at runtime (see `utils.ts`). Every new
 * string must be added to `en` (and translated later) — do not hardcode English
 * copy into components.
 */

import type { Locale } from "../data/site";

export const languages = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
} as const;

export const defaultLang: Locale = "en";

const en = {
  "a11y.skip": "Skip to content",

  "nav.home": "Home",
  "nav.menu": "Menu",
  "nav.reserve": "Reserve",
  "nav.gallery": "Gallery",
  "nav.about": "About",
  "nav.visit": "Visit us",

  "common.viewMenu": "View the menu",
  "common.viewGallery": "View gallery",
  "common.reserveNow": "Reserve a table",
  "common.chatOnWhatsApp": "Chat on WhatsApp",
  "common.close": "Close",
  "common.remove": "Remove",
  "common.optional": "optional",
  "common.language": "Language",
  "common.from": "from",

  "hero.eyebrow": "Modern Sri Lankan · Colombo",
  "hero.cta": "Reserve a table",
  "hero.secondary": "View the menu",

  "menu.title": "Our menu",
  "menu.subtitle": "Cooked to order over fire. Prices in Sri Lankan rupees.",
  "menu.jumpTo": "Jump to a section",
  "menu.empty": "Our menu is being updated. Please check back soon.",
  "menu.soldOut": "Sold out",
  "menu.special": "Chef's special",
  "menu.veg": "Veg",
  "menu.vegAlt": "Vegetarian",
  "menu.photoAlt": "A dish at Spice & Ember",

  "spice.0": "Not spicy",
  "spice.1": "Mild",
  "spice.2": "Medium",
  "spice.3": "Hot",
  "spice.label": "Spice level",

  "specials.title": "Today's specials",
  "specials.subtitle": "From the pass — ask us before they run out.",
  "specials.tab": "Specials",
  "specials.prev": "Scroll specials left",
  "specials.next": "Scroll specials right",

  "featured.title": "Signature dishes",

  "how.title": "How it works",
  "how.step1Title": "Browse the menu",
  "how.step1Body": "See every dish, with clear prices.",
  "how.step2Title": "Plan your table",
  "how.step2Body": "Pick a party size, a preferred date and time.",
  "how.step3Title": "Send on WhatsApp",
  "how.step3Body": "We confirm your table and answer any questions.",

  "reservation.title": "Reserve a table",
  "reservation.subtitle":
    "Tell us when you would like to come and we will confirm on WhatsApp.",
  "reservation.partySize": "Party size",
  "reservation.partyHint": "How many guests, including yourself?",
  "reservation.decrease": "Decrease party size",
  "reservation.increase": "Increase party size",
  "reservation.date": "Preferred date",
  "reservation.dateHint": "We've set the next open day — tap to change it.",
  "reservation.time": "Preferred time",
  "reservation.timeHint": "Pick one time, or leave it to us.",
  "reservation.timeAny": "Any time",
  "reservation.occasion": "Occasion",
  "reservation.occasionHint": "Optional — so we can prepare.",
  "reservation.name": "Your name",
  "reservation.namePlaceholder": "e.g. Nimal Perera",
  "reservation.phone": "Phone number",
  "reservation.phonePlaceholder": "e.g. 071 234 5678",
  "reservation.notes": "Notes",
  "reservation.notesPlaceholder":
    "Any special requests, allergies or seating preferences?",
  "reservation.send": "Send request on WhatsApp",
  "reservation.noPayment":
    "No payment online. You confirm everything with the restaurant on WhatsApp.",
  "reservation.largerTitle": "Reserving for more than {max}?",
  "reservation.largerBody":
    "For larger groups, message us directly and we will arrange the table with you.",
  "reservation.largerCta": "Message us on WhatsApp",

  "msg.intro": "I would like to reserve a table.",
  "msg.partySize": "Party size",
  "msg.date": "Preferred date",
  "msg.time": "Preferred time",
  "msg.timeAny": "Any time",
  "msg.occasion": "Occasion",
  "msg.name": "Name",
  "msg.phone": "Phone",
  "msg.notes": "Notes",
  "msg.footer": "Please confirm availability. Thank you!",
  "msg.groupIntro": "I would like to enquire about a table for a larger group.",
  "msg.groupFooter": "Please let me know if you can accommodate us. Thank you!",

  "occasion.none": "No occasion",
  "occasion.birthday": "Birthday",
  "occasion.anniversary": "Anniversary",
  "occasion.business": "Business dinner",
  "occasion.celebration": "Celebration",

  "testimonials.title": "What our guests say",

  "about.eyebrow": "Our kitchen",
  "about.title": "Our story",
  "about.teaser":
    "A modern Sri Lankan kitchen in Colombo, where everything is cooked over fire and shared at the table.",
  "about.imageAlt": "A chef garnishing a curry at Spice & Ember",
  "about.readMore": "Read our story",

  "gallery.title": "From the pass",
  "gallery.altInterior": "The warm, softly lit dining room in the evening",
  "gallery.altCurry": "A spread of Sri Lankan rice and curry in clay dishes",
  "gallery.altHoppers": "String hoppers and an egg hopper with sambol",
  "gallery.altFire": "A dish being finished over an open flame",
  "gallery.altDessert": "Watalappan and curd with kithul treacle",
  "gallery.altTable": "A table of shared dishes seen from above",

  "visit.title": "Visit us",
  "visit.address": "Address",
  "visit.hours": "Opening hours",
  "visit.phone": "Phone",
  "visit.whatsapp": "WhatsApp",
  "visit.map": "Find us",
  "visit.directions": "Get directions",
  "visit.openNow": "Open now",
  "visit.closedNow": "Closed",
  "visit.orderingTitle": "Order for delivery",
  "visit.orderingNote": "Prefer to stay in? Order through your favourite app.",

  "footer.reserveNote": "Reservations are arranged on WhatsApp.",
  "footer.rights": "All rights reserved.",

  "notFound.title": "Page not found",
  "notFound.body": "Sorry, we could not find that page.",
  "notFound.cta": "Back to the menu",
};

const si: Partial<typeof en> = {};

const ta: Partial<typeof en> = {};

export const ui = { en, si, ta } as const;

export type UiKey = keyof typeof en;
