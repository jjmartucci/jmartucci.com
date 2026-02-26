import { defineCollection, z } from "astro:content";


const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({image}) => z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    image: image().optional().catch(undefined),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    hideRSS: z.boolean().optional(),
    homepage: z.boolean().optional(),
  }),
});

const books = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({image}) => z.object({
    title: z.string(),
    author: z.string().optional(),
    link: z.string().optional(),
    image: image().optional().catch(undefined),
    genre: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    rating: z.number().optional(),
    dateRead: z.coerce.date().optional(),
    reviewedAt: z.coerce.date().optional(),
  }),
});


const music = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({image}) => z.object({
    title: z.string(),
    artist: z.string(),
    link: z.string().optional(),
    image: image().optional().catch(undefined),
    lovedDate: z.coerce.date(),
    mbid: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const garden = defineCollection({
  schema: ({image}) => z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    published: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    description: z.string().optional(),
    image: image().optional().catch(undefined),
  })
});

const watching = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({image}) => z.object({
    title: z.string(),
    year: z.number(),
    type: z.enum(['tv', 'movie']),
    link: z.string().optional(),
    image: image().optional().catch(undefined),
    tags: z.array(z.string()).optional(),
    rating: z.number().optional(),
    lastWatchedDate: z.coerce.date(),
    status: z.string().optional(),
    draft: z.boolean().optional(),
    overview: z.string().optional(),
  }),
});

const games = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({image}) => z.object({
    title: z.string(),
    igdbId: z.number(),
    link: z.string().optional(),
    image: image().optional().catch(undefined),
    tags: z.array(z.string()).optional(),
    rating: z.number().optional(),
    completedDate: z.coerce.date().optional(),
    dateAdded: z.coerce.date().optional(),
    lastUpdated: z.coerce.date().optional(),
    platform: z.string().optional(),
    status: z.string().optional(),
    playtime: z.string().optional(),
    draft: z.boolean().optional(),
    summary: z.string().optional(),
    progressNotes: z.string().optional(),
    collectionNotes: z.string().optional(),
  }),
});

const toots = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: ({image}) => z.object({
    tootId: z.string(),
    url: z.string(),
    publishedDate: z.coerce.date(),
    author: z.string().optional(),
    draft: z.boolean().optional(),
    inReplyTo: z.string().optional(),
    image: image().optional().catch(undefined),
    mediaDescription: z.string().optional(),
  }),
});


export const collections = { blog, books, music, garden, watching, games, toots};
