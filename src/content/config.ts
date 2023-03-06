import { defineCollection, z } from "astro:content";
import { technologiesSchema } from "../technology/technologies";

const blog = defineCollection({
   // Type-check frontmatter using a schema
   schema: z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z
         .string()
         .or(z.date())
         .transform((val) => new Date(val)),
      updatedDate: z
         .string()
         .optional()
         .transform((str) => (str ? new Date(str) : undefined)),
      heroImage: z.string().optional(),
      readingTime: z.number(),
   }),
});

const projects = defineCollection({
   schema: z.object({
      title: z.string(),
      repo: z.string().url(),
      website: z.string().url(),
      blurb: z.string(),
      technologies: technologiesSchema.array(),
      order: z.number().optional().default(100),
   }),
});

export const collections = { blog, projects };
