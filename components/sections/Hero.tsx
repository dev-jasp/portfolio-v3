import Image from "next/image";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/constants";
import { heroHeadline } from "@/lib/data";
import { reveal } from "@/lib/design/motion";
import { darkPanelProps } from "@/lib/design/tokens";

/**
 * Hero — a full-viewport dark panel inset by the 10px white frame.
 *
 * The panel is a flex column of three parts: the name block sits at the top,
 * the CTA takes the free space between, and the marquee is pinned to the
 * bottom edge.
 *
 * The panel's horizontal padding is load-bearing — the marquee cancels it out
 * to run edge to edge. Both read `--spacing-gutter`, so the two cannot drift
 * apart as it narrows on small screens; hardcoding either would leave the
 * marquee inset or overhanging at every width but one.
 */
export function Hero() {
  return (
    <section id="top" className="p-[var(--inset-panel)]">
      <div
        {...darkPanelProps}
        className="relative flex min-h-[calc(100svh-20px)] flex-col overflow-hidden rounded-panel bg-ink px-gutter pt-[clamp(24px,4vw,34px)] pb-[clamp(24px,4vw,40px)] text-paper"
      >
        <span aria-hidden="true" className="dot-grid" />

        <Reveal className="relative">
          {/* The right padding keeps the name clear of the menu pill. */}
          <div className="pr-[90px] text-[clamp(52px,10.6vw,200px)] leading-[0.84] font-medium tracking-[-0.045em]">
            {site.name}
            <Image
              src="/images/jaspher-gargar.png"
              alt=""
              width={1254}
              height={1254}
              priority
              // Sized in `em` so the avatar tracks the fluid name beside it.
              className="ml-[0.08em] inline-block size-[0.32em] rounded-full object-cover object-[50%_30%] align-[0.04em] grayscale"
            />
          </div>
          <p className="mt-[22px] font-mono text-xl tracking-[0.02em] text-on-dark-muted">
            {site.role}
          </p>
        </Reveal>

        {/* Floor shrinks on short screens so the CTA doesn't push the marquee
            off the panel before the hero has even finished. */}
        <div className="relative grid min-h-[clamp(90px,14vh,140px)] flex-1 place-items-center">
          <Reveal delayMs={reveal.stepMs}>
            <ArrowButton href={site.scheduleUrl} label="Schedule a Call" />
          </Reveal>
        </div>

        {/* Full-bleed: cancel the panel's inset, then let the panel clip it. */}
        <Reveal
          delayMs={reveal.stepMs * 2}
          threshold={0}
          rootMargin="0px"
          className="relative -ml-gutter w-screen overflow-hidden"
        >
          <Marquee
            text={heroHeadline}
            className="text-[clamp(24px,3.4vw,80px)] leading-none font-normal tracking-[-0.01em] uppercase max-sm:text-[clamp(24px,7vw,40px)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
