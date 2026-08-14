import type { NavLink, SocialLink } from "@/types";

/**
 * Single source of truth for identity and outbound links.
 *
 * Every in-page destination is written root-relative (`/#work`, not `#work`).
 * The home page is no longer the only page: a bare `#work` resolves against
 * whatever route it is rendered on, so from a case study it points at nothing.
 * `useSmoothScroll` still routes these through Lenis while you are on `/`.
 *
 * TODO: the socials, scheduling and archive URLs are still the design's
 * placeholders — swap them for the real destinations before deploying.
 */
export const site = {
  name: "Jaspher Gargar",
  role: "Fullstack Developer",
  email: "hello@example.com",
  /** Where "Schedule a Call" points. */
  scheduleUrl: "/#contact",
  /** Where "View Archive." points. */
  archiveUrl: "/#work",
  description:
    "Fullstack developer building React applications with thoughtful design, clean implementation, and user experience at the core.",
} as const;

export const socials: SocialLink[] = [
  { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/dev-jasp/" },
  { platform: "instagram", label: "Instagram", href: "https://instagram.com" },
  { platform: "github", label: "GitHub", href: "https://github.com/dev-jasp" },
];

/** Full nav, used by the menu panel. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Selected Work", href: "/#work" },
  { label: "Collab", href: "/#contact" },
];

/** The footer repeats the nav minus Collab — the CTA above it already covers that. */
export const footerLinks: NavLink[] = navLinks.filter(
  (link) => link.href !== "/#contact",
);

/**
 * The hero's inline nav. Deliberately not a slice of `navLinks`: it is three of
 * those four destinations under shorter labels, because it is read at a glance
 * across the top of the page rather than down an open panel. Collab is left to
 * the menu — the hero already ends in a call to action.
 */
export const heroNavLinks: NavLink[] = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
];
