"use client";

import { useEffect, type RefObject } from "react";
import { workCard } from "@/lib/design/tokens";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Scales an element toward 1 as it approaches the vertical centre of the
 * viewport, and lets it recede as it leaves.
 *
 * `t` is the element's distance from centre normalised against the furthest it
 * can be while still on screen, so the curve is resolution-independent. It is
 * squared so the card sits near full size through the middle of its travel and
 * falls away quickly at the edges.
 */
export function useScrollScale(ref: RefObject<HTMLElement | null>): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (reducedMotion) {
      element.style.transform = "";
      element.style.opacity = "";
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const distance = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
      const span = viewportHeight / 2 + rect.height / 2;
      const t = Math.min(1, distance / span);
      const eased = t * t;

      element.style.transform = `scale(${1 - eased * (1 - workCard.minScale)})`;
      element.style.opacity = String(1 - eased * (1 - workCard.minOpacity));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, reducedMotion]);
}
