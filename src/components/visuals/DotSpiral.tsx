import { useEffect, useRef } from "react";

/**
 * The Ontographica spiral as a halftone dot field.
 * - Dots draw the spiral in along its path on load.
 * - Coloured pulses travel along the spiral (e.g. OntoCampus blue and OntoCandidate yellow
 *   flowing through the Ontographica red mark).
 * - The field brightens under the cursor.
 * Pauses off-screen and in hidden tabs; reduced-motion users get one still frame.
 */

export type SpiralPalette = {
  /** Colour of the spiral's own dots. */
  stroke: string;
  /** Colours of the pulses travelling along the spiral, evenly spaced. */
  pulses: string[];
  /** Colour of the cursor glow. */
  cursor: string;
};

export const defaultPalette: SpiralPalette = { stroke: "#eef1f6", pulses: ["#5b8bff"], cursor: "#5b8bff" };

type Arc = { cx: number; cy: number; r: number; side: 1 | -1; start: number; length: number };

// The four semicircles of the official mark (viewBox units, stroke width 125).
const ARCS: Arc[] = (() => {
  const raw = [
    { cx: 0, cy: 0, r: 1000, side: 1 as const },
    { cx: 0, cy: 214, r: 786, side: -1 as const },
    { cx: 0, cy: -0.5, r: 571.5, side: 1 as const },
    { cx: 0, cy: 214, r: 357, side: -1 as const },
  ];
  const total = raw.reduce((sum, arc) => sum + Math.PI * arc.r, 0);
  let acc = 0;
  return raw.map((arc) => {
    const length = (Math.PI * arc.r) / total;
    const out = { ...arc, start: acc, length };
    acc += length;
    return out;
  });
})();

const HALF_STROKE = 62.5;

/** Distance (logo units) from a point to the spiral, and how far along the spiral (0..1) it sits. */
function sample(x: number, y: number) {
  let best = Infinity;
  let along = 0;
  for (const arc of ARCS) {
    const dx = x - arc.cx;
    const dy = y - arc.cy;
    let dist: number;
    let local: number;
    if (dx * arc.side >= 0) {
      dist = Math.abs(Math.hypot(dx, dy) - arc.r);
      const angle = Math.atan2(dy, dx * arc.side);
      local = arc.side === 1 ? (angle + Math.PI / 2) / Math.PI : (Math.PI / 2 - angle) / Math.PI;
    } else {
      const startY = arc.side === 1 ? arc.cy - arc.r : arc.cy + arc.r;
      const endY = arc.side === 1 ? arc.cy + arc.r : arc.cy - arc.r;
      const toStart = Math.hypot(dx, y - startY);
      const toEnd = Math.hypot(dx, y - endY);
      dist = Math.min(toStart, toEnd);
      local = toStart < toEnd ? 0 : 1;
    }
    if (dist < best) {
      best = dist;
      along = arc.start + Math.min(1, Math.max(0, local)) * arc.length;
    }
  }
  return { dist: best, along };
}

type DotSpiralProps = {
  className?: string;
  /** Horizontal centre of the spiral as a fraction of the canvas width (desktop). */
  anchor?: number;
  /** Vertical centre as a fraction of the canvas height (desktop). */
  anchorY?: number;
  /** Spiral diameter as a fraction of the canvas height. */
  size?: number;
  /** Maximum diameter as a fraction of the canvas width (desktop). */
  maxWidth?: number;
  palette?: SpiralPalette;
};

