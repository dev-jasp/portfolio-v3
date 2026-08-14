# Design System

Ported from the Claude Design project **Portfolio redesign with Next.js**
(`Portfolio.dc.html`). That file is the visual source of truth; this document
records what the system is made of and where each piece lives.

> The `_ds/industry-*` folder in the design project is an unrelated starter kit
> (Barlow / blueprint / blue accent). It is **not** this portfolio's system and
> was deliberately not imported.

---

## 1. Foundations

Tokens are defined once in `app/globals.css` under `@theme`, which makes them
both CSS custom properties and Tailwind utilities. Values that GSAP needs to
tween are mirrored in `lib/design/tokens.ts` and `lib/design/motion.ts` —
**CSS is authoritative; mirror changes forward.**

### Colour

Two tones and one accent. Nothing else gets to be a colour.

| Token | Value | Used for |
| --- | --- | --- |
| `--color-ink` | `#000000` | Text, dark panels, outlined circles |
| `--color-paper` | `#ffffff` | Page ground, text inside dark panels |
| `--color-accent` | `#f3350c` | Nav dots, count badge, CTA dot spread, hero process rules, social bubble hover |
| `--color-surface` | `#efefef` | Image frame backdrop |
| `--color-hairline` | `#c9c9c9` | Chip separators |
| `--color-on-dark-muted` | `#d6d6d6` | Subtitle on dark panels |
| `--color-muted` | `#9a9a9a` | Section eyebrow labels |
| `--color-muted-strong` | `#8e8e8e` | Tech chips |
| `--color-muted-deep` | `#6f6f6f` | Footer copyright |

Each grey has exactly one job, so a value can't quietly drift between sections.

### Type

| Family | Token | Role |
| --- | --- | --- |
| Space Grotesk | `--font-display` | Display + UI. Tight tracking (`-0.045em`) at large sizes. |
| Space Mono | `--font-mono` | Anything that should read as *data*: category labels, tech lists, project stamps. |
| EB Garamond | `--font-wordmark` | Everything set at display scale. |

The three families split by **role, not by size**: EB Garamond speaks, Space
Grotesk explains, Space Mono labels. Concretely, the serif carries the hero
name, both section headings and the footer name; Space Grotesk carries body
copy, descriptions, buttons and the hero's process labels; Space Mono carries
the hero's opening statement and its inline nav.

The hero's statement is the one place Space Mono is not labelling something
else. It is set as data on purpose — a spec line for the person the name below
it belongs to — which is the same reason the About intro takes the mono face.

> The token is still named `--font-wordmark` from when the serif was only the
> name. It is now the display face, so the name understates it — worth renaming
> to `--font-display`, which would mean renaming today's `--font-display`
> (Space Grotesk) to `--font-sans`. Cheap: only `globals.css` refers to either.

Loaded at **400 only**. The family offers 400–800, but everything here is set
at one weight, so never pair it with a font-weight utility — the browser will
synthesise the weight rather than fail visibly. Tracking also eases to about
`-0.01em` wherever it replaces Space Grotesk, whose `-0.04em`/`-0.045em` display
tracking is far too tight for a serif.

(Sorts Mill Goudy was tried first and replaced: single weight, so any call for
more heft could only be faked with a text stroke.)

Caps in this serif run about 8.9em wide for the name against Space Grotesk's
~7, so the name sizes off a smaller coefficient — 9vw hero, 8.5vw footer —
holding one line down to roughly 775px and 715px. The design's own 10.6vw would
break it in two below about 1720px.

Display sizes are fluid rather than stepped — `clamp()` throughout, so the type
scale is continuous and set at the usage site.

### Radius

`--radius-frame` 14 · `--radius-card` 22 · `--radius-pill-sm` 23 ·
`--radius-panel-sm` 26 · `--radius-panel` 28 · pills use `999px`.

### Motion

Four eases, each with one job. A new animation that fits none of them is a
signal the animation is wrong, not that the scale needs a fifth.

| Token | Curve | Role |
| --- | --- | --- |
| `--ease-reveal` | `0.16, 1, 0.3, 1` | Entrances |
| `--ease-morph` | `0.76, 0, 0.24, 1` | Menu open/close, hamburger |
| `--ease-lift` | `0.33, 1, 0.68, 1` | Small hover lifts |
| `--ease-exit` | `0.4, 0, 1, 1` | Fast exits |

