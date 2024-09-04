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
            mono: ["Monaspace Radon"],
            heading: [
               "Norwester",
               "ui-sans-serif",
               "system-ui",
               "-apple-system",
               "BlinkMacSystemFont",
               "Segoe UI",
               "Roboto",
               "Helvetica Neue",
               "Arial",
               "Noto Sans",
               "sans-serif",
            ],
            sans: ["Raleway"],
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
