import { defineCollection, z } from "astro:content";

const blog = defineCollection({
   // Type-check frontmatter using a schema
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

const projects = defineCollection({
   schema: z.object({
      title: z.string(),
      repo: z.string().url(),
      website: z.string().url(),
      blurb: z.string(),
      order: z.number().optional().default(100),
      tech: z.string().array(),
   }),
});

export const collections = { blog, projects };
