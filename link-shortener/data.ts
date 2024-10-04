import { readdirSync, readFileSync } from "fs";
import { parse } from "toml";

export async function getProjects() {
   const projects = parse(readFileSync("resume/projects.toml").toString());

   return Object.keys(projects);
}
export async function getPosts() {
   const posts = readdirSync("site/src/content/blog").map((post) => post.replaceAll(".md", ""));

   console.log(posts);

   return posts;
}
