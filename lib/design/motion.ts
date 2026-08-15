/**
 * Motion scales — the timing half of the design system.
 *
 * Four eases, each with one job. If a new animation doesn't fit one of them,
 * that's a signal the animation is wrong, not that the scale needs a fifth.
 */

/** CSS `cubic-bezier(...)` strings, for inline styles and transitions. */
export const easeCss = {
  reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
  morph: "cubic-bezier(0.76, 0, 0.24, 1)",
  lift: "cubic-bezier(0.33, 1, 0.68, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

/** GSAP named eases. Chosen to match the CSS curves above as closely as GSAP's set allows. */
export const ease = {
  out: "power3.out",
  inOut: "power3.inOut",
  softOut: "power2.out",
  softIn: "power2.in",
  linear: "none",
} as const;

/** Milliseconds — for CSS transitions and `setTimeout`. */
export const durationMs = {
  tone: 240,
  indent: 300,
  bars: 420,
  linkIn: 460,
  close: 520,
  open: 750,
  reveal: 780,
} as const;

/** Seconds — for GSAP, which takes durations in seconds. */
export const duration = {
  tone: 0.24,
  bars: 0.42,
  close: 0.52,
  open: 0.75,
  reveal: 0.78,
} as const;

/** Reveal defaults, shared by the `Reveal` component and the stack timeline. */
export const reveal = {
  distance: 26,
  durationMs: durationMs.reveal,
  /** Cascade applied to siblings that don't set an explicit delay. */
  stepMs: 90,
  /** Fraction of the element that must be visible before it plays. */
  threshold: 0.15,
  rootMargin: "0px 0px -8% 0px",
} as const;

/**
 * The opening curtain — see `components/layout/Loader.tsx`.
 *
 * Split by unit on purpose: the two waits are milliseconds because they are
 * `setTimeout`s, and everything the timeline touches is seconds because that is
 * what GSAP takes.
 *
 * The panels' overscan is *not* here. It is a structural fact about the sheet
 * rather than a timing one, it lives in `.loader__panel`, and GSAP keeps it
 * automatically — the lift tweens `yPercent` and `rotation`, and reading the
 * existing matrix to do that preserves the scale already in it.
 */
export const loader = {
  /** Columns the sheet is cut into. The markup loops over this; CSS just flexes. */
  panels: 4,
  /** Degrees the columns tilt through as they leave. */
  tilt: -6,
  /**
   * Extra travel on top of the panel's own height, so it leaves completely.
   *
   * The tilt drops the trailing bottom corner below the rest of the edge by
   * half the column's width times the sine of the angle — about 1.4vw at 6deg
   * across four columns. Travelling exactly one panel height therefore ends
   * with that corner still on screen, and it stays there until the component
   * unmounts, which reads as the curtain stalling just before it vanishes.
   *
   * In `vw` because the drop is a share of the column's *width*, which makes it
   * one number at every window shape — unlike the bleed, which is a share of
   * the height and is measured in `vh` for the same reason.
   */
  clearance: "-3vw",
  /** Shortest the curtain may stay up, so a warm reload never flashes it. */
  minMs: 1200,
  /** Longest it may wait on fonts before lifting anyway. */
  maxMs: 3600,
  /** Where the meter stalls while it is still waiting. */
  crawlTo: 0.92,
  /** Seconds: the meter's run from `crawlTo` to full, once the page is ready. */
  settle: 0.3,
  lift: { duration: 0.95, stagger: 0.07 },
  /**
   * Seconds before the lift ends that the page below is allowed to start its
   * own entrances, so the two overlap instead of queueing.
   */
  handoff: 0.6,
} as const;

/** Menu link stagger, in and out. */
export const menuLinks = {
  baseDelayMs: 180,
  stepMs: 70,
  enter: `opacity ${durationMs.linkIn}ms ${easeCss.reveal}, transform 560ms ${easeCss.reveal}, padding ${durationMs.indent}ms ease`,
  exit: `opacity 140ms ease, transform 200ms ${easeCss.exit}, padding ${durationMs.indent}ms ease`,
  offset: 34,
} as const;
