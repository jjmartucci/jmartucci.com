import { defineCollection, z } from "astro:content";
import {glob} from "astro/loaders";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    published: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    image: z.string().optional(),
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
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    author: z.string().optional(),
  }),
});


const garden = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    created: z.string().optional(),
    modified: z.string().optional(),
    published: z.date().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  })
});


export const collections = { blog, books, garden};
