type Props = {
  href: string;
  label: string;
  /** 9px in the menu panel, 7px in the footer. */
  dotSize?: number;
  /** Space between dot and label: 14px in the menu, 12px in the footer. */
  gap?: number;
  /** Typography, which differs everywhere this is used. */
  className?: string;
  onClick?: () => void;
};

/**
 * Accent dot plus label, sliding right on hover.
 *
 * The indent is the whole gesture — `.indent-link` in `globals.css` opts out of
 * the global link fade so the row moves rather than dims, which is why this
 * needs a class at all instead of utilities at the usage site.
 */
export function IndentLink({
  href,
  label,
  dotSize = 7,
  gap = 12,
  className,
  onClick,
}: Props) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={className ? `indent-link ${className}` : "indent-link"}
      style={{ gap }}
    >
      <span
        aria-hidden="true"
        className="flex-none rounded-full bg-accent"
        style={{ width: dotSize, height: dotSize }}
      />
      <span>{label}</span>
    </a>
  );
}
