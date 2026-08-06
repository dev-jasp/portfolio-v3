/**
 * Selected work — heading, a column of scroll-scaled cards, archive link.
 *
 * Shell only. This section deliberately carries no padding of its own: the
 * heading row, the card column and the archive row each set their own, because
 * the 200px gap between cards has to be measured card-to-card.
 *
 * TODO(phase 6): heading + count badge, work cards, "View Archive." link.
 */
export function SelectedWork() {
  return (
    <section id="work">
      <p className="px-gutter py-10 font-mono text-sm uppercase tracking-[0.22em] text-muted">
        Selected Work — phase 6
      </p>
    </section>
  );
}
