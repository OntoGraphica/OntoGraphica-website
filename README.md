# Ontographica website

Corporate website for Ontographica, OntoCampus and OntoCandidate.
React + TypeScript + Tailwind CSS v4, built with Vite.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then outputs static files to dist/
npm run preview    # serves dist/ locally
```

## Before launch: placeholders to replace

| What | Where |
| --- | --- |
| Company email (footer, fallback emails, response notifications) | `company.email` in `src/content/site.ts` |
| Privacy Policy text (have it legally reviewed; update its date when it changes) | `src/pages/Privacy.tsx` |
| Public site URL for canonical and Open Graph tags | `VITE_SITE_URL` in `.env` |
| Google Sheets endpoint for form responses | `VITE_FORMS_ENDPOINT` in `.env` (see below) |

## Form responses (Google Sheets)

Both forms, Contact (`/contact`) and the practitioner network (`/network`), save each response as a
row in one Google Sheet: enquiries on an "Enquiries" tab, network sign-ups on a "Network" tab. A
small Google Apps Script receives them (`google-apps-script/Code.gs`) and can also email each new
response to founder@ontographica.com (set `NOTIFY_EMAIL` to `""` in the script to turn that off).

One-time setup, from the Google account that should own the responses:

1. Create a Google Sheet, for example "Ontographica website responses".
2. In the Sheet, open **Extensions → Apps Script**. Replace the editor's contents with
   `google-apps-script/Code.gs` and save.
3. Click **Deploy → New deployment**, choose type **Web app**, set **Execute as: Me** and
   **Who has access: Anyone**, then **Deploy**. Approve the permissions Google asks for.
4. Copy the **Web app URL** (it ends in `/exec`) into `.env` as `VITE_FORMS_ENDPOINT=...`,
   then build and deploy the site.

The tabs and their header rows are created on the first submission. If you later edit the script,
use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

Until `VITE_FORMS_ENDPOINT` is set, or if a submission fails, the forms keep the visitor's details
and offer a ready-written email to founder@ontographica.com instead, so nothing is lost. A hidden
spam-trap field filters out most bots. Submission logic lives in `src/lib/forms.ts`.

## Pages

| Route | What it does |
| --- | --- |
| `/` | "Knowledge, Engineered." hero, how the world of work is moving, an OntoCampus showcase, an OntoCandidate teaser |
| `/ontocampus` | The product: hero, the orbit, inside the simulation, faculty view, the professions ring, and the Founding University invitation |
| `/ontocandidate` | Hire for capability: benefits for employers, the competency profile, the path from practice to discovery |
| `/network` | Practitioner network: facilitators and curators who bring workplace experience into simulations, with a sign-up form |
| `/about` | Why Ontographica exists, the graduate confidence gap, what we believe, and a hand-off to both platforms |
| `/contact` | Enquiry form. `?type=university\|employer\|general` preselects the type |
| `/privacy` | Privacy Policy, written to match what the site does (`src/pages/Privacy.tsx`). `/terms` redirects home |

`/vision` redirects to `/about` and `/founding-universities` to `/ontocampus#founding`, so older links keep working.

## Editing content

Copy lives in `src/content/` (`site.ts`, `campus.ts`, `candidate.ts`). Keep it short:
see the rules in `DESIGN.md`.

## Design

`DESIGN.md` describes the system: the dark-only tokens, the signature visuals and the copy rules.
Tokens live in `src/styles/index.css` under `@theme`.

## Media

`npm run media` converts the dark-mode screenshots in `../Ontographica Media/OntoCampus inapp Screenshots/dark`
to WebP in `public/media/dark/`. Screens that expose local URLs, model providers or reference
solutions are deliberately excluded.

## Hosting

The site is hosted on GitHub Pages at https://ontographica.com. This repository holds two sites:

- **new**: this Vite + React site at the repository root.
- **old**: the previous static site, kept in `old-site/` exactly as it was.

**Switching between them:** on GitHub, open **Actions**, then **Publish site** in the left column,
then **Run workflow**. Choose **new** or **old** and press **Run workflow**. The live site changes
within a few minutes. Your choice is saved in `live-site.txt`, so later pushes to `main` keep
publishing whichever site you picked. Editing that file to `new` or `old` and pushing does the
same thing.

The workflow (`.github/workflows/static.yml`) builds the new site with `npm ci && npm run build`,
or uploads `old-site/` as-is. The build also writes `dist/404.html` so deep links such as `/about`
load the app. Addresses from the old site (`/contact.html`, `/services.html`, `/ontocanvas.html`)
redirect to their nearest page when the new site is live.
