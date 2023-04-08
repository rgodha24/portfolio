import { For, createSignal, from, onCleanup } from "solid-js";

export default function TextBackground() {
   const [height, setHeight] = createSignal(window.innerHeight);
   const [width, setWidth] = createSignal(window.innerWidth);
   const letters = () => calculateLetterAmounts(height(), width()).letters;
   const lines = () => calculateLetterAmounts(height(), width()).lines;

   const text = from<string[]>((set) => {
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
                  ).join("")
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
         class="font-mono max-w-full overflow-hidden gradient-text bg-gradient-to-t bg-gradient-from-coolgray-900 bg-gradient-to-slate-700"
         style={{
            "line-height": "20px",
            "font-size": "16px",
         }}
         aria-hidden={true}
      >
         <For each={text()}>
            {(line) => (
               <>
                  {line}
                  <br />
               </>
            )}
         </For>
      </div>
   );
}

function calculateLetterAmounts(height: number, width: number): { lines: number; letters: number } {
   const lines = Math.floor(height / 20);
   const letters = Math.floor(width / 9.5);
   return { lines, letters };
}
