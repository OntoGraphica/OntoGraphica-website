// OntoCampus content: short labels, real screens.

export type Screen = { id: string; tab: string; line: string; image: string; alt: string };

export const orbit = [
  { title: "Prepare", line: "Meet the team, the role, the brief." },
  { title: "Enter", line: "Step into a working company." },
  { title: "Decide", line: "Choose, with incomplete information." },
  { title: "Act", line: "Plan, build, test, ship." },
  { title: "Consequence", line: "Earlier choices come back." },
  { title: "Reflect", line: "See how you worked, and why." },
  { title: "Re-apply", line: "Carry it into the next challenge." },
];

export const insideScreens: Screen[] = [
  {
    id: "workspace",
    tab: "Workspace",
    line: "Mail, chat, board and colleagues. Requirements arrive through people.",
    image: "dark/student-workspace",
    alt: "Simulated company desktop: a mail inbox with client and incident messages beside the team sprint board.",
  },
  {
    id: "team",
    tab: "Team",
    line: "Calendars, meetings and days out of office. Coordination is part of the job.",
    image: "dark/student-chat",
    alt: "Team chat beside a shared calendar showing colleagues in meetings or out of office.",
  },
  {
    id: "plan",
    tab: "Plan",
    line: "Problem, criteria, risks. Pitched for approval before a line is built.",
    image: "dark/student-plan",
    alt: "Team plan with problem statement, acceptance criteria and open questions.",
  },
  {
    id: "product",
    tab: "Product",
    line: "Real work, running in the client’s own product.",
    image: "dark/student-product",
    alt: "The simulated client product with a statement import dialog.",
  },
];

export const controlScreens: Screen[] = [
  {
    id: "pathway",
    tab: "Live pathway",
    line: "Every team, every milestone, in real time.",
    image: "dark/facilitator-pathway",
    alt: "Live pathway tracking each team's milestones with alerts.",
  },
  {
    id: "analysis",
    tab: "Individual",
    line: "One student at a time, with faculty adding their own observations.",
    image: "dark/analysis-overview",
    alt: "Individual analysis: one student's activity counts beside a field for faculty observations.",
  },
  {
    id: "events",
    tab: "Events",
    line: "Incidents, change requests and client pressure, on cue.",
    image: "dark/facilitator-events",
    alt: "Event triggers that can be sent to chosen teams.",
  },
  {
    id: "audit",
    tab: "Audit",
    line: "Every meaningful action, with who, when and where.",
    image: "dark/facilitator-audit",
    alt: "Audit log of actions across the cohort.",
  },
];

export type Profession = { name: string; field: string; line: string; live?: boolean };

/** Software engineering runs today; the rest are planned paths, scope subject to change. */
export const professions: Profession[] = [
  { name: "Software Engineering", field: "Engineering", line: "Ship a feature for a client, under real constraints.", live: true },
  { name: "Mechanical Engineering", field: "Engineering", line: "Take a design from review to production, trade-offs included." },
  { name: "Data Analytics", field: "Data", line: "Turn messy data into a decision someone has to defend." },
  { name: "Product Management", field: "Business", line: "Decide what ships, and what waits." },
  { name: "Cyber Security", field: "Technology", line: "Contain an incident while the business keeps running." },
  { name: "Civil Engineering", field: "Engineering", line: "Plan a site where budget, safety and schedule collide." },
  { name: "Finance", field: "Business", line: "Build a forecast leadership will act on." },
  { name: "UX Design", field: "Design", line: "Research, prototype and defend a design to a client." },
  { name: "Electrical Engineering", field: "Engineering", line: "Fix a system that has to work first time, in the field." },
  { name: "Marketing", field: "Business", line: "Launch with a fixed budget and a moving target." },
  { name: "AI / ML", field: "Technology", line: "Build a model a client can trust, and explain it." },
  { name: "Business Analysis", field: "Business", line: "Pin down what stakeholders actually need." },
];

/** The single action at the end of the OntoCampus page. */
export const founding = {
  title: "Become a",
  accent: "Founding University.",
  line: "Facilitated end to end by OntoCampus. No university staff needed to run it.",
};
