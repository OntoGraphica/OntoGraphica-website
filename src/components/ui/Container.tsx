import type { ReactNode } from "react";

type ContainerProps = { children: ReactNode; className?: string; wide?: boolean };

/** Content column: 1200px for reading layouts, 1320px (`wide`) for interfaces and media. */
export function Container({ children, className = "", wide = false }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 lg:px-12 ${wide ? "max-w-[1320px]" : "max-w-[1200px]"} ${className}`}>
      {children}
    </div>
  );
}
