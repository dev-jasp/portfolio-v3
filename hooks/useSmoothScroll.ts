"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Mounts Lenis and hands anchor navigation over to it.
 *
 * Lenis scrolls the document natively (it writes `scrollTop`), so plain
 * `scroll` listeners — the marquee, the work-card scaling, the menu tone
 * probe — keep firing without any bridging.
 *
 * Skipped entirely under reduced motion, which leaves native scrolling and
 * the CSS `scroll-behavior: auto` fallback in charge.
 */
export function useSmoothScroll(): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Long, flat tail — matches the --ease-reveal feel of the entrances.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Route in-page anchors through Lenis so they land with the same easing.
    //
    // Resolved against the current URL rather than matched as a string: the nav
    // writes its destinations root-relative (`/#work`), because a bare `#work`
    // points at nothing from a case study route. On the home page those two
    // spellings mean the same element and both belong to Lenis; anywhere else
    // the pathname differs and the click is a real navigation, so it is left
    // alone.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname !== location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
      history.replaceState(null, "", url.hash);
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [reducedMotion]);
}
