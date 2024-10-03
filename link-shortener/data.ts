import { readdirSync } from "fs";
import { parse } from "toml";

export async function getProjects() {
   const projects = parse("resume/projects.toml");

   return Object.keys(projects);
}
export async function getPosts() {
   const posts = readdirSync("site/src/content/blog").map((post) => post.replaceAll(".md", ""));

   console.log(posts);

   return posts;
}
