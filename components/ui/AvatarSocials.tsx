"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { socials } from "@/lib/constants";
import { ease } from "@/lib/design/motion";
import { socialIcons } from "./Icons";

/** How far out of the avatar a bubble starts, along whichever axis it travels. */
const TRAVEL = 18;
/** Resting scale of a closed bubble — it grows into place as it travels. */
const SHRUNK = 0.55;

/**
 * The width the group swings from a column to a row. The hero's own breakpoint,
 * not one of this component's: below it the avatar is centred with the page
 * stacked above it, and the only free space is to its side.
 */
const SIDE_QUERY = "(max-width: 900px)";

/**
 * Wraps the hero avatar and pops the socials out of it on hover, staggered from
 * the bubble nearest the avatar outward.
 *
 * **Which way it opens is the layout's decision, not this component's.** Above
 * 900px the avatar sits on the hero's floor with the name beside it and open
 * page above, so the group rises as a column. Below, the avatar is centred at
 * the bottom of a stacked column with the button directly over it — upward is
 * the one direction that is already occupied — so the group runs out to the
 * right instead. `gsap.matchMedia` owns that: each branch sets its own closed
 * state and travel axis, and reverts cleanly when the query stops matching.
 *
 * Two things about the hit area are load-bearing, and hold in both directions:
 *
 * 1. The list is a DOM *child* of the root, so `mouseleave` doesn't fire when
 *    the pointer moves onto a bubble — the event is defined over an element and
 *    its descendants, not over its box, and the list sits outside the root's
 *    box entirely (`bottom-full`, or `left-full` in a row).
 * 2. The gap between the avatar and the first bubble is the list's own padding,
 *    not a margin. Padding is inside the list's box, so the pointer never
 *    crosses dead space on the way out; a margin would close the group
 *    mid-reach.
 *
 * The closed state ships as an inline style rather than being applied in the
 * effect, so the bubbles are never painted at full size for one frame before
 * GSAP takes over. It names an axis it may not end up using — at `scale(0.55)`
 * and zero opacity that is invisible either way, and the effect writes the real
 * one on mount. That does mean they depend on JS to become visible; the footer
 * carries the same three links for anyone who never gets it.
 */
export function AvatarSocials({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;

    // `matchMedia` rather than `context`: it is a context underneath, and it
    // reverts this branch's tweens and inline styles the moment the query stops
    // matching. Nesting a `gsap.context` inside it would be a second one.
    const mm = gsap.matchMedia();

    mm.add({ side: SIDE_QUERY }, (context) => {
      const bubbles = gsap.utils.toArray<HTMLElement>(list.children);
      const side = Boolean(context.conditions?.side);

      // Out to the left of where they land in a row, down below it in a column
      // — either way the group grows out of the avatar rather than toward it.
      const axis = side ? "x" : "y";
      const closed = side ? -TRAVEL : TRAVEL;

      // Reduced motion keeps the state change — hover still reveals the
      // socials — and drops only the travel. Same bargain as `ArrowButton`.
      const t = (seconds: number) => (reducedMotion ? 0 : seconds);

      // Both axes are written, not just the one in play. Crossing the
      // breakpoint hands over from a branch that parked the bubbles 18px along
      // the *other* axis, and a revert restores the markup's inline transform,
      // which names an axis too. Zeroing both first means the closed state is
      // this branch's alone.
      gsap.set(bubbles, {
        x: 0,
        y: 0,
        [axis]: closed,
        scale: SHRUNK,
        opacity: 0,
        pointerEvents: "none",
      });

      const open = () => {
        context.add(() => {
          gsap.set(bubbles, { pointerEvents: "auto" });
          gsap.to(bubbles, {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration: t(0.52),
            ease: ease.out,
            stagger: t(0.07),
            overwrite: true,
          });
        });
      };

      const close = () => {
        context.add(() => {
          gsap.to(bubbles, {
            [axis]: closed,
            scale: SHRUNK,
            opacity: 0,
            duration: t(0.3),
            ease: ease.softIn,
            // From the far end, so the group collapses back toward the avatar
            // rather than peeling away from it.
            stagger: { each: t(0.05), from: "end" },
            overwrite: true,
            onComplete: () => gsap.set(bubbles, { pointerEvents: "none" }),
          });
        });
      };

      // Keyboard users reach the bubbles by tabbing into them: they stay in the
      // tab order while closed (opacity, not `visibility`), and the first focus
      // opens the group so it isn't a jump to somewhere invisible.
      const onFocusOut = (event: FocusEvent) => {
        if (root.contains(event.relatedTarget as Node | null)) return;
        close();
      };

      root.addEventListener("mouseenter", open);
      root.addEventListener("mouseleave", close);
      root.addEventListener("focusin", open);
      root.addEventListener("focusout", onFocusOut);

      return () => {
        root.removeEventListener("mouseenter", open);
        root.removeEventListener("mouseleave", close);
        root.removeEventListener("focusin", open);
        root.removeEventListener("focusout", onFocusOut);
      };
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative cursor-pointer">
      <ul
        ref={listRef}
        /*
          Column above the avatar, row to its right below 900px.

          `flex-col-reverse` puts the first social nearest the avatar when the
          group stacks upward; a plain row does the same thing left to right, so
          the stagger runs in DOM order and still reads outward from the avatar
          in both. Every offset the column sets has to be undone by name —
          `bottom-auto`, `translate-x-0`, `pb-0` — because the row anchors from
          different edges, and a leftover `-translate-x-1/2` would park the
          whole group half its own width to the left of the avatar.
        */
        className="absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col-reverse items-center gap-[10px] pb-[10px] max-[900px]:top-1/2 max-[900px]:bottom-auto max-[900px]:left-full max-[900px]:translate-x-0 max-[900px]:-translate-y-1/2 max-[900px]:flex-row max-[900px]:gap-[6px] max-[900px]:pb-0 max-[900px]:pl-[6px]"
      >
        {socials.map((social) => {
          const Icon = socialIcons[social.platform];
          return (
            <li
              key={social.platform}
              style={{
                opacity: 0,
                transform: `translateY(${TRAVEL}px) scale(${SHRUNK})`,
                pointerEvents: "none",
              }}
            >
              <a
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                // Ink, not paper: these used to pop out over the hero's black
                // panel and now open over the bare page, where a paper bubble
                // is an invisible one. The accent hover is unchanged — it read
                // against both.
                //
                // The narrow sizes are measured, not chosen. A row has only
                // half the viewport minus the avatar's radius and the gutter to
                // work in, so three bubbles and their gaps have to fit ~102px
                // at 320px wide. 9vw holds that and keeps the glyph at the same
                // fraction of the bubble the wide layout uses.
                className="grid size-[clamp(44px,4vw,60px)] place-items-center rounded-full bg-ink text-paper transition-colors duration-[var(--duration-tone)] hover:bg-accent hover:text-paper hover:opacity-100 max-[900px]:size-[clamp(26px,9vw,52px)] max-[900px]:[&_svg]:size-[clamp(13px,4.4vw,21px)]"
              >
                <Icon size={21} />
              </a>
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}
