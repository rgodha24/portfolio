import { defineCollection, z } from "astro:content";
import { Api, Range } from "@statsfm/statsfm.js";

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

// astro is so cool
const albums = defineCollection({
   loader: async () => {
      const api = new Api();
      const albums = await api.users.topAlbums("rgodha", {
         range: Range.WEEKS,
      });
      console.log(JSON.stringify(albums));

      return albums.slice(0, 30).map(({ album }) => ({
         ...album,
         id: album.id.toString(),
         name: album.name.replace(/\([\w\s]+\)/gi, ""),
      }));
   },
   schema: z.object({
      id: z.string(),
      name: z.string(),
      image: z.string().url(),
      artists: z.array(
         z.object({
            name: z.string(),
         }),
      ),
   }),
});

export const collections = { blog, projects, albums };
