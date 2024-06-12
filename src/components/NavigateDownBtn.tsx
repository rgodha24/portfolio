export default function NavigateDownBtn() {
   return (
      <div class="left-50% bottom-2% absolute ">
         {/* this is completely stolen from midjourney's website */}
         <button
            onClick={() => {
               window.scroll({
                  top: window.innerHeight,
                  behavior: "smooth",
               });
            }}
            class="absolute bottom-4 right-1/2 z-10 flex aspect-square w-fit min-w-max basis-1 translate-x-1/2 items-center items-center justify-center justify-center gap-2 gap-2 rounded-full bg-slate-700/20 bg-opacity-50 p-2 px-5 text-center text-sm font-bold font-medium outline-[#09073a]/50 backdrop-blur-lg transition-all hover:bg-slate-600/50 hover:bg-opacity-100 active:bg-opacity-90 md:text-base"
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
