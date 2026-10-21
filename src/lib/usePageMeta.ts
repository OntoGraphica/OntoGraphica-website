import { useEffect } from "react";

const DEFAULT_TITLE = "Ontographica | Knowledge, Engineered.";

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title: string | null, description: string) {
  useEffect(() => {
    document.title = title ? `${title} | Ontographica` : DEFAULT_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
