import type { ImageMetadata } from "astro";

/**
 * Dish photos, auto-loaded from `src/assets/dishes/`.
 *
 * Drop an image in that folder named after the dish id (the content file name),
 * e.g. `chicken-cheese-kottu.jpg`, `lamprais.png`. No code change is needed — the
 * file is picked up here and used on the menu. Dishes without a matching file
 * fall back to `public/images/placeholder.svg`.
 *
 * Recommended: 4:3 landscape (e.g. 1200x900), JPG or PNG.
 */
const modules = import.meta.glob<ImageMetadata>(
  "../assets/dishes/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

export const dishImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, image]) => {
    const id =
      path
        .split("/")
        .pop()
        ?.replace(/\.[^.]+$/, "") ?? "";
    return [id, image];
  }),
);
