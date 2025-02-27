import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    hideRSS: z.boolean().optional(),
    homepage: z.boolean().optional(),
  }),
});

const books = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    link: z.string().optional(),
    date: z.coerce.date().optional(),
    homepage: z.boolean().optional(),
    author: z.string().optional(),
    category: z.enum(["Fiction", "Non-Fiction", "Manga", 'Comics & Graphic Novels']).optional(),
  }),
});

export const collections = { blog, books };
