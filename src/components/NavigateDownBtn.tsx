export default function NavigateDownBtn() {
   return (
      <div class="absolute left-50% bottom-2% ">
         {/* this is completely stolen from midjourney's website */}
         <button
            onClick={() => {
               window.scroll({
                  top: window.outerHeight,
                  behavior: "smooth",
               });
            }}
            class="flex gap-2 justify-center items-center w-fit font-medium basis-1 gap-2 justify-center items-center p-2 px-5 min-w-max bg-opacity-50 text-sm font-bold text-center hover:bg-opacity-100 active:bg-opacity-90 rounded-full backdrop-blur-lg transition-all md:text-base outline-[#09073a]/50 absolute right-1/2 bottom-4 z-10 aspect-square translate-x-1/2 bg-slate-700/20 hover:bg-slate-600/50"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="2"
               stroke="currentColor"
               aria-hidden="true"
               height="20"
               class="inline text-slate-100"
            >
               <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
               ></path>
            </svg>
         </button>
      </div>
   );
}
