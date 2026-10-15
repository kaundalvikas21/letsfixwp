# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/letsfixwp-v4/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** letsfixwp-v4 (branch `v4-rescue-story`)
**Generated:** 2026-10-14 08:31:36, then hand-edited with the V4.0 brief overrides (see "Overrides and reasons" at the end)
**Category:** Emergency SOS & Safety
**Design Read:** high-impact SaaS landing for owners whose site just broke, kinetic storytelling language, Tailwind v4 + Bricolage Grotesque + GSAP ScrollTrigger for pinned scenes and Motion for micro-interactions.
**Design Dials:** Variance 9/10 (Bold / Asymmetric) | Motion 8/10 (Complex) | Density 3/10 (Spacious)
**Skills to load when building:** design-taste-frontend, high-end-visual-design, plus docs/section-contract.md.

---

## Global Rules

### Theme

**Dark only, locked.** This variation has one designed theme. Tokens live on `:root` with
`color-scheme: dark`, and there is no `prefers-color-scheme` block: a light-preference visitor
still gets the dark page, because the story (a site down at 2am) is the design. Contract rule 9
asks for AA in both themes; with one theme there is one table to pass, below.

### Color Palette

| Role | Value | CSS Variable |
|------|-------|--------------|
| Page background | `#0C0C0E` | `--bg` |
| Card / surface | `#141417` | `--surface` |
| Raised / inset surface | `#1C1C21` | `--surface-2` |
| Text | `#F1F0EE` | `--text` |
| Muted text | `#A3A3AD` | `--muted` |
| Hairline (decorative) | `rgb(255 255 255 / 0.08)` | `--line` |
| Control border (inputs, toggles) | `rgb(255 255 255 / 0.36)` | `--line-strong` |
| Accent fill (buttons, focus ring, active indicator) | `#FF5A36` | `--accent` |
| On accent | `#0C0C0E` | `--on-accent` |
| Accent as text | `#FF5A36` | `--accent-text` |

One accent only: **ember `#FF5A36`**, a warmer evolution of brand red (`brand.accent`, `#CC3333`).
Brand red itself does not appear in this variation, and there is no second hue: no green "fixed"
state, no blue "safety" tone.

**Measured contrast (WCAG 2.x, computed 2026-10-14):**

| Pair | Ratio | Target |
|------|-------|--------|
| `--text` on `--bg` / `--surface` / `--surface-2` | 17.16 / 16.14 / 14.90 | 4.5 ✓ |
| `--muted` on `--bg` / `--surface` / `--surface-2` | 7.82 / 7.35 / 6.79 | 4.5 ✓ |
| `#0C0C0E` on ember (button label) | 6.30 | 4.5 ✓ |
| `#FFFFFF` on ember | 3.10 | 4.5 ✗ **never ship this** |
| ember on `--bg` / `--surface` / `--surface-2` | 6.30 / 5.93 / 5.47 | 4.5 ✓ |
| `--line` over `--bg` / `--surface` / `--surface-2` | 1.19 / 1.23 / 1.26 | decorative only |
| `--line-strong` over `--bg` / `--surface` / `--surface-2` | 3.26 / 3.36 / 3.34 | 3.0 ✓ |

Rules that fall out of the table:
- Ember fills always carry near-black `--on-accent` labels. White on ember fails at 3.10:1; it is
  banned on buttons, chips, badges and any filled surface.
- Ember as text measures 6.30:1 on `--bg`, so it is legal at any size. It is still reserved for
  display words, one word or two, and the accent-text role in links. Restraint, not contrast.
- `--line` is decorative (card edges, dividers). Any boundary that identifies a control (input,
  select, checkbox, toggle track, segmented control) uses `--line-strong`.
- No status colour set. "Broken" and "restored" are told with real captures and copy, not with hue,
  which also satisfies the style's "no colour-only indicators" rule.

### Typography

