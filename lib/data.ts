import type { Project, StackCategory } from "@/types";

/** Order matters — rows render top to bottom with dividers between them. */
export const stack: StackCategory[] = [
  {
    label: "Language",
    items: ["Javascript", "Typescript"],
  },
  {
    label: "Frontend",
    items: ["React", "NextJs", "TailwindCSS", "Shadcn", "Motion", "GSAP"],
  },
  {
    label: "Backend",
    items: ["NodeJs", "ExpressJs", "PostgreSQL", "Supabase", "NextAuth"],
  },
  {
    label: "Tools",
    items: ["Git", "VsCode", "Vercel", "Netlify"],
  },
];

/** The count badge on the "Selected Work" heading reads from this array's length. */
export const projects: Project[] = [
  {
    id: "qc-pulse",
    name: "QC Pulse",
    description:
      "Quality control monitoring for a Vaccine Preventable Disease Referral Laboratory. Plots control runs on Levey-Jennings charts, evaluates them against Westgard multi-rules, and exports on institutional letterhead. Replaced a manual spreadsheet workflow.",
    stack: ["React", "Typescript", "TailwindCSS", "ChartJS", "Supabase"],
    image: "/images/thumbnail/qc-pulse_thumbnail.png",
    // Cards with no `href` render no button at all.
    href: "/work/qc-pulse",
  },
  {
    id: "project-two",
    name: "Project Two",
    description:
      "Placeholder slot — swap in the project name, one-line description, stack and year.",
    stack: [],
    imagePlaceholder: "Drop a screenshot",
  },
  {
    id: "project-three",
    name: "Project Three",
    description:
      "Placeholder slot — swap in the project name, one-line description, stack and year.",
    stack: [],
    imagePlaceholder: "Drop a screenshot",
  },
];

/** Tech stack intro, split into the lines it reveals on. */
export const stackIntroLines = [
  "I'm a fullstack developer focused on building React",
  "applications with thoughtful design, clean",
  "implementation, and user experience at the core.",
];

/**
 * The hero's opening statement, broken where the design breaks it — three
 * spans, not three sentences. Sentence case at the source; the section sets it
 * uppercase, the same bargain `stackIntroLines` makes.
 */
export const heroIntroLines = [
  "Fullstack developer who",
  "build tools people",
  "actually have to use",
];

/**
 * The line the Collaborate aperture uncovers, above its button.
 *
 * TODO: a proposal, not settled copy — swap it for whatever the invitation
 * should actually say.
 */
export const collabPitch = "Have a project in mind?";

/**
 * The Collaborate heading, split around the aperture that opens between the two
 * halves. Read as one sentence by anything listening — see the section.
 */
export const collabHeadingParts = ["Collaborate", "with Me"] as const;

/**
 * The hero's process track. Rendered in order with a connector rule between
 * each pair, so adding a stage adds a segment — order is the whole meaning.
 */
export const heroProcess = ["Concept", "Motion", "Code"];
