import { ArrowLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PauseIcon } from "@phosphor-icons/react/dist/csr/Pause";
import { PlayIcon } from "@phosphor-icons/react/dist/csr/Play";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { professions } from "../../content/campus";
import { SpiralMark } from "../brand/SpiralMark";

const TAU = Math.PI * 2;
const STEP = TAU / professions.length;
const AUTO_SPEED = 0.11; // radians per second

const wrap = (index: number) => ((index % professions.length) + professions.length) % professions.length;

/**
 * Professions on a slowly turning 3D ring. Drag it, step it with the arrows, or pause it. Turning
 * stops while the pointer or keyboard focus is inside, off-screen, and for reduced motion.
 */
export function ProfessionRing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centreRef = useRef<HTMLDivElement>(null);
  const motion = useRef({ angle: 0, velocity: 0, target: null as number | null, dragging: false, held: false, paused: false });
  const kickRef = useRef<() => void>(() => {});
  const [front, setFront] = useState(0);
  const frontRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const geometry = useRef({ radius: 600, lift: 150, centre: 150 });

  const layout = () => {
    const { radius, lift, centre } = geometry.current;
    const { angle } = motion.current;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const a = index * STEP + angle;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      const depth = (cos + 1) / 2; // 1 at the front, 0 at the back
      card.style.transform = `translate(-50%, -50%) translate3d(${(sin * radius).toFixed(1)}px, ${((1 - cos) * -lift).toFixed(1)}px, ${((cos - 1) * radius * 0.6).toFixed(1)}px) rotateY(${(sin * -24).toFixed(2)}deg)`;
      card.style.opacity = (0.32 + 0.68 * depth ** 1.6).toFixed(3);
      card.style.zIndex = String(Math.round(depth * 100));
    });
    if (centreRef.current) centreRef.current.style.transform = `translate(-50%, -50%) translate3d(0, ${-centre}px, ${-radius * 0.6}px)`;
    const next = wrap(Math.round(-angle / STEP));
    if (next !== frontRef.current) {
      frontRef.current = next;
      setFront(next);
    }
  };

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const width = stage.clientWidth;
      // A fixed radius roomy enough for every card; the sides run off-screen on narrow layouts.
      geometry.current = width < 640 ? { radius: 420, lift: 100, centre: 150 } : { radius: 600, lift: 150, centre: 150 };
      layout();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const m = motion.current;
    let frame = 0;
    let last = 0;
    let visible = false;

    const autoTurning = () => visible && !reduced.matches && !m.paused && !m.held && !m.dragging;

    const tick = (now: number) => {
      const dt = last ? Math.min(0.064, (now - last) / 1000) : 0;
      last = now;
      if (m.target !== null) {
        const gap = m.target - m.angle;
        m.angle += gap * Math.min(1, dt * 8);
        if (Math.abs(gap) < 0.0008 || reduced.matches) {
          m.angle = m.target;
          m.target = null;
        }
      } else if (!m.dragging) {
        if (Math.abs(m.velocity) > 0.002) {
          m.angle += m.velocity * dt;
          m.velocity *= Math.pow(0.03, dt);
        } else {
          m.velocity = 0;
        }
        if (autoTurning()) m.angle -= AUTO_SPEED * dt;
      }
      layout();
      if (m.target !== null || m.velocity !== 0 || m.dragging || autoTurning()) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const kick = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    kickRef.current = kick;

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    visibility.observe(stage);

    // Hold the ring still while the pointer or focus is inside the component.
    const hold = (held: boolean) => () => {
      m.held = held || root.contains(document.activeElement);
      kick();
    };
    const enter = hold(true);
    const leave = hold(false);
    const focusIn = () => {
      m.held = true;
    };
    const focusOut = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) {
        m.held = root.matches(":hover");
        kick();
      }
    };
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("focusin", focusIn);
    root.addEventListener("focusout", focusOut);

    // Drag to turn, with a little inertia on release.
    let startX = 0;
    let lastX = 0;
    let lastTime = 0;
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      m.dragging = true;
      m.target = null;
      m.velocity = 0;
      startX = lastX = event.clientX;
      lastTime = event.timeStamp;
      stage.setPointerCapture(event.pointerId);
      kick();
    };
    const move = (event: PointerEvent) => {
      if (!m.dragging) return;
      const delta = (event.clientX - lastX) / geometry.current.radius;
      const dt = Math.max(1, event.timeStamp - lastTime) / 1000;
      m.angle += delta;
      m.velocity = delta / dt;
      lastX = event.clientX;
      lastTime = event.timeStamp;
    };
    const up = (event: PointerEvent) => {
      if (!m.dragging) return;
      m.dragging = false;
      if (Math.abs(event.clientX - startX) < 4) m.velocity = 0;
      if (event.pointerType !== "mouse") m.held = false;
      kick();
    };
    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);

    const motionChange = () => kick();
    reduced.addEventListener("change", motionChange);

    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("focusin", focusIn);
      root.removeEventListener("focusout", focusOut);
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      reduced.removeEventListener("change", motionChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (direction: 1 | -1) => {
    const m = motion.current;
    const from = m.target ?? m.angle;
    const snapped = Math.round(from / STEP) * STEP;
    m.velocity = 0;
    m.target = snapped - direction * STEP;
    const index = wrap(Math.round(-m.target / STEP));
    const item = professions[index];
    setAnnouncement(`${item.name}, ${item.live ? "available now" : "planned"}`);
    kickRef.current();
  };

  const togglePause = () => {
    const next = !paused;
    motion.current.paused = next;
    setPaused(next);
    kickRef.current();
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={stageRef}
        className="relative h-[520px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[600px]"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 40%" }}
        role="list"
        aria-label="OntoCampus professions"
      >
        <div ref={centreRef} aria-hidden="true" className="absolute top-[62%] left-1/2 z-50 h-48 w-48 sm:h-64 sm:w-64">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(74_123_247/0.35),rgb(74_123_247/0))]" />
          <SpiralMark color="#4A7BF7" className="absolute inset-[30%] drop-shadow-[0_0_24px_rgb(74_123_247/0.7)]" />
        </div>
        {professions.map((item, index) => (
            <div
              key={item.name}
              role="listitem"
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="absolute top-[62%] left-1/2 will-change-transform"
            >
              <article
                className={`w-[208px] rounded-card border bg-[#0a0e16]/95 p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] transition-colors duration-500 sm:w-[236px] ${
                  index === front ? "border-accent-bright/45" : "border-line-strong"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[0.6rem] tracking-[0.14em] uppercase">
                  <span className="text-accent-soft">{item.field}</span>
                  {item.live ? (
                    <span className="flex items-center gap-1.5 text-accent-soft">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-soft shadow-[0_0_8px_rgb(143_179_255/0.9)]" />
                      Live
                    </span>
                  ) : (
                    <span className="text-fg-muted">Planned</span>
                  )}
                </div>
                <div
                  aria-hidden="true"
                  className="halftone-box mt-4 h-[78px] rounded-control border border-line sm:h-[88px]"
                  style={
                    {
                      "--hx": `${18 + ((index * 37) % 64)}%`,
                      "--hy": `${30 + ((index * 29) % 44)}%`,
                      "--dot": item.live ? "rgb(110 150 255)" : "rgb(143 179 255 / 0.55)",
                    } as CSSProperties
                  }
                />
                <h3 className="mt-5 text-[1.12rem] leading-tight font-medium tracking-[-0.02em] text-fg sm:text-[1.22rem]">{item.name}</h3>
                <p className="mt-3 border-t border-line pt-3 text-[0.8rem] leading-snug text-fg-soft">{item.line}</p>
              </article>
            </div>
          ))}
      </div>

      <div className="relative z-10 mt-2 flex items-center justify-center gap-3 px-4 sm:gap-5">
        <RingButton label="Previous profession" onClick={() => go(-1)}>
          <ArrowLeftIcon aria-hidden="true" weight="bold" className="h-4 w-4" />
        </RingButton>
        <p className="min-w-0 text-center font-mono text-[0.62rem] tracking-[0.14em] text-fg-muted uppercase sm:text-[0.66rem]">
          Professional paths
        </p>
        <RingButton label={paused ? "Resume turning" : "Pause turning"} onClick={togglePause}>
          {paused ? <PlayIcon aria-hidden="true" weight="fill" className="h-4 w-4" /> : <PauseIcon aria-hidden="true" weight="bold" className="h-4 w-4" />}
        </RingButton>
        <RingButton label="Next profession" onClick={() => go(1)}>
          <ArrowRightIcon aria-hidden="true" weight="bold" className="h-4 w-4" />
        </RingButton>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

function RingButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line-strong text-fg-soft transition-[border-color,color,transform] duration-300 hover:border-fg-muted hover:text-fg active:scale-[0.96] motion-reduce:active:scale-100"
    >
      {children}
    </button>
  );
}
