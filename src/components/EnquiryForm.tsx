import { useId, useRef, useState, type FormEvent } from "react";
import { enquiryMailto, enquiryRecord, enquiryTypeLabels, type EnquiryPayload, type EnquiryType } from "../lib/enquiry";
import { submitForm, type SubmitResult } from "../lib/forms";
import { Wordmarks } from "./brand/ProductLockup";
import { Consent, Field, SpamTrap, SubmitMessage, emailPattern, inputClass } from "./form/FormParts";
import { Arrow, buttonClasses } from "./ui/Button";

type Fields = {
  name: string;
  email: string;
  organisation: string;
  role: string;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

const emptyFields: Fields = { name: "", email: "", organisation: "", role: "", message: "", consent: false };

const messagePrompts: Record<EnquiryType, string> = {
  university:
    "Tell us about your institution, the programmes or cohorts you have in mind, and what you would like students to experience.",
  employer: "Tell us about your organisation, the roles you hire for, and how you would like to be involved.",
  general: "How can we help?",
};

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(fields.email.trim())) errors.email = "Please enter a valid email address, like name@university.ac.uk.";
  if (!fields.organisation.trim()) errors.organisation = "Please enter your institution or organisation.";
  if (fields.message.trim().length < 20) errors.message = "Please add a short message (at least 20 characters).";
  if (!fields.consent) errors.consent = "Please confirm we may use these details to respond to your enquiry.";
  return errors;
}

type EnquiryFormProps = {
  type: EnquiryType;
  onTypeChange: (type: EnquiryType) => void;
};

// On-screen choice labels, with the product shown as its logo rather than in brackets.
const optionDisplay: Record<EnquiryType, { label: string; product?: string }> = {
  university: { label: "University partnership", product: "OntoCampus" },
  employer: { label: "Employer interest", product: "OntoCandidate" },
  general: { label: "General enquiry" },
};

// Selection carries the product colour: OntoCampus blue, OntoCandidate yellow, neutral otherwise.
const typeTone: Record<EnquiryType, { card: string; ring: string; dot: string; button: "primary" | "candidate" | "light" }> = {
  university: { card: "border-accent-bright bg-accent-wash text-fg", ring: "border-accent-bright", dot: "bg-accent-bright", button: "primary" },
  employer: { card: "border-candidate bg-candidate-wash text-fg", ring: "border-candidate", dot: "bg-candidate", button: "candidate" },
  general: { card: "border-fg-muted bg-white/[0.05] text-fg", ring: "border-fg", dot: "bg-fg", button: "light" },
};

export function EnquiryForm({ type, onTypeChange: setType }: EnquiryFormProps) {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [trap, setTrap] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const payload: EnquiryPayload = {
    type,
    name: fields.name.trim(),
    email: fields.email.trim(),
    organisation: fields.organisation.trim(),
    role: fields.role.trim(),
    message: fields.message.trim(),
  };

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    if (result) setResult(null);
  };

  const describedBy = (key: keyof Fields, extra?: string) =>
    [errors[key] ? `${id(key)}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    setResult(null);

    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(firstInvalid))}`)?.focus();
      return;
    }

    setSubmitting(true);
    const outcome = await submitForm("enquiry", { ...enquiryRecord(payload), website: trap });
    setSubmitting(false);
    setResult(outcome);
  };

  if (result?.status === "sent") {
    return (
      <SubmitMessage
        result={result}
        mailto={enquiryMailto(payload)}
        sentTitle="Thank you. Your enquiry has been received."
        sentText={`We’ll reply to ${payload.email}.`}
      />
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative">
      <SpamTrap value={trap} onChange={setTrap} />

      <fieldset>
        <legend className="text-[0.9rem] font-medium text-fg">I’m enquiring about</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(Object.keys(enquiryTypeLabels) as EnquiryType[]).map((option) => {
            const checked = type === option;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-control border px-4 py-3 text-[0.9rem] leading-snug transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-soft ${
                  checked ? typeTone[option].card : "border-line-strong bg-raised text-fg-soft hover:border-fg-muted hover:text-fg"
                }`}
              >
                <input
                  type="radio"
                  name="enquiry-type"
                  value={option}
                  checked={checked}
                  onChange={() => setType(option)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${checked ? typeTone[option].ring : "border-fg-muted"}`}
                >
                  {checked && <span className={`h-1.5 w-1.5 rounded-full ${typeTone[option].dot}`} />}
                </span>
                <span className="flex flex-col gap-1.5">
                  {optionDisplay[option].label}
                  {optionDisplay[option].product && <Wordmarks text={optionDisplay[option].product} />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field id={id("name")} label="Full name" error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass}
          />
        </Field>
        <Field id={id("email")} label="Work email" error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={fields.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
        </Field>
        <Field id={id("organisation")} label={type === "university" ? "Institution" : "Organisation"} error={errors.organisation}>
          <input
            id={id("organisation")}
            name="organisation"
            type="text"
            autoComplete="organization"
            value={fields.organisation}
            onChange={(event) => update("organisation", event.target.value)}
            aria-invalid={Boolean(errors.organisation)}
            aria-describedby={describedBy("organisation")}
            className={inputClass}
          />
        </Field>
        <Field id={id("role")} label="Role or title" optional>
          <input
            id={id("role")}
            name="role"
            type="text"
            autoComplete="organization-title"
            value={fields.role}
            onChange={(event) => update("role", event.target.value)}
            placeholder={type === "university" ? "e.g. Dean, Placement Officer" : undefined}
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id={id("message")} label="Message" error={errors.message}>
            <textarea
              id={id("message")}
              name="message"
              rows={5}
              value={fields.message}
              onChange={(event) => update("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy("message", id("message-hint"))}
              className={`${inputClass} resize-y`}
            />
          </Field>
          <p id={id("message-hint")} className="mt-2 text-[0.82rem] text-fg-muted">
            {messagePrompts[type]}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Consent
          id={id("consent")}
          checked={fields.consent}
          onChange={(checked) => update("consent", checked)}
          error={errors.consent}
          purpose="to respond to my enquiry"
        />
      </div>

      <div aria-live="polite" className="mt-6 empty:hidden">
        {errorCount > 0 && (
          <p className="text-[0.9rem] text-danger">
            Please correct {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} and try again.
          </p>
        )}
        {result && <SubmitMessage result={result} mailto={enquiryMailto(payload)} sentTitle="" sentText="" />}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.82rem] text-fg-muted">All fields are required unless marked optional.</p>
        <button type="submit" disabled={submitting} className={buttonClasses(typeTone[type].button, "sm:min-w-56")}>
          {submitting ? "Sending…" : type === "university" ? "Send partnership enquiry" : "Send enquiry"}
          {!submitting && <Arrow />}
        </button>
      </div>
    </form>
  );
}
