"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ease } from "@/lib/design/motion";
import { color } from "@/lib/design/tokens";
import { ArrowIcon } from "./Icons";

/** Left margin the arrow slot gains as it opens, on top of the arrow's width. */
const ARROW_GAP = 12;

/**
 * One button at three scales. Every call site is on `sm` — the page settled on
 * a single button size, and the two larger steps stayed rather than being
 * deleted: the sizes are a scale, and a scale with one rung is a constant.
 */
const sizes = {
  sm: { pill: "px-[22px] py-[13px] text-[15px]", dot: 8, labelGap: 12, arrow: 16 },
  md: { pill: "px-8 py-[18px] text-[17px]", dot: 10, labelGap: 14, arrow: 19 },
  lg: { pill: "px-[38px] py-[21px] text-[21px]", dot: 12, labelGap: 16, arrow: 22 },
} as const;

type Props = {
  href: string;
  label: string;
  size?: keyof typeof sizes;
  /**
   * Which background the button sits on. `onDark` rests as a paper pill,
   * `onLight` as an ink one — either way the accent covers it on hover, so
   * only the resting state differs.
   */
  tone?: "onDark" | "onLight";
  /**
   * `arrow` is the full button: dot, label, and a slot that opens for the
   * arrow on hover. `fill` is a centred label on its own, for places where
   * the button is a quiet link rather than the section's call to action —
   * with no dot to spread, the pill takes the accent directly.
   *
   * `sweep` is the same weight as `arrow` and a different gesture: its arrow
   * is out from the start, the accent crosses the pill instead of spreading
   * from a point, and the arrow advances a place as it passes. It is for a
   * button that *leaves* — one that hands you to another page rather than
   * moving you down this one — which is why the arrow is a promise at rest
   * rather than a reward for hovering.
   */
  variant?: "arrow" | "fill" | "sweep";
  /**
   * Opens in a new tab, on the same terms as the social icons: a button that
   * leaves the site shouldn't take the case study with it.
   */
  external?: boolean;
};

/**
 * The button arrives at the accent on hover, by one of three routes. In `arrow`
 * the dot spreads from its own centre until it covers the pill and a collapsed
 * slot opens to let the arrow slide in; in `sweep` a block of accent crosses
 * the pill from the left while the arrow advances a place; in `fill` the pill
 * simply takes the colour. The label inverts to paper every time.
 *
 * **Every hover is reversible mid-flight.** Each one is a single property
 * moving between two fixed values, so a pointer that leaves halfway retargets
 * rather than restarting — the dot measures its cover from a box that doesn't
 * scale, and the sweep slides rather than flipping an origin.
 *
 * Structure lives in `.arrow-btn*` in `globals.css`; every animated property
 * belongs to GSAP so the two never fight over the same declaration.
 */
