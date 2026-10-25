// scrolling ascii background. rows rotate upward every tick, and cells near the
// cursor get redrawn in a highlight color that fades out toward the edge of the radius

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const FONT = `300 16px "Monaspace Krypton", ui-monospace, monospace`;
const LINE_HEIGHT = 19.5;

type Opts = { tick: number; paint: string; cursor: { radius: number; paint: string } };

export function startAscii(canvas: HTMLCanvasElement, opts: Opts) {
   const ctx = canvas.getContext("2d")!;
   let w = 0, h = 0, cols = 0, rows = 0, charW = 10;
   let grid: string[][] = [];
   let mouse = { x: -9999, y: -9999 };
   let dirty = true;

   const rand = () => LETTERS[Math.floor(Math.random() * LETTERS.length)];

   function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT;
      charW = ctx.measureText("M").width;
      cols = Math.ceil(w / charW);
      rows = Math.ceil(h / LINE_HEIGHT);
      grid = Array.from({ length: rows }, () => Array.from({ length: cols }, rand));
      dirty = true;
   }

   // 1 at the cursor, 0 at the edge of the radius and beyond
   function near(r: number, c: number) {
      const dx = c * charW - mouse.x;
      const dy = r * LINE_HEIGHT - mouse.y;
      const d2 = (dx * dx + dy * dy) / opts.cursor.radius ** 2;
      return d2 >= 1 ? 0 : 1 - Math.sqrt(d2);
   }

   function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.font = FONT;
      // one fillText per row is much faster than per cell
      ctx.fillStyle = opts.paint;
      grid.forEach((row, r) => ctx.fillText(row.join(""), 0, (r + 0.8) * LINE_HEIGHT));

      ctx.fillStyle = opts.cursor.paint;
      for (let r = 0; r < rows; r++) {
         for (let c = 0; c < cols; c++) {
            const n = near(r, c);
            if (!n) continue;
            // solid core, then a linear fade over the outer part of the radius
            ctx.globalAlpha = Math.min(1, n * 1.8);
            ctx.fillText(grid[r][c], c * charW, (r + 0.8) * LINE_HEIGHT);
         }
      }
      ctx.globalAlpha = 1;
   }

   let prev = 0;
   function loop(t: number) {
      requestAnimationFrame(loop);
      if (t - prev >= opts.tick) {
         prev = t;
         grid.push(grid.shift()!);
         dirty = true;
      }
      if (dirty) {
         draw();
         dirty = false;
      }
   }

   new ResizeObserver(resize).observe(canvas.parentElement!);
   window.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      dirty = true;
   });
   document.fonts.ready.then(resize);
   resize();
   requestAnimationFrame(loop);
}
