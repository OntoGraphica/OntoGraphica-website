import { network } from "../content/network";
import { NetworkForm } from "../components/NetworkForm";
import { ButtonLink } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { Icon } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { DotSpiral } from "../components/visuals/DotSpiral";
import { redPalette } from "../components/visuals/palettes";
import { usePageMeta } from "../lib/usePageMeta";

const rise = (ms: number) => ({ ["--d" as string]: `${ms}ms` });
const band = "border-t border-line py-36 sm:py-44 lg:py-52";

function Hero() {
  return (
    <section aria-labelledby="network-title" className="pool-red relative -mt-[68px] flex min-h-[92dvh] overflow-hidden">
      <div className="absolute inset-0 opacity-80">
        <DotSpiral palette={redPalette} anchor={0.74} size={0.8} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_7_11/0.3),rgb(5_7_11/0.9)_75%)] md:bg-[linear-gradient(90deg,rgb(5_7_11/0.97)_0%,rgb(5_7_11/0.75)_50%,rgb(5_7_11/0)_80%)]" />
      <Container className="relative flex flex-col justify-end pt-[68px] pb-24 md:justify-center md:pb-0">
        <h1 id="network-title" className="rise max-w-[15ch] text-display" style={rise(0)}>
          {network.title} <span className="text-brand">{network.accent}</span>
        </h1>
        <p className="rise mt-8 max-w-[38ch] text-lead text-fg-soft" style={rise(140)}>
          {network.lead}
        </p>
        <div className="rise mt-10" style={rise(260)}>
          <ButtonLink to="#join" variant="brand" arrow>
            Join the network
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function Roles() {
  return (
    <section aria-labelledby="roles-title" className={band}>
      <Container>
        <Reveal>
          <h2 id="roles-title" className="max-w-[16ch] text-headline">
            {network.rolesTitle}
          </h2>
        </Reveal>
        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:mt-20">
          {network.roles.map((role, index) => (
            <li key={role.id}>
              <Reveal
                delay={index * 120}
                className="panel relative flex h-full min-h-[17rem] flex-col justify-between gap-12 overflow-hidden rounded-card p-8 lg:p-10"
              >
                <Icon name={role.icon} size={32} className="text-brand-soft" />
                <div>
                  <p className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight font-medium tracking-[-0.03em] text-fg">{role.title}</p>
                  <p className="mt-3 max-w-[40ch] text-fg-soft">{role.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Join() {
  return (
    <section id="join" aria-labelledby="join-title" className={`pool-red ${band}`}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 id="join-title" className="text-headline">
              {network.joinTitle}
            </h2>
            <p className="mt-6 max-w-[34ch] text-lead text-fg-soft">{network.joinLine}</p>
          </Reveal>
          <div className="panel rounded-card p-6 sm:p-10 lg:col-span-7">
            <NetworkForm />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function NetworkPage() {
  usePageMeta(
    "Network",
    "Join Ontographica’s network of professionals and alumni who bring real workplace experience into student simulations, as facilitators and curators.",
  );

  return (
    <>
      <Hero />
      <Roles />
      <Join />
    </>
  );
}
