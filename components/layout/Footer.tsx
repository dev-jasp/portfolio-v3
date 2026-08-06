/**
 * Footer — a sticky reveal rather than a block at the end of the document.
 *
 * The footer is `fixed`, and a fixed element ignores an ancestor's `overflow`.
 * Only `clip-path` cuts it off, which is why the wrapper clips instead of
 * hiding: the wrapper reserves the footer's height in the flow, and the
 * Collaborate panel above (`z-2`, opaque) slides over the footer until the
 * scroll reaches this container.
 *
 * TODO(phase 7): nav column, social circles, copyright, oversized name row.
 */
export function Footer() {
  return (
    <div className="relative z-1 h-[min(700px,100svh)] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
      <footer className="fixed inset-x-0 bottom-0 flex h-[min(700px,100svh)] flex-col bg-paper px-11 pt-14 pb-[30px]">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-muted">
          Footer — phase 7
        </p>
      </footer>
    </div>
  );
}
