import type { CSSProperties } from "react";

type StatusBadgeProps = { tone: "campus" | "candidate"; children: string; className?: string; style?: CSSProperties };

/** Product status chip. The dot carries real state: live (solid) or in development (hollow). */
export function StatusBadge({ tone, children, className = "", style }: StatusBadgeProps) {
  const styles =
    tone === "campus"
      ? "border-accent-bright/40 bg-accent-wash text-accent-soft"
      : "border-dashed border-candidate/50 bg-candidate-wash text-candidate-soft";
  const dot = tone === "campus" ? "bg-accent-soft" : "border border-candidate-soft";
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-chip border px-2.5 py-1.5 font-mono text-[0.7rem] tracking-[0.08em] uppercase ${styles} ${className}`}
      style={style}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </p>
  );
}
