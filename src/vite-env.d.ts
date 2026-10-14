/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script web app URL that stores form responses in Google Sheets. */
  readonly VITE_FORMS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
