import Image from "next/image";
import { Fragment } from "react";
import { AccentRule } from "@/components/ui/AccentRule";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { AvatarSocials } from "@/components/ui/AvatarSocials";
import { Reveal } from "@/components/ui/Reveal";
import { heroNavLinks, site } from "@/lib/constants";
import { heroIntroLines, heroProcess } from "@/lib/data";
import { reveal } from "@/lib/design/motion";

/*
  The nav link's hover: the menu's accent dot, on a gesture the row can take.

  `IndentLink` slides *sideways* and indents with `padding-left`. Down the menu
  panel both are free — the rows are stacked, so a wider row displaces nothing
  and there is empty panel to the right to slide into. Along a row neither is:
  padding shoves every link after the one under the pointer, and a sideways
  slide runs a label at its own neighbour. The axis with room in a row is the
  vertical one, so the label lifts instead.

  4px on `--ease-lift` over 260ms is not a new number — it is exactly what
  `.icon-circle--lift` does in `globals.css`, which is the design system's one
  hover lift. The dot's fade rides the same timing so the two read as a single
  movement rather than a lift with a light switch attached.

  The 14px of left padding is permanent, and that is the point: it is the dot's
  seat, held open whether the dot is showing or not. Revealing the dot then
  costs no layout at all — nothing reflows, and the dot never lands on the
  label's first letter. `hover:opacity-100` opts out of the global link fade for
  the same reason `.indent-link` does: the row is meant to move, not dim.
  Keyboard users get all of it on `:focus-visible`.
*/
const navLinkClass =
  "group relative inline-flex items-center pl-[14px] hover:opacity-100 pointer-coarse:min-h-11";

const navDotClass =
  "pointer-events-none absolute top-1/2 left-0 size-[6px] -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-[260ms] ease-[var(--ease-lift)] group-hover:opacity-100 group-focus-visible:opacity-100";

const navLabelClass =
  "inline-block transition-transform duration-[260ms] ease-[var(--ease-lift)] group-hover:-translate-y-[4px] group-focus-visible:-translate-y-[4px]";

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
              <a key={link.href} href={link.href} className={navLinkClass}>
                <span aria-hidden="true" className={navDotClass} />
                <span className={navLabelClass}>{link.label}</span>
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

        **This must not wrap, and that is not a preference.** Two separate
        things break when it does. The button's hover opens a slot for its
        arrow, making the pill 28px wider — a hover state that participates in
        layout — so any width with under 28px of slack fits at rest and wraps
        the instant the pointer lands, throwing the name a full line up and
        back. And a wrap that survives, rather than flickering, is its own
        problem: the name lifts off the floor and the pair sits beneath it,
        which is not this section.

        The fix is on the name, not here — it is sized from the room the pair
        leaves, *with the button already hovered*. See the `h1` below. That
        holds one line from 900px up, so `flex-wrap` never fires; it stays only
        as a backstop, because if a longer name ever outgrew the arithmetic,
        wrapping is a better failure than overlapping.

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

              Above 900px it shares the line with the pair, and the ramp is
              what keeps it there. A flat `vw` cannot: the pill is a fixed
              174px whatever the viewport, so it eats 21% of the row at 900px
              and 9% at 1954px, and one coefficient that clears the narrow end
              leaves the name far too small at the wide one. `9.2vw - 25px` is
              the line through both — 58px where the room is tightest, 154px at
              1954 — and it is drawn against the row *with the button hovered*,
              so it clears by 28px at worst and 91px at 1954.

              Below 900px it has the line to itself and is measured to that
              line instead: the name runs exactly 8.4641x its own font size in
              this face, so dividing the row's width by 9.2 fills ~92% of it and
              can't do anything else. `whitespace-nowrap` is what makes that a
              guarantee rather than a calculation that happens to work.

              `cqw` because the page reserves a scrollbar gutter permanently, so
              `100vw` measures a width nothing can actually occupy. */}
          {/* `pl-[0.078em]` is optical alignment, not spacing. EB Garamond's
              "J" has a negative left side bearing — the hook swings 0.078em
              left of the glyph's own origin — so a name set flush to the gutter
              paints *past* it, and at display size that is 8px here and 13px in
              the footer: enough that the name visibly fails to line up with the
              statement and the process track above it. An em, so it tracks the
              clamp. Centred below 900px the same padding shifts the line right
              by half of it, which is within a fifth of a pixel of the optical
              centre the two bearings actually ask for. */}
          <h1 className="font-wordmark pl-[0.078em] text-[clamp(44px,calc(9.2vw-25px),200px)] leading-[0.84] tracking-[-0.01em] whitespace-nowrap uppercase max-[900px]:text-center max-[900px]:text-[calc(100cqw/9.2)]">
            {site.name}
          </h1>
        </Reveal>

        {/* `ml-auto` is a no-op in every state the section is meant to be in —
            sharing the line, `justify-between` has already put the pair on the
            right. It exists for the wrap that should never happen: dropped to
            its own line the pair would otherwise sit at the far left under the
            name's first letter, with the rest of the row empty. Pushed right,
            the failure at least reads as two composed corners. Reset below
            900px, where an auto margin would fight the centred column. */}
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
