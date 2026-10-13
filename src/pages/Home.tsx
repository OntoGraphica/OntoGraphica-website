import type { CSSProperties } from "react";
import { company, cta, fictionalNote, products, routes, stats } from "../content/site";
import { ProductLockup, Wordmarks } from "../components/brand/ProductLockup";
import { Screenshot, ScreenFrame } from "../components/media/Screenshot";
import { ClosingCta } from "../components/sections/ClosingCta";
import { TextLink } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { CountUp } from "../components/ui/CountUp";
import { Reveal } from "../components/ui/Reveal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { DotSpiral } from "../components/visuals/DotSpiral";
import { brandPalette } from "../components/visuals/palettes";
import { usePageMeta } from "../lib/usePageMeta";

const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });

function Hero() {
  const [first, second] = company.tagline.split(" ");
  return (
    <section aria-labelledby="home-title" className="pool-red relative -mt-[68px] flex min-h-[100dvh] flex-col overflow-hidden">
      <div className="absolute inset-0">
        <DotSpiral palette={brandPalette} anchor={0.7} anchorY={0.47} size={1.02} maxWidth={0.62} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_7_11/0.1),rgb(5_7_11/0.9)_68%)] md:bg-[linear-gradient(90deg,rgb(5_7_11/0.92)_0%,rgb(5_7_11/0.55)_42%,rgb(5_7_11/0)_68%)]"
      />

      <Container className="relative flex flex-1 flex-col justify-end pt-[68px] pb-12 md:justify-center md:pb-0">
        <h1
          id="home-title"
          className="rise text-[clamp(3.8rem,1.4rem+8.6vw,10.5rem)] leading-[0.86] font-medium tracking-[-0.06em]"
          style={rise(0)}
        >
          <span className="block">{first}</span>
          <span className="block text-brand">{second}</span>
        </h1>
        <p className="rise mt-8 max-w-[36ch] text-lead text-fg-soft" style={rise(240)}>
          We build the platforms that turn learning into demonstrated capability.
        </p>
      </Container>
    </section>
  );
}

function Numbers() {
  const items = [stats.india, stats.skills, stats.upskilling];
  return (
    <section aria-labelledby="numbers-title" className="relative border-t border-line py-36 sm:py-44 lg:py-52">
      <Container>
        <Reveal>
          <h2 id="numbers-title" className="max-w-[14ch] text-headline">
            The world of work is moving.
          </h2>
        </Reveal>
        <dl className="mt-20 grid gap-14 md:grid-cols-3 md:gap-0 lg:mt-24">
          {items.map((item, index) => (
            <Reveal key={item.label} delay={index * 120} className={index > 0 ? "md:border-l md:border-line md:pl-10" : "md:pr-10"}>
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block text-[clamp(4rem,2.8rem+4vw,7rem)] leading-[0.85] font-medium tracking-[-0.06em] text-fg">
                  <CountUp value={item.value} suffix="%" />
                </span>
                <span className="mt-5 block max-w-[24ch] text-fg-soft" aria-hidden="true">
                  {item.label}
                </span>
                <span className="mt-4 block font-mono text-[0.68rem] tracking-[0.04em] text-fg-muted">{item.source}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function Showcase() {
  return (
    <section aria-labelledby="showcase-title" className="relative overflow-hidden border-t border-line py-36 sm:py-44 lg:py-52">
      <Container>
        <Reveal>
          <ProductLockup product="campus" className="text-[1.4rem] text-fg" />
          <h2 id="showcase-title" className="mt-8 max-w-[16ch] text-headline">
            Your degree builds the skills. <span className="text-fg-muted">
              <Wordmarks text="OntoCampus puts them to the test." />
            </span>
          </h2>
          <TextLink to={routes.ontocampus} tone="accent" className="mt-8">
            <Wordmarks text="Explore OntoCampus" />
          </TextLink>
        </Reveal>

        <div className="relative mt-16 lg:mt-20">
          <div className="tilt-frame">
            <ScreenFrame>
              <Screenshot
                image="dark/student-guide"
                alt="OntoCampus welcome: 'Today you work at NexaWorks', with the stages of the sprint and a map of the simulated desktop."
              />
            </ScreenFrame>
          </div>
          <p className="mt-6 text-[0.8rem] text-fg-muted">{fictionalNote}</p>
        </div>
      </Container>
    </section>
  );
}

function Candidate() {
  return (
    <section aria-labelledby="candidate-title" className="border-t border-line py-28 sm:py-36">
      <Container>
        <Reveal className="relative overflow-hidden rounded-card border border-dashed border-candidate/40 bg-candidate-wash p-8 sm:p-12 lg:p-16">
          <span
            aria-hidden="true"
            className="halftone-field absolute inset-0"
            style={{ "--hx": "82%", "--hy": "50%", "--dot": "rgb(242 205 120 / 0.75)" } as CSSProperties}
          />
          <div className="relative max-w-2xl">
            <ProductLockup product="candidate" className="text-[1.4rem] text-fg" />
            <h2 id="candidate-title" className="mt-8 text-headline">
              Evidence that can open doors.
            </h2>
            <p className="mt-6 max-w-[40ch] text-lead text-fg-soft">
              <Wordmarks text="OntoCandidate will help employers find graduates by what they have shown they can do." />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <StatusBadge tone="candidate">{products.candidate.status}</StatusBadge>
              <TextLink to={routes.ontocandidate} tone="candidate">
                <Wordmarks text="Discover OntoCandidate" />
              </TextLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function HomePage() {
  usePageMeta(null, "Knowledge, Engineered. Ontographica builds the platforms that turn learning into demonstrated capability.");

  return (
    <>
      <Hero />
      <Numbers />
      <Showcase />
      <Candidate />
      <ClosingCta
        title="Put knowledge"
        accent="to work."
        accentClass="text-brand-soft"
        palette={brandPalette}
        primary={{ ...cta.partner, variant: "brand" }}
        secondary={{ ...cta.register, variant: "brand" }}
      />
    </>
  );
}
