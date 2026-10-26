// scrolling ascii background with a tiny clone commando that patrols the tops of page
// elements, hops between them, and blasts droids. bolts rewrite the letters they pass
// through into ascii trails that burn down through a glyph + color ramp

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const FONT = `300 16px "Monaspace Krypton", ui-monospace, monospace`;
export const LINE_HEIGHT = 19.5;
const WALK = 45; // px/s
const GRAVITY = 1600; // px/s²
const BOLT_SPEED = 700; // px/s

// every grid effect is a kind that burns down through its glyphs and colors over its life.
// "?" keeps the letter underneath and just tints it.
const C = { white: "#eaf2ff", ice: "#c5dcff", cyan: "#8fe3ff", blue: "#7fa6ff", peri: "#8f9cff", violet: "#a58bff", indigo: "#4b5fd6", deep: "#2f3a7a", amber: "#ffb86b" };
export const FX = {
   head: { seq: ">", pal: [C.white], life: 80, a: 1.3 },
   trail: { seq: "==-~·.", pal: [C.ice, C.blue, C.blue, C.blue, C.peri, C.violet, C.indigo], life: 1500, a: 1 },
   glow: { seq: "?", pal: [C.blue, C.blue, C.blue, C.peri, C.indigo], life: 1400, a: 0.55 },
   glint: { seq: "'·.", pal: [C.cyan, C.blue, C.violet], life: 900, a: 0.6 },
   core: { seq: "@#*+:·.", pal: [C.white, C.cyan, C.blue, C.blue, C.violet, C.indigo], life: 1000, a: 1 },
   ring: { seq: "*+x:·.", pal: [C.cyan, C.blue, C.blue, C.peri, C.violet, C.indigo], life: 900, a: 0.85 },
   edge: { seq: "o°·.", pal: [C.blue, C.peri, C.violet, C.indigo], life: 800, a: 0.6 },
   spark: { seq: "*+·.", pal: [C.amber, C.amber, C.violet, C.indigo], life: 700, a: 0.9 },
   ember: { seq: "*:·.", pal: [C.cyan, C.blue, C.blue, C.violet], life: 600, a: 0.8 },
   ash: { seq: "._", pal: [C.blue, C.indigo, C.deep], life: 1400, a: 0.6 },
   muzzle: { seq: "*+·", pal: [C.white, C.cyan, C.blue], life: 260, a: 1.3 },
   step: { seq: "_.", pal: [C.blue, C.peri, C.indigo], life: 1600, a: 0.7 },
};
export type Kind = keyof typeof FX;
type Fx = { kind: Kind; seq: string; time: number };

// what an effect looks like t (0..1) through its life; glyph null means "the letter underneath"
export function look(kind: Kind, t: number, seq = FX[kind].seq) {
   const k = FX[kind], g = seq[Math.min(seq.length - 1, Math.floor(t * seq.length))];
   return { glyph: g === "?" ? null : g, color: k.pal[Math.min(k.pal.length - 1, Math.floor(t * k.pal.length))], alpha: Math.min(1, k.a) * (1 - t * t) };
}

// knock out the letter in a cell, then draw the effect glyph over it
export function paintCell(g: CanvasRenderingContext2D, x: number, y: number, w: number, bg: string, letter: string, kind: Kind, t: number, seq?: string) {
   const { glyph, color, alpha } = look(kind, t, seq);
   g.globalAlpha = 1;
   g.fillStyle = bg;
   g.fillRect(x, y, w, LINE_HEIGHT);
   g.fillStyle = color;
   g.globalAlpha = alpha;
   g.fillText(glyph ?? letter, x, y + 0.8 * LINE_HEIGHT);
   g.globalAlpha = 1;
}

// the streak glyph for a bolt heading (vx, vy), and its head
export function streak(vx: number, vy: number) {
   const slope = Math.abs(vy) / (Math.abs(vx) || 1);
   const line = slope < 0.6 ? "-" : slope > 2.5 ? "|" : vx * vy > 0 ? "\\" : "/";
   // glow sits beside the streak: above/below a flat one, left/right of a steep one
   const side = slope > 1 ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];
   return { seq: slope < 0.3 ? FX.trail.seq : line + line + (slope < 0.6 ? "~" : ":") + "·.", head: slope < 0.6 ? (vx > 0 ? ">" : "<") : "*", side };
}

