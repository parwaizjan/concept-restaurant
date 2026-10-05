import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro:schema";

const localizedText = z.object({
  en: z.string(),
  si: z.string().optional(),
  ta: z.string().optional(),
});

/**
 * Restaurant menu dishes. The file name (without `.md`) is the dish id used to
 * match rows in the owner's Google Sheet, so keep it stable once live.
 */
const menu = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/menu" }),
  schema: z.object({
    category: z.string(),
    name: localizedText,
    description: localizedText.optional(),
    price: z.number().nonnegative(),
    available: z.boolean().default(true),
    veg: z.boolean().default(false),
    spice: z.number().int().min(0).max(3).default(0),
    special: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    image: z.string().optional(),
  }),
});

/** Menu categories. The file name is the category id referenced by dishes. */
const categories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/categories" }),
  schema: z.object({
    name: localizedText,
    description: localizedText.optional(),
    order: z.number().default(0),
  }),
});

/** Long-form page copy, one file per locale: `about/en.md`, `about/si.md`, … */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { menu, categories, pages };