export function ArrowButton({
  href,
  label,
  size = "md",
  tone = "onDark",
  variant = "arrow",
  external = false,
}: Props) {
  const withArrow = variant === "arrow";
  const withSweep = variant === "sweep";
  /** Both of the full-weight variants lead with the accent dot. */
  const withDot = withArrow || withSweep;
  const rootRef = useRef<HTMLAnchorElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const dotSlotRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowSlotRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const relayRef = useRef<HTMLSpanElement>(null);

  const reducedMotion = useReducedMotion();
  const { pill, dot, labelGap, arrow: arrowWidth } = sizes[size];

  // The label reads against the pill at rest and against the accent on hover.
  // Only the first of those depends on the tone — the accent is dark enough to
  // take paper text either way.
  const restColor = tone === "onLight" ? color.paper : color.ink;

  // Mirrors `.arrow-btn__pill`. Only `fill` animates the pill itself, and it
  // has to know the colour to come back to.
  const restBackground = tone === "onLight" ? color.ink : color.paper;

  useEffect(() => {
    const root = rootRef.current;
    const pillEl = pillRef.current;
    const labelEl = labelRef.current;
    // All four are null in the `fill` variant, which renders the label alone —
    // every tween that touches them is guarded rather than assumed.
    const dotSlotEl = dotSlotRef.current;
    const dotEl = dotRef.current;
    const slotEl = arrowSlotRef.current;
    const arrowEl = arrowRef.current;
    const sweepEl = sweepRef.current;
    const relayEl = relayRef.current;
    if (!root || !pillEl || !labelEl) return;

    /** The slot inverts alongside the label; `fill` has only the label. */
    const toneTargets = slotEl ? [labelEl, slotEl] : [labelEl];

    const ctx = gsap.context((self) => {
      if (arrowEl) gsap.set(arrowEl, { opacity: 0 });

      // The sweep's resting position is a percentage in CSS, so that the first
      // paint has it parked outside the pill without waiting for this effect.
      // GSAP cannot read it back as one: it parses the computed matrix, which
      // is pixels by then, and records `x: -242, xPercent: 0`. Tweening
      // `xPercent` from there would move nothing and the accent would never
      // arrive. Both axes are written for the same reason `AvatarSocials`
      // writes both of its own — naming one leaves the other's value standing.
      if (sweepEl) gsap.set(sweepEl, { x: 0, xPercent: -100 });

      /**
       * Measured from the dot's *slot*, not the dot. The dot is the thing GSAP
       * scales, so reading its own box mid-tween would compute a smaller cover
       * on re-entry than entering from rest does.
       */
      const coverScale = (slot: HTMLElement) => {
        const p = pillEl.getBoundingClientRect();
        const d = slot.getBoundingClientRect();
        // The pill widens by `grow` as the slot opens. The dot sits off
        // centre, so the far corner recedes by the full width gained.
        const grow = slotEl?.offsetWidth === 0 ? arrowWidth + ARROW_GAP : 0;
        const cx = d.left + d.width / 2;
        const cy = d.top + d.height / 2;
        const far = Math.hypot(
          Math.max(cx - p.left + grow, p.right - cx + grow),
          Math.max(cy - p.top, p.bottom - cy),
        );
        return ((2 * far) / d.width) * 1.08;
      };

      // Reduced motion keeps the state change — hover still reads as hover —
      // and drops only the travel.
      const t = (seconds: number) => (reducedMotion ? 0 : seconds);

      // Tween order matters: the colour tween overwrites whatever exists when
      // it is created, so the slot's width tween has to be created after it.
      const enter = () => {
        self.add(() => {
          // Three routes to the same colour: the dot spreads over the pill in
          // `arrow`, a block crosses it in `sweep`, and in `fill` — which has
          // neither — the pill takes the colour itself over the same beat.
          if (variant === "arrow" && dotEl && dotSlotEl) {
            gsap.to(dotEl, {
              scale: coverScale(dotSlotEl),
              duration: t(0.72),
              ease: ease.inOut,
              overwrite: true,
            });
          } else if (variant === "sweep" && sweepEl) {
            gsap.to(sweepEl, {
              xPercent: 0,
              duration: t(0.54),
              ease: ease.out,
              overwrite: true,
            });
          } else {
            gsap.to(pillEl, {
              backgroundColor: color.accent,
              duration: t(0.4),
              ease: ease.out,
              overwrite: true,
            });
          }
          gsap.to(toneTargets, {
            color: color.paper,
            duration: t(0.34),
            delay: t(0.1),
            ease: ease.linear,
            overwrite: true,
          });
          // The relay advances one arrow: the one on show leaves to the right
          // and its twin arrives from the left, a beat behind the accent that
          // is crossing under it.
          if (relayEl) {
            gsap.to(relayEl, {
              x: 0,
              duration: t(0.52),
              delay: t(0.06),
              ease: ease.out,
              overwrite: true,
            });
          }
          if (!slotEl || !arrowEl) return;
          gsap.to(slotEl, {
            width: arrowWidth,
            marginLeft: ARROW_GAP,
            duration: t(0.5),
            delay: t(0.12),
            ease: ease.out,
            overwrite: "auto",
          });
          gsap.fromTo(
            arrowEl,
            { x: -10, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: t(0.44),
              delay: t(0.2),
              ease: ease.out,
              overwrite: true,
            },
          );
        });
      };

      const leave = () => {
        self.add(() => {
          if (variant === "arrow" && dotEl) {
            gsap.to(dotEl, {
              scale: 1,
              duration: t(0.62),
              ease: ease.inOut,
              overwrite: true,
            });
          } else if (variant === "sweep" && sweepEl) {
            // Back the way it came, not onward off the right edge. Continuing
            // reads better in isolation and cannot survive interruption: it
            // would have to jump the block back to the left before the next
            // hover, and a pointer that keeps crossing the button would see
            // exactly that jump.
            gsap.to(sweepEl, {
              xPercent: -100,
              duration: t(0.46),
              ease: ease.inOut,
              overwrite: true,
            });
          } else {
            gsap.to(pillEl, {
              backgroundColor: restBackground,
              duration: t(0.36),
              ease: ease.out,
              overwrite: true,
            });
          }
          gsap.to(toneTargets, {
            color: restColor,
            duration: t(0.3),
            delay: t(0.16),
            ease: ease.linear,
            overwrite: true,
          });
          if (relayEl) {
            gsap.to(relayEl, {
              x: -arrowWidth,
              duration: t(0.44),
              ease: ease.inOut,
              overwrite: true,
            });
          }
          if (!slotEl || !arrowEl) return;
          gsap.to(slotEl, {
            width: 0,
            marginLeft: 0,
            duration: t(0.42),
            ease: ease.inOut,
            overwrite: "auto",
          });
          gsap.to(arrowEl, {
            x: -8,
            opacity: 0,
            duration: t(0.26),
            ease: ease.softIn,
            overwrite: true,
          });
        });
      };

      root.addEventListener("mouseenter", enter);
      root.addEventListener("mouseleave", leave);
      // Keyboard users get the same affordance the pointer does.
      root.addEventListener("focus", enter);
      root.addEventListener("blur", leave);

      return () => {
        root.removeEventListener("mouseenter", enter);
        root.removeEventListener("mouseleave", leave);
        root.removeEventListener("focus", enter);
        root.removeEventListener("blur", leave);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, arrowWidth, restColor, restBackground, variant]);

  return (
    <a
      ref={rootRef}
      href={href}
      className="arrow-btn"
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span
        ref={pillRef}
        className={`arrow-btn__pill ${pill} ${
          tone === "onLight" ? "arrow-btn__pill--ink" : ""
        } ${withDot ? "" : "justify-center text-center"}`}
      >
        {/* First child, and unpositioned relative to its siblings: the dot and
            the label both establish a stacking order after it, so the accent
            crosses *under* everything the button says. */}
        {withSweep && <span ref={sweepRef} className="arrow-btn__sweep" />}

        {withDot && (
          <span
            ref={dotSlotRef}
            className="arrow-btn__dot-slot"
            // The slot carries the size, not the dot: the dot is absolute and
            // scaling, so the box the cover is measured from has to be this
            // one.
            style={{ width: dot, height: dot }}
          >
            <span ref={dotRef} className="arrow-btn__dot" />
          </span>
        )}
        {/* The gap belongs to the dot. Without one the label is alone between
            equal paddings, which is the centring — nothing to offset. */}
        <span
          ref={labelRef}
          className="arrow-btn__label"
          style={withDot ? { marginLeft: labelGap } : undefined}
        >
          {label}
        </span>
        {withArrow && (
          <span ref={arrowSlotRef} className="arrow-btn__arrow-slot">
            <ArrowIcon ref={arrowRef} size={arrowWidth} />
          </span>
        )}
        {withSweep && (
          <span
            ref={arrowSlotRef}
            className="arrow-btn__arrow-slot"
            // Open from the start and exactly one arrow wide — the inline
            // width is what overrides the collapsed slot `arrow` needs. It
            // shares that class, and the ref, to invert with the label.
            style={{ width: arrowWidth, marginLeft: ARROW_GAP }}
          >
            <span
              ref={relayRef}
              className="arrow-btn__relay"
              // Parked one arrow to the left, so the twin is the one on show
              // and the first has room to arrive from outside the slot.
              style={{ transform: `translateX(${-arrowWidth}px)` }}
            >
              <ArrowIcon size={arrowWidth} />
              <ArrowIcon size={arrowWidth} />
            </span>
          </span>
        )}
      </span>
    </a>
  );
}
