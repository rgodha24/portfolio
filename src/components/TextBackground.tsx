import { For, createEffect, createMemo, createSignal, from, onMount } from "solid-js";

const LINE_HEIGHT = 20;
let LETTER_WIDTH = 8.898;

export default function TextBackground() {
   const body = document.getElementsByTagName("body")[0];
   const [height, setHeight] = createSignal(window.outerHeight);
   const [width, setWidth] = createSignal(window.outerWidth);

   const letters = () => calculateLetterAmounts(height(), width()).letters;
   const lines = () => calculateLetterAmounts(height(), width()).lines;

   const hidden = createMemo(() => {
      const ignored = Array.from(document.querySelectorAll("#ignored"));

      return getHiddenFromIgnored(ignored, lines, letters);
   });

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
            {(line, y) => {
               return (
                  <>
                     {line
                        .map((letter, x) => {
                           const isHidden = (hidden()[y()] || [])[x];
                           return isHidden ? " " : letter;
                        })
                        .join("")}
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

type Point = [number, number];

function getHiddenFromIgnored(ignored: Element[], lines: () => number, letters: () => number) {
   const hidden: boolean[][] = [];

   for (let i = 0; i < lines(); i++) {
      hidden[i] = [];
      for (let j = 0; j < letters(); j++) {
         hidden[i][j] = false;
      }
   }

   const elipses: ((point: Point) => void)[] = [];

   ignored.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const top = Math.ceil(rect.top / LINE_HEIGHT);
      const left = Math.ceil(rect.left / LETTER_WIDTH);
      const bottom = Math.floor(rect.bottom / LINE_HEIGHT);
      const right = Math.floor(rect.right / LETTER_WIDTH);

      const dx = right - left;
      const dy = bottom - top;

      const centery = top + dy / 2;
      const centerx = left + dx / 2.8;

      // TODO: Fix this
      elipses.push((point) => {
         const [x, y] = point;

         const dx2 = x - centerx;
         const dy2 = y - centery;

         const a = dx / 2 + dx / 4;
         const b = dy / 2 + dy / 2.8;

         const inside = (dx2 * dx2) / (a * a) + (dy2 * dy2) / (b * b) <= 1;

         return inside;
      });
   });

   for (let i = 0; i < lines(); i++) {
      for (let j = 0; j < letters(); j++) {
         hidden[i][j] = elipses.some((elipse) => elipse([j, i]));
      }
   }

   return hidden;
}
