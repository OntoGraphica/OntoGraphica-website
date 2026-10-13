import { useEffect, useRef, useState } from "react";
import { orbit } from "../../content/campus";
import { useInView } from "../../lib/useInView";
import { SpiralMark } from "../brand/SpiralMark";

const SIZE = 560;
const R = 210;
const C = SIZE / 2;
const STEPS = orbit.length;

const nodes = orbit.map((_, i) => {
  const angle = (i / STEPS) * Math.PI * 2 - Math.PI / 2;
  return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle), cos: Math.cos(angle), sin: Math.sin(angle) };
});

/**
 * The rhythm of real work as a loop of seven moves. Advances on its own while visible (paused on
 * hover, focus, or reduced motion); each move can also be chosen directly.
 */
export function Orbit() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!inView || held || reduce.current) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % STEPS), 2600);
    return () => window.clearInterval(timer);
  }, [inView, held]);

  const step = orbit[active];
  const progress = active / STEPS;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {/* Ring: sm and up */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[560px] sm:block">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <circle cx={C} cy={C} r={R + 46} fill="none" stroke="rgb(255 255 255 / 0.04)" />
          <circle cx={C} cy={C} r={R} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth={1.5} />
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="var(--color-accent-bright)"
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - (progress + 1 / STEPS / 2)}
            transform={`rotate(-90 ${C} ${C})`}
            style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)", filter: "drop-shadow(0 0 6px rgb(74 123 247 / 0.8))" }}
          />
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r={i === active ? 8 : 5}
              fill={i <= active ? "var(--color-accent-bright)" : "var(--color-bg)"}
              stroke={i <= active ? "var(--color-accent-bright)" : "rgb(255 255 255 / 0.35)"}
              strokeWidth={1.5}
              style={{ transition: "r 0.4s, fill 0.4s, stroke 0.4s", filter: i === active ? "drop-shadow(0 0 10px rgb(74 123 247 / 0.9))" : undefined }}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-[26%] text-center" aria-live="polite">
          <SpiralMark color="var(--color-accent-bright)" className="h-9 w-9 opacity-80" />
          <p key={step.title} className="rise mt-5 text-[clamp(1.8rem,1.2rem+1.6vw,2.6rem)] leading-none font-medium tracking-[-0.04em] text-fg">
            {step.title}
          </p>
          <p key={`${step.title}-line`} className="rise mt-3 text-[0.98rem] text-fg-soft" style={{ ["--d" as string]: "80ms" }}>
            {step.line}
          </p>
        </div>

        <ul>
          {orbit.map((item, i) => {
            const node = nodes[i];
            const right = node.cos > 0.25;
            const left = node.cos < -0.25;
            return (
              <li
                key={item.title}
                className="absolute"
                style={{
                  left: `${((C + (R + 30) * node.cos) / SIZE) * 100}%`,
                  top: `${((C + (R + 30) * node.sin) / SIZE) * 100}%`,
                  transform: `translate(${right ? "0" : left ? "-100%" : "-50%"}, -50%)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`rounded-chip px-2 py-1 text-[0.9rem] whitespace-nowrap transition-colors duration-300 ${
                    i === active ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <span className="mr-1.5 font-mono text-[0.7rem] text-accent-soft">0{i + 1}</span>
                  {item.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Phones: step pills + caption */}
      <div className="sm:hidden">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {orbit.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`shrink-0 rounded-control border px-3 py-2 text-[0.9rem] transition-colors ${
                i === active ? "border-accent-bright bg-accent-wash text-fg" : "border-line text-fg-muted"
              }`}
            >
              <span className="mr-1.5 font-mono text-[0.7rem] text-accent-soft">0{i + 1}</span>
              {item.title}
            </button>
          ))}
        </div>
        <div className="panel mt-6 rounded-card p-6" aria-live="polite">
          <p className="text-[1.6rem] leading-none font-medium tracking-[-0.03em] text-fg">{step.title}</p>
          <p className="mt-3 text-fg-soft">{step.line}</p>
        </div>
      </div>
    </div>
  );
}
