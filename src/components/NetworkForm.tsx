import { useId, useRef, useState, type FormEvent } from "react";
import { professions } from "../content/campus";
import { contributionLabels, experienceOptions, type Contribution } from "../content/network";
import { fallbackMailto, submitForm, type SubmitResult } from "../lib/forms";
import { Consent, ErrorText, Field, SpamTrap, SubmitMessage, emailPattern, inputClass } from "./form/FormParts";
import { Arrow, buttonClasses } from "./ui/Button";

type Fields = {
  contribution: Contribution | "";
  name: string;
  email: string;
  role: string;
  company: string;
  field: string;
  experience: string;
  linkedin: string;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof Fields, string>>;

const emptyFields: Fields = {
  contribution: "",
  name: "",
  email: "",
  role: "",
  company: "",
  field: "",
  experience: "",
  linkedin: "",
  message: "",
  consent: false,
};

const fieldOptions = [...professions.map((profession) => profession.name), "Other"];

function validate(fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.contribution) errors.contribution = "Please choose how you’d like to take part.";
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  if (!fields.email.trim()) errors.email = "Please enter your email address.";
  else if (!emailPattern.test(fields.email.trim())) errors.email = "Please enter a valid email address, like name@company.com.";
  if (!fields.role.trim()) errors.role = "Please enter your current or most recent role.";
  if (!fields.company.trim()) errors.company = "Please enter your organisation.";
  if (!fields.field) errors.field = "Please choose your field.";
  if (!fields.experience) errors.experience = "Please choose your years of experience.";
  if (fields.message.trim().length < 20) errors.message = "Please add a few lines (at least 20 characters).";
  if (!fields.consent) errors.consent = "Please confirm we may keep these details to contact you about the network.";
  return errors;
}

const selectClass = `${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%237b8494' stroke-width='1.5'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`;

export function NetworkForm() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [trap, setTrap] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    if (result) setResult(null);
  };

  const describedBy = (key: keyof Fields) => (errors[key] ? `${id(key)}-error` : undefined);

  const contribution = fields.contribution ? contributionLabels[fields.contribution] : "";
  // The row stored in the "Network" sheet. Keys must match google-apps-script/Code.gs.
  const record = {
    contribution,
    name: fields.name.trim(),
    email: fields.email.trim(),
    role: fields.role.trim(),
    company: fields.company.trim(),
    field: fields.field,
    experience: fields.experience,
    linkedin: fields.linkedin.trim(),
    message: fields.message.trim(),
  };

  const mailto = fallbackMailto(`Practitioner network: ${record.name}`, [
    "Hello Ontographica,",
    "",
    record.message,
    "",
    "---",
    `Taking part as: ${record.contribution}`,
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    `Role: ${record.role}, ${record.company}`,
    `Field: ${record.field}`,
    `Experience: ${record.experience}`,
    record.linkedin ? `LinkedIn: ${record.linkedin}` : null,
  ]);

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
    const outcome = await submitForm("network", { ...record, website: trap });
    setSubmitting(false);
    setResult(outcome);
  };

  if (result?.status === "sent") {
    return (
      <SubmitMessage
        result={result}
        mailto={mailto}
        sentTitle="Thank you. You’re on the list."
        sentText={`We’ll be in touch at ${record.email} as the network takes shape.`}
      />
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative">
      <SpamTrap value={trap} onChange={setTrap} />

      <fieldset aria-describedby={errors.contribution ? `${id("contribution")}-error` : undefined}>
        <legend className="text-[0.9rem] font-medium text-fg">I’d like to take part as</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(Object.keys(contributionLabels) as Contribution[]).map((option, index) => {
            const checked = fields.contribution === option;
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-control border px-4 py-3 text-[0.9rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-soft ${
                  checked ? "border-brand bg-brand-wash text-fg" : "border-line-strong bg-raised text-fg-soft hover:border-fg-muted hover:text-fg"
                }`}
              >
                <input
                  id={index === 0 ? id("contribution") : undefined}
                  type="radio"
                  name="contribution"
                  value={option}
                  checked={checked}
                  onChange={() => update("contribution", option)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${checked ? "border-brand" : "border-fg-muted"}`}
                >
                  {checked && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
                </span>
                {contributionLabels[option]}
              </label>
            );
          })}
        </div>
        {errors.contribution && <ErrorText id={`${id("contribution")}-error`}>{errors.contribution}</ErrorText>}
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field id={id("name")} label="Full name" error={errors.name}>
          <input
            id={id("name")}
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass}
          />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email}>
          <input
            id={id("email")}
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
        <Field id={id("role")} label="Current or most recent role" error={errors.role}>
          <input
            id={id("role")}
            type="text"
            autoComplete="organization-title"
            value={fields.role}
            onChange={(event) => update("role", event.target.value)}
            placeholder="e.g. Engineering Manager"
            aria-invalid={Boolean(errors.role)}
            aria-describedby={describedBy("role")}
            className={inputClass}
          />
        </Field>
        <Field id={id("company")} label="Organisation" error={errors.company}>
          <input
            id={id("company")}
            type="text"
            autoComplete="organization"
            value={fields.company}
            onChange={(event) => update("company", event.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
            className={inputClass}
          />
        </Field>
        <Field id={id("field")} label="Field" error={errors.field}>
          <select
            id={id("field")}
            value={fields.field}
            onChange={(event) => update("field", event.target.value)}
            aria-invalid={Boolean(errors.field)}
            aria-describedby={describedBy("field")}
            className={selectClass}
          >
            <option value="" disabled>
              Choose your field
            </option>
            {fieldOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("experience")} label="Years of experience" error={errors.experience}>
          <select
            id={id("experience")}
            value={fields.experience}
            onChange={(event) => update("experience", event.target.value)}
            aria-invalid={Boolean(errors.experience)}
            aria-describedby={describedBy("experience")}
            className={selectClass}
          >
            <option value="" disabled>
              Choose a range
            </option>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field id={id("linkedin")} label="LinkedIn profile" optional>
            <input
              id={id("linkedin")}
              type="url"
              inputMode="url"
              value={fields.linkedin}
              onChange={(event) => update("linkedin", event.target.value)}
              placeholder="https://www.linkedin.com/in/your-name"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id={id("message")} label="What would you bring?" error={errors.message}>
            <textarea
              id={id("message")}
              rows={5}
              value={fields.message}
              onChange={(event) => update("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={[describedBy("message"), id("message-hint")].filter(Boolean).join(" ")}
              className={`${inputClass} resize-y`}
            />
          </Field>
          <p id={id("message-hint")} className="mt-2 text-[0.82rem] text-fg-muted">
            The kind of work you’ve done, a situation students should face, or how much time you could give.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Consent
          id={id("consent")}
          checked={fields.consent}
          onChange={(checked) => update("consent", checked)}
          error={errors.consent}
          purpose="to contact me about the network"
        />
      </div>

      <div aria-live="polite" className="mt-6 empty:hidden">
        {errorCount > 0 && (
          <p className="text-[0.9rem] text-danger">
            Please correct {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} and try again.
          </p>
        )}
        {result && <SubmitMessage result={result} mailto={mailto} sentTitle="" sentText="" />}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.82rem] text-fg-muted">All fields are required unless marked optional.</p>
        <button type="submit" disabled={submitting} className={buttonClasses("brand", "sm:min-w-56")}>
          {submitting ? "Sending…" : "Join the network"}
          {!submitting && <Arrow />}
        </button>
      </div>
    </form>
  );
}
