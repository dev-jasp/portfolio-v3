"use client";

import { useEffect, useId, useRef, useState } from "react";
import { navLinks } from "@/lib/constants";
import { durationMs, easeCss } from "@/lib/design/motion";
import { menu } from "@/lib/design/tokens";

/** The properties that carry the pill -> panel morph. */
const MORPHED = ["width", "height", "top", "right", "border-radius", "padding"];

/** Closing starts late so the panel visibly shrinks before the corner travels. */
const CLOSE_DELAY_MS = 120;

const BAR =
  "absolute top-1/2 left-1/2 -mt-px -ml-[11px] block h-0.5 w-[22px] bg-ink transition-[transform,background] duration-[420ms] ease-morph";

/**
 * The nav is one element in two states: a 46px pill in the corner, and a panel
 * anchored to the top-right. Nothing is swapped out — width, height, offsets,
 * radius and padding are all transitioned, which is what makes it read as one
 * object growing rather than two things cross-fading.
 *
 * TODO(nav): link stagger on open/close, outlined social circles, the
 * Collaborate card, and pill tone inversion over light sections.
 */
export function Menu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const geometry = open ? menu.open : menu.closed;

  const transition = [
    ...MORPHED.map(
      (prop) =>
        `${prop} ${open ? durationMs.open : durationMs.close}ms ${easeCss.morph} ${open ? 0 : CLOSE_DELAY_MS}ms`,
    ),
    `background ${durationMs.bars}ms ease`,
  ].join(", ");

  // The page must not scroll under the panel. `overflow` alone doesn't do it
  // while Lenis is driving — Lenis reads wheel events, not the scrollbar — so
  // the panel and backdrop also carry `data-lenis-prevent`.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes and hands focus back, wherever focus happened to be.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        data-lenis-prevent
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-94 bg-[rgba(20,20,20,0.28)] backdrop-blur-[10px] transition-opacity duration-500 ease-linear"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <div
        id={panelId}
        data-lenis-prevent
        className="fixed z-95 flex flex-col overflow-hidden bg-paper text-ink"
        style={{ ...geometry, transition }}
      >
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          className="absolute top-0 right-0 z-10 size-[46px] cursor-pointer"
        >
          <span
            aria-hidden="true"
            className={BAR}
            style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
          />
          <span
            aria-hidden="true"
            className={BAR}
            style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
          />
        </button>

        {/*
          Clipped by the closed pill, but clipping is only visual — `inert`
          keeps the links out of the tab order and the accessibility tree
          until the panel is actually open.
        */}
        <nav inert={!open} className="mt-[22px] flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="indent-link gap-[14px] text-[clamp(28px,3.4vw,40px)] leading-[1.3] font-medium tracking-[-0.03em]"
            >
              <span
                aria-hidden="true"
                className="size-[9px] flex-none rounded-full bg-accent"
              />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
