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
  layout.tsx               fonts, metadata, menu mount      [todo]
  page.tsx                 section composition              [todo]

components/
  ui/                      design-system primitives         [todo]
    ArrowButton.tsx          CTA pill, dot-spread hover
    DarkPanel.tsx            black rounded panel + dot grid
    IconCircle.tsx           outlined social circle
    Icons.tsx                LinkedIn / Instagram / GitHub / arrow / copyright
    ImageSlot.tsx            replaces the design's <image-slot>
    IndentLink.tsx           accent dot + label, hover indent
    Marquee.tsx              RAF ticker, scroll-reactive direction
    Reveal.tsx               IntersectionObserver entrance wrapper
    StackRow.tsx             category label + separated chips
    WorkCard.tsx             media + meta, scroll-scaled
  layout/                                                   [todo]
    Menu.tsx                 morphing pill -> panel
    Footer.tsx               clipped sticky reveal
    SmoothScroll.tsx         Lenis mount
  sections/                                                 [todo]
    Hero.tsx  TechStack.tsx  SelectedWork.tsx  Collaborate.tsx

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
public/images/jaspher.jpeg                                  [done]
```

---

## 4. Notes on the port

Three things in the design source were deliberately **not** carried over:

1. **The 700ms reveal fallback.** The source forces every `[data-reveal]`
   visible 700ms after mount as a safety net, which cancels the entrance for
   anything below the fold. `useInView` relies on IntersectionObserver alone.
2. **`_equalizeStackRows`.** It queries `[data-stacklabel]`, which does not
   exist in the markup — dead code. The row grid already equalises heights via
   `grid-template-rows: repeat(4, minmax(min-content, 1fr))`.
3. **`[data-arrowbtn-old]`.** A superseded hover treatment left in the file.

One fix applied: the CTA's dot-cover scale is measured from the *dot slot*
(fixed size) rather than the dot itself (GSAP-scaled), so re-entering the button
mid-animation computes the same scale as entering it from rest.

`image-slot.js` and `support.js` are design-time scaffolding — a drag-drop
placeholder web component and the `x-dc` runtime that binds `{{ }}` props and
`style-hover`. Neither is ported; `ImageSlot.tsx` and ordinary React state
replace them.
