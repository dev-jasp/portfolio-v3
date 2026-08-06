import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/ui/WorkCard";
import { site } from "@/lib/constants";
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
 */
const BADGE_LIFT = "1em";

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
          <h2 className="text-[clamp(46px,7vw,120px)] leading-[0.88] font-medium tracking-[-0.045em]">
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

      {/* 200px between cards is the rhythm at desktop; on a phone it is most
          of a screen of nothing, so it scales with the viewport instead. */}
      <div className="flex flex-col gap-[clamp(72px,14vw,200px)] px-gutter pb-[clamp(32px,6vw,60px)]">
        {projects.map((project) => (
          <WorkCard key={project.id} project={project} />
        ))}
      </div>

      <div className="flex justify-end px-gutter pt-5 pb-[clamp(48px,10vw,96px)]">
        <a
          href={site.archiveUrl}
          className="text-[22px] font-medium tracking-[-0.02em] pointer-coarse:py-2"
        >
          View Archive.
        </a>
      </div>
    </section>
  );
}
