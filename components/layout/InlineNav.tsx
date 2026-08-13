import { heroNavLinks } from "@/lib/constants";

/*
  The nav link's hover: the menu's accent dot, on a gesture the row can take.

  `IndentLink` slides *sideways* and indents with `padding-left`. Down the menu
  panel both are free — the rows are stacked, so a wider row displaces nothing
  and there is empty panel to the right to slide into. Along a row neither is:
  padding shoves every link after the one under the pointer, and a sideways
  slide runs a label at its own neighbour. The axis with room in a row is the
  vertical one, so the label lifts instead.

  4px on `--ease-lift` over 260ms is not a new number — it is exactly what
  `.icon-circle--lift` does in `globals.css`, which is the design system's one
  hover lift. The dot's fade rides the same timing so the two read as a single
  movement rather than a lift with a light switch attached.

  The 14px of left padding is permanent, and that is the point: it is the dot's
  seat, held open whether the dot is showing or not. Revealing the dot then
  costs no layout at all — nothing reflows, and the dot never lands on the
  label's first letter. `hover:opacity-100` opts out of the global link fade for
  the same reason `.indent-link` does: the row is meant to move, not dim.
  Keyboard users get all of it on `:focus-visible`.
*/
const linkClass =
  "group relative inline-flex items-center pl-[14px] hover:opacity-100 pointer-coarse:min-h-11";

const dotClass =
  "pointer-events-none absolute top-1/2 left-0 size-[6px] -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-[260ms] ease-[var(--ease-lift)] group-hover:opacity-100 group-focus-visible:opacity-100";

const labelClass =
  "inline-block transition-transform duration-[260ms] ease-[var(--ease-lift)] group-hover:-translate-y-[4px] group-focus-visible:-translate-y-[4px]";

/**
 * The three-link nav that sits across the top of a page and scrolls away with
 * it — the hero on `/`, the header on a case study. The fixed pill is what
 * carries navigation for the rest of the scroll in both places.
 *
 * That is also why it can disappear outright below 900px: every link here is in
 * the menu under a longer label, so nothing is lost, and 900 is where both
 * sections change shape anyway rather than a breakpoint of the nav's own.
 *
 * The right padding clears the pill, whose inner edge sits 80px from the
 * viewport — further in than any section's gutter reaches.
 */
export function InlineNav() {
  return (
    <nav
      aria-label="Sections"
      className="flex items-center gap-[clamp(18px,2.4vw,44px)] pr-[clamp(76px,9vw,160px)] font-mono text-[clamp(13px,1.05vw,20px)] max-[900px]:hidden"
    >
      {heroNavLinks.map((link) => (
        <a key={link.href} href={link.href} className={linkClass}>
          <span aria-hidden="true" className={dotClass} />
          <span className={labelClass}>{link.label}</span>
        </a>
      ))}
    </nav>
  );
}
