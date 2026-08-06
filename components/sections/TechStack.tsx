"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
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
 * Tech stack — a centred intro over a two-column grid: portrait left, stack
 * rows right.
 *
 * A client component because one timeline drives both halves: the intro lines
 * stagger in while the photo frame wipes across, and splitting that across two
 * components would mean two timelines that only agree by coincidence.
 *
 * The grid collapses to one column at 900px. Rows below size themselves in
 * container-query units against their own column, so that collapse is the only
 * breakpoint this section needs, and they share one height via
 * `minmax(min-content, 1fr)` so the dividers stay evenly spaced.
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
        One paragraph, not three. The breaks are a visual composition — the
        design source splits it into separate <p>s so each line can animate,
        which reads as three unrelated sentences. Block spans animate just as
        well and keep it a single sentence to anything listening.
      */}
      <p
        ref={introRef}
        className="mx-auto max-w-[60ch] text-center font-mono text-[clamp(15px,2.15vw,40px)] leading-[1.22] tracking-[-0.02em] text-ink uppercase"
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
          {stack.map((category) => (
            <StackRow key={category.label} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
