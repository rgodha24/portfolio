import { For } from "solid-js";
import { hoveredIcon, icons } from "../icons";

export default function Icons() {
   return (
      <div class="md:bottom-25px md:px-18px md:gap-33px md:w-800px grid transform grid-cols-3 grid-rows-2 place-items-center justify-between gap-y-4 md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:flex-row">
         <For each={icons}>
            {({ name, Icon, link }) => (
               <a
                  class="w-100px h-100px border-x-1 icon-shadow-blur bg-#180849/60 hover:bg-#17005C/50 backdrop-blur-2px flex flex-row items-center justify-center rounded-full border-b-2 border-sky-400 text-sky-400 shadow-md shadow-blue-900 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
                  href={link}
                  target={link.startsWith("/") ? "_self" : "_blank"}
                  onMouseEnter={() => hoveredIcon.set(name)}
                  onMouseLeave={() => hoveredIcon.set(null)}
               >
                  <Icon size={60} />
               </a>
            )}
         </For>
      </div>
   );
}
