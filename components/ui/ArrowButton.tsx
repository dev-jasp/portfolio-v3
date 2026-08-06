"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ease } from "@/lib/design/motion";
import { color } from "@/lib/design/tokens";
import { ArrowIcon } from "./Icons";

/** Left margin the arrow slot gains as it opens, on top of the arrow's width. */
const ARROW_GAP = 12;

/** Hero and Collaborate are the same button at two scales. */
const sizes = {
  md: { pill: "px-8 py-[18px] text-[17px]", dot: 10, labelGap: 14, arrow: 19 },
  lg: { pill: "px-[38px] py-[21px] text-[21px]", dot: 12, labelGap: 16, arrow: 22 },
} as const;

type Props = {
  href: string;
  label: string;
  size?: keyof typeof sizes;
};

/**
 * The accent dot spreads from its own centre until it covers the pill, the
 * label inverts, and the collapsed slot opens to let the arrow slide in.
 *
 * Structure lives in `.arrow-btn*` in `globals.css`; every animated property
 * belongs to GSAP so the two never fight over the same declaration.
 */
export function ArrowButton({ href, label, size = "md" }: Props) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const dotSlotRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const arrowSlotRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const reducedMotion = useReducedMotion();
  const { pill, dot, labelGap, arrow: arrowWidth } = sizes[size];

  useEffect(() => {
    const root = rootRef.current;
    const pillEl = pillRef.current;
    const dotSlotEl = dotSlotRef.current;
    const dotEl = dotRef.current;
    const labelEl = labelRef.current;
    const slotEl = arrowSlotRef.current;
    const arrowEl = arrowRef.current;
    if (
      !root ||
      !pillEl ||
      !dotSlotEl ||
      !dotEl ||
      !labelEl ||
      !slotEl ||
      !arrowEl
    ) {
      return;
    }

    const ctx = gsap.context((self) => {
      gsap.set(arrowEl, { opacity: 0 });

      /**
       * Measured from the dot's *slot*, not the dot. The dot is the thing GSAP
       * scales, so reading its own box mid-tween would compute a smaller cover
       * on re-entry than entering from rest does.
       */
      const coverScale = () => {
        const p = pillEl.getBoundingClientRect();
        const d = dotSlotEl.getBoundingClientRect();
        // The pill widens by `grow` as the slot opens. The dot sits left of
        // centre, so the far corner recedes by the full width gained.
        const grow = slotEl.offsetWidth > 0 ? 0 : arrowWidth + ARROW_GAP;
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
          gsap.to(dotEl, {
            scale: coverScale(),
            duration: t(0.72),
            ease: ease.inOut,
            overwrite: true,
          });
          gsap.to([labelEl, slotEl], {
            color: color.paper,
            duration: t(0.34),
            delay: t(0.1),
            ease: ease.linear,
            overwrite: true,
          });
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
          gsap.to(dotEl, {
            scale: 1,
            duration: t(0.62),
            ease: ease.inOut,
            overwrite: true,
          });
          gsap.to([labelEl, slotEl], {
            color: color.ink,
            duration: t(0.3),
            delay: t(0.16),
            ease: ease.linear,
            overwrite: true,
          });
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
  }, [reducedMotion, arrowWidth]);

  return (
    <a ref={rootRef} href={href} className="arrow-btn">
      <span ref={pillRef} className={`arrow-btn__pill ${pill}`}>
        <span
          ref={dotSlotRef}
          className="arrow-btn__dot-slot"
          style={{ width: dot, height: dot }}
        >
          <span ref={dotRef} className="arrow-btn__dot" />
        </span>
        <span
          ref={labelRef}
          className="arrow-btn__label"
          style={{ marginLeft: labelGap }}
        >
          {label}
        </span>
        <span ref={arrowSlotRef} className="arrow-btn__arrow-slot">
          <ArrowIcon ref={arrowRef} size={arrowWidth} />
        </span>
      </span>
    </a>
  );
}