- **Display:** Bricolage Grotesque via `next/font/google`, variable, `axes: ['opsz', 'wdth']`
  (`wght` is included by default). Weights 700 to 800, tracking `-0.04em`. Headlines and kinetic
  words only.
- **Body / UI:** Geist via `next/font/google`, variable. Body **17px, line-height 1.6**. Muted copy
  uses `--muted`, never reduced opacity.
- **Mono:** Geist Mono via `next/font/google`, for error strings, HTTP codes, file paths and log
  lines only (`Error establishing a database connection`, `502`, `wp-config.php`). Never for UI copy.

```tsx
// src/app/layout.tsx
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--font-bricolage" });
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
```

At display sizes set `font-variation-settings: "opsz" 72` (or the matching size) so the optical axis
does the work instead of faking it with tracking alone. Never set body copy in Bricolage Grotesque.

### Shape Lock

**All-soft, 14px, everywhere.** Cards, image containers, capture frames, buttons, chips, inputs,
selects, textareas, segmented controls: `border-radius: 14px`. No pills, no sharp corners, no other
radius anywhere, including nested elements.

### Spacing Variables

*Density 3/10, spacious.*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, min spacing between touch targets |
| `--space-md` | `24px` | Card padding on mobile, standard padding |
| `--space-lg` | `32px` | Card padding, grid gap |
| `--space-xl` | `48px` | Large gaps, gap between a scene's text and its visual |
| `--space-2xl` | `64px` | Section margins on mobile |
| `--space-3xl` | `96px` | Section margins on desktop (hero top padding still max `pt-24` per contract) |

At density 3 a section carries one idea: a headline, up to 25 words, and one visual or one CTA.
Whitespace is the layout.

### Shadows

The style brief's AVOID list rules out complex shadows, and on a `#0C0C0E` page a drop shadow is
nearly invisible anyway. Edges are carried by `--line` and by `--surface` stepping up from `--bg`.

| Token | Value |
|-------|-------|
| `--shadow-card` | `inset 0 1px 0 rgb(255 255 255 / 0.05), 0 1px 2px rgb(0 0 0 / 0.6)` |
| `--shadow-lift` (hover, links only) | `inset 0 1px 0 rgb(255 255 255 / 0.07), 0 2px 4px rgb(0 0 0 / 0.7)` |

The inset top highlight is the main device: it reads as a lit edge in a dark room. No ember glows,
no coloured shadows, no 3D effects.

### Glass

One surface only: the nav bar, once the page has scrolled past 8px. It is `--bg` at 90% with
`blur(12px)`, which is a scroll state, not a material. Nothing else is translucent.

```css
@utility nav-blur {
  background: color-mix(in srgb, var(--bg) 90%, transparent);
  backdrop-filter: blur(12px);
  @media (prefers-reduced-transparency: reduce) {
    background: var(--bg);
    backdrop-filter: none;
  }
}
```

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: var(--accent);
  color: var(--on-accent);          /* near-black label, 6.30:1. Never white. */
  min-height: 44px;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 600;
  white-space: nowrap;              /* primary label never wraps at desktop */
  transition: transform 150ms ease;
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line-strong);
  min-height: 44px;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 600;
}
```

Labels come only from `src/config/cta.ts`. Every interactive target is at least 44x44px with 8px
spacing between targets.

### Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
}
```

Cards stay fully readable without hover. Hover lift applies only to cards that are links, and sits
on a wrapper so it never shifts layout.

### Inputs

