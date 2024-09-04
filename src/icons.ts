import { FileText, Linkedin, Github, Braces, Music, BookMarked } from "lucide-solid";
import { atom } from "nanostores";

export const icons = [
   { name: "resume", link: "https://docs.google.com/document/d/e/2PACX-1vR6n_-o3-mLO038zZ-YRmGB3k-j9fPEbmYldCuAM4tMnIsBh12quwxud6QTMOm8jcecsgySJklRm_0v/pub", Icon: FileText },
   { name: "linkedin", link: "https://www.linkedin.com/in/rohan-godha-370711279/", Icon: Linkedin },
   { name: "github", link: "https://github.com/rgodha24", Icon: Github },
   { name: "projects", link: "/projects", Icon: Braces },
   { name: "music", link: "/", Icon: Music },
   { name: "books", link: "/", Icon: BookMarked },
] as const;

export const hoveredIcon = atom<(typeof icons)[number]["name"] | null>(null);
export const names = icons.map((icon) => icon.name);

hoveredIcon.subscribe(console.log);
