/**
 * Tech stack — centred intro above a two-column grid, on the page ground.
 *
 * Shell only. The section owns the shared gutter and the vertical rhythm
 * between intro and grid; the grid itself collapses to one column at 900px.
 *
 * TODO(phase 5): intro lines, grayscale photo frame, four divided stack rows.
 */
export function TechStack() {
  return (
    <section
      id="stack"
      className="flex min-h-screen flex-col gap-[clamp(28px,4vh,56px)] px-gutter pt-[clamp(40px,7vh,80px)] pb-[clamp(40px,6vh,70px)]"
    >
      <p className="font-mono text-sm uppercase tracking-[0.22em] text-muted">
        Tech Stack — phase 5
      </p>
    </section>
  );
}
