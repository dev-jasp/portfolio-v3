/**
 * Design tokens mirrored from `app/globals.css` for JavaScript consumers.
 *
 * GSAP tweens raw values, not CSS custom properties, so any token an
 * animation needs is duplicated here. CSS remains the source of truth for
 * anything rendered — change a value there first, then mirror it.
 */

export const color = {
  ink: "#000000",
  paper: "#ffffff",
  accent: "#f3350c",
  surface: "#efefef",
  hairline: "#c9c9c9",
  onDarkMuted: "#d6d6d6",
  muted: "#9a9a9a",
  mutedStrong: "#8e8e8e",
  mutedDeep: "#6f6f6f",
} as const;

export const radius = {
  frame: 14,
  card: 22,
  pillSm: 23,
  panelSm: 26,
  panel: 28,
} as const;

/**
 * Menu pill geometry. The closed pill and the open panel are the same
 * element, so both states are described together.
 */
export const menu = {
  closed: {
    top: "30px",
    right: "34px",
    width: "46px",
    height: "46px",
    borderRadius: "23px",
    padding: "0px",
  },
  open: {
    top: "12px",
    right: "12px",
    width: "min(560px, 92vw)",
    // `svh`, not `vh`: on mobile `100vh` is the viewport with browser chrome
    // retracted, so a `vh`-sized panel is taller than the screen it opens on
    // and its footer sits under the address bar.
    height: "min(660px, calc(100svh - 24px))",
    borderRadius: "26px",
    padding: "36px 36px 30px",
  },
} as const;

/** Work cards shrink to this scale at their furthest from viewport centre. */
export const workCard = {
  minScale: 0.86,
  minOpacity: 0.65,
} as const;

/**
 * Marks a section the closed menu pill has to invert against.
 *
 * Lives here rather than beside `usePanelTone` because the panels that carry it
 * are server components: a plain value exported from a `"use client"` module
 * becomes a client reference and never arrives as a real object, so the
 * attribute silently fails to render.
 */
export const DARK_PANEL_ATTR = "data-dark-panel";

/**
 * Spread onto any panel the pill must invert against.
 *
 * Written as props rather than a literal attribute at each usage site so the
 * markup and the query that looks for it cannot drift apart — a mismatch there
 * fails silently, as a pill that simply never inverts.
 */
export const darkPanelProps: Record<string, string> = { [DARK_PANEL_ATTR]: "" };

/** Hero marquee: per-frame drift and the maximum scroll-driven offset. */
export const marquee = {
  speed: 0.03,
  maxShift: 220,
} as const;