export function DotSpiral({ className = "", anchor = 0.7, anchorY = 0.54, size = 0.82, maxWidth = 0.56, palette = defaultPalette }: DotSpiralProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paletteKey = JSON.stringify(palette);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors: SpiralPalette = JSON.parse(paletteKey);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let spacing = 9;
    let cols = 0;
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let strokeIdx = new Uint32Array(0); // indices of dots on the spiral
    let stroke = new Float32Array(0);
    let along = new Float32Array(0);
    let frame = 0;
    let running = false;
    let visible = true;
    const start = performance.now();
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const narrow = width < 768;
      spacing = narrow ? 7 : 9;
      const diameter = Math.min(height * size, narrow ? width * 0.9 : width * maxWidth);
      const scale = diameter / 2125;
      const cx = narrow ? width * 0.5 : width * anchor;
      const cy = height * (narrow ? 0.3 : anchorY);

      cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      const count = cols * rows;
      xs = new Float32Array(count);
      ys = new Float32Array(count);
      stroke = new Float32Array(count);
      along = new Float32Array(count);
      const onStroke: number[] = [];
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing + spacing / 2;
          const y = r * spacing + spacing / 2;
          xs[i] = x;
          ys[i] = y;
          const s = sample((x - cx) / scale, (y - cy) / scale);
          const inner = HALF_STROKE * 0.55;
          const outer = HALF_STROKE * 1.35;
          const value = s.dist <= inner ? 1 : s.dist >= outer ? 0 : 1 - (s.dist - inner) / (outer - inner);
          stroke[i] = value;
          along[i] = s.along;
          if (value > 0) onStroke.push(i);
          i++;
        }
      }
      strokeIdx = Uint32Array.from(onStroke);
    };

    const dot = (x: number, y: number, size: number) => ctx.fillRect(x - size / 2, y - size / 2, size, size);

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const reveal = reduce ? 1.2 : Math.min(1.2, t / 2.4);
      const base = (t * 0.085) % 1;
      ctx.clearRect(0, 0, width, height);
      const dotBase = spacing * 0.2;

      // 1. Ambient field: faint, slowly drifting clusters.
      ctx.fillStyle = "#eef1f6";
      for (let i = 0; i < xs.length; i++) {
        if (stroke[i] > 0.5) continue;
        const x = xs[i];
        const y = ys[i];
        const n = Math.sin(x * 0.011 + t * 0.35) * Math.cos(y * 0.013 - t * 0.27) + Math.sin((x + y) * 0.006 + t * 0.2);
        const alpha = 0.03 + Math.max(0, n) * 0.045;
        if (alpha < 0.035) continue;
        ctx.globalAlpha = alpha;
        dot(x, y, dotBase);
      }

      // 2. The spiral itself.
      const pulseCount = reduce ? 0 : colors.pulses.length;
      const pulseAt = (i: number, k: number) => {
        const phase = (base + k / Math.max(1, pulseCount)) % 1;
        const gap = Math.abs(along[i] - phase);
        const d = Math.min(gap, 1 - gap);
        return Math.exp(-(d * d) / 0.0028);
      };
      ctx.fillStyle = colors.stroke;
      for (const i of strokeIdx) {
        const drawn = Math.max(0, Math.min(1, (reveal - along[i]) / 0.06));
        if (!drawn) continue;
        let pulse = 0;
        for (let k = 0; k < pulseCount; k++) pulse = Math.max(pulse, pulseAt(i, k));
        ctx.globalAlpha = stroke[i] * drawn * 0.9 * (1 - pulse * 0.75);
        dot(xs[i], ys[i], dotBase + stroke[i] * spacing * 0.16);
      }

      // 3. Pulses travelling along the spiral.
      for (let k = 0; k < pulseCount; k++) {
        ctx.fillStyle = colors.pulses[k];
        for (const i of strokeIdx) {
          const drawn = Math.max(0, Math.min(1, (reveal - along[i]) / 0.06));
          const alpha = stroke[i] * drawn * pulseAt(i, k) * 1.15;
          if (alpha < 0.03) continue;
          ctx.globalAlpha = Math.min(1, alpha);
          dot(xs[i], ys[i], dotBase + spacing * (0.2 + stroke[i] * 0.12));
        }
      }

      // 4. Cursor glow (only the dots near the pointer).
      if (pointer.active) {
        ctx.fillStyle = colors.cursor;
        const radius = 160;
        const c0 = Math.max(0, Math.floor((pointer.x - radius) / spacing));
        const c1 = Math.min(cols - 1, Math.ceil((pointer.x + radius) / spacing));
        const r0 = Math.max(0, Math.floor((pointer.y - radius) / spacing));
        const r1 = Math.ceil((pointer.y + radius) / spacing);
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            const i = r * cols + c;
            if (i >= xs.length) continue;
            const d = Math.hypot(xs[i] - pointer.x, ys[i] - pointer.y);
            if (d >= radius) continue;
            const glow = (1 - d / radius) ** 2;
            ctx.globalAlpha = Math.min(1, glow * (0.4 + stroke[i] * 0.6));
            dot(xs[i], ys[i], dotBase + spacing * (0.1 + glow * 0.22));
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      if (reduce || running || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    build();
    draw(reduce ? start + 10_000 : performance.now());
    play();

    const resize = new ResizeObserver(() => {
      build();
      if (!running) draw(reduce ? start + 10_000 : performance.now());
    });
    resize.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height;
    };
    const onLeave = () => (pointer.active = false);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      pause();
      resize.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [anchor, anchorY, size, maxWidth, paletteKey]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
