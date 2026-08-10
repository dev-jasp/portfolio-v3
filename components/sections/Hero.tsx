import Image from "next/image";
import { Fragment } from "react";
import { AccentRule } from "@/components/ui/AccentRule";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { AvatarSocials } from "@/components/ui/AvatarSocials";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/constants";
import { heroHeadline, heroProcess } from "@/lib/data";
import { reveal } from "@/lib/design/motion";
import { darkPanelProps } from "@/lib/design/tokens";

/**
 * Hero — a full-viewport dark panel inset by the 10px white frame.
 *
 * The panel is a flex column of three parts: the name block sits at the top,
 * the process row takes the free space between, and the marquee is pinned to
 * the bottom edge.
 *
 * The panel's horizontal padding is load-bearing — the marquee cancels it out
 * to run edge to edge. Both read `--spacing-gutter`, so the two cannot drift
 * apart as it narrows on small screens; hardcoding either would leave the
 * marquee inset or overhanging at every width but one.
 *
 * No dot grid: the process rules already cross the panel's middle, and the
 * texture behind them read as noise rather than as ground.
 */
export function Hero() {
  return (
    <section id="top" className="p-[var(--inset-panel)]">
      <div
        {...darkPanelProps}
        className="relative flex min-h-[calc(100svh-20px)] flex-col overflow-hidden rounded-panel bg-ink px-gutter pt-[clamp(24px,4vw,34px)] pb-[clamp(24px,4vw,40px)] text-paper"
      >
        {/* The name's size sits on the block, not on the name itself, so the
            role below can indent in the *name's* em and stay tucked under the
            "A" at every width the clamp resolves to. */}
        <Reveal className="text-[clamp(52px,9vw,200px)]">
          {/* The right padding keeps the name clear of the menu pill. */}
          {/* Caps in a serif run far wider than the mixed-case sans the
              display scale's 10.6vw was measured on, so the coefficient drops
              and the tracking eases off -0.045em. No weight utility: the
              wordmark ships at 400 only. */}
          <div className="pr-[90px] font-wordmark leading-[0.84] tracking-[-0.01em] uppercase">
            {site.name}
          </div>
          {/* 0.33em is the advance of the wordmark's "J" — the indent that
              lands the role on the "A" beside it. It has to be carried by this
              wrapper: `em` on the <p> would resolve against the role's own
              20px and clear barely a third of the letter. */}
          <div className="mt-5.5 ml-[0.33em]">
            <p className="font-display text-xl text-on-dark-muted">
              {site.role}
            </p>
          </div>
        </Reveal>

        {/* Floor shrinks on short screens so the row doesn't push the marquee
            off the panel before the hero has even finished. */}
        <div className="grid min-h-[clamp(90px,14vh,140px)] flex-1 items-center">
          <Reveal delayMs={reveal.stepMs}>
            {/* Wraps on its own rather than at a breakpoint: the track holds a
                240px floor and the CTA pair is only ever as wide as its own
                content, so the two split onto separate lines at exactly the
                width where they stop fitting on one. */}
            <div className="flex flex-wrap items-center gap-x-[clamp(24px,4vw,64px)] gap-y-9">
              <div className="flex min-w-[240px] flex-1 items-center gap-[clamp(10px,1.4vw,24px)]">
                {heroProcess.map((stage, index) => (
                  <Fragment key={stage}>
                    <span className="shrink-0 text-[clamp(14px,1.2vw,20px)]">
                      {stage}
                    </span>
                    {/* The rule takes all the slack in the row, so the stages
                        spread to whatever width the panel gives them. */}
                    {index < heroProcess.length - 1 && (
                      <AccentRule className="min-w-[26px] flex-1" />
                    )}
                  </Fragment>
                ))}
              </div>

              <div className="flex items-center gap-[clamp(14px,1.8vw,28px)]">
                <ArrowButton href={site.scheduleUrl} label="Schedule a Call" />
                {/* The avatar stays server-rendered — it is passed through the
                    client wrapper as children rather than owned by it. */}
                <AvatarSocials>
                  {/* Decorative: the name it belongs to is already read out
                      directly above it. */}
                  <Image
                    src="/images/jaspher.jpeg"
                    alt=""
                    width={1254}
                    height={1254}
                    priority
                    className="size-[clamp(64px,7.5vw,120px)] shrink-0 rounded-full object-cover object-[50%_30%] grayscale"
                  />
                </AvatarSocials>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Full-bleed: cancel the panel's inset, then let the panel clip it. */}
        <Reveal
          delayMs={reveal.stepMs * 2}
          threshold={0}
          rootMargin="0px"
          className="-ml-gutter w-screen overflow-hidden"
        >
          {/*
            Five copies, not the default three. A copy runs ~17.4em in this
            face against ~22.7em for the uppercase sans it replaced, and the
            row has to stay wider than the viewport at its worst shift: with N
            copies that is (N-1) x width. At the 80px size cap three copies
            cover 2788px and leave a gap on anything wider; five cover 5576px.

            No weight utility — the wordmark family is loaded at 400 only, and
            headings inherit 400 from the body anyway.
          */}
          <Marquee
            text={heroHeadline}
            copies={5}
            className="font-wordmark text-[clamp(24px,3.4vw,80px)] leading-none tracking-[-0.01em] capitalize max-sm:text-[clamp(24px,7vw,40px)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
