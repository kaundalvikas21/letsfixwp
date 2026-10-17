---
name: LetsFixWP
description: A dark-only rescue story for owners whose WordPress site just broke, lit by a single ember accent.
colors:
  ember: "#ff5a36"
  on-ember: "#0c0c0e"
  bg: "#0c0c0e"
  surface: "#141417"
  surface-2: "#1c1c21"
  text: "#f1f0ee"
  muted: "#a3a3ad"
  line: "rgb(255 255 255 / 0.08)"
  line-strong: "rgb(255 255 255 / 0.36)"
  accent-tint: "color-mix(in srgb, #ff5a36 10%, #141417)"
  photo-scrim: "rgb(12 12 14 / 0.66)"
  scrim: "rgb(12 12 14 / 0.72)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 8vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.04em"
    fontVariation: "'opsz' 72"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
    fontVariation: "'opsz' 48"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  all: "14px"
spacing:
  gap: "16px"
  card: "32px"
  section: "64px"
  section-lg: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.on-ember}"
    rounded: "{rounded.all}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.all}"
    padding: "0 20px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.all}"
    padding: "{spacing.card}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.all}"
    padding: "10px 16px"
    height: "44px"
  option-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.all}"
    padding: "14px"
  option-row-selected:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.text}"
    rounded: "{rounded.all}"
    padding: "14px"
  error-string:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    typography: "{typography.mono}"
    rounded: "{rounded.all}"
    padding: "12px 16px"
  capture-frame:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.all}"
    padding: "8px"
---

# Design System: LetsFixWP

## Overview

**Creative North Star: "The 2AM Rescue"**

Dark is not a theme here, it is the condition. Someone's site went down in the middle of the night and
they are on a phone, in the dark, looking for one competent voice. So the page is the room they are
sitting in: near-black, quiet, with a single warm light in it. That light is ember, and it falls only on
the thing they should touch next. Everything else is tonal: three charcoal steps and a hairline, doing
the work that colour would do in a brighter system.

The register is urgent but calm. Urgency comes from the storytelling, not from the styling: real error
captures stacked and scrubbed under the scroll, a horizontal pan that walks through the fix, a zoom that
lands on the restored site. Calm comes from everything holding still around it. One radius. One accent.
One translucent surface on the whole site. Body copy at 17px and 1.6, muted text set in a real muted
colour rather than at reduced opacity. The composition is bold and asymmetric, the palette is almost
monastic, and that tension is the point: the design is loud about the story and silent about itself.

Three worlds were considered and rejected on the record. **Not** the alert-red-plus-safety-blue
dashboard the brief's generator first returned: two hues and a destructive red make every section look
like an error state. **Not** generic dark SaaS, so no purple, no neon, no glow, no glass beyond the
scrolled nav bar, no gradient outside two measured exceptions. **Not** status-colour UI: broken and
restored are told with real photographs of the real screens and with plain words, never with hue, which
also means a colour-blind visitor loses nothing.

**Key Characteristics:**

- Dark only, locked. No `prefers-color-scheme` branch, so one designed theme and one contrast table.
- A single accent, ember, carrying every button, focus ring and active indicator.
- One radius, 14px, on every box including nested ones.
- Flat surfaces separated by tonal stepping and a lit top edge, never by drop shadows.
- Motion that tells the rescue story and is motivated case by case; nothing else moves.
- Night-time real photography and real error captures. No illustration, no div-built fake screens.

## Colors

A near-monochrome dark palette in warm-neutral charcoals, interrupted by exactly one chromatic voice.

### Primary

- **Ember** (`#FF5A36`): the only accent in the system. It fills buttons, draws the 2px focus ring, marks
  the active nav indicator, scales the nav progress rail and the horizontal-pan rail, and tints a
  selected option. As text it is reserved for one or two display words and for link accent, never for a
  run of copy. It is a deliberately warmer evolution of the registered brand red (`brand.accent`,
  `#CC3333`), which does not appear anywhere in this system.
- **On Ember** (`#0C0C0E`): the near-black label that sits on every ember fill.

### Neutral

- **Lights Out** (`#0C0C0E`): the page. Also the scrim colour and the on-ember label, so the darkest
  value in the system does three jobs.
- **Lifted Charcoal** (`#141417`): cards, panels, inputs, the default raised surface.
- **Inset Charcoal** (`#1C1C21`): the step above that. Capture-frame bezels, code and error blocks,
  inset wells, the unfilled half of a progress segment.
- **Warm Paper** (`#F1F0EE`): all primary text, and text over photography. Slightly warm, never pure
  white.
