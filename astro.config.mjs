import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import unocss from "unocss/astro";

// https://astro.build/config
import vercel from "@astrojs/vercel/static";

// https://astro.build/config
export default defineConfig({
  site: "https://rgodha.com",
  integrations: [mdx(), sitemap(), solidJs(), unocss()],
  output: "static",
  adapter: vercel({}),
});
