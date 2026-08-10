/**
 * Accent dot, hairline, accent dot — the rule that connects the hero's process
 * stages and divides the tech stack's category rows.
 *
 * The line takes all the slack, so the rule fills whatever width its parent
 * gives it and the dots always land on its two ends. Decorative wherever it
 * appears, so it carries `aria-hidden` itself rather than asking each caller to
 * remember.
 */
export function AccentRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center ${className ?? ""}`.trim()}
    >
      <span className="size-[6px] flex-none rounded-full bg-accent" />
      <span className="h-px flex-1 bg-accent/50" />
      <span className="size-[6px] flex-none rounded-full bg-accent" />
    </span>
  );
}