// cells of an ascii shockwave: farther cells arrive later, cooler, and sparser
export function burstCells(size: number) {
   const out: { dc: number; dr: number; kind: Kind; delay: number }[] = [];
   for (let dr = -size; dr <= size; dr++) {
      for (let dc = -size * 2; dc <= size * 2; dc++) {
         const d = Math.hypot(dc / 2, dr);
         if (d > size + 0.3 || Math.random() > 1.15 - d / size) continue;
         const kind: Kind = Math.random() < 0.03 ? "spark" : d === 0 ? "core" : d < size * 0.55 ? "ring" : Math.random() < 0.5 ? "glow" : "edge";
         out.push({ dc, dr, kind, delay: d * 55 });
      }
   }
   return out;
}

const SCALE = 2;
const SPRITE_H = 48;
const PALETTE: Record<string, string> = {
   o: "#25262b", k: "#131417", A: "#e4e4e2", H: "#f4f4ef",
   S: "#85857f", s: "#55554f", V: "#7fa6ff", v: "#47659f", C: "#c5dcff",
};

// Each row is an art pixel; all poses share a 20 × 24 canvas and a foot anchor.
const HELMET = [
   ".....ooooooo........",
   "....oHHHAAAASo......",
   "...oHHAAAAAASSo.....",
   "...oHAAAAAAAASo.....",
   "...oASSSSSSSSSo.....",
   "...oSVVVVVVVVSo.....",
   "...oAAokVVkAAAo.....",
   "...oASAkVVoASSo.....",
   "....oASkVVsASo......",
   ".....oSSSSSSo.......",
];
const CHEST = [
   "....ssokkkko........",
   "...ssoAAAAAAoo......",
   "...soHAVAAASAAo.....",
   "...soSAASSASASo.....",
   "....oSAAkAAokso.....",
   "....okoSSSokssSSs...",
   ".....oSAASo..skssV..",
];
const FEET = [
   [".....oAAkAAo........", ".....oASkASo........", ".....okk.kko........", ".....oAS.ASo........", ".....oAS.ASo........", "....oAAS.AASo.......", "....oooo.oooo......."],
   [".....oAAkAAo........", "....oASkkASo........", "....oAS..kko........", "....okk..ASo........", "....oAS...ASo.......", "...oAAS...ASSo......", "...oooo...oooo......"],
   [".....oAAkAAo........", ".....oASkASo........", "......kkkASo........", "......AS.ASo........", ".....oAS.ASo........", ".....oAS.AASo.......", ".....ooo.oooo......."],
   [".....oAAkAAo........", ".....oASkkASo.......", ".....okk..ASo.......", "....oAS...kko.......", "...oAS....ASo.......", "...oASS...AASo......", "...oooo...oooo......"],
];
const SHOOT = [
   "....ssokkkko........",
   "...ssoAAAAAAoo......",
   "...soHAVAAASAAo.....",
   "...soSAAoSSAAAoo....",
   "....oSAAAASSSSo.....",
   "....okoSSSo.........",
   ".....oSAASo.........",
];
const SALUTE = [
   "....ssokkkko.ASo....",
   "...ssoAAAAAAoASo....",
   "...soHAVAAASoASo....",
   "...soSAASSASoSo.....",
   "....oSAAkAAoko......",
   "....okoSSSok........",
   ".....oSAASo.........",
];
const TROOPER = {
   idle: [...HELMET, ...CHEST, ...FEET[0]],
   walk: FEET.map((feet, i) => i % 2 ? ["", ...HELMET, ...CHEST, ...feet.slice(1)] : [...HELMET, ...CHEST, ...feet]),
   shoot: [...HELMET, ...SHOOT, ...FEET[1]],
   salute: [...HELMET.map((row, i) => i === 7 ? row.slice(0, 14) + "AAo..." : i > 7 ? row.slice(0, 15) + "ASo.." : row), ...SALUTE, ...FEET[0]],
   rise: [...HELMET, ...CHEST, ".....oAAkAAo........", ".....oASkASo........", "......kkkASo........", "......AS.ASo........", "......SS..ASo.......", "......oo..SSo.......", "..........ooo......."],
   jump: [...HELMET, ...CHEST, ".....oAAkAAo........", "....oAASkAASo.......", "....oSSo.oSSo.......", ".....oo...oo........", "", "", ""],
   land: ["", "", ...HELMET.slice(0, 9), ...CHEST.slice(0, 6), ".....oAAkAAo........", "....oAASkAASo.......", "...oASokkoASo.......", "...oSSo..oSSo.......", "...oAS....ASo.......", "..oAAS....AASo......", "..oooo....oooo......"],
};
const DROID_HEAD = [
   ".......ssss.........",
   "......sSSSSss.......",
   "......sSSSkkSs......",
   ".......sSSSSSSs.....",
   ".......sSssSSSs.....",
   ".......sS..sss......",
   ".......sS...........",
   "....ss.sS...........",
   "...sSssSSs..........",
   "...sSssSSSss........",
   "...sSssSsssSs.......",
   "....ss.Ss..sSs......",
   ".......Ss...ss......",
   "......sSSs..........",
];
const DROID = [
   ["......Ss.Ss.........", ".....Ss..Ss.........", ".....Ss...Ss........", "....ss....ss........", "....Ss.....Ss.......", "....Ss.....Ss.......", "...sSS.....SSs......", "...sss.....sss......"],
   ["......Ss.Ss.........", "......Ss.Ss.........", "......Ss.Ss.........", "......ss.ss.........", "......Ss.Ss.........", "......Ss.Ss.........", "......SSsSSs........", "......ssssss........"],
   ["......Ss.Ss.........", "......Ss..Ss........", ".....Ss....Ss.......", ".....ss....ss.......", "....Ss.....Ss.......", "....Ss.....Ss.......", "....SSs....SSs......", "....sss....sss......"],
   ["......Ss.Ss.........", "......Ss.Ss.........", "......Ss.Ss.........", "......ss.ss.........", "......Ss.Ss.........", ".....Ss..Ss.........", ".....SSs.SSs........", ".....sss.sss........"],
].map((legs) => [...DROID_HEAD, ...legs]);
const CHUNKS = [["SSSs", "SkkS", ".ss."], ["sS", "sS", ".S"], ["Ss", "Ss", "ss"], ["SSs", "sss"], ["ss", "sS", "ss"]];
const GUN = [".sssss..", "sSSssssV", ".skss...", "..s....."];

