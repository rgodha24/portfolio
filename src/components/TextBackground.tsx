import { For, createMemo, createSignal, from } from "solid-js";

export default function TextBackground() {
   const [height, setHeight] = createSignal(window.innerHeight);
   const [width, setWidth] = createSignal(window.innerWidth);

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
         class=" max-w-full overflow-hidden gradient-text bg-gradient-to-t bg-gradient-from-coolgray-900 bg-gradient-to-slate-700 font-mono whitespace-pre"
         style={{
            "line-height": "20px",
            "font-size": "16px",
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

const LINE_HEIGHT = 20;
const LETTER_WIDTH = 9.7;

function calculateLetterAmounts(height: number, width: number): { lines: number; letters: number } {
   const lines = Math.floor(height / LINE_HEIGHT);
   const letters = Math.floor(width / LETTER_WIDTH) + 1;
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
      const top = Math.ceil(rect.top / LINE_HEIGHT) - 1;
      const left = Math.ceil(rect.left / LETTER_WIDTH);
      const bottom = Math.floor(rect.bottom / LINE_HEIGHT);
      const right = Math.floor(rect.right / LETTER_WIDTH);

      const dx = right - left;
      const dy = bottom - top;

      const centery = top + dy / 2;
      const centerx = left + dx / 2;

      // TODO: Fix this
      elipses.push((point) => {
         const [x, y] = point;

         const dx2 = x - centerx;
         const dy2 = y - centery;

         const a = dx / 2 + 5;
         const b = dy / 2 + 2;

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
