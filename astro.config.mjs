import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";
import unocss from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://rohangodha.me/",
  integrations: [mdx(), sitemap(), solidJs(), unocss({
    
  })],
});
