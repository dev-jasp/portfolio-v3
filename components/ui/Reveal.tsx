"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useEntranceReleased } from "@/hooks/useEntrance";
import { useInView } from "@/hooks/useInView";
import { easeCss, reveal } from "@/lib/design/motion";

type Props = {
  children: ReactNode;
  /**
   * Milliseconds. Siblings in one group cascade by `reveal.stepMs`; pass the
   * delay explicitly rather than relying on DOM order.
   */
  delayMs?: number;
  /**
   * Override the entrance trigger. The defaults hold an entrance back until an
   * element is properly on screen, which is wrong for anything that sits at the
   * bottom edge of a full-height panel: the negative bottom margin means it can
   * never reach the threshold without scrolling. Those pass `threshold={0}` and
   * `rootMargin="0px"` so they play as soon as any of them is visible.
   */
  threshold?: number;
  rootMargin?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Entrance wrapper: fades and lifts its children once, when they first cross
 * into view.
 *
 * The transition is CSS rather than GSAP so that the `[data-reveal]` rule in
 * `globals.css` can resolve it to its end state under `prefers-reduced-motion`
 * without JavaScript needing to know.
 *
 * Held shut until the opening curtain lifts. `IntersectionObserver` has no idea
 * anything is painted over it, so on a cold load every entrance on the first
 * screen would otherwise play behind the sheet and the page would arrive
 * already revealed. The observer is untouched — only the moment its result is
 * applied moves. See `useEntranceReleased`.
 */
export function Reveal({
  children,
  delayMs = 0,
  threshold,
  rootMargin,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold, rootMargin });
  const released = useEntranceReleased();
  const shown = inView && released;

  const transition = `opacity ${reveal.durationMs}ms ${easeCss.reveal} ${delayMs}ms, transform ${reveal.durationMs}ms ${easeCss.reveal} ${delayMs}ms`;

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${reveal.distance}px)`,
        transition,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
