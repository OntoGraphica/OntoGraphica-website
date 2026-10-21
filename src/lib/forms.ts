// Form submissions: the single integration point for every form on the site.
//
// Responses go to a Google Sheet through a Google Apps Script web app (see
// google-apps-script/Code.gs and the README for setup). Set its URL as VITE_FORMS_ENDPOINT in .env.
//
// The body is sent as text/plain so the browser makes a "simple" request with no CORS preflight,
// which Apps Script web apps cannot answer. The script still parses it as JSON.
//
// If the endpoint isn't set yet, or a submission fails, the form offers a ready-written email to
// the company address instead, so no enquiry is lost.

import { company } from "../content/site";

export type FormName = "enquiry" | "network";

export type SubmitResult = { status: "sent" } | { status: "not-configured" } | { status: "error"; message: string };

const endpoint = import.meta.env.VITE_FORMS_ENDPOINT?.trim() ?? "";

export const isFormsConfigured = endpoint.length > 0;

export async function submitForm(form: FormName, record: Record<string, string>): Promise<SubmitResult> {
  if (!isFormsConfigured) return { status: "not-configured" };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ form, page: window.location.href, ...record }),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    if (!response.ok || !result?.ok) {
      return { status: "error", message: "Your details couldn’t be saved just now." };
    }
    return { status: "sent" };
  } catch {
    return { status: "error", message: "We couldn’t reach our server. Please check your connection." };
  }
}

/** A `mailto:` link to the company address, used as the fallback when online submission isn't available. */
export function fallbackMailto(subject: string, lines: (string | null)[]): string {
  const body = lines.filter((line) => line !== null).join("\r\n");
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
