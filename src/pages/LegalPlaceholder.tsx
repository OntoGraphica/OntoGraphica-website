import { Container } from "../components/ui/Container";
import { usePageMeta } from "../lib/usePageMeta";

type LegalPlaceholderProps = { title: "Privacy Policy" | "Terms" };

/** PLACEHOLDER page. Replace with the approved legal text before launch. */
export function LegalPlaceholder({ title }: LegalPlaceholderProps) {
  usePageMeta(title, `Ontographica ${title.toLowerCase()}.`);

  return (
    <section aria-labelledby="legal-title" className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h1 id="legal-title" className="text-headline">
            {title}
          </h1>
          <div className="mt-10 rounded-card border-l-2 border-fg-muted bg-raised p-6">
            <p className="font-medium text-fg">This page is a placeholder.</p>
            <p className="mt-2 text-fg-soft">
              Ontographica&rsquo;s {title === "Terms" ? "terms of use have" : "privacy policy has"} not been published here yet. The
              final text will replace this notice once it has been approved.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
