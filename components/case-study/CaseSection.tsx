import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

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
          {/* The accent disc from the "Selected Work" count, at label scale.
              Space Mono rather than that badge's inherited serif: at 13px a
              synthesised semibold Garamond turns to mud, and mono is already
              the page's voice for anything that reads as data. Sized in `em`
              off its own text, so the disc stays round if the label resizes —
              wide enough for two digits without becoming a pill. */}
          <p className="inline-grid size-[2.6em] place-items-center rounded-full bg-accent font-mono text-[13px] leading-none tracking-[0.02em] text-paper">
            {index}
          </p>
          {/* No weight utility — the wordmark family is loaded at 400 only. */}
          <h2 className="mt-[0.4em] font-wordmark text-[clamp(30px,3.6vw,54px)] leading-[1.04] tracking-[-0.01em]">
            {title}
          </h2>
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
