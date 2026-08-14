"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AccentRule } from "@/components/ui/AccentRule";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/lib/constants";
import { aboutIntroLines, aboutOutro, aboutSpecs, stack } from "@/lib/data";
import { ease } from "@/lib/design/motion";

// Registered at module scope so the plugin is wired before any effect runs,
// guarded because this module is still evaluated on the server.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * The viewport width below which the reel is read down instead of across.
 * Deliberately the stack grid's old 900px breakpoint: a phone has no room for a
 * panel *and* the next one's edge, which is the whole point of the reel.
 */
const HORIZONTAL_QUERY = "(min-width: 901px)";

/**
 * Vertical scroll spent per pixel travelled sideways. `1` means the reel moves
 * exactly as far as the wheel asks it to, which is the only ratio that doesn't
 * feel like the page is being dragged away from you — raise it to slow the
 * reel down, lower it to make it sprint.
 */
const PACE = 1;

/** Panel entrance, shared by both orientations. */
const PANEL_IN = { y: 44, duration: 0.9, stagger: 0.08 } as const;

/**
 * Panel widths, in the order they are read. Set here rather than at each panel
 * so the rhythm of the reel — wide, narrow, wide, four beats, wide — can be
 * taken in at a glance and re-tuned in one place.
 *
 * `min()` so each is a share of the viewport on a laptop and a fixed measure on
 * a wide display: a panel that keeps growing past ~1000px stops being a panel
 * and becomes a page.
 */
const width = {
  intro: "min(88vw, 1060px)",
  portrait: "min(56vw, 560px)",
  profile: "min(64vw, 680px)",
  stack: "min(52vw, 400px)",
  outro: "min(76vw, 720px)",
} as const;

/** Every panel, whichever way it is read. Width and height come from the mode. */
const PANEL = "relative flex flex-col px-gutter";

/**
 * Statement, portrait, profile, hand-off, and one panel per stack category.
 * Only the readout's resting text needs this — the reel counts the panels it
 * actually finds — but a hard-coded "08" would go stale the day a category is
 * added, and it is the first thing on screen.
 */
const PANEL_COUNT = String(stack.length + 4).padStart(2, "0");

/** Small tracked-out mono, the face this section labels everything in. */
const EYEBROW =
  "font-mono text-[clamp(10px,0.85vw,13px)] tracking-[0.18em] uppercase text-muted";

/**
 * About — the page's second act, read sideways.
 *
 * One statement, one portrait, one profile, four stack panels and a hand-off,
 * laid out as a track that travels left while the page scrolls down. The
 * section is as tall as the track is wide, a sticky viewport holds the reel
 * still inside it, and a scrubbed tween ties the two together — so the browser
 * keeps doing the scrolling and nothing here has to fake momentum.
 *
 * **Sticky, not `pin: true`.** ScrollTrigger's pin would do the same job by
 * inserting a spacer and setting the section `position: fixed`, and this page
 * cannot afford that: the fixed footer and the panel that covers it depend on
 * nothing between `<body>` and them creating a containing block. `position:
 * sticky` creates none, needs no wrapper in the DOM, and is composited by the
 * browser rather than written every frame.
 *
 * **The mode is React state, not a media query in the class list.** The
 * horizontal reel is a rig — a tween, a sticky box, a measured height — that
 * either exists or doesn't, and half of it cannot be expressed in CSS. So one
 * boolean decides, `useMediaQuery` keeps it live, and both class sets are
 * written out in full at each usage site (Tailwind reads source text; a
 * composed class name is a class name it never sees).
 *
 * Below 901px, or under `prefers-reduced-motion`, the same markup stacks and is
 * read down the page with the ordinary entrance — no track, no sticky, no
 * ScrollTriggers at all.
 */
