import { defineConfig, presetTypography, presetWind, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [presetWind(), presetTypography()],
  transformers: [
    transformerDirectives({
      applyVariable: "@apply",
    }),
  ],
});