Durations run `--duration-tone` 240ms → `--duration-reveal` 780ms.

### Structure

`--spacing-gutter` (`clamp(18px, 3vw, 44px)`) is the shared horizontal inset.
`--inset-panel` (10px) is the white frame around every dark panel.

---

## 2. Component classes

Only patterns needing pseudo-elements, JS-queried hooks, or state that
utilities can't express live in `@layer components`. Everything else is
Tailwind utilities at the usage site.

- `.dot-grid` — dark-panel texture. Never used on its own any more.
- `.dot-grid--center` — masks that texture to a centre pool that falls away
  before the edges. Collaborate is the only panel that carries it, and its
  content is centred, so the pool sits behind the heading. The hero dropped the
  texture altogether: its process rules already cross that middle ground, and
  dots behind them read as noise rather than as ground.
- `.arrow-btn` (+ `__pill`, `__dot-slot`, `__dot`, `__label`, `__arrow-slot`) —
  structure only; every animated property belongs to GSAP.
- `.indent-link` — accent dot + label, 14px hover indent.
- `.icon-circle` / `.icon-circle--lift` — outlined circle inverting on hover.

---

## 3. Folder structure

```
app/
  globals.css              tokens, base, component classes  [done]
  layout.tsx               fonts, metadata, Lenis mount     [done]
  page.tsx                 section composition              [done]
  work/qc-pulse/page.tsx   QC Pulse case study         [partial]

components/
  case-study/              long-form page parts
    CaseSection.tsx          numbered section + prose column   [done]
    CaseFigure.tsx           screenshot well + caption    [done]
    MeanDriftDiagram.tsx     frozen vs rolling mean       [done]
    Blank.tsx                an unwritten fact, in accent [done]
  ui/                      design-system primitives
    ArrowButton.tsx          CTA pill, dot-spread hover     [done]
    Icons.tsx                arrow, socials, copyright      [done]
    IconCircle.tsx           outlined social circle         [done]
    Reveal.tsx               IntersectionObserver entrance  [done]
    DarkPanel.tsx            black rounded panel + dot grid [todo]
    ImageSlot.tsx            replaces the design's <image-slot>  [done]
    AccentRule.tsx           accent dot, hairline, accent dot    [done]
    StackRow.tsx             category label + separated chips  [unused]
    WorkCard.tsx             media + meta, scroll-scaled    [done]
    IndentLink.tsx           accent dot + label, hover indent    [done]
    AvatarSocials.tsx        socials pop above the hero avatar   [done]
  layout/
    Menu.tsx                 morphing pill -> panel         [partial]
    Footer.tsx               clipped sticky reveal          [done]
    SmoothScroll.tsx         Lenis mount                    [done]
  sections/
    Hero.tsx                 statement, nav, process row, name  [done]
    About.tsx                horizontal reel, 8 panels      [done]
    SelectedWork.tsx         heading, badge, cards, archive [done]
    Collaborate.tsx          closing panel + CTA            [done]

hooks/                                                      [done]
  useInView.ts             entrance trigger
  useMediaQuery.ts         live media query, for JS-owned layout
  usePanelTone.ts          menu pill inversion over dark panels
  useReducedMotion.ts      live prefers-reduced-motion
  useScrollScale.ts        work-card scale toward viewport centre
  useSmoothScroll.ts       Lenis + anchor routing + ScrollTrigger bridge

lib/                                                        [done]
  constants.ts             identity, socials, nav
  data.ts                  stack, projects, copy
  design/tokens.ts         colour / radius / geometry mirror
  design/motion.ts         ease + duration scales

types/index.ts                                              [done]
public/images/jaspher-gargar.png                            [done]
```

`[shell]` means the file exists and carries its structural container — the
padding, panel and stacking that fix the page's rhythm — with its content left
to the phase that owns it. `[partial]` means it works, but part of its own
phase is still outstanding; the file's header comment says which part.

### Responsive

