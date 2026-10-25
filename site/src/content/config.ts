import { defineCollection, z } from "astro:content";

const blog = defineCollection({
   schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.string().optional(),
      readingTime: z.number(),
      tags: z.string().array().default([]),
   }),
});

export const collections = { blog };
