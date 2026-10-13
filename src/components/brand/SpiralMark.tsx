// The Ontographica spiral, shared by the company mark and both product marks.
export const SPIRAL_PATH =
  "M 0 -1000 A 1000 1000 0 0 1 0 1000 A 786 786 0 0 1 0 -572 A 571 571 0 0 1 0 571 A 357 357 0 0 1 0 -143";

type SpiralMarkProps = {
  className?: string;
  color?: string;
  rounded?: boolean;
};

export function SpiralMark({ className, color = "currentColor", rounded = true }: SpiralMarkProps) {
  return (
    <svg className={className} viewBox="-1062.5 -1062.5 2125 2125" aria-hidden="true" focusable="false">
      <path
        d={SPIRAL_PATH}
        fill="none"
        stroke={color}
        strokeWidth={125}
        strokeLinecap={rounded ? "round" : "butt"}
      />
    </svg>
  );
}
