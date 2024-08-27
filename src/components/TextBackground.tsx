import { createSignal, onCleanup, onMount } from "solid-js";

const ALL_LETTERS = "abcdefghijklmnopqrstuvwxyz";

export default function TextBackground() {
   let canvasRef: HTMLCanvasElement | undefined = undefined;
   const [sizes, setSizes] = createSignal(calculateSizes(window.innerHeight, window.innerWidth));
   let text: string[] = [];

   onMount(() => {
      if (!canvasRef) return;
      const canvas: HTMLCanvasElement = canvasRef;
      const ctx = canvas.getContext("2d")!;

      const handleResize = () => {
         setSizes(calculateSizes(window.innerHeight, window.innerWidth));
         text = [];
      };
      window.addEventListener("resize", handleResize);
      onCleanup(() => window.removeEventListener("resize", handleResize));

      // intentionally not requestAnimationFrame() bc it would run too fast
      const interval = setInterval(() => {
         if (text.length === 0) {
            text = generateText(sizes().lines, sizes().letters);
         }

         updateText(text);

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.font = "16px Intel One Mono";
         ctx.letterSpacing = `${sizes().letterSpacing}px`;
         ctx.textRendering = "optimizeLegibility";

         const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
         gradient.addColorStop(0.5, "#3730A3"); //indigo-800
         gradient.addColorStop(1, "#38BDF9"); //sky-400

         text.forEach((line, i) => {
            ctx.fillStyle = gradient;
            ctx.fillText(line, 0, (i + 1) * sizes().lineHeight, window.innerWidth);
         });
      }, 100);
      onCleanup(() => clearInterval(interval));
   });

   return (
      <canvas
         ref={canvasRef}
         aria-hidden="true"
         width={sizes().width}
         height={sizes().height}
      />
   );
}

function generateText(lines: number, letters: number): string[] {
   const text: string[] = [];
   for (let i = 0; i < lines; i++) {
      const line = [];
      for (let j = 0; j < letters; j++) {
         line.push(ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)]);
      }
      text.push(line.join(""));
   }

   return text;
}

// mutates in place
function updateText(text: string[]) {
   const first = text.shift()!;
   text.push(first);
}

function calculateSizes(height: number, width: number) {
   const minLineHeight = 17;
   const maxLineHeight = 21;
   const minLetterSpacing = -0.3;
   const maxLetterSpacing = 0.3;
   const charWidth = 9.83;

   let bestSolution = null;
   let minEmptySpace = Infinity;

   for (let lineHeight = minLineHeight; lineHeight <= maxLineHeight; lineHeight += 0.1) {
      const lines = Math.floor(height / lineHeight);

      for (
         let letterSpacing = minLetterSpacing;
         letterSpacing <= maxLetterSpacing;
         letterSpacing += 0.1
      ) {
         const effectiveCharWidth = charWidth + letterSpacing;
         const letters = Math.floor(width / effectiveCharWidth);

         const usedWidth = letters * effectiveCharWidth;
         const usedHeight = lines * lineHeight;

         const emptySpace = width - usedWidth + (height - usedHeight);

         if (emptySpace < minEmptySpace) {
            minEmptySpace = emptySpace;
            bestSolution = {
               lines: lines,
               letters: letters,
               lineHeight: parseFloat(lineHeight.toFixed(1)),
               letterSpacing: parseFloat(letterSpacing.toFixed(1)),
            };
         }
      }
   }

   return { ...bestSolution!, height, width };
}
