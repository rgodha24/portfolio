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
            mono: ["Intel Mono"],
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
