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
name, the marquee headline, both section headings and the footer name; Space
Grotesk carries body copy, descriptions, nav, buttons, and the hero's role line
and process labels.

The role line under the hero name is the one place that reads as a caption on
the name rather than as data, so it takes Space Grotesk. Everything Space Mono
still holds is a label *of* something else — a category, a stack, a stamp.

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

components/
  ui/                      design-system primitives
    ArrowButton.tsx          CTA pill, dot-spread hover     [done]
    Icons.tsx                arrow, socials, copyright      [done]
    IconCircle.tsx           outlined social circle         [done]
    Marquee.tsx              RAF ticker, scroll-reactive    [done]
    Reveal.tsx               IntersectionObserver entrance  [done]
    DarkPanel.tsx            black rounded panel + dot grid [todo]
    ImageSlot.tsx            replaces the design's <image-slot>  [done]
    AccentRule.tsx           accent dot, hairline, accent dot    [done]
    StackRow.tsx             category label + separated chips    [done]
    WorkCard.tsx             media + meta, scroll-scaled    [done]
    IndentLink.tsx           accent dot + label, hover indent    [done]
    AvatarSocials.tsx        socials pop above the hero avatar   [done]
  layout/
    Menu.tsx                 morphing pill -> panel         [partial]
    Footer.tsx               clipped sticky reveal          [done]
    SmoothScroll.tsx         Lenis mount                    [done]
  sections/
    Hero.tsx                 name, role, process row, marquee    [done]
    TechStack.tsx            intro, layout, reveals         [done]
    SelectedWork.tsx         heading, badge, cards, archive [done]
    Collaborate.tsx          closing panel + CTA            [done]

hooks/                                                      [done]
  useInView.ts             entrance trigger
  usePanelTone.ts          menu pill inversion over dark panels
  useReducedMotion.ts      live prefers-reduced-motion
  useScrollScale.ts        work-card scale toward viewport centre
  useSmoothScroll.ts       Lenis + anchor routing

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
at a device size: the stack grid collapses at 900px, work cards at 1100px, and
the marquee headline drops to a smaller clamp under 640px. Everything else is
fluid — `clamp()` at the usage site — so there is no cascade of overrides to
keep in sync.

One layout asks its *column* rather than the viewport: `StackRow` stacks its
label above its chips under a 480px column, because the two stop agreeing the
moment the stack grid collapses — the same 1000px viewport gives the row a
480px column in two columns and a 940px one in one. It is a container query for
that reason, and it is the only one in the page.

**Full-screen fills use `svh`, never `vh`.** On mobile `100vh` is the viewport
with browser chrome *retracted*, so a `vh`-sized panel is taller than the screen
it renders on. This applies to the hero panel, the stack section, the
Collaborate panel, the footer and the open menu panel. `vh` is still correct for
proportional sizing (`52vh` on the stack photo), where overshooting is harmless.

**Touch targets are gated on `pointer: coarse`, not width.** A narrow desktop
window keeps the tight 24px rhythm the footer is drawn around; only actual
fingers get the 44px floor.

**The hero's padding and its marquee are one value.** The marquee cancels the
panel's inset to run edge to edge, so both read `--spacing-gutter`. Hardcoding
either leaves the marquee inset or overhanging at every width but one.

**The hero's process row wraps on content, not at a width.** The stage track
holds a 240px floor and the CTA pair is only as wide as the button plus the
avatar, so the two drop onto separate lines at exactly the width where they
stop fitting on one — no fourth breakpoint, and nothing to re-tune when the
button's label or the stage names change.

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
   it would never reveal. The hero marquee is exactly that, and passes
   `threshold={0}` / `rootMargin="0px"` to opt out. Any future reveal sitting
   at the foot of a `100vh` section needs the same.
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
