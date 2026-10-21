import type { ReactNode } from "react";

type ScreenshotProps = {
  image: string; // e.g. "dark/student-plan"
  alt: string;
  sizes?: string;
  eager?: boolean;
  className?: string;
  hidden?: boolean;
  /** Height as a share of width, for crops that are not 16:10. */
  ratio?: number;
};

const src = (image: string, width: number) => `/media/${image}-${width}.webp`;

/** A responsive product screen (16:10 unless `ratio` says otherwise), served as WebP at 960px and 1600px. */
export function Screenshot({ image, alt, sizes = "(min-width: 1200px) 1100px, 94vw", eager = false, className = "", hidden = false, ratio = 0.625 }: ScreenshotProps) {
  return (
    <img
      src={src(image, 1600)}
      srcSet={`${src(image, 960)} 960w, ${src(image, 1600)} 1600w`}
      sizes={sizes}
      width={1600}
      height={Math.round(1600 * ratio)}
      alt={hidden ? "" : alt}
      aria-hidden={hidden || undefined}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  );
}

/** Frame for real product screens: hairline edge on a tinted blue glow. */
export function ScreenFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`screen-glow relative overflow-hidden rounded-card bg-[#0b0e14] ${className}`}>{children}</div>;
}