Three hard breakpoints, each where a layout genuinely stops working rather than
at a device size: About turns from a reel into a column at 900px and work cards
change shape at 1100px. Everything else is fluid — `clamp()` at the usage site
— so there is no cascade of overrides to keep in sync.

The hero changes shape at 900px too, sharing About's breakpoint rather than
adding one of its own. Above it the section is read across: statement and
nav on one line, process track as a rule spanning the width, name and CTA pair
sharing the floor. Below it the section is read *down* — the track turns into a
column down the middle, the CTA pair stacks above the name instead of beside it,
and the name takes the full width at 10.6vw rather than the 8vw it can afford
with the pair alongside. `AccentRule` turns with its parent, so the track is one
component in two orientations, not two components.

The hero nav is allowed to vanish at that breakpoint rather than reflow, because
it is the one navigation on the page that is a convenience: the fixed pill
carries all four of its destinations at every width, so it costs nothing.

**One breakpoint is JavaScript's, and only that one.** About's horizontal reel
is a rig — a scrubbed tween, a sticky viewport, a height measured from the
track — and half of it cannot be written in CSS, so it can't be a layout that
merely stops applying. `useMediaQuery` holds the mode as React state and both
class sets are written out in full at each usage site. Everywhere else, a
breakpoint stays a media query in the class list.

**Full-screen fills use `svh`, never `vh`.** On mobile `100vh` is the viewport
with browser chrome *retracted*, so a `vh`-sized panel is taller than the screen
it renders on. This applies to the hero, About's sticky viewport, the
Collaborate panel, the footer and the open menu panel. `vh` is still correct for
proportional sizing (`52vh` on the About portrait read down the page), where
overshooting is harmless.

**Touch targets are gated on `pointer: coarse`, not width.** A narrow desktop
window keeps the tight 24px rhythm the footer is drawn around; only actual
fingers get the 44px floor.

**The hero's floor wraps on content, not at a width.** The name is only ever as
wide as its own `clamp()` resolves to and the CTA pair is only as wide as the
button plus the portrait, so the two drop onto separate lines at exactly the
width where they stop fitting on one — no extra breakpoint, and nothing to
re-tune when the button's label or the name changes.

### Entrances and the first frame

`Reveal` drives opacity from React state, so its hidden state is in the
server-rendered HTML. GSAP-driven entrances have to do the same by hand: the
element ships with its hidden state as an inline style, and the timeline
animates out of it. Setting the start state in an effect instead would paint
one frame at the end state first.

The cost is that the hidden state is real, so every such element also needs an
explicit reduced-motion branch that applies the end state — otherwise it stays
hidden for exactly the users who opted out of the animation. `data-reveal` on
the element gives the `globals.css` rule a second shot at it.

About is the deliberate exception: its panels use `from()` tweens and ship
*visible*, because its fallback is a different layout rather than a still frame.
Nothing there is hidden in the markup, so no-JS, reduced motion and every width
under 901px all get the section as plain stacked content with no branch to
maintain.

### Scrolling sideways

About is one track of panels that travels left while the page scrolls down. The
section is as tall as the track is wide (`--about-runway`, written by the reel
itself on every ScrollTrigger refresh), a sticky viewport holds the reel still
inside that height, and a scrubbed tween with `ease: "none"` ties the two
together. Four rules hold it up:

1. **Sticky, not `pin: true`.** ScrollTrigger's pin would insert a spacer and
   set the section `position: fixed`. Page-level stacking (below) forbids that:
   nothing between `<body>` and the Collaborate/footer pair may become a
   containing block. `position: sticky` creates none and is composited by the
   browser rather than written every frame.
2. **`ease: "none"` on the travel tween.** Any other curve breaks the tie
   between where the page is scrolled and where the reel has got to.
3. **Everything else in the section reads the reel, not the page.** Panel
   entrances and the portrait's parallax hang off `containerAnimation`, so they
   fire on horizontal position. The exception is the panels already on screen
   when the reel starts: measured against the track they arrive before it has
   moved, so they play off the section rising into view instead.
4. **Lenis drives GSAP's ticker, and `ScrollTrigger.update` runs on Lenis's own
   scroll event.** One loop, one order per frame. Left to its own listener
   ScrollTrigger reads the position a frame late, which is invisible on a fade
   and very visible on a sticky viewport whose track is written every frame.

