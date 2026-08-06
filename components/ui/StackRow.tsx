"use client";

import { useEffect, useRef } from "react";
import type { StackCategory } from "@/types";

/** Tolerance for "same line" — offsetTop wobbles by a sub-pixel on some fonts. */
const LINE_EPSILON = 2;

/**
 * One category of the tech stack: a mono label beside its chips, divided from
 * the row above by a hairline.
 *
 * Row heights are equalised by the parent's
 * `grid-template-rows: repeat(4, minmax(min-content, 1fr))`, not by measurement
 * — a row that wraps to two lines still occupies the same height as one that
 * does not, so the dividers stay evenly spaced.
 *
 * Type sizes are in `cqw`, so the row reads against the width of its own
 * column and the 900px collapse needs no second set of breakpoints.
 */
export function StackRow({ label, items }: StackCategory) {
  const chipsRef = useRef<HTMLDivElement>(null);

  // A separator earns its place only between two chips on the same line. When
  // wrapping puts a chip first on a line, its leading bar has nothing to
  // separate it from and reads as a stray mark against the column edge.
  useEffect(() => {
    const chips = chipsRef.current;
    if (!chips) return;

    let cancelled = false;

    const trim = () => {
      if (cancelled) return;
      const groups = Array.from(chips.children) as HTMLElement[];

      // Restore every bar before measuring: the widths that decide where lines
      // break have to be the widths with all separators present.
      for (const group of groups) {
        const bar = group.querySelector<HTMLElement>("[data-separator]");
        if (bar) bar.hidden = false;
      }

      let lineTop: number | null = null;
      for (const group of groups) {
        const top = group.offsetTop;
        if (lineTop === null || top > lineTop + LINE_EPSILON) {
          lineTop = top;
          const bar = group.querySelector<HTMLElement>("[data-separator]");
          if (bar) bar.hidden = true;
        }
      }
    };

    // Width is the only thing that changes where chips wrap. Watching height
    // too would loop, since hiding a bar can change the container's height.
    let lastWidth = 0;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      if (width === lastWidth) return;
      lastWidth = width;
      trim();
    });
    observer.observe(chips);

    // Space Mono swapping in re-measures every chip without resizing the
    // container, so the observer alone would never hear about it.
    document.fonts?.ready.then(trim);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [items]);

  return (
    <div className="grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-[clamp(16px,2.4cqw,40px)] border-ink py-[clamp(18px,2.6cqw,34px)] not-first:border-t">
      <div className="font-mono text-[max(12px,min(20px,4.2cqw))] font-bold tracking-[0.02em] whitespace-nowrap uppercase">
        {label}
      </div>

      <div
        ref={chipsRef}
        className="flex flex-wrap items-center gap-x-[11px] gap-y-2.5 font-mono text-[max(13px,min(24px,5cqw))] tracking-[0.01em] text-muted-strong"
      >
        {items.map((item, index) =>
          index === 0 ? (
            <span key={item} className="whitespace-nowrap">
              {item}
            </span>
          ) : (
            <span
              key={item}
              className="inline-flex items-center gap-3 whitespace-nowrap"
            >
              <span
                aria-hidden="true"
                data-separator
                className="h-[1.1em] w-px flex-none bg-hairline"
              />
              <span>{item}</span>
            </span>
          ),
        )}
      </div>
    </div>
  );
}
