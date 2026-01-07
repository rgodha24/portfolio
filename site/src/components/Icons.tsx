import { For, Show, createSignal } from "solid-js";
import { hoveredIcon, icons, showIconBar, type IconName } from "../icons";
import { useStore } from "@nanostores/solid";

export default function Icons({ hideable }: { hideable: boolean }) {
   const showIcons = useStore(showIconBar);
   const [tappedIcon, setTappedIcon] = createSignal<IconName | null>(null);

   const handleTouchStart = (name: IconName) => {
      setTappedIcon(name);
      hoveredIcon.set(name);
   };

   const handleTouchEnd = () => {
      // Keep showing for a moment so user can see the label
      setTimeout(() => {
         setTappedIcon(null);
         hoveredIcon.set(null);
      }, 1500);
   };

   return (
      <Show when={!hideable || (hideable && showIcons())}>
         <div class="w-800px h-70px bg-#121A5D/50 rounded-24px border-x-1.5 border-b-3 border-t-1 backdrop-blur-sm absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform border-sky-400 md:block"></div>
         <div class="md:bottom-25px md:px-18px md:gap-33px md:w-800px grid transform grid-cols-3 grid-rows-2 place-items-center justify-between gap-y-4 md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:flex-row">
            <For each={icons}>
               {({ name, Icon, link }) => (
                  <div class="group relative rounded-full">
                     {/* Tooltip label */}
                     <div
                        class="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-sky-400/50 text-sky-300 text-sm font-medium whitespace-nowrap backdrop-blur-sm opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-top-12"
                        classList={{
                           "!opacity-100 !-top-12": tappedIcon() === name,
                        }}
                     >
                        {name}
                        {/* Arrow */}
                        <div class="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-slate-900/90 border-r border-b border-sky-400/50 rotate-45" />
                     </div>
                     <a
                        class="w-100px h-100px border-x-1 bg-#180849/60 group-hover:bg-#17005C/40 backdrop-blur-sm flex flex-row items-center justify-center rounded-full border-b-2 border-sky-400 text-sky-400 shadow-md shadow-blue-900 transition-transform duration-200 group-hover:-translate-y-2 group-hover:shadow-lg"
                        href={link}
                        target={link.startsWith("/") ? "_self" : "_blank"}
                        onMouseEnter={() => hoveredIcon.set(name)}
                        onMouseLeave={() => hoveredIcon.set(null)}
                        onTouchStart={() => handleTouchStart(name)}
                        onTouchEnd={handleTouchEnd}
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
