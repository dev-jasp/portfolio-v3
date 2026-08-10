import type { ReactNode } from "react";

/**
 * A fact the case study does not have yet — a timeline, a figure, a quote from
 * the lab.
 *
 * Drawn in the accent with a dotted underline rather than left as ordinary
 * prose, because an unfilled blank that reads as finished copy is how a
 * placeholder ships. Every one of these is a question only the author can
 * answer; when the last one is gone, so is this component.
 */
export function Blank({ children }: { children: ReactNode }) {
  return (
    <span className="text-accent underline decoration-dotted underline-offset-4">
      {children}
    </span>
  );
}
