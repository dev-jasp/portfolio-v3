"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ease } from "@/lib/design/motion";
import { marquee } from "@/lib/design/tokens";

type Props = {
  text: string;
  /** Typography for each copy. They must measure identically to loop cleanly. */
  className?: string;
  /** Enough copies to keep the row wider than the viewport at every size. */
  copies?: number;
};

/**
 * A ticker that reads as driven rather than decorative: it drifts on its own,
 * but scrolling down runs it left, scrolling up reverses it, and the whole row
 * eases sideways in proportion to how far the page has moved.
 *
 * Only the first copy is real text. The rest exist to hide the seam and are
 * hidden from assistive tech, so the headline is announced once.
 */
export function Marquee({ text, className, copies = 3 }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const slider = sliderRef.current;
    // Reduced motion leaves the headline sitting still, which is the point.
    if (!slider || reducedMotion) return;

    const ctx = gsap.context(() => {
      const items = Array.from(
        slider.querySelectorAll<HTMLElement>("[data-marquee-copy]"),
      );

      let xPercent = 0;
      let direction = -1;
      let lastY = window.scrollY;
      let frame = 0;

      const tick = () => {
        // Wrap before writing, so a copy is always covering the seam.
        if (xPercent < -100) xPercent = 0;
        else if (xPercent > 0) xPercent = -100;
        gsap.set(items, { xPercent });
        xPercent += marquee.speed * direction;
        frame = requestAnimationFrame(tick);
      };

      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - lastY;
        // Ignore sub-pixel jitter, which would otherwise flip direction madly.
        if (Math.abs(delta) > 0.5) direction = delta > 0 ? -1 : 1;
        lastY = y;

        gsap.to(slider, {
          x: -Math.min(
            marquee.maxShift,
            (y / window.innerHeight) * marquee.maxShift,
          ),
          duration: 0.6,
          ease: ease.softOut,
          overwrite: "auto",
        });
      };

      // Lenis writes scrollTop on the document, so a plain scroll listener sees
      // smooth-scrolled movement without any bridging.
      window.addEventListener("scroll", onScroll, { passive: true });
      frame = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
      };
    }, sliderRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const copyClass = `flex-none pr-[0.5em] ${className ?? ""}`;

  return (
    <div
      ref={sliderRef}
      className="flex whitespace-nowrap will-change-transform"
    >
      <h1 data-marquee-copy className={copyClass}>
        {text}
      </h1>
      {Array.from({ length: copies - 1 }, (_, i) => (
        <span key={i} aria-hidden="true" data-marquee-copy className={copyClass}>
          {text}
        </span>
      ))}
    </div>
  );
}
