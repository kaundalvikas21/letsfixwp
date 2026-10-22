---
name: LetsFixWP v3
description: Emergency WordPress repair, laid out as a calm operations board with one green signal.
colors:
  bg: "#f3f4f6"
  surface: "#fcfcfd"
  surface-2: "#eceef1"
  text: "#0f1115"
  muted: "#555b66"
  line: "#e1e4e8"
  line-strong: "#7e8590"
  accent: "#15803d"
  on-accent: "#fcfcfd"
  accent-tint: "color-mix(in srgb, #15803d 6%, #fcfcfd)"
  photo-scrim: "hsl(220 30% 6% / 0.65)"
  on-photo: "#fcfcfd"
  cta-base: "#135e30"
  on-cta: "#fcfcfd"
  cta-ink: "#0f1115"
typography:
  display:
    fontFamily: "Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Cabinet Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  card: "20px"
  field: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  section: "64px"
  section-lg: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0 1.25rem"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-accent:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
    height: "44px"
  pill-radio-track:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "4px"
  pill-radio-thumb:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    height: "44px"
---

# Design System: LetsFixWP v3

## Overview

**Creative North Star: "The Calm Operations Room"**

Someone arrives here because their site is down. The design answers by looking like a room where this
is handled every day: a composed board of everything that can break, each area a card with its own
weight, nothing flashing, nothing shouting. The surfaces are cool paper greys that sit a hair apart in
tone; the type is confident without being loud; and exactly one colour, a deep functional green, marks
the thing the visitor came for. That restraint is the whole trick. If three things competed for the
signal, nothing would read as under control.

Depth is soft rather than dramatic. Every card rests on a two-layer shadow tinted to the background's
cool hue (around hue 220), never black, so the board looks lit rather than cut out. Corners are
generous (20px on anything card-shaped), controls are full pills, and the single translucent surface on
the entire site is the floating nav. Photography is bright daylight and literal: a desk, a laptop, a
shop owner checking orders. Where the subject is a WordPress error, the image is a real capture from
`public/screens/`, not a div dressed up as a browser. Evidence beats illustration here, because the
product claim is competence.

Motion reports, it does not perform. Cells rise 12px and fade as the grid comes into view, in reading
order; a toggle's thumb slides to the option you picked; a button presses 2%. Everything runs on one
critically damped spring (stiffness 100, damping 20) and collapses to its final state under reduced
motion. The world this rejects is specific and confirmed: no second accent, no brand red, no glass
beyond the nav, no gradients beyond one closing panel, no GSAP, no marquees, no parallax, no neon.

**Key Characteristics:**
- One accent, used as a signal, on a cool paper grey field
- Bento board layout with deliberately unequal spans
- Soft two-layer shadows tinted to the background hue, never black
- Three radii only: 20px cards, 12px fields, full-pill controls
- Both themes designed, not inverted, and every pair measured at AA
- Real photographs and real error captures; no synthetic UI
- Spring motion on transform and opacity only

## Colors

Cool paper greys carrying a single deep green signal; both themes are designed independently and every
pair below was measured, not estimated.

### Primary
- **Back-Online Green** (`#15803D` light / `#4ADE80` dark): The only accent in the system. Primary
  button fills, the pill-radio thumb, the focus ring, accent-coloured body text, the selected-plan
  border, and the closing CTA mesh. It names the outcome the customer is buying, which is why it never
  gets used decoratively. Derived from brand green `#399A35` and darkened until white labels pass
  (`#399A35` with a white label measures 3.59:1, which fails).
- **Accent Tint** (`color-mix(in srgb, accent 6%, surface)`): A single bento cell background, to give
  one area of the board slightly more weight without introducing a second hue.

### Neutral
- **Paper Grey** (`#F3F4F6` light / `#0D0F12` dark): The page field. Cards sit on it.
- **Card White** (`#FCFCFD` light / `#15181D` dark): Card and panel surfaces, the mobile bars, the
  secondary button fill. Never pure `#FFFFFF`.
- **Inset Grey** (`#ECEEF1` light / `#1B1F25` dark): Recessed and raised-away surfaces: the pill-radio
  track, device-frame bezels, code blocks, quiet bento cells, nav hover.
- **Ink** (`#0F1115` light / `#E9EBEE` dark): All primary text.
- **Muted Ink** (`#555B66` light / `#9AA1AC` dark): Supporting copy, icon-only glyph colour, captions.
- **Hairline** (`#E1E4E8` light / `rgb(255 255 255 / 0.08)` dark): Decorative edges only: card borders,
  dividers, the mobile bar rules.
