"use client";

import { useCallback, useSyncExternalStore } from "react";

/** The server can't measure a viewport; `false` keeps hydration consistent. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks a media query live, the same way `useReducedMotion` tracks its own.
 *
 * Read through `useSyncExternalStore` rather than state-in-an-effect: React
 * uses the server snapshot for the hydrating render and swaps in the real one
 * immediately after, so a layout that switches on this can never hydrate
 * against a value it disagrees with.
 *
 * **A layout breakpoint belongs here only when JavaScript owns the layout.**
 * Everything the page can express in CSS stays in CSS — this exists for
 * `About`, whose horizontal reel is a GSAP rig that has to be built or not
 * built, not a set of classes that can simply stop applying.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
