"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePanelTone } from "@/hooks/usePanelTone";
import { IconCircle } from "@/components/ui/IconCircle";
import { navLinks, socials } from "@/lib/constants";
import { durationMs, easeCss, menuLinks } from "@/lib/design/motion";
import { color, menu } from "@/lib/design/tokens";

/** The properties that carry the pill -> panel morph. */
const MORPHED = ["width", "height", "top", "right", "border-radius", "padding"];

/** Closing starts late so the panel visibly shrinks before the corner travels. */
const CLOSE_DELAY_MS = 120;

/** Content leaves fast, well before the panel has finished shrinking. */
const CONTENT_FADE_OUT_MS = 140;

const BAR = "absolute top-1/2 left-1/2 -mt-px -ml-[11px] block h-0.5 w-[22px]";

/**
 * The nav is one element in two states: a 46px pill in the corner, and a panel
 * anchored to the top-right. Nothing is swapped out — width, height, offsets,
 * radius and padding are all transitioned, which is what makes it read as one
 * object growing rather than two things cross-fading.
 *
 * TODO(nav): link stagger on open/close, and the Collaborate card at the
 * panel's foot.
 */
export function Menu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Measuring is pointless while open — the panel is white regardless, and its
  // geometry is mid-transition, so any reading would be noise.
  const onDark = usePanelTone(panelRef, !open);

  // Open, the panel is always paper with ink bars. Closed, the pill inverts
  // against whatever it happens to be sitting over.
  const paperToned = open || onDark;

  const geometry = open ? menu.open : menu.closed;

  const transition = [
    ...MORPHED.map(
      (prop) =>
        `${prop} ${open ? durationMs.open : durationMs.close}ms ${easeCss.morph} ${open ? 0 : CLOSE_DELAY_MS}ms`,
    ),
    `background ${durationMs.bars}ms ease`,
  ].join(", ");

  // The collapsed pill clips the content but does not hide it — the first link
  // starts 22px down, so its top 24px would sit inside the 46px pill. The
  // content needs a closed state of its own.
  const contentTransition = open
    ? `opacity ${durationMs.linkIn}ms ${easeCss.reveal} ${menuLinks.baseDelayMs}ms`
    : `opacity ${CONTENT_FADE_OUT_MS}ms ease`;

  // Bars rotate on the morph curve but swap tone on a plain ease — the two are
  // different kinds of change and shouldn't share a curve.
  const barTransition = `transform ${durationMs.bars}ms ${easeCss.morph}, background ${durationMs.bars}ms ease`;

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
        ref={panelRef}
        id={panelId}
        data-lenis-prevent
        className="fixed z-95 flex flex-col overflow-hidden text-ink"
        style={{
          ...geometry,
          transition,
          background: paperToned ? color.paper : color.ink,
        }}
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
            style={{
              transform: open ? "rotate(45deg)" : "translateY(-4px)",
              background: paperToned ? color.ink : color.paper,
              transition: barTransition,
            }}
          />
          <span
            aria-hidden="true"
            className={BAR}
            style={{
              transform: open ? "rotate(-45deg)" : "translateY(4px)",
              background: paperToned ? color.ink : color.paper,
              transition: barTransition,
            }}
          />
        </button>

        {/*
          Everything below is clipped by the closed pill, but clipping is only
          visual — `inert` keeps it all out of the tab order and the
          accessibility tree until the panel is actually open.
        */}
        <div
          inert={!open}
          className="flex flex-1 flex-col"
          style={{ opacity: open ? 1 : 0, transition: contentTransition }}
        >
          <nav className="mt-[22px] flex flex-col gap-0.5">
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

          {/* Pushes the socials to the panel's foot, whatever the link count. */}
          <div className="flex-1" />

          <div className="mb-[22px] flex flex-wrap items-center justify-end gap-5">
            <div className="flex gap-2.5">
              {socials.map((social) => (
                <IconCircle key={social.platform} {...social} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
