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
| Company email (footer, and where enquiries are addressed) | `company.email` in `src/content/site.ts` |
| Privacy Policy and Terms (currently placeholder notices) | `src/pages/LegalPlaceholder.tsx`, routes in `src/App.tsx` |
| Public site URL for canonical and Open Graph tags | `VITE_SITE_URL` in `.env` |

## Enquiry form

The site is static, so the form doesn't send mail itself. After validating, it opens the
visitor's own email app with a message to `company.email` (founder@ontographica.com) already
written: a subject naming the enquiry type and organisation, their message, and their details.
They press send from their mailbox. The logic lives in `src/lib/enquiry.ts`.

## Pages

| Route | What it does |
| --- | --- |
| `/` | "Knowledge, Engineered." hero, how the world of work is moving, an OntoCampus showcase, an OntoCandidate teaser |
| `/ontocampus` | The product: hero, the orbit, inside the simulation, faculty view, the professions ring, and the Founding University invitation |
| `/ontocandidate` | Hire for capability: benefits for employers, the competency profile, the path from practice to discovery |
| `/about` | Why Ontographica exists, the graduate confidence gap, what we believe, and a hand-off to both platforms |
| `/contact` | Enquiry form. `?type=university\|employer\|general` preselects the type |
| `/privacy`, `/terms` | Placeholders until approved legal text exists |

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

The site is hosted on GitHub Pages at https://ontographica.com.

- Every push to `main` runs `.github/workflows/static.yml`: `npm ci`, `npm run build`, then
  publishes `dist/` to Pages. The custom domain lives in the repository's Settings > Pages.
- The build also writes `dist/404.html` (a copy of `index.html`), so deep links such as `/about`
  load the app instead of GitHub's error page.
- Addresses from the previous site (`/contact.html`, `/services.html`, `/ontocanvas.html`) redirect
  to their nearest new page.
