import type { ComponentType, SVGProps } from "react";
import type { SocialLink, SocialPlatform } from "@/types";
import { GitHubIcon, InstagramIcon, LinkedInIcon } from "./Icons";

/**
 * Keyed by the platform union rather than looked up loosely, so adding a
 * platform to `SocialPlatform` fails the build until its icon exists.
 */
const icons: Record<
  SocialPlatform,
  ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  github: GitHubIcon,
};

type Props = SocialLink & {
  /** 52 in the menu, 62 in the footer. */
  size?: number;
  iconSize?: number;
  /** The footer's circles also rise on hover; the menu's only invert. */
  lift?: boolean;
};

/**
 * Outlined circle that inverts to solid ink on hover.
 *
 * The visual treatment lives in `.icon-circle` in `globals.css` — it needs the
 * hover state and the tone transition, which utilities at the usage site would
 * only scatter.
 */
export function IconCircle({
  platform,
  label,
  href,
  size = 52,
  iconSize = 21,
  lift = false,
}: Props) {
  const Icon = icons[platform];

  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className={lift ? "icon-circle icon-circle--lift" : "icon-circle"}
      style={{ width: size, height: size }}
    >
      <Icon size={iconSize} />
    </a>
  );
}
