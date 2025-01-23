# Portfolio

This repo is divided into 3 parts
1. the actual portfolio site, hosted on www.rohangodha.com. This is built with [Astro](docs.astro.build), [UnoCSS](unocss.dev) (a utility css framework that is basically just Tailwind), and Cloudflare Pages.
2. A link-shortener, hosted on [(www.)rohan.zip](https://rohan.zip), [(www.)rgodha.com](https://rgodha.com), and [rohangodha.com](https://rohangodha.com). It uses data from the Astro project to generate redirects for every project and blog post. It's built using [Hono](hono.dev) and [Bun's macro feature](https://bun.sh/docs/bundler/macros), which allows it to access the fs only during buildtime. This is also running on Cloudflare Pages.
3. A resume, built using [Typst](https://typst.app/). This resume is based on the data in `resume/data.toml`. It outputs a resume to `site/public/Resume.pdf`, which is hosted by Astro on `rohangodha.com/Resume.pdf`. Additionally, it has a `resume/config.toml` file which changes parts of the resume for different companies I apply to. The rust project in that directory opens up a webpage that lets me configure my resume super easily using [brutsuin/json-forms](https://github.com/brutusin/json-forms). It's then saved to my documents folder, so I can easily upload it to an internship application.

It's set up as a bun workspace, so you only have to run `bun install` in the root to get the dependencies working. The only dependency not included in the package.json is `typst`, which can be installed with pretty much any package manager. This site uses typst v0.12

All of the commands that you could ever need are in the `justfile`, which means you can run `just build` and `just format`.

## Credits
The resume was adapted from [imprecv](https://github.com/jskherman/imprecv/blob/main/LICENSE)

The text background was originally inspired by the [midjourney landing page](midjourney.com), but it's changed a lot since then.
