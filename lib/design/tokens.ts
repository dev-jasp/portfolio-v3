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
    height: "min(660px, calc(100vh - 24px))",
    borderRadius: "26px",
    padding: "36px 36px 30px",
  },
} as const;

/** Work cards shrink to this scale at their furthest from viewport centre. */
export const workCard = {
  minScale: 0.86,
  minOpacity: 0.65,
} as const;

/** Hero marquee: per-frame drift and the maximum scroll-driven offset. */
export const marquee = {
  speed: 0.03,
  maxShift: 220,
} as const;
