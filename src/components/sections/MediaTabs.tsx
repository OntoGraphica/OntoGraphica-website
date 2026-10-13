import type { Screen } from "../../content/campus";
import { useTabs } from "../../lib/useTabs";
import { Screenshot, ScreenFrame } from "../media/Screenshot";

type MediaTabsProps = { id: string; label: string; screens: Screen[]; orientation?: "horizontal" | "vertical" };

/**
 * A switcher over real product screens with a one-line caption per screen. Horizontal is a centred
 * segmented control above the screen; vertical lists the tabs (with their captions) beside it on
 * large screens and falls back to the segmented control on small ones.
 */
export function MediaTabs({ id, label, screens, orientation = "horizontal" }: MediaTabsProps) {
  const { active, tabProps, panelProps } = useTabs(id, screens.length);
  const current = screens[active];
  const vertical = orientation === "vertical";

  const tabs = (
    <div className={`-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 ${vertical ? "lg:overflow-visible" : ""}`}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={vertical ? "vertical" : "horizontal"}
        className={`panel flex w-max gap-1 rounded-[14px] p-1 ${vertical ? "lg:w-full lg:flex-col lg:gap-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none" : "mx-auto"}`}
      >
        {screens.map((screen, index) => {
          const selected = index === active;
          return (
            <button
              key={screen.id}
              {...tabProps(index)}
              className={`rounded-control px-4 py-2 text-left text-[0.9rem] whitespace-nowrap transition-colors duration-300 ${
                selected ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
              } ${
                vertical
                  ? `lg:rounded-none lg:border-l-2 lg:bg-transparent lg:px-6 lg:py-5 lg:whitespace-normal ${
                      selected ? "lg:border-accent-bright lg:text-fg" : "lg:border-line"
                    }`
                  : ""
              }`}
            >
              <span className={vertical ? "lg:text-[1.15rem] lg:font-medium lg:tracking-[-0.015em]" : ""}>{screen.tab}</span>
              {vertical && <span className={`mt-1.5 hidden text-[0.95rem] lg:block ${selected ? "text-fg-soft" : "text-fg-muted"}`}>{screen.line}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const screen = (
    <ScreenFrame>
      <div className="relative aspect-[16/10]">
        {screens.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-quint)] motion-reduce:transition-none ${
              index === active ? "scale-100 opacity-100" : "scale-[1.02] opacity-0"
            }`}
          >
            <Screenshot image={item.image} alt={item.alt} hidden={index !== active} sizes={vertical ? "(min-width: 1024px) 760px, 94vw" : undefined} />
          </div>
        ))}
      </div>
    </ScreenFrame>
  );

  const caption = (
    <p key={current.id} className={`rise mx-auto mt-8 max-w-[52ch] text-center text-lead text-fg-soft ${vertical ? "lg:hidden" : ""}`} aria-live="polite">
      {current.line}
    </p>
  );

  if (vertical) {
    return (
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="min-w-0 lg:col-span-4">{tabs}</div>
        <div {...panelProps} className="min-w-0 lg:col-span-8">
          {screen}
          {caption}
        </div>
      </div>
    );
  }

  return (
    <div>
      {tabs}
      <div {...panelProps} className="mt-10 lg:mt-14">
        {screen}
        {caption}
      </div>
    </div>
  );
}
