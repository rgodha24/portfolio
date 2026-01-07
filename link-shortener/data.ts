import { readdirSync, readFileSync } from "fs";
import { parse } from "toml";

export async function getProjects() {
   const projects = parse(readFileSync("resume/projects.toml").toString());

   return Object.keys(projects);
}
