import { principles, routes, stats } from "../content/site";
import { ClosingCta } from "../components/sections/ClosingCta";
import { Container } from "../components/ui/Container";
import { CountUp } from "../components/ui/CountUp";
import { Reveal } from "../components/ui/Reveal";
import { Tag } from "../components/ui/Tag";
import { DotSpiral } from "../components/visuals/DotSpiral";
import { redPalette } from "../components/visuals/palettes";
import { usePageMeta } from "../lib/usePageMeta";

const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });
const band = "border-t border-line py-36 sm:py-44 lg:py-52";

function Hero() {
  return (
    <section aria-labelledby="about-title" className="pool-red relative -mt-[68px] flex min-h-[92dvh] overflow-hidden">
      <div className="absolute inset-0 opacity-70">
        <DotSpiral palette={redPalette} anchor={0.73} size={0.8} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_7_11/0.3),rgb(5_7_11/0.9)_75%)] md:bg-[linear-gradient(90deg,rgb(5_7_11/0.97)_0%,rgb(5_7_11/0.75)_50%,rgb(5_7_11/0)_80%)]" />
      <Container className="relative flex flex-col justify-end pt-[68px] pb-24 md:justify-center md:pb-0">
        <h1 id="about-title" className="rise max-w-[14ch] text-display" style={rise(0)}>
          Education teaches knowledge. <span className="text-brand">Work demands its application.</span>
        </h1>
        <p className="rise mt-8 max-w-[34ch] text-lead text-fg-soft" style={rise(140)}>
          We exist to close the distance between the two.
        </p>
      </Container>
    </section>
  );
}

function Gap() {
  const { confidence } = stats;
  return (
    <section aria-labelledby="gap-title" className={`pool-red ${band}`}>
      <Container>
        <Reveal>
          <Tag tone="brand">The gap</Tag>
          <h2 id="gap-title" className="mt-6 max-w-[16ch] text-headline">
            Graduates feel ready. <span className="text-fg-muted">Employers aren&rsquo;t so sure.</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-14 sm:grid-cols-2 sm:gap-0 lg:mt-28">
          <Reveal className="sm:border-r sm:border-line sm:pr-12">
            <p className="text-[clamp(5rem,3rem+8vw,10rem)] leading-[0.85] font-medium tracking-[-0.06em] text-fg">
              <CountUp value={confidence.graduates} suffix="%" />
            </p>
            <p className="mt-6 max-w-[26ch] text-fg-soft">of graduates rate their {confidence.skill} as proficient.</p>
          </Reveal>
          <Reveal delay={150} className="sm:pl-12">
            <p className="text-[clamp(5rem,3rem+8vw,10rem)] leading-[0.85] font-medium tracking-[-0.06em] text-brand">
              <CountUp value={confidence.employers} suffix="%" />
            </p>
            <p className="mt-6 max-w-[26ch] text-fg-soft">of employers agree.</p>
          </Reveal>
        </div>

        <Reveal className="mt-20 border-t border-line pt-8">
          <p className="font-mono text-[0.7rem] tracking-[0.06em] text-fg-muted">Source: {confidence.source}</p>
        </Reveal>
      </Container>
    </section>
  );
}

function Principles() {
  return (
    <section aria-labelledby="principles-title" className={band}>
      <Container>
        <Reveal>
          <h2 id="principles-title" className="max-w-[16ch] text-headline">
            What we believe.
          </h2>
        </Reveal>
        <ol className="mt-16 lg:mt-20">
          {principles.map((item) => (
            <li key={item.title} className="border-t border-line">
              <Reveal delay={60} className="grid gap-3 py-9 md:grid-cols-12 md:items-baseline md:gap-10">
                <p className="text-title text-fg md:col-span-7">{item.title}</p>
                <p className="text-fg-soft md:col-span-5">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function AboutPage() {
  usePageMeta("About", "Education teaches knowledge. Work demands its application. Why Ontographica exists and what we believe.");

  return (
    <>
      <Hero />
      <Gap />
      <Principles />
      <ClosingCta
        title="Two platforms."
        accent="One path."
        accentClass="text-brand-soft"
        palette={redPalette}
        primary={{ label: "Explore OntoCampus", to: routes.ontocampus, variant: "outline" }}
        secondary={{ label: "Discover OntoCandidate", to: routes.ontocandidate, variant: "outline" }}
      />
    </>
  );
}
