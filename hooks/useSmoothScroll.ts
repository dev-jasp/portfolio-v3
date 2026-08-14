"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

// Registered here as well as in `About`, because this hook mounts on every
// route and `About` only exists on one of them. Registration is idempotent.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Mounts Lenis and hands anchor navigation over to it.
 *
 * Lenis scrolls the document natively (it writes `scrollTop`), so plain
 * `scroll` listeners — the work-card scaling, the menu tone probe — keep firing
 * without any bridging.
 *
 * ScrollTrigger is bridged all the same. Left to its own listener it would
 * read the scroll position one frame late, which is invisible on a fade and
 * very visible on the About reel, where the sticky viewport holds still while
 * its track is written every frame: a frame of disagreement there is a frame
 * of the track sliding against a background that hasn't moved yet. Driving
 * Lenis from GSAP's ticker puts both on the same clock, and `ScrollTrigger
 * .update` on Lenis's own event means the triggers read the position Lenis has
 * just written rather than the one the browser will report next frame.
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

    lenis.on("scroll", ScrollTrigger.update);

    // GSAP's ticker replaces Lenis's own rAF loop rather than running beside
    // it, so there is exactly one loop and a fixed order within the frame:
    // Lenis writes the scroll position, then everything GSAP drives reads it.
    // The ticker deals in seconds; Lenis wants milliseconds.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    // Lag smoothing exists to keep long tweens from jumping after the tab was
    // starved of frames. Applied to a scroll loop it does the opposite: the
    // clamped delta makes Lenis fall behind the real scroll position and then
    // catch up in a lurch.
    gsap.ticker.lagSmoothing(0);

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
      gsap.ticker.remove(raf);
      // GSAP's own defaults, restored — the ticker is global, and a reduced-
      // motion switch mid-session tears this hook down without taking the rest
      // of the page's tweens with it.
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", ScrollTrigger.update);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, [reducedMotion]);
}
