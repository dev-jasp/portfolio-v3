import type { ComponentType, ReactNode, SVGProps } from "react";
import type { SocialPlatform } from "@/types";

type GlyphProps = SVGProps<SVGSVGElement> & {
  size?: number;
  children: ReactNode;
};

/**
 * Shared frame for every icon in the system: one 24-unit box, stroked in
 * `currentColor` so an icon inherits whatever tone its container is on.
 */
function Glyph({ size = 21, strokeWidth = 1.6, children, ...props }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

type IconProps = Omit<GlyphProps, "children">;

/**
 * The CTA arrow.
 *
 * `size` is load-bearing beyond appearance: `ArrowButton` opens its collapsed
 * slot to exactly this width, so the two have to agree.
 */
export function ArrowIcon({ size = 19, ...props }: IconProps) {
  return (
    <Glyph size={size} strokeWidth={1.8} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Glyph>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M4.6 9.6v8.8M4.6 5.7v.1" />
      <path d="M9.6 18.4V9.6" />
      <path d="M9.6 13.3a3.7 3.7 0 0 1 7.4 0v5.1" />
    </Glyph>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <path d="M16.9 7.1v.1" />
    </Glyph>
  );
}

/** Drawn rather than the © character, so it takes the same stroke as its row. */
export function CopyrightIcon({ size = 16, ...props }: IconProps) {
  return (
    <Glyph size={size} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M15.2 9.3a4 4 0 1 0 0 5.4" />
    </Glyph>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M9 18.7c-3.6 1.1-3.6-1.9-5-2.3m10 4.1v-3.1c0-.9.1-1.3-.4-1.8 2.2-.3 4.2-1.1 4.2-4.7a3.6 3.6 0 0 0-1-2.6 3.4 3.4 0 0 0-.1-2.5s-1.1-.3-3.5 1.3a8.6 8.6 0 0 0-4.5 0C6.3 5.5 5.2 5.8 5.2 5.8a3.4 3.4 0 0 0-.1 2.5 3.6 3.6 0 0 0-1 2.6c0 3.6 2 4.4 4.2 4.7-.5.5-.5.9-.4 1.8v3.1" />
    </Glyph>
  );
}

/**
 * Keyed by the platform union rather than looked up loosely, so adding a
 * platform to `SocialPlatform` fails the build until its icon exists.
 *
 * Lives here rather than beside either consumer: both `IconCircle` and
 * `AvatarSocials` draw the same three glyphs, and two copies of the map would
 * let one of them fall a platform behind without anything failing.
 */
export const socialIcons: Record<SocialPlatform, ComponentType<IconProps>> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  github: GitHubIcon,
};
