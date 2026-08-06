"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion`, and keeps tracking it — users can flip the
 * OS setting mid-session and every timeline should honour it immediately.
 *
 * Returns `false` during SSR and the first paint so markup matches on hydration;
 * effects that gate on it run after mount anyway.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
