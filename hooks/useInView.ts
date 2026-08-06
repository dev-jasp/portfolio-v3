"use client";

import { useEffect, useState, type RefObject } from "react";
import { reveal } from "@/lib/design/motion";

type Options = {
  threshold?: number;
  rootMargin?: string;
  /** Stop observing after the first intersection. Entrances never replay. */
  once?: boolean;
};

/**
 * Reports whether an element has entered the viewport.
 *
 * Deliberately has no timeout fallback: IntersectionObserver is universally
 * supported, and a blanket "reveal everything after N ms" safety net — like the
 * one in the source design file — defeats the entrance for anything below the
 * fold. Elements already in view on mount resolve on the observer's first,
 * synchronous callback.
 */
export function useInView(
  ref: RefObject<HTMLElement | null>,
  {
    threshold = reveal.threshold,
    rootMargin = reveal.rootMargin,
    once = true,
  }: Options = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return inView;
}
