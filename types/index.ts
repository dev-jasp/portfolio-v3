export type NavLink = {
  label: string;
  href: string;
};

export type SocialPlatform = "linkedin" | "instagram" | "github";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

/** One row of the About reel's profile panel: a mono label over its value. */
export type SpecItem = {
  label: string;
  value: string;
};

export type StackCategory = {
  /** Rendered uppercase in Space Mono. Keep it one word where possible. */
  label: string;
  items: string[];
};

export type Project = {
  id: string;
  /** Stamped over the media, bottom-left, in tracked-out Space Mono. */
  name: string;
  description: string;
  stack: string[];
  year?: string;
  /** Path under `public/`. Omit to render the empty slot placeholder. */
  image?: string;
  /** Shown inside the empty slot. */
  imagePlaceholder?: string;
  /** Where "View case study" points. Falls back to the work section. */
  href?: string;
  /** The running app. External — the case study hero's primary button. */
  demoUrl?: string;
  /** The source. External — the quiet link beside that button. */
  repoUrl?: string;
};