- **Control Edge** (`#7E8590` light / `rgb(255 255 255 / 0.36)` dark): The boundary of anything a
  person can operate: inputs, selects, the segmented track, dashed placeholder frames.

### Tertiary (photographic and closing panel)
- **Photo Scrim** (`hsl(220 30% 6% / 0.65)`): A flat scrim, deliberately not a gradient, laid over any
  photograph that carries text. Holds `#FCFCFD` at 5.78:1 over any frame in the library.
- **CTA Base** (`#135E30` light / `#223A32` dark) with two accent blobs: the one gradient on the site,
  on the closing panel only. The lightest point the mesh can reach is the accent itself, so white text
  holds 4.89:1 in light and 6.69:1 at the darkest-theme overlap, and the panel needs no scrim.

### Named Rules
**The One Signal Rule.** One accent, and it means "back online". The brand red (`#CC3333` in
`brand.accent`) does not appear anywhere in this variation: it competes with the signal and reads as an
error state. No second hue gets introduced to mark a highlighted plan, a badge, or a state.

**The Control Boundary Rule.** `--line` is decorative and measures 1.24:1. Any boundary that identifies
something operable (input, select, checkbox, segmented track) uses `--line-strong`, which measures at
least 3.20:1 on every surface in both themes.

**The Accent-On-Light Rule.** Small accent-coloured text sits on `--surface` (4.89:1) or `--bg`
(4.56:1), never on `--surface-2`, where it drops to 4.31:1. On that surface the accent is for large
text and icons only.

## Typography

**Display Font:** Cabinet Grotesk 700/800, self-hosted via `next/font/local` from `src/fonts/`
(fallback `ui-sans-serif, system-ui, sans-serif`)
**Body / UI Font:** Inter Tight via `next/font/google` (fallback `ui-sans-serif, system-ui, sans-serif`)

**Character:** Cabinet Grotesk's tight, slightly geometric caps give headlines authority without
corporate stiffness; Inter Tight underneath is narrow enough to set dense service copy at 16px without
feeling cramped. The pairing reads engineered rather than marketed, which is the point on a page where
someone is deciding whether to trust you with their site.

### Hierarchy
- **Display** (800, `2.125rem` to `3.25rem` across breakpoints, line-height 1.05, tracking -0.02em):
  The page `h1`. One per page. Balanced with `text-balance`, capped at two lines.
- **Headline** (800, `2.25rem` to `3rem`, line-height 1.05, tracking -0.02em): Section `h2`.
- **Title** (700, `1.25rem` to `1.5rem`, line-height 1.25): Card and bento-cell `h3`, measure capped
  around 22ch.
- **Body** (400, `1rem`, line-height 1.6): All running copy, measure capped between 40ch and 70ch
  depending on the container. Hero and section lead copy steps up to `1.125rem`.
- **Label** (500/600, `0.875rem`): Button labels, nav links (`15px`), form labels, supporting lines
  inside cards. The one eyebrow treatment is `0.75rem`, weight 500, tracking 0.06em, uppercase, in
  muted ink.

### Named Rules
**The Display-Never-Body Rule.** Cabinet Grotesk sets headings and the wordmark. It never sets running
copy, labels, or UI text, at any size.

**The Muted-Not-Faded Rule.** Secondary text uses `--muted`, never reduced opacity on `--text`. Opacity
breaks the measured contrast and goes grey-on-grey over photographs.

**The Tightening Rule.** Display tracking closes to -0.02em from 48px up; body and label tracking stay
at normal. Nothing in this system is letterspaced for decoration except the single uppercase eyebrow.

## Layout

A centred single column of sections, each `max-w-6xl` (1152px) with `px-4` rising to `px-6` at 768px,
separated by `64px` of vertical padding that opens to `96px` from 1024px up. Inside that column the
signature structure is a bento board: 1 column below 768px, 2 columns at `md` with `200px` auto-rows,
and 4 columns by 3 rows at `lg` with `220px` auto-rows, cells placed explicitly by column and row start
so spans are deliberately unequal (2x2, 2x1, 1x1). Grid gap is `16px`, rising to `20px` from 768px.

