import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import unocss from "unocss/astro";
import cloudflare from "@astrojs/cloudflare";
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
   site: "https://www.rohangodha.com",
   integrations: [
      mdx(),
      sitemap(),
      solidJs(),
      unocss({
         mode: "global",
         injectReset: true,
      }),
      prefetch(),
   ],
   output: "hybrid",
   adapter: cloudflare({ imageService: "compile" }),
});
