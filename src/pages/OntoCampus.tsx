import { controlScreens, founding, insideScreens } from "../content/campus";
import { cta, fictionalNote, routes } from "../content/site";
import { ProductLockup, Wordmarks } from "../components/brand/ProductLockup";
import { MediaTabs } from "../components/sections/MediaTabs";
import { ClosingCta } from "../components/sections/ClosingCta";
import { TextLink } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { Reveal } from "../components/ui/Reveal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Tag } from "../components/ui/Tag";
import { DotSpiral } from "../components/visuals/DotSpiral";
import { Orbit } from "../components/visuals/Orbit";
import { campusPalette } from "../components/visuals/palettes";
import { ProfessionRing } from "../components/visuals/ProfessionRing";
import { usePageMeta } from "../lib/usePageMeta";

const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });
const band = "border-t border-line py-36 sm:py-44 lg:py-52";

function Hero() {
  return (
    <section aria-labelledby="campus-title" className="pool relative -mt-[68px] flex min-h-[92dvh] overflow-hidden">
      <div className="absolute inset-0 opacity-80">
        <DotSpiral palette={campusPalette} anchor={0.74} size={0.8} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_7_11/0.3),rgb(5_7_11/0.9)_75%)] md:bg-[linear-gradient(90deg,rgb(5_7_11/0.97)_0%,rgb(5_7_11/0.75)_50%,rgb(5_7_11/0)_80%)]" />
      <Container className="relative flex flex-col justify-end pt-[68px] pb-24 md:justify-center md:pb-0">
        <div className="rise" style={rise(0)}>
          <ProductLockup product="campus" className="text-[1.5rem] text-fg" />
        </div>
        <h1 id="campus-title" className="rise mt-10 max-w-[16ch] text-[clamp(2.75rem,1.2rem+4.4vw,5.25rem)] leading-[0.98] tracking-[-0.045em]" style={rise(100)}>
          Where students put their degree to work.
        </h1>
        <p className="rise mt-7 max-w-[40ch] text-lead text-fg-soft" style={rise(200)}>
          A workplace simulation that brings professional practice into your curriculum.
        </p>
        <StatusBadge tone="campus" className="rise mt-10 self-start" style={rise(300)}>
          Software engineering &middot; available now
        </StatusBadge>
      </Container>
    </section>
  );
}

function Loop() {
  return (
    <section id="loop" aria-labelledby="loop-title" className={band}>
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-4">
            <h2 id="loop-title" className="text-headline">
              The rhythm of <span className="text-fg-muted">real work.</span>
            </h2>
            <p className="mt-6 max-w-[30ch] text-lead text-fg-soft">Decide, act, and live with the consequences.</p>
          </Reveal>
          <Reveal delay={150} className="min-w-0 lg:col-span-8">
            <Orbit />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Inside() {
  return (
    <section id="inside" aria-labelledby="inside-title" className={`pool ${band}`}>
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="inside-title" className="text-headline">
            Inside the simulation.
          </h2>
        </Reveal>
        <Reveal className="mt-14">
          <MediaTabs id="inside-screens" label="Inside the simulation" screens={insideScreens} />
        </Reveal>
        <p className="mt-6 text-center text-[0.8rem] text-fg-muted">{fictionalNote}</p>
      </Container>
    </section>
  );
}

function ControlRoom() {
  return (
    <section aria-labelledby="control-title" className={`pool ${band}`}>
      <Container>
        <Reveal>
          <Tag>Faculty view</Tag>
          <h2 id="control-title" className="mt-6 max-w-[18ch] text-headline">
            Every team. Every decision. <span className="text-accent-soft">Live.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead text-fg-soft">
            <Wordmarks text="Facilitated by OntoCampus. Visible to faculty." />
          </p>
        </Reveal>
        <Reveal className="mt-14 lg:mt-20">
          <MediaTabs id="control-screens" label="Faculty view" screens={controlScreens} orientation="vertical" />
        </Reveal>
      </Container>
    </section>
  );
}

function Professions() {
  return (
    <section aria-labelledby="professions-title" className="pool relative overflow-hidden border-t border-line pt-36 pb-28 sm:pt-44 lg:pt-52 lg:pb-36">
      <Container>
        <Reveal>
          <h2 id="professions-title" className="max-w-[16ch] text-headline">
            One engine. <span className="text-fg-muted">Many professions.</span>
          </h2>
          <p className="mt-6 max-w-[44ch] text-lead text-fg-soft">
            Every path is built around the real work of its field.
          </p>
          <TextLink to={routes.network} tone="fg" className="mt-6">
            Practitioners can help build them
          </TextLink>
        </Reveal>
      </Container>
      <Reveal delay={150} className="mt-10 lg:mt-6">
        <ProfessionRing />
      </Reveal>
    </section>
  );
}

export function OntoCampusPage() {
  usePageMeta("OntoCampus", "OntoCampus is a workplace simulation where students put their degree to work, alongside your curriculum.");

  return (
    <>
      <Hero />
      <Loop />
      <Inside />
      <ControlRoom />
      <Professions />
      <ClosingCta id="founding" title={founding.title} accent={founding.accent} line={founding.line} primary={cta.partner} />
    </>
  );
}
