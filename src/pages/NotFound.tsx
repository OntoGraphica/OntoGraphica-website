import { routes } from "../content/site";
import { ButtonLink } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { Tag } from "../components/ui/Tag";
import { usePageMeta } from "../lib/usePageMeta";

export function NotFoundPage() {
  usePageMeta("Page not found", "The page you were looking for could not be found.");
  return (
    <section aria-labelledby="not-found-title" className="py-24 sm:py-32">
      <Container>
        <Tag>404</Tag>
        <h1 id="not-found-title" className="mt-5 max-w-[18ch] text-headline ">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-6 max-w-[48ch] text-fg-soft">The link may be out of date, or the address may have been typed incorrectly.</p>
        <ButtonLink to={routes.home} className="mt-10" arrow>
          Go to the homepage
        </ButtonLink>
      </Container>
    </section>
  );
}
