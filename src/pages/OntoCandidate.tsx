import { Fragment, type CSSProperties } from "react";
import { candidate } from "../content/candidate";
import { Link } from "react-router";
import { cta, fictionalNote, products, routes } from "../content/site";
import { ProductLockup, Wordmarks } from "../components/brand/ProductLockup";
import { Screenshot, ScreenFrame } from "../components/media/Screenshot";
import { ClosingCta } from "../components/sections/ClosingCta";
import { Arrow } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { Icon } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { DotSpiral } from "../components/visuals/DotSpiral";
import { candidatePalette } from "../components/visuals/palettes";
import { usePageMeta } from "../lib/usePageMeta";

const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });
const band = "border-t border-line py-36 sm:py-44 lg:py-52";

function Hero() {
  return (
    <section aria-labelledby="candidate-title" className="pool-amber relative -mt-[68px] flex min-h-[92dvh] overflow-hidden">
      <div className="absolute inset-0 opacity-90">
        <DotSpiral palette={candidatePalette} anchor={0.8} size={0.74} maxWidth={0.5} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_7_11/0.25),rgb(5_7_11/0.92)_72%)] md:bg-[linear-gradient(90deg,rgb(5_7_11/0.96)_0%,rgb(5_7_11/0.8)_50%,rgb(5_7_11/0)_82%)]"
      />
      <Container className="relative flex flex-col justify-end pt-[68px] pb-24 md:justify-center md:pb-0">
        <div className="rise" style={rise(0)}>
          <ProductLockup product="candidate" className="text-[1.5rem] text-fg" />
        </div>
        <h1 id="candidate-title" className="rise mt-10 text-[clamp(2.9rem,1.3rem+4.6vw,5.25rem)] leading-[0.98] font-medium tracking-[-0.05em]" style={rise(100)}>
          <span className="block">{candidate.headline}</span>
          <span className="block text-candidate-soft">{candidate.accent}</span>
        </h1>
        <p className="rise mt-7 max-w-[38ch] text-lead text-fg-soft" style={rise(200)}>
          {candidate.lead}
        </p>
        <StatusBadge tone="candidate" className="rise mt-10 self-start" style={rise(300)}>
          {products.candidate.status}
        </StatusBadge>
      </Container>
    </section>
  );
}

// Bento rhythm for the four benefits: wide, narrow / narrow, wide. Two tiles carry a yellow halftone field.
const benefitLayout = [
  { span: "sm:col-span-2", field: { hx: "78%", hy: "35%" }, tint: true },
  { span: "", field: null, tint: false },
  { span: "", field: null, tint: false },
  { span: "sm:col-span-2", field: { hx: "86%", hy: "62%" }, tint: false },
];

