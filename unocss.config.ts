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
            mono: ["Space Mono"],
         },
         provider: "google",
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
