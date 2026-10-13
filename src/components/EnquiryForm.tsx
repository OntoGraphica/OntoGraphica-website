import { Icon } from "./ui/Icon";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { company } from "../content/site";
import { enquiryMailto, enquiryTypeLabels, type EnquiryPayload, type EnquiryType } from "../lib/enquiry";
import { Arrow, buttonClasses } from "./ui/Button";
import { Wordmarks } from "./brand/ProductLockup";

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

const inputClass =
  "mt-2 block w-full rounded-control border bg-raised px-4 py-3 text-[1rem] text-fg placeholder:text-fg-muted/80 transition-colors focus:border-accent-bright focus:outline-2 focus:outline-offset-0 focus:outline-accent-bright aria-[invalid=true]:border-danger";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.9rem] font-medium text-fg">
        {label}
        {optional && <span className="text-[0.8rem] font-normal text-fg-muted"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-[0.85rem] text-danger">
          <Icon name="warning" size={15} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/** Shown after the visitor's email app has been asked to open with their enquiry. */
function OpenedMessage({ mailto }: { mailto: string }) {
  return (
    <div className="rounded-card border border-success/40 bg-success/10 p-6" role="status">
      <p className="flex items-center gap-2 font-medium text-success">
        <Icon name="checkCircle" size={18} /> Your email is ready to send.
      </p>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-soft">
        Your email app should have opened with your enquiry written out. Press send there and it reaches us. If nothing opened,{" "}
        <a className="font-medium text-fg underline underline-offset-4" href={mailto}>
          try again
        </a>{" "}
        or write to{" "}
        <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${company.email}`}>
          {company.email}
        </a>
        .
      </p>
    </div>
  );
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
  const [mailto, setMailto] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    if (mailto) setMailto(null);
  };

  const describedBy = (key: keyof Fields, extra?: string) =>
    [errors[key] ? `${id(key)}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    setMailto(null);

    const firstInvalid = (Object.keys(nextErrors) as (keyof Fields)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(firstInvalid))}`)?.focus();
      return;
    }

    const payload: EnquiryPayload = {
      type,
      name: fields.name.trim(),
      email: fields.email.trim(),
      organisation: fields.organisation.trim(),
      role: fields.role.trim(),
      message: fields.message.trim(),
    };

    // Hand over to the visitor's email app. The form keeps their details in case it didn't open.
    const link = enquiryMailto(payload);
    setMailto(link);
    window.location.href = link;
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit}>

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
            className={`${inputClass} border-line-strong`}
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
            className={`${inputClass} border-line-strong`}
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
            className={`${inputClass} border-line-strong`}
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
            className={`${inputClass} border-line-strong`}
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
              className={`${inputClass} resize-y border-line-strong`}
            />
          </Field>
          <p id={id("message-hint")} className="mt-2 text-[0.82rem] text-fg-muted">
            {messagePrompts[type]}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-relaxed text-fg-soft">
          <input
            id={id("consent")}
            type="checkbox"
            checked={fields.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-1 h-4 w-4 shrink-0 accent-[#2d63e3]"
          />
          I agree that Ontographica may use these details to respond to my enquiry.
        </label>
        {errors.consent && (
          <p id={`${id("consent")}-error`} className="mt-2 flex items-start gap-1.5 text-[0.85rem] text-danger">
            <Icon name="warning" size={15} className="mt-0.5 shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      <div aria-live="polite" className="mt-6 empty:hidden">
        {errorCount > 0 && (
          <p className="text-[0.9rem] text-danger">
            Please correct {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} and try again.
          </p>
        )}
        {mailto && <OpenedMessage mailto={mailto} />}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[34ch] text-[0.82rem] text-fg-muted">
          All fields are required unless marked optional. Your email app opens with everything filled in.
        </p>
        <button type="submit" className={buttonClasses(typeTone[type].button, "sm:min-w-56")}>
          {type === "university" ? "Send partnership enquiry" : "Send enquiry"}
          <Arrow />
        </button>
      </div>
    </form>
  );
}