function Overlook() {
  return (
    <section aria-labelledby="overlook-title" className={band}>
      <Container>
        <Reveal>
          <h2 id="overlook-title" className="max-w-[16ch] text-headline">
            {candidate.overlook.title}
          </h2>
          <p className="mt-6 max-w-[44ch] text-lead text-fg-soft">
            <Wordmarks text={candidate.overlook.line} />
          </p>
        </Reveal>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {candidate.benefits.map((benefit, index) => {
            const layout = benefitLayout[index];
            return (
              <li key={benefit.title} className={layout.span}>
                <Reveal
                  delay={(index % 2) * 120}
                  className={`relative flex h-full min-h-[15rem] flex-col justify-between gap-12 overflow-hidden rounded-card p-8 lg:min-h-[17rem] lg:p-10 ${
                    layout.tint ? "border border-candidate/25 bg-candidate-wash" : "panel"
                  }`}
                >
                  {layout.field && (
                    <span
                      aria-hidden="true"
                      className="halftone-field absolute inset-0"
                      style={{ "--hx": layout.field.hx, "--hy": layout.field.hy, "--dot": "rgb(242 205 120 / 0.75)" } as CSSProperties}
                    />
                  )}
                  <Icon name={benefit.icon} size={30} className="relative text-candidate-soft" />
                  <div className="relative">
                    <p className="text-[1.2rem] font-medium tracking-[-0.015em] text-fg">{benefit.title}</p>
                    <p className="mt-2 max-w-[32ch] text-fg-soft">{benefit.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function Profile() {
  const { profile } = candidate;
  return (
    <section aria-labelledby="profile-title" className={`pool-amber relative overflow-hidden ${band}`}>
      <Container>
        <Reveal>
          <h2 id="profile-title" className="max-w-[16ch] text-headline">
            {profile.title}
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead text-fg-soft">{profile.line}</p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-center">
          <Reveal className="min-w-0 lg:col-span-8">
            <ScreenFrame>
              <Screenshot
                image="dark/candidate-profile"
                ratio={1487 / 1600}
                alt="Individual competency profile from OntoCampus: a radar chart scoring one student against their team average on competencies such as requirement understanding, communication and risk mitigation."
                sizes="(min-width: 1024px) 760px, 94vw"
              />
            </ScreenFrame>
            <p className="mt-5 text-[0.8rem] text-fg-muted">{fictionalNote}</p>
          </Reveal>
          <Reveal delay={150} className="lg:col-span-4">
            <p className="text-fg-muted">Assessed on</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.aspects.map((aspect) => (
                <li key={aspect} className="rounded-chip border border-line-strong px-3 py-2 text-[0.88rem] text-fg">
                  {aspect}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

// Practice (OntoCampus, blue) leads to a profile (neutral) and on to discovery (OntoCandidate, yellow).
const stages = [
  { mark: <ProductLockup product="campus" className="text-[1.3rem] text-fg" />, tone: "text-accent-soft", frame: "panel" },
  { mark: <Icon name="chart" size={30} className="text-fg" />, tone: "text-fg-soft", frame: "panel" },
  {
    mark: <ProductLockup product="candidate" className="text-[1.3rem] text-fg" />,
    tone: "text-candidate-soft",
    frame: "border border-dashed border-candidate/40 bg-candidate-wash",
  },
];

const connectors: CSSProperties[] = [
  { "--from": "rgb(74 123 247 / 0.9)", "--to": "rgb(238 241 246 / 0.6)" } as CSSProperties,
  { "--from": "rgb(238 241 246 / 0.6)", "--to": "rgb(232 179 66 / 0.9)" } as CSSProperties,
];

function Bridge() {
  return (
    <section aria-labelledby="bridge-title" className={band}>
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="bridge-title" className="text-headline">
            {candidate.bridge.title}
          </h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lead text-fg-soft">
            <Wordmarks text={candidate.bridge.line} />
          </p>
        </Reveal>

        <Reveal delay={150} className="mx-auto mt-20 max-w-5xl lg:mt-24">
          <ol className="grid justify-items-center gap-y-4 sm:grid-cols-[1fr_minmax(2rem,1fr)_1fr_minmax(2rem,1fr)_1fr] sm:items-start sm:gap-y-0">
            {candidate.flow.map((step, index) => (
              <Fragment key={step.title}>
                {index > 0 && <span aria-hidden="true" className="bridge sm:mt-[3.5rem] sm:w-full" style={connectors[index - 1]} />}
                <li className="flex w-full max-w-[16rem] flex-col items-center text-center">
                  {index === 0 ? (
                    <Link
                      to={routes.ontocampus}
                      aria-label={`OntoCampus: ${step.title}. Explore OntoCampus`}
                      className={`group flex h-28 w-full flex-col items-center justify-center gap-3 rounded-card transition-colors duration-300 hover:bg-white/[0.04] ${stages[index].frame}`}
                    >
                      {stages[index].mark}
                      <p className={`tag flex items-center gap-2 ${stages[index].tone}`}>
                        {step.title} <Arrow className="h-3 w-3" />
                      </p>
                    </Link>
                  ) : (
                    <div className={`flex h-28 w-full flex-col items-center justify-center gap-3 rounded-card ${stages[index].frame}`}>
                      {stages[index].mark}
                      <p className={`tag ${stages[index].tone}`}>{step.title}</p>
                    </div>
                  )}
                  <p className="mt-5 max-w-[24ch] text-fg-soft">{step.line}</p>
                </li>
              </Fragment>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

export function OntoCandidatePage() {
  usePageMeta("OntoCandidate", "Hire for capability. OntoCandidate helps employers discover talent through evidence of demonstrated skills. In development.");

  return (
    <>
      <Hero />
      <Overlook />
      <Bridge />
      <Profile />
      <ClosingCta
        title={candidate.closing.title}
        accent={candidate.closing.accent}
        accentClass="text-candidate-soft"
        palette={candidatePalette}
        primary={{ ...cta.register, variant: "candidate" }}
      />
    </>
  );
}
