"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/lib/constants";
import { collabHeadingParts, collabPitch } from "@/lib/data";
import { ease } from "@/lib/design/motion";
import { darkPanelProps, radius } from "@/lib/design/tokens";

/**
 * The block at rest: a stadium slit between the two halves of the heading,
 * described in ems of that heading rather than in pixels.
 *
 * Proportions, because the heading is fluid. A fixed slit is only ever right at
 * one width — it reads as a flat divider against the 92px cap and as a fat
 * lozenge against the 40px floor. These are measured off the reference: a shade
 * under half the cap height tall, and five and a half times that wide.
 */
const SLIT_H_EM = 0.46;
const SLIT_ASPECT = 5.4;

/**
 * The slit's shipped geometry — also the timeline's first frame.
 *
 * `em` here, so the closed state is already fluid before JavaScript has run and
 * the effect has a font size to measure against rather than a hardcoded one.
 * `999px` resolves to a stadium at any height, which a fixed radius would not.
 */
const slitStyle = {
  width: `${(SLIT_H_EM * SLIT_ASPECT).toFixed(2)}em`,
  height: `${SLIT_H_EM}em`,
  borderRadius: "999px",
} as const;

/** Pinned scroll distance the whole sequence is scrubbed across. */
const SCRUB_DISTANCE = 1200;

/** The uncovered CTA's measure. A line length, not the block's width. */
const CTA_MAX_W = 660;
const CTA_INSET = 48;

/** Pre-JS CTA width, only ever on screen if the timeline never runs. */
const FALLBACK_CTA_W = "min(660px, 100% - 48px)";

/**
 * Collaborate — the closing panel, and the lid over the footer.
 *
 * The stacking is not decorative: this section is opaque and sits at `z-2` so
 * it covers the fixed footer (`z-1`) until the page has scrolled past it.
 * Removing the background or the z-index breaks the reveal.
 *
 * **The dark panel is not in the markup — it is built by the scroll.** The
 * section rests as white page with "Collaborate" and "with Me" either side of a
 * black stadium slit, the three centred as one line. Pinned, the slit grows
 * until it has pushed both words off the screen and filled the section end to
 * end, at which point it *is* the panel: same footprint, same 28px radius, same
 * dot grid, and it carries `data-dark-panel` so the menu pill inverts against
 * it exactly as it grows under the pill. What it finally uncovers is the
 * invitation and its button.
 *
 * The block has to be legible against the page for any of this to read as
 * expansion, which is the whole reason the section is paper rather than ink: a
 * black block on a black panel grows invisibly.
 *
 * **Full-height because it pins.** A pinned element is `position: fixed`, so
 * anything shorter than the viewport parks at the top and leaves bare page
 * below it for the length of the pin. The pin pushes the footer's wrapper down
 * by `SCRUB_DISTANCE`; the footer still reveals as before, just later.
 */
