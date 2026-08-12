import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The disc's diameter, in px. `BADGE_DROP` needs it as a number.
 *
 * Small enough to read as a mark set beside the heading rather than a second
 * thing competing with it. The digits are 10px, so 20px leaves ~4px of accent
 * either side of them — the floor before the disc stops reading as round.
 */
const BADGE_SIZE = 20;

/**
 * How far below the top of the heading's first line box its caps are optically
 * centred, in the heading's own em.
 *
 * Measured off the rendered face, not guessed, and it is a property of EB
 * Garamond at this leading rather than a universal figure. Its content area
 * runs 1.296em against a 1.04em line box, so half-leading is -0.128em and the
 * baseline lands 0.872em down; caps stand 0.704em, putting their centre 0.352em
 * above it. 0.872 - 0.352 = 0.52.
 *
 * This is what lets the disc sit *on* the heading's line. Baseline-aligning it
 * instead — the obvious move, and what `items-baseline` would do — drops a 28px
 * disc to the foot of a 54px cap, which reads as a bullet that has fallen off
 * the title rather than a number set with it. Re-measure if either the family
 * or the leading changes.
 */
const CAP_CENTER_EM = 0.52;

/** Centres the disc on that line: half its own height above the cap centre. */
const BADGE_DROP = `calc(${CAP_CENTER_EM}em - ${BADGE_SIZE / 2}px)`;

type Props = {
  /** Two digits, in reading order. Decorative — the heading carries the name. */
  index: string;
  title: string;
  children: ReactNode;
};

/**
 * One numbered section of a case study: heading column on the left, everything
 * else on the right.
 *
 * The heading sticks while its own section scrolls past. In a long read that is
 * what keeps a screenshot anchored to the argument it belongs to — you can
 * arrive halfway down a section and still see which one you are in. It sticks
 * only once there are two columns; at one column the heading is directly above
 * the prose and there is nothing to lose track of.
 *
 * `body` has `overflow-x: clip` rather than `hidden`, which matters here:
 * `hidden` would make the body a scrollport and kill the sticky.
 */
export function CaseSection({ index, title, children }: Props) {
  return (
    <section className="px-gutter">
      <div className="mx-auto grid w-full max-w-[1349px] gap-x-[clamp(24px,5vw,72px)] gap-y-[clamp(16px,2.5vw,28px)] py-[clamp(44px,7vw,96px)] min-[900px]:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <Reveal className="min-[900px]:sticky min-[900px]:top-[clamp(28px,8vh,96px)] min-[900px]:self-start">
          {/* The heading scale lives on the row, so the disc's drop can be
              expressed in the heading's own em while the disc keeps its fixed
              label size. `items-start` rather than `items-baseline`: the title
              wraps to two lines in this column, and the disc belongs to the
              first one. */}
          <div className="flex items-start gap-[0.26em] text-[clamp(30px,3.6vw,54px)]">
            {/* The drop sits on this wrapper, not on the disc. A margin's `em`
                resolves against the element's *own* font size, and the disc
                sets its own at 12px — on the disc, `0.5em` would measure the
                label instead of the heading it is aligning to. The wrapper
                inherits the row's scale, so the figure means what it says. */}
            <span className="flex-none" style={{ marginTop: BADGE_DROP }}>
              {/* The accent disc from the "Selected Work" count, at label
                  scale. Space Mono rather than that badge's inherited serif: at
                  10px a synthesised semibold Garamond turns to mud, and mono is
                  already the page's voice for anything that reads as data.

                  `tracking-normal` is doing real work: the page's mono labels
                  are tracked out 0.22em, and letter-space is added *after* the
                  last glyph — inherited here it would push both digits left of
                  centre by half of it. Nothing else centres them horizontally;
                  `place-items-center` only centres the line box they sit in. */}
              <p
                aria-hidden="true"
                className="grid place-items-center rounded-full bg-accent font-mono text-[10px] leading-none tracking-normal text-paper"
                style={{ width: BADGE_SIZE, height: BADGE_SIZE }}
              >
                {index}
              </p>
            </span>
            {/* `min-w-0` so the title takes what the row leaves it rather than
                holding its max-content width and pushing the disc out of the
                column. No weight utility — the wordmark family is 400 only. */}
            <h2 className="min-w-0 font-wordmark text-[1em] leading-[1.04] tracking-[-0.01em]">
              {title}
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-col gap-[clamp(22px,2.6vw,36px)]">
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * A run of body copy. The measure is capped in `ch` rather than pixels so it
 * holds a readable line length as the type scales, and the gap between
 * paragraphs belongs to this wrapper — paragraphs never carry their own
 * margins, so two of them can never disagree about the spacing between them.
 */
export function CaseProse({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-[68ch] flex-col gap-[1.1em] text-[clamp(17px,1.25vw,20px)] leading-[1.6] text-pretty">
      {children}
    </div>
  );
}
