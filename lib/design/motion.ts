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

/** Menu link stagger, in and out. */
export const menuLinks = {
  baseDelayMs: 180,
  stepMs: 70,
  enter: `opacity ${durationMs.linkIn}ms ${easeCss.reveal}, transform 560ms ${easeCss.reveal}, padding ${durationMs.indent}ms ease`,
  exit: `opacity 140ms ease, transform 200ms ${easeCss.exit}, padding ${durationMs.indent}ms ease`,
  offset: 34,
} as const;
