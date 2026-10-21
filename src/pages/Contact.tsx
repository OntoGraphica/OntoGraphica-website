import { useSearchParams } from "react-router";
import { EnquiryForm } from "../components/EnquiryForm";
import { Container } from "../components/ui/Container";
import { enquiryTypeLabels, type EnquiryType } from "../lib/enquiry";
import { usePageMeta } from "../lib/usePageMeta";

const isEnquiryType = (value: string | null): value is EnquiryType => value !== null && value in enquiryTypeLabels;

export function ContactPage() {
  usePageMeta(
    "Contact",
    "Contact Ontographica about a university partnership for OntoCampus, employer interest in OntoCandidate, or a general enquiry.",
  );
  const [params, setParams] = useSearchParams();
  const requested = params.get("type");
  const type: EnquiryType = isEnquiryType(requested) ? requested : "university";

  const setType = (next: EnquiryType) => setParams({ type: next }, { replace: true, preventScrollReset: true });

  return (
    <section aria-labelledby="contact-title" className="pool-red -mt-[68px] pt-[150px] pb-28 sm:pt-[164px] lg:pb-40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h1 id="contact-title" className="text-headline">
              Let&rsquo;s talk.
            </h1>
            <p className="mt-6 max-w-[34ch] text-lead text-fg-soft">Tell us what you have in mind. We will take it from there.</p>
          </div>

          <div className="panel rounded-card p-6 sm:p-10 lg:col-span-7">
            <EnquiryForm type={type} onTypeChange={setType} />
          </div>
        </div>
      </Container>
    </section>
  );
}
