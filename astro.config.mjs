import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import solidJs from "@astrojs/solid-js";
import unocss from "unocss/astro";
import vercel from "@astrojs/vercel/static";

export default defineConfig({
  site: "https://rohan.zip",
  integrations: [
    mdx(),
    sitemap(),
    solidJs(),
    unocss({
      mode: "global",
    }),
  ],
  output: "static",
  adapter: vercel({}),
});
