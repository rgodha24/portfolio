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
            mono: ["Monaspace Krypton"],
            sans: ["Norwester"],
            handwriting: [
               "Monaspace Radon",
               "Brush Script MT",
               "Segoe Script",
               "Lucida Handwriting",
               "cursive",
            ],
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
