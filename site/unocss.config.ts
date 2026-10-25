import {
   defineConfig,
   presetTypography,
   presetWebFonts,
   presetWind,
   transformerDirectives,
} from "unocss";

export default defineConfig({
   presets: [
      presetWind(),
      presetWebFonts({
         fonts: {
            mono: ["IBM Plex Mono"],
            sans: ["Inter Variable"],
         },
         provider: "none",
      }),
      presetTypography({
         cssExtend: {
            a: {
               "text-decoration": "none",
            },
         },
      }),
   ],
   transformers: [
      transformerDirectives({
         applyVariable: "@apply",
      }),
   ],
});
