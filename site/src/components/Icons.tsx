import { For, Show } from "solid-js";
import { hoveredIcon, icons, showIconBar } from "../icons";
import { useStore } from "@nanostores/solid";

export default function Icons({ hideable }: { hideable: boolean }) {
   const showIcons = useStore(showIconBar);

   return (
      <Show when={!hideable || (hideable && showIcons())}>
         <div class="w-800px h-70px bg-#121A5D/50 rounded-24px border-x-1.5 border-b-3 border-t-1 backdrop-blur-sm absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform border-sky-400 md:block"></div>
         <div class="md:bottom-25px md:px-18px md:gap-33px md:w-800px grid transform grid-cols-3 grid-rows-2 place-items-center justify-between gap-y-4 md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:flex-row">
            <For each={icons}>
               {({ name, Icon, link }) => (
                  <div class="group relative rounded-full">
                     <a
                        class="w-100px h-100px border-x-1 bg-#180849/60 group-hover:bg-#17005C/40 backdrop-blur-sm flex flex-row items-center justify-center rounded-full border-b-2 border-sky-400 text-sky-400 shadow-md shadow-blue-900 transition-transform duration-200 group-hover:-translate-y-2 group-hover:shadow-lg"
                        href={link}
                        target={link.startsWith("/") ? "_self" : "_blank"}
                        onMouseEnter={() => hoveredIcon.set(name)}
                        onMouseLeave={() => hoveredIcon.set(null)}
                        aria-label={name}
                     >
                        <Icon size={60} />
                     </a>
                  </div>
               )}
            </For>
         </div>
      </Show>
   );
}
