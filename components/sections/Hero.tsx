import Image from "next/image";
import { Fragment } from "react";
import { AccentRule } from "@/components/ui/AccentRule";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { AvatarSocials } from "@/components/ui/AvatarSocials";
import { Reveal } from "@/components/ui/Reveal";
import { heroNavLinks, site } from "@/lib/constants";
import { heroIntroLines, heroProcess } from "@/lib/data";
import { reveal } from "@/lib/design/motion";

/**
 * Hero — the first screen, set directly on paper.
 *
 * Three bands in a full-height column, and only the middle one is flexible: the
 * statement and the inline nav sit at the top, the process track takes all the
 * free height and centres itself in it, and the name, CTA and portrait sit on
 * the floor. Anything that changes height above or below simply moves the
 * track — there is no offset here to re-tune when the copy changes.
 *
 * **No panel and no inset.** The section used to be a black rounded panel
 * floating inside a 10px white frame, which meant its content was written to a
 * gutter of its own. It is paper on paper now, so the name starts at exactly
 * the `--spacing-gutter` every other section is drawn to and the page reads as
 * one sheet rather than a card on top of one.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-svh flex-col px-gutter pt-[clamp(26px,4vh,44px)] pb-[clamp(24px,3.4vh,38px)]"
    >
      <div className="flex items-start justify-between gap-x-[clamp(24px,4vw,64px)]">
        <Reveal>
          {/* One sentence, broken where the design breaks it. Spans rather than
              separate <p>s, so it stays a single sentence to anything listening
              — the same call the About intro makes. */}
          {/* Two scales, because the statement is doing two jobs. Beside a
              200px name it is a caption and takes 1vw; alone at the top of a
              phone it is the only copy on the first screen, so it holds a 2vw
              floor rather than shrinking away to nothing with the viewport. */}
          <p className="font-mono text-[clamp(11px,1vw,19px)] leading-[1.32] tracking-[-0.01em] uppercase max-[900px]:text-[clamp(12px,2vw,17px)]">
            {heroIntroLines.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </p>
        </Reveal>

        {/*
          This scrolls away with the hero; the fixed pill is what carries the
          nav for the rest of the page. That is also why it can disappear
          outright below 900px — every link here is in the menu under a longer
          label, so nothing is lost, and 900 is where the section changes shape
          anyway rather than a breakpoint of the nav's own.

          The right padding clears the pill, whose inner edge sits 80px from the
          viewport — further in than the section's own gutter ever reaches.
        */}
        <Reveal delayMs={reveal.stepMs}>
          <nav
            aria-label="Sections"
            className="flex items-center gap-[clamp(18px,2.4vw,44px)] pr-[clamp(76px,9vw,160px)] font-mono text-[clamp(13px,1.05vw,20px)] max-[900px]:hidden"
          >
            {heroNavLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>

      {/*
        The track turns with the screen: a rule across the section on desktop,
        a column down the middle of it below 900px. Same three stages and the
        same connectors either way — `AccentRule` follows whichever direction
        its parent is in, so nothing here is duplicated for the second shape.

        The column is sized, not stretched. Filling the band outright is the
        obvious move and the wrong one: the track then butts straight into the
        button below it, and it is the tallest thing on the screen, so it also
        pushes the name off the bottom. Each connector takes a share of the
        viewport instead and the band centres what results, which leaves air on
        both sides of the track and keeps the whole column inside one screen.
      */}
      <div className="flex min-h-[clamp(90px,14vh,160px)] flex-1 items-center">
        <Reveal delayMs={reveal.stepMs * 2} className="w-full">
          <div className="flex items-center gap-[clamp(10px,1.4vw,24px)] max-[900px]:flex-col max-[900px]:gap-[clamp(8px,1.6vw,14px)]">
            {heroProcess.map((stage, index) => (
              <Fragment key={stage}>
                <span className="shrink-0 text-[clamp(14px,1.2vw,22px)] max-[900px]:text-[clamp(14px,2.4vw,20px)]">
                  {stage}
                </span>
                {/* The rule takes all the slack, so the stages spread to
                    whatever width — or height — the section gives them. */}
                {index < heroProcess.length - 1 && (
                  <AccentRule className="min-w-[26px] flex-1 max-[900px]:min-h-[clamp(56px,15vh,150px)] max-[900px]:flex-col" />
                )}
              </Fragment>
            ))}
          </div>
        </Reveal>
      </div>

      {/*
        `items-center`, not `items-end`. The three things on this line have very
        different boxes — a 0.84-leading display line, a ~49px pill, a portrait
        up to 160px across — and bottom-aligning them lands the pill on the
        name's descender space rather than on the name. Centring puts the pill
        and the portrait on the middle of the caps, which is where the design
        has them.

        Wraps on content rather than at a width: the name is only ever as wide
        as its own clamp resolves to, so the pair drops beneath it at exactly
        the width where the two stop fitting on one line.

        `flex-col-reverse` below 900px, so the pair stacks *above* the name
        rather than under it. Reversing the axis rather than reordering the
        markup keeps the h1 first in the DOM, where it belongs — and the button
        is the only focusable thing on this line, so there is no tab order to
        get out of step with what is on screen.
      */}
      <div className="flex flex-wrap items-center justify-between gap-x-[clamp(20px,3vw,64px)] gap-y-9 [container-type:inline-size] max-[900px]:flex-col-reverse max-[900px]:gap-y-[clamp(32px,6.5vw,60px)]">
        {/* `min-w-0` lets this shrink to whatever the row leaves it, rather
            than holding its max-content width and overhanging the page — there
            is no panel clipping it any more. The name itself never has to give:
            it is sized to fit on both sides of the breakpoint. */}
        <Reveal delayMs={reveal.stepMs * 3} className="min-w-0">
          {/* The page's only h1 — it used to belong to the marquee. Caps in a
              serif run far wider than the mixed-case sans the display scale's
              10.6vw was measured on, and the name no longer has the line to
              itself, so the coefficient drops to 8: the name renders ~8.4x its
              own font size, which is what leaves room for the pair beside it
              down to ~950px. Tracking eases off -0.045em for the same reason
              the coefficient does. No weight utility: the wordmark family ships
              at 400 only. */}
          {/* One line at every width, both sides of the breakpoint.

              Above 900px the pair is beside it, so 8vw — which renders at ~68%
              of the viewport against the ~94% the gutters leave, comfortably
              inside. Below, it has the line to itself and is measured to that
              line instead: the name runs exactly 8.4641x its own font size in
              this face, so dividing the row's width by 9.2 fills ~92% of it and
              can't do anything else. `whitespace-nowrap` is what makes that a
              guarantee rather than a calculation that happens to work.

              `cqw` because the page reserves a scrollbar gutter permanently, so
              `100vw` measures a width nothing can actually occupy. */}
          <h1 className="font-wordmark text-[clamp(44px,8vw,200px)] leading-[0.84] tracking-[-0.01em] whitespace-nowrap uppercase max-[900px]:text-center max-[900px]:text-[calc(100cqw/9.2)]">
            {site.name}
          </h1>
        </Reveal>

        {/* `ml-auto` is a no-op while the two share a line — `justify-between`
            has already put the pair on the right. It earns its place on the
            wrapped line between 900px and ~1200px, where the pair would
            otherwise drop to the far left and sit under the name's first
            letter with the rest of the row empty. Pushed right, the two lines
            read as a composed pair of corners instead of a collapse. Reset
            below 900px, where an auto margin would fight the centred column. */}
        <Reveal delayMs={reveal.stepMs * 4} className="ml-auto max-[900px]:ml-0">
          {/* Stacks below 900px — pill over portrait, both centred — which is
              what puts the portrait directly above the name it belongs to. */}
          <div className="flex items-center gap-[clamp(14px,1.8vw,28px)] max-[900px]:flex-col max-[900px]:gap-[clamp(14px,2.6vw,22px)]">
            {/* `onLight` now the panel is gone: the pill rests as ink on paper
                instead of the reverse. The accent hover is unchanged. */}
            <ArrowButton
              href={site.scheduleUrl}
              label="Schedule a Call"
              size="sm"
              tone="onLight"
            />
            {/* The avatar stays server-rendered — it is passed through the
                client wrapper as children rather than owned by it. */}
            <AvatarSocials>
              {/* Decorative: the name it belongs to is set 200px tall beside
                  it. The source is square and so is this box, so `object-cover`
                  crops nothing — the circle is the whole frame, masked, and an
                  `object-position` here would have nothing to shift. */}
              <Image
                src="/images/jaspher-gargar.png"
                alt=""
                width={1254}
                height={1254}
                priority
                // Grows on the narrow side rather than shrinking with it: at
                // 8.2vw of a phone it is a 32px token beside nothing, where the
                // stacked layout gives it the width to be a portrait.
                className="size-[clamp(72px,8.2vw,160px)] shrink-0 rounded-full object-cover grayscale max-[900px]:size-[clamp(64px,17vw,130px)]"
              />
            </AvatarSocials>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