Spacing follows a 4px base (Tailwind's scale): `8px` between adjacent touch targets, `12px` between
stacked buttons, `24px` card padding rising to `40px` on wide panels, `20px` to `40px` between a
heading and what follows it.

Navigation is a floating glass pill from 768px up (`60px` tall, `max-w-5xl`, sticky `16px` from the
top, inset by `1rem` on each side). Below 768px it splits into a `56px` top bar and a fixed bottom
action bar carrying the primary CTA, padded for `env(safe-area-inset-bottom)`. Responsive behaviour is
checked at 375, 768, 1024 and 1440 with no horizontal scroll at any of them.

### Named Rules
**The No-Three-Equal-Cards Rule.** No row of three equal cards, anywhere. On the board, spans vary so
no row reads as a tidy triptych; every cell is fully readable at rest, without hover.

**The Floating-Nav Clearance Rule.** `html` carries `scroll-padding-top: 6rem` and
`scroll-padding-bottom: 6.5rem` (dropping to `2rem` at 768px) so no anchor target or keyboard tab stop
ever parks under the floating nav or the mobile action bar.

## Elevation & Depth

Hybrid, and deliberately soft. Tonal steps carry hierarchy (`--bg` field, `--surface-2` inset,
`--surface` card), while shadow carries material: every card rests on `--shadow-card`, a two-layer
shadow tinted to the background's cool hue around 220, so the board reads as lit paper rather than cut
shapes. Dark mode adds a 1px inset top highlight (`inset 0 1px 0 rgb(255 255 255 / 0.04)`) so a card
edge resolves without a heavy border. `--shadow-lift` is the heavier of the two and is reserved for
hover on something clickable, which makes shadow a statement about interactivity rather than rank.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 0 1px 2px hsl(220 20% 40% / 0.06), 0 8px 24px -6px hsl(220 20% 40% / 0.1)`):
  Every card, bento cell, panel, device frame, and the mobile action bar. Dark:
  `inset 0 1px 0 rgb(255 255 255 / 0.04), 0 1px 2px hsl(220 30% 2% / 0.5), 0 12px 32px -8px hsl(220 30% 2% / 0.6)`.
- **Lift** (`box-shadow: 0 2px 4px hsl(220 20% 40% / 0.07), 0 16px 40px -10px hsl(220 20% 40% / 0.16)`):
  Hover on an interactive card or primary button, and the hero image at rest (the one deliberate
  exception, to float it over the section below). Dark:
  `inset 0 1px 0 rgb(255 255 255 / 0.04), 0 2px 4px hsl(220 30% 2% / 0.55), 0 20px 48px -12px hsl(220 30% 2% / 0.7)`.
- **Nav inset highlight** (`inset 0 1px 0 rgb(255 255 255 / 0.12)` plus card rest): The floating glass
  pill only.

### Named Rules
**The Lift-Means-Link Rule.** `--shadow-lift` on hover says "this is clickable". A non-interactive
surface never grows its shadow, and an interactive one never changes size or position on hover; the
transition is `box-shadow` only, so nothing in the grid shifts.

**The No-Black-Shadow Rule.** Shadows are tinted to the page hue (220), never `rgba(0,0,0,...)`. Black
shadows read as dirt on a cool grey field.

## Shapes

Three radii and no others. Anything card-shaped, including bento cells, panels, device frames, image
containers, and the closing CTA, is `20px`. Anything you type into, and the inner edge of a screenshot
inside its frame, is `12px`. Anything you press or switch, including buttons, chips, the segmented
control, and the floating nav itself, is a full pill (`9999px`). Borders are 1px, hairline for decoration
and `--line-strong` for controls; a dashed `--line-strong` border at `12px` is the system's one
placeholder marker, used to flag unconfirmed content visibly on the page. Nested elements inside a card
keep the table's radius rather than deriving a smaller one, unless they would visibly clash.

### Named Rules
**The Three-Radius Rule.** 20 / 12 / pill. A new radius is a bug, not a variation.

## Components

### Buttons
- **Shape:** Full pill (`9999px`), minimum height `44px`, horizontal padding `1.25rem`, label weight
  600, and the label never wraps.
- **Primary:** Accent fill with `--on-accent` text. On the closing CTA panel it inverts to an
  `--on-cta` fill with `--cta-ink` text, so the pill still reads as the primary against the mesh.
- **Hover / Focus / Press:** Hover raises `--shadow-lift` over 200ms; press scales to 0.98 over 150ms;
  focus is a 2px accent outline at 2px offset. No colour shift on hover, no movement on hover.
- **Secondary:** `--surface` fill, `--text` label, 1px `--line-strong` border, same pill and height.
  On the CTA panel it goes transparent with an `--on-cta` border and label.

### Cards / Containers
- **Corner Style:** `20px`.
- **Background:** `--surface` by default; `--surface-2` for a quieter cell; `--accent-tint` for exactly
  one cell on the board; a photograph plus the flat photo scrim for image cells.
- **Shadow Strategy:** `--shadow-card` at rest, `--shadow-lift` on hover only when the card is a link
  (see The Lift-Means-Link Rule).
- **Border:** 1px `--line`.
- **Internal Padding:** `24px`, rising to `32px` or `40px` on wide panels; `20px` on compact panels.

### Inputs / Fields
- **Style:** `--surface` or `--surface-2` fill, 1px `--line-strong` border, `12px` radius, minimum
  height `44px`, padding `12px 16px`, font-size 16px so iOS does not zoom on focus.
- **Focus:** The outline sits on the wrapper via `focus-within` (2px accent, 2px offset) when the field
  shares its box with an icon, so the icon and input read as one control.
- **Error:** Rendered inline under the field, and the message block uses `--line-strong` on
  `--surface-2` at `12px` with `role="alert"`.

### Segmented control (pill radio)
- **Style:** `--surface-2` track, 1px `--line-strong` border, `4px` padding, items `44px` tall with
  `1.25rem` horizontal padding.
- **State:** Unselected items are `--muted` and go to `--text` on hover; the selected item sits on an
  accent thumb animated with a shared `layoutId` and carries `--on-accent`. Built on a Radix radio
  group, so arrow keys move the selection; reduced motion makes the thumb jump instead of slide.

### Navigation
- **Desktop (768px up):** A floating glass pill: `color-mix(in srgb, surface 72%, transparent)` with
  `backdrop-filter: blur(16px) saturate(140%)`, a 1px inner white border at 10%, the inset highlight,
  and `--shadow-card`. Links are `15px` weight 500 in pill hit areas `44px` tall that fill with
  `--surface-2` on hover. The wordmark is display 800 at `1.25rem`. Under
  `prefers-reduced-transparency: reduce` the blur drops and the fill goes solid `--surface`.
- **Mobile (below 768px):** A solid `--surface` top bar `56px` tall with a hairline bottom border, plus
  a fixed bottom `nav` landmark carrying the primary CTA at `48px` tall and a chat icon button, with
  `8px` between targets and safe-area padding.

### Device frame
Real captures from `public/screens/` sit in a `--surface-2` bezel at `20px` outer radius with the
screenshot itself at `12px` and `--shadow-card`. No browser chrome built from divs beyond a thin top
bar, and never a dashboard assembled from markup.

### Named Rules
**The Transform-And-Opacity Rule.** Animate transform and opacity only, on the spring (stiffness 100,
damping 20) with a 60ms stagger across a grid, and let `useReducedMotion()` collapse every one of them
to its final state. Hover scale, where it exists, sits on a wrapper so it cannot shift layout.

## Do's and Don'ts

### Do:
- **Do** keep the accent scarce and functional: fills, the thumb, the focus ring, accent text. If a
  screen has accent in more than a few places, something that is not a signal is wearing the signal.
- **Do** use `--line-strong` on every control boundary and `--line` only for decoration.
- **Do** design both themes. Check any new pair against the measured table in
  `design-system/letsfixwp-v3/MASTER.md` rather than assuming the dark value inverts.
- **Do** keep to 20 / 12 / pill, and to `--shadow-card` / `--shadow-lift`.
- **Do** ship real imagery: daylight photography from `src/content/photos.ts` (never a `red`-toned
  frame in this variation) or real captures from `public/screens/`, inside the device frame.
- **Do** mark unconfirmed content visibly, with the dashed `--line-strong` placeholder frame, rather
  than letting a placeholder pass as fact.
- **Do** give every animation a one-sentence job (hierarchy, feedback, state) and a reduced-motion
  collapse.

### Don't:
- **Don't** introduce a second accent, brand red `#CC3333`, or any extra hue for a badge, a highlighted
  plan, or a state.
- **Don't** use glass anywhere except the floating nav, or a gradient anywhere except the closing CTA
  mesh.
- **Don't** use pure `#000000` or `#FFFFFF`, or `rgba(0,0,0,...)` shadows.
- **Don't** set body copy in Cabinet Grotesk, or fade text with opacity instead of `--muted`.
- **Don't** put small accent-coloured text on `--surface-2`.
- **Don't** add GSAP, marquees, parallax, scroll listeners, custom cursors, or neon glows.
- **Don't** build a row of three equal cards, a fake screenshot or dashboard from divs, or put a pill or
  label on top of an image.
- **Don't** let a hover change layout, or leave a focus state invisible.
