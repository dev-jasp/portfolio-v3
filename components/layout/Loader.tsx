"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { releaseEntrance } from "@/hooks/useEntrance";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { site } from "@/lib/constants";
import { ease, loader } from "@/lib/design/motion";

const COLUMNS = Array.from({ length: loader.panels }, (_, index) => index);

/** Always three digits, so a monospaced counter never changes width. */
const format = (value: number) =>
  String(Math.round(value * 100)).padStart(3, "0");

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * The opening curtain: a sheet of ink over the page, cut into columns that lift
 * off it left to right.
 *
 * **It waits on something real.** The hero sets the name at up to 200px in EB
 * Garamond — a webfont, and the largest text on the site — so an unblocked
 * first paint spends its first moment swapping Georgia for Garamond at display
 * size, which is the most visible reflow the page has. The curtain holds until
 * `document.fonts.ready`, with a floor so a warm reload doesn't flash it and a
 * ceiling so a font that never arrives can't hold the page hostage.
 *
 * **The wordmark is the meter.** There is no bar and no spinner: the name
 * starts under a sheet of the curtain's own colour at 80%, and that sheet
 * collapses to the right as the page gets ready, so the name fills in from the
 * left. Partial opacity rather than full is what makes it read as one word at
 * two brightnesses instead of a word being typed on.
 *
 * **Rendered on the server.** It is a client component, but its markup is in
 * the initial HTML, so the sheet is painted in the first frame rather than
 * dropped in after hydration — which would flash the page it exists to cover.
 * Everything below it is in the DOM and readable the whole time, so the sheet
 * is `aria-hidden`; under `prefers-reduced-motion` CSS drops it before paint
 * and the effect below releases the page on its first frame.
 *
 * Structure lives in `.loader*` in `globals.css`; every animated property is
 * this timeline's, on the same terms as `.arrow-btn`.
 */