```css
.input {
  min-height: 44px;
  padding: 12px 16px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line-strong);   /* 3.34:1, control boundary */
  border-radius: 14px;
  font-size: 16px;                        /* prevents iOS zoom; body copy is 17px */
}
.input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

Errors render inline under the field, in Geist at `--text`. The error *string being quoted* from
WordPress is the only mono text.

### Capture frame

Real captures from `public/screens/` sit in a simple frame: `--surface-2` bezel, 14px outer radius,
14px inner radius on the screenshot, 1px `--line`, `--shadow-card`. No fake browser chrome beyond a
thin top bar, never a div-built dashboard or a div-built error screen. The restored capture uses the
identical frame at the identical size, so the pair reads as the same screen before and after.

### Error string

```css
.error-string {
  font-family: var(--font-geist-mono);
  font-size: 15px;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 16px;
}
```

Rendered as real selectable text, never as an image of text.

---

## Motion

Two libraries, strictly separated. **GSAP + ScrollTrigger** drives the pinned scenes.
**Motion** (`motion/react`) drives micro-interactions. Contract rule 2: they never share a component
tree, and every one of these lives in its own `'use client'` leaf.

| Use | Library | Spec | Communicates |
|-----|---------|------|--------------|
| Hero word reveal | Motion | second headline line only: real `<span>` per word in the DOM, opacity 0 to 1 and y 12 to 0 behind a clip mask, stagger 60ms, spring stiffness 100 / damping 20. The mask carries 0.16em of descender room, pulled back with a negative margin, so a tail is never clipped at rest | Hierarchy: the promise lands word by word |
| Sticky-stack of error screens | GSAP, skeleton 5.A | `start: "top top"`, `pin: true`, `pinSpacing: false`, next card's trigger scrubs the previous to scale 0.92 / opacity 0.55. The whole scene is inside `gsap.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)")`, and `useGSAP` reverts it | Story: recognition, "that is my screen" |
| Horizontal pan through the fix | GSAP, skeleton 5.B | `start: "top top"`, `pin: true`, `end: () => '+=' + distance`, `scrub: 1`, `invalidateOnRefresh: true`. The heading is the first item in the track, and a 2px ember rail at the bottom is `scaleX` 0 to 1 on the same scrubbed timeline; same `gsap.matchMedia` gate and `useGSAP` cleanup as the sticky-stack | Story: progress, the fix moves forward, and the rail says how far through it you are |
| Logo marquee (one per page) | CSS only | `@keyframes marquee` translating a duplicated track by -50%, 42s linear. Stops on hover, on focus inside it and on a visible pause button (`aria-pressed`); reduced motion renders one static wrapped row and hides both the copy and the button | Breadth: the platforms we repair |
| Zoom on the restored site | Motion, unpinned | `useScroll` on the section with `offset: ["start end", "center center"]`, `useTransform` to scale 0.7 to 1. Scale only, on a box that never changes size, so nothing below it moves; `motion-reduce:transform-none!` gives the full-width still from the first paint | State change: broken to restored |
| Quote reveal | Motion | `whileInView` with `once`, the quote's sentences then its attribution, 120ms apart, opacity and y 10 to 0, spring stiffness 100 / damping 20. A browser decides where a line wraps, so the reveal follows the unit the author controls | Hierarchy: the words arrive before the name |
| FAQ accordion | Motion | the answer's height 0 to auto with the contract spring, the chevron turning 180 degrees, `reducedMotion="user"` plus a duration-0 transition so reduced motion swaps instantly. Height is the one property animated outside transform and opacity on this page: an accordion cannot reveal an answer without it | Feedback: the question opened |
| Problem grid filter | Motion | `layout` on each tile with a spring (stiffness 100 / damping 20), enter and exit at opacity and scale 0.96, exit shortened to 150ms because one chip can remove 44 tiles at once. The grid container does not animate its own layout | State change: the grid re-forms around what was asked for |
| Magnetic final CTA | Motion | pointer offset to x/y springs (stiffness 150 / damping 15), travel clamped to 8px, returns to centre on leave. Off entirely under reduced motion and on coarse pointers, where there is no hover to answer; the coarse check is `useSyncExternalStore` so the server never ships a magnet a touch device cannot use | Feedback: the button answers the pointer |
| Closing block reveal | Motion | `whileInView` with `once`, headline then line then actions 60ms apart, opacity and y 14 to 0 over 500ms on `cubic-bezier(0.23, 1, 0.32, 1)`. Reduced motion renders the block static from the first paint | Hierarchy: the last thing the page says arrives in reading order |
| Arrow chip on the closing CTA | CSS | the chip inside the button translates 2px on hover over 150ms `ease-out`, the label does not move | Feedback: the button is a door, not a label |
| Nav backdrop | Motion | `useScroll` to `useTransform(scrollY, [0, 8], [0, 1])` on the backdrop layer's opacity. No scroll listener, no state, opacity only | State change: the page has left the hero |
| Nav progress rail | Motion | a 2px ember rule along the bottom of the bar, `scaleX` bound to `scrollYProgress`, fading in with the backdrop. Scale only; reduced motion keeps it, because it tracks the visitor's own scrolling 1:1 rather than moving on its own | Orientation: the home page runs to about 18,000px and two pinned scenes make the scrollbar lie about it |
| Wordmark underline | CSS | an ember rule, `scale-x-0` to `scale-x-100` from the left over 200ms `ease-out`, on hover and on focus-visible | Feedback: the mark answers the pointer and the keyboard alike |
| Mega menu reveal | Motion | categories 50ms apart, opacity 0 to 1 and y 24 to 0, spring stiffness 100 / damping 20. Reduced motion fades in 160ms with no stagger and no travel | Hierarchy: the eye lands on Fixes first |

