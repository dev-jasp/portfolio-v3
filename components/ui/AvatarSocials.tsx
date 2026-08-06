"use client";

import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { socials } from "@/lib/constants";
import { ease } from "@/lib/design/motion";
import { socialIcons } from "./Icons";

/** How far below its resting place a bubble starts, in px. */
const RISE = 18;
/** Resting scale of a closed bubble — it grows into place as it rises. */
const SHRUNK = 0.55;

/**
 * Wraps the hero avatar and pops the socials out above it on hover, staggered
 * from the bubble nearest the avatar upward.
 *
 * Two things about the hit area are load-bearing:
 *
 * 1. The column is a DOM *child* of the root, so `mouseleave` doesn't fire when
 *    the pointer moves up onto a bubble — the event is defined over an element
 *    and its descendants, not over its box, and the column sits outside the
 *    root's box entirely (`bottom-full`).
 * 2. The gap between the avatar and the first bubble is the column's own
 *    padding, not a margin. Padding is inside the column's box, so the pointer
 *    never crosses dead space on the way up; a margin would close the group
 *    mid-reach.
 *
 * The closed state ships as an inline style rather than being applied in the
 * effect, so the bubbles are never painted at full size for one frame before
 * GSAP takes over. That does mean they depend on JS to become visible — the
 * footer carries the same three links for anyone who never gets it.
 */
export function AvatarSocials({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    if (!root || !list) return;

    const ctx = gsap.context((self) => {
      const bubbles = gsap.utils.toArray<HTMLElement>(list.children);

      // Reduced motion keeps the state change — hover still reveals the
      // socials — and drops only the travel. Same bargain as `ArrowButton`.
      const t = (seconds: number) => (reducedMotion ? 0 : seconds);

      const open = () => {
        self.add(() => {
          gsap.set(bubbles, { pointerEvents: "auto" });
          gsap.to(bubbles, {
            y: 0,
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
        self.add(() => {
          gsap.to(bubbles, {
            y: RISE,
            scale: SHRUNK,
            opacity: 0,
            duration: t(0.3),
            ease: ease.softIn,
            // From the far end, so the column collapses back down toward the
            // avatar rather than peeling away from it.
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
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative cursor-pointer">
      <ul
        ref={listRef}
        // `flex-col-reverse` puts the first social nearest the avatar, so the
        // stagger runs in DOM order and still reads bottom to top.
        className="absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col-reverse items-center gap-[10px] pb-[10px]"
      >
        {socials.map((social) => {
          const Icon = socialIcons[social.platform];
          return (
            <li
              key={social.platform}
              style={{
                opacity: 0,
                transform: `translateY(${RISE}px) scale(${SHRUNK})`,
                pointerEvents: "none",
              }}
            >
              <a
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="grid size-[clamp(44px,4vw,60px)] place-items-center rounded-full bg-paper text-ink transition-colors duration-[var(--duration-tone)] hover:bg-accent hover:text-paper hover:opacity-100"
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
