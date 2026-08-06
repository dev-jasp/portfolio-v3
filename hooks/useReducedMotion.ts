"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** The server can't know the preference; `false` keeps hydration consistent. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Tracks `prefers-reduced-motion`, and keeps tracking it — users can flip the
 * OS setting mid-session and every timeline should honour it immediately.
 *
 * Read through `useSyncExternalStore` rather than state-in-an-effect so the
 * value is already correct on the first client render. Settling a frame later
 * would let `useSmoothScroll` mount Lenis and immediately tear it down again
 * for exactly the users who asked for less motion.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