**Nothing else moves.** No hover scales on cards that are not links, no decorative floaters, no
scroll cues, no `window.addEventListener('scroll')`.

**Pin budget: 2 per page.** GSAP's own guidance is one to two pinned sections per page, so the
sticky-stack and the horizontal pan are the only pinned scenes. The zoom-parallax scrubs without
pinning, which is why it fits alongside them.

**Kinetic typography is rated accessibility risk: high.** Therefore, for every kinetic element:
1. The text is real text in the DOM, split into word spans at most. Never characters for anything
   longer than a short headline, never an image of text, never `aria-hidden` on the readable copy.
2. There is a static, fully readable final state. `useReducedMotion()` (Motion) and
   `gsap.matchMedia('(prefers-reduced-motion: reduce)')` (GSAP) both render that state immediately,
   with no transition and no transform left on the element.
3. No letter-by-letter typing effect, no text that is unreadable at any point in its animation.

**Pinned scenes additionally require:**
- A skip link immediately before the scene (visually hidden until focused) that jumps to the
  section after it, so keyboard and reduced-motion users are never trapped in a scrubbed region.
  This is a skip control, not a banned scroll cue.
- `ScrollTrigger.refresh()` after fonts and images settle, and deterministic section height, or the
  pin starts at the wrong offset.
- Under reduced motion the whole scene renders as a plain stacked list of the same cards or slides,
  fully scrollable, no pin, no scrub.
- Tested on a mid-tier phone, not only desktop: pinning forces layout reflow.

Transform and opacity only. Cleanup in every effect.

---

## Imagery

Night-time real photography, warm single light source against the dark page:
- a phone lighting up with an alert on a dark desk,
- an owner's face lit by a laptop,
- an engineer's hands at a keyboard.

Plus the real error captures from `public/screens/`, each paired with a matching restored-site
capture of the same page in the same frame at the same size.

The guarantee words are the one place a photograph is a CSS background rather than `next/image`: a text
mask needs `background-image`, which `next/image` cannot provide. It is a single 77KB file, requested only
when that section comes into view.

Order of sourcing and logging follows contract rule 7: an image-generation tool first using this art
direction, then real captures, then `https://picsum.photos/seed/letsfixwp-<section>-<n>/<w>/<h>`
logged in `docs/image-todo.md` with size, aspect ratio and art direction. `next/image` with explicit
`sizes`, descriptive alt, `priority` on the hero image. No pills or labels on images. Text over
photography uses the flat `--photo-scrim` token. The one exception is the hero, where a `--bg` legibility
scrim fades left to right (`hero-scrim`): it is opaque behind every word of type, so the measured contrast
is the token table's, and it dissolves the photograph's left edge instead of leaving a hard seam.

