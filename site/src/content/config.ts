import { defineCollection, z } from "astro:content";
import { Api, Range } from "@statsfm/statsfm.js";
import { parse as parseToml } from "toml";
import { file } from "astro/loaders";

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
   loader: file("../resume/projects.toml", {
      // I contributed this! https://github.com/withastro/astro/pull/12047
      parser: parseToml,
   }),
   schema: z.object({
      title: z.string(),
      blurb: z.string(),
      order: z.number().optional().default(100),
      tech: z.string().array(),

      // format like `rgodha24/portfolio`
      github: z.string().regex(/[\w-]+\/[\w-]+/gi),
      website: z.string().url().optional(),
   }),
});

// astro is so cool
const albums = defineCollection({
   loader: async () => {
      const api = new Api();
      const albums = await api.users.topAlbums("rgodha", {
         range: Range.WEEKS,
      });

      return albums.slice(0, 30).map(({ album }) => ({
         ...album,
         id: album.id.toString(),
         name: album.name.replaceAll(/\([\w\s]+\)/gi, ""),
         spotifyId: album.externalIds?.spotify?.[0],
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
      spotifyId: z.string().nullish(),
   }),
});

export const collections = { blog, projects, albums };