- **Cold Slate** (`#A3A3AD`): secondary and supporting copy, eyebrows, help text, placeholders.
- **Hairline** (`rgb(255 255 255 / 0.08)`): decorative edges only. Card borders, dividers, the nav's
  bottom rule.
- **Control Line** (`rgb(255 255 255 / 0.36)`): the boundary of anything operable. Inputs, selects,
  textareas, option rows, the secondary button.
- **Ember Tint** (`color-mix(in srgb, #ff5a36 10%, #141417)`): the fill of a chosen option, paired with
  an ember border.
- **Photo Scrim** (`rgb(12 12 14 / 0.66)`) and **Overlay Scrim** (`rgb(12 12 14 / 0.72)`): flat veils for
  text over photography and for dialog backdrops. Flat, never a gradient.

### Named Rules

**The One Voice Rule.** There is exactly one accent hue in the system and no second one may be
introduced, including for status. No green "fixed", no blue "safe", no amber "warning". If a state needs
telling, tell it with a real capture and a sentence.

**The Never White On Ember Rule.** White on ember measures 3.10:1 and fails AA. Every ember fill carries
the `#0C0C0E` label, which measures 6.30:1. This is not a preference; shipping white on ember is a bug.

**The Two Lines Rule.** A 1px edge that is decoration uses Hairline (1.19 to 1.26:1, decorative only). A
1px edge that tells you something is operable uses Control Line (3.26 to 3.36:1, clears the 3:1 that
non-text UI requires). Choosing by appearance instead of by function is how this system breaks.

All pairs are measured, not assumed: text on the three surfaces runs 17.16 / 16.14 / 14.90, muted runs
7.82 / 7.35 / 6.79, and ember on the three surfaces runs 6.30 / 5.93 / 5.47.

## Typography

**Display Font:** Bricolage Grotesque (variable, `opsz` axis set explicitly; falls back to
`ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Geist (variable)
**Label/Mono Font:** Geist Mono

**Character:** A loud, slightly eccentric grotesque over a completely neutral one. Bricolage carries all
the personality, tightly tracked at `-0.04em` and set heavy at 700 to 800, so headlines read as spoken
rather than typeset. Geist underneath it is deliberately characterless: it has a mono sibling in the same
family, it is not Inter, and it stays out of the way while the display face does the talking.

### Hierarchy

- **Display** (800, `1.875rem` to `4.5rem` stepped, line-height 1.1, tracking `-0.04em`): the hero
  headline and kinetic words only. The size steps through five breakpoints and the optical axis steps
  with it: `opsz` 30, 36, 48, 60, 72.
- **Headline** (700, `3rem`, line-height 1.1, tracking `-0.04em`, `opsz` 48): section headings.
- **Title** (700, `1.25rem`, tracking `-0.04em`): card and panel headings.
- **Body** (400, `17px`, line-height 1.6): all running copy. Measure is capped at `68ch` for prose and
  tighter (`42ch` to `52ch`) for lead paragraphs sitting beside a visual.
- **Label** (600, `14px`, tracking `0.02em`, sentence case): eyebrows, field labels, help text. Set in
  Cold Slate.
- **Mono** (400, `15px`): error strings, HTTP codes, file paths and log lines, exactly as WordPress
  prints them. Never UI copy.

### Named Rules

**The Optical Size Rule.** Bricolage's `opsz` axis is set to match the rendered size at every breakpoint
rather than left at its default. Faking large-size optics with tracking alone is not acceptable here; the
axis exists, so use it.

**The Quoted Error Rule.** Mono appears only when the site is quoting the machine. `Error establishing a
database connection`, `502`, `wp-config.php`. The moment mono is used for a label or a heading, it stops
meaning "this is what your site said".

**The No Opacity Dimming Rule.** Secondary text uses Cold Slate, a real colour with a measured 7.82:1 on
the page. It is never produced by lowering the opacity of Warm Paper, which would make the ratio a
function of whatever sits behind it.

## Layout

A single centred column at `max-w-6xl` (72rem) with a 16px gutter on mobile and 24px from `md` up. Prose
inside it is capped by measure, not by the container: `68ch` for body runs, `42ch` to `52ch` for leads.

Vertical rhythm is two steps: `64px` section padding on mobile, `96px` from `md` up. Density is
deliberately low. One section carries one idea, a headline of up to about 25 words, and one visual or one
call to action. Whitespace is the layout; there is no compensating decoration.

Grids are asymmetric by default. The hero runs a 12-column split with the photograph bleeding off the
right edge, full-bleed under `lg` and absolutely positioned from `lg` up. The problem masonry is
`auto-rows-[9rem]` with `grid-flow-row-dense`, one column on mobile, two at `md`, three at `lg`, and a
critical tile spans two rows so the grid is never a tidy matrix.

Breakpoints are Tailwind's defaults, with the meaningful decisions at `md` (768px, where the pinned
scenes switch on, section rhythm opens up and the mobile action bar is dropped) and `lg` (1024px, where
the hero photograph becomes an absolute right-hand panel). The body carries bottom padding of
`4.75rem + env(safe-area-inset-bottom)` below `md` to clear the fixed mobile action bar, and the document
sets `scroll-padding-top: 6rem` with `scroll-padding-bottom: 6.5rem` so a keyboard tab stop never parks
under the floating nav or that bar.

### Named Rules

**The One Idea Rule.** At this density a section gets a headline, up to 25 words, and one visual or one
CTA. A section that needs two ideas is two sections.

**The Measure Over Container Rule.** Line length is set by `ch` on the text, never by narrowing the
container. The container is the page's spine and stays constant.

## Elevation & Depth

Flat, with a lit edge. Surfaces do not float. Depth is carried by tonal stepping, Lights Out to Lifted
Charcoal to Inset Charcoal, plus a 1px hairline, and then by a 1px inset highlight along the top of a
raised box, which reads as the lit edge of an object in a dark room. On a `#0C0C0E` page a conventional
drop shadow is close to invisible, so the ambient drop in each token is there to seat the box, not to
lift it.

### Shadow Vocabulary

- **Card** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05), 0 1px 2px rgb(0 0 0 / 0.6)`): the resting
  state of any raised surface.
- **Lift** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.07), 0 2px 4px rgb(0 0 0 / 0.7)`): hover, and
  only on something that is actually a link or a button.

