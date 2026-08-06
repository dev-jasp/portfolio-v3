import type { NavLink, SocialLink } from "@/types";

/**
 * Single source of truth for identity and outbound links.
 *
 * TODO: the socials, scheduling and archive URLs are still the design's
 * placeholders — swap them for the real destinations before deploying.
 */
export const site = {
  name: "Jaspher Gargar",
  role: "Fullstack Developer",
  email: "hello@example.com",
  /** Where "Schedule a Call" points. */
  scheduleUrl: "#contact",
  /** Where "View Archive." points. */
  archiveUrl: "#work",
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
  { label: "Home", href: "#top" },
  { label: "Tech Stack", href: "#stack" },
  { label: "Selected Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

/** The footer repeats the nav minus Contact — the CTA above it already covers that. */
export const footerLinks: NavLink[] = navLinks.filter(
  (link) => link.href !== "#contact",
);
