---
name: Ontographica
version: 3
description: >
  Dark, cinematic and quiet. The product and the visuals carry the story, with very little text.
  Informed by kog.ai (light beams, interactive diagrams, terse headlines) and velmax.llc
  (a halftone dot-matrix mark that reacts to the cursor, mono annotations), and the OntoCampus
  leadership deck (navy glow, big blue numbers). Slogan: "Knowledge, Engineered."

colors:
  bg: "#05070B"            # blue-black canvas
  surface: "#090C12"
  raised: "#0E121A"        # panels and inputs
  fg: "#EEF1F6"
  fg-soft: "#A6AEBC"
  fg-muted: "#7B8494"
  line: "rgba(255,255,255,.07)"
  # Three colours, one per brand. Home uses all three; product pages stay in their own colour.
  brand: "#F5253B"         # Ontographica red: the slogan, the Home spiral, company-level moments
  brand-soft: "#FF6B77"    # red text on dark
  accent: "#2F66EA"        # OntoCampus blue; buttons (white text, AA)
  accent-bright: "#4A7BF7" # graphics, glows (the OntoCampus spiral blue)
  accent-soft: "#8FB3FF"   # accent text on dark
  candidate: "#E8B342"     # OntoCandidate yellow, only for OntoCandidate
  candidate-soft: "#F2CD78"

type:
  family: Geist (display and body), Geist Mono (tags, figures, captions)
  display: "clamp(2.9rem, 6rem), weight 500, tracking -0.045em, leading 0.98"
  headline: "clamp(2.2rem, 4.25rem), weight 500, tracking -0.04em"
  emphasis: second clause in fg-muted or accent-soft, never a second typeface

shape: { chip: 6px, control: 10px, card: 18px }
---

## Signatures

1. **The dot spiral** (`DotSpiral`): the Ontographica mark as a halftone field. It draws itself in,
   pulses travel along it, and it lights up under the cursor. Palettes live in `palettes.ts`: red
   with blue and yellow pulses on Home (the company powering both products), white with blue for
   OntoCampus, yellow for OntoCandidate. It pauses off-screen and is static for reduced motion.
2. **Light beams** (`.beam`): a thin vertical light falling into a product section.
3. **Real screens on a blue glow** (`.screen-glow`, `.tilt-frame`): screens settle from a tilt as
   they scroll in.
4. **The orbit** (`Orbit`): the rhythm of real work as seven moves on a ring that advances on its own.
5. **Big numbers**: cited figures count up once and carry their source in mono.
6. **The bridge** (`.bridge`): OntoCampus blue flowing into OntoCandidate yellow.
7. **The shelf** (`ProfessionRing`): professions as halftone cards on a slowly turning 3D ring around
   the OntoCampus spiral. Drag, arrows and a pause button; still for reduced motion and off-screen.

## Rules

- **Dark only.** Depth comes from glow and light, not from surface colour changes.
- **Text stays light.** A headline of 8 words or fewer, one supporting line of 20 words or fewer,
  one action. If a section needs a paragraph, show a screen instead.
- **One filled button per view.** The secondary action is an arrow text link.
- **One label per intent:** "Partner with us" (universities) and "Register your interest" (employers).
- **Eyebrows are rationed:** at most one per three sections, never on adjacent sections. Section
  headers stack (headline, then one line); no headline-left, paragraph-right splits.
- **Real screens only.** No mock product UI built from divs; OntoCandidate is shown through the real
  OntoCampus competency profile it builds on, captioned as such.
- **Shape scale:** chip 6px, control 10px (buttons, icon buttons, tabs), card 18px. Nothing else.
- **Icons are Phosphor**, light at 24px and up, bold at 16px, so strokes read the same weight.
- **Say it once.** A screenshot, line or statistic lives on one page only. Each page links to a
  destination at most once; the header Contact button is the site-wide way in, and each product
  page has a single conversion point at its end (OntoCampus: partner; OntoCandidate: register interest).
- **Flow:** every page reads top to bottom and ends by pointing somewhere. Home tells the story
  (brand, problem, practice, opportunity, act) and hands off to each product where it is introduced.
  Product pages run hero, how it works, evidence, one action. About ends by handing off to both products.
- **No programme structure in the copy.** Durations, team sizes and cohort numbers stay out of the
  pages, and so does pricing. Describe the experience, not the timetable.
- **Honesty:** every statistic shows its source, product screens are captioned as a fictional
  scenario, and OntoCandidate is always marked "in development".
- **Motion has a reason and respects `prefers-reduced-motion`.**