export function Loader() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Nothing to run and nothing to unmount — the render below already returns
    // null for this branch, and CSS had the sheet hidden before paint. The page
    // just needs telling that it is free to move.
    if (reducedMotion) {
      releaseEntrance();
      return;
    }

    const root = rootRef.current;
    const wipe = wipeRef.current;
    if (!root || !wipe) return;

    let cancelled = false;

    // Same recipe as the menu panel: `overflow` alone doesn't hold while Lenis
    // is driving, because Lenis reads wheel events rather than the scrollbar,
    // so the sheet carries `data-lenis-prevent` too.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      document.body.style.overflow = previousOverflow;
    };

    /**
     * Scroll and entrances handed back together, partway through the lift.
     *
     * The unlock has to happen here rather than in cleanup: this component
     * renders `null` once it is done but stays mounted, so its effect never
     * tears down on a normal run and an unmount-only restore would leave the
     * page permanently unscrollable.
     */
    const handOff = () => {
      unlock();
      releaseEntrance();
    };

    // Never cleared, on purpose. It is the one guard against a curtain that
    // stops halfway — a tween that throws, an unmount mid-lift — leaving the
    // page locked behind a gate that will never open, and cancelling it in
    // cleanup would remove the guard in exactly the case it exists for. Both
    // calls it makes are idempotent, so firing after a normal run costs
    // nothing. Its cost while pending is one closure for a few seconds.
    window.setTimeout(handOff, loader.maxMs + 2000);

    const ctx = gsap.context(() => {
      const progress = { value: 0 };
      const setWipe = gsap.quickSetter(wipe, "scaleX");

      const paint = () => {
        setWipe(1 - progress.value);
        if (countRef.current) {
          countRef.current.textContent = format(progress.value);
        }
      };
      paint();

      // Decelerating, and stalling short of full: the meter is honest about
      // being an estimate. It only reaches 100 when the fonts actually land.
      const crawl = gsap.to(progress, {
        value: loader.crawlTo,
        duration: loader.minMs / 1000,
        ease: ease.softOut,
        onUpdate: paint,
      });

      const lift = () => {
        if (cancelled) return;

        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to("[data-loader-fade]", {
            opacity: 0,
            y: -14,
            duration: 0.32,
            ease: ease.softIn,
          })
          // `rotation` alongside `yPercent` is the whole effect: four columns
          // leaving straight up read as blinds, but tilting as they go turns
          // the join between them into a diagonal that steps across the screen.
          // GSAP reads the existing matrix here, which is where the panels'
          // overscan comes from — see `.loader__panel`.
          .to(
            "[data-loader-panel]",
            {
              yPercent: -100,
              // Both, and they add: GSAP's translate is `y` plus `yPercent` of
              // the element's height. One clears the panel, the other clears
              // the corner the tilt drops below it. See `loader.clearance`.
              y: loader.clearance,
              rotation: loader.tilt,
              duration: loader.lift.duration,
              stagger: loader.lift.stagger,
              ease: ease.inOut,
            },
            // Under the fade, not after it. This curve spends its first fifth
            // barely moving, so starting the columns once the wordmark has gone
            // put a beat of black screen holding still between the two — the
            // part that reads as the animation hesitating before it goes.
            // Overlapped, the wordmark leaves *through* that slow opening and
            // the whole exit is one gesture.
            "<0.08",
          )
          // Before the last column is gone, not after. By this point the left
          // of the screen is uncovered, and the hero's own cascade is 780ms
          // long — starting it on the curtain's last frame would leave a beat
          // of finished page sitting still, and a beat of page you can see but
          // cannot scroll.
          .call(handOff, undefined, `-=${loader.handoff}`);
      };

      const settle = () => {
        if (cancelled) return;
        crawl.kill();
        gsap.to(progress, {
          value: 1,
          duration: loader.settle,
          ease: ease.out,
          onUpdate: paint,
          onComplete: lift,
        });
      };

      // Floor and ceiling around one real signal. `Promise.all` is the floor —
      // fonts *and* the minimum — and `race` against the ceiling is what keeps
      // a font that never resolves from being a blank page.
      Promise.race([
        Promise.all([document.fonts.ready, wait(loader.minMs)]),
        wait(loader.maxMs),
      ]).then(settle);
    }, root);

    // Unlocks but does not release. Strict Mode mounts this twice in
    // development, and a release here would be permanent — the gate would be
    // open before the second, real curtain even started, so the entrance
    // timing could only ever be checked in a production build. The failsafe
    // above covers a genuine unmount instead.
    return () => {
      cancelled = true;
      unlock();
      ctx.revert();
    };
  }, [reducedMotion]);

  // `reducedMotion` is read through `useSyncExternalStore`, so it hydrates as
  // the server saw it — `false` — and corrects on the very next render. That
  // one frame is why the sheet is also hidden in CSS.
  if (done || reducedMotion) return null;

  return (
    <div ref={rootRef} className="loader" aria-hidden="true" data-lenis-prevent>
      {/* The columns get their own row because it is wider than the window —
          see `.loader__sheet`. The mark and the meta below are measured to the
          window itself, so they can't share a box with it. */}
      <div className="loader__sheet">
        {COLUMNS.map((index) => (
          <span key={index} className="loader__panel" data-loader-panel />
        ))}
      </div>


      <div className="loader__mark">
        {/* `pl-[0.078em]` for the same reason the hero's h1 carries it: EB
            Garamond's "J" hangs left of its own origin, and on a centred line
            that padding lands within a fraction of a pixel of optical centre.
            No weight utility — the family is loaded at 400 alone. */}
        <p
          data-loader-fade
          className="loader__word font-wordmark pl-[0.078em] text-[clamp(26px,5vw,68px)] leading-[0.9] tracking-[-0.01em] uppercase"
        >
          {site.name}
          <span ref={wipeRef} className="loader__wipe" />
        </p>
      </div>

      {/* Mono, because it is data: a role and a number, on the gutter every
          other section is drawn to. */}
      <div className="loader__meta font-mono" data-loader-fade>
        <span>{site.role}</span>
        <span ref={countRef}>000</span>
      </div>
    </div>
  );
}
