import { ChevronDown } from "lucide-solid";
import { showIconBar } from "../icons";
import { useStore } from "@nanostores/solid";

export default function HideMenu() {
   const showIcon = useStore(showIconBar);

   return (
      <button
         class={`border-sky-400 border-2 bg-#180849/60 hover:bg-#17005C/50 backdrop-blur-2px hover:backdrop-blur-4px hover:scale-105 text-sky-400 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex justify-center items-center transition-transform duration-200 ${showIcon() ? "" : "rotate-180"}`}
         onClick={() => showIconBar.set(!showIcon())}
      >
         <ChevronDown class="w-full h-full p-2" />
      </button>
   );
}
