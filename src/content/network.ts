// The practitioner network: professionals (many of them alumni) who bring real workplace
// experience into OntoCampus simulations, as facilitators, curators, or both.

export type Contribution = "facilitator" | "curator" | "both";

export const network = {
  title: "Bring the workplace",
  accent: "into the classroom.",
  lead: "A network of professionals and alumni who help students practise the real thing.",
  rolesTitle: "Two ways to take part.",
  roles: [
    {
      id: "facilitator",
      icon: "team",
      title: "Facilitator",
      text: "Step into live simulations as the client, the manager or the colleague, then lead the debrief.",
    },
    {
      id: "curator",
      icon: "book",
      title: "Curator",
      text: "Turn real work into scenarios: the brief that changed, the incident that hit, the call that had to be made.",
    },
  ],
  joinTitle: "Join the network.",
  joinLine: "Tell us about your experience. We’ll be in touch as the network grows.",
} as const;

export const contributionLabels: Record<Contribution, string> = {
  facilitator: "Facilitator",
  curator: "Curator",
  both: "Both",
};

export const experienceOptions = ["Under 3 years", "3 to 7 years", "8 to 15 years", "More than 15 years"];
