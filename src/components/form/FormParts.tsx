import type { ReactNode } from "react";
import { Link } from "react-router";
import { company, routes } from "../../content/site";
import type { SubmitResult } from "../../lib/forms";
import { Icon } from "../ui/Icon";

// Shared building blocks for the site's forms: fields, consent, spam trap and result messages.

export const inputClass =
  "mt-2 block w-full rounded-control border border-line-strong bg-raised px-4 py-3 text-[1rem] text-fg placeholder:text-fg-muted/80 transition-colors focus:border-accent-bright focus:outline-2 focus:outline-offset-0 focus:outline-accent-bright aria-[invalid=true]:border-danger";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[0.85rem] text-danger">
      <Icon name="warning" size={15} className="mt-0.5 shrink-0" />
      {children}
    </p>
  );
}

export function Field({
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
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

export function Consent({
  id,
  checked,
  onChange,
  error,
  purpose,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  purpose: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-relaxed text-fg-soft">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 shrink-0 accent-[#2d63e3]"
        />
        <span>
          I agree that Ontographica may store and use these details {purpose}, as described in the{" "}
          <Link to={routes.privacy} className="font-medium text-fg underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

/** A field people never see or fill in. Bots usually do; the Sheet script discards those rows. */
export function SpamTrap({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}

const linkClass = "font-medium text-fg underline underline-offset-4";

/** Feedback after submitting. `mailto` is a ready-written email used whenever saving online isn't possible. */
export function SubmitMessage({ result, mailto, sentTitle, sentText }: { result: SubmitResult; mailto: string; sentTitle: string; sentText: ReactNode }) {
  if (result.status === "sent") {
    return (
      <div className="rounded-card border border-success/40 bg-success/10 p-6" role="status">
        <p className="flex items-center gap-2 font-medium text-success">
          <Icon name="checkCircle" size={18} /> {sentTitle}
        </p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-soft">{sentText}</p>
      </div>
    );
  }

  const notConfigured = result.status === "not-configured";
  return (
    <div className={`rounded-card border p-5 ${notConfigured ? "border-line-strong bg-raised" : "border-danger/40 bg-danger/10"}`} role="alert">
      <p className={`flex items-center gap-2 font-medium ${notConfigured ? "text-fg" : "text-danger"}`}>
        <Icon name={notConfigured ? "info" : "warning"} size={18} />
        {notConfigured ? "Online submissions aren’t switched on yet." : "Your details weren’t sent."}
      </p>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-soft">
        {result.status === "error" && `${result.message} `}
        Your details are still in the form.{" "}
        <a className={linkClass} href={mailto}>
          Send them by email instead
        </a>
        , or write to{" "}
        <a className={linkClass} href={`mailto:${company.email}`}>
          {company.email}
        </a>
        .
      </p>
    </div>
  );
}
