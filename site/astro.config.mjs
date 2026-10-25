import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
   site: "https://www.rohangodha.com",
   integrations: [sitemap()],
   output: "static",
   adapter: cloudflare({ imageService: "compile" }),
});
