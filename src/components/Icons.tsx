import { For } from "solid-js";
import { hoveredIcon, icons } from "../icons";

export default function Icons() {
   return (
      <div class="bottom-25px px-18px gap-33px w-800px absolute left-1/2 flex -translate-x-1/2 transform flex-row justify-between ">
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
