import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";

import { dishImages } from "../data/dish-images";
import { type Locale, type LocalizedText } from "../data/site";
import menuLive from "../data/menu-live.json";

/** A dish image: an optimized imported asset, or a public path (e.g. an SVG). */
export type DishImage = ImageMetadata | string;

export type LiveDishRow = {
  price?: number;
  available?: boolean;
  special?: boolean;
  note?: string;
};

const live = menuLive as Record<string, LiveDishRow>;

export type Dish = {
  id: string;
  category: string;
  name: string;
  description?: string;
  image: DishImage;
  price: number;
  available: boolean;
  veg: boolean;
  spice: number;
  special: boolean;
  featured: boolean;
  order: number;
  note?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string;
  order: number;
};

/** Pick a localized string, falling back to English then an empty string. */
export function pickLocalized(
  text: LocalizedText | undefined,
  lang: Locale,
): string {
  if (!text) return "";
  return text[lang] ?? text.en;
}

/** The full dish list for a locale, with build-time Sheet overrides merged in. */
export async function getDishes(lang: Locale): Promise<Dish[]> {
  const dishes = await getCollection("menu");

  return dishes
    .map((entry): Dish => {
      const data = entry.data;
      const override = live[entry.id] ?? {};
      return {
        id: entry.id,
        category: data.category,
        name: pickLocalized(data.name, lang),
        description: data.description
          ? pickLocalized(data.description, lang)
          : undefined,
        image: dishImages[entry.id] ?? data.image ?? "/images/placeholder.svg",
        price: override.price ?? data.price,
        available: override.available ?? data.available,
        veg: data.veg,
        spice: data.spice,
        special: override.special ?? data.special,
        featured: data.featured,
        order: data.order,
        note: override.note,
      };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

/** Menu categories for a locale, ordered. */
export async function getCategories(lang: Locale): Promise<MenuCategory[]> {
  const categories = await getCollection("categories");

  return categories
    .map((entry): MenuCategory => ({
      id: entry.id,
      name: pickLocalized(entry.data.name, lang),
      description: entry.data.description
        ? pickLocalized(entry.data.description, lang)
        : undefined,
      order: entry.data.order,
    }))
    .sort((a, b) => a.order - b.order);
}
