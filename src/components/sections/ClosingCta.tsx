import { ButtonLink, TextLink, type ButtonVariant } from "../ui/Button";
import { Wordmarks } from "../brand/ProductLockup";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { DotSpiral, defaultPalette, type SpiralPalette } from "../visuals/DotSpiral";

type ClosingCtaProps = {
  id?: string;
  title: string;
  accent?: string;
  line?: string;
  primary: { label: string; to: string; variant?: ButtonVariant };
  /** A text link by default; give it a variant to render a matching button instead. */
  secondary?: { label: string; to: string; tone?: "fg" | "accent" | "candidate"; variant?: ButtonVariant };
  palette?: SpiralPalette;
  accentClass?: string;
};

/** Closing moment: a short line over a faint spiral field, one action. */
export function ClosingCta({ id, title, accent, line, primary, secondary, palette = defaultPalette, accentClass = "text-accent-soft" }: ClosingCtaProps) {
  return (
    <section id={id} aria-labelledby="closing-title" className="relative overflow-hidden border-t border-line">
      <div aria-hidden="true" className="absolute inset-0 opacity-60">
        <DotSpiral anchor={0.5} anchorY={0.5} size={1.15} maxWidth={0.9} palette={palette} />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_50%,rgb(5_7_11/0.92),rgb(5_7_11/0.4)_70%,rgb(5_7_11/0.9))]" />
      <Container className="relative py-40 sm:py-48 lg:py-56">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="closing-title" className="text-headline">
            {title}
            {accent && <span className={`block ${accentClass}`}>{accent}</span>}
          </h2>
          {line && (
            <p className="mx-auto mt-6 max-w-[44ch] text-lead text-fg-soft">
              <Wordmarks text={line} />
            </p>
          )}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <ButtonLink to={primary.to} variant={primary.variant ?? "primary"} arrow>
              <Wordmarks text={primary.label} />
            </ButtonLink>
            {secondary &&
              (secondary.variant ? (
                <ButtonLink to={secondary.to} variant={secondary.variant} arrow>
                  <Wordmarks text={secondary.label} />
                </ButtonLink>
              ) : (
                <TextLink to={secondary.to} tone={secondary.tone}>
                  <Wordmarks text={secondary.label} />
                </TextLink>
              ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
