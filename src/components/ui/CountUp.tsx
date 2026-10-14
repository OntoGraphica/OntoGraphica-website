import { useEffect, useRef } from "react";

type CountUpProps = { value: number; suffix?: string; duration?: number; className?: string };

/**
 * Counts up to `value` once in view. Writes to the DOM node directly (no React state per frame);
 * shows the final value immediately for reduced-motion users and as the server/no-JS text.
 */
export function CountUp({ value, suffix = "", duration = 1400, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    node.textContent = `0${suffix}`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          node.textContent = `${Math.round(value * eased)}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = `${value}${suffix}`;
    };
  }, [value, suffix, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      <span ref={ref} aria-hidden="true">
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
