import { ArrowButton } from "@/components/ui/ArrowButton";
import { Reveal } from "@/components/ui/Reveal";
import { darkPanelProps } from "@/lib/design/tokens";
import { site } from "@/lib/constants";
import { reveal } from "@/lib/design/motion";

/**
 * Collaborate — the closing dark panel, and the lid over the footer.
 *
 * The stacking is not decorative: this section is opaque and sits at `z-2` so
 * it covers the fixed footer (`z-1`) until the page has scrolled past it.
 * Removing the background or the z-index breaks the reveal.
 *
 * Both children are `relative` so they paint above the dot grid. The grid is
 * absolutely positioned and comes first in the DOM, which would otherwise put
 * it over any static sibling regardless of order.
 */
export function Collaborate() {
  return (
    <section
      id="contact"
      className="relative z-2 bg-paper px-[var(--inset-panel)] pb-[var(--inset-panel)]"
    >
      <div
        {...darkPanelProps}
        className="relative flex min-h-[76vh] flex-col items-center justify-center gap-[46px] overflow-hidden rounded-panel bg-ink px-10 py-20 text-paper"
      >
        <span aria-hidden="true" className="dot-grid" />

        <Reveal className="relative">
          <h2 className="text-center text-[clamp(40px,6.4vw,92px)] font-medium tracking-[-0.04em]">
            Collaborate with Me
          </h2>
        </Reveal>

        <Reveal delayMs={reveal.stepMs} className="relative">
          <ArrowButton
            href={`mailto:${site.email}`}
            label="Get in Touch"
            size="lg"
          />
        </Reveal>
      </div>
    </section>
  );
}
