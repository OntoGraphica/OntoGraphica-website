import { useRef, useState, type KeyboardEvent } from "react";

/**
 * WAI-ARIA tabs behaviour: roving tabindex, arrow keys (both axes), Home and End.
 * Returns props to spread on each tab and on the panel.
 */
export function useTabs(idBase: string, count: number) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focus = (index: number) => {
    const next = (index + count) % count;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: count - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      focus(keys[event.key]);
    }
  };

  const tabId = (index: number) => `${idBase}-tab-${index}`;
  const panelId = `${idBase}-panel`;

  const tabProps = (index: number) => ({
    id: tabId(index),
    ref: (node: HTMLButtonElement | null) => {
      refs.current[index] = node;
    },
    type: "button" as const,
    role: "tab" as const,
    "aria-selected": index === active,
    "aria-controls": panelId,
    tabIndex: index === active ? 0 : -1,
    onClick: () => setActive(index),
    onKeyDown,
  });

  const panelProps = { id: panelId, role: "tabpanel" as const, "aria-labelledby": tabId(active) };

  return { active, setActive, tabProps, panelProps };
}
