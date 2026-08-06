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
| `--color-accent` | `#f3350c` | Nav dots, count badge, CTA dot spread |
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
| Space Mono | `--font-mono` | Anything that should read as *data*: role, category labels, tech lists, project stamps. |

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

- `.dot-grid` — the texture that identifies a dark panel.
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
    Icons.tsx                arrow + LinkedIn/Instagram/GitHub  [done]
    IconCircle.tsx           outlined social circle         [done]
    Marquee.tsx              RAF ticker, scroll-reactive    [done]
    Reveal.tsx               IntersectionObserver entrance  [done]
    DarkPanel.tsx            black rounded panel + dot grid [todo]
    ImageSlot.tsx            replaces the design's <image-slot>  [todo]
    IndentLink.tsx           accent dot + label, hover indent    [todo]
    StackRow.tsx             category label + separated chips    [done]
    WorkCard.tsx             media + meta, scroll-scaled    [todo]
  layout/
    Menu.tsx                 morphing pill -> panel         [partial]
    Footer.tsx               clipped sticky reveal          [shell]
    SmoothScroll.tsx         Lenis mount                    [done]
  sections/
    Hero.tsx                 name, role, CTA, marquee       [done]
    TechStack.tsx            intro + two-column layout      [partial]
    SelectedWork.tsx  Collaborate.tsx                       [shell]

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

   Its neighbour `_trimBars` is broken in a similar way and was reimplemented
   rather than copied. It walks `row.children` — which is `[label, chipList]`,
   the two grid cells, not the chips — so `querySelector('[data-bar]')` only
   ever reaches the first separator in a row, and the line-start comparison
   runs against the label's offset. `StackRow` walks the chips themselves.
3. **`[data-arrowbtn-old]`.** A superseded hover treatment left in the file.

One fix applied: the CTA's dot-cover scale is measured from the *dot slot*
(fixed size) rather than the dot itself (GSAP-scaled), so re-entering the button
mid-animation computes the same scale as entering it from rest.

`image-slot.js` and `support.js` are design-time scaffolding — a drag-drop
placeholder web component and the `x-dc` runtime that binds `{{ }}` props and
`style-hover`. Neither is ported; `ImageSlot.tsx` and ordinary React state
replace them.
