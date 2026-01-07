import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import unocss from "unocss/astro";
import cloudflare from "@astrojs/cloudflare";
import prefetch from "@astrojs/prefetch";
import markdownIntegration from "@astropub/md";

// https://astro.build/config
export default defineConfig({
   site: "https://www.rohangodha.com",
   integrations: [
      sitemap(),
      solidJs(),
      unocss({ mode: "global", injectReset: true }),
      prefetch(),
      markdownIntegration(),
   ],
   output: "static",
   adapter: cloudflare({ imageService: "compile" }),
   image: {
      remotePatterns: [{ hostname: "**.scdn.co" }, { hostname: "**.mzstatic.com" }],
   },
});
