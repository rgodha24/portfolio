import { z } from "astro:content";

export const technologies = ["unocss", "tailwind", "rust", "tauri", "svelte"] as const;

export type Technologies = (typeof technologies)[number];

export const techLinks = {
   unocss: "https://uno.antfu.me",
   tailwind: "https://tailwindcss.org",
   rust: "https://rust-lang.org",
   tauri: "https://tauri.app",
   svelte: "https://svelte.dev",
} as const satisfies Record<Technologies, string>;

export const techIcons = {
   unocss: "https://raw.githubusercontent.com/unocss/unocss/main/playground/public/icon-gray.svg",
   tailwind:
      "https://tailwindcss.com/_next/static/media/tailwindcss-mark.79614a5f61617ba49a0891494521226b.svg",
   rust: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/2048px-Rust_programming_language_black_logo.svg.png",
   tauri: "https://cdn.worldvectorlogo.com/logos/tauri-1.svg",
   svelte:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1702px-Svelte_Logo.svg.png",
} as const satisfies Record<Technologies, string>;

export const technologiesSchema = z.enum(technologies);
