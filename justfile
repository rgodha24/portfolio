default:
  just --list

format:
  taplo format
  prettier --write "**/*.{astro,ts,tsx,js,jsx,cjs,mjs,json}"

format-check:
  taplo format --check
  prettier --check "**/*.{astro,ts,tsx,js,jsx,cjs,mjs,json}"

build: build-resume build-site build-link-shortener

build-site:
  cd site/ && bun run build

build-resume: 
  typst compile --font-path resume/fonts resume/resume.typ site/public/Resume.pdf

build-link-shortener:
  bun build --minify link-shortener/index.ts --outfile dist/_worker.js