---

## Page Pattern

**Funnel (3-step conversion)**, read as the rescue story. As built, the home page runs:
hero (the site is down) > the break (sticky-stack of error screens) > the fix (horizontal pan) >
the action (masonry of problem tiles) > proof (logo marquee and quotes) > the result (zoom on the
restored site) > the v3 sections still to be rebuilt > how to work with us (expanding rows) > final CTA. The result sits after the proof rather than before it, which is the order
the section briefs set.

The funnel is structural only. Contract rule 6 bans "Step 1 / Stage 2" labels and section-number
eyebrows, so no step is ever numbered on screen, and the funnel's own red/orange/green step colours
are dropped for the single accent. Each scene may carry one mini-CTA; the main CTA closes the page
and sits in the nav. A page's primary CTA follows its SITEMAP node intent (`primaryCtaFor`).

---

## Anti-Patterns (Do NOT Use)

- White text on ember, or any second accent or status hue
- A light theme, or a `prefers-color-scheme` override for this variation
- Any radius other than 14px; pills; sharp 0px corners
- GSAP and Motion in the same component tree; GSAP for simple in-view reveals
- More than two pinned sections per page; more than one marquee per page
- Scroll-jacking without a skip control, or a pinned scene that still pins under reduced motion
- Typing effects, character-split body copy, text rendered as an image
- Glass or `backdrop-filter` anywhere except the scrolled nav bar; ember glows, coloured or complex shadows, 3D effects
- Colour-only indicators for broken versus restored
- Gradients (including gradient text fills) anywhere except the hero legibility scrim and the flat ember veil inside the guarantee mask, which is a solid colour layered over a photograph and only written as a gradient because that is how CSS layers a colour over an image; pure `#000000` / `#FFFFFF`
- Emojis as icons. One icon set site-wide: Phosphor (`@phosphor-icons/react/ssr`, `…Icon` names)
- Layout-shifting hovers, invisible focus states, low-contrast text
- Everything in section-contract rule 6

---

## Pre-Delivery Checklist

- [ ] Contrast checked against the table above; no white on ember anywhere
- [ ] `--line-strong` on every control boundary
- [ ] Every radius is 14px
- [ ] Display uses Bricolage Grotesque 700 to 800, tracking `-0.04em`, opsz set at large sizes
- [ ] Body 17px / 1.6; mono only on error strings and codes
- [ ] Pinned scenes follow skeleton 5.A / 5.B exactly (`start: "top top"`, `pin: true`, scrub, `ctx.revert()`)
- [ ] At most 2 pinned sections and 1 marquee on the page
- [ ] Kinetic text is real DOM text with a static readable final state
- [ ] `useReducedMotion()` and `gsap.matchMedia` both collapse motion to the final state
- [ ] Skip link before each pinned scene; marquee has pause plus previous and next
- [ ] `ScrollTrigger.refresh()` after fonts and images load
- [ ] Nav backdrop has the reduced-transparency fallback
- [ ] Focus visible: 2px ember ring, 2px offset
- [ ] 375, 768, 1024, 1440 checked; no horizontal page scroll; pinned scenes checked on a real phone
- [ ] LCP under 2.5s, CLS under 0.1, INP under 200ms with the scroll scenes running

---

## Overrides and reasons

The generator returned an alert-red plus safety-blue palette on a near-white `#FFF1F2` page,
Rubik / Nunito Sans, Brutalism as the page style, 8 to 16px radii, black-based shadow depths and one
generic GSAP scroll-reveal snippet. Each was replaced by the V4.0 brief:

