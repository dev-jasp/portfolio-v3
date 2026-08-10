"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { StackRow } from "@/components/ui/StackRow";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { stack, stackIntroLines } from "@/lib/data";
import { ease } from "@/lib/design/motion";

/** How far left each intro line starts. Mirrored by the inline style below. */
const LINE_OFFSET = 200;

/** The image reveal joins the line stagger already in progress. */
const IMAGE_OFFSET_S = 0.12;

/**
 * About / tech stack — an "About" heading beside its intro, over a two-column
 * grid: portrait left, stack rows right.
 *
 * A client component because one timeline drives both halves: the intro lines
 * stagger in while the photo frame wipes across, and splitting that across two
 * components would mean two timelines that only agree by coincidence.
 *
 * The grid collapses to one column at 900px. Rows below size themselves in
 * container-query units against their own column, so this is the only viewport
 * breakpoint the section needs — the one place a row still has to change shape,
 * it asks the column how wide it is. They share one height via
 * `minmax(min-content, 1fr)` so the dividing rules stay evenly spaced.
 */
export function TechStack() {
  const rootRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  // No negative bottom margin: the intro sits high in a full-height section, so
  // the default would hold the entrance back until it was well past centre.
  const started = useInView(introRef, { rootMargin: "0px" });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lines = root.querySelectorAll<HTMLElement>("[data-stack-line]");
    const frame = root.querySelector<HTMLElement>("[data-stack-frame]");
    const image = frame?.querySelector("img");
    if (!frame || !image) return;

    const ctx = gsap.context(() => {
      // Reduced motion still needs the end state applied — the elements ship
      // hidden so the entrance cannot flash, so nothing else would reveal them.
      if (reducedMotion) {
        gsap.set(lines, { opacity: 1, x: 0 });
        gsap.set(frame, { opacity: 1 });
        return;
      }

      if (!started) return;

      const timeline = gsap.timeline();

      timeline.to(lines, {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: ease.out,
        stagger: 0.14,
        overwrite: true,
      });

      // The frame sweeps right from off-column while the image slides the
      // opposite way at the same rate — the photo holds still in the viewport
      // and the frame's edge uncovers it, rather than the whole thing flying in.
      timeline.set(frame, { opacity: 1 }, IMAGE_OFFSET_S);
      timeline.from(
        frame,
        { xPercent: -100, duration: 1.4, ease: ease.softOut },
        "<",
      );
      timeline.from(
        image,
        { xPercent: 100, scale: 1.3, duration: 1.4, ease: ease.softOut },
        "<",
      );
    }, rootRef);

    return () => ctx.revert();
  }, [started, reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="stack"
      className="flex min-h-svh flex-col gap-[clamp(28px,4vh,56px)] px-gutter pt-[clamp(40px,7vh,80px)] pb-[clamp(40px,6vh,70px)]"
    >
      {/*
        Heading left, intro right. They wrap onto separate lines on their own
        rather than at a breakpoint: both items size to their own content, so
        the row breaks at exactly the width where the intro's longest line stops
        clearing the heading. Wrapping is what keeps this off a media query —
        the intro's `clamp()` and the heading's track each other down to ~600px,
        below which the row splits and both run full width.
      */}
      <div className="flex flex-wrap items-start justify-between gap-x-[clamp(24px,5vw,72px)] gap-y-8">
        {/* Same scale and tracking as the "Selected Work" heading, deliberately
            — the two are the page's section headings and have to read as one
            size. No weight utility: the wordmark family ships at 400 only, and
            asking for more would make the browser synthesise it. */}
        <Reveal>
          <h2 className="font-wordmark text-[clamp(46px,7vw,120px)] leading-[0.88] tracking-[-0.01em]">
            About
          </h2>
        </Reveal>

        {/*
          One paragraph, not three. The breaks are a visual composition — the
          design source splits it into separate <p>s so each line can animate,
          which reads as three unrelated sentences. Block spans animate just as
          well and keep it a single sentence to anything listening.
        */}
        <p
          ref={introRef}
          className="max-w-[60ch] font-mono text-[clamp(15px,2.15vw,40px)] leading-[1.22] tracking-[-0.02em] text-ink uppercase"
        >
          {stackIntroLines.map((line) => (
            <span
              key={line}
              data-stack-line
              data-reveal
              className="relative block"
              // Hidden in the markup rather than by the effect, so the entrance
              // cannot flash its end state on the frame before GSAP takes over.
              style={{ opacity: 0, transform: `translateX(-${LINE_OFFSET}px)` }}
            >
              {line}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="grid flex-1 grid-cols-2 items-stretch gap-x-9 gap-y-10 max-[900px]:grid-cols-1">
        <div
          data-stack-frame
          data-reveal
          className="relative min-h-[clamp(320px,52vh,680px)] overflow-hidden rounded-frame bg-surface"
          style={{ opacity: 0 }}
        >
          <Image
            src="/images/jaspher-gargar.png"
            alt="Jaspher Gargar"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="origin-left object-cover object-[50%_40%] grayscale"
          />
        </div>

        <div className="grid [container-type:inline-size] [grid-template-rows:repeat(4,minmax(min-content,1fr))] content-center">
          {stack.map((category, index) => (
            <StackRow key={category.label} {...category} divided={index > 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
