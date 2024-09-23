import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (context) => {
   const posts = await getCollection("blog");

   return rss({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      site: context.site?.toString() || "",
      items: posts.map((post) => ({
         ...post.data,
         link: `/blog/${post.slug}/`,
      })),
   });
};