| Generated | Override | Reason |
|-----------|----------|--------|
| Primary `#DC2626` + accent `#2563EB` + destructive red | Single accent ember `#FF5A36` | Colour lock: one accent. Ember is the warm evolution of brand red `#CC3333`; two hues plus a destructive red would make every section look like an error state. |
| `#FFF1F2` background, light theme | Locked dark tokens from the brief | The story is a site down at night. One designed theme, so one contrast table, all measured at AA above. |
| On-accent `#FFFFFF` | `--on-accent` `#0C0C0E` | White on ember measures 3.10:1 and fails. Near-black measures 6.30:1. |
| (none) | `--line-strong` added at `rgb(255 255 255 / 0.36)` | Not in the brief. `--line` at 0.08 alpha measures 1.19 to 1.26:1, far below the 3:1 that contract rule 9 requires for control boundaries. |
| Rubik / Nunito Sans | Bricolage Grotesque display + Geist body + Geist Mono | Brief. The generator pairing is an e-commerce mood, not a rescue story. The brief named a display face and a mono face but no body face: Geist is chosen because it ships with the mono in the same family, is not Inter (contract rule 6), and stays neutral under a loud display. |
| Brutalism, "sharp corners (0px)", "no smooth transitions (instant)" | Kinetic Typography + Parallax Storytelling; all-soft 14px; motion as mapped | Its 0px corners contradict the brief's shape lock and its instant transitions contradict motion 8. Brutalism's useful parts are kept: high contrast, bold 700+ type, asymmetry at variance 9. |
| 8 / 12 / 16px radii | 14px everywhere | Brief shape lock. One radius is also the cheapest rule to hold across cards, captures, buttons and inputs. |
| `rgba(0,0,0,...)` shadow depths, four levels | Two tokens, inset top highlight plus a 1px ambient | The style's AVOID list rules out complex shadows, and drop shadows are invisible on `#0C0C0E`. A lit top edge is what reads in a dark room. |
| Generic `scrollTrigger` snippet with `end: '+=150%'` | Taste-skill skeletons 5.A and 5.B, used exactly | Contract rule 2 and the skill's own note: the common failure is a trigger that fires mid-scroll instead of pinning at the viewport top. `start: "top top"`, `pin: true`, correct scrub, `ctx.revert()` cleanup. |
| Scroll Reveal for everything | Six mapped motions, each with a stated reason; nothing else moves | Motion must be motivated. The UX lookups rate excessive motion and scroll-jacking as high-severity: "animate 1 to 2 key elements per view maximum". |
| (brief implies 3 scroll scenes) | 2 pinned (sticky-stack, horizontal pan); zoom-parallax scrubs unpinned | GSAP guidance: do not pin more than 1 to 2 sections per page; excessive pinning fights native scroll and hurts mobile. |
| Trust and Authority + Conversion pattern | Funnel (3-step conversion), mapped to break > fix > result, with no visible step labels or step colours | The brief is a story, and the funnel's section order is that story. Contract rule 6 bans numbered-step labels and the single accent replaces the red / orange / green step colouring. |
| Logo carousel (pattern note) | One CSS marquee per page with pause, previous and next, hover and focus stop, static under reduced motion | Kept as specified by the pattern and contract rules 3 and 9. |
| "Light mode: text contrast 4.5:1" checklist item | Dark-only contrast table | There is no light mode in this variation. |
| `-p fixmywp-v4` (brief) | Folder `letsfixwp-v4` | fixmywp.com is a different, trading company; CLAUDE.md forbids reusing its name, and `scripts/check-content.ts` fails the build on it. Same override as v3. |

**Open prerequisites before the first section:**
- `gsap` and `@gsap/react` are installed. `motion` is already a dependency.
- The v4 tokens, the 14px button radius and the three fonts are live in `src/app/globals.css` and
  `src/app/layout.tsx` (V4.1). The pages still render v3 sections against them until each is rebuilt.
- `public/screens/` is currently empty. It needs the real error captures plus one matching
  restored-site capture per error, at the same viewport size (`npm run capture` drives
  `scripts/capture-errors.mjs`).
- Source the three night-time photographs, or log picsum placeholders in `docs/image-todo.md` with
  size, aspect ratio and this art direction.
- No `pages/*.md` overrides exist yet for v4. Write one before building booking, guide or service
  if those pages need to depart from this file.