export const SPRITES = { TROOPER, DROID, CHUNKS };

export function drawSprite(g: CanvasRenderingContext2D, frame: string[], x: number, y: number, dir = 1, flash = false, blink = false) {
   const left = Math.round(x) - 20, bottom = Math.round(y);
   frame.forEach((row, r) => [...row].forEach((ink, c) => {
      if (!PALETTE[ink]) return;
      g.fillStyle = flash ? C.blue : ink === "V" && blink ? PALETTE.v : PALETTE[ink];
      g.fillRect(left + (dir > 0 ? c : 19 - c) * SCALE, bottom - frame.length * SCALE + r * SCALE, SCALE, SCALE);
   }));
}

export type Pose = Exclude<keyof typeof TROOPER, "walk"> | `walk${number}`;
export const poseFrame = (p: Pose) => p.startsWith("walk") ? TROOPER.walk[+p.slice(4)] : TROOPER[p as Exclude<Pose, `walk${number}`>];

type Opts = { overlay: HTMLCanvasElement; tick: number; bg: string; paint: string; platforms: () => Element[] };
type Platform = { x1: number; x2: number; y: number };
type Droid = { x: number; y: number; dir: number; speed: number; phase: number; wait: number; hit: number; alive: boolean };

export function startAscii(canvas: HTMLCanvasElement, opts: Opts) {
   const ctx = canvas.getContext("2d")!;
   const top = opts.overlay.getContext("2d")!;
   let w = 0, h = 0, cols = 0, rows = 0, charW = 10;
   let grid: string[][] = [];
   const pointer = { x: -1000, y: -1000 };
   window.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
   });
   document.addEventListener("pointerleave", () => { pointer.x = -1000; });
   const fx = new Map<number, Fx>(); // screen cell -> effect glyph burning down over the letters
   const embers: { x: number; y: number; vx: number; vy: number; time: number }[] = [];

   const rand = () => LETTERS[Math.floor(Math.random() * LETTERS.length)];

   function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = window.devicePixelRatio || 1;
      for (const [cv, cx] of [[canvas, ctx], [opts.overlay, top]] as const) {
         cv.width = w * dpr;
         cv.height = h * dpr;
         cv.style.width = `${w}px`;
         cv.style.height = `${h}px`;
         cx.setTransform(dpr, 0, 0, dpr, 0, 0);
         cx.imageSmoothingEnabled = false;
      }
      guy.on = -1;
      guy.jump = null;
      guy.shots = 0;
      guy.salute = 0;
      guy.recoil = 0;
      guy.fireIn = 0.8;
      fx.clear();
      embers.length = 0;
      bolts.length = 0;
      sparks.length = 0;
      debris.length = 0;
      chatter.length = 0;
      droids.forEach((d, i) => { d.alive = false; d.hit = 0; d.wait = 0.8 + i * 1.9; });
      ctx.font = FONT;
      charW = ctx.measureText("M").width;
      cols = Math.ceil(w / charW);
      rows = Math.ceil(h / LINE_HEIGHT);
      grid = Array.from({ length: rows }, () => Array.from({ length: cols }, rand));
   }

   // tops of the given elements, plus the bottom of the screen
   function platforms(): Platform[] {
      const origin = canvas.getBoundingClientRect();
      const tops = opts.platforms().filter((el) => el.getClientRects().length).map((el) => {
         const r = el.getBoundingClientRect();
         // stand on the tops of the letters (cap height is ~0.73em), not the line box
         const capTop = (r.height - 0.73 * parseFloat(getComputedStyle(el).fontSize)) / 2;
         return { x1: r.left - origin.left + 4, x2: r.right - origin.left - 4, y: r.top - origin.top + capTop };
      });
      return [...tops, { x1: 28, x2: w - 28, y: h - 6 }];
   }

   // the walker: stands on a platform, walks to a spot, and sometimes jumps to another platform
   const bolts: { x: number; y: number; vx: number; vy: number }[] = [];
   const sparks: { x: number; y: number; time: number }[] = [];
   const droids: Droid[] = Array.from({ length: 3 }, (_, i) => ({ x: 0, y: 0, dir: i % 2 ? -1 : 1, speed: 0, phase: 0, wait: 0, hit: 0, alive: false }));
   const debris: { x: number; y: number; vx: number; vy: number; sprite: string[]; time: number }[] = [];
   const chatter: { x: number; y: number; time: number }[] = [];
   const guy = { x: 60, y: 0, dir: 1, on: -1, target: 0, phase: 0, shots: 0, aim: 0, fireIn: 0.8, slope: 0, idle: 0.7, salute: 0, cooldown: 0, land: 0, recoil: 0, moving: false, jump: null as null | { x0: number; y0: number; vx: number; vy: number; t: number; T: number; to: number } };

   function plan(ps: Platform[]) {
      const here = ps[guy.on];
      const roll = Math.random();
      if (roll < 0.35) {
         if (Math.random() < 0.5) guy.dir *= -1;
         guy.idle = 1.2 + Math.random() * 1.8;
         return;
      }
      if (roll < 0.78 || ps.length < 2) {
         guy.target = here.x1 + Math.random() * (here.x2 - here.x1);
         return;
      }
      // jump to a random spot on another platform (the floor is the last one; go there less)
      const near = (p: Platform) => Math.max(p.x1 - guy.x, guy.x - p.x2, 0) < 250;
      const options = ps.map((_, i) => i).filter((i) => i !== guy.on && near(ps[i]) && (i < ps.length - 1 || Math.random() < 0.3));
      if (!options.length) { guy.idle = 1; return; }
      const to = options[Math.floor(Math.random() * options.length)];
      const p = ps[to];
      const landX = Math.min(p.x2, Math.max(p.x1, guy.x + (Math.random() - 0.5) * 300));
      // arc peaks a little above the higher of the two spots, without his head leaving the screen
      const high = Math.min(guy.y, p.y);
      const vy = -Math.sqrt(2 * GRAVITY * (guy.y - high + Math.max(1, Math.min(30, high - SPRITE_H - 4))));
      const T = (-vy + Math.sqrt(vy * vy + 2 * GRAVITY * (p.y - guy.y))) / GRAVITY;
      guy.jump = { x0: guy.x, y0: guy.y, vx: (landX - guy.x) / T, vy, t: 0, T, to };
      guy.dir = landX >= guy.x ? 1 : -1;
   }

   // stamp an effect into a cell, unless a brighter one is still burning there
   function stamp(c: number, r: number, now: number, kind: Kind, seq = FX[kind].seq) {
      if (c < 0 || c >= cols || r < 0 || r >= rows) return;
      const key = r * cols + c, old = fx.get(key);
      if (old && now >= old.time && FX[old.kind].a * (1 - (now - old.time) / FX[old.kind].life) > FX[kind].a) return;
      fx.set(key, { kind, seq, time: now });
   }

   const cell = (x: number, y: number) => [Math.floor(x / charW), Math.floor(y / LINE_HEIGHT)];

   function burst(x: number, y: number, now: number, size: number) {
      const [c, r] = cell(x, y);
      for (const b of burstCells(size)) stamp(c + b.dc, r + b.dr, now + b.delay, b.kind);
   }

   function splash(x: number, y: number, now: number) {
      burst(x, y, now, 2);
      sparks.push({ x, y, time: now });
   }

   function dismantle(d: Droid, now: number) {
      d.alive = false;
      d.wait = 3 + Math.random() * 3;
      burst(d.x, d.y - 22, now, 4);
      sparks.push({ x: d.x, y: d.y - 22, time: now });
      for (let i = 0; i < 12; i++) {
         const a = -Math.PI * Math.random(), v = 60 + Math.random() * 160;
         embers.push({ x: d.x, y: d.y - 22, vx: Math.cos(a) * v, vy: Math.sin(a) * v, time: now });
      }
      for (const sprite of CHUNKS) {
         debris.push({ x: d.x + (Math.random() - 0.5) * 14, y: d.y - 8 - Math.random() * 30, vx: (Math.random() - 0.5) * 100, vy: -35 - Math.random() * 65, sprite, time: now });
      }
      if (Math.random() < 0.35) chatter.push({ x: Math.max(48, Math.min(w - 48, d.x)), y: d.y - 48, time: now });
   }

   function stepDroids(dt: number, now: number) {
      for (const d of droids) {
         if (!d.alive) {
            d.wait -= dt;
            if (d.wait > 0) continue;
            d.x = d.dir > 0 ? -18 : w + 18;
            d.y = h - 6;
            d.speed = 21 + Math.random() * 9;
            d.phase = 0;
            d.hit = 0;
            d.alive = true;
         }
         if (d.hit > 0) {
            d.hit -= dt;
            if (d.hit <= 0) dismantle(d, now);
            continue;
         }
         d.x += d.dir * d.speed * dt;
         d.phase += dt * 5;
         if (d.x > w + 24 || d.x < -24) { d.dir *= -1; d.alive = false; d.wait = 3; }
      }
      for (let i = debris.length - 1; i >= 0; i--) {
         const p = debris[i];
         p.x += p.vx * dt;
         p.y += p.vy * dt;
         p.vy += 75 * dt;
         if (p.y > h - 8) { p.y = h - 8; p.vy *= -0.3; p.vx *= 0.8; }
         if (now - p.time > 1200) debris.splice(i, 1);
      }
      // embers fall through the grid as glyphs and settle as dim dots
      for (let i = embers.length - 1; i >= 0; i--) {
         const e = embers[i];
         e.x += e.vx * dt;
         e.y += e.vy * dt;
         e.vy += 420 * dt;
         e.vx *= 1 - dt;
         const [c, r] = cell(e.x, e.y);
         if (e.y > h - 10 || now - e.time > 1400) {
            stamp(c, r, now, "ash");
            embers.splice(i, 1);
         } else stamp(c, r, now, i ? "ember" : "spark");
      }
      for (let i = chatter.length - 1; i >= 0; i--) {
         if (now - chatter[i].time > 1400) chatter.splice(i, 1);
      }
   }

   function nearestDroid() {
      return droids.filter((d) => d.alive && !d.hit && d.x > 42 && d.x < w - 42)
         .sort((a, b) => Math.hypot(a.x - guy.x, a.y - guy.y) - Math.hypot(b.x - guy.x, b.y - guy.y))[0];
   }

   function aimAt(d: Droid) {
      guy.dir = d.x >= guy.x ? 1 : -1;
      const x = d.x - (guy.x + guy.dir * 8), y = d.y - 22 - (guy.y - 20);
      const vx = d.dir * d.speed, a = BOLT_SPEED ** 2 - vx ** 2;
      const t = (x * vx + Math.sqrt((x * vx) ** 2 + a * (x * x + y * y))) / a;
      return Math.atan2(y, x + vx * t);
   }

   function step(dt: number, now: number) {
      stepDroids(dt, now);
      guy.moving = false;
      guy.land = Math.max(0, guy.land - dt);
      guy.recoil = Math.max(0, guy.recoil - dt);
      guy.cooldown = Math.max(0, guy.cooldown - dt);
      guy.fireIn = Math.max(0, guy.fireIn - dt);
      for (let i = bolts.length - 1; i >= 0; i--) {
         const b = bolts[i], x = b.x, y = b.y;
         b.x += b.vx * dt;
         b.y += b.vy * dt;
         const hit = droids.find((d) => {
            if (!d.alive || d.hit) return false;
            const dx = (b.x - x) / 12, dy = (b.y - y) / 17;
            const px = (d.x - x) / 12, py = (d.y - 22 - y) / 17;
            const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy || 1)));
            return Math.hypot(px - dx * t, py - dy * t) < 1;
         });
         if (hit) {
            b.x = hit.x;
            b.y = hit.y - 22;
            hit.hit = 0.2;
            splash(b.x, b.y, now);
         }
         // the streak rewrites its row; the rows beside it glow blue, with the odd glint
         const { seq, head, side } = streak(b.vx, b.vy);
         const steps = Math.max(1, Math.ceil(Math.hypot(b.x - x, b.y - y) / (charW / 2)));
         for (let j = 0; j <= steps; j++) {
            const [c, r] = cell(x + (b.x - x) * j / steps, y + (b.y - y) * j / steps);
            stamp(c, r, now, "trail", seq);
            for (const [dc, dr] of side) stamp(c + dc, r + dr, now, Math.random() < 0.12 ? "glint" : "glow");
         }
         const [hc, hr] = cell(b.x, b.y);
         stamp(hc, hr, now, "head", head);
         if (hit) bolts.splice(i, 1);
         else if (b.x < 0 || b.x > w || b.y < 0 || b.y > h) {
            splash(Math.max(0, Math.min(w - 1, b.x)), Math.max(0, Math.min(h - 1, b.y)), now);
            bolts.splice(i, 1);
         }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
         if (now - sparks[i].time > 240) sparks.splice(i, 1);
      }

      const ps = platforms();
      if (guy.on < 0 || guy.on >= ps.length) {
         // start out standing on the first platform (the name)
         guy.on = 0;
         guy.x = ps[0].x1 + 20;
         guy.y = ps[0].y;
         guy.target = guy.x;
      }
      if (guy.jump) {
         const j = guy.jump;
         j.t = Math.min(j.T, j.t + dt);
         guy.x = j.x0 + j.vx * j.t;
         guy.y = j.y0 + j.vy * j.t + 0.5 * GRAVITY * j.t * j.t;
         if (j.t >= j.T) {
            guy.on = j.to;
            guy.jump = null;
            guy.target = guy.x;
            guy.land = 0.3;
            guy.idle = 0.55;
         }
         return;
      }
      const p = ps[guy.on];
      guy.y = p.y; // follow the platform if the layout moves
      guy.x = Math.min(p.x2, Math.max(p.x1, guy.x));
      guy.target = Math.min(p.x2, Math.max(p.x1, guy.target));
      if (!guy.cooldown && !guy.shots && Math.hypot(pointer.x - guy.x, pointer.y - (guy.y - 18)) < 80) {
         guy.dir = pointer.x >= guy.x ? 1 : -1;
         guy.salute = 1.3;
         guy.cooldown = 7;
         guy.idle = 0.5;
      }
      if (guy.salute > 0) {
         guy.salute = Math.max(0, guy.salute - dt);
         return;
      }
      if (!guy.fireIn && !guy.shots && !guy.land) {
         const target = nearestDroid();
         guy.dir = guy.x < w * 0.25 ? 1 : guy.x > w * 0.75 ? -1 : guy.dir;
         guy.shots = target ? 3 : 2;
         guy.aim = 0.25;
         guy.slope = target ? aimAt(target) : Math.atan2(Math.random() < 0.4 ? (guy.y < h * 0.35 ? 0.3 : -0.3) : 0, guy.dir);
      }
      if (guy.shots > 0) {
         const target = nearestDroid();
         if (target) guy.slope = aimAt(target);
         guy.aim -= dt;
         if (guy.aim <= 0) {
            const mx = guy.x + guy.dir * 6 + Math.cos(guy.slope) * 16, my = guy.y - 20 + Math.sin(guy.slope) * 16;
            bolts.push({ x: mx, y: my, vx: Math.cos(guy.slope) * BOLT_SPEED, vy: Math.sin(guy.slope) * BOLT_SPEED });
            const [c, r] = cell(mx, my);
            stamp(c, r, now, "muzzle");
            for (const [dc, dr, g] of [[guy.dir, 0, "=·"], [0, -1, "'·"], [0, 1, ".·"]] as const) stamp(c + dc, r + dr, now, "muzzle", g);
            guy.recoil = 0.1;
            guy.shots--;
            guy.aim = 0.17;
            if (!guy.shots) guy.fireIn = target ? 1.3 + Math.random() * 1.2 : 2.4 + Math.random() * 1.8;
         }
         return;
      }
      if (guy.idle > 0) {
         guy.idle -= dt;
         return;
      }
      const d = guy.target - guy.x;
      if (Math.abs(d) < 1) {
         plan(ps);
         return;
      }
      guy.dir = Math.sign(d);
      guy.x += guy.dir * Math.min(Math.abs(d), WALK * dt);
      guy.x = Math.min(p.x2, Math.max(p.x1, guy.x));
      guy.moving = true;
      guy.phase += dt * 9;
      // footprint in the letter just under his feet
      const [c, r] = cell(guy.x, guy.y + 4);
      stamp(c, r, now, "step");
   }

   function pixel(x: number, y: number, color: string, size = 2) {
      top.fillStyle = color;
      top.fillRect(Math.round(x), Math.round(y), size, size);
   }

   function drawGuy(now: number) {
      top.clearRect(0, 0, w, h);
      for (const d of droids) {
         if (!d.alive) continue;
         drawSprite(top, DROID[Math.floor(d.phase) % 4], d.x + (d.hit ? Math.round(Math.sin(now / 18)) * 2 : 0), d.y, d.dir, d.hit > 0.12);
      }
      const firing = guy.shots > 0 || guy.recoil > 0;
      const pose: Pose = guy.jump ? (guy.jump.vy + GRAVITY * guy.jump.t < -90 ? "rise" : "jump") : guy.land > 0 ? "land" : guy.salute > 0 ? "salute" : firing ? "shoot" : guy.moving ? `walk${Math.floor(guy.phase) % 4}` : "idle";
      top.globalAlpha = 1;
      const x = Math.round(guy.x) - (guy.recoil > 0 ? guy.dir * 2 : 0);
      drawSprite(top, poseFrame(pose), x, guy.y, guy.dir, false, now % 4300 < 140);
      if (firing && !guy.jump && !guy.land && !guy.salute) {
         // Rasterize the tilted DC-17 onto the same grid, never rotate the canvas.
         const angle = guy.dir > 0 ? guy.slope : Math.PI - guy.slope;
         const cos = Math.cos(angle), sin = Math.sin(angle);
         GUN.forEach((row, r) => [...row].forEach((ink, c) => {
            if (!PALETTE[ink]) return;
            pixel(x + guy.dir * (8 + Math.round((c * cos - (r - 1) * sin)) * 2), guy.y - 20 + Math.round(c * sin + (r - 1) * cos) * 2, PALETTE[ink]);
         }));
         if (guy.recoil > 0.055) {
            const mx = x + guy.dir * (8 + Math.round(8 * cos) * 2), my = guy.y - 20 + Math.round(8 * sin) * 2;
            pixel(mx - 2, my - 2, C.blue, 6);
            pixel(mx, my, PALETTE.C);
         }
      }
      top.globalAlpha = 1;
      for (const b of bolts) {
         const dx = b.vx / BOLT_SPEED, dy = b.vy / BOLT_SPEED;
         for (let i = 0; i < 4; i++) pixel(b.x - dx * i * 2, b.y - dy * i * 2, i < 2 ? C.white : C.ice);
      }
      for (const s of sparks) {
         const age = (now - s.time) / 240;
         top.globalAlpha = 1 - age;
         for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3, radius = 3 + age * 14;
            pixel(s.x + Math.cos(angle) * radius, s.y + Math.sin(angle) * radius, i % 2 ? C.blue : PALETTE.C);
         }
      }
      for (const p of debris) {
         top.globalAlpha = Math.min(1, (1200 - now + p.time) / 500);
         drawSprite(top, p.sprite, p.x + 20, p.y);
      }
      top.fillStyle = C.blue;
      top.textAlign = "center";
      top.font = `300 9px "Monaspace Krypton", ui-monospace, monospace`;
      for (const c of chatter) {
         const age = (now - c.time) / 1400;
         top.globalAlpha = 0.55 * Math.sin(age * Math.PI);
         top.fillText("roger roger", c.x, c.y - age * 12);
      }
      top.globalAlpha = 1;
      top.textAlign = "start";
   }

   function draw(now: number) {
      ctx.clearRect(0, 0, w, h);
      ctx.font = FONT;
      // one fillText per row is much faster than per cell
      ctx.fillStyle = opts.paint;
      grid.forEach((row, r) => ctx.fillText(row.join(""), 0, (r + 0.8) * LINE_HEIGHT));

      for (const [i, e] of fx) {
         const t = (now - e.time) / FX[e.kind].life;
         if (t < 0) continue; // a shockwave ring that hasn't arrived yet
         if (t >= 1) {
            fx.delete(i);
            continue;
         }
         const r = Math.floor(i / cols), c = i % cols;
         // a little flicker keeps it alive
         paintCell(ctx, c * charW, r * LINE_HEIGHT, charW, opts.bg, grid[r]?.[c] ?? "", e.kind, Math.min(0.99, t + (Math.random() < 0.04 ? 0.15 : 0)), e.seq);
      }
      ctx.globalAlpha = 1;
      drawGuy(now);
   }

   let prevTick = 0, prevFrame = 0;
   function loop(t: number) {
      requestAnimationFrame(loop);
      if (t - prevTick >= opts.tick) {
         prevTick = t;
         grid.push(grid.shift()!);
      }
      step(Math.min(0.05, (t - (prevFrame || t)) / 1000), t);
      prevFrame = t;
      draw(t);
   }

   new ResizeObserver(resize).observe(canvas.parentElement!);
   document.fonts.ready.then(resize);
   resize();
   requestAnimationFrame(loop);
}
