import { readdirSync } from "fs";

export async function getProjects() {
   const projects = readdirSync("site/src/content/projects").map((project) =>
      project.replaceAll(".md", ""),
   );

   console.log(projects);

   return projects;
}
export async function getPosts() {
   const posts = readdirSync("site/src/content/blog").map((post) => post.replaceAll(".md", ""));

   console.log(posts);

   return posts;
}
