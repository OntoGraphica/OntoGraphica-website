import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../../lib/useInView";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
};

/** Fades content up once it scrolls into view. Static for reduced-motion users (see index.css). */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
