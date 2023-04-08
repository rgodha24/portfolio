import { For, createSignal, onCleanup } from "solid-js";
import TextLine from "./TextLine";

export default function TextBackground() {
   const [height, setHeight] = createSignal(window.innerHeight);
   const [width, setWidth] = createSignal(window.innerWidth);

   const letters = () => calculateLetterAmounts(height(), width()).letters;
   const lines = () => calculateLetterAmounts(height(), width()).lines;

   function handleResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
   }

   window.addEventListener("resize", handleResize);
   onCleanup(() => window.removeEventListener("resize", handleResize));

   return (
      <div
         class="font-mono max-w-full overflow-hidden gradient-text bg-gradient-to-t bg-gradient-from-coolgray-900 bg-gradient-to-slate-700"
         style={{
            "line-height": "20px",
            "font-size": "16px",
         }}
         aria-hidden={true}
      >
         <For each={new Array(lines())}>
            {() => (
               <>
                  <TextLine letters={letters} />
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
