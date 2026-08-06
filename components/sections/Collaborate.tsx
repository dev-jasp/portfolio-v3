/**
 * Collaborate — the closing dark panel, and the lid over the footer.
 *
 * Shell only, but the stacking is not decorative: this section is opaque and
 * sits at `z-2` so it covers the fixed footer (`z-1`) until the page has
 * scrolled past it. Removing the background or the z-index breaks the reveal.
 *
 * TODO(phase 7): "Collaborate with Me" heading and the Get in Touch CTA.
 */
export function Collaborate() {
  return (
    <section
      id="contact"
      className="relative z-2 bg-paper px-[var(--inset-panel)] pb-[var(--inset-panel)]"
    >
      <div
        data-darkpanel
        className="relative flex min-h-[76vh] flex-col items-center justify-center gap-[46px] overflow-hidden rounded-panel bg-ink px-10 py-20 text-paper"
      >
        <span aria-hidden="true" className="dot-grid" />
        <p className="relative font-mono text-sm uppercase tracking-[0.22em] text-on-dark-muted">
          Collaborate — phase 7
        </p>
      </div>
    </section>
  );
}
