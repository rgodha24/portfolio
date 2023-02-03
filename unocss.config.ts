// unocss.config.js
import { defineConfig, presetAttributify, presetTypography, presetWind, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [
    presetAttributify(), // required if using attributify mode
    presetWind(), // required
    presetTypography(),
  ],
  transformers: [
    transformerDirectives({
      applyVariable: "@apply",
    }),
  ],
});
