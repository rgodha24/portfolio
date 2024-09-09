# Portfolio

This repo is divided into 3 parts
1. the actual portfolio site, hosted on www.rohangodha.com. This is built with [Astro](docs.astro.build), [SolidJS](solidjs.com), [UnoCSS](unocss.dev) (a utility css framework that is basically just Tailwind), and Cloudflare Pages.
2. A link-shortener, hosted on [(www.)rohan.zip](https://rohan.zip), [(www.)rgodha.com](https://rgodha.com), and [rohangodha.com](https://rohangodha.com). It uses data from the Astro project to generate redirects for every project, blog post, and fallsback to the default index page. It's built using [Hono](hono.dev) and [Bun's macro feature](https://bun.sh/docs/bundler/macros), which allows it to access the fs only during buildtime. This is also running on Cloudflare Pages, but it only uses a worker, without any static HTML.
3. A resume, built using [Typst](https://typst.app/). This resume is based on the data in the content part of the site data. It outputs a resume to site/public/Resume.pdf, which is hosted by Astro on www.rohangodha.com/Resume.pdf.

It's set up as a bun workspace, so you only have to run `bun install` in the root to get the dependencies working. The only dependency not included in the package.json is `typst`, which can be installed with pretty much any package manager.

All of the commands that you could ever need are in the `justfile`, which means you can run `just build` and `just format`.

## credits
The resume was adapted from (imprecv)[https://github.com/jskherman/imprecv/blob/main/LICENSE]
The text background was originally inspired by the (midjourney landing page)[midjourney.com], but it's changed a lot since then.
A much older version of this site was based on the (LiveTerm Template)[https://github.com/Cveinnt/LiveTerm]
