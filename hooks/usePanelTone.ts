"use client";

import { useEffect, useState, type RefObject } from "react";
import { DARK_PANEL_ATTR } from "@/lib/design/tokens";

/**
 * Reports whether `ref`'s centre point currently sits over a dark panel.
 *
 * The pill is `position: fixed`, so it passes over sections rather than
 * scrolling with them — hit-testing its centre against every `[data-dark-panel]`
 * rect is both cheaper and more accurate than observing the sections.
 *
 * Pass `enabled: false` while the menu is open: the panel is white regardless,
 * and its geometry is mid-transition so any measurement would be noise.
 */
export function usePanelTone(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
): boolean {
  const [onDark, setOnDark] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const panels = document.querySelectorAll<HTMLElement>(
        `[${DARK_PANEL_ATTR}]`,
      );
      const isOverDark = Array.from(panels).some((panel) => {
        const panelRect = panel.getBoundingClientRect();
        return (
          y >= panelRect.top &&
          y <= panelRect.bottom &&
          x >= panelRect.left &&
          x <= panelRect.right
        );
      });

      setOnDark(isOverDark);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, enabled]);

  return onDark;
}
