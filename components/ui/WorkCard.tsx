"use client";

import { useRef } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Reveal } from "@/components/ui/Reveal";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useScrollScale } from "@/hooks/useScrollScale";
import type { Project } from "@/types";

/** The meta column trails the media in, once the card is properly on screen. */
const META_DELAY_MS = 260;

/**
 * Width of one Space Mono glyph, as a fraction of the font size. The family is
 * monospaced at 600/1000 units; the extra hundredth absorbs sub-pixel rounding
 * so the fitted line lands inside the column rather than a hair over it.
 */
const CHAR_EM = 0.61;

/** One separator: an `0.35em` dot between two `0.5em` gaps. */
const SEPARATOR_EM = 1.35;

/** The stack's resting size, matching the row labels in the About section. */
const STACK_MAX_PX = 18;

/**
 * A project: media on the left, metadata on the right, collapsing to one
 * column at 1100px.
 *
 * The name is stamped over the media rather than set above it, in
 * `mix-blend-mode: difference` so it stays legible against whatever the
 * screenshot happens to be — light on dark areas, dark on light ones, without
 * a scrim.
 *
 * The card scales toward 1 and fades in as it approaches the viewport's
 * centre, so the column reads as one card at a time rather than a list.
 */
export function WorkCard({ project }: { project: Project }) {
  const { name, description, stack, year, image, imagePlaceholder, href } =
    project;
  const cardRef = useRef<HTMLElement>(null);

  useScrollScale(cardRef);

  // The stack has to hold one line at every width, and in a monospaced family
  // its width is a pure function of its character count — so the size that
  // fits is arithmetic, not measurement. Everything below is sized in `em`,
  // which makes the whole row a fixed number of `em` wide; dividing the
  // column's width by that number gives the size at which it exactly fills the
  // line, and `min()` keeps it from growing past its resting size.
  const stackEms =
    stack.join("").length * CHAR_EM +
    Math.max(stack.length - 1, 0) * SEPARATOR_EM;
  const stackFontSize = stackEms
    ? `min(${STACK_MAX_PX}px, ${(100 / stackEms).toFixed(3)}cqw)`
    : undefined;

  return (
    <article
      ref={cardRef}
      data-card
      className="mx-auto grid w-full max-w-[1349px] grid-cols-[minmax(0,1fr)_minmax(260px,340px)] items-start gap-10 will-change-transform max-[1100px]:grid-cols-1"
    >
      <div className="relative mx-auto aspect-[969/642] w-full max-w-[969px] overflow-hidden rounded-card bg-ink">
        <ImageSlot
          src={image}
          alt={name}
          placeholder={imagePlaceholder}
          sizes="(max-width: 1100px) 100vw, 969px"
        />
        {/* A paper pill, so the name no longer relies on the blend mode to
            stay legible — `difference` would have inverted the pill against
            the screenshot rather than laying it over the top, so the name
            reverts to ink on white.

            The right padding is short by the tracking: 0.22em of letter-space
            trails the final letter, and without the correction the pill reads
            heavier on the right than on the left. */}
        <h3 className="pointer-events-none absolute bottom-[22px] left-[26px] rounded-full bg-paper py-[7px] pr-[calc(14px-0.22em)] pl-[14px] font-mono text-[13px] tracking-[0.22em] text-ink uppercase">
          {name}
        </h3>
      </div>

      <Reveal delayMs={META_DELAY_MS} className="flex flex-col gap-[26px]">
        {/* 20px rather than 24px: the descriptions run long enough that the
            column needs the vertical room for the live link beneath it, and
            this still sits above the 18px mono stack in the hierarchy. */}
        <p className="text-xl leading-[1.5] text-pretty">{description}</p>

        {/*
          The stack runs unlabelled beneath the description — at four or five
          names it reads as a stack on sight, and a heading would only spend a
          line saying what the list already says.

          Accent dots divide the names, rather than the About section's
          hairline bars: with no label to sit against, the marks are the only
          thing giving the row structure, and they carry the page's one accent
          colour. The wrapper is the query container the size above measures
          against.
        */}
        {stack.length > 0 && (
          <div className="[container-type:inline-size]">
            <ul
              className="flex items-center gap-[0.5em] font-mono text-muted-strong"
              style={{ fontSize: stackFontSize }}
            >
              {stack.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-[0.5em] whitespace-nowrap"
                >
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="size-[0.35em] flex-none rounded-full bg-accent"
                    />
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {year && (
          <p className="font-mono text-sm tracking-[0.22em] text-muted-strong">
            {year}
          </p>
        )}

        {/*
          Only the projects that have somewhere to send you: `href` is the
          case study's URL, and a card without one closes on its stack.

          The row wrapper is load-bearing — the column stretches its children
          to full width by default, which would pull the pill across the whole
          track, and as a flex row's only item the button sizes to its own
          content instead.

          `onLight` is the one place this button lands on the paper background
          rather than a dark panel; `fill` is the bare label, since inside a
          card this is a way into the project rather than the page's own call
          to action.
        */}
        {href && (
          <div className="flex">
            <ArrowButton
              href={href}
              label="View case study"
              size="sm"
              tone="onLight"
              variant="fill"
            />
          </div>
        )}
      </Reveal>
    </article>
  );
}