### Hover groups that reach outside their own box

`AvatarSocials` pops a column of links *above* the avatar, so the thing you
hover and the thing you reach for don't share a box. Two rules keep the group
from closing mid-reach:

- The column is a DOM **child** of the hover root. `mouseenter`/`mouseleave`
  are defined over an element *and its descendants*, not over its box, so a
  column positioned at `bottom-full` — entirely outside the root's box — still
  counts as inside. `mouseover`/`mouseout` with a `relatedTarget` check would
  be the fallback if it ever couldn't be a descendant.
- The visual gap between trigger and column is the column's **padding**, never
  a margin. Padding is inside the box; a margin is dead space that fires
  `mouseleave` on the way up.

Focus follows the same group: `focusout` ignores any `relatedTarget` still
inside the root, or tabbing between the links themselves would close it. The
links stay in the tab order while closed (they animate `opacity`, not
`visibility`) — otherwise nothing could focus them, and nothing could open the
group by keyboard.

### Shared values and the client boundary

`DARK_PANEL_ATTR` / `darkPanelProps` live in `lib/design/tokens.ts`, not beside
the `usePanelTone` hook that consumes them. A plain value exported from a
`"use client"` module becomes a client reference, so a server component that
imports it receives something that is not the object — here the attribute
simply never rendered, and the pill never inverted, with no error anywhere.

Any constant shared between a client hook and server-rendered markup belongs in
a module with no `"use client"` directive.

### Scroll locking

Lenis reads wheel and touch events rather than the scrollbar, so
`body { overflow: hidden }` does **not** stop it. Anything that covers the
viewport needs `data-lenis-prevent` as well — `globals.css` already carries the
matching rule. `Menu` sets both: the attribute for the Lenis path, `overflow`
for the reduced-motion path where Lenis never mounts.

### Page-level stacking

The footer is `position: fixed` and revealed by scroll, which puts three rules
on the page composition:

1. `Collaborate` is opaque and `z-2`; the footer's wrapper is `z-1`. The panel
   is the lid over the footer.
2. The footer's wrapper clips with `clip-path`, not `overflow` — `overflow` on
   an ancestor does not clip a fixed descendant.
3. Nothing between `<body>` and those two may create a stacking context or a
   containing block (a `transform`, `filter`, or `contain`), or the footer
   stops being positioned against the viewport.

---

## 4. Notes on the port

Three things in the design source were deliberately **not** carried over:

1. **The 700ms reveal fallback.** The source forces every `[data-reveal]`
   visible 700ms after mount as a safety net, which cancels the entrance for
   anything below the fold. `useInView` relies on IntersectionObserver alone.

   Dropping it exposed a case the fallback had been hiding: the default
   `rootMargin` of `0px 0px -8%` means an element pinned to the bottom edge of
   a full-height panel can never reach the 15% threshold without scrolling, so
   it would never reveal. The hero's marquee was exactly that and passed
   `threshold={0}` / `rootMargin="0px"` to opt out; the marquee is gone, but any
   future reveal sitting at the foot of a `100svh` section needs the same.
2. **`_equalizeStackRows`.** It queries `[data-stacklabel]`, which does not
   exist in the markup — dead code. The row grid already equalises heights via
   `grid-template-rows: repeat(4, minmax(min-content, 1fr))`.

   Its neighbour `_trimBars` hides the separator on any chip that wraps to the
   start of a new line, and was dropped rather than copied: the chips are one
   line at every width now — the row shrinks its type to fit instead of
   wrapping — so no chip can ever start a line. Nothing to trim.
3. **`[data-arrowbtn-old]`.** A superseded hover treatment left in the file.

One fix applied: the CTA's dot-cover scale is measured from the *dot slot*
(fixed size) rather than the dot itself (GSAP-scaled), so re-entering the button
mid-animation computes the same scale as entering it from rest.

`image-slot.js` and `support.js` are design-time scaffolding — a drag-drop
placeholder web component and the `x-dc` runtime that binds `{{ }}` props and
`style-hover`. Neither is ported; `ImageSlot.tsx` and ordinary React state
replace them.
