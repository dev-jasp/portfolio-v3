import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/ui/WorkCard";
import { site } from "@/lib/constants";
import { projects } from "@/lib/data";

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
      <div className="flex flex-wrap items-start justify-between gap-10 px-gutter py-10">
        <Reveal>
          <h2 className="text-[clamp(46px,7vw,120px)] leading-[0.88] font-medium tracking-[-0.045em]">
            Selected
            <br />
            Work
          </h2>
        </Reveal>
      </div>

      <div className="flex flex-col gap-[200px] px-gutter pb-15">
        {projects.map((project) => (
          <WorkCard key={project.id} project={project} />
        ))}
      </div>

      <div className="flex justify-end px-gutter pt-5 pb-24">
        <a
          href={site.archiveUrl}
          className="text-[22px] font-medium tracking-[-0.02em]"
        >
          View Archive.
        </a>
      </div>
    </section>
  );
}
