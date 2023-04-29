import { For, createSignal, from } from "solid-js";
import "../styles/ignored.css";

const LINE_HEIGHT = 20;
let LETTER_WIDTH = 8.898;

export default function TextBackground() {
   const [height, setHeight] = createSignal(window.outerHeight);
   const [width, setWidth] = createSignal(window.outerWidth);

   const letters = () => calculateLetterAmounts(height(), width()).letters;
   const lines = () => calculateLetterAmounts(height(), width()).lines;

   const text = from<string[][]>((set) => {
      const interval = setInterval(() => {
         set((prev) => {
            const newlines = lines() - (prev?.length || 0) + 1;

            if (prev === undefined) {
               prev = [];
            }

            prev.shift();

            for (let i = 0; i < newlines; i++) {
               prev?.push(
                  Array.from({ length: letters() }, () =>
                     String.fromCharCode(Math.floor(Math.random() * 26) + 97)
                  )
               );
            }

            return prev;
         });
      }, 100);

      function handleResize() {
         set(undefined);
         setHeight(window.innerHeight);
         setWidth(window.innerWidth);
      }

      window.addEventListener("resize", handleResize);

      return () => {
         clearInterval(interval);
         window.removeEventListener("resize", handleResize);
      };
   });

   return (
      <div
         class="overflow-hidden max-w-full font-mono whitespace-pre bg-gradient-to-t gradient-text bg-gradient-from-coolgray-900 bg-gradient-to-slate-700"
         style={{
            "line-height": "20px",
         }}
         aria-hidden={true}
      >
         <For each={text()}>
            {(line) => {
               return (
                  <>
                     {line.join("")}
                     <br />
                  </>
               );
            }}
         </For>
      </div>
   );
}

function calculateLetterAmounts(height: number, width: number): { lines: number; letters: number } {
   const lines = Math.floor(height / LINE_HEIGHT);
   const letters = Math.floor(width / LETTER_WIDTH) + 1 - (14 / 1440) * width;

   return { lines, letters };
}
