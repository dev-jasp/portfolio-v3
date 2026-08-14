import { site } from "@/lib/constants";
import type { Project, SpecItem, StackCategory } from "@/types";

/**
 * Order matters — each category is a panel of the About reel, in this order,
 * with an accent rule dividing it from the one before.
 */
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
    demoUrl: "https://qc-pulse.vercel.app/",
    repoUrl: "https://github.com/dev-jasp/lab-qc-dashboard",
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

/** The About reel's opening statement, split into the lines it reveals on. */
export const aboutIntroLines = [
  "I'm a fullstack developer focused on building React",
  "applications with thoughtful design, clean",
  "implementation, and user experience at the core.",
];

/**
 * The About reel's profile panel — the facts a visitor scans for before they
 * read anything. Read as data, set in Space Mono, one pair per row.
 *
 * TODO: only `Role` is sourced from `site`. `Focus`, `Based` and `Status` are
 * proposals — swap them for the real ones, or drop a row, before deploying.
 */
export const aboutSpecs: SpecItem[] = [
  { label: "Role", value: site.role },
  { label: "Focus", value: "React product interfaces" },
  { label: "Based", value: "Philippines — working remote" },
  { label: "Status", value: "Open to new projects" },
];

/**
 * The last panel of the reel. It exists so the horizontal ride ends somewhere
 * rather than simply running out — the line hands off to the work, and the
 * button is the only focusable thing inside the track.
 *
 * The label names a page, not a place on this one. It used to point at the
 * work section directly below, which is a button that does what scrolling was
 * about to do anyway; it goes to the case study instead, which is the only
 * destination here that pays for the click.
 *
 * TODO: a proposal, not settled copy — the same standing as `collabPitch`.
 */
export const aboutOutro = {
  line: "That's the toolkit. Here's what it has built.",
  ctaLabel: "Read the case study",
} as const;

/**
 * The hero's opening statement, broken where the design breaks it — three
 * spans, not three sentences. Sentence case at the source; the section sets it
 * uppercase, the same bargain `aboutIntroLines` makes.
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
