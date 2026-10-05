import type { ImageMetadata } from "astro";

import desserts from "../assets/gallery/desserts.jpg";
import diningFriends from "../assets/gallery/dining-friends.jpg";
import hoppers from "../assets/gallery/hoppers.jpg";
import interior from "../assets/gallery/interior.jpg";
import riceAndCurry from "../assets/gallery/rice-and-curry.jpg";
import streetCooking from "../assets/gallery/street-cooking.jpg";
import type { UiKey } from "../i18n/ui";

/**
 * Photos shown in the "From the pass" section and on /gallery. Imported assets
 * are optimized to WebP variants at build time. Replace the files in
 * `src/assets/gallery/` (keeping the imports) and keep each `altKey` present in
 * every enabled language (`src/i18n/ui.ts`).
 */
export type GalleryImage = {
  src: ImageMetadata | string;
  altKey: UiKey;
};

export const gallery: GalleryImage[] = [
  { src: interior, altKey: "gallery.altInterior" },
  { src: riceAndCurry, altKey: "gallery.altCurry" },
  { src: hoppers, altKey: "gallery.altHoppers" },
  { src: streetCooking, altKey: "gallery.altFire" },
  { src: desserts, altKey: "gallery.altDessert" },
  { src: diningFriends, altKey: "gallery.altTable" },
];
