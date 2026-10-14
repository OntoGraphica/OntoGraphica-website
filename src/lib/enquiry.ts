// Contact-form enquiries. Submission itself lives in ./forms (Google Sheets, with an email fallback).

import { fallbackMailto } from "./forms";

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

/** The row stored in the "Enquiries" sheet. Keys must match google-apps-script/Code.gs. */
export function enquiryRecord(payload: EnquiryPayload): Record<string, string> {
  return {
    type: enquiryTypeLabels[payload.type],
    name: payload.name,
    email: payload.email,
    organisation: payload.organisation,
    role: payload.role,
    message: payload.message,
  };
}

/** The same enquiry as a ready-written email, for when online submission isn't available. */
export function enquiryMailto(payload: EnquiryPayload): string {
  const organisationLabel = payload.type === "university" ? "Institution" : "Organisation";
  return fallbackMailto(`${subjects[payload.type]}: ${payload.organisation}`, [
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
  ]);
}
