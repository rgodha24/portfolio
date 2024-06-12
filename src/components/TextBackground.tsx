import { For, createSignal, from } from "solid-js";
import "../styles/ignored.css";

const LINE_HEIGHT = 20;
const LETTER_WIDTH = 9;
const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyz";

export default function TextBackground() {
   const [height, setHeight] = createSignal(window.outerHeight);
   const [width, setWidth] = createSignal(window.outerWidth);

   const letters = () => calculateLetterAmounts(height(), width()).letters;
   const lines = () => calculateLetterAmounts(height(), width()).lines;

   const text = from<string[][]>((set) => {
      const interval = setInterval(() => {
         set((prev) => {
            if (prev !== undefined) {
               const a = prev.shift()!;
               prev.push(a);
               return prev;
            }

            prev = [];

            for (let i = 0; i < lines(); i++) {
               const newPart = Array.from(
                  { length: letters() },
                  () => ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)]
               );
               prev.push(newPart);
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
         class="gradient-text bg-gradient-to-indigo-800 bg-gradient-from-sky-800 max-h-full max-w-full select-none overflow-hidden whitespace-pre bg-gradient-to-t font-mono"
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
   const letters = Math.ceil(width / LETTER_WIDTH);

   return { lines, letters };
}
