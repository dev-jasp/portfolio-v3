import type { SocialLink } from "@/types";
import { socialIcons } from "./Icons";

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
  const Icon = socialIcons[platform];

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
