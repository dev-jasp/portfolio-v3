/**
 * Accent dot, hairline, accent dot — the rule that connects the hero's process
 * stages and divides the tech stack's category rows.
 *
 * The line takes all the slack, so the rule fills whatever the parent gives it
 * and the dots always land on its two ends. Decorative wherever it appears, so
 * it carries `aria-hidden` itself rather than asking each caller to remember.
 *
 * **Turns with its caller.** Pass `flex-col` in `className` and the same rule
 * runs vertically — the hero's process track does exactly that below 900px. The
 * line carries `h-px w-px` for that reason and it is not a mistake: `flex-1`
 * owns the main axis in either direction, so only the cross-axis rule applies,
 * and each direction picks the one it needs.
 */
export function AccentRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center ${className ?? ""}`.trim()}
    >
      <span className="size-[6px] flex-none rounded-full bg-accent" />
      <span className="h-px w-px flex-1 bg-accent/50" />
      <span className="size-[6px] flex-none rounded-full bg-accent" />
    </span>
  );
}
