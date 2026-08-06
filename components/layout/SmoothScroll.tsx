"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/**
 * Mounts Lenis for the document. Renders nothing, so the root layout stays a
 * server component and only this leaf ships to the client.
 */
export function SmoothScroll() {
  useSmoothScroll();
  return null;
}