export function Collaborate() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const row = root.querySelector<HTMLElement>("[data-row]");
    const block = root.querySelector<HTMLElement>("[data-block]");
    const cta = root.querySelector<HTMLElement>("[data-cta]");
    const words = root.querySelectorAll<HTMLElement>("[data-word]");
    if (!row || !block || !cta) return;

    /**
     * The block's open size: the row's whole box, which is the section's
     * content box, which is the footprint the dark panel used to occupy.
     *
     * Deliberately not fitted to the space the words leave — the point is that
     * it takes *more* than that, so the flex row has no choice but to push them
     * off the screen. Filling the row is the smallest size that guarantees this
     * at every width, and it is also exactly panel-sized, so the block lands on
     * the design rather than near it.
     *
     * The row's own box is fixed by `flex-1 min-h-0`, so this is stable
     * mid-scrub rather than chasing the block it is about to resize.
     */
    const openSize = () => ({
      width: row.clientWidth,
      height: row.clientHeight,
    });

    /**
     * The slit's closed size in pixels — `slitStyle` resolved against whatever
     * the heading's `clamp()` has landed on.
     *
     * Read off the block itself, which carries the heading's font size for
     * exactly this reason. GSAP tweens numbers, not `em`, so the proportion has
     * to be resolved somewhere; doing it here rather than hardcoding it keeps
     * the closed shape identical to the one the markup already shipped.
     */
    const slitSize = () => {
      const em = parseFloat(getComputedStyle(block).fontSize);
      return { width: em * SLIT_H_EM * SLIT_ASPECT, height: em * SLIT_H_EM };
    };

    const ctaWidth = () => Math.min(CTA_MAX_W, row.clientWidth - CTA_INSET);

    /**
     * The row's resting gap, straight from the stylesheet.
     *
     * The gap is animated shut, so this has to be read off a box GSAP has not
     * written to yet — hence the `clearProps` in `onRefreshInit` below. Without
     * that, a refresh mid-scrub would read whatever the tween last set and
     * treat a half-closed gap as the resting one.
     */
    const cssGap = () => parseFloat(getComputedStyle(row).columnGap) || 0;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // The markup ships closed, so reduced motion has to be handed the end
      // state outright — including the block, which is both the panel and the
      // thing that un-clips the CTA. The words go with it: an open block fills
      // the row and pushes them off anyway, so leaving them visible only
      // strands two clipped fragments at the edges. The heading survives in the
      // `sr-only` h2, and the line the block uncovers carries the panel.
      if (reducedMotion) {
        gsap.set(row, { gap: 0 });
        gsap.set(block, { ...openSize(), borderRadius: `${radius.panel}px` });
        gsap.set(cta, { width: ctaWidth(), autoAlpha: 1 });
        gsap.set(words, { autoAlpha: 0 });
        return;
      }

      const timeline = gsap.timeline({
        defaults: { duration: 1, ease: ease.inOut },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${SCRUB_DISTANCE}`,
          pin: true,
          scrub: 1,
          // Takes the jump out of pinning when the pin is reached at speed.
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => gsap.set(row, { clearProps: "gap" }),
          onRefresh: () => gsap.set(cta, { width: ctaWidth() }),
        },
      });

      // The gap closes with the block. The two are the last of the row's width
      // that is not the block, so both have to reach zero for it to arrive at
      // exactly the panel's footprint rather than a hair inside it.
      timeline.fromTo(row, { gap: () => cssGap() }, { gap: 0 }, 0);

      // Radius travels with the size: it leaves as the stadium's own half-height
      // and arrives as the 28px panel, so the shape is the design's at both
      // ends. The two are close enough that the corner barely moves — which is
      // the point. A slit that rounds off as it opens would read as two shapes.
      timeline.fromTo(
        block,
        {
          width: () => slitSize().width,
          height: () => slitSize().height,
          borderRadius: () => `${slitSize().height / 2}px`,
        },
        {
          width: () => openSize().width,
          height: () => openSize().height,
          borderRadius: `${radius.panel}px`,
        },
        0,
      );

      // The block is already shoving these off the screen; this only takes care
      // of the tail, so neither word lingers as a sliver at the edge.
      timeline.to(
        words,
        { autoAlpha: 0, duration: 0.35, ease: ease.softIn },
        0.5,
      );

      // `autoAlpha`, not `opacity`: at zero it also sets `visibility: hidden`,
      // which keeps the button out of the tab order while it is still covered.
      timeline.fromTo(
        cta,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: ease.softOut },
        0.65,
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const [firstPart, secondPart] = collabHeadingParts;

  /*
    Each half sizes to its own words and shrinks from there — `flex: 0 1 auto`
    with the automatic minimum lifted, not `flex-1`.

    That last bit is what centres the line. `flex-1` gives both halves an equal
    share of the row, which puts the *block* dead centre and leaves the phrase
    itself lopsided: "Collaborate" runs 405px against "with Me"'s 291px, so the
    words ended up sitting 57px left of centre with the block marooned to the
    right of their midpoint. Sized to content, `justify-center` centres the trio
    as one object, the gaps either side of the block stay equal, and the block
    lands wherever the word break actually falls. That is the arrangement the
    reference uses, and it is the only one of the two that can be right for a
    heading whose halves are different lengths.

    It costs nothing at the far end. Both halves shrink in proportion to their
    own width, so they reach zero on the same frame — and that frame is exactly
    the one where the gap has closed and the block has taken the row's full
    width, which is the panel's footprint. The block still arrives on the design
    rather than a hair inside it.

    The text is anchored to the block-facing edge and overflows away from it,
    which is what carries each half off the screen as its box closes. One pair
    of alignments covers both axes: `end`/`end` hugs the block from the left in
    a row and from above in a column, `start`/`start` mirrors it. No overflow
    clipping here — the section wrapper is what the words leave through, and
    clipping them at their own box would erase them in place instead.
  */
  const partClass =
    "flex min-h-0 min-w-0 font-wordmark text-[clamp(40px,6.4vw,92px)] tracking-[-0.01em] whitespace-nowrap";

  return (
    <section
      ref={rootRef}
      id="contact"
      className="relative z-2 bg-paper px-[var(--inset-panel)] pb-[var(--inset-panel)]"
    >
      {/*
        A fixed height, not a floor. The section is pinned and full-viewport by
        definition, so there is no case where this should grow — and as a
        `min-height` it did, in the stacked layout: the two halves size to their
        own line box there, that height counts toward this box's content, and
        the block's open height is read back off it. Each frame made the box
        taller, which made the block taller, which made the box taller. A fixed
        height cuts the loop, and the overflow is exactly what we want clipped.

        `overflow-hidden` is what the words leave through: they are pushed past
        this box long before the block stops growing, and without it they would
        simply hang off the section.
      */}
      <div className="flex h-[calc(100svh-var(--inset-panel))] flex-col overflow-hidden">
        {/* The heading, announced once and in one piece. The two halves below
            are the same words laid out around the block, so they are hidden
            from assistive tech rather than read out a second time — but the
            button between them is real content and stays exposed. */}
        <h2 className="sr-only">{`${firstPart} ${secondPart}`}</h2>

        {/*
          `min-h-0` is load-bearing twice over. Without it the row's automatic
          minimum size lets the block push the row taller than the section —
          and the block's open height is read off this box, so it would chase
          itself larger every frame.
        */}
        <div
          data-row
          className="relative flex min-h-0 w-full flex-1 items-center justify-center gap-[clamp(14px,2.24vw,32px)] max-[640px]:flex-col"
        >
          <span
            aria-hidden="true"
            data-word
            className={`${partClass} items-end justify-end`}
          >
            {firstPart}
          </span>

          {/* This is the dark panel, at whatever size the scroll has got it to.
              `data-dark-panel` rides on it rather than on a wrapper so the menu
              pill inverts the moment the block is actually under the pill. */}
          <div
            data-block
            {...darkPanelProps}
            // The heading's own size, carried so `slitStyle`'s `em` and the
            // effect's `getComputedStyle` both resolve against it. Nothing
            // inside inherits it — the CTA's line and its button each set their
            // own — so this is a unit, not a type choice.
            className="relative flex-none overflow-hidden bg-ink text-[clamp(40px,6.4vw,92px)] text-paper"
            // Shipped closed. The timeline's first frame is this size too, so
            // there is nothing for the reveal to flash past on the way in.
            style={slitStyle}
          >
            <span aria-hidden="true" className="dot-grid dot-grid--center" />

            <div
              data-cta
              className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[clamp(18px,2.4vw,30px)]"
              // Width is pinned rather than shrink-to-fit: the containing block
              // is the growing block, so without it every line of this would
              // re-wrap on each frame of the scrub.
              style={{
                width: FALLBACK_CTA_W,
                opacity: 0,
                visibility: "hidden",
              }}
            >
              {/* Sized as a heading: the real heading is pushed off-screen on
                  the way in, so once the block is open this is the only type
                  carrying the panel. A step under the 92px it replaces, so the
                  settled state reads quieter than the approach. */}
              <p className="text-center font-wordmark text-[clamp(28px,3.6vw,54px)] leading-[1.05] tracking-[-0.01em]">
                {collabPitch}
              </p>
              {/* `sm`, down from `lg`. The scale is fixed pixels but the line
                  above it is not, so the button has to answer the smallest type
                  it will ever sit under, not the largest: `lg` stood 74px tall
                  against a pitch that is 54px on a desktop and 28px on a phone,
                  where it outweighed the sentence it exists to answer by 2.6x.
                  `sm` is the only step that reads right at both ends — just
                  under the line on a desktop, and the least top-heavy on a
                  phone — and it is the size every other button on the site
                  already uses. */}
              <ArrowButton
                href={`mailto:${site.email}`}
                label="Get in Touch"
                size="sm"
              />
            </div>
          </div>

          <span
            aria-hidden="true"
            data-word
            className={`${partClass} items-start justify-start`}
          >
            {secondPart}
          </span>
        </div>
      </div>
    </section>
  );
}
