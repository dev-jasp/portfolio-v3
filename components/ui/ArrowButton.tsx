"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ease } from "@/lib/design/motion";
import { color } from "@/lib/design/tokens";
import { ArrowIcon } from "./Icons";

/** Left margin the arrow slot gains as it opens, on top of the arrow's width. */
const ARROW_GAP = 12;

/** One button at three scales: work cards, Hero, Collaborate. */
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
   */
  variant?: "arrow" | "fill";
};

/**
 * The button arrives at the accent on hover, by one of two routes. In `arrow`
 * the dot spreads from its own centre until it covers the pill and a collapsed
 * slot opens to let the arrow slide in; in `fill` the pill simply takes the
 * colour. The label inverts to paper either way.
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
}: Props) {
  const withArrow = variant === "arrow";
  const rootRef = useRef<HTMLAnchorElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const dotSlotRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowSlotRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

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
    if (!root || !pillEl || !labelEl) return;

    /** The slot inverts alongside the label; `fill` has only the label. */
    const toneTargets = slotEl ? [labelEl, slotEl] : [labelEl];

    const ctx = gsap.context((self) => {
      if (arrowEl) gsap.set(arrowEl, { opacity: 0 });

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
          // The dot travels to the accent in `arrow`; in `fill` there is no
          // dot, so the pill takes the colour itself over the same beat.
          if (dotEl && dotSlotEl) {
            gsap.to(dotEl, {
              scale: coverScale(dotSlotEl),
              duration: t(0.72),
              ease: ease.inOut,
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
          if (dotEl) {
            gsap.to(dotEl, {
              scale: 1,
              duration: t(0.62),
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
  }, [reducedMotion, arrowWidth, restColor, restBackground]);

  return (
    <a ref={rootRef} href={href} className="arrow-btn">
      <span
        ref={pillRef}
        className={`arrow-btn__pill ${pill} ${
          tone === "onLight" ? "arrow-btn__pill--ink" : ""
        } ${withArrow ? "" : "justify-center text-center"}`}
      >
        {withArrow && (
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
          style={withArrow ? { marginLeft: labelGap } : undefined}
        >
          {label}
        </span>
        {withArrow && (
          <span ref={arrowSlotRef} className="arrow-btn__arrow-slot">
            <ArrowIcon ref={arrowRef} size={arrowWidth} />
          </span>
        )}
      </span>
    </a>
  );
}
