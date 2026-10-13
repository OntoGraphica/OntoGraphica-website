import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * On a route change: scroll to the URL hash (waiting for lazily loaded pages to render) or to
 * the top, and move focus to <main> so screen-reader users start at the new page's content.
 * In-page hash links on the same route are left to the browser's native (smooth) scrolling.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const isFirstRender = previousPath.current === null;
    const isRouteChange = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (!isRouteChange) return;

    if (!isFirstRender) document.getElementById("main")?.focus({ preventScroll: true });

    if (!hash) {
      if (!isFirstRender) window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // The target may live in a lazily loaded page: retry briefly until it exists.
    // Not cancelled on cleanup on purpose — StrictMode re-runs effects, and a late scroll is harmless.
    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    const scrollTo = (target: HTMLElement) => target.scrollIntoView({ behavior: "instant", block: "start" });
    const tryScroll = () => {
      const target = document.getElementById(id);
      if (target) {
        scrollTo(target);
        // Re-apply once web fonts have settled the layout.
        document.fonts?.ready.then(() => window.setTimeout(() => scrollTo(target), 0));
      } else if (attempts++ < 40) {
        window.setTimeout(tryScroll, 50);
      }
    };
    window.setTimeout(tryScroll, 0);
  }, [pathname, hash]);

  return null;
}
