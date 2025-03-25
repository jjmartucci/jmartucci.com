import { defineCollection, z } from "astro:content";
import {glob} from "astro/loaders";

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
    category: z.enum(["Fiction", "Non-Fiction", "Manga", 'Comics & Graphic Novels', 'Philosophy']).optional(),
    tags: z.array(z.string()).optional(),
    cover_image: z.string().optional(),
  }),
});

const garden = defineCollection({
  schema: z.object({
    title: z.string(),
    relatedPosts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  })
});

const links = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
});

export const collections = { blog, garden, books, links };
