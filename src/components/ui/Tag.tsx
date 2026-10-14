import type { CSSProperties, ReactNode } from "react";

type TagProps = { children: ReactNode; tone?: "accent" | "muted" | "candidate" | "brand"; className?: string; style?: CSSProperties };

const tones = { accent: "text-accent-soft", muted: "text-fg-muted", candidate: "text-candidate-soft", brand: "text-brand-soft" };

/** Mono section tag, e.g. "/ OntoCampus". */
export function Tag({ children, tone = "accent", className = "", style }: TagProps) {
  return (
    <p className={`tag ${tones[tone]} ${className}`} style={style}>
      <span aria-hidden="true" className="mr-2 opacity-60">
        /
      </span>
      {children}
    </p>
  );
}
