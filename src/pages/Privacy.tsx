import type { ReactNode } from "react";
import { company } from "../content/site";
import { Container } from "../components/ui/Container";
import { usePageMeta } from "../lib/usePageMeta";

// Written to match what the site actually does: no cookies, analytics or tracking, fonts and
// images served from the site itself, and form responses stored in a Google Sheet (with an email copy).
// Review with a legal adviser and update `lastUpdated` whenever this changes.
const lastUpdated = "14 October 2026";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-title text-fg">{title}</h2>
      <div className="mt-4 space-y-4 text-fg-soft">{children}</div>
    </section>
  );
}

const email = (
  <a href={`mailto:${company.email}`} className="font-medium text-fg underline underline-offset-4">
    {company.email}
  </a>
);

export function PrivacyPage() {
  usePageMeta("Privacy Policy", "How Ontographica handles personal information shared through this website.");

  return (
    <section aria-labelledby="privacy-title" className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h1 id="privacy-title" className="text-headline">
            Privacy Policy
          </h1>
          <p className="mt-4 text-fg-muted">Last updated {lastUpdated}</p>
          <p className="mt-8 text-lead text-fg-soft">
            This website collects only what you choose to send us. This page explains what we receive, why, and what you can ask us to do with it.
          </p>

          <div className="mt-14 space-y-12">
            <Section title="Who we are">
              <p>Ontographica runs this website. For anything about your personal information, write to {email}.</p>
            </Section>

            <Section title="What the website collects">
              <p>
                Nothing unless you fill in a form. The site sets no cookies and uses no analytics, advertising or tracking tools. Its fonts and images are
                served from the site itself, not from third-party services.
              </p>
            </Section>

            <Section title="When you fill in a form">
              <p>
                The contact form asks for your name, work email, organisation, your role if you give one, and your message. The network
                form asks for your name, email, role, organisation, field, years of experience, your LinkedIn profile if you give it, and
                what you would bring.
              </p>
              <p>
                When you submit a form, we store your answers in a Google Sheet that only Ontographica can access, and we receive a copy
                by email. Google provides that service on our behalf. If online submission isn&rsquo;t available, the form offers to send
                the same details from your own email app instead.
              </p>
              <p>
                We use these details to reply to your enquiry, or to contact you about the practitioner network, and to continue the
                conversation that follows. We do not sell them, share them with other organisations, or add you to a mailing list without
                asking you first.
              </p>
            </Section>

            <Section title="How long we keep it">
              <p>
                We keep enquiries for as long as we need them to respond and follow up, and network details for as long as you want to be
                part of the network. You can ask us to delete them at any time.
              </p>
            </Section>

            <Section title="Hosting">
              <p>
                The website is hosted on GitHub Pages. GitHub may record technical information, such as IP addresses, to keep the service
                secure and running. See{" "}
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                  className="font-medium text-fg underline underline-offset-4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub&rsquo;s privacy statement
                </a>
                .
              </p>
            </Section>

            <Section title="Your choices">
              <p>
                You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Write to {email} and we will
                respond as soon as we can.
              </p>
            </Section>

            <Section title="Changes">
              <p>If we change how we handle personal information, we will update this page and the date at the top.</p>
            </Section>
          </div>
        </div>
      </Container>
    </section>
  );
}
