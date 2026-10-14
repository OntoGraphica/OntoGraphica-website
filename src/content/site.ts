// Shared site content. Kept deliberately short: the product and the visuals do the talking.

export const company = {
  name: "Ontographica",
  tagline: "Knowledge, Engineered.",
  // Contact form enquiries open the visitor's email app addressed here.
  email: "founder@ontographica.com",
} as const;

export const routes = {
  home: "/",
  ontocampus: "/ontocampus",
  ontocandidate: "/ontocandidate",
  about: "/about",
  network: "/network",
  contact: "/contact",
  privacy: "/privacy",
} as const;

export type EnquiryRoute = "university" | "employer" | "general";

export const contactFor = (type: EnquiryRoute) => `${routes.contact}?type=${type}`;

/** One label and one destination per intent, used everywhere. */
export const cta = {
  partner: { label: "Partner with us", to: contactFor("university") },
  register: { label: "Register your interest", to: contactFor("employer") },
  contact: { label: "Contact", to: routes.contact },
} as const;

/** Contact is the header button, so it is not repeated as a nav link. */
export const navigation = [
  { label: "OntoCampus", to: routes.ontocampus },
  { label: "OntoCandidate", to: routes.ontocandidate },
  { label: "Network", to: routes.network },
  { label: "About", to: routes.about },
] as const;

export const products = {
  candidate: { status: "In development" },
} as const;

/** Cited figures from the OntoCampus leadership briefing. */
export const stats = {
  confidence: {
    graduates: 78,
    employers: 54,
    skill: "communication",
    source: "NACE Job Outlook 2025, US employers (n = 237)",
  },
  india: { value: 55, label: "of Indian graduates assessed employable in 2025", source: "India Skills Report 2025 (CII, Wheebox, AICTE)" },
  skills: { value: 39, label: "of workers’ core skills expected to change by 2030", source: "WEF Future of Jobs Report 2025" },
  upskilling: { value: 85, label: "of employers plan to prioritise upskilling", source: "WEF Future of Jobs Report 2025" },
};

export const principles = [
  { title: "Practice should reflect reality.", text: "Readiness comes from decisions, collaboration and consequences." },
  { title: "Capability should be observable.", text: "Show what people can do, not only what they claim to know." },
  { title: "Hiring should see the whole person.", text: "Qualifications matter. They are not the whole picture." },
  { title: "Technology should connect the journey.", text: "From learning, to practice, to opportunity." },
];

export const fictionalNote = "Product screens. Company, people and scores belong to a fictional simulation scenario.";
