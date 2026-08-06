/**
 * Hero — the page opens on a dark panel inset by the 10px white frame.
 *
 * Shell only. The panel geometry is the load-bearing part: `--inset-panel`
 * sets the frame, and the 44px horizontal padding is the offset the phase-3
 * marquee cancels out to run full-bleed.
 *
 * TODO(phase 3): name + inline avatar, role, centred CTA, marquee headline.
 */
export function Hero() {
  return (
    <section id="top" className="p-[var(--inset-panel)]">
      <div
        data-darkpanel
        className="relative flex min-h-[calc(100vh-20px)] flex-col overflow-hidden rounded-panel bg-ink px-11 pt-[34px] pb-10 text-paper"
      >
        <span aria-hidden="true" className="dot-grid" />
        <p className="relative font-mono text-sm uppercase tracking-[0.22em] text-on-dark-muted">
          Hero — phase 3
        </p>
      </div>
    </section>
  );
}