export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const reducedMotion = useReducedMotion();
  const wide = useMediaQuery(HORIZONTAL_QUERY);
  const horizontal = wide && !reducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || reducedMotion) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-about-panel]");

      /**
       * Entrances. The same tween either way; only what counts as "on screen"
       * changes — the viewport's left edge in the reel, its bottom edge down
       * the page.
       *
       * A `from` tween, so nothing ships hidden: if this effect never runs —
       * no JavaScript, reduced motion, a narrow screen — the panels are simply
       * already where they belong. That is the opposite bargain to the rest of
       * the page's GSAP entrances, and it is the right one here, because the
       * section's fallback is a layout rather than a still frame.
       *
       * **The panels on the first screen can't wait for the reel.** A
       * `containerAnimation` trigger measures a panel against the track's
       * travel, and a panel that starts on screen reaches its start position
       * before the track has moved at all — so it would sit hidden through the
       * whole approach and only appear once the section had locked, which is
       * the one moment nothing should be moving. Those play off the section
       * rising into view, like every other entrance on the page; the ones
       * still off to the right play as the reel brings them in.
       */
      const enter = (container?: gsap.core.Tween) => {
        for (const panel of panels) {
          const items = panel.querySelectorAll("[data-panel-in]");
          if (!items.length) continue;

          const onFirstScreen = panel.offsetLeft < window.innerWidth;

          gsap.from(items, {
            opacity: 0,
            y: PANEL_IN.y,
            duration: PANEL_IN.duration,
            ease: ease.out,
            stagger: PANEL_IN.stagger,
            scrollTrigger:
              container && !onFirstScreen
                ? {
                    trigger: panel,
                    containerAnimation: container,
                    start: "left 88%",
                  }
                : {
                    trigger: container ? root : panel,
                    start: "top 82%",
                  },
          });
        }
      };

      if (!horizontal) {
        enter();
        return;
      }

      /** How far the track has to travel for its last panel to reach the edge. */
      const distance = () =>
        Math.max(1, track.scrollWidth - window.innerWidth);

      /**
       * The section's own height is the reel's runway: one screen for the
       * sticky viewport, plus exactly the scroll the tween is going to consume.
       * Written as a custom property on `refreshInit` — before ScrollTrigger
       * measures anything — because the height it produces is what every
       * position below it on the page then depends on.
       */
      const setRunway = () =>
        root.style.setProperty("--about-runway", `${distance() * PACE}px`);

      setRunway();
      ScrollTrigger.addEventListener("refreshInit", setRunway);

      const travel = gsap.to(track, {
        x: () => -distance(),
        // Required, not stylistic: any other curve breaks the 1:1 tie between
        // where the page is scrolled and where the reel has got to.
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance() * PACE}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const fill = progressRef.current;
            if (fill) fill.style.transform = `scaleX(${self.progress})`;

            // Read off the panels themselves, not off an even split of the
            // range: they are five different widths, so an eighth of the
            // progress is nowhere near an eighth of the reel.
            //
            // The line they are read against sweeps from the viewport's left
            // edge to its right as the reel completes, which is the only rule
            // that survives both ends of the width range. Fixed at the left
            // edge, a wide screen never reaches the last panels — they are on
            // screen from the start and the track stops moving long before
            // their edges arrive. Sweeping it means the readout always opens
            // on the first panel and always lands on the last, whether the
            // screen holds two panels or five.
            const scrolled = -(gsap.getProperty(track, "x") as number);
            const lead = scrolled + window.innerWidth * self.progress;
            let index = 0;
            for (let i = 0; i < panels.length; i += 1) {
              if (panels[i].offsetLeft <= lead) index = i;
            }

            const counter = counterRef.current;
            const label = labelRef.current;
            const name = panels[index].dataset.aboutLabel ?? "";
            const position = `${String(index + 1).padStart(2, "0")} / ${String(
              panels.length,
            ).padStart(2, "0")}`;
            if (counter && counter.textContent !== position) {
              counter.textContent = position;
            }
            if (label && label.textContent !== name) label.textContent = name;
          },
        },
      });

      enter(travel);

      // Depth. Both of these move *with* the reel and slower than it, which is
      // what stops eight panels sliding past as one flat sheet.
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          x: 140,
          ease: "none",
          scrollTrigger: {
            trigger: panels[0],
            containerAnimation: travel,
            start: "left left",
            end: "right left",
            scrub: true,
          },
        });
      }

      const portrait = portraitRef.current?.querySelector("img");
      if (portrait) {
        // The frame stays put and the photograph drifts inside it. Scaled up
        // by more than the drift so the crop never opens a gap at either edge.
        gsap.fromTo(
          portrait,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: portraitRef.current,
              containerAnimation: travel,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      }

      // The cue has done its job the moment the reel moves at all.
      if (cueRef.current) {
        gsap.to(cueRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.35}`,
            scrub: true,
          },
        });
      }

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", setRunway);
        root.style.removeProperty("--about-runway");
      };
    }, rootRef);

    return () => ctx.revert();
  }, [horizontal, reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="about"
      className={
        horizontal
          ? // The fallback matters: until the first refresh writes the runway,
            // and for the frame between hydration and it, the section still has
            // to be tall enough for the sticky viewport to have somewhere to go.
            "relative h-[calc(100svh+var(--about-runway,300vh))]"
          : "relative"
      }
    >
      <div
        className={
          horizontal
            ? "sticky top-0 flex h-svh flex-col overflow-hidden"
            : "flex flex-col"
        }
      >
        <div
          ref={trackRef}
          className={
            horizontal
              ? "flex w-max flex-1 items-stretch will-change-transform"
              : "flex flex-col gap-[clamp(56px,10vw,96px)] py-[clamp(48px,9vw,88px)]"
          }
        >
          {/* -- 01 Statement ------------------------------------------------
              The section heading, the statement it belongs to, and the only
              instruction the reel gives. `justify-between` hangs all three off
              the floor of a full-height panel with the eyebrow at the ceiling,
              which is what makes the first screen read as a title card rather
              than as the top of a list. */}
          <article
            data-about-panel
            data-about-label="Statement"
            style={horizontal ? { width: width.intro } : undefined}
            className={
              horizontal
                ? `${PANEL} h-full flex-none justify-between py-[clamp(28px,5vh,64px)]`
                : `${PANEL} w-full gap-[clamp(20px,4vw,32px)]`
            }
          >
            <span data-panel-in className={EYEBROW}>
              {site.role}
            </span>

            <div className="flex flex-col gap-[clamp(20px,3.4vh,44px)]">
              {/* Same scale and tracking as the "Selected Work" heading,
                  deliberately — the two are the page's section headings and
                  have to read as one size. No weight utility: the wordmark
                  family ships at 400 only. */}
              <h2
                ref={headingRef}
                data-panel-in
                className="font-wordmark text-[clamp(46px,7vw,120px)] leading-[0.88] tracking-[-0.01em]"
              >
                About
              </h2>

              {/* One paragraph, not three. The breaks are a visual
                  composition, so they are block spans — three <p>s would read
                  as three unrelated sentences to anything listening. */}
              <p
                data-panel-in
                className="max-w-[52ch] font-mono text-[clamp(15px,1.7vw,30px)] leading-[1.24] tracking-[-0.02em] text-ink uppercase"
              >
                {aboutIntroLines.map((line) => (
                  <span key={line} className="block">
                    {line}{" "}
                  </span>
                ))}
              </p>
            </div>

            {/* Hidden from assistive tech in the reel: it describes a gesture
                that only exists for a pointer, and the content is in reading
                order either way. Down the page it is simply not rendered. */}
            {horizontal ? (
              <div
                ref={cueRef}
                aria-hidden="true"
                className="flex items-center gap-[clamp(12px,1.4vw,22px)]"
              >
                <span className={EYEBROW}>Keep scrolling</span>
                <AccentRule className="w-[clamp(56px,8vw,140px)]" />
              </div>
            ) : null}
          </article>

          {/* -- 02 Portrait --------------------------------------------------
              A tall frame and its caption. The photograph drifts inside the
              frame as the panel crosses the screen — see the parallax above. */}
          <article
            data-about-panel
            data-about-label="Portrait"
            style={horizontal ? { width: width.portrait } : undefined}
            className={
              horizontal
                ? `${PANEL} h-full flex-none gap-[clamp(14px,2vh,24px)] py-[clamp(28px,5vh,64px)]`
                : `${PANEL} w-full gap-[clamp(14px,3vw,24px)]`
            }
          >
            <div
              ref={portraitRef}
              data-panel-in
              className={
                horizontal
                  ? "relative min-h-0 flex-1 overflow-hidden rounded-frame bg-surface"
                  : "relative min-h-[clamp(320px,52vh,680px)] overflow-hidden rounded-frame bg-surface"
              }
            >
              <Image
                src="/images/jaspher-gargar.png"
                alt={site.name}
                fill
                sizes="(max-width: 900px) 100vw, 56vw"
                // Overscaled only where it drifts: the parallax slides this
                // ±7% and the crop has to stay full-bleed at both ends of that
                // travel. Read down the page there is no drift, so scaling
                // would only throw away 16% of the photograph.
                className={
                  horizontal
                    ? "scale-[1.16] object-cover object-[50%_40%] grayscale"
                    : "object-cover object-[50%_40%] grayscale"
                }
              />
            </div>

            <div
              data-panel-in
              className="flex items-baseline justify-between gap-4"
            >
              <span className="font-mono text-[clamp(12px,1.05vw,16px)] tracking-[0.02em] uppercase">
                {site.name}
              </span>
              <span className={EYEBROW}>Portrait</span>
            </div>
          </article>

          {/* -- 03 Profile ---------------------------------------------------
              The facts, set as data. Rows share the panel's height evenly so
              the accent rules between them stay on a rhythm — the same bargain
              the old stack grid made with `minmax(min-content, 1fr)`. */}
          <article
            data-about-panel
            data-about-label="Profile"
            style={horizontal ? { width: width.profile } : undefined}
            className={
              horizontal
                ? `${PANEL} h-full flex-none justify-between py-[clamp(28px,5vh,64px)]`
                : `${PANEL} w-full gap-[clamp(20px,4vw,32px)]`
            }
          >
            <span data-panel-in className={EYEBROW}>
              Profile
            </span>

            <div
              className={
                horizontal
                  ? "grid flex-1 content-center [grid-template-rows:repeat(4,minmax(min-content,1fr))]"
                  : "grid"
              }
            >
              {aboutSpecs.map((spec, index) => (
                <div
                  key={spec.label}
                  data-panel-in
                  className="relative flex flex-col justify-center gap-[clamp(4px,0.6vh,10px)] py-[clamp(14px,1.8vh,26px)]"
                >
                  {/* Centred on the row's top edge so the dots overhang into
                      the row above rather than pushing this one down. Out of
                      flow, or it would count as a third child. */}
                  {index > 0 && (
                    <AccentRule className="absolute inset-x-0 top-0 -translate-y-1/2" />
                  )}
                  <span className={EYEBROW}>{spec.label}</span>
                  <span className="text-[clamp(18px,1.9vw,30px)] leading-[1.15] tracking-[-0.02em]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </article>

          {/* -- 04-07 The stack ----------------------------------------------
              One panel per category, in the order `stack` declares. This is
              what the reel buys: four rows crushed into one column become four
              panels you arrive at one at a time, each with its own index and
              room for the list to be read rather than scanned. */}
          {stack.map((category, index) => (
            <article
              key={category.label}
              data-about-panel
              data-about-label={category.label}
              style={horizontal ? { width: width.stack } : undefined}
              className={
                horizontal
                  ? `${PANEL} h-full flex-none py-[clamp(28px,5vh,64px)]`
                  : `${PANEL} w-full gap-[clamp(16px,3vw,24px)]`
              }
            >
              {/* The divider turns with the reel: a rule down the panel's
                  leading edge across, the same rule across its top edge down.
                  `AccentRule` follows whichever direction its parent is in, so
                  this is one component in two orientations, not two. */}
              {index > 0 &&
                (horizontal ? (
                  <AccentRule className="absolute inset-y-0 left-0 -translate-x-1/2 flex-col" />
                ) : (
                  <AccentRule className="absolute inset-x-0 top-0 -translate-y-1/2" />
                ))}

              <span data-panel-in className={EYEBROW}>
                {String(index + 1).padStart(2, "0")} — Stack
              </span>

              {/* Hung from the floor of the panel, not centred in it. Four
                  lists of two to six items centre at four different heights,
                  which reads as four accidents; sharing a baseline turns the
                  difference into what it actually is — the shape of the data,
                  with the longest list climbing highest. */}
              <div
                className={
                  horizontal
                    ? "mt-auto flex flex-col gap-[clamp(16px,2.4vh,32px)]"
                    : "flex flex-col gap-[clamp(10px,2vw,16px)]"
                }
              >
                {/* Bold mono at the category label, as it was in the row it
                    replaces — the label is the data's heading, not the
                    section's, so it keeps the labelling face. */}
                <h3
                  data-panel-in
                  className="font-mono text-[clamp(20px,2.2vw,32px)] font-bold tracking-[0.02em] uppercase"
                >
                  {category.label}
                </h3>

                <ul
                  data-panel-in
                  className={
                    horizontal
                      ? "flex flex-col gap-[clamp(6px,0.9vh,14px)] font-mono text-[clamp(15px,1.5vw,24px)] tracking-[0.01em] text-muted-strong"
                      : "flex flex-wrap items-center gap-x-[0.5em] gap-y-2 font-mono text-[clamp(13px,3.2vw,18px)] tracking-[0.01em] text-muted-strong"
                  }
                >
                  {category.items.map((item, itemIndex) => (
                    <li key={item} className="flex items-center gap-[0.5em]">
                      {/* Read down, each item owns its line and needs no
                          separator. Read across, they run as one line and the
                          hairline is what keeps them apart. */}
                      {!horizontal && itemIndex > 0 && (
                        <span
                          aria-hidden="true"
                          className="h-[1.1em] w-px flex-none bg-hairline"
                        />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          {/* -- 08 Hand-off --------------------------------------------------
              The reel has to end somewhere rather than run out. The only
              focusable thing inside the track lives here, at the end of it —
              see the note on the readout below. */}
          <article
            data-about-panel
            data-about-label="Next"
            style={horizontal ? { width: width.outro } : undefined}
            className={
              horizontal
                ? `${PANEL} h-full flex-none justify-end gap-[clamp(24px,4vh,48px)] py-[clamp(28px,5vh,64px)]`
                : `${PANEL} w-full gap-[clamp(24px,4vw,36px)]`
            }
          >
            <p
              data-panel-in
              className="max-w-[18ch] font-wordmark text-[clamp(38px,5vw,88px)] leading-[0.95] tracking-[-0.01em]"
            >
              {aboutOutro.line}
            </p>

            <div data-panel-in className="flex">
              {/* `onLight`: the button rests as ink on paper here, the same as
                  the hero's. */}
              <ArrowButton
                href={site.archiveUrl}
                label={aboutOutro.ctaLabel}
                size="sm"
                tone="onLight"
              />
            </div>
          </article>
        </div>

        {/*
          The readout: where you are in the reel, how far through it, and what
          you are looking at. Hidden from assistive tech — every word of it
          restates a position that only exists for a pointer, and the panels
          themselves are already in reading order.

          Both text nodes are written straight to the DOM from `onUpdate`
          rather than held in state: this changes on every frame of a scrub,
          and re-rendering eight panels for a two-character counter is how a
          reel starts dropping frames.
        */}
        {horizontal ? (
          <div
            aria-hidden="true"
            className="flex flex-none items-center gap-[clamp(16px,2.5vw,40px)] px-gutter pb-[clamp(18px,3vh,34px)]"
          >
            <span ref={counterRef} className={EYEBROW}>
              01 / {PANEL_COUNT}
            </span>
            <span className="relative h-px flex-1 bg-hairline">
              <span
                ref={progressRef}
                className="absolute inset-0 origin-left bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
            <span ref={labelRef} className={EYEBROW}>
              Statement
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