### Named Rules

**The Lit Edge Rule.** Depth is the inset top highlight, not the drop. Adding a larger or softer drop
shadow does not add depth on this page, it adds grey.

**The Hover Earns It Rule.** Lift appears only on an element that navigates or submits. A card that is
not a link does not respond to the pointer, and a hover never changes layout, so lift sits on a wrapper
rather than on the box that holds the text.

**The One Glass Rule.** Exactly one surface in the system is translucent: the nav bar once the page has
scrolled past 8px, at 90% Lights Out with `blur(12px)`, with a `prefers-reduced-transparency` fallback to
solid. It is a scroll state, not a material, and nothing else may use `backdrop-filter`.

## Shapes

**All-soft, 14px, everywhere.** Cards, panels, buttons, inputs, selects, textareas, option rows, chips,
capture frames, progress segments, even the 2px bars of the menu icon: one radius, including on nested
elements. No pills and no sharp corners.

Three exceptions exist and are the only ones: a side that bleeds off the viewport drops its radius on
that side alone (the hero photograph is `rounded-l-[14px]` on mobile and square from `lg`, the mobile
menu sheet is full-bleed and square), a circle is allowed when the element is genuinely a circle (the
engineer-presence dot, an icon button's hit circle), and the nested photo frame pairs a 20px outer with a
12px inner.

Form language is rectangular and generous. Edges are hairlines rather than heavy strokes, borders carry
meaning (see The Two Lines Rule), and nothing is clipped into a non-rectangular silhouette.

### Named Rules

**The One Radius Rule.** 14px, or 0 because the edge is bleeding, or a true circle. There is no fourth
answer, and "the nested thing needs a slightly smaller radius" is not one.

## Components

Calm, large and unambiguous. Every target clears 44x44 with 8px between neighbours, every label comes
from one central file, primary labels never wrap, and nothing depends on hover to be understood. This is
a system built for someone reading on a phone in a bad moment.

### Buttons

- **Shape:** softly rounded (14px), minimum height 44px, horizontal padding 20px, weight 600, label never
  wraps.
- **Primary:** ember fill with the near-black on-ember label. The only high-emphasis element on screen.
- **Secondary:** Lifted Charcoal fill, Warm Paper label, 1px Control Line border.
- **Hover / Focus / Active:** primary gains Lift on hover over 200ms; both compress to `scale(0.98)` on
  press over 150ms; focus-visible is a 2px ember outline at 2px offset, the same ring used site-wide.
- **Labels** come only from `src/config/cta.ts`. There are five, one per intent, and the content check
  fails the build if any of those strings is written anywhere else.

### Cards / Containers

- **Corner Style:** 14px.
- **Background:** Lifted Charcoal, on the page's Lights Out.
- **Border:** 1px Hairline.
- **Shadow Strategy:** Card at rest; Lift on hover only when the card is a link, applied to a wrapper so
  layout never shifts.
- **Internal Padding:** 32px desktop, 24px mobile.
- Cards are fully readable without hover.

### Inputs / Fields

- **Style:** Lifted Charcoal fill, 1px Control Line border, 14px radius, minimum height 44px, padding
  10px 16px, `16px` font size (not 17px) so iOS does not zoom on focus.
- **Focus:** the 2px ember ring at 2px offset. Composite controls put
  `focus-within` on the wrapper so the whole field lights up rather than just the bare input.
- **Error:** inline under the field, in Geist at Warm Paper, with `role="alert"`, on an Inset Charcoal
  panel with a Control Line border. The only mono in an error is the string being quoted from WordPress.
- **Placeholders** are Cold Slate and never carry the label.

### Option rows (the booking flow's choice pattern)

- **Unselected:** Lifted Charcoal, 1px Control Line, 14px, padding 14px, minimum height 44px.
- **Selected:** Ember Tint fill with a 1px ember border. The border is doing the work, so selection
  survives for a visitor who cannot see the tint.

### Navigation

- **Style:** fixed 64px bar. Transparent over the hero, then the one glass surface once scrolled past
  8px, with a Hairline bottom rule and a 2px ember progress rail along the bottom bound to scroll
  progress.
- **Wordmark:** display face at `1.25rem`, weight 800, tracking `-0.04em`, `opsz` 20, with an ember rule
  that scales in from the left on hover and on focus-visible alike.
- **Mobile:** a full-screen square sheet from the top, fading in over 160ms, with the mega menu's
  categories as tap-to-expand disclosures rather than a fixed expansion.
- **Desktop:** primary CTA lives in the bar; the menu trigger is a secondary button.

### Capture frame (signature)

The system's proof device. A real 1600x1000 screenshot from `public/screens/` sits in an Inset Charcoal
bezel with 8px of padding, 14px outside and 14px inside. There is no fake browser chrome beyond a thin
top bar. The restored capture uses the identical frame at the identical size so the broken and fixed
states read as the same screen, twice. A div-built error screen or dashboard is never a substitute.

### Error string (signature)

The quoted machine voice: Geist Mono at 15px, Warm Paper on Inset Charcoal, 1px Hairline, 14px, padding
12px 16px. Always real selectable text, never an image of text.

## Do's and Don'ts

### Do:

- **Do** put the near-black `#0C0C0E` label on every ember fill. It measures 6.30:1.
- **Do** use Control Line (`rgb(255 255 255 / 0.36)`) on every boundary that identifies a control, and
  Hairline (`0.08`) only for decoration.
- **Do** set every radius to 14px, including nested boxes, and drop the radius only on an edge that
  bleeds off the viewport.
- **Do** step the `opsz` axis with the font size at every breakpoint (30, 36, 48, 60, 72).
- **Do** keep body copy at 17px / 1.6 in Geist, and cap prose measure at `68ch`.
- **Do** give every kinetic element a static, fully readable final state that `useReducedMotion()` and
  `gsap.matchMedia('(prefers-reduced-motion: reduce)')` both render immediately.
- **Do** put a visually-hidden skip link immediately before each pinned scene.
- **Do** carry depth with the inset top highlight and tonal stepping.
- **Do** tell broken versus restored with a real capture and a sentence.
- **Do** take call-to-action wording from `src/config/cta.ts` and nowhere else.

### Don't:

- **Don't** put white text on ember anywhere. It measures 3.10:1 and fails.
- **Don't** introduce a second hue, including a status set. One accent, no green, blue or amber state.
- **Don't** add a light theme or a `prefers-color-scheme` branch. This system has one designed theme and
  one contrast table.
- **Don't** use any radius other than 14px, and never a pill or a 0px corner on an edge that is not
  bleeding.
- **Don't** use `backdrop-filter` or glass anywhere except the scrolled nav bar.
- **Don't** add a gradient. The only two in the system are the hero's left-to-right legibility scrim and
  the flat ember veil inside the guarantee text mask, which is written as a gradient purely because that
  is how CSS layers a flat colour over an image.
- **Don't** add ember glows, coloured shadows, 3D effects, or a third shadow token.
- **Don't** pin more than two scenes per page, or run more than one marquee.
- **Don't** mix GSAP and Motion in one component tree, or reach for GSAP for a simple in-view reveal.
- **Don't** animate anything beyond transform and opacity, with the single exception of accordion height.
- **Don't** use a typing effect, character-split body copy, or text rendered as an image.
- **Don't** dim secondary text with opacity; use Cold Slate.
- **Don't** attach `window.addEventListener('scroll')`; scroll-linked values come from `useScroll` or
  ScrollTrigger.
- **Don't** build a fake error screen or dashboard out of divs; use a real capture.
- **Don't** ship an emoji as an icon. One set site-wide, Phosphor via `@phosphor-icons/react/ssr`.
- **Don't** let a hover change layout, or ship an invisible focus state.
