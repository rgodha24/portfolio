import { FileText, Linkedin, Github, Braces, Music, BookMarked } from "lucide-solid";
import { atom } from "nanostores";

export const icons = [
   { name: "resume", link: "/resume", Icon: FileText },
   { name: "linkedin", link: "/linkedin", Icon: Linkedin },
   { name: "github", link: "https://github.com/rgodha24", Icon: Github },
   { name: "projects", link: "/projects", Icon: Braces },
   { name: "music", link: "/music", Icon: Music },
   { name: "books", link: "/books", Icon: BookMarked },
] as const;

export const hoveredIcon = atom<(typeof icons)[number]["name"] | null>(null);
export const names = icons.map((icon) => icon.name);

hoveredIcon.subscribe(console.log);
