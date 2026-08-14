import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/ui/WorkCard";
import { projects } from "@/lib/data";

/**
 * Lifts the count badge so its underside rests on the text baseline, which is
 * what makes it read as the full stop after "Work" rather than a bullet
 * hanging off it. The design's own value sat it ~8px below the baseline.
 *
 * Measured, not guessed: `align-items: flex-end` puts the badge on the bottom
 * of the line box, which is a descender's depth below the baseline. Expressed
 * in the badge's own `em` — a tenth of the heading's — so it holds all the way
 * down the heading's `clamp()`.
 *
 * This figure is tied to the heading's font: it is the descent of EB Garamond,
 * not a universal offset. It was 1em when the heading was Space Grotesk. Change
 * the family and this has to be re-measured.
 */
const BADGE_LIFT = "0.85em";

/**
 * Selected work — heading, a column of cards, then the archive link.
 *
 * The section carries no padding of its own: the heading row, the card column
 * and the archive row each set their own, because the 200px between cards has
 * to be measured card to card rather than inherited from a section rhythm.
 *
 * TODO(work): the accent count badge on the heading, and scaling each card
 * toward 1 as it centres on scroll.
 */
export function SelectedWork() {
  return (
    <section id="work">
      <div className="flex flex-wrap items-start justify-between gap-10 px-gutter py-[clamp(28px,5vw,40px)]">
        <Reveal>
          {/* No weight utility — the wordmark family is loaded at 400 only, so
              asking for 500 would make the browser synthesise it. Tracking
              eases off -0.045em, which was set for Space Grotesk. */}
          <h2 className="font-wordmark text-[clamp(46px,7vw,120px)] leading-[0.88] tracking-[-0.01em]">
            Selected
            <br />
            <span className="inline-flex items-end">
              Work
              {/*
                Hidden from assistive tech: visually this is the sentence's
                full stop that happens to carry a number, and the count is
                already evident from the three project headings below.
              */}
              <span
                aria-hidden="true"
                className="ml-[0.5em] inline-grid size-[1.8em] flex-none place-items-center rounded-full bg-accent text-[0.1em] font-semibold tracking-normal text-paper"
                style={{ marginBottom: BADGE_LIFT }}
              >
                {projects.length}
              </span>
            </span>
          </h2>
        </Reveal>
      </div>

      {/*
        200px between cards is the rhythm at desktop; on a phone it is most of
        a screen of nothing, so it scales with the viewport instead.

        The bottom padding used to belong to the "View Archive." row below this
        one. That link pointed at `/#work` — the section it was already inside —
        so it scrolled nowhere, and there is no archive to point it at: one of
        these three projects is real. It is gone until there is a page worth
        sending anyone to, the same call the footer made in `569b2ce`. Bring it
        back as `/work` when the archive exists.
      */}
      <div className="flex flex-col gap-[clamp(72px,14vw,200px)] px-gutter pb-[clamp(48px,10vw,96px)]">
        {projects.map((project) => (
          <WorkCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
