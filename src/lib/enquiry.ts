// Enquiry handling: the single integration point for the contact form.
//
// The site is static (GitHub Pages), so there is no server to send mail. Instead, a valid
// enquiry opens the visitor's own email app with a message to the company address already
// written: subject, details and their message. They press send from their own mailbox.
// Nothing leaves the browser until they do, and no third-party service is involved.

import { company } from "../content/site";

export type EnquiryType = "university" | "employer" | "general";

export type EnquiryPayload = {
  type: EnquiryType;
  name: string;
  email: string;
  organisation: string;
  role: string;
  message: string;
};

export const enquiryTypeLabels: Record<EnquiryType, string> = {
  university: "University partnership (OntoCampus)",
  employer: "Employer interest (OntoCandidate)",
  general: "General enquiry",
};

const subjects: Record<EnquiryType, string> = {
  university: "University partnership",
  employer: "Employer interest in OntoCandidate",
  general: "Enquiry",
};

/** A `mailto:` link to the company address with the enquiry filled in. */
export function enquiryMailto(payload: EnquiryPayload): string {
  const organisationLabel = payload.type === "university" ? "Institution" : "Organisation";
  const subject = `${subjects[payload.type]}: ${payload.organisation}`;
  const body = [
    "Hello Ontographica,",
    "",
    payload.message,
    "",
    "---",
    `Enquiry: ${enquiryTypeLabels[payload.type]}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `${organisationLabel}: ${payload.organisation}`,
    payload.role ? `Role: ${payload.role}` : null,
  ]
    .filter((line) => line !== null)
    .join("\r\n");

  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
