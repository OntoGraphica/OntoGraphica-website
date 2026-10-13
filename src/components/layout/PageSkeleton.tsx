import { Container } from "../ui/Container";

/** Placeholder shaped like a page hero, shown while a lazily loaded page arrives. */
export function PageSkeleton() {
  const bar = "rounded-control bg-raised motion-safe:animate-pulse";
  return (
    <div role="status" className="min-h-[70vh] pt-16 sm:pt-24 lg:pt-32">
      <span className="sr-only">Loading page</span>
      <Container>
        <div aria-hidden="true">
          <div className={`h-4 w-32 ${bar}`} />
          <div className={`mt-8 h-14 w-full max-w-[44rem] sm:h-20 ${bar}`} />
          <div className={`mt-4 h-14 w-3/4 max-w-[32rem] sm:h-20 ${bar}`} />
          <div className={`mt-10 h-5 w-full max-w-[36rem] ${bar}`} />
          <div className={`mt-3 h-5 w-2/3 max-w-[28rem] ${bar}`} />
        </div>
      </Container>
    </div>
  );
}
