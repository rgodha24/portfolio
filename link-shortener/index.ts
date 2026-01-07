import { getProjects } from "./data.ts" with { type: "macro" };
import { Hono } from "hono";

const projects = await getProjects();
const app = new Hono();

app.get("/:path", (c) => {
   const path = c.req.param("path");

   if (projects.includes(path)) {
      return c.redirect("https://www.rohangodha.com/projects/" + path);
   } else if (/resume(.pdf)?/gi.test(path)) {
      return c.redirect("https://www.rohangodha.com/Resume.pdf");
   }

   // cf pages automatically redirects 404s to `/` so this is fine
   return c.redirect("https://www.rohangodha.com" + c.req.path);
});

// cf pages automatically redirects 404s to `/` so this is fine
app.get("*", (c) => c.redirect("https://www.rohangodha.com" + c.req.path));

export default {
   fetch: app.fetch,
};
